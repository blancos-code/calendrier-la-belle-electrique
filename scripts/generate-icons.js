const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const publicDir = path.join(__dirname, '..', 'public');

// Create a simple SVG with lightning bolt emoji
const createSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#09090b"/>
  <text
    x="50%"
    y="50%"
    font-size="${size * 0.6}"
    text-anchor="middle"
    dominant-baseline="central"
    fill="white">⚡</text>
</svg>
`;

async function generateIcons() {
  for (const size of sizes) {
    const svg = createSVG(size);
    const outputPath = path.join(publicDir, `icon-${size}.png`);

    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);

    console.log(`Created ${outputPath}`);
  }
}

generateIcons().catch(console.error);
