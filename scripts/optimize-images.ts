import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const currentDir =
  (import.meta as { dir?: string }).dir ?? path.dirname(fileURLToPath(import.meta.url));

const imgDir = path.resolve(currentDir, "../public/images");
const files = ["avatar-illustrated.png", "avatar-real.png"];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function runOptimization() {
  console.log("=== BTL Asset Optimizer (Native Sharp // Apple Silicon M1) ===\n");

  let totalOriginal = 0;
  let totalOptimizedAvif = 0;

  for (const file of files) {
    const inputPath = path.join(imgDir, file);
    if (!fs.existsSync(inputPath)) {
      console.warn(`[WARN] File not found: ${inputPath}`);
      continue;
    }

    const baseName = path.parse(file).name;
    const originalSize = fs.statSync(inputPath).size;
    totalOriginal += originalSize;

    const avifPath = path.join(imgDir, `${baseName}.avif`);
    const webpPath = path.join(imgDir, `${baseName}.webp`);

    console.log(`Processing: ${file} (${formatBytes(originalSize)})`);

    // Generate modern AVIF (Effort 6, Quality 80 for optimal compression & fidelity)
    await sharp(inputPath).avif({ quality: 80, effort: 6 }).toFile(avifPath);

    const avifSize = fs.statSync(avifPath).size;
    totalOptimizedAvif += avifSize;
    const avifSavings = (((originalSize - avifSize) / originalSize) * 100).toFixed(1);
    console.log(
      `  ✓ AVIF: ${formatBytes(avifSize)} (${avifSavings}% reduction) -> ${baseName}.avif`
    );

    // Generate fallback WebP (Effort 6, Quality 85)
    await sharp(inputPath).webp({ quality: 85, effort: 6 }).toFile(webpPath);

    const webpSize = fs.statSync(webpPath).size;
    const webpSavings = (((originalSize - webpSize) / originalSize) * 100).toFixed(1);
    console.log(
      `  ✓ WebP: ${formatBytes(webpSize)} (${webpSavings}% reduction) -> ${baseName}.webp`
    );
    console.log();
  }

  const overallSavings = (((totalOriginal - totalOptimizedAvif) / totalOriginal) * 100).toFixed(1);
  console.log(
    `Total Payload: ${formatBytes(totalOriginal)} -> ${formatBytes(totalOptimizedAvif)} (${overallSavings}% total reduction)`
  );
  console.log("Assets ready for zero-latency Cloudflare Workers Static Assets delivery.\n");
}

runOptimization().catch((err) => {
  console.error("Image optimization failed:", err);
  process.exit(1);
});
