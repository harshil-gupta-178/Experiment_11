const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const cssPath = path.join(__dirname, 'css', 'style.min.css');
const jsPath = path.join(__dirname, 'js', 'bundle.min.js');

const cssBuffer = fs.readFileSync(cssPath);
const jsBuffer = fs.readFileSync(jsPath);

const cssGzip = zlib.gzipSync(cssBuffer);
const jsGzip = zlib.gzipSync(jsBuffer);

console.log('| Asset             | Minified Size | Gzip Size |');
console.log('|-------------------|---------------|-----------|');
console.log(`| css/style.min.css | ${(cssBuffer.length + ' B').padEnd(14)}| ${(cssGzip.length + ' B').padEnd(10)}|`);
console.log(`| js/bundle.min.js  | ${(jsBuffer.length + ' B').padEnd(14)}| ${(jsGzip.length + ' B').padEnd(10)}|`);
console.log(`| Total Bundle      | ${((cssBuffer.length + jsBuffer.length) + ' B').padEnd(14)}| ${((cssGzip.length + jsGzip.length) + ' B').padEnd(10)}|`);
