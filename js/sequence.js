/**
 * sequence.js
 * High-performance Image Sequence via Canvas & GSAP ScrollTrigger
 */

function initImageSequence(config) {
    const canvas = document.querySelector(config.canvasSelector);
    if (!canvas) return;

    const context = canvas.getContext("2d");
    const loadingElem = document.querySelector(config.loadingSelector);

    // Set internal canvas resolution to match container or original assets
    // For turnarounds, 1920x1080 is often a good base
    canvas.width = config.width || 1920;
    canvas.height = config.height || 1080;

    const frames = { frame: 1 };
    const images = [];

    // Preload all images
    let loadedCount = 0;
    for (let i = 1; i <= config.frameCount; i++) {
        const img = new Image();
        // Use the pattern provided in the config
        img.src = `${config.baseUrl}${config.prefix}${i}${config.suffix}`;
        img.onload = () => {
            loadedCount++;
            if (loadedCount === config.frameCount) {
                if (loadingElem) loadingElem.classList.add('hidden');
                render();
            }
        };
        images.push(img);
    }

    // GSAP ScrollTrigger timeline
    gsap.to(frames, {
        frame: config.frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: config.triggerSelector,
            start: "top bottom", // Starts when thumbnail enters viewport
            end: "bottom top",   // Ends when thumbnail leaves viewport
            scrub: 0.5,
        },
        onUpdate: render
    });

    function render() {
        if (images[frames.frame]) {
            const img = images[frames.frame];

            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate scale to fit/cover
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;

            context.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
    }
}
