## Summary

<!-- What does this PR change and why? 2-3 sentences. -->

## Type of Change

- [ ] New test(s)
- [ ] Bug fix (broken or flaky test)
- [ ] Page object update / new page object
- [ ] Infrastructure / config change
- [ ] Documentation

## Test Coverage

| Suite | Tests Added | Tests Modified | Tests Removed |
|-------|-------------|----------------|---------------|
| @smoke | | | |
| @navigation | | | |
| @forms | | | |
| @functional | | | |
| @visual | | | |
| @responsive | | | |

## Selectors Verified

<!-- List pages/elements where you inspected live HTML to confirm selectors work -->

- [ ] Selectors inspected against live site at `http://www.cobrasolutions.com`
- [ ] No placeholder or assumed selectors

## Pre-Merge Checklist

- [ ] `npm run typecheck` passes (zero errors)
- [ ] `npm run lint` passes
- [ ] All new tests tagged with at least one `@tag`
- [ ] No form submissions or account creation in any test
- [ ] Page objects updated for any new pages/sections
- [ ] New page objects registered in `src/fixtures/site.fixture.ts`
- [ ] Visual baselines updated if `@visual` tests changed (`npm run baseline`)

## How to Test This PR

```bash
# Run the specific suite changed
npx playwright test tests/<suite>/<file>.spec.ts

# Or run the full suite
npm test
```

## Related Issues

Closes #
