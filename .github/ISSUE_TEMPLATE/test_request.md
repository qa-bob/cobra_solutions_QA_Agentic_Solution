---
name: Test Request
about: Request new test coverage for a page, feature, or user flow
title: '[TEST] '
labels: enhancement
assignees: ''
---

## Page or Feature to Test

**URL:** `http://www.cobrasolutions.com/`
**Description:**

## What Needs Coverage

Describe the behavior that should be tested:

1.
2.
3.

## Test Type (select all that apply)

- [ ] `@smoke` — site loads, no errors
- [ ] `@navigation` — links, menus, routing
- [ ] `@forms` — form fields, validation (no submission)
- [ ] `@functional` — business content, CTAs, product listings
- [ ] `@visual` — screenshot regression
- [ ] `@responsive` — mobile/tablet/desktop layout

## Priority

- [ ] High — blocking release or causing customer-visible issues
- [ ] Medium — important coverage gap
- [ ] Low — nice to have

## Acceptance Criteria

- [ ] Tests pass on `chromium-desktop`, `mobile-chrome`, and `tablet` projects
- [ ] No hardcoded URLs
- [ ] Page object created or updated in `src/pages/`
- [ ] Fixture registered in `src/fixtures/site.fixture.ts`
- [ ] TypeScript compiles with zero errors
- [ ] No form submission or account creation

## Additional Context

<!-- Links to page, screenshots, design docs, or related issues -->
