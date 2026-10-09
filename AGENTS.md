# AGENTS.md — BenchCheck

Second-hand laptop inspection checklist tool. Single-page client app, no backend.

## Stack

- Bun (runtime + package manager). Never npm/yarn/pnpm.
- React 19 + TypeScript (strict) + Vite
- Tailwind CSS v4 via `@tailwindcss/vite` (no PostCSS config, no `tailwind.config.js`)
- Icons: `@phosphor-icons/react` only, `weight="regular"`, one family, never hand-drawn SVG
- Fonts: `@fontsource-variable/geist` + `@fontsource-variable/geist-mono`, imported in `src/main.tsx`
- No new dependencies without asking. No router, no state lib, no motion lib: React state + CSS transitions only.

## Commands

```bash
bun run dev      # dev server
bun run build    # tsc -b + vite build, must pass
bun run lint     # oxlint, keep zero errors
```

Run `bun run build` before claiming any task done.

Commit every update as soon as it lands. One logical change per commit, message per Conventional Commits.

## Structure

| Path | Role |
|---|---|
| `src/data/checklist.ts` | All checklist content (10 sections, 65 items). Content lives here, not in components. |
| `src/types.ts` | Shared types (`CheckSection`, `CheckItem`, `ItemStatus`) |
| `src/store.tsx` | `ChecklistProvider` + `useChecklist()`. Statuses persist to localStorage key `benchcheck:statuses:v1`. Item status cycles pending -> pass -> fail -> pending via `cycle(id)`. |
| `src/App.tsx` | Shell: skip link, sticky header, tabs (checklist / display test / keyboard test), scroll reset on tab change |
| `src/pages/*` | One file per tab |
| `src/components/checklist/*` | Checklist UI: SummaryBar, SectionBand (section + items), SectionRail (sticky index + mobile chip scroller), FailuresPanel, ItemRow |
| `src/components/tools/*` | Keyboard layout data |

## Design rules (locked, from design-taste-frontend)

- Dark theme only: page `zinc-950`, cards `zinc-900`, borders `zinc-800`.
- ONE accent: `signal` (amber `#f59e0b`). `pass` emerald and `fail` red only for real pass/fail state. No other colors.
- Display-test surfaces are the only exception: pure white/black/red/green/blue, they are test patterns.
- Typography: Geist sans default; `font-mono` for all numbers, counts, technical labels.
- Radius: `rounded-lg` everywhere; `rounded-full` only for tiny pills (count badges, progress bar).
- Contrast: body text min `text-zinc-400` on dark surfaces. Never `text-zinc-500` for real text.
- Zero em-dash (`—`) and en-dash (`–`) in any visible string. Hyphen only.
- No emoji, no purple, no glow, no decorative dots, no scroll cues, no fake stats, no marketing copy. Exceptions that carry meaning: TrackPoint red nub (real hardware), amber backlight halo on a held key (test state), display-test colors (test patterns).
- Motion: CSS transitions on `transform`/`opacity` only, ~150ms. `prefers-reduced-motion` handled in `src/index.css`.
- No `window.addEventListener('scroll')`. Keyboard/mouse listeners for tests only.
- Interactive controls: hover state, `active:translate-y-px`, global `:focus-visible` ring already in CSS.
- Responsive: pages use `mx-auto max-w-6xl px-4 sm:px-6 py-8`; layouts collapse to one column below `md`.

## Content rules

- Checklist wording lives in `src/data/checklist.ts`. Edit data, not components, to change items.
- One item per group carries `priority` (1-10) = the 30-45 minute quick-pass order.
- Keep item labels short, imperative, plain English. Hints name the tool (HWiNFO, CrystalDiskInfo, powercfg).

## Working with parallel agents

- Role split: Mandor (main agent) thinks. Design reads, audits, task splitting, arbitration, integration are Mandor jobs. Mandor never writes code - all code changes go through slaves. Slaves never think a lot - their job is to execute and write code from a precise spec. Give slaves exact file sets, exact features, exact constraints; expect code and verification back, not design debate.
- Slaves may load taste/design skill files for reference when told, but direction decisions stay with Mandor.
- File ownership: agree exclusive file sets before spawning. Never edit files outside your set.
- Shared files (`App.tsx`, `store.tsx`, `data/`, `types.ts`, `index.css`) belong to the integrator only.
- After both sides land: integrator runs `bun run build` + `bun run lint`, fixes cross-file issues.
- Spawn mechanism: task needs only ONE slave -> plain subagent (task tool) is fine. Task needs TWO OR MORE slaves running simultaneously -> spawn them via Herdr (pane split + `herdr agent start` / `agent prompt`, see herdr skill), not via multiple task-tool calls. One exclusive file set per Herdr slave, same spec rules.
- Slaves always work in ponytail ultra and caveman ultra: load both skills at task start (`/ponytail ultra`, `/caveman ultra`). Ultra rules govern their code (shortest diff, no unrequested abstractions) and their replies (max compression). Mandor keeps full levels.
