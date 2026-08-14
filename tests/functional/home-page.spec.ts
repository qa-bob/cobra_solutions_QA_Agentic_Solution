/**
 * tests/functional/home-page.spec.ts
 *
 * Functional tests for the COBRA Solutions homepage.
 * Verifies business-critical content, CTAs, product mentions, and
 * contact information that must always be present on the homepage.
 *
 * Tag: @functional
 * Site: http://www.cobrasolutions.com
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('COBRA Solutions Homepage @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
  });

  // ── Page title ───────────────────────────────────────────────────────────────

  test('page title identifies COBRA Solutions products @functional @smoke', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(3);
    expect(title).toMatch(/COBRA|Benefits/i);
  });

  // ── Navigation ───────────────────────────────────────────────────────────────

  test('primary navigation includes all expected items @functional @navigation', async ({ page }) => {
    const expectedItems = ['Home', 'Software Products', 'Purchase', 'Support', 'Contact'];
    for (const item of expectedItems) {
      const link = page.getByRole('link', { name: new RegExp(`^${item}$`, 'i') }).first();
      await expect(link, `Nav item "${item}" should be visible`).toBeVisible();
    }
  });

  test('Login link is accessible from homepage @functional @navigation', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /login/i }).first();
    await expect(loginLink).toBeVisible();
  });

  test('Renew Service link is present @functional @navigation', async ({ page }) => {
    const renewLink = page.getByRole('link', { name: /renew/i }).first();
    await expect(renewLink).toBeVisible();
  });

  // ── Call-to-action buttons ───────────────────────────────────────────────────

  test('Schedule Free Demonstration CTA is visible @functional', async ({ page }) => {
    const cta = page.getByRole('link', { name: /schedule.*demonstration|schedule.*demo/i }).first();
    await expect(cta).toBeVisible();
  });

  test('Download Demo link is present on homepage @functional', async ({ page }) => {
    const downloadLink = page.getByRole('link', { name: /download demo/i }).first();
    await expect(downloadLink).toBeVisible();
  });

  test('Purchase link is accessible from homepage @functional', async ({ page }) => {
    const purchaseLink = page.getByRole('link', { name: /^purchase$/i }).first();
    await expect(purchaseLink).toBeVisible();
  });

  // ── Product names ────────────────────────────────────────────────────────────

  test('COBRA Administration Manager is mentioned on homepage @functional', async ({ page }) => {
    const text = page.getByText(/COBRA Administration Manager/i).first();
    await expect(text).toBeVisible();
  });

  test('Cafeteria Plan Manager is mentioned on homepage @functional', async ({ page }) => {
    const text = page.getByText(/Cafeteria Plan Manager/i).first();
    await expect(text).toBeVisible();
  });

  test('QSEHRA product is mentioned on homepage @functional', async ({ page }) => {
    const text = page.getByText(/QSEHRA/i).first();
    await expect(text).toBeVisible();
  });

  // ── Contact information ──────────────────────────────────────────────────────

  test('sales phone number is visible on homepage @functional', async ({ page }) => {
    // COBRA Solutions sales: 800.325.1957
    const phone = page.getByText(/800[.\-\s]?325[.\-\s]?1957/i).first();
    await expect(phone).toBeVisible();
  });

  test('support phone number is visible on homepage @functional', async ({ page }) => {
    // COBRA Solutions support: 480.831.6078
    const phone = page.getByText(/480[.\-\s]?831[.\-\s]?6078/i).first();
    await expect(phone).toBeVisible();
  });

  // ── Page structure ───────────────────────────────────────────────────────────

  test('homepage has at least one main heading @functional', async ({ page }) => {
    const headings = page.locator('h1, h2, h3');
    await expect(headings.first()).toBeVisible();
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);
  });

  test('footer contains Contact Us link @functional', async ({ page }) => {
    const contactLink = page.getByRole('link', { name: /contact us/i }).first();
    await expect(contactLink).toBeVisible();
  });

  test('footer contains Technical Support link @functional', async ({ page }) => {
    const supportLink = page.getByRole('link', { name: /technical support/i }).first();
    await expect(supportLink).toBeVisible();
  });

  test('footer contains Privacy Policy link @functional', async ({ page }) => {
    const privacyLink = page.getByRole('link', { name: /privacy policy/i }).first();
    await expect(privacyLink).toBeVisible();
  });

  // ── Regression guard: critical content must remain present ───────────────────

  test('homepage body has substantial text content @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Homepage body should contain meaningful text content'
    ).toBeGreaterThan(200);
  });

  test('page has at least 5 navigation links @functional @navigation', async ({ page }) => {
    const navLinks = page.locator('nav a, [role="navigation"] a').filter({
      hasNot: page.locator('[href="#"], [href="javascript:void(0)"]'),
    });
    const count = await navLinks.count();
    expect(count, 'Navigation should have at least 5 links').toBeGreaterThanOrEqual(5);
  });
});
