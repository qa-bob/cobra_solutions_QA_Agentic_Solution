# COBRA Solutions — Playwright + TypeScript QA Test Suite

Automated regression and functional test suite for [COBRA Solutions](http://www.cobrasolutions.com/)
— benefits management software (COBRA, QSEHRA, Cafeteria Plan). Built with Playwright + TypeScript,
following the **Page Object Model (POM)** design pattern, powered by **Claude Code** for agentic
test generation and maintenance.

---

## Project Purpose

Provide comprehensive GUI, functional, smoke, and regression coverage for every discoverable
feature of the COBRA Solutions website — without creating accounts or submitting forms. The suite
is structured for both human engineers and AI agents (Claude Code, GitHub Copilot, Devin).

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev/) | ^1.44 | Browser automation |
| TypeScript | ^5.4 (strict) | Type-safe test code |
| Node.js | 18+ | Runtime |
| GitHub Actions | — | CI/CD pipeline |
| Claude Code | — | Agentic test generation |

---

## Prerequisites

- **Node.js 18** or higher (`node --version`)
- **npm 9** or higher (`npm --version`)
- **Git**
- A Claude Code subscription (for AI-assisted test generation — optional for running tests)

---

## Setup

### 1. Clone

```bash
git clone https://github.com/your-org/cobra_solutions_QA_Agentic_Solution.git
cd cobra_solutions_QA_Agentic_Solution
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

### 4. Verify setup

```bash
npm run typecheck     # TypeScript must compile cleanly
npm run test:smoke    # Should pass (site must be reachable)
```

---

## Running Tests

```bash
npm test                                        # All tests — desktop + mobile + tablet
npm run test:smoke                              # Smoke: site up, title present, HTTP check
npm run test:navigation                         # Navigation: links, menus, routing
npm run test:forms                              # Forms: fields, labels, validation (no submit)
npm run test:visual                             # Visual regression: screenshot diff
npm run test:responsive                         # Responsive: layout at all viewport sizes

# Functional tests (COBRA Solutions–specific features)
npx playwright test --grep "@functional"

# Run a single file
npx playwright test tests/functional/home-page.spec.ts

# Debug with a visible browser
npm run test:headed

# View the last HTML report
npm run report

# Update visual regression baselines
npm run baseline

# TypeScript + lint checks
npm run typecheck
npm run lint
```

### Run against a different URL

```bash
SITE_URL=https://staging.cobrasolutions.com npm test
```

---

## Project Structure

```
cobra_solutions_QA_Agentic_Solution/
├── site.config.json              # Target URL + feature flags
├── playwright.config.ts          # Playwright projects: desktop, mobile, tablet
├── global-setup.ts               # Pre-run site reachability check
├── tsconfig.json                 # TypeScript strict mode
│
├── CLAUDE.md                     # Claude Code instructions (imports AGENTS.md)
├── AGENTS.md                     # Universal AI agent instructions
├── SKILLS.md                     # Available Claude Code skills and slash commands
│
├── src/
│   ├── pages/
│   │   ├── base.page.ts          # BasePage — shared methods, extended by all pages
│   │   ├── home.page.ts          # HomePage — hero, CTAs, headings
│   │   ├── navigation.page.ts    # NavigationPage — nav links, mobile menu
│   │   ├── contact.page.ts       # ContactFormPage — form fields
│   │   └── products.page.ts      # ProductsPage — software product listings
│   ├── fixtures/
│   │   └── site.fixture.ts       # Custom test object — import {test, expect} from here
│   ├── utils/
│   │   ├── link-checker.ts       # HTTP link reachability
│   │   └── visual-helper.ts      # Screenshot diff utilities
│   └── types/
│       └── site-config.types.ts  # SiteConfig interface
│
├── tests/
│   ├── smoke/
│   │   └── site-availability.spec.ts    # Site up, HTTPS, title, JS errors
│   ├── navigation/
│   │   └── nav-links.spec.ts            # Nav items, routing, mobile menu
│   ├── forms/
│   │   └── contact-form.spec.ts         # Contact form fields, validation
│   ├── functional/
│   │   ├── home-page.spec.ts            # Homepage content, CTAs, products overview
│   │   └── products.spec.ts             # Software products page, download links
│   ├── visual/
│   │   └── visual-regression.spec.ts    # Screenshot regression
│   └── responsive/
│       └── layout.spec.ts               # Viewport-specific layout
│
├── .claude/
│   ├── agents/
│   │   ├── site-analyzer.md             # Sub-agent: crawl site → site.config.json
│   │   └── test-generator.md            # Sub-agent: generate site-specific tests
│   └── commands/
│       ├── analyze-site.md              # /analyze-site
│       ├── run-smoke.md                 # /run-smoke
│       ├── update-baseline.md           # /update-baseline
│       └── generate-report.md          # /generate-report
│
└── .github/
    ├── CONTRIBUTING.md
    ├── PULL_REQUEST_TEMPLATE.md
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   └── test_request.md
    └── workflows/
        └── ci.yml                       # GitHub Actions CI pipeline
