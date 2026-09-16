# Performance Enhancement Plan

Scope: frontend-only React 18 SPA in this repo. No backend changes
(backend lives in `ieee-alazhar-api`). No React major upgrade required —
everything below works with React 18.2, TanStack Query v5,
react-router-dom v7, Vite 6 (see `package.json`).

Quality gate for every phase: `npm run typecheck`, then `npm run build`.
Work branches off `dev` (pushing `dev` triggers the Vercel preview deploy
via `.github/workflows/cd_preview.yml`).

## 0. Baseline (verified, not estimated)

- `src/assets/section-bubles/bubble1.png` (2.3MB) + `bubble2.png` (2.2MB)
  were imported by `src/components/Section.tsx` and shipped in `dist/`.
  Removed; `dist/` no longer contains them (verified in build output).
- Post-change production chunk list (from `npm run build`):
  `vendor-react` 173.72KB, `vendor-swiper` 98.07KB, `Dashboard` 86.44KB,
  `vendor-query` 48.72KB, `index` 35KB, `vendor-auth` 29.58KB,
  pages 2–18KB each (`Home` 18.14KB, `About` 8.96KB, `JoinUs` 8.9KB,
  `EventDetails` 6.76KB, `Login` 6.59KB, `Board` 5.19KB, …).
- What was NOT measured yet: no Lighthouse / Web Vitals run has been done.
  Do Phase 1 before claiming any score improvement.

## Already done (this repo state)

| # | Change | Files |
|---|--------|-------|
| 1 | Route-level code splitting: all pages `React.lazy` + `Suspense` skeleton so public routes don't download Dashboard/auth/forms | `src/App.jsx` |
| 2 | Vendor `manualChunks` (`vendor-react`, `vendor-query`, `vendor-swiper`, `vendor-auth`) + `chunkSizeWarningLimit: 600` | `vite.config.js` |
| 3 | Decorative bubbles replaced with CSS radial-gradients (deleted 4.5MB PNGs from bundle) | `src/components/Section.tsx` |
| 4 | LCP images eager + `fetchPriority="high"`; below-fold stay lazy + `decoding="async"` | `src/pages/Home.tsx`, `src/components/Navbar.jsx`, `src/components/Section.tsx` |
| 5 | `EventDetails` hero changed from CSS `backgroundImage` to a real `<img>` (eager/high priority); memories grid lazy + async decode | `src/pages/EventDetails.tsx` |
| 6 | Dropped unused `1600w` Cloudinary variant (cards are ≤450px wide; `800w` covers 2x DPR); added `fetchPriority` support | `src/components/CloudinaryImage.tsx` |
| 7 | `preconnect` + `dns-prefetch` for `res.cloudinary.com` | `index.html` |
| 8 | `memo` on `Card`, `CardEvent`, `CardSlider`; memoized slide wrappers with stable keys; memoized card arrays/date formatting in `Home`, `Events`, `Board`; memoized counts in `useBoardMembers` | `src/components/Card.tsx`, `src/components/CardEvent.tsx`, `src/components/CardSlider.tsx`, `src/pages/Home.tsx`, `src/pages/Events.tsx`, `src/pages/Board.tsx`, `src/features/board/hooks/useBoardMembers.ts` |

## Phase 1 — Measure (do this first)

Goal: replace guesses with numbers; every later phase is judged against this.

How I would do it:
1. `npm run build && npx vite-bundle-visualizer` (or `npx rollup-plugin-visualizer`) —
   confirm which chunk owns every KB; check nothing >200KB except
   `vendor-react`/`vendor-swiper`.
2. Deploy the branch to the `dev` preview URL and run Lighthouse
   (Performance + Best Practices) on `/`, `/events`, `/events/:slug`,
   `/board` — mobile + desktop. Record LCP, CLS, INP, TBT, total KB.
3. Add `web-vitals` (currently not a dependency) and log
   `onLCP`/`onCLS`/`onINP` to the console (or existing analytics) behind
   `import.meta.env.DEV` first, so later phases have real-user comparison data.
4. Acceptance: a short table (route × LCP/CLS/KB) committed at the top of
   the PR description; no phase claims "improvement" without re-running it.

## Phase 2 — Sanity image pipeline (`src/service/events.ts`)

Problem (verified): `getEvents`/`getEventBySlug` return raw Sanity CDN URLs
and components render them 1:1 — `CardEvent.tsx:36-41`, `Events.tsx:45`,
`EventDetails.tsx` speakers/memories. No `auto=format`, no width params,
no `srcset`/`sizes`. The Cloudinary path has this; the Sanity path doesn't.

How I would do it:
1. Add `src/lib/sanityImage.ts`: `buildSanitySrcSet(url, widths)` +
   `sanityWidth(url, w)` helpers appending Sanity params
   (`?auto=format&fit=max&w=<w>`), mirroring `CloudinaryImage.tsx:21-22`.
2. Use it in `CardEvent` (event cards, `sizes="(max-width: 768px) 100vw, 50vw"`),
   `EventDetails` speakers (reuse `Card` where possible) and memories grid
   (`sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`).
3. First memory/speaker image above the fold (if any) gets `eager`; rest lazy.
4. Acceptance: Lighthouse "Properly size images" / "Serve images in
   next-gen formats" audits pass on `/events` and `/events/:slug`;
   `npm run typecheck` + `npm run build` green.

## Phase 3 — Data-fetching: kill waterfalls, share cache

