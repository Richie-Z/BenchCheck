---
target: src/pages/KeyboardTestPage.tsx
total_score: 28
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
target_identity: "file:/home/u85/Documents/Programming/mein/laptop-test-checklist/src/pages/KeyboardTestPage.tsx"
target_fingerprint: "sha256:7f539aec67683bcc45a0d2433ba37e890196d37b9cd0114cb362748be3dc7004"
target_path: /home/u85/Documents/Programming/mein/laptop-test-checklist/src/pages/KeyboardTestPage.tsx
timestamp: 2026-10-09T07-27-54Z
slug: src-pages-keyboardtestpage-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | No aria-live; grade stamp mounts off-viewport at completion (SummaryBar.tsx:44) |
| 2 | Match System / Real World | 4 | Grade letter with no rubric; thresholds only in code (SummaryBar.tsx:47-55) |
| 3 | User Control and Freedom | 2 | Global Tab suppression traps keyboard users (KeyboardTestPage.tsx:178); third click wipes typed reason (ItemRow.tsx:16) |
| 4 | Consistency and Standards | 3 | Splash teaches ASCII cycle, full mode uses checkboxes; checklist h1 sr-only |
| 5 | Error Prevention | 3 | Mode-scoped state + two-step reset strong; silent reason wipe undercuts |
| 6 | Recognition Rather Than Recall | 2 | No cycle instruction in checklist, no grade rubric, quick-pass rationale invisible |
| 7 | Flexibility and Efficiency | 3 | Quick mode/rail/print good; no shortcuts, no next-unchecked, 65 tab stops |
| 8 | Aesthetic and Minimalist Design | 3 | Discipline high; splash repeats 10 sections / 65 checks three ways |
| 9 | Error Recovery | 2 | No recovery for cleared reason, no keyboard exit from test trap, reset only whole-mode |
| 10 | Help and Documentation | 3 | Item hints + legends solid; missing interaction and grading docs |
| **Total** | | **28/40** | **Good** (70%) |

Applicable max: 40, no n/a heuristics.

## Design Specificity Verdict

Grounded in this product where the user works: numbered step badges, ASCII [ ]/[x]/[!] markers, hazard stripe + scanlines, rubber-stamp grade, TrackPoint nub, real fullscreen patterns. Weak seam: splash is a generic SaaS skeleton (hero + stats + 3 cards + 3 steps, SplashPage.tsx:86-267) and first-person founder story reads marketing against the committed voice.

Deterministic scan: `impeccable detect` over 10 files returned exit 0, zero findings.

Browser evidence: zero console errors at all viewports; no page-level horizontal overflow at 390px; focus-visible ring confirmed (rgb(245,158,11) 2px on real Tab); display fullscreen verified. Contrast ratios and CLS not machine-computed (skipped; fallback token capture). Sub-44px controls confirmed: nav brand 122x24, Full 48x28, Quick pass 90x28 (desktop toolbar). False positives ruled out: 1825px UL sits in intentional overflow-x-auto rail (page scrollW==clientW==390); skip-link 1x1 is visually-hidden.

## Overall Impression

Checklist is instrument-grade. Biggest opportunity: the grade payoff is invisible when it fires and missing from the printed report the buyer keeps.

## What's Working

1. Instrument-grade specificity: step badges, hazard banner, stamp, TrackPoint nub, keycap depth shadows (KeyboardTestPage.tsx:24-26).
2. Mode-scoped persistence (store.tsx:156-157, 201-209): quick and full never overwrite.
3. Evidence capture at the doubt moment: fail auto-focuses reason input (ItemRow.tsx:14-15); FailuresPanel keeps label + reason + section jump (FailuresPanel.tsx:29-47).

## Priority Issues

[P0] Keyboard trap on Keyboard test. `if (e.key === 'Tab') e.preventDefault()` unscoped (KeyboardTestPage.tsx:178) while Space at :179 checks containerHasFocus(). Keyboard-only user cannot reach header tabs, Reset, or touchpad. Fix: scope to containerHasFocus(), add Escape/shift-tab exit. Command: $impeccable audit

[P1] Grade peak invisible and absent from the report. Stamp mounts at SummaryBar page top (SummaryBar.tsx:137-155) while user finishes at last of 65 rows; PrintReport.tsx:31-66 prints counts/device/date with no grade or rubric. Fix: scroll summary into view or sticky completion bar with aria-live; add grade line + verdict to PrintReport. Command: $impeccable polish

[P1] Check state not exposed to assistive tech. ItemRow button no aria-pressed/role=checkbox/aria-checked (ItemRow.tsx:32-39); fail shown by color + icon only (:61-66); no live region on counts. Fix: role=checkbox + aria-checked (pending=null, pass=true, fail=false), append "failed" to accessible name, aria-live=polite on SummaryBar counts. Command: $impeccable audit

[P2] Quick-pass step numbering broken. priority 3 missing, two items carry priority: 10 (checklist.ts:95, 233, 256); SectionBand.tsx:67 renders item.priority as badge so sequence shows 01,02,04...09,10,10. Fix: reassign priorities uniquely in src/data/checklist.ts. Command: $impeccable polish

[P2] Quick mode loses failure aggregation; empty state lies. `{!quick && <FailuresPanel/>}` (ChecklistPage.tsx:158) hides the panel in the time-pressure mode; EmptyState copy says "section 1" while quick view shows no sections (:157, :40). Fix: render FailuresPanel in quick mode; branch EmptyState copy per mode. Command: $impeccable clarify

## Persona Red Flags

Sam (a11y): Tab eaten globally on Keyboard test (KeyboardTestPage.tsx:178) - dead end without mouse. ItemRow cycles announce no state (ItemRow.tsx:32). Quick counter /10 in text-zinc-500 (ChecklistPage.tsx:140) approx 3.6:1 on zinc-950, fails AA.

Jordan (first-timer): device field + 0/65 + Full/Quick + Print before any check. One click = pass with no in-checklist instruction; third accidental click wipes typed reason (ItemRow.tsx:14-18). Grade "C" with no rubric.

Casey (mobile): fullscreen controls fade after 2s driven only by mousemove/keydown (DisplayTestPage.tsx:34-42); Exit goes opacity-0 pointer-events-none (:95) - finger trap. Grade seal -right-5 (SummaryBar.tsx:139) pushes past px-4 gutter; Print/Reset outside thumb zone.

## Minor Observations

- text-zinc-500 on real text: SplashPage.tsx:162, ChecklistPage.tsx:140, placeholders ItemRow.tsx:95-96 (violates own min-zinc-400 rule).
- Splash cover cards hover:border-signal/50 but not interactive (SplashPage.tsx:205).
- FailuresPanel mounts above section list; first fail shifts rows mid-click.
- Grain overlay z-50 mix-blend-overlay (ChecklistPage.tsx:73-77) recolors amber.
- Display/keyboard tests write nothing back to dp-pixels / kb-keys.
- Touchpad surface role=button with no activation handler (KeyboardTestPage.tsx:105-112).
- Tabs hidden on splash; tests unreachable without Open checklist.
- Header counts hidden below sm (App.tsx:75).

## Questions to Consider

1. Why does the grade exist only in the DOM and not in the printed report?
2. Does BenchCheck have an opinion on grade C: buy, negotiate, or walk?
3. Is a 65-row scroll the right shape for 30-45 minutes under time pressure?
4. Quick-pass badges show 01,02,04...10,10 - how did that ship?
5. Splash teaches ASCII cycle, full mode uses checkboxes: which language does the product commit to?
