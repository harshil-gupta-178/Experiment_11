const fs = require('fs');
const path = require('path');

const images = [
  { name: 'hero', title: 'High-Performance Cloud Architecture', theme: ['#3b82f6', '#1d4ed8', '#1e1b4b'], icon: 'cloud' },
  { name: 'gallery-1', title: 'Edge CDN Network Nodes', theme: ['#10b981', '#047857', '#064e3b'], icon: 'server' },
  { name: 'gallery-2', title: 'Micro-Frontend Rendering', theme: ['#f59e0b', '#b45309', '#78350f'], icon: 'layout' },
  { name: 'gallery-3', title: 'Asset Minification Pipeline', theme: ['#ec4899', '#be185d', '#831843'], icon: 'cpu' },
  { name: 'gallery-4', title: 'Service Worker Offline Cache', theme: ['#8b5cf6', '#6d28d9', '#4c1d95'], icon: 'database' },
  { name: 'gallery-5', title: 'Intersection Observer Trigger', theme: ['#06b6d4', '#0e7490', '#164e63'], icon: 'eye' },
  { name: 'gallery-6', title: 'Core Web Vitals Optimization', theme: ['#84cc16', '#4d7c0f', '#365314'], icon: 'zap' },
  { name: 'gallery-7', title: 'Browser Cache Hierarchy', theme: ['#f97316', '#c2410c', '#7c2d12'], icon: 'shield' },
  { name: 'gallery-8', title: 'HTTP/2 & HTTP/3 Multiplexing', theme: ['#6366f1', '#4338ca', '#312e81'], icon: 'activity' }
];

function getIconSvg(type) {
  switch (type) {
    case 'cloud':
      return `<path d="M175 380c-55 0-100-45-100-100 0-46 32-85 75-97 10-58 60-103 121-103 48 0 89 27 109 67 15-9 33-14 52-14 50 0 91 40 91 90 0 7-1 14-3 21 34 16 57 51 57 91 0 55-45 100-100 100H175z" fill="rgba(255,255,255,0.85)"/>`;
    case 'server':
      return `<rect x="120" y="140" width="360" height="80" rx="16" fill="rgba(255,255,255,0.85)"/><circle cx="160" cy="180" r="14" fill="#047857"/><circle cx="200" cy="180" r="14" fill="#10b981"/><rect x="120" y="240" width="360" height="80" rx="16" fill="rgba(255,255,255,0.85)"/><circle cx="160" cy="280" r="14" fill="#047857"/><circle cx="200" cy="280" r="14" fill="#10b981"/><rect x="120" y="340" width="360" height="80" rx="16" fill="rgba(255,255,255,0.85)"/><circle cx="160" cy="380" r="14" fill="#047857"/><circle cx="200" cy="380" r="14" fill="#10b981"/>`;
    case 'layout':
      return `<rect x="100" y="120" width="400" height="320" rx="16" fill="rgba(255,255,255,0.85)"/><rect x="130" y="150" width="340" height="50" rx="8" fill="#b45309"/><rect x="130" y="220" width="160" height="190" rx="8" fill="#f59e0b"/><rect x="310" y="220" width="160" height="190" rx="8" fill="#d97706"/>`;
    case 'cpu':
      return `<rect x="160" y="160" width="280" height="280" rx="20" fill="rgba(255,255,255,0.85)"/><rect x="200" y="200" width="200" height="200" rx="12" fill="#be185d"/><text x="300" y="315" font-size="32" font-family="sans-serif" font-weight="bold" fill="#fff" text-anchor="middle">MINIFY</text>`;
    case 'database':
      return `<ellipse cx="300" cy="160" rx="180" ry="50" fill="rgba(255,255,255,0.9)"/><path d="M120 160v120c0 28 80 50 180 50s180-22 180-50V160" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="24"/><path d="M120 280v120c0 28 80 50 180 50s180-22 180-50V280" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="24"/>`;
    case 'eye':
      return `<path d="M100 300s80-140 200-140 200 140 200 140-80 140-200 140-200-140-200-140z" fill="rgba(255,255,255,0.85)"/><circle cx="300" cy="300" r="60" fill="#0e7490"/><circle cx="300" cy="300" r="25" fill="#fff"/>`;
    case 'zap':
      return `<polygon points="340,80 160,320 280,320 240,520 440,260 310,260" fill="rgba(255,255,255,0.9)"/>`;
    case 'shield':
      return `<path d="M300 100l180 70v130c0 120-80 200-180 230C190 500 120 420 120 300V170l180-70z" fill="rgba(255,255,255,0.85)"/><circle cx="300" cy="300" r="50" fill="#c2410c"/>`;
    default:
      return `<polyline points="100,320 220,320 270,180 330,420 380,260 420,320 500,320" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
}

function generateSvg(item, width = 800, height = 500, isLqip = false) {
  const [c1, c2, c3] = item.theme;
  const blurFilter = isLqip ? 'filter="url(#blur)"' : '';
  const filterDef = isLqip ? `<filter id="blur"><feGaussianBlur stdDeviation="15"/></filter>` : '';
  const opacity = isLqip ? '0.6' : '1.0';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="grad-${item.name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="50%" stop-color="${c2}" />
      <stop offset="100%" stop-color="${c3}" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    </pattern>
    ${filterDef}
  </defs>
  <rect width="100%" height="100%" fill="url(#grad-${item.name})" ${blurFilter}/>
  <rect width="100%" height="100%" fill="url(#grid)" opacity="${opacity}"/>
  <g transform="translate(${width/2 - 300}, ${height/2 - 270})" opacity="${opacity}">
    ${getIconSvg(item.icon)}
  </g>
  <rect x="0" y="${height - 110}" width="${width}" height="110" fill="rgba(0,0,0,0.55)" />
  <text x="32" y="${height - 62}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="700" fill="#ffffff" letter-spacing="0.5">${item.title}</text>
  <text x="32" y="${height - 30}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="rgba(255,255,255,0.75)">Resolution: ${width}x${height} | Format: SVG Vector</text>
</svg>`;
}

const unoptDir = path.join(__dirname, '..', 'public', 'unoptimized', 'images');
const optDir = path.join(__dirname, '..', 'public', 'optimized', 'images');

images.forEach(img => {
  const fullSvg = generateSvg(img, 800, 520, false);
  const lqipSvg = generateSvg(img, 120, 80, true);

  fs.writeFileSync(path.join(unoptDir, `${img.name}.svg`), fullSvg);
  fs.writeFileSync(path.join(optDir, `${img.name}.svg`), fullSvg);
  fs.writeFileSync(path.join(optDir, `${img.name}-lqip.svg`), lqipSvg);
});

console.log('Generated visual assets successfully.');
