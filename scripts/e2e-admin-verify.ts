import { chromium, type Page } from 'playwright';

const SITE = 'https://cultivatewellnesschiro.com';
const PASS_COUNT = { pass: 0, fail: 0 };

function pass(label: string) {
  console.log(`  ✓ ${label}`);
  PASS_COUNT.pass++;
}

function fail(label: string, detail?: string) {
  console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`);
  PASS_COUNT.fail++;
}

async function check(label: string, fn: () => Promise<boolean>) {
  try {
    const ok = await fn();
    if (ok) pass(label);
    else fail(label);
  } catch (e) {
    fail(label, e instanceof Error ? e.message : String(e));
  }
}

async function run() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // ============================================
  // STEP 1: Open admin and let user log in
  // ============================================
  console.log('\n=== Admin Panel E2E Verification ===\n');
  console.log('1. Opening admin panel — please log in...\n');

  await page.goto(`${SITE}/admin`, { waitUntil: 'networkidle' });

  // Wait for user to log in — detect the chat textarea appearing
  console.log('   Waiting for you to enter password and log in...');
  await page.waitForSelector('textarea[placeholder="Tell me what to change..."]', {
    timeout: 120000,
  });
  console.log('   Logged in!\n');
  await page.waitForTimeout(2000);

  // ============================================
  // STEP 2: Admin panel checks
  // ============================================
  console.log('2. Admin panel checks:');

  await check('Chat input visible', async () => {
    return page.locator('textarea[placeholder="Tell me what to change..."]').isVisible();
  });

  await check('Welcome message visible', async () => {
    const bubble = page.locator('div.flex.justify-start div.bg-white.text-gray-800.shadow-sm.border.rounded-bl-md').first();
    return bubble.isVisible();
  });

  await check('Header bar with Admin Panel title', async () => {
    const header = page.locator('text=Admin Panel');
    return header.isVisible();
  });

  await check('No "Remember me" checkbox', async () => {
    const count = await page.locator('input[type="checkbox"]').count();
    return count === 0;
  });

  await check('Send button visible', async () => {
    return page.locator('button.bg-primary-dark.text-white.rounded-xl').isVisible();
  });

  // ============================================
  // STEP 3: Send a test message and verify response
  // ============================================
  console.log('\n3. Chat functionality:');

  const textarea = page.locator('textarea[placeholder="Tell me what to change..."]');
  await textarea.fill('What is 2+2? Reply with just the number.');

  // Click the send button
  const sendBtn = page.locator('button.bg-primary-dark.text-white.rounded-xl');
  await sendBtn.click();

  // Wait for streaming to start (loading dots or streaming cursor)
  await check('Streaming starts (loading dots or cursor)', async () => {
    try {
      await page.locator('div.animate-bounce, span.animate-pulse').first().waitFor({ timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  });

  // Wait for response to complete — a new assistant bubble appears after streaming
  await check('Assistant response received', async () => {
    try {
      // Wait for at least 2 assistant bubbles (welcome + response)
      await page.waitForFunction(
        () => {
          const bubbles = document.querySelectorAll('div.flex.justify-start');
          return bubbles.length >= 2;
        },
        { timeout: 60000 },
      );
      return true;
    } catch {
      // Even if count check fails, check if streaming completed
      const bubbles = await page.locator('div.flex.justify-start').count();
      return bubbles >= 2;
    }
  });

  await check('Response contains "4"', async () => {
    const lastBubble = page.locator('div.flex.justify-start div.bg-white.text-gray-800.shadow-sm.border.rounded-bl-md').last();
    const text = await lastBubble.textContent();
    return text?.includes('4') || false;
  });

  // ============================================
  // STEP 4: Conversation sidebar
  // ============================================
  console.log('\n4. Conversation sidebar:');

  const menuBtn = page.locator('button[aria-label="Conversations"]');
  await check('Hamburger menu button exists', async () => menuBtn.isVisible());

  await menuBtn.click();
  await page.waitForTimeout(500);

  await check('Sidebar slides open with "Conversations" header', async () => {
    const header = page.locator('.fixed.inset-y-0.left-0 h2:has-text("Conversations")');
    return header.isVisible();
  });

  await check('Conversation list has entries', async () => {
    // Look for conversation items with message count text like "3 msgs"
    const entries = page.locator('.fixed.inset-y-0.left-0 .overflow-y-auto > div');
    const count = await entries.count();
    return count > 0;
  });

  // Close sidebar via backdrop
  const backdrop = page.locator('.fixed.inset-0.bg-black\\/30');
  if (await backdrop.isVisible()) {
    await backdrop.click();
    await page.waitForTimeout(300);
  }

  // ============================================
  // STEP 5: Change log panel
  // ============================================
  console.log('\n5. Change log panel:');

  const historyBtn = page.locator('button[aria-label="Recent changes"]');
  await check('History button exists', async () => historyBtn.isVisible());

  await historyBtn.click();
  await page.waitForTimeout(500);

  await check('Change log opens with "Recent Changes" header', async () => {
    const header = page.locator('h2:has-text("Recent Changes")');
    return header.isVisible();
  });

  // Close change log
  const clBackdrop = page.locator('.fixed.inset-0.bg-black\\/30');
  if (await clBackdrop.isVisible()) {
    await clBackdrop.click();
    await page.waitForTimeout(300);
  }

  // ============================================
  // STEP 6: Panel controls
  // ============================================
  console.log('\n6. Panel controls:');

  await check('Minimize button', async () => page.locator('button[aria-label="Minimize"]').isVisible());
  await check('Size toggle button', async () => page.locator('button[aria-label="Toggle size"]').isVisible());
  await check('Close button', async () => page.locator('button[aria-label="Close"]').isVisible());
  await check('New panel button', async () => page.locator('button[aria-label="New panel"]').isVisible());

  // Test minimize → restore
  await page.locator('button[aria-label="Minimize"]').click();
  await page.waitForTimeout(500);

  await check('Panel minimized to taskbar dot', async () => {
    const dot = page.locator('button[aria-label*="Restore"]');
    return dot.isVisible();
  });

  // Restore
  const restoreBtn = page.locator('button[aria-label*="Restore"]');
  if (await restoreBtn.isVisible()) {
    await restoreBtn.click();
    await page.waitForTimeout(500);
  }

  await check('Panel restored after minimize', async () => {
    return page.locator('textarea[placeholder="Tell me what to change..."]').isVisible();
  });

  // ============================================
  // STEP 7: Session-only auth (close tab and reopen)
  // ============================================
  console.log('\n7. Session-only auth:');

  // Close the page (clears sessionStorage)
  await page.close();

  // Open a new page — should require re-login
  const newPage = await context.newPage();
  await newPage.goto(`${SITE}/admin`, { waitUntil: 'networkidle' });
  await newPage.waitForTimeout(2000);

  await check('Re-login required after tab close', async () => {
    // Should see password input, not chat textarea
    const passwordInput = newPage.locator('input[type="password"]');
    const chatInput = newPage.locator('textarea[placeholder="Tell me what to change..."]');
    const hasPassword = await passwordInput.isVisible();
    const hasChat = await chatInput.isVisible();
    return hasPassword && !hasChat;
  });

  await newPage.close();

  // ============================================
  // STEP 8: Public pages regression
  // ============================================
  console.log('\n8. Public pages regression:');

  const publicPage = await context.newPage();

  // Collect console errors
  const consoleErrors: string[] = [];
  publicPage.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const publicPages = [
    { name: 'Home', path: '/', text: 'cultivate wellness' },
    { name: 'Pediatric', path: '/pediatric', text: 'pediatric' },
    { name: 'Prenatal', path: '/prenatal', text: 'prenatal' },
    { name: 'Family', path: '/family', text: 'family' },
    { name: 'About Us', path: '/about-us', text: 'about' },
    { name: 'Meet Dr Zach', path: '/meet-dr-zach', text: 'zach' },
    { name: 'Contact Us', path: '/contact-us', text: 'contact' },
    { name: 'Conditions', path: '/conditions', text: 'condition' },
    { name: 'INSiGHT Scans', path: '/insight-scans', text: 'scan' },
    { name: 'Workshops', path: '/workshops', text: 'workshop' },
    { name: 'RHKN Guide', path: '/rhkn-guide', text: 'email' },
    { name: 'Free Guides', path: '/free-guides-for-parents', text: 'guide' },
  ];

  for (const pg of publicPages) {
    await check(pg.name, async () => {
      const res = await publicPage.goto(`${SITE}${pg.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      if (!res || res.status() !== 200) return false;
      await publicPage.waitForTimeout(1500);
      const body = await publicPage.textContent('body');
      return body?.toLowerCase().includes(pg.text) || false;
    });
  }

  // Check for console errors (filter known non-issues)
  const criticalErrors = consoleErrors.filter(e =>
    !e.includes('favicon') &&
    !e.includes('manifest') &&
    !e.includes('third-party') &&
    !e.includes('net::ERR'),
  );

  await check('No critical console errors', async () => {
    if (criticalErrors.length > 0) {
      criticalErrors.forEach(e => console.log(`     Error: ${e.slice(0, 120)}`));
    }
    return criticalErrors.length === 0;
  });

  await publicPage.close();

  // ============================================
  // RESULTS
  // ============================================
  console.log(`\n=== Results: ${PASS_COUNT.pass} passed, ${PASS_COUNT.fail} failed ===`);
  if (PASS_COUNT.fail === 0) {
    console.log('ALL CHECKS PASSED\n');
  } else {
    console.log('SOME CHECKS FAILED\n');
  }

  await browser.close();
  process.exit(PASS_COUNT.fail > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
