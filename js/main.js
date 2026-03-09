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
    initVideoPreviews();
    initCinemaMode();
    forcePlayAllVideos(); // Renamed and improved from forcePlayGlobalVideo

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
// ================================
// Advanced Hero UI Visibility Logic
// ================================
function initHeroAnimations() {
    const heroVideo = document.getElementById('hero-video') || document.querySelector('.hero video');
    const textElements = document.querySelectorAll('.cinematic-title, .cinematic-subtitle, .hero-subtitle');
    const ctaElements = document.querySelectorAll('.hero-cta, .scroll-indicator');

    const isHomePage = !!document.getElementById('demo-reel');

    if (heroVideo && isHomePage) {
        let lastTime = 0;

        heroVideo.addEventListener('timeupdate', () => {
            // Only execute this timing logic if we are in LANDSCAPE
            if (window.matchMedia("(orientation: landscape)").matches) {
                const time = heroVideo.currentTime;
                const duration = heroVideo.duration;

                // 1. Loop Reset (Detect when video restarts)
                if (time < lastTime) {
                    textElements.forEach(el => el.style.opacity = '0');
                    ctaElements.forEach(el => el.style.opacity = '0');
                }
                lastTime = time;

                // 2. Start Phase (0s to 10s): Hidden
                if (time < 10) {
                    textElements.forEach(el => el.style.opacity = '0');
                    ctaElements.forEach(el => el.style.opacity = '0');
                }
                // 3. Reveal Phase (10s to 15s): Fade ALL in
                else if (time >= 10 && time < 15) {
                    textElements.forEach(el => el.style.opacity = '1');
                    ctaElements.forEach(el => el.style.opacity = '1');
                }
                // 4. Clear View Phase (15s to 20s before end): Fade OUT all
                else if (time >= 15 && time < (duration - 20)) {
                    textElements.forEach(el => el.style.opacity = '0');
                    ctaElements.forEach(el => el.style.opacity = '0');
                }
                // 5. Final Phase (-20s before end): Fade in ONLY Buttons/Scroll
                else if (time >= (duration - 20)) {
                    textElements.forEach(el => el.style.opacity = '0');
                    ctaElements.forEach(el => el.style.opacity = '1');
                }
            }
        });
    } else if (!isHomePage) {
        // Simple reveal for project pages (since they aren't looping cinematic heroes)
        [...textElements, ...ctaElements].forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });
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
// Robust Video Handling (Optimized for Large Reels)
// ============================================================

function initVideoPreviews() {
    const contentVideos = Array.from(document.querySelectorAll('video')).filter(v => {
        const isHero = v.id === 'hero-video' ||
            v.classList.contains('hero-video') ||
            v.dataset.heroVideo === "true" ||
            v.closest('.hero') ||
            v.closest('.hero-video-full-width') ||
            v.hasAttribute('data-hero-video');
        const isBg = v.classList.contains('global-bg-video') || v.hasAttribute('data-bg-video');

        // EXCLUDE autonomous videos from the lazy-pause script
        return !isHero && !isBg && !v.classList.contains('paused-loop');
    });

    contentVideos.forEach(video => {
        video.muted = true;
        video.playsInline = true;
        video.loop = true;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(video);
    });
}

function forcePlayAllVideos() {
    const videos = document.querySelectorAll('video');

    videos.forEach(v => {
        if (v.classList.contains('paused-loop')) return;

        const isHero = v.id === 'hero-video' ||
            v.classList.contains('hero-video') ||
            v.classList.contains('global-bg-video') ||
            v.hasAttribute('data-hero-video');

        // Only mute gallery/content videos
        if (!isHero) {
            v.muted = true;
            v.setAttribute('muted', '');
        }

        const applyReveal = () => {
            v.classList.add('video-ready');
            v.style.opacity = '1';
        };

        const tryPlay = () => {
            if (v.paused) {
                v.play().then(applyReveal).catch(applyReveal);
            } else {
                applyReveal();
            }
        };

        if (v.readyState >= 2) {
            tryPlay();
        } else {
            v.addEventListener('canplay', tryPlay, { once: true });
        }
    });
}

// BFCache / Navigation Back Fix: re-trigger video playback when returning to the page
window.addEventListener('pageshow', (event) => {
    forcePlayAllVideos();
});


// CRITICAL FIX: Unlock all videos on mobile after user touch
// This bypasses Safari/iPad's strict "first interaction" requirement
window.addEventListener('touchstart', function () {
    forcePlayAllVideos();
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
// ============================================================
// CRITICAL HERO & BACKGROUND INFINITE LOOP
// ============================================================
(function () {
    const criticalVideos = document.querySelectorAll('#hero-video, .hero-video, .global-bg-video, [data-hero-video="true"]');

    criticalVideos.forEach(video => {
        if (!video) return;

        // 1. Core Stability Attributes
        video.loop = true;
        video.setAttribute('loop', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('preload', 'auto');

        // 2. JS Manual Loop Fallback (Essential for long CDN files)
        video.addEventListener('ended', function () {
            console.log("Video end reached - force recycling...");
            this.currentTime = 0;
            this.play().catch(() => {
                // If unmuted playback fails on loop, mute as safety fallback
                if (!this.muted) {
                    this.muted = true;
                    this.play().catch(() => { });
                }
            });
        }, false);

        // 3. Staggered Watchdog (Check every 4s to avoid fighting)
        setInterval(() => {
            if (video.paused && video.readyState >= 2) {
                // Only force play if we aren't literally at the end (allowing ended event)
                if (video.currentTime < video.duration - 0.5) {
                    video.play().catch(() => { });
                }
            }
        }, 4000);

        // Initial Play
        const kickstart = () => {
            video.play().catch(() => {
                if (!video.muted) {
                    video.muted = true;
                    video.play().catch(() => { });
                }
            });
        };

        // 4. HARD RECYCLING for 4-minute reels:
        // Some browsers fail to fire 'ended' on large CDN files.
        // We force reset at 0.5s before the actual end.
        video.addEventListener('timeupdate', function () {
            if (this.duration > 5 && this.currentTime > (this.duration - 0.5)) {
                console.log("Pre-emptive loop reset for long video...");
                this.currentTime = 0;
                this.play().catch(() => {
                    this.muted = true;
                    this.play().catch(() => { });
                });
            }
        });

        kickstart();
    });
})();
