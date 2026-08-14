# Contributing to COBRA Solutions QA Test Suite

Welcome! This guide covers how to add tests, update page objects, fix flaky tests, and keep the
suite healthy. All contributors — human and AI — must follow these rules.

---

## Before You Start

1. Read `AGENTS.md` (root) — universal rules for all agents and contributors
2. Read `CLAUDE.md` (root) — Claude Code–specific instructions
3. Read `SKILLS.md` (root) — available slash commands and sub-agents
4. Ensure **Node.js 18+** and **npm 9+** are installed
5. Run `npm install && npx playwright install` to set up your environment

---

## Understanding the Architecture

This suite follows **Page Object Model (POM)** and **OOP** principles:

- **Page objects** (`src/pages/*.page.ts`) — model the UI, expose actions, hold locators
- **Fixtures** (`src/fixtures/site.fixture.ts`) — inject page objects into tests
- **Tests** (`tests/<suite>/*.spec.ts`) — use page objects via fixtures, contain all assertions
- **Utils** (`src/utils/`) — shared helpers (link checker, visual diff)

Key rule: **no assertions inside page objects**. Page objects act; tests assert.

---

## Development Workflow

### Step 1 — Inspect the live site first

Before writing any selector or test:

```bash
# Use Claude Code to inspect the site
/analyze-site

# Or open the site manually in a browser
# DevTools → inspect the element → copy selector
```

Never write selectors based on assumptions. All selectors must be verified against
actual live HTML at `http://www.cobrasolutions.com`.

### Step 2 — Update or create a page object

If the test covers a page or section not yet in `src/pages/`:

1. Create `src/pages/<name>.page.ts` extending `BasePage`
2. Add `readonly` typed locators in the constructor
3. Add action methods (navigate, click, fill) — no assertions
4. Add the page object to `src/fixtures/site.fixture.ts`

### Step 3 — Write the test

1. Import `{ test, expect }` from `@fixtures/site.fixture`
2. Tag every test with at least one `@tag` (see table below)
3. Use `siteConfig.url` for the base URL — never hardcode
4. Use Playwright's built-in auto-waiting — never `page.waitForTimeout()`
5. Never submit forms, never log in

### Step 4 — Verify locally

```bash
npm run typecheck                       # Must pass — zero errors
npm run lint                            # Must pass
npx playwright test tests/your-file.spec.ts   # Tests must pass
```

---

## Branch Naming

```
feat/add-products-page-tests
fix/smoke-https-check-flakiness
chore/update-nav-selectors
docs/update-contributing-guide
```

---

## Test Tag Guide

| Tag | Folder | When to use |
|-----|--------|-------------|
| `@smoke` | `tests/smoke/` | Site loads, HTTP 2xx, title present, no critical JS errors |
| `@navigation` | `tests/navigation/` | Nav items visible, routing works, mobile menu opens |
| `@forms` | `tests/forms/` | Form fields present, labels correct, validation triggers |
| `@functional` | `tests/functional/` | Product listings, CTAs, phone numbers, key content |
| `@visual` | `tests/visual/` | Screenshot regression with `toHaveScreenshot()` |
| `@responsive` | `tests/responsive/` | Layout correct at 390px, 768px, 1280px viewports |

Multiple tags are allowed: `test('foo @functional @smoke', ...)`.

---

## File and Class Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Page object class | `PascalCase + Page` | `ProductsPage` |
| Page object file | `src/pages/<kebab>.page.ts` | `products.page.ts` |
| Test spec | `tests/<suite>/<feature>.spec.ts` | `tests/functional/products.spec.ts` |
| Utility | `src/utils/<name>.ts` | `link-checker.ts` |

---

## Pull Request Checklist

Before opening a PR, confirm:

- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes
- [ ] All new tests have at least one `@tag`
- [ ] Selectors are based on actual page HTML (not placeholders or guesses)
- [ ] No form submissions or account creation in any test
- [ ] Page object updated or created for any new pages or sections
- [ ] New page objects are registered in `src/fixtures/site.fixture.ts`
- [ ] Visual baselines updated if needed (`npm run baseline`)
- [ ] PR description explains what was tested and why

---

## Absolute Rules — Never Do This

| Rule | Reason |
|------|--------|
| Submit any form | Could affect real customers or trigger email workflows |
| Log in or create accounts | Tests must be anonymous and non-destructive |
| Hardcode the base URL | Use `siteConfig.url` — the URL may change between environments |
| Put `expect()` inside a page object | Page objects should be reusable across different assertions |
| Use `page.waitForTimeout()` | Creates brittle, slow tests — use Playwright's auto-waiting |
| Use the `any` type | Strict TypeScript is enforced — type everything explicitly |
| Open a PR with placeholder selectors | Selectors like `div.some-class` that weren't verified break immediately |

---

## Getting Help

- Inspect the site: `/analyze-site`
- Generate tests: `/generate-full-suite`
- Review available commands: `SKILLS.md`
- Claude Code docs: https://code.claude.com/docs/en/overview
- Playwright docs: https://playwright.dev/docs/intro
