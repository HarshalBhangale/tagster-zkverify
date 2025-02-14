const fs = require('fs');
const { createCanvas } = require('canvas');

function generateLogo(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#1a1b1e';
  ctx.fillRect(0, 0, size, size);

  // Text
  const text = 'T';
  ctx.fillStyle = '#4f46e5';
  ctx.font = `bold ${size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2);

  return canvas.toBuffer('image/png');
}

// Generate logos
[16, 32, 64, 192, 512].forEach(size => {
  const buffer = generateLogo(size);
  if (size <= 64) {
    fs.writeFileSync(`public/favicon-${size}.png`, buffer);
  } else {
    fs.writeFileSync(`public/logo${size}.png`, buffer);
  }
});

// Generate favicon.ico (use 16px version)
fs.copyFileSync('public/favicon-16.png', 'public/favicon.ico'); 