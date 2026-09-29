// Generates app icons + default OG card from public/brand/bbn-logo.png.
// Run from the project root: node scripts/generate-icons.mjs
// Re-run whenever public/brand/bbn-logo.png changes. Row bounds below match
// the current 828x749 file; adjust CROWN_BOTTOM if the artwork changes.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const LOGO = path.join(root, "public/brand/bbn-logo.png");
const CROWN_BOTTOM = 621; // first row of the "BBN" letters is 625
const BLACK = { r: 10, g: 10, b: 10, alpha: 1 }; // #0A0A0A
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

// Crown + base bar, without the "BBN" letters (rows 625-717), which are
// unreadable at favicon sizes.
async function crownOnly() {
  const cropped = await sharp(LOGO).extract({ left: 0, top: 0, width: 828, height: CROWN_BOTTOM }).png().toBuffer();
  return sharp(cropped).trim({ threshold: 1 }).png().toBuffer();
}

async function square(input, size, { pad = 0.08, bg = CLEAR } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const art = await sharp(input)
    .resize(inner, inner, { fit: "contain", background: CLEAR, kernel: "lanczos3" })
    .png()
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: art, gravity: "center" }])
    .png()
    .toBuffer();
}

// Minimal ICO writer with embedded PNG images (supported by every modern browser).
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const dir = Buffer.alloc(16 * pngs.length);
  let offset = 6 + dir.length;
  pngs.forEach(({ size, buf }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  return Buffer.concat([header, dir, ...pngs.map((p) => p.buf)]);
}

(async () => {
  const crown = await crownOnly();

  // Favicon: 16/32/48, transparent, tight padding so the crown fills the tab.
  const favs = [];
  for (const size of [16, 32, 48]) {
    favs.push({ size, buf: await square(crown, size, { pad: 0.02 }) });
  }
  fs.writeFileSync(path.join(root, "app/favicon.ico"), ico(favs));

  // app/icon.png — 512px, transparent (manifest / Android / high-DPI tabs).
  fs.writeFileSync(path.join(root, "app/icon.png"), await square(crown, 512, { pad: 0.06 }));

  // app/apple-icon.png — 180px on #0A0A0A (iOS renders transparency as black anyway).
  fs.writeFileSync(path.join(root, "app/apple-icon.png"), await square(crown, 180, { pad: 0.16, bg: BLACK }));

  // Default Open Graph card: full logo (with letters) centred on #0A0A0A with a
  // thin gold rule and the full name, 1200x630.
  const W = 1200, H = 630;
  const logo = await sharp(LOGO).resize({ height: 330 }).png().toBuffer();
  const logoMeta = await sharp(logo).metadata();
  const svg = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stop-color="#C29A4D" stop-opacity="0"/>
          <stop offset="0.5" stop-color="#C29A4D"/>
          <stop offset="1" stop-color="#C29A4D" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect x="300" y="452" width="600" height="1" fill="url(#g)"/>
      <text x="600" y="520" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
            font-size="46" font-weight="600" fill="#F1E0B4" letter-spacing="1">Brazilian Business Network</text>
      <text x="600" y="570" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
            font-size="18" font-weight="600" fill="#C29A4D" letter-spacing="5">CONECTAR · DESENVOLVER · CRIAR · TRANSFORMAR</text>
    </svg>`);
  const og = await sharp({ create: { width: W, height: H, channels: 4, background: BLACK } })
    .composite([
      { input: logo, top: 70, left: Math.round((W - logoMeta.width) / 2) },
      { input: svg, top: 0, left: 0 },
    ])
    .flatten({ background: BLACK })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(root, "public/brand/og-default.png"), og);

  console.log("ok");
})();
