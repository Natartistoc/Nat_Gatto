# Nat Gatto Portfolio

A pixel-perfect recreation of the evekayser.com.br portfolio website with modern animations and interactions, customized for Nat Gatto.

## Features

✨ **Modern Design**
- Clean, minimalist portfolio layout
- Responsive design for all devices
- Smooth scroll animations using GSAP
- Interactive hover effects

🎯 **Sections**
- Hero section with animated typography
- About section with statistics
- Services showcase (UI Design, Webflow Development, Mentorship)
- Portfolio grid with 24 projects
- Partners section
- Contact footer

🚀 **Technologies**
- HTML5 (Semantic markup)
- CSS3 (Custom properties, Grid, Flexbox)
- JavaScript (ES6+)
- GSAP (GreenSock Animation Platform)
- Intersection Observer API

## Getting Started

1. **Open the website:**
   Simply open `index.html` in your browser

2. **Or use a local server:**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```

3. **Navigate to:**
   ```
   http://localhost:8000
   ```

## Project Structure

```
evekayser-clone/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Complete styling and animations
├── js/
│   └── main.js         # JavaScript animations and interactions
├── images/             # Image assets (placeholder gradients used)
└── README.md           # This file
```

## Key Animations

- **Hero Section**: Text slide-up animations with stagger
- **Portfolio Grid**: Scroll-triggered fade-ins with intersection observer
- **Service Cards**: Hover lift effects with gradient borders
- **Stats Counter**: Animated number counting on scroll
- **Smooth Scroll**: Custom smooth scrolling for navigation
- **Scroll Progress**: Top progress bar indicator

## Customization

### Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --color-accent: #6366f1;
    --color-primary: #000000;
    /* ... more variables */
}
```

### Content
Update content directly in `index.html`

### Animations
Modify timing and effects in `js/main.js`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized scroll animations with GSAP
- Intersection Observer for efficient viewport detection
- Debounced/throttled scroll handlers
- Minimal external dependencies

## Credits

Original website design: **Eve Kayser** (evekayser.com.br)
Clone recreation: Educational purposes

---

Made with ❤️ using modern web technologies
