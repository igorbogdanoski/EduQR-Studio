import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

/**
 * Creates an uncompressed/deflated raw RGBA PNG buffer from pixel data.
 */
function createPng(width, height, rgbaBuffer) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // CRC32 implementation
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function createChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4);
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression method
  ihdrData[11] = 0; // filter method
  ihdrData[12] = 0; // interlace method
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0x00 at the start of each row
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  let srcOffset = 0;
  let dstOffset = 0;
  for (let y = 0; y < height; y++) {
    scanlines[dstOffset++] = 0; // filter None
    rgbaBuffer.copy(scanlines, dstOffset, srcOffset, srcOffset + width * 4);
    dstOffset += width * 4;
    srcOffset += width * 4;
  }

  const compressedData = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

/**
 * Generate 192x192 Favicon PNG
 * Beautiful indigo-to-purple gradient with smooth rounded icon and ∑ math glyph + finder pattern
 */
function generateFaviconPng() {
  const size = 192;
  const buffer = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;

      // Rounded rectangle test (radius 48)
      const r = 44;
      const margin = 8;
      const inX = x >= margin && x < size - margin;
      const inY = y >= margin && y < size - margin;

      let inside = false;
      if (inX && inY) {
        const dx = Math.max(margin + r - x, 0, x - (size - margin - r));
        const dy = Math.max(margin + r - y, 0, y - (size - margin - r));
        if (dx * dx + dy * dy <= r * r) {
          inside = true;
        }
      }

      if (!inside) {
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0;
        continue;
      }

      // Indigo to Purple gradient
      const t = (x + y) / (size * 2);
      let red = Math.round(79 * (1 - t) + 124 * t);
      let green = Math.round(70 * (1 - t) + 58 * t);
      let blue = Math.round(229 * (1 - t) + 237 * t);

      // Top-right finder pattern (x between 120 and 165, y between 25 and 70)
      if (x >= 120 && x <= 165 && y >= 25 && y <= 70) {
        const isBorder = (x <= 126 || x >= 159 || y <= 31 || y >= 64);
        const isInner = (x >= 134 && x <= 151 && y >= 39 && y <= 56);
        if (isBorder || isInner) {
          red = 255; green = 255; blue = 255;
        }
      }

      // Mathematical Sigma shape in center-left (approximate bold serif glyph)
      // Center roughly x=75, y=105
      const rx = x - 75;
      const ry = y - 105;
      const onSigmaTop = (ry >= -35 && ry <= -24 && rx >= -35 && rx <= 25);
      const onSigmaBot = (ry >= 24 && ry <= 35 && rx >= -35 && rx <= 25);
      const onSigmaDiag1 = (ry >= -26 && ry <= 2 && Math.abs(rx - (ry + 8)) <= 8);
      const onSigmaDiag2 = (ry >= -2 && ry <= 26 && Math.abs(rx - (-ry + 8)) <= 8);

      if (onSigmaTop || onSigmaBot || onSigmaDiag1 || onSigmaDiag2) {
        red = 255;
        green = 255;
        blue = 255;
      }

      // Golden sparkle star in bottom-right (x=140, y=140)
      const starDx = Math.abs(x - 145);
      const starDy = Math.abs(y - 145);
      if ((starDx <= 2 && starDy <= 12) || (starDy <= 2 && starDx <= 12) || (starDx <= 5 && starDy <= 5)) {
        red = 251; green = 191; blue = 36; // Amber gold
      }

      buffer[idx] = red;
      buffer[idx + 1] = green;
      buffer[idx + 2] = blue;
      buffer[idx + 3] = 255;
    }
  }

  return createPng(size, size, buffer);
}

/**
 * Generate 1200x630 OpenGraph Banner PNG
 * Rich deep navy gradient background with vibrant brand badge,
 * high-contrast visual QR card on the right, and crisp typographic accents
 */
