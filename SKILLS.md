# SKILLS.md — Available Claude Code Skills

This document lists all skills available in this repository. Skills are invoked as slash commands
in Claude Code (`/skill-name`) or run automatically when Claude determines they are relevant.

Skills live in `.claude/commands/` (slash-command files) and `.claude/agents/` (sub-agent definitions).
For the full Claude Code skills specification, see https://code.claude.com/docs/en/skills.

---

## Slash Commands

### `/analyze-site`

**Source:** `.claude/commands/analyze-site.md`

Crawls the live website and produces a fully-populated `site.config.json` with all fields discovered
from the actual page HTML.

**Usage:**
```
/analyze-site
/analyze-site http://www.cobrasolutions.com
```

**What it does:**
1. Navigates to the site URL (from config or argument)
2. Extracts page title, meta description, all nav links, form presence, H1/H2 headings
3. Checks for HTTPS, meta viewport, and favicon
4. Attempts to discover a contact page at `/contact`, `/contact-us`, `/get-in-touch`
5. Outputs a complete `site.config.json` JSON block
6. Reports an issues list (missing meta description, HTTP instead of HTTPS, broken links, etc.)
7. Provides a confidence rating (High / Medium / Low)

**Output:**
- Complete `site.config.json` ready to replace the existing file
- Issues checklist
- Confidence assessment

**When to use:** Onboarding a new site or verifying the config is accurate after a site redesign.

---

### `/generate-full-suite`

**Source:** `.claude/commands/generate-full-suite.md` (invoked as a skill by Claude Code)

Analyzes the live website and generates a complete Playwright test suite — page objects, fixtures,
and all test categories — based on what is actually on the site.

**Usage:**
```
/generate-full-suite
```

**What it creates:**
- Page object classes in `src/pages/` for every discovered page
- Updated `src/fixtures/site.fixture.ts` with new fixtures
- Smoke, navigation, forms, functional, responsive, and visual test files
- Validates TypeScript compiles cleanly (`npx tsc --noEmit`)

**When to use:** Initial project setup or after major site restructuring.

---

### `/run-smoke`

**Source:** `.claude/commands/run-smoke.md`

Runs the smoke test suite and reports results in a readable summary.

**Usage:**
```
/run-smoke
```

**What it does:**
1. Executes `npm run test:smoke`
2. Reports pass/fail count and elapsed time
3. Identifies common failure causes (HTTPS not enforced, missing title, JS errors)
4. Suggests fixes for any failures

**When to use:** Quick sanity check before a release, after a site deployment, or to confirm
the test environment is healthy.

---

### `/update-baseline`

**Source:** `.claude/commands/update-baseline.md`

Refreshes all visual regression baseline screenshots.

**Usage:**
```
/update-baseline
```

**What it does:**
1. Runs `npm run baseline` (Playwright's `--update-snapshots` flag)
2. Replaces all images in `__snapshots__/`
3. Reports which snapshots changed and how many

**When to use:** After accepting intentional UI changes as the new visual baseline.
Run this before CI checks start failing due to legitimate design changes.

---

### `/generate-report`

**Source:** `.claude/commands/generate-report.md`

Parses the last Playwright test run results and produces a human-readable summary.

**Usage:**
```
/generate-report
```

**What it outputs:**
- Pass / fail / skip counts per suite
- Slowest tests (potential flakiness indicators)
- Any retried tests flagged as flaky
- Link to the HTML report at `playwright-report/`

**When to use:** After a full test run to review results, prepare a stakeholder summary,
or identify which suites need attention before a release.

---

## Sub-Agents

Sub-agents in `.claude/agents/` are specialized Claude Code agents invoked automatically for
specific tasks. They have their own tools, inputs, and output contracts.

### `site-analyzer`

**Source:** `.claude/agents/site-analyzer.md`

Crawls a live website and produces a valid, fully-populated `site.config.json`. Handles SPAs,
redirect chains, auth-gated content, and cookie consent banners.

**Invoked by:** `/analyze-site` slash command

**Output:** Complete `site.config.json` + issues checklist + confidence rating

---

### `test-generator`

**Source:** `.claude/agents/test-generator.md`

Reads `site.config.json` and generates site-specific Playwright test files for features not
covered by the shared generic test suite. Output lands in `tests/custom/`.

**Invoked by:** `/generate-full-suite` or when custom site-specific tests are requested

**Output:** TypeScript spec files in `tests/custom/<scenario>.spec.ts`

---

## Adding a New Skill

To add a new skill to this repository:

1. Create `.claude/commands/<skill-name>.md` with:
   - Description of the skill
   - Usage section with examples
   - Step-by-step instructions Claude should follow
   - Output format
   - Edge case handling

2. Add an entry to this `SKILLS.md` file under the appropriate section

3. If the skill needs a dedicated sub-agent, create `.claude/agents/<agent-name>.md`

4. Test the skill by invoking `/skill-name` in a Claude Code session

See the [Claude Code skills documentation](https://code.claude.com/docs/en/skills) for the
complete skill specification and frontmatter options.
