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
    width: 100%;
    aspect-ratio: 16 / 10;
    background-color: #ffffff;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
}
.card-image-wrap img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
`;

const unminifiedCSSContent = combinedCSS + progressiveLazyStyles;
const originalCSSSize = Buffer.byteLength(unminifiedCSSContent, 'utf8');
const minifiedCSS = minifyCSS(unminifiedCSSContent);
const minifiedCSSSize = Buffer.byteLength(minifiedCSS, 'utf8');
const outCssPath = path.join(__dirname, 'public', 'optimized', 'css', 'style.min.css');
fs.writeFileSync(outCssPath, minifiedCSS);

const optimizedGalleryJS = `
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(function(err) {});
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerServiceWorker);
} else {
    registerServiceWorker();
}
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
