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
    // This solves the 'refresh' issue once and for all.
    setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }

        // Testimonials Safety Check
        const testimonials = document.querySelectorAll('.testimonial-card');
        testimonials.forEach((card, i) => {
            const opacity = window.getComputedStyle(card).opacity;
            if (opacity === "0" || opacity === "0.0") {
                console.warn(`Card ${i + 1} fallback reveal triggered.`);
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
    }, 2000); // Increased delay to ensure all assets are rendered
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

    // Group elements for sequence management
    const textElements = [title, subtitle, heroSubtitle].filter(el => el);
    const stickyElements = [heroCta, scrollIndicator].filter(el => el);
    const allElements = [title, subtitle, heroSubtitle, heroCta, scrollIndicator].filter(el => el);

    // Detect if we are on the homepage
    const isHomePage = !!document.getElementById('demo-reel');

    if (heroVideo) {
        const setupSequence = () => {
            let duration = heroVideo.duration || 10;
            if (!duration || isNaN(duration)) duration = 10;

            // Homepage Intro/Outro Logic
            if (isHomePage) {
                const introCutoff = 11; // Sync with demo reel intro (11s)

                const tl = gsap.timeline({ repeat: -1 });

                // 1. Initial State
                tl.set(allElements, { opacity: 0, y: 30 });

                // 2. Intro Reveal
                tl.to(allElements, {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    stagger: 0.15,
                    ease: "power4.out",
                    onStart: () => {
                        if (title) gsap.to(title, { letterSpacing: '0.2em', duration: 1.5 });
                    }
                }, introCutoff);

                // 3. Outro Fade Out (35s before the end)
                const textOutroStart = duration > 35 ? duration - 35 : duration - 5;
                tl.to(allElements, {
                    opacity: 0,
                    y: -20,
                    duration: 1.5,
                    stagger: 0.1,
                    ease: "power2.in"
                }, textOutroStart);

                // 4. Initial Hero Video Reveal (Fade in once upon page load)
                gsap.to(heroVideo, {
                    opacity: 1,
                    duration: 2.5,
                    delay: 0.5,
                    ease: "power2.inOut"
                });

                // 5. Force timeline to match exactly with video duration for the loop
                tl.set({}, {}, duration);
            } else {
                // TURBO reveal for project pages - Instant appearance
                const tl = gsap.timeline({ delay: 0 });
                tl.set(allElements, { opacity: 0, y: 15 });
                tl.to(allElements, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' });
            }
        };

        // Safety timeout: If video takes too long to load metadata, reveal anyway
        const safetyTimeout = setTimeout(() => {
            console.warn('Hero video taking too long... safety reveal triggered');
            // If timeline hasn't started, force reveal
            gsap.to(allElements, { opacity: 1, y: 0, duration: 1, stagger: 0.1 });
        }, 3000);

        // For project pages, reveal immediately. For homepage, wait for metadata to sync with demo reel.
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

    // Staggered reveal for testimonials (1-2-3 sequence)
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialGrid = document.querySelector('.testimonials-grid');

    if (testimonialGrid && testimonialCards.length > 0) {
        gsap.from(testimonialCards, {
            scrollTrigger: {
                trigger: testimonialGrid,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: '+=40', // Relative: Starts 40px below its CSS stair-step position
            opacity: 0,
            duration: 1.2,
            stagger: 0.3,
            ease: 'power3.out',
            clearProps: "all" // Crucial: Reverts control to CSS (staircase) after animation
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
            trigger: '.about', // Trigger when the entire about section is reached
            start: 'top 70%',
            toggleActions: 'play none none none',
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        clearProps: "opacity,transform" // Revert to CSS after animation
    });
}

// ================================
// Portfolio Animations with Intersection Observer
// ================================
function initPortfolioAnimations() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Use Intersection Observer for better performance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add delay based on index for stagger effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    console.log(`Found ${portfolioItems.length} portfolio items to animate.`);

    portfolioItems.forEach((item) => {
        observer.observe(item);
    });
}

// ================================
// Smooth Scroll for Anchor Links
// ================================
function initSmoothScroll() {
    // Smooth scroll for Back to Top button
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

            // Animate toggle button
            const spans = menuToggle.querySelectorAll('span');
            if (menuToggle.classList.contains('active')) {
                gsap.to(spans[0], { rotation: 45, y: 8, duration: 0.3 });
                gsap.to(spans[1], { opacity: 0, duration: 0.3 });
                gsap.to(spans[2], { rotation: -45, y: -8, duration: 0.3 });
            } else {
                gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
                gsap.to(spans[1], { opacity: 1, duration: 0.3 });
                gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
            }
        });

        // Close menu when a link is clicked
        const links = islandLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                islandLinks.classList.remove('active');

                const spans = menuToggle.querySelectorAll('span');
                gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
                gsap.to(spans[1], { opacity: 1, duration: 0.3 });
                gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
            });
        });
    }
}

