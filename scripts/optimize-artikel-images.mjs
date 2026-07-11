/**
 * Generate AVIF + WebP variants for artikel award photos.
 * Output: public/media/artikel/<slug>-{480,768,948}.{avif,webp}
 * No upscale beyond source max (948px).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const outDir = path.join(publicDir, "media", "artikel");

const WIDTHS = [480, 768, 948];

const SOURCES = [
  {
    slug: "millennial-choice-btn-syariah-2022",
    file: "artikel/Millennial Choice of The Year oleh Bank BTN Syariah 2022.jpg",
  },
  {
    slug: "approval-terbanyak-desain-rumah-subsidi-2022",
    file: "artikel/Penghargaan kepada PT. Meka Asia Properti atas Approval terbanyak dan desain rumah subsidi terbaik tahun 2022 oleh Bank NTB Syariah.jpg",
  },
  {
    slug: "green-asia-silver-winner-rei-2022",
    file: "artikel/Sliver Winner - Perumahan Green Asia by PT. Meka Asia Properti - pemenang proyek terbaik dari DPD REI Pusat FIABCI Indonesia (REI Excellence Award 2022).jpg",
  },
  {
    slug: "melanesia-gold-winner-rei-2023",
    file: "artikel/Melanesia dianugerahkan sebagai Pemenang Proyek Terbaik dari DPD REI PUSAT pada acara FIABCI Indonesia - REI Excellence Award 2023 di Jakarta dan meraih Gold Winner.jpg",
  },
  {
    slug: "meka-asia-gold-winner-rei-2024",
    file: "artikel/PT. Meka Asia Properti Raih Gold Winner pada REI Excellence Award 2024.jpg",
  },
];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function convertOne({ slug, file }) {
  const srcPath = path.join(publicDir, file);
  if (!(await exists(srcPath))) {
    console.warn("skip missing:", file);
    return;
  }

  const input = sharp(srcPath, { failOn: "none" }).rotate();
  const meta = await input.metadata();
  const maxW = meta.width || 948;

  for (const w of WIDTHS) {
    if (w > maxW + 40 && w !== WIDTHS[0]) continue;
    const targetW = Math.min(w, maxW);
    const pipeline = input.clone().resize({
      width: targetW,
      withoutEnlargement: true,
      fit: "inside",
    });

    const webpOut = path.join(outDir, `${slug}-${targetW}.webp`);
    const avifOut = path.join(outDir, `${slug}-${targetW}.avif`);

    await pipeline.clone().webp({ quality: 74, effort: 4 }).toFile(webpOut);
    await pipeline.clone().avif({ quality: 55, effort: 4 }).toFile(avifOut);

    const webpStat = await fs.stat(webpOut);
    const avifStat = await fs.stat(avifOut);
    console.log(
      `${slug}-${targetW}: webp ${Math.round(webpStat.size / 1024)}KB, avif ${Math.round(avifStat.size / 1024)}KB`
    );
  }
}

await fs.mkdir(outDir, { recursive: true });
for (const src of SOURCES) {
  await convertOne(src);
}
console.log("done →", outDir);
