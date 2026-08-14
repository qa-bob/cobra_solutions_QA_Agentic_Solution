# AGENTS.md — Universal AI Agent Instructions

This file is read by all AI coding agents (Claude Code, GitHub Copilot, Devin, Cursor, Codex).
Claude Code loads this via `@AGENTS.md` in `CLAUDE.md`. All agents must follow these rules.

---

## Project Overview

**Purpose:** Playwright + TypeScript QA test suite for [COBRA Solutions](http://www.cobrasolutions.com/)
— a benefits management software company (COBRA, QSEHRA, Cafeteria Plan administration).

**Framework:** Playwright + TypeScript (strict mode)
**Pattern:** Page Object Model (POM) + Object-Oriented Programming (OOP)
**Target site:** `http://www.cobrasolutions.com`

---

## Site Structure — cobrasolutions.com

| Page | URL Path |
|------|----------|
| Home | `/default.aspx` |
| Software Products | `/software/default.aspx` |
| Purchase | `/purchase.aspx` |
| Support | `/support/default.aspx` |
| Contact | `/contact.aspx` |
| Renew Service | `/maintenance_purchase.aspx` |
| Login | `/account/ClientServices/ClientLogin.aspx` |

**Products:**
- COBRA Administration Manager (desktop and web-based versions)
- Web-based COBRA Administration (Single Company + TPA editions)
- Cafeteria Plan Manager
- QSEHRA Manager

**Key contact info visible on site:**
- Sales phone: 800.325.1957
- Support phone: 480.831.6078
- Address: P.O. BOX 10807, Tempe, AZ 85284

> **Note:** The production site serves over HTTP, not HTTPS. Smoke tests correctly flag this.

---

## Key File Map

| File | Purpose |
|------|---------|
| `site.config.json` | Target URL, feature flags (`hasContactForm`, `skipVisual`, etc.) |
| `playwright.config.ts` | Browser projects: chromium-desktop, mobile-chrome, tablet |
| `global-setup.ts` | Pre-run site reachability check |
| `src/pages/base.page.ts` | `BasePage` — extend this for every page object |
| `src/pages/*.page.ts` | One class per page/section |
| `src/fixtures/site.fixture.ts` | Custom `test` with page object fixtures — **import from here** |
| `src/types/site-config.types.ts` | `SiteConfig` TypeScript interface |
| `tests/smoke/` | `@smoke` — availability, title, no JS errors |
| `tests/navigation/` | `@navigation` — nav links, routing, menus |
| `tests/forms/` | `@forms` — form fields and validation (no submission) |
| `tests/functional/` | `@functional` — business logic, content, features |
| `tests/visual/` | `@visual` — screenshot regression |
| `tests/responsive/` | `@responsive` — viewport layout |
| `.claude/agents/` | Sub-agent definitions for site analysis and test generation |
| `.claude/commands/` | Slash command definitions |

---

## Page Object Rules

1. Every page class **must extend `BasePage`** from `@pages/base.page`
2. Locators are `readonly Locator` typed properties, defined in the constructor
3. Methods represent **user actions** (navigate, click, fill) — never assertions
4. **Never place `expect()` inside a page object method**
5. File naming: `src/pages/<kebab-case-name>.page.ts`
6. Export the class as a named export

### Page Object Template

```typescript
import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class ExamplePage extends BasePage {
  readonly heading: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading   = page.locator('h1').first();
    this.ctaButton = page.getByRole('link', { name: /get started/i }).first();
  }

  async navigate(): Promise<void> {
    await this.page.goto(`${this.url}/example`, { waitUntil: 'domcontentloaded' });
  }

  async clickCTA(): Promise<void> {
    await this.ctaButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

---

## Test Rules

1. **Always** import `{ test, expect }` from `@fixtures/site.fixture` — never from `@playwright/test`
2. Tag every test with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
3. Never hardcode URLs — use `siteConfig.url` or Playwright's `baseURL`
4. Use Playwright auto-waiting — **never** `page.waitForTimeout()`
5. **Never submit forms** — test field presence, labels, and validation only
6. **Never create accounts** or enter real credentials
7. Every new page must have a corresponding page object in `src/pages/`
8. Add new page objects to `src/fixtures/site.fixture.ts` before using them in tests

---

## Before Writing Tests or Selectors

1. Read `site.config.json` to get the current URL and feature flags
2. Use `WebFetch` (or visit the live site) to inspect actual HTML
3. Base selectors on real element attributes, roles, and text — not assumed class names
4. Run `npx tsc --noEmit` after writing code to confirm TypeScript is clean

---

## TypeScript Rules

- Strict mode is enabled — no implicit `any`
- All page object properties must be explicitly typed
- Path aliases available: `@pages/`, `@fixtures/`, `@utils/`, `@site-types/`
- Run `npx tsc --noEmit` before finishing any task — zero errors required

---

## Test Tag Reference

| Tag | Folder | When to use |
|-----|--------|-------------|
| `@smoke` | `tests/smoke/` | Site loads, HTTP status OK, title present, no JS errors |
| `@navigation` | `tests/navigation/` | Nav links present, routing works, menus open/close |
| `@forms` | `tests/forms/` | Form fields exist, labels present, validation triggers |
| `@functional` | `tests/functional/` | Business features, product listings, content visible |
| `@visual` | `tests/visual/` | Screenshot regression with `toHaveScreenshot()` |
| `@responsive` | `tests/responsive/` | Layout correct at mobile/tablet/desktop viewports |

---

## npm Scripts

```bash
npm test                    # All tests across all browser projects
npm run test:smoke          # @smoke tests only
npm run test:navigation     # @navigation tests only
npm run test:forms          # @forms tests only
npm run test:visual         # @visual tests only
npm run test:responsive     # @responsive tests only
npm run test:headed         # Run with visible browser window (local debugging)
npm run baseline            # Update visual regression baselines
npm run typecheck           # TypeScript check — must pass before any PR
npm run lint                # ESLint
npm run report              # Open the last HTML test report
```

---

## What NOT To Do

- Submit any form
- Create accounts, log in, or enter real credentials
- Hardcode the base URL in test files
- Put `expect()` assertions inside page object methods
- Use `page.waitForTimeout()` — use `waitForSelector` or Playwright auto-waiting
- Use `any` type without explicit `// eslint-disable` justification
- Write selectors without verifying them against live HTML
- Leave tests tagged `@visual` without first running `npm run baseline`