// ================================
// Navbar Scroll Effect
// ================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// ================================
// Sound Toggle for Videos
// ================================
function initSoundToggle() {
    const toggleButtons = document.querySelectorAll('.sound-toggle-btn');

    toggleButtons.forEach(btn => {
        // Find associated video in the same section or parent
        const container = btn.closest('section') || btn.closest('.hero-video-full-width') || btn.parentElement;
        const video = container.querySelector('video') || document.getElementById('hero-video');

        if (!video) return;

        const unmuteIcon = btn.querySelector('.unmute-icon');
        const muteIcon = btn.querySelector('.mute-icon');
        const soundText = btn.querySelector('.sound-text');

        const updateUI = () => {
            if (video.muted) {
                btn.classList.remove('active');
                if (unmuteIcon) unmuteIcon.style.display = 'none';
                if (muteIcon) muteIcon.style.display = 'block';
                if (soundText) soundText.textContent = 'SOUND OFF';
            } else {
                btn.classList.add('active');
                if (unmuteIcon) unmuteIcon.style.display = 'block';
                if (muteIcon) muteIcon.style.display = 'none';
                if (soundText) soundText.textContent = 'SOUND ON';
            }
        };

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (video.muted) {
                video.muted = false;
                updateUI();

                // Premium effect: pulse on unmute
                if (typeof gsap !== 'undefined') {
                    gsap.to(btn, {
                        scale: 1.1,
                        duration: 0.2,
                        yoyo: true,
                        repeat: 1
                    });
                }
            } else {
                video.muted = true;
                updateUI();
            }
        });

        // Handle initial state and autoplay
        updateUI();

        // Autoplay attempt
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // If unmuted autoplay fails, ensure it's muted and try again
                video.muted = true;
                video.play();
                updateUI();
            });
        }

        // Initial Attention grabber if muted
        if (typeof gsap !== 'undefined' && video.muted) {
            gsap.to(btn, {
                opacity: 0.8,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    });
}

// ================================
// Add Parallax Effect to Hero (Optional)
// ================================
function initParallax() {
    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;

        if (hero) {
            hero.style.transform = `translateY(${parallax}px)`;
        }
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

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach((stat) => {
                    const text = stat.textContent;
                    const number = parseInt(text);
                    if (!isNaN(number)) {
                        animateCounter(stat, number);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 } // Lower threshold for better scroll detection
);

// ================================
// Magnetic Button Effect
// ================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .logo, .island-logo');

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

const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Initialize Magnetic Buttons
// Handled in DOMContentLoaded

// ================================
// Cursor Follow Effect (Optional Enhancement)
// ================================
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.1;
        cursorY += dy * 0.1;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Add hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item');
    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}

// ================================
// Page Load Animation
// ================================
window.addEventListener('load', () => {
    document.body.classList.add('loading');

    // Optional: Initialize cursor effect (uncomment to enable)
    // initCursorEffect();
});

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
        background: linear-gradient(90deg, #6366f1, #a78bfa);
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

// Initialize scroll progress
initScrollProgress();

// ================================
// Performance Optimization
// ================================
// Debounce function for scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for frequent events
function throttle(func, limit = 16) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// ================================
// 2-Second Video Preview Logic
// ================================
function initVideoPreviews() {
    // Target videos that are NOT background or hero (those already autoplay)
    const videos = document.querySelectorAll('video:not(.global-bg-video):not(.hero-video):not(#hero-video):not(.hero-video-full-width video)');
    console.log(`🎬 Found ${videos.length} project videos. Initializing 2-second preview logic...`);

    const previewVideo = async (video) => {
        // Only trigger once per session to save bandwidth
        if (video.dataset.previewed) return;

        try {
            video.muted = true;
            video.setAttribute('preload', 'auto');
            video.classList.add('loading-preview');

            // Wait until we have enough data to play
            if (video.readyState < 3) {
                await new Promise((resolve) => {
                    video.addEventListener('canplay', resolve, { once: true });
                    setTimeout(resolve, 2000); // Safety timeout
                });
            }

            const playPromise = video.play();
            if (playPromise !== undefined) {
                await playPromise;
                video.classList.remove('loading-preview');
                video.classList.add('preview-active');

                // Let it play for exactly 2 seconds
                setTimeout(() => {
                    video.pause();
                    video.dataset.previewed = "true";
                    video.classList.remove('preview-active');
                    video.classList.add('preview-ready');
                    console.log('✅ 2-second preview complete for:', video.src.split('/').pop());
                }, 2000);
            }
        } catch (err) {
            console.warn('⚠️ Preview failed for video:', err);
            video.pause();
        }
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                previewVideo(entry.target);
                // We keep observing if we want it to reset? 
                // No, user said "display their first frame", so once is enough.
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% of video is visible
        rootMargin: '50px'
    });

    videos.forEach(v => observer.observe(v));
}



console.log('🚀 Nat Gatto Portfolio - Initialized');
console.log('📱 Responsive design active');
console.log('✨ Animations loaded with GSAP');
console.log('🎯 Scroll triggers active');
console.log('🎬 2-Second Video Preview system active');
