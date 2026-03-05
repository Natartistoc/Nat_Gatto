// Register ScrollTrigger plugin if GSAP is available
if (typeof gsap !== 'undefined') {
    const plugins = [];
    if (typeof ScrollTrigger !== 'undefined') plugins.push(ScrollTrigger);
    if (typeof ScrollToPlugin !== 'undefined') plugins.push(ScrollToPlugin);
    if (plugins.length > 0) gsap.registerPlugin(...plugins);
    console.log('✅ GSAP Plugins registered:', plugins.map(p => p.name || 'plugin'));
} else {
    console.warn('⚠️ GSAP not detected. Some animations will be disabled.');
}

// ================================
// Initialize on DOM Load
// ================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing animations...');

    // 1. Initialize Core Components (Non-GSAP dependent or simple GSAP)
    initSmoothScroll();
    initMobileMenu();
    initMagneticButtons();
    initVideoSystem();
    initCinemaMode();

    // 2. Initialize GSAP Animations
    if (typeof gsap !== 'undefined') {
        initHeroAnimations();
        initScrollAnimations();
        initPortfolioAnimations();
        initSoundToggle();
    } else {
        console.warn('⚠️ GSAP not detected. Forcing manual visibility...');
        document.body.classList.remove('loading');
        // Manual visibility for hero video if no GSAP
        const hv = document.getElementById('hero-video') || document.querySelector('.hero video');
        if (hv) hv.style.opacity = '1';
    }

    // 3. The "Ultimate Fallback": If anything is still invisible after 2 seconds, force its appearance.
    setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }

        // Final Video & Loading Safety Check
        document.querySelectorAll('video').forEach(v => {
            v.style.opacity = '1';
            v.style.visibility = 'visible';
            if (v.paused) v.play().catch(() => v.currentTime = 0.1);
        });

        // Testimonials Safety Check
        const testimonials = document.querySelectorAll('.testimonial-card');
        testimonials.forEach((card, i) => {
            const opacity = window.getComputedStyle(card).opacity;
            if (opacity === "0" || opacity === "0.0") {
                gsap.to(card, {
                    opacity: i === 0 ? 1 : i === 1 ? 0.85 : 0.75,
                    y: 0,
                    duration: 1,
                    delay: i * 0.1
                });
            }
        });

        // Final Loading Class removal
        document.body.classList.remove('loading');
    }, 2000);
});

