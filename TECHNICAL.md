# BenchCheck technical notes

## Stack

Versions below come from `bun.lock`, not `package.json`; the manifest declares ranges and is frequently behind what is installed (`bun.lock:204,206,220,224`).

- React 19.3.0 (`react` and `react-dom`), resolved from `^19.2.8` in `package.json:17-18`.
- Vite 8.3.4, resolved from `^8.3.0` in `package.json:29`.
- TypeScript 6.0.3 in strict mode, resolved from `~6.0.2` in `package.json:28`.
- `@vitejs/plugin-react` 6.1.2, resolved from `^6.1.1` in `package.json:25`.
- Tailwind CSS 4.3.3 through `@tailwindcss/vite` (`bun.lock:214`, `vite.config.ts:1,7`). There is no PostCSS config and no `tailwind.config.js`.
- `@phosphor-icons/react` 2.1.10; `@fontsource-variable/geist` and `@fontsource-variable/geist-mono` 5.3.0 (`bun.lock:28-30`).
- oxlint 1.81.0 as the linter (`package.json:9,26`).
- Bun 1.x is the build toolchain (`docker.io/oven/bun:1-alpine`, `Dockerfile:1`). The app itself has no server-side runtime.

Commands are `bun run dev`, `bun run build` (`tsc -b && vite build`) and `bun run lint` (`package.json:7-9`).

## Architecture

