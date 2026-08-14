/**
 * src/pages/products.page.ts
 *
 * ProductsPage models the COBRA Solutions software products listing page
 * at /software/default.aspx. Covers all four product lines:
 *   - COBRA Administration Manager
 *   - Web-based COBRA Administration
 *   - Cafeteria Plan Manager
 *   - QSEHRA Manager
 */

import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class ProductsPage extends BasePage {
  /** Links offering a demo download for any product */
  readonly downloadDemoLinks: Locator;

  /** Purchase links across all product sections */
  readonly purchaseLinks: Locator;

  /** All product-related headings (h2, h3, h4) */
  readonly productHeadings: Locator;

  /** "Schedule Free Demonstration" CTA */
  readonly scheduleDemoLink: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.downloadDemoLinks = page.getByRole('link', { name: /download demo/i });
    this.purchaseLinks     = page.getByRole('link', { name: /purchase/i });
    this.productHeadings   = page.locator('h2, h3, h4').filter({
      hasText: /COBRA Administration|Cafeteria Plan|QSEHRA|Web-based/i,
    });
    this.scheduleDemoLink  = page.getByRole('link', {
      name: /schedule.*demonstration|schedule.*demo/i,
    }).first();
  }

  /** Navigate to the software products listing page. */
  async navigate(): Promise<void> {
    const url = new URL('/software/default.aspx', this.url).toString();
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Return text of all product headings visible on the current page.
   * Useful for asserting that a specific product is listed.
   */
  async getProductNames(): Promise<string[]> {
    const count = await this.productHeadings.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.productHeadings.nth(i).textContent();
      if (text?.trim()) names.push(text.trim());
    }
    return names;
  }

  /** Return the number of "Download Demo" links on the page. */
  async getDemoLinkCount(): Promise<number> {
    return this.downloadDemoLinks.count();
  }

  /** Return the number of "Purchase" links on the page. */
  async getPurchaseLinkCount(): Promise<number> {
    return this.purchaseLinks.count();
  }

  /**
   * Return true if a specific product name appears in any heading on the page.
   * Case-insensitive partial match.
   */
  async hasProduct(name: string): Promise<boolean> {
    const heading = this.page.locator('h1, h2, h3, h4, h5').filter({
      hasText: new RegExp(name, 'i'),
    });
    return (await heading.count()) > 0;
  }
}