// ================================
// Hero Reveal Animations
// ================================
function initHeroAnimations() {
    const title = document.querySelector('.cinematic-title');
    const subtitle = document.querySelector('.cinematic-subtitle');
    const heroSubtitle = document.querySelector('.hero-subtitle');

    const heroCta = document.querySelector('.hero-cta');
    const allCinemaBtns = Array.from(document.querySelectorAll('.cinema-mode-btn'));
    const cinemaBtn = allCinemaBtns[0]; // For legacy single-button logic
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const heroVideo = document.getElementById('hero-video') ||
        document.querySelector('.hero video') ||
        document.querySelector('.hero-video-full-width video');

    const allElements = [title, subtitle, heroSubtitle, heroCta, ...allCinemaBtns, scrollIndicator].filter(el => el);
    const isMobile = window.innerWidth <= 1024;
    const isHomePage = !!document.getElementById('demo-reel');

    if (heroVideo) {
        const setupSequence = () => {
            let duration = heroVideo.duration || 10;
            if (!duration || isNaN(duration)) duration = 10;

            const revealHero = () => {
                if (heroVideo) {
                    heroVideo.play().catch(() => { });
                }
            };

            if (isHomePage) {
                // Ensure video starts revealing immediately on homepage
                revealHero();

                if (isMobile) {
                    gsap.set(allElements, { opacity: 1, y: 0, visibility: 'visible', pointerEvents: 'auto' });
                    return;
                }

                const introWait = 11;
                const timeline = gsap.timeline({ repeat: -1 });

                // 1. Initial State
                timeline.set(allElements, { opacity: 0, y: isMobile ? 15 : 30 });

                // 2. Reveal
                timeline.to(allElements, {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    stagger: 0.15,
                    ease: "power4.out",
                    onStart: () => {
                        if (title) gsap.to(title, { letterSpacing: isMobile ? '0.1em' : '0.2em', duration: 1.5 });
                    }
                }, introWait);

                // 3. Outro
                const textPersistence = isMobile ? 12 : 6;
                timeline.to(allElements, {
                    opacity: 0,
                    y: -20,
                    duration: 1.5,
                    stagger: 0.1,
                    ease: "power2.in"
                }, introWait + textPersistence);
            } else {
                // Project page: Instant reveal
                revealHero();

                const projectTl = gsap.timeline();
                // Ensure all elements, including all cinema buttons, are revealed
                projectTl.set(allElements, { opacity: 0, y: 15, visibility: 'visible' });
                projectTl.to(allElements, { opacity: 1, y: 0, duration: 0.8 / (isMobile ? 2 : 1), stagger: 0.1, ease: 'power2.out' });

                // Force all cinema buttons to be active and visible on project pages
                allCinemaBtns.forEach(btn => {
                    gsap.set(btn, { opacity: 1, visibility: 'visible', pointerEvents: 'auto' });
                });
            }
        };

        const safetyTimeoutValue = isMobile ? 3000 : 5000;
        const safetyTimeout = setTimeout(() => {
            gsap.to(allElements, { opacity: 1, y: 0, duration: 1, stagger: 0.1 });
            if (heroVideo) {
                heroVideo.play().catch(() => { });
            }
        }, safetyTimeoutValue);

        if (heroVideo.readyState >= 1 || !isHomePage) {
            clearTimeout(safetyTimeout);
            setupSequence();
        } else {
            heroVideo.addEventListener('loadedmetadata', () => {
                clearTimeout(safetyTimeout);
                setupSequence();
            });
        }
    }
}

// ================================
// Scroll Animations
// ================================
function initScrollAnimations() {
    // Animate section titles with premium stagger
    gsap.utils.toArray('.section-title').forEach((title) => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power4.out',
        });
    });

    // Individually reveal client logos
    document.querySelectorAll('.client-logo').forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            clearProps: "all"
        });
    });

    // Staggered reveal for testimonials
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialGrid = document.querySelector('.testimonials-grid');

    if (testimonialGrid && testimonialCards.length > 0) {
        gsap.from(testimonialCards, {
            scrollTrigger: {
                trigger: testimonialGrid,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: '+=40',
            opacity: 0,
            duration: 1.2,
            stagger: 0.3,
            ease: 'power3.out',
            clearProps: "all"
        });
    }

    // Animate about section
    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 75%',
            toggleActions: 'play none none none',
        },
        x: -50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
    });

    gsap.from('.about-stats .stat-item', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%',
            toggleActions: 'play none none none',
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        clearProps: "opacity,transform"
    });

    // Hide sound icon for specific sections on mobile/tablet
    if (window.innerWidth <= 1024) {
        const soundArea = document.querySelector('.sound-control-container');
        const sectionsToHideSound = ['#clients', '#about', '#contact'].filter(id => document.querySelector(id));

        if (soundArea && sectionsToHideSound.length > 0) {
            sectionsToHideSound.forEach(id => {
                ScrollTrigger.create({
                    trigger: id,
                    start: "top 40%",
                    end: "bottom 10%",
                    onEnter: () => gsap.to(soundArea, { opacity: 0, scale: 0.8, pointerEvents: 'none', duration: 0.4 }),
                    onLeaveBack: () => gsap.to(soundArea, { opacity: 1, scale: 1, pointerEvents: 'auto', duration: 0.3 }),
                    onEnterBack: () => gsap.to(soundArea, { opacity: 0, scale: 0.8, pointerEvents: 'none', duration: 0.4 }),
                    onLeave: () => gsap.to(soundArea, { opacity: 1, scale: 1, pointerEvents: 'auto', duration: 0.3 }),
                });
            });
        }
    }
}

