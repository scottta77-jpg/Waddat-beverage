import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const templatePath = path.resolve(projectRoot, 'scripts/og-preview/index.html');
const assetsDir = path.resolve(projectRoot, 'public/assets');
const publicDir = path.resolve(projectRoot, 'public');
const distAssetsDir = path.resolve(projectRoot, 'dist/assets');
const distDir = path.resolve(projectRoot, 'dist');

async function generateOgPreview() {
  console.log(`Loading template: ${templatePath}`);

  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  try {
    const page = await browser.newPage();

    // Standard Open Graph image dimensions: 1200 x 630 (deviceScaleFactor: 2 for sharp retina display 2400 x 1260)
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 2
    });

    await page.goto(`file://${templatePath}`, { waitUntil: 'networkidle0' });

    // Ensure all images are fully loaded and rendered
    await page.evaluate(async () => {
      const selectors = Array.from(document.querySelectorAll('img'));
      await Promise.all(
        selectors.map((img) => {
          if (img.complete) return;
          return new Promise((resolve, reject) => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', reject);
          });
        })
      );
    });

    const targetFile = path.resolve(assetsDir, 'og-preview.png');
    await page.screenshot({
      path: targetFile,
      type: 'png'
    });

    console.log(`Saved rich link preview image to: ${targetFile}`);

    // Also mirror to public root and dist folders for universal compatibility
    fs.copyFileSync(targetFile, path.resolve(publicDir, 'og-preview.png'));
    console.log(`Mirrored to: ${path.resolve(publicDir, 'og-preview.png')}`);

    if (fs.existsSync(distAssetsDir)) {
      fs.copyFileSync(targetFile, path.resolve(distAssetsDir, 'og-preview.png'));
      console.log(`Mirrored to dist assets: ${path.resolve(distAssetsDir, 'og-preview.png')}`);
    }
    if (fs.existsSync(distDir)) {
      fs.copyFileSync(targetFile, path.resolve(distDir, 'og-preview.png'));
      console.log(`Mirrored to dist root: ${path.resolve(distDir, 'og-preview.png')}`);
    }
  } finally {
    await browser.close();
  }
}

generateOgPreview().catch((err) => {
  console.error('Failed to generate og-preview:', err);
  process.exit(1);
});