```

---

## Architecture

### Page Object Model

Every page or major section has its own class in `src/pages/` that **extends `BasePage`**:

```typescript
// src/pages/example.page.ts
import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@types/site-config.types';

export class ExamplePage extends BasePage {
  readonly heading: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading = page.locator('h1').first();
  }

  async navigate(): Promise<void> {
    await this.page.goto(`${this.url}/example`, { waitUntil: 'domcontentloaded' });
  }
}
```

### Tests

Tests import `{ test, expect }` from the custom fixture — never from `@playwright/test` directly:

```typescript
import { test, expect } from '@fixtures/site.fixture';

test('heading is visible @functional', async ({ homePage }) => {
  await expect(homePage.page.locator('h1').first()).toBeVisible();
});
```

### Path Aliases

```
@pages/       →  src/pages/
@fixtures/    →  src/fixtures/
@utils/       →  src/utils/
@site-types/  →  src/types/
```

---

## Architecture Rules

| Rule | Reason |
|------|--------|
| No assertions in page objects | Keeps page objects reusable and action-focused |
| No hardcoded URLs | Use `siteConfig.url` — the URL changes between environments |
| No `page.waitForTimeout()` | Creates brittle tests — use Playwright auto-waiting |
| No form submission | Tests validate fields only, not processing |
| No `any` type | Strict TypeScript is enforced |
| One class per page/section | Focused, maintainable page objects |
| All tests tagged | Enables selective test runs in CI |

---

## Site Configuration

`site.config.json` controls the target site and feature flags:

```json
{
  "name": "COBRA Solutions",
  "url": "http://www.cobrasolutions.com",
  "hasContactForm": true,
  "skipVisual": false,
  "skipForms": false,
  "viewports": ["desktop", "mobile", "tablet"]
}
```

> **Known issue:** COBRA Solutions serves over HTTP, not HTTPS. The `@smoke` HTTPS test correctly
> flags this — it is a real finding about the site, not a test defect.

---

## COBRA Solutions Site — Key Facts

| Item | Value |
|------|-------|
| Products | COBRA Administration Manager, Web-based COBRA Administration, Cafeteria Plan Manager, QSEHRA Manager |
| Sales phone | 800.325.1957 |
| Support phone | 480.831.6078 |
| Address | P.O. BOX 10807, Tempe, AZ 85284 |
| Main nav | Home, Software Products, Purchase, Support, Contact, Renew Service, Login |

---

## AI Agent Instructions

This repo is designed for use with Claude Code and other AI coding agents.

| File | Purpose |
|------|---------|
| `AGENTS.md` | Universal rules for all agents (Claude, Copilot, Devin, Cursor) |
| `CLAUDE.md` | Claude Code–specific instructions and slash commands |
| `SKILLS.md` | Available skills/commands with usage docs |
| `.claude/agents/` | Specialized sub-agent definitions |
| `.claude/commands/` | Slash command files |

### Quick start for AI agents

1. Read `site.config.json` — get the target URL and flags
2. Use `WebFetch` to inspect the live site before writing any selector
3. Create page objects in `src/pages/` before writing tests
4. Run `npx tsc --noEmit` to verify clean compilation
5. Never submit forms or log in

### Available slash commands

```
/analyze-site          Inspect the live site and populate site.config.json
/generate-full-suite   Scaffold a complete POM + test suite from the live site
/run-smoke             Run smoke tests and report results
/update-baseline       Refresh visual regression baselines
/generate-report       Generate a human-readable test results summary
```

---

## Contributing

See [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md) for the full guide.

**Quick checklist:**
- [ ] `npm run typecheck && npm run lint` pass
- [ ] All tests tagged with at least one `@tag`
- [ ] Selectors verified against live site HTML
- [ ] No form submissions or login in any test
- [ ] Page objects updated for new pages/sections

---

*Part of the Phoenix Startup QA Agentic Solutions project.*
*Targeting COBRA Solutions — http://www.cobrasolutions.com*
