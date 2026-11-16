const fs = require('fs');
const path = require('path');

const uploadsDir = 'C:/Users/ASUS/.gemini/antigravity/brain/8f5777a1-f2be-4ee3-bbe1-07ce441774f4/.user_uploaded';

const heroBuffer = fs.readFileSync(path.join(uploadsDir, 'media_1794814331410_67298dfa.jpg'));
const g1Buffer = fs.readFileSync(path.join(uploadsDir, 'media_1794814507220_a43b5d83.png'));
const g2Buffer = fs.readFileSync(path.join(uploadsDir, 'media_1794814547927_605d00dd.png'));
const g3Buffer = fs.readFileSync(path.join(uploadsDir, 'media_1794814628393_c9ddd128.jpg'));

function makeSvg(buffer, mime, width, height) {
    const b64 = buffer.toString('base64');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <image href="data:${mime};base64,${b64}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
}

const heroSvg = makeSvg(heroBuffer, 'image/jpeg', 612, 344);
const g1Svg = makeSvg(g1Buffer, 'image/png', 715, 162);
const g2Svg = makeSvg(g2Buffer, 'image/png', 860, 523);
const g3Svg = makeSvg(g3Buffer, 'image/jpeg', 500, 286);

const targetDirs = [
    path.join(__dirname, '../public/optimized/images'),
    path.join(__dirname, '../public/unoptimized/images'),
    path.join(__dirname, '../docs/images'),
    path.join(__dirname, '../images')
];

for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, 'hero.jpg'), heroBuffer);
    fs.writeFileSync(path.join(dir, 'hero.svg'), heroSvg);
    fs.writeFileSync(path.join(dir, 'hero-lqip.svg'), heroSvg);

    fs.writeFileSync(path.join(dir, 'gallery-1.png'), g1Buffer);
    fs.writeFileSync(path.join(dir, 'gallery-1.svg'), g1Svg);
    fs.writeFileSync(path.join(dir, 'gallery-1-lqip.svg'), g1Svg);

    fs.writeFileSync(path.join(dir, 'gallery-2.png'), g2Buffer);
    fs.writeFileSync(path.join(dir, 'gallery-2.svg'), g2Svg);
    fs.writeFileSync(path.join(dir, 'gallery-2-lqip.svg'), g2Svg);

    fs.writeFileSync(path.join(dir, 'gallery-3.jpg'), g3Buffer);
    fs.writeFileSync(path.join(dir, 'gallery-3.svg'), g3Svg);
    fs.writeFileSync(path.join(dir, 'gallery-3-lqip.svg'), g3Svg);
}

console.log('Successfully updated all images and SVG wrappers across all directories.');