`index.html:47-50` provides `#root` and loads `src/main.tsx`, which mounts React (`src/main.tsx:8-12`). `App.tsx` is the whole shell: skip link, sticky header, and four tabs held in a `useState<Tab>` (`src/App.tsx:10,44-54,59-72,102-125`). The tabs are `splash` (first load and the logo's return target), `checklist`, `display` and `keyboard`; switching one resets scroll (`src/App.tsx:118-124`).

There is exactly one URL path, `/`. No client router dependency exists and no `react-router`, `BrowserRouter`, hash or navigation API is used (`package.json:13-19`). The four screens are client state and cannot be deep-linked. nginx supplies the SPA fallback `try_files $uri $uri/ /index.html` so any direct path returns the app shell (`.containerize/nginx-spa.conf.template:7-8`).

Checklist content lives in `src/data/checklist.ts:15-273` as `CheckSection[]`; `TOTAL_ITEMS` and `QUICK_ITEMS` are derived there at lines 270-273, with quick items selected by a `priority` field of 1 to 10. The grade seal appears only when every item is done (`PRODUCT.md:45-46`). The print report is a print-only component invoked by `window.print()` (`src/App.tsx:7,126`, `src/pages/ChecklistPage.tsx:115-122`, `src/components/checklist/PrintReport.tsx`). No background jobs or server-side rendering exist.

For headless UI verification, the repo's `AGENTS.md` records a Chrome DevTools Protocol recipe: start `bun run dev` on 5173, launch `chromium --headless=new --no-sandbox --remote-debugging-port=9222`, drive clicks and assertions with `Runtime.evaluate`, and capture with `Page.captureScreenshot`. It also warns that the first load is the splash, so a checklist assertion must click "Open checklist" first. This is a developer recipe, not a product feature.

## Data model

There is no SQL database, migration, ORM or HTTP API; dependencies at `package.json:13-19` are UI-only and the inventory `db_driver` is empty (`.opencode/inventory.json:1144`). Persistence is browser `localStorage` only (`src/store.tsx:15-19,121-154`):

| Key | Content | Scope |
|---|---|---|
| `benchcheck:statuses:v1` | item id to `pass` or `fail` (`src/types.ts:26-28`) | full mode (`src/store.tsx:15,43-55,121-126`) |
| `benchcheck:reasons:v1` | item id to free-text failure reason | full mode (`src/store.tsx:16,71-83,128-133`) |
| `benchcheck:quick-statuses:v1` | same shape as full statuses | quick mode only (`src/store.tsx:17,57-69,135-140`) |
| `benchcheck:quick-reasons:v1` | same shape as full reasons | quick mode only (`src/store.tsx:18,85-97,142-147`) |
| `benchcheck:meta:v1` | `{ model: string }` from the DEVICE MODEL input | shared (`src/store.tsx:19,99-111,149-154`) |

Mode scoping keeps a full pass from overwriting a quick pass (`src/store.tsx:156-157`). Checklist sections and items (`src/types.ts:9-24`) and the keyboard layout (`src/components/tools/keyboardLayout.ts:104,126`) are compile-time data, not persisted. Counts are derived in memory per active mode, with a divide-by-zero guard at `src/store.tsx:238`.

No table is queried without a migration, because there are no tables and no SQL anywhere in the repo; no `migrations/`, `database/`, seeders or `.sql` fixtures exist. All state is deliberately device-local and non-shared (`PRODUCT.md:29-30,37-38`).

## Auth

None. No login screen, provider, token, session or gate exists; `src/App.tsx:102-137` mounts the app unconditionally and `package.json:13-19` contains no auth library. nginx serves every path without an auth block (`.containerize/nginx-spa.conf.template:1-9`), and all four tabs are open without credentials (`src/App.tsx:44-54,59-72,103,118-124`). `PRODUCT.md:15` states "No account, no login, single user per device."

UNKNOWN — requires human input: whether an ingress or reverse proxy outside this repo adds authentication. Nothing in the source can answer that.

## External services

None. No database, cache, session store, queue, mail or object storage; no service worker or offline cache file exists. There is no `fetch`, `axios` or `import.meta.env` in `src/`; the only external links are plain GitHub anchors (`src/App.tsx:88-96`, `src/pages/SplashPage.tsx:278-286`). No `.env.example` or `config/` exists, and no `VITE_*` variable is read.

Build and runtime Docker env var *names* only: `NODE_OPTIONS` (`Dockerfile:6`) and `PORT` (`Dockerfile:13`). Absolute production URLs appear in SEO metadata (`index.html:12,17,20,38`) but no runtime request depends on them.

## Operational risks

- All state is per device and per browser in `localStorage` (`src/store.tsx:15-19,113-154`, `PRODUCT.md:37-38`). Additional replicas do not break anything because the app is stateless, but a buyer who switches device sees an empty checklist.
- `JSON.parse` of each stored value is wrapped in `try/catch` with an empty fallback, so corrupt localStorage degrades to empty state instead of crashing (`src/store.tsx:44-55,58-111`).
- `NODE_OPTIONS=--openssl-legacy-provider` is set in the Bun build stage (`Dockerfile:6`) although Vite 8 and Bun do not need it. Harmless, but unnecessary.
- Hardcoded absolute production URLs in `<meta>` and JSON-LD are SEO only (`index.html:12,17,20,38`); no runtime request depends on them.
- Fullscreen tests mutate `document.body.style.overflow` and register window keyboard and mouse listeners; cleanup lives in `useEffect` returns (`src/pages/DisplayTestPage.tsx:44-73`, `src/pages/KeyboardTestPage.tsx:166-205`). They need real interaction and cannot be checked from a static capture.
- Printing relies on browser `window.print()` and print CSS (`src/pages/ChecklistPage.tsx:115-122`); there is no server rendering of the report.
- No boot-time side effects, no config caching, no queue and no scheduler (`.opencode/inventory.json:1149,1151`). The only install action is `bun install --frozen-lockfile` at build time (`Dockerfile:4`).
- No writable path is required at runtime and no server-side ephemeral state needs a volume; the image only reads static files under `/usr/share/nginx/html` (`Dockerfile:11`). No hardcoded credentials were found.

## Container layout

Two stages: Bun builds `dist/` from `docker.io/oven/bun:1-alpine` with a frozen install and `bun run build` (`Dockerfile:1-8`), then the artifacts are copied into `nginxinc/nginx-unprivileged:1.27-alpine` (`Dockerfile:10-14`). nginx listens on `PORT=8080` (`Dockerfile:13`, `.containerize/nginx-spa.conf.template:2`) with the SPA fallback described above. There is no process manager, PHP-FPM or database in the image.

No repo-local fixes are documented: the Flags section of `CONTAINERIZE.md:24-25` is empty and the Dockerfile is the clean `Dockerfile.spa` output. This is not one of the six never-re-render repos; `CONTAINERIZE.md:3` confirms it was generated by `render.sh`. The Jenkinsfile is CI-only, with verify/build/push parameters `REGISTRY`, `HARBOR_PROJECT` and `HARBOR_CRED_ID` (`CONTAINERIZE.md:3-9`); it and `jenkins-test.txt` are build-pipeline artifacts, not app capabilities.

## Open questions

- UNKNOWN — requires human input: whether the canonical host `https://benchcheck.dreadwrym.my.id/` (`index.html:12,17,20,38`) is actually deployed and what serves it. Nothing in the repo proves a deployment.
- UNKNOWN — requires human input: whether checklist wording and section content (`src/data/checklist.ts:15-273`) are final. This is a product decision not derivable from code.
- UNKNOWN — requires human input: any real deployment env values, since no `.env.example` or `config/` exists in the repo.
