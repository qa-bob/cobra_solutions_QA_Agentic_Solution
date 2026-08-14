---
name: Bug Report
about: Report a failing, flaky, or incorrect test
title: '[BUG] '
labels: bug
assignees: ''
---

## Failing Test

**File:** `tests/`
**Test name:**
**Suite tag:** `@smoke` / `@navigation` / `@forms` / `@functional` / `@visual` / `@responsive`

## Expected Behavior

<!-- What should the test do? -->

## Actual Behavior

<!-- What does it actually do? -->

## Steps to Reproduce

```bash
npx playwright test tests/<path>/<file>.spec.ts
```

Additional steps if needed:
1.
2.

## Error Output

```
Paste the full error/stack trace here
```

## Screenshot or Recording

<!-- Attach playwright-report artifacts if available -->

## Environment

- OS:
- Node.js version: `node --version`
- Playwright version: `npx playwright --version`
- Browser: chromium / mobile-chrome / tablet
- Site URL tested: `http://www.cobrasolutions.com`

## Root Cause (if known)

<!-- Did the site HTML change? Selector no longer matches? Timing issue? -->

## Suggested Fix

<!-- Optional: how you think this should be fixed -->