Verified facts: global `staleTime: 5m` in `src/main.jsx:7-14`, but
`useEventsQuery` uses 15m, board-years 1h, board-meta 24h, others unset
(`src/hooks/queries/`). `EventDetails.tsx:166-167` fetches the event, then
`EventFormSection` (`EventDetails.tsx:198-199`) fetches the form keyed on
`event.formSlug` — sequential. `Home.tsx:38-41` (`memberType: "officer"`)
and `About.tsx:24-28` (`memberType: "officer", position: "Chair"`) are
different query keys (`src/lib/queryKeys.ts:6-30` includes `position`), so
they never share cache.

How I would do it:
1. Hover-prefetch: in `CardEvent`'s details `<Link>`, add
   `onMouseEnter`/`onFocus` calling
   `queryClient.prefetchQuery({ queryKey: queryKeys.events.bySlug(slug), queryFn: … })`
   (needs access to the shared `QueryClient` — export it from a
   `src/lib/queryClient.ts` instead of constructing inline in `main.jsx`).
2. Form prefetch: once `event.formSlug` is known, `prefetchQuery` the
   `queryKeys.forms.publicBySlug(formSlug)` entry so the registration form
   loads while the user is still reading the page.
3. Keep Home/About board queries as-is (params genuinely differ); only
   document that they are intentionally separate keys. If the API later
   supports it, fetch officers once and derive Chair client-side.
4. Set explicit per-query `staleTime`/`gcTime` matching data volatility
   (events/committees 15m ✓ already; add board 5–15m, hero images 15m,
   feedback 1–2m) instead of relying on the global default.
5. Acceptance: Network tab shows event-details + form requests in parallel
   (not sequential) on hover/warm navigation; no duplicate `/api/v1/events`
   calls when moving Home ↔ Events.

## Phase 4 — Swiper diet (`vendor-swiper` is 98KB on every page)

Problem (verified): `CardSlider.tsx:1-5` imports Swiper + 3 CSS files
synchronously; it mounts on Home/Board/About/EventDetails.

How I would do it:
1. Convert `CardSlider` to `React.lazy` in the pages that use it
   (`Home`, `Board`, `About`, `EventDetails`) with the existing skeleton
   fallback, so `vendor-swiper` only downloads when a slider actually renders.
2. Reduce autoplay cost on `Board` (4+ simultaneous `loop` + `autoplay`
   instances): pause offscreen sliders (`Swiper` prop
   `autoplay={{ pauseOnMouseEnter: true }}` plus IntersectionObserver to
   stop hidden instances) or disable `loop` where the member count is small.
3. Optional follow-up (separate PR): replace marketing sliders with a CSS
   scroll-snap carousel and drop the `swiper` dependency entirely.
4. Acceptance: `vendor-swiper` absent from the initial `/` waterfall when no
   slider is in view; total JS on `/` lower than the Phase 1 baseline.

## Phase 5 — Static-asset cleanup and format migration

Verified: `src/assets/home-img/` contains ~1.5MB of unimported JPGs
(`pic-1.jpg`, `pic-3.jpg`, `Sarah Youssef.png` 647KB, …) that are dead weight
in the repo; `section-bubles/*.png` are now unreferenced after the CSS
replacement; `discover.jpg` (153KB) and `about-img/*.jpg` ship as-is.

How I would do it:
1. Delete unreferenced files: `src/assets/section-bubles/*.png`, unimported
   `home-img/*.jpg|png` (verify with a grep for `assets/` imports first —
   current matches are only `logo.WebP`, `discover.jpg`, `boy.svg`,
   `tech/operation/multi.svg`, `about-img/*`).
2. Add `sharp` as a devDependency and a one-shot
   `scripts/convert-images.mjs` converting `discover.jpg`,
   `about-img/firstpic.jpg`, `about-img/2rdpic.jpg` to `.webp` (~30–50% smaller),
   updating the three imports (`Home.tsx`, `About.tsx`). Keep the JPGs out
   of the repo afterwards.
3. Leave `text.text` (repo-root junk) alone or delete in the same PR —
   trivial, zero risk.
4. Acceptance: no image asset in `dist/` over ~200KB; `git status` shows the
   deletions; build green.

## Phase 6 — CSS-in-JS cleanup and render polish

Problem (verified): `Home.tsx:55-81`, `Section.tsx:27-38`,
`CardSlider.tsx:58-132` inject `<style>` tags on every render.

How I would do it:
1. Move keyframes (`hero-float-*`, `bg-bubble-*`, `float-slow/delayed`,
   Swiper overrides) into `src/index.css` (or `tailwind.config.js`
   `theme.extend.keyframes` + `animation`) and reference by class name.
2. Then: paginate or virtualize the `Events` grid and the dashboard
   feedback/submissions tables (currently full-list renders with per-item
   `new Date().toLocaleDateString()` — already memoized in `Events.tsx`,
   but list size still grows unbounded).
3. Acceptance: zero `<style>` tags in component bodies (`grep "<style>" src/`
   returns nothing); long lists render a bounded number of rows.

## Explicit non-goals

- React 19 / React Compiler upgrade: gains here don't need it; revisit only
  when the team wants compiler-driven memoization.
- Backend/API changes: prefetching assumes existing endpoints; any new
  endpoint (e.g. image-optimized Sanity query) is a backend-repo task.
- Rewriting Swiper (Phase 4 step 3) is optional and deliberately last —
  risk/benefit is worse than Phases 1–3.

## Execution order and working agreement

Phases are ordered by impact ÷ risk: 1 (measure) → 2 (images) → 3 (fetching)
→ 4 (swiper) → 5 (assets) → 6 (CSS/lists). One phase per PR against `dev`,
each with before/after Lighthouse numbers and `typecheck` + `build` green.
If you hand me any single phase, I will: re-read the listed files, implement,
run the quality gate, deploy-preview via `dev`, and report measured deltas
— no estimated percentages, only numbers from the runs.