// ================================
// Portfolio Animations with Intersection Observer
// ================================
function initPortfolioAnimations() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    portfolioItems.forEach((item) => {
        observer.observe(item);
    });
}

// ================================
// Smooth Scroll for Anchor Links
// ================================
function initSmoothScroll() {
    document.querySelectorAll('.back-to-top-btn, a[href="#top"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if (typeof gsap !== 'undefined') {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: 0,
                    ease: "power4.inOut"
                });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

// ================================
// Mobile Menu Toggle
// ================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const islandLinks = document.querySelector('.island-links');

    if (menuToggle && islandLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            islandLinks.classList.toggle('active');

            // Note: Hamburger animation handled in CSS via .active state
        });

        const links = islandLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                islandLinks.classList.remove('active');
            });
        });
    }
}



// ================================
// Sound Toggle for Videos
// ================================
function initSoundToggle() {
    const toggleButtons = document.querySelectorAll('.sound-toggle-btn');

    toggleButtons.forEach(btn => {
        // Find the video: 
        // 1. In the same section
        // 2. The #hero-video
        // 3. Any video in .hero or .hero-video-full-width
        const container = btn.closest('section') || btn.closest('.hero-video-full-width') || btn.closest('.navbar') || btn.parentElement;
        let video = container.querySelector('video') || document.getElementById('hero-video');

        if (!video) {
            // Fallback for project pages where button is in navbar
            video = document.querySelector('.hero-video-full-width video') ||
                document.querySelector('.media-fullscreen video') ||
                document.querySelector('.project-hero video');
        }

        if (!video) return;

        const unmuteIcon = btn.querySelector('.unmute-icon');
        const muteIcon = btn.querySelector('.mute-icon');

        const updateUI = () => {
            if (video.muted) {
                btn.classList.remove('active');
                if (unmuteIcon) unmuteIcon.style.display = 'none';
                if (muteIcon) muteIcon.style.display = 'block';
            } else {
                btn.classList.add('active');
                if (unmuteIcon) unmuteIcon.style.display = 'block';
                if (muteIcon) muteIcon.style.display = 'none';
            }
        };

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            video.muted = !video.muted;
            updateUI();

            if (!video.muted && typeof gsap !== 'undefined') {
                gsap.to(btn, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
            }
        });

        updateUI();
    });
}

// ================================
// Counter Animation for Stats
// ================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

const statsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach((stat) => {
                    const number = parseInt(stat.textContent);
                    if (!isNaN(number)) animateCounter(stat, number);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 }
);

const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ================================
// Magnetic Button Effect
// ================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-glass, .logo, .island-logo, .cinema-mode-btn');

    buttons.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.6,
                ease: 'power2.out',
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)',
            });
        });
    });
}



// ============================================================
// Enhanced Video Playback System (Tablet & Mobile Optimized)
// ============================================================

