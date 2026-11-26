# Experiment 11: Website Performance Optimization

A minimalist web application implementing 3 core frontend performance optimizations:
1. **Caching** – HTTP Cache-Control headers, ETags, and Service Worker offline caching.
2. **Minification** – Bundled and minified CSS (`style.css`) and deferred JavaScript (`app.js`).
3. **Lazy Loading** – Progressive image loading with native `loading="lazy"` and `decoding="async"`.

---

## Project Structure

```text
Experiment_11/
├── index.html          # Web application entry point
├── sw.js               # Service Worker cache handler
├── server.js           # Local HTTP server with caching & gzip
├── package.json        # Project metadata & start script
├── README.md           # Documentation
│
├── css/
│   └── style.css       # Minified stylesheet
│
├── js/
│   └── app.js          # Deferred script bundle
│
└── images/
    ├── hero.jpg        # Hero network diagram
    ├── gallery-1.png   # Caching architecture
    ├── gallery-2.png   # Minification pipeline
    └── gallery-3.jpg   # Lazy loading diagram
```

---

## How to Run

```bash
# Install dependencies (none required, zero dependencies)
npm start
```
Visit: `http://localhost:3000`

---

## Live Demo
- **GitHub Pages:** [https://harshil-gupta-178.github.io/Experiment_11/](https://harshil-gupta-178.github.io/Experiment_11/)
