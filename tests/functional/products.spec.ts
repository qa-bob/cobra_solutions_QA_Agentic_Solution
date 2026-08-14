/**
 * tests/functional/products.spec.ts
 *
 * Functional and regression tests for the COBRA Solutions software products page
 * at /software/default.aspx.
 *
 * Covers all four product lines without downloading software or submitting forms:
 *   - COBRA Administration Manager
 *   - Web-based COBRA Administration
 *   - Cafeteria Plan Manager
 *   - QSEHRA Manager
 *
 * Tag: @functional
 * Site: http://www.cobrasolutions.com/software/default.aspx
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('COBRA Solutions Software Products Page @functional', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.navigate();
  });

  // ── Page load ────────────────────────────────────────────────────────────────

  test('software products page loads successfully @functional @smoke', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);

    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Products page should have substantial content'
    ).toBeGreaterThan(100);
  });

  // ── Product listings ─────────────────────────────────────────────────────────

  test('COBRA Administration Manager is featured @functional', async ({ productsPage }) => {
    const isPresent = await productsPage.hasProduct('COBRA Administration Manager');
    expect(isPresent, 'COBRA Administration Manager should be listed').toBe(true);
  });

  test('Web-based COBRA Administration option is listed @functional', async ({ productsPage }) => {
    const isPresent = await productsPage.hasProduct('Web-based');
    expect(isPresent, 'Web-based COBRA Administration should be listed').toBe(true);
  });

  test('Cafeteria Plan Manager is listed @functional', async ({ productsPage }) => {
    const isPresent = await productsPage.hasProduct('Cafeteria Plan Manager');
    expect(isPresent, 'Cafeteria Plan Manager should be listed').toBe(true);
  });

  test('QSEHRA Manager is listed @functional', async ({ productsPage }) => {
    const isPresent = await productsPage.hasProduct('QSEHRA');
    expect(isPresent, 'QSEHRA Manager should be listed').toBe(true);
  });

  test('at least two distinct product headings are visible @functional', async ({ productsPage }) => {
    const names = await productsPage.getProductNames();
    expect(
      names.length,
      `Expected at least 2 product headings, found: ${names.join(', ')}`
    ).toBeGreaterThanOrEqual(2);
  });

  // ── Download and purchase links ───────────────────────────────────────────────

  test('at least one Download Demo link is present @functional', async ({ productsPage }) => {
    const count = await productsPage.getDemoLinkCount();
    expect(count, 'At least one Download Demo link should be available').toBeGreaterThan(0);
  });

  test('at least one Purchase link is present @functional', async ({ productsPage }) => {
    const count = await productsPage.getPurchaseLinkCount();
    expect(count, 'At least one Purchase link should be available').toBeGreaterThan(0);
  });

  // ── Sub-navigation / product detail links ────────────────────────────────────

  test('Overview link is available for at least one product @functional @navigation', async ({
    page,
  }) => {
    const overviewLink = page.getByRole('link', { name: /overview/i }).first();
    await expect(overviewLink).toBeVisible();
  });

  test('Features link is available for at least one product @functional @navigation', async ({
    page,
  }) => {
    const featuresLink = page.getByRole('link', { name: /features/i }).first();
    await expect(featuresLink).toBeVisible();
  });

  test('FAQs link is present for at least one product @functional @navigation', async ({
    page,
  }) => {
    const faqsLink = page.getByRole('link', { name: /faq/i }).first();
    await expect(faqsLink).toBeVisible();
  });

  // ── Navigation still works on products page ───────────────────────────────────

  test('main navigation is present on products page @functional @navigation', async ({ page }) => {
    const homeLink = page.getByRole('link', { name: /^home$/i }).first();
    await expect(homeLink, 'Home nav link should be visible on products page').toBeVisible();
  });

  test('Contact link is reachable from products page @functional @navigation', async ({ page }) => {
    const contactLink = page.getByRole('link', { name: /^contact$/i }).first();
    await expect(contactLink).toBeVisible();
  });

  // ── COBRA Companion product ───────────────────────────────────────────────────

  test('COBRA Companion online portal is mentioned @functional', async ({ page }) => {
    const companion = page.getByText(/COBRA Companion/i).first();
    await expect(companion).toBeVisible();
  });

  // ── Regression guard ─────────────────────────────────────────────────────────

  test('products page has substantial text content @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Products page body should have meaningful content (not a blank page)'
    ).toBeGreaterThan(300);
  });
});
