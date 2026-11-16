const fs = require('fs');
const path = require('path');

function minifyCSS(cssContent) {
    return cssContent
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s*([\{\}\:\;\,>])\s*/g, '$1')
        .trim()
        .replace(/;\}/g, '}')
        .replace(/\s+/g, ' ');
}

function minifyJS(jsContent) {
    return jsContent
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|[^:])\/\/[^"\n\r]*/g, '$1')
        .replace(/\s*([\{\}\(\)\[\]\=\+\-\*\/\,\;\:\<\>\|\&])\s*/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();
}

const cssDir = path.join(__dirname, 'public', 'unoptimized', 'css');
const cssFiles = ['reset.css', 'layout.css', 'components.css'];
let combinedCSS = '';

cssFiles.forEach(file => {
    const filePath = path.join(cssDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    combinedCSS += content + '\n';
});

const progressiveLazyStyles = `
.card-image-wrap {
    position: relative;
    overflow: hidden;
    background: #e2e8f0;
}
.card-image-wrap img {
    transition: opacity 0.4s ease-in-out, filter 0.4s ease-in-out;
}
.card-image-wrap img.lazy-loading {
    filter: blur(10px);
    opacity: 0.6;
}
.card-image-wrap img.lazy-loaded {
    filter: blur(0);
    opacity: 1;
}
`;

const unminifiedCSSContent = combinedCSS + progressiveLazyStyles;
const originalCSSSize = Buffer.byteLength(unminifiedCSSContent, 'utf8');
const minifiedCSS = minifyCSS(unminifiedCSSContent);
const minifiedCSSSize = Buffer.byteLength(minifiedCSS, 'utf8');
const outCssPath = path.join(__dirname, 'public', 'optimized', 'css', 'style.min.css');
fs.writeFileSync(outCssPath, minifiedCSS);

const optimizedGalleryJS = `
var galleryItems = [
    { id: 1, title: 'Edge CDN Network Nodes', category: 'Infrastructure', file: 'gallery-1.svg', lqip: 'gallery-1-lqip.svg', desc: 'Global point-of-presence cache distribution ensuring millisecond latencies.' },
    { id: 2, title: 'Micro-Frontend Rendering', category: 'Architecture', file: 'gallery-2.svg', lqip: 'gallery-2-lqip.svg', desc: 'Isolating front-end packages and components for modular team delivery.' },
    { id: 3, title: 'Asset Minification Pipeline', category: 'Build Systems', file: 'gallery-3.svg', lqip: 'gallery-3-lqip.svg', desc: 'Compressing AST trees, stripping symbols and reducing bundle payloads.' },
    { id: 4, title: 'Service Worker Offline Cache', category: 'PWA', file: 'gallery-4.svg', lqip: 'gallery-4-lqip.svg', desc: 'Intercepting fetch queries to serve pre-cached shell assets instantaneously.' },
    { id: 5, title: 'Intersection Observer Trigger', category: 'Browser APIs', file: 'gallery-5.svg', lqip: 'gallery-5-lqip.svg', desc: 'Monitoring DOM visibility intersections to stream lazy-bound resources.' },
    { id: 6, title: 'Core Web Vitals Optimization', category: 'Performance', file: 'gallery-6.svg', lqip: 'gallery-6-lqip.svg', desc: 'Fine-tuning Largest Contentful Paint, Cumulative Layout Shift, and INP.' },
    { id: 7, title: 'Browser Cache Hierarchy', category: 'HTTP Specs', file: 'gallery-7.svg', lqip: 'gallery-7-lqip.svg', desc: 'Multi-tiered storage balancing memory cache, disk cache, and revalidation.' },
    { id: 8, title: 'HTTP/2 & HTTP/3 Multiplexing', category: 'Networking', file: 'gallery-8.svg', lqip: 'gallery-8-lqip.svg', desc: 'Simultaneous binary frame transfers across a single persistent TCP/QUIC stream.' }
];

function initLazyLoading() {
    var lazyImages = [].slice.call(document.querySelectorAll('img.progressive-lazy'));
    if ('IntersectionObserver' in window) {
        var imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var image = entry.target;
                    var fullSrc = image.getAttribute('data-src');
                    if (fullSrc) {
                        image.src = fullSrc;
                        image.onload = function() {
                            image.classList.remove('lazy-loading');
                            image.classList.add('lazy-loaded');
                        };
                    }
                    imageObserver.unobserve(image);
                }
            });
        }, { rootMargin: '50px 0px' });

        lazyImages.forEach(function(image) {
            imageObserver.observe(image);
        });
    } else {
        lazyImages.forEach(function(image) {
            image.src = image.getAttribute('data-src');
        });
    }
}

function renderOptimizedGallery(targetId) {
    var container = document.getElementById(targetId);
    if (!container) return;
    var html = '';
    galleryItems.forEach(function(item) {
        html += '<article class="card">';
        html += '  <div class="card-image-wrap">';
        html += '    <img class="progressive-lazy lazy-loading" src="images/' + item.lqip + '" data-src="images/' + item.file + '" alt="' + item.title + '" width="800" height="520" loading="lazy" decoding="async" />';
        html += '  </div>';
        html += '  <div class="card-body">';
        html += '    <span class="card-tag">' + item.category + '</span>';
        html += '    <h3 class="card-title">' + item.title + '</h3>';
        html += '    <p class="card-text">' + item.desc + '</p>';
        html += '  </div>';
        html += '</article>';
    });
    container.innerHTML = html;
    initLazyLoading();
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(function(err) {});
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renderOptimizedGallery('gallery-grid');
    registerServiceWorker();
});
`;

const jsDir = path.join(__dirname, 'public', 'unoptimized', 'js');
const utilsContent = fs.readFileSync(path.join(jsDir, 'utils.js'), 'utf8');
const unminifiedJSContent = utilsContent + '\n' + optimizedGalleryJS;
const originalJSSize = Buffer.byteLength(unminifiedJSContent, 'utf8');
const minifiedJS = minifyJS(unminifiedJSContent);
const minifiedJSSize = Buffer.byteLength(minifiedJS, 'utf8');
const outJsPath = path.join(__dirname, 'public', 'optimized', 'js', 'bundle.min.js');
fs.writeFileSync(outJsPath, minifiedJS);

const cssSavings = originalCSSSize - minifiedCSSSize;
const cssPercent = ((cssSavings / originalCSSSize) * 100).toFixed(1);

const jsSavings = originalJSSize - minifiedJSSize;
const jsPercent = ((jsSavings / originalJSSize) * 100).toFixed(1);

const totalOriginal = originalCSSSize + originalJSSize;
const totalMinified = minifiedCSSSize + minifiedJSSize;
const totalSavings = totalOriginal - totalMinified;
const totalPercent = ((totalSavings / totalOriginal) * 100).toFixed(1);

console.log('| Asset Type        | Original Size | Minified Size | Bytes Saved | Reduction |');
console.log('|-------------------|---------------|---------------|-------------|-----------|');
console.log(`| CSS (3 -> 1 file) | ${originalCSSSize.toString().padEnd(13)} | ${minifiedCSSSize.toString().padEnd(13)} | ${cssSavings.toString().padEnd(11)} | ${cssPercent}%     |`);
console.log(`| JS (3 -> 1 file)  | ${originalJSSize.toString().padEnd(13)} | ${minifiedJSSize.toString().padEnd(13)} | ${jsSavings.toString().padEnd(11)} | ${jsPercent}%     |`);
console.log(`| Total Bundle      | ${totalOriginal.toString().padEnd(13)} | ${totalMinified.toString().padEnd(13)} | ${totalSavings.toString().padEnd(11)} | ${totalPercent}%     |`);
