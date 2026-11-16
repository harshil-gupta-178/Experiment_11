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
    { id: 1, title: 'Service Worker Cache', category: 'Caching', file: 'gallery-1.svg', lqip: 'gallery-1-lqip.svg', desc: 'Caching static assets for instantaneous repeat visits.' },
    { id: 2, title: 'Asset Minification', category: 'Minification', file: 'gallery-2.svg', lqip: 'gallery-2-lqip.svg', desc: 'Compressing CSS and JavaScript to reduce transfer payload.' },
    { id: 3, title: 'Lazy Loading Observer', category: 'Lazy Loading', file: 'gallery-3.svg', lqip: 'gallery-3-lqip.svg', desc: 'Loading images on demand as they enter the viewport.' }
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
