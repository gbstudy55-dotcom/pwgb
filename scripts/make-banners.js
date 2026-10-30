import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');
const pub = path.join(root, 'public');

console.log('Generating flawless branded banners for GB STUDY...');

const FONT_BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';

// -----------------------------------------------------------------
// 1. Build public/telegram-banner.png
// -----------------------------------------------------------------
console.log('1. Building public/telegram-banner.png...');

// Top left circular logo (126x126)
execSync(`convert "${path.join(pub, 'gb-study-logo.png')}" -resize 126x126 \\
  \\( -size 126x126 xc:none -fill white -draw "circle 63,63 63,0" \\) \\
  -alpha set -compose DstIn -composite "${path.join(pub, 'temp-logo-topleft.png')}"`);

// Center pill: SOLID blue capsule (550x106, radius 53)
execSync(`convert -size 550x106 xc:none \\
  -stroke "#5ec5ff" -strokewidth 2.5 \\
  -fill "#0084f5" \\
  -draw "roundrectangle 1,1 548,104 52,52" \\
  -font "${FONT_BOLD}" -pointsize 58 \\
  -fill white -gravity center -annotate +0-2 "GB STUDY" \\
  -background none -rotate -3.38 "${path.join(pub, 'temp-pill.png')}"`);

// Base banner edits:
execSync(`convert "${path.join(pub, 'telegram-banner-original.png')}" \\
  -fill "#030C13" -draw "rectangle 190,25 450,75" \\
  -font "${FONT_BOLD}" \\
  -pointsize 38 -fill white -annotate +195+67 "GB " \\
  -pointsize 38 -fill "#00a2ff" -annotate +268+67 "STUDY" \\
  -fill "#f7f9fa" -draw "rectangle 460,816 885,862" \\
  -font "${FONT_BOLD}" \\
  -pointsize 38 -fill "#0c1524" -annotate +480+852 "t.me/GBFreestudy" \\
  -fill "#020911" -draw "rectangle 1510,800 1660,830" \\
  -font "${FONT_BOLD}" \\
  -pointsize 32 -fill white -annotate +1515+824 "GB " \\
  -pointsize 32 -fill "#00a2ff" -annotate +1575+824 "STUDY" \\
  "${path.join(pub, 'temp-tg-base.png')}"`);

// Composite top left logo and center pill
execSync(`convert "${path.join(pub, 'temp-tg-base.png')}" \\
  "${path.join(pub, 'temp-logo-topleft.png')}" -geometry +59+19 -composite \\
  "${path.join(pub, 'temp-pill.png')}" -geometry +240+455 -composite \\
  "${path.join(pub, 'telegram-banner.png')}"`);

console.log('✓ telegram-banner.png generated.');

// -----------------------------------------------------------------
// 2. Build public/default-batch-banner.png
// -----------------------------------------------------------------
console.log('2. Building public/default-batch-banner.png...');

// Circular logo for right side: 680x680 with crisp circle mask
execSync(`convert "${path.join(pub, 'gb-study-logo.png')}" -resize 680x680 \\
  \\( -size 680x680 xc:none -fill white -draw "circle 340,340 340,0" \\) \\
  -alpha set -compose DstIn -composite "${path.join(pub, 'temp-logo-large.png')}"`);

// Edit test-banner.png:
// - Inner box starts at y=370 (gold border is at 364), ends at y=585: clear rectangle 50,370 925,585 with #ffffff
// - Draw "GB STUDY" centered inside box (baseline 525)
// - Clear old telegram text inside pill: rectangle 160,625 915,705 with #ffffff
// - Draw "Join Telegram Channel 👉 @GBFreestudy" at +175+675
// - Erase old giant PW logo: rectangle 985,30 1690,825 with #ffffff (Education line untouched!)
execSync(`convert "${path.join(pub, 'test-banner.png')}" \\
  -fill white -stroke none -draw "rectangle 50,370 925,585" \\
  -font "${FONT_BOLD}" \\
  -fill "#111827" -pointsize 135 -annotate +75+525 "GB STUDY" \\
  -fill white -stroke none -draw "rectangle 160,625 915,705" \\
  -font "${FONT_BOLD}" \\
  -fill "#111827" -pointsize 32 -annotate +175+675 "Join Telegram Channel 👉 @GBFreestudy" \\
  -fill white -stroke none -draw "rectangle 985,30 1690,825" \\
  "${path.join(pub, 'temp-batch-base.png')}"`);

// Composite circular logo centered at +980+115
execSync(`convert "${path.join(pub, 'temp-batch-base.png')}" \\
  "${path.join(pub, 'temp-logo-large.png')}" -geometry +980+115 -composite \\
  "${path.join(pub, 'default-batch-banner.png')}"`);

console.log('✓ default-batch-banner.png generated.');

// Clean up temp files
const temps = [
  'temp-logo-topleft.png',
  'temp-pill.png',
  'temp-tg-base.png',
  'temp-logo-large.png',
  'temp-batch-base.png'
];
temps.forEach(t => {
  const p = path.join(pub, t);
  if (fs.existsSync(p)) fs.unlinkSync(p);
});

console.log('All banners generated cleanly and flawlessly!');
