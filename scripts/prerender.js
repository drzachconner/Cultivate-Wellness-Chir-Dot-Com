import puppeteer from 'puppeteer';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

// All routes to pre-render
const routes = [
  '/',
  '/about-us',
  '/meet-dr-zach',
  '/pediatric',
  '/prenatal',
  '/family',
  '/new-patient-center',
  '/new-patient-forms',
  '/request-an-appointment',
  '/schedule-appointment',
  '/book-appointment',
  '/events-workshops',
  '/contact-us',
  '/privacy',
  '/thanks',
  '/3-ways-to-poop',
  '/3-steps-transition',
  '/rhkn-guide',
  '/3-ways-to-sleep',
  '/free-guides-for-parents',
  '/talsky-tonal-chiropractic',
  '/insight-scans',
  '/answers',
];

async function prerender() {
  console.log('🚀 Starting pre-render process...\n');

  // Start Vite preview server
  const server = await createServer({
    root: distDir,
    server: { port: 4173 },
    preview: { port: 4173 },
  });
  await server.listen();
  const serverUrl = 'http://localhost:4173';

  console.log(`📡 Preview server started at ${serverUrl}\n`);

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Set a reasonable viewport
  await page.setViewport({ width: 1280, height: 800 });

  for (const route of routes) {
    try {
      const url = `${serverUrl}${route}`;
      console.log(`📄 Rendering: ${route}`);

      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      // Wait for React to hydrate and render
      await page.waitForSelector('#root', { timeout: 10000 });

      // Small delay to ensure all content has rendered
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get the full HTML
      const html = await page.content();

      // Determine output path
      const outputPath = route === '/'
        ? join(distDir, 'index.html')
        : join(distDir, route.slice(1), 'index.html');

      // Create directory if needed
      if (route !== '/') {
        mkdirSync(dirname(outputPath), { recursive: true });
      }

      // Write the pre-rendered HTML
      writeFileSync(outputPath, html, 'utf-8');
      console.log(`   ✅ Saved: ${outputPath.replace(distDir, 'dist')}`);

    } catch (error) {
      console.error(`   ❌ Error rendering ${route}:`, error.message);
    }
  }

  // Generate 404.html from a non-existent route
  try {
    console.log(`📄 Rendering: /404 (for 404.html)`);
    await page.goto(`${serverUrl}/non-existent-page-for-404`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector('#root', { timeout: 10000 });
    await new Promise((resolve) => setTimeout(resolve, 500));
    const html404 = await page.content();
    writeFileSync(join(distDir, '404.html'), html404, 'utf-8');
    console.log(`   ✅ Saved: dist/404.html`);
  } catch (error) {
    console.error(`   ❌ Error rendering 404:`, error.message);
  }

  await browser.close();
  await server.close();

  console.log('\n🎉 Pre-rendering complete!\n');
  console.log(`📊 Rendered ${routes.length + 1} pages (including 404)`);
}

prerender().catch(console.error);
