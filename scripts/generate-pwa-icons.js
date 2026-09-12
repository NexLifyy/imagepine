const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const originalSvg = fs.readFileSync(path.join(publicDir, 'logo.svg'), 'utf-8');

// Underlay so the pineapple is crisp white, outer corners are transparent
const underlay = '<rect x="56.63" y="56.63" width="886.74" height="886.74" rx="219.34" fill="#FFFFFF"/>';
const standardSvg = originalSvg.replace('<g>', `<g>${underlay}`);

// Maskable icon with #7342E6 full-bleed background and centered logo in safe zone
const maskableSvg = `
<svg viewBox="0 0 1000 1000" width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
  <style>
    .st0 { fill: #7342E6; }
  </style>
  <defs>
    <clipPath id="innerOnly">
      <rect x="200" y="58" width="600" height="840" />
    </clipPath>
  </defs>
  <rect width="1000" height="1000" fill="#7342E6"/>
  <g transform="translate(120, 120) scale(0.76)">
    <rect x="56.63" y="58" width="886.74" height="884" rx="219.34" fill="#FFFFFF" clip-path="url(#innerOnly)"/>
    <g>
      <path class="st0" d="M378.36,98.21c16.23,13.64,32.4,29.41,48.42,42.61c-10.54-28.43-20.77-56.38-30.65-84.19H328.3C344.96,70.51,361.61,84.4,378.36,98.21z"/>
      <path class="st0" d="M724.03,56.63h-10c-24.29,36.59-48.84,73.05-73.7,109.36l-29.1,41.51c-4.31,6.01-11.98,15.66-15.41,21.67c57.97-24.53,117.3-47.35,175.58-71.38c-66,56.16-130.35,114.81-196.27,170.99c71.76,18.82,124.19,47.98,160.92,106.89c10.74,17.26,19.25,35.49,25.37,54.35c22.28,69.54,21.59,170.56-1.84,239.88c-19.61,58.01-64.72,110.67-127.53,138.98c-63.5,28.63-156.62,30.91-224.89,13.12c-63.4-16.52-112.09-52.07-143.14-103.02c-51.11-83.88-51.31-206.09-21.75-295.37c18.81-56.81,65.85-110.16,126.55-136.96c19.43-8.58,35.21-13.09,56.32-17.58c-13.91-12.08-28.52-23.56-42.57-35.57c-52.5-44.65-104.4-89.83-155.69-135.52c59.18,22.32,120.21,50.04,179.22,72.9c-42.68-57.09-83.43-115.23-122.45-174.24h-7.7c-121.14,0-219.34,98.2-219.34,219.34v448.06c0,121.14,98.2,219.34,219.34,219.34h448.06c121.14,0,219.34-98.2,219.34-219.34V275.97C943.37,154.83,845.17,56.63,724.03,56.63z"/>
      <path class="st0" d="M603.36,56.63c-9.62,27.75-19.57,54.57-31.98,83.18c31.9-28.2,64.83-55.77,97.93-83.18H603.36z"/>
    </g>
  </g>
</svg>
`;

function renderPng(svg, width) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width }
  });
  return resvg.render().asPng();
}

// Generate all standard and PWA icon sizes
const icons = [
  { file: 'icon-512x512.png', svg: standardSvg, size: 512 },
  { file: 'icon-192x192.png', svg: standardSvg, size: 192 },
  { file: 'icon-maskable-512x512.png', svg: maskableSvg, size: 512 },
  { file: 'apple-touch-icon.png', svg: standardSvg, size: 180 },
  { file: 'apple-touch-icon-precomposed.png', svg: standardSvg, size: 180 },
  { file: 'favicon-32x32.png', svg: standardSvg, size: 32 },
  { file: 'favicon-16x16.png', svg: standardSvg, size: 16 },
];

icons.forEach(({ file, svg, size }) => {
  const outPath = path.join(publicDir, file);
  fs.writeFileSync(outPath, renderPng(svg, size));
  console.log(`Generated ${file} (${size}x${size})`);
});
