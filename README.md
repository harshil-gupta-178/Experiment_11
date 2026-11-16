# Experiment 11: Website Performance Optimization

> **Aim:** Optimize an existing website by implementing **HTTP and Service Worker caching**, **minification and bundling of CSS/JS**, and **progressive lazy loading of images**.

---

## Table of Contents
1. [Overview & Project Structure](#1-overview--project-structure)
2. [Optimization Technique 1: Caching](#2-optimization-technique-1-caching)
3. [Optimization Technique 2: CSS & JS Minification](#3-optimization-technique-2-css--js-minification)
4. [Optimization Technique 3: Image Lazy Loading](#4-optimization-technique-3-image-lazy-loading)
5. [Performance Comparison & Audit Metrics](#5-performance-comparison--audit-metrics)
6. [How to Run and Verify](#6-how-to-run-and-verify)
7. [Conclusion & Key Takeaways](#7-conclusion--key-takeaways)

---

## 1. Overview & Project Structure

This project contains a side-by-side comparative laboratory setup demonstrating the performance gains of modern web optimization techniques:

```
Experiment_11/
├── server.js                   # Node.js server with HTTP Cache-Control, ETag, and Gzip
├── build.js                    # Minification & bundling pipeline for CSS/JS
├── package.json                # Project manifest and scripts
├── scripts/
│   └── generate-assets.js      # Generator for vector diagrams & LQIP placeholders
├── public/
│   ├── index.html              # Interactive Performance Hub & Audit Portal
│   ├── unoptimized/            # Unoptimized Baseline Site
│   │   ├── index.html          # 6 render-blocking asset requests, eager images
│   │   ├── css/                # 3 unminified CSS files (reset, layout, components)
│   │   ├── js/                 # 3 unminified scripts without defer/async
│   │   └── images/             # Full-size eager images
│   └── optimized/              # Fully Optimized Site
│       ├── index.html          # Preloaded assets, single bundle, deferred scripts
│       ├── css/style.min.css   # Minified and bundled single stylesheet
│       ├── js/bundle.min.js    # Minified, bundled, deferred script
│       ├── sw.js               # Service Worker (Cache-First & Stale-While-Revalidate)
│       └── images/             # SVGs + Low-Quality Image Placeholders (LQIP)
└── README.md                   # Complete experiment report and documentation
```

---

## 2. Optimization Technique 1: Caching

### A. HTTP Response Headers (`server.js`)
HTTP caching instructs browsers and intermediate proxies whether, how, and for how long to store HTTP responses:

- **Static Immutable Assets (`style.min.css`, `bundle.min.js`, SVGs):**
  ```http
  Cache-Control: public, max-age=31536000, immutable
  ETag: "e5a7b8c9d012..."
  Last-Modified: Sat, 15 Nov 2026 12:00:00 GMT
  ```
  - `public`: Cacheable by browser and CDN edges.
  - `max-age=31536000`: Valid for 1 full year (31,536,000 seconds).
  - `immutable`: Signals to the browser that the asset will never change under this URL; prevents unnecessary revalidation even when the user manually refreshes the page.

- **HTML Navigation Documents (`index.html`):**
  ```http
  Cache-Control: no-cache, must-revalidate
  ETag: "9f8e7d6c5b4a..."
  ```
  - `no-cache`: Forces the browser to check with the origin server before serving the cached copy.
  - **Conditional Request (ETag / `304 Not Modified`):** The browser sends `If-None-Match: "..."`. If the hash matches, the server returns an empty body with status `304 Not Modified`, saving round-trip download time and 100% of the payload bandwidth.

### B. Service Worker Client-Side Caching (`public/optimized/sw.js`)
A Service Worker operates as a client-side proxy between the web page and the network:
1. **App Shell Pre-caching:** During the `install` phase, critical resources (`index.html`, `style.min.css`, `bundle.min.js`, and `hero.svg`) are pre-cached in the Cache Storage API (`caches.open('cloudscale-cache-v1')`).
2. **Cache-First Strategy for Assets:** Intercepts fetch events for stylesheets, scripts, and images. Checks the cache first (`caches.match(request)`). If found, it returns the resource instantaneously (0ms network latency). If not found, it downloads from the network and dynamically caches a clone.
3. **Stale-While-Revalidate for Pages:** Serves cached HTML immediately while refreshing the cache in the background for subsequent visits.

---

## 3. Optimization Technique 2: CSS & JS Minification

Minification removes unnecessary characters from source code without altering functionality:
- Eliminates code comments, formatting, and extraneous whitespace.
- Collapses redundant rules and removes trailing semicolons.
- Bundles multiple files into a single unified resource, eliminating multiple HTTP round-trips and TCP handshakes.

### Quantitative Results from `build.js`:
| Asset Type | Original Size | Minified Size | Bytes Saved | Reduction |
| :--- | :--- | :--- | :--- | :--- |
| **CSS (3 files -> 1)** | 7,220 bytes | 5,525 bytes | 1,695 bytes | **23.5%** |
| **JS (3 files -> 1)** | 5,718 bytes | 4,498 bytes | 1,220 bytes | **21.3%** |
| **Total Bundle** | **12,938 bytes** | **10,023 bytes** | **2,915 bytes** | **22.5%** |

In addition to payload reduction, the number of critical render-blocking requests was reduced from **6 requests** to **1 preloaded stylesheet** and **1 deferred script**.

---

## 4. Optimization Technique 3: Image Lazy Loading

### A. The Problem with Eager Loading
In the unoptimized version, all 9 images are requested simultaneously on page load. This congests network bandwidth, delays the rendering of critical above-the-fold content, and degrades **Largest Contentful Paint (LCP)**.

### B. Two-Pronged Optimization Strategy
1. **Critical Hero Image (Above-the-Fold):**
   - Loaded eagerly with `fetchpriority="high"` and preloaded in `<head>`:
   ```html
   <link rel="preload" href="images/hero.svg" as="image">
   <img src="images/hero.svg" alt="Hero" width="800" height="520" fetchpriority="high" />
   ```
   - Explicit `width` and `height` attributes ensure the browser reserves the correct aspect ratio, completely preventing **Cumulative Layout Shift (CLS)**.

2. **Gallery Images (Below-the-Fold):**
   - **Native Lazy Loading:** `loading="lazy"` attribute supported by modern browsers.
   - **Async Image Decoding:** `decoding="async"` prevents main thread jank when decoding SVG/JPEG bitmaps.
   - **Progressive LQIP Blur-Up (Intersection Observer API):**
     - Initial lightweight placeholder SVG (`lqip.svg`) rendered with a CSS blur filter.
     - When the image enters within 50px of the viewport, `IntersectionObserver` swaps in the high-resolution source and transitions smoothly from blur to crisp focus:
     ```javascript
     const observer = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
             if (entry.isIntersecting) {
                 const img = entry.target;
                 img.src = img.dataset.src;
                 img.onload = () => {
                     img.classList.remove('lazy-loading');
                     img.classList.add('lazy-loaded');
                 };
                 observer.unobserve(img);
             }
         });
     }, { rootMargin: '50px 0px' });
     ```

---

## 5. Performance Comparison & Audit Metrics

| Metric / Dimension | Unoptimized Baseline | Fully Optimized Site | Improvement Factor |
| :--- | :--- | :--- | :--- |
| **Initial HTTP Requests** | 16 requests | 4 initial requests | **75% fewer requests** |
| **Render-Blocking CSS** | 3 separate files | 1 preloaded bundle | **Eliminates 2 roundtrips** |
| **JS Parser Blocking** | 3 synchronous tags | 1 deferred bundle | **Zero parser pause** |
| **Initial Image Download** | 9 images (100% eager) | 1 hero image (89% deferred) | **>80% initial payload saved** |
| **Repeat Visit Latency** | Full re-download | ~0 ms (from Disk Cache / SW) | **Near-instantaneous load** |
| **Offline Capability** | Unavailable | Full offline PWA shell | **100% resilient** |

---

## 6. How to Run and Verify

### Step 1: Start the Optimization Server
In your terminal, run:
```bash
node server.js
```
*(Or use `npm start`)*

### Step 2: Open the Interactive Hub
Open your browser and navigate to:
```
http://localhost:3000/
```

### Step 3: Verify the Optimizations in Chrome DevTools
1. Press `F12` and open the **Network Tab**.
2. Visit `http://localhost:3000/unoptimized/`:
   - Notice that all 6 CSS/JS files and all 9 images download immediately.
   - Headers indicate `Cache-Control: no-store`.
3. Visit `http://localhost:3000/optimized/`:
   - Only `style.min.css`, `bundle.min.js`, and `hero.svg` load initially.
   - Slowly scroll down: observe the network tab trigger individual gallery images on-demand as they enter the screen.
   - Reload the page: observe that assets show `(from disk cache)` or `(from ServiceWorker)` with HTTP status `304 Not Modified` or `200 OK (ServiceWorker)`.

### Step 4: Rebuild Minified Bundles
To re-run the minification engine:
```bash
node build.js
```

---

## 7. Conclusion & Key Takeaways
Implementing the three pillars of web performance yields compounding benefits:
1. **Minification & Bundling:** Shrinks total file bytes and collapses multiple render-blocking network requests into a single fast stream.
2. **Caching (HTTP & Service Worker):** Completely eliminates network overhead for repeat visitors and provides offline resiliency.
3. **Lazy Loading:** Conserves bandwidth and CPU cycles by loading media strictly when needed, accelerating initial page load and improving Core Web Vitals (LCP, CLS, and INP).