function generateOgImagePng() {
  const width = 1200;
  const height = 630;
  const buffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Dark radial/linear gradient background
      const tX = x / width;
      const tY = y / height;
      let r = Math.round(15 + 15 * (1 - tX) + 10 * tY);
      let g = Math.round(23 + 12 * tX + 8 * (1 - tY));
      let b = Math.round(42 + 45 * tX * tY + 20);

      // Glow near top-right (x=900, y=180)
      const distGlow = Math.hypot(x - 900, y - 180);
      if (distGlow < 400) {
        const glowFactor = (1 - distGlow / 400) * 0.45;
        r = Math.round(r * (1 - glowFactor) + 99 * glowFactor);
        g = Math.round(g * (1 - glowFactor) + 102 * glowFactor);
        b = Math.round(b * (1 - glowFactor) + 241 * glowFactor);
      }

      // Glow near bottom-left (x=200, y=500)
      const distGlow2 = Math.hypot(x - 200, y - 500);
      if (distGlow2 < 350) {
        const glowFactor2 = (1 - distGlow2 / 350) * 0.35;
        r = Math.round(r * (1 - glowFactor2) + 124 * glowFactor2);
        g = Math.round(g * (1 - glowFactor2) + 58 * glowFactor2);
        b = Math.round(b * (1 - glowFactor2) + 237 * glowFactor2);
      }

      // RIGHT CARD: (x from 750 to 1110, y from 90 to 540)
      const cardX = 750;
      const cardY = 90;
      const cardW = 360;
      const cardH = 450;
      const cardR = 24;

      if (x >= cardX && x < cardX + cardW && y >= cardY && y < cardY + cardH) {
        const inCardX = Math.max(cardX + cardR - x, 0, x - (cardX + cardW - cardR));
        const inCardY = Math.max(cardY + cardR - y, 0, y - (cardY + cardH - cardR));
        if (inCardX * inCardX + inCardY * inCardY <= cardR * cardR) {
          // Inside Card: Pure white with subtle top border
          r = 255; g = 255; b = 255;

          // Inner card top badge area
          if (y >= cardY + 20 && y <= cardY + 45 && x >= cardX + 24 && x <= cardX + 110) {
            r = 224; g = 231; b = 255; // Indigo-100 pill
          }

          // Card formula box (x from cardX+24 to cardX+cardW-24, y from cardY+65 to cardY+115)
          if (x >= cardX + 24 && x <= cardX + cardW - 24 && y >= cardY + 65 && y <= cardY + 115) {
            r = 241; g = 245; b = 249; // Slate-100
          }

          // Card QR area (x from cardX+55 to cardX+cardW-55, y from cardY+135 to cardY+385)
          const qrX = cardX + 55;
          const qrY = cardY + 135;
          const qrSize = 250;
          if (x >= qrX && x < qrX + qrSize && y >= qrY && y < qrY + qrSize) {
            // QR outer border
            const qrRelX = x - qrX;
            const qrRelY = y - qrY;
            r = 255; g = 255; b = 255;

            // QR Finder pattern Top-Left (20..80, 20..80)
            const inFinderTL = (qrRelX >= 20 && qrRelX <= 80 && qrRelY >= 20 && qrRelY <= 80);
            const inFinderTR = (qrRelX >= 170 && qrRelX <= 230 && qrRelY >= 20 && qrRelY <= 80);
            const inFinderBL = (qrRelX >= 20 && qrRelX <= 80 && qrRelY >= 170 && qrRelY <= 230);

            let isFinder = false;
            let isBlack = false;

            [
              [20, 20], [170, 20], [20, 170]
            ].forEach(([fx, fy]) => {
              if (qrRelX >= fx && qrRelX <= fx + 60 && qrRelY >= fy && qrRelY <= fy + 60) {
                isFinder = true;
                const rx = qrRelX - fx;
                const ry = qrRelY - fy;
                const isBorder = (rx <= 10 || rx >= 50 || ry <= 10 || ry >= 50);
                const isCenter = (rx >= 20 && rx <= 40 && ry >= 20 && ry <= 40);
                if (isBorder || isCenter) isBlack = true;
              }
            });

            if (isFinder) {
              if (isBlack) { r = 30; g = 27; b = 75; }
              else { r = 255; g = 255; b = 255; }
            } else {
              // Center Logo Circle
              const distCenter = Math.hypot(qrRelX - 125, qrRelY - 125);
              if (distCenter <= 28) {
                r = 79; g = 70; b = 229; // Indigo logo circle
                if (distCenter >= 24) { r = 255; g = 255; b = 255; } // white rim
              } else {
                // QR grid pattern (10px grid cells)
                const cellX = Math.floor(qrRelX / 12);
                const cellY = Math.floor(qrRelY / 12);
                const pseudoRandom = ((cellX * 17 + cellY * 31 + (cellX ^ cellY) * 7) % 7);
                if (pseudoRandom === 1 || pseudoRandom === 3 || pseudoRandom === 5) {
                  r = 30; g = 27; b = 75;
                }
              }
            }
          }
        }
      }

      // LEFT SIDE: Decorative pill bars
      // Subject Pills (y=470 to 510)
      if (y >= 470 && y <= 512 && x >= 80 && x <= 640) {
        // Pill 1: Math (80..220)
        if (x >= 80 && x <= 220) {
          r = Math.round(r * 0.4 + 79 * 0.6);
          g = Math.round(g * 0.4 + 70 * 0.6);
          b = Math.round(b * 0.4 + 229 * 0.6);
        }
        // Pill 2: Physics (235..355)
        if (x >= 235 && x <= 355) {
          r = Math.round(r * 0.4 + 2 * 0.6);
          g = Math.round(g * 0.4 + 132 * 0.6);
          b = Math.round(b * 0.4 + 199 * 0.6);
        }
        // Pill 3: Chemistry (370..490)
        if (x >= 370 && x <= 490) {
          r = Math.round(r * 0.4 + 225 * 0.6);
          g = Math.round(g * 0.4 + 29 * 0.6);
          b = Math.round(b * 0.4 + 72 * 0.6);
        }
        // Pill 4: Informatics (505..645)
        if (x >= 505 && x <= 645) {
          r = Math.round(r * 0.4 + 13 * 0.6);
          g = Math.round(g * 0.4 + 148 * 0.6);
          b = Math.round(b * 0.4 + 136 * 0.6);
        }
      }

      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = 255;
    }
  }

  return createPng(width, height, buffer);
}

// Generate files into public directory
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating /public/favicon.png ...');
const faviconBuf = generateFaviconPng();
fs.writeFileSync(path.join(publicDir, 'favicon.png'), faviconBuf);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), faviconBuf);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconBuf);

console.log('Generating /public/og-image.png (1200x630) ...');
const ogBuf = generateOgImagePng();
fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogBuf);

console.log('Done! Assets successfully created in /public.');
