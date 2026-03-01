// Register ScrollTrigger plugin if GSAP is available
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    console.log('✅ GSAP, ScrollTrigger & ScrollToPlugin registered');
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
    initNavbarScroll();
    initMagneticButtons();
    initVideoPreviews();
    forcePlayGlobalVideo();

    // 2. Initialize GSAP Animations
    if (typeof gsap !== 'undefined') {
        initHeroAnimations();
        initScrollAnimations();
        initPortfolioAnimations();
        initSoundToggle();
    } else {
        console.warn('⚠️ GSAP not detected. Forcing manual visibility...');
        document.body.classList.remove('loading');
    }

    // 3. The "Ultimate Fallback": If anything is still invisible after 2 seconds, force its appearance.
    setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }

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
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // Find the video even if ID is missing (flexibility for all pages)
    const heroVideo = document.getElementById('hero-video') ||
        document.querySelector('.hero video') ||
        document.querySelector('.hero-video-full-width video');

    const allElements = [title, subtitle, heroSubtitle, heroCta, scrollIndicator].filter(el => el);
    const isMobile = window.innerWidth <= 768;
    const isHomePage = !!document.getElementById('demo-reel');

    if (heroVideo) {
        const setupSequence = () => {
            let duration = heroVideo.duration || 10;
            if (!duration || isNaN(duration)) duration = 10;

            if (isHomePage) {
                const introWait = isMobile ? 3 : 11; // 3s for mobile, 11s sync for desktop
                const tl = gsap.timeline({ repeat: -1 });

                // 1. Initial State
                tl.set(allElements, { opacity: 0, y: isMobile ? 15 : 30 });

                // 2. Reveal
                tl.to(allElements, {
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
                tl.to(allElements, {
                    opacity: 0,
                    y: -20,
                    duration: 1.5,
                    stagger: 0.1,
                    ease: "power2.in"
                }, introWait + textPersistence);

                // 4. Video Reveal (Persistent)
                gsap.to(heroVideo, {
                    opacity: 1,
                    duration: 2,
                    delay: 0.2,
                    ease: "power2.inOut"
                });

                tl.set({}, {}, duration); // Match loop to video length
            } else {
                // Project page: Instant reveal
                const tl = gsap.timeline();
                tl.set(allElements, { opacity: 0, y: 15 });
                tl.to(allElements, { opacity: 1, y: 0, duration: 0.8 / (isMobile ? 2 : 1), stagger: 0.1, ease: 'power2.out' });
            }
        };

        const safetyTimeoutValue = isMobile ? 2000 : 5000;
        const safetyTimeout = setTimeout(() => {
            console.warn('Hero safety reveal triggered');
            gsap.to(allElements, { opacity: 1, y: 0, duration: 1, stagger: 0.1 });
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
// Navbar Scroll Effect
// ================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'var(--glass-bg)';
        }
    });
}

// ================================
// Sound Toggle for Videos
// ================================
function initSoundToggle() {
    const toggleButtons = document.querySelectorAll('.sound-toggle-btn');

    toggleButtons.forEach(btn => {
        const container = btn.closest('section') || btn.closest('.hero-video-full-width') || btn.parentElement;
        const video = container.querySelector('video') || document.getElementById('hero-video');

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
    const buttons = document.querySelectorAll('.btn-primary, .btn-glass, .logo, .island-logo');

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

// ================================
// Scroll Progress Indicator
// ================================
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        background: linear-gradient(90deg, #FFB347, #ff7b00);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

initScrollProgress();

// ================================
// 2-Second Video Preview Logic
// ================================
function initVideoPreviews() {
    const videos = document.querySelectorAll('video:not(.global-bg-video):not(.hero-video):not(#hero-video):not(.hero-video-full-width video)');

    const previewVideo = async (video) => {
        if (video.dataset.previewed) return;

        try {
            video.muted = true;
            video.setAttribute("playsinline", "");
            video.setAttribute("autoplay", "autoplay");
            video.setAttribute('preload', 'auto');

            const playPromise = video.play();
            if (playPromise !== undefined) {
                await playPromise;
                setTimeout(() => {
                    video.pause();
                    video.dataset.previewed = "true";
                }, 2000);
            }
        } catch (err) {
            video.pause();
        }
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                previewVideo(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    videos.forEach(v => observer.observe(v));
}

function forcePlayGlobalVideo() {
    const bgVideo = document.querySelector('.global-bg-video');
    if (bgVideo) {
        bgVideo.muted = true;
        bgVideo.play().catch(e => console.log('Global bg play caught:', e));
    }
}

console.log('🚀 Nat Gatto Portfolio - Optimized & Responsive');
