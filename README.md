# Experiment 11: Website Performance Optimization

Minimalist web application demonstrating three core frontend performance optimizations:
1. **Caching** – HTTP Cache-Control headers with ETags and offline Service Worker caching.
2. **Minification** – Combined, minified, and deferred CSS and JavaScript bundles.
3. **Lazy Loading** – Progressive image loading on demand via `loading="lazy"` and `decoding="async"`.

---

## Project Structure

```text
Experiment_11/
├── index.html          # Entry point
├── sw.js               # Service Worker cache handler
├── server.js           # Lightweight HTTP server with ETag & gzip
├── build.js            # Bundle & compression inspection
├── package.json        # Project metadata
├── README.md           # Documentation
├── css/
│   └── style.min.css   # Minified single stylesheet
├── js/
│   └── bundle.min.js   # Deferred JavaScript bundle
└── images/
    ├── hero.jpg        # Hero network diagram
    ├── gallery-1.png   # Caching architecture
    ├── gallery-2.png   # Minification pipeline
    └── gallery-3.jpg   # Lazy loading observer
```

---

## Quick Start

```bash
# Start local server
npm start

# Run build bundle inspection
npm run build
```

---

## Live Deployment
- **GitHub Pages:** [https://harshil-gupta-178.github.io/Experiment_11/](https://harshil-gupta-178.github.io/Experiment_11/)