function initVideoSystem() {
    const allVideos = document.querySelectorAll('video');

    // 1. Attribute Injection & Initial Prep
    allVideos.forEach(v => {
        v.setAttribute('playsinline', '');
        v.setAttribute('webkit-playsinline', '');
        v.setAttribute('preload', 'auto');
        v.muted = true;
        v.setAttribute('muted', '');

        // Background & Hero specific prep
        const isCritical = v.classList.contains('global-bg-video') ||
            v.id === 'hero-video' ||
            v.classList.contains('hero-video') ||
            v.dataset.heroVideo === "true" ||
            v.closest('.hero-video-full-width');

        if (isCritical) {
            v.loop = true;
            v.setAttribute('loop', '');
            v.dataset.isCritical = "true";
        }
    });

    // 2. The Super Watchdog (Runs every 2s)
    const runWatchdog = () => {
        allVideos.forEach(v => {
            const isCritical = v.dataset.isCritical === "true";

            // Handle critical videos (Always Play, Loop Forever)
            if (isCritical) {
                if (v.paused || v.ended) {
                    v.play().catch(() => { });
                }

                // Stall Detector: If time isn't advancing but it should be playing
                if (!v.paused && v.readyState >= 2) {
                    const lastTime = parseFloat(v.dataset.lastTime || -1);
                    if (v.currentTime === lastTime && v.currentTime > 0) {
                        console.warn('Video stall detected, reloading:', v.src);
                        v.load();
                        v.play().catch(() => { });
                    }
                    v.dataset.lastTime = v.currentTime;
                }

                // Safety reveal
                v.style.opacity = '1';
                v.classList.add('video-ready');
            }
        });
    };

    setInterval(runWatchdog, 2000);

    // 3. Content Preview Logic (Pause after 4s)
    const contentVideos = Array.from(allVideos).filter(v => v.dataset.isCritical !== "true");

    contentVideos.forEach(video => {
        // Wrap video to add the dynamic Play Overlay if not already present
        if (!video.parentElement.classList.contains('video-stopped-preview')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'video-stopped-preview';
            video.parentNode.insertBefore(wrapper, video);
            wrapper.appendChild(video);

            const overlay = document.createElement('div');
            overlay.className = 'video-player-overlay';
            wrapper.appendChild(overlay);

            wrapper.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    wrapper.classList.remove('is-paused');
                } else {
                    video.pause();
                    wrapper.classList.add('is-paused');
                }
            });
        }

        // Smart loading on scroll: Start preview then pause to save data
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && video.dataset.wasPreviewed !== "true") {
                    video.play().then(() => {
                        setTimeout(() => {
                            if (!video.paused && video.dataset.wasPreviewed !== "true") {
                                video.pause();
                                video.parentElement.classList.add('is-paused');
                                video.dataset.wasPreviewed = "true";
                            }
                        }, 4000);
                    }).catch(() => {
                        video.currentTime = 0.1;
                        video.parentElement.classList.add('is-paused');
                    });
                    observer.unobserve(video);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(video);
    });
}

// Global Kickstarters
window.addEventListener('DOMContentLoaded', initVideoSystem);
window.addEventListener('pageshow', initVideoSystem);
window.addEventListener('touchstart', () => {
    document.querySelectorAll('video').forEach(v => v.play().catch(() => { }));
}, { once: true });
window.addEventListener('scroll', () => {
    // Secondary kickstart if first one fails
    const critical = document.querySelector('video[data-is-critical="true"]');
    if (critical && critical.paused) critical.play().catch(() => { });
}, { once: true });


// ================================
// Cinema Mode Fullscreen Toggle
// ================================
function initCinemaMode() {
    const cinemaButtons = document.querySelectorAll('.cinema-mode-btn');

    cinemaButtons.forEach(btn => {
        // Find the corresponding video
        // 1. Check ID specified in data attribute if exists (future proofing)
        // 2. Look in the same section/container
        // 3. Look for #hero-video
        // 4. Look for global hero video classes
        const container = btn.closest('section') ||
            btn.closest('.hero-video-full-width') ||
            btn.closest('.media-fullscreen') ||
            btn.closest('.project-hero-featured-image') ||
            btn.parentElement;

        const video = container.querySelector('video') ||
            document.getElementById('hero-video') ||
            document.querySelector('.hero-video-full-width video') ||
            document.querySelector('.media-fullscreen video');

        if (!video) return;

        btn.addEventListener('click', () => {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                /* Safari */
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                /* IE11 */
                video.msRequestFullscreen();
            }
        });

        // Toggle pointer events based on visibility
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === "style") {
                    const opacity = parseFloat(window.getComputedStyle(btn).opacity);
                    btn.style.pointerEvents = opacity > 0.1 ? "auto" : "none";
                }
            });
        });

        observer.observe(btn, { attributes: true });
    });
}

console.log('🚀 Nat Gatto Portfolio - Optimized & Responsive');
