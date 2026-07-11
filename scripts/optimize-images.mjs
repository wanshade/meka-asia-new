/**
 * Generate responsive AVIF + WebP variants for heavy scroll-path images.
 * Output: public/media/<name>-<w>.{avif,webp}
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const outDir = path.join(publicDir, "media");

const WIDTHS = [480, 768, 1280, 1920];

const SOURCES = [
  "green-asia-garden-home.jpg",
  "polinesia-gable-home.jpg",
  "poolside-afternoon.png",
  "morning-at-home-living-maldives.jpeg",
  "melanesia-private-facade.jpeg",
  "lavida-show-unit.jpeg",
  "living-room-maldives.jpeg",
  "living-asia-entrance-visit.jpeg",
  "living-asia-maldives-street.jpg",
  "jaipur.jpg",
  "living-asia-entrance.jpg",
  "consultation-pool.jpg",
  "future-secured.png",
  "entrance-living-asia-poster.jpg",
  "Green Thamarin.jpeg",
];

function baseName(file) {
  return path
    .basename(file, path.extname(file))
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function convertOne(srcRel) {
  const srcPath = path.join(publicDir, srcRel);
  if (!(await exists(srcPath))) {
    console.warn("skip missing:", srcRel);
    return;
  }

  const name = baseName(srcRel);
  const input = sharp(srcPath, { failOn: "none" }).rotate();
  const meta = await input.metadata();
  const maxW = meta.width || 1920;

  for (const w of WIDTHS) {
    if (w > maxW + 40 && w !== WIDTHS[0]) continue;
    const targetW = Math.min(w, maxW);
    const pipeline = input.clone().resize({
      width: targetW,
      withoutEnlargement: true,
      fit: "inside",
    });

    const webpOut = path.join(outDir, `${name}-${targetW}.webp`);
    const avifOut = path.join(outDir, `${name}-${targetW}.avif`);

    await pipeline
      .clone()
      .webp({ quality: 72, effort: 4 })
      .toFile(webpOut);

    await pipeline
      .clone()
      .avif({ quality: 55, effort: 4 })
      .toFile(avifOut);

    const webpStat = await fs.stat(webpOut);
    const avifStat = await fs.stat(avifOut);
    console.log(
      `${name}-${targetW}: webp ${Math.round(webpStat.size / 1024)}KB, avif ${Math.round(avifStat.size / 1024)}KB`
    );
  }
}

await fs.mkdir(outDir, { recursive: true });
for (const src of SOURCES) {
  await convertOne(src);
}
console.log("done →", outDir);
