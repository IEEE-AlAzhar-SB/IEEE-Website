<!-- VERCEL BEST PRACTICES (trimmed — this is a frontend-only SPA, most Vercel Functions/Edge/Cron tips do not apply) -->

- Store secrets in Vercel Env Variables; not in git or `NEXT_PUBLIC_*`
- Sync env + project settings with `vercel env pull` / `vercel pull` when you need local/offline parity
- If Enable Deployment Protection is enabled, use a bypass secret to directly access them
- Enable Web Analytics + Speed Insights early

<!-- VERCEL BEST PRACTICES END -->

# IEEE Website

Frontend-only React SPA (Vite). The backend API lives in a separate repo ([`ieee-alazhar-api`](https://github.com/IEEE-AlAzhar-SB/ieee-alazhar-api), live at `ieee-alazhar-api.vercel.app`, [API docs](https://ieee-alazhar-api.vercel.app/api/docs)) — don't search here for backend code. There is no test or lint setup; CI is git-push + Vercel auto-deploy.

## Commands

- `npm run dev` — Vite dev server (proxies `/api` → `VITE_BACKEND_URL`)
- `npm run typecheck` — `tsc --noEmit`; required before pushing (commits gate on TS types)
- `npm run build` — production build (run after typecheck)
- `npm run preview` — preview the built app
- No lint or test scripts exist. Don't run `npm run lint` or `npm run test`. Only run `npm run typecheck` and `npm run build`.

## Environment

- Local dev needs a `.env` (gitignored, no `.env.example`) with `VITE_BACKEND_URL` (dev proxy target), `VITE_FRONTEND_URL` (better-auth baseURL), and `VITE_CLOUDINARY_CLOUD_NAME` (used by `CloudinaryImage`). See `src/vite-env.d.ts` for the typed env shape. Always check/update `vite-env.d.ts` when adding new env vars.
- better-auth (`src/lib/auth-client.ts`) uses `basePath: "/api/auth"` and `credentials: "include"` (cookie-based). `VITE_FRONTEND_URL` must match the browser origin or auth cookies break.
- In production `vercel.json` rewrites `/api/:path*` to the external backend and SPA-falls back all other routes to `/index.html`. Don't add backend routes here; they'd be rewritten.

## Architecture

- Code mixes `.jsx` (App, main, some components/pages) and `.tsx`. `tsconfig` has `allowJs: true`; `typecheck` covers both.
- Data flow: `src/service/*` (fetch layer) → `src/hooks/queries|mutations` (TanStack Query) → pages/features. Query keys live in `src/lib/queryKeys.ts`.
- Service convention: check `res.ok` via `throwIfNotOk` from `src/lib/apiError.ts`, return `json.data ?? json`.
- Mutations send `FormData` for board members (avatar as `avatar` field, omit empty optional fields like email/linkedin before appending).
- Feature modules live in `src/features/*` (e.g. `board`, `feedback`, `forms`) each with `components/`, `hooks/`, and an `index.ts` barrel. The `forms` feature also has its own `service/` subdirectory — don't move feature-local service code into `src/service/`. Use feature-local `service/` for feature-specific API calls; use `src/service/` for shared/cross-feature endpoints. Dashboard uses `useBoardMembers` from `src/features/board`.
- Routes (in `src/App.jsx`): public pages render inside a `/*` catch-all wrapper with `Navbar`/`Footer`; `/login` is standalone; `/dashboard/*` is wrapped in `ProtectedRoute` (better-auth session, redirects to `/login`) and has nested routes `/` (board members) and `/feedback`.
- Styling is Tailwind 3 (config in `tailwind.config.js`, `fontFamily.rubik`); base font Rubik loaded in `index.html`.
- `Card.tsx` uses `aspect-[3/4]` (not fixed pixel heights) to maintain a consistent image aspect ratio across all breakpoints. Width is controlled by `max-w-*` per breakpoint; height follows from the aspect ratio. Don't replace this with `h-[Xpx]` — it causes inconsistent cropping between mobile and desktop.
- `Board.tsx` section headers use `px-4 sm:px-6` for mobile side padding. The parent `container mx-auto` provides some base padding, but section titles need their own horizontal padding to avoid touching the screen edge on small screens.
- New components go in `src/components/` with a re-export added to `src/components/index.ts`. New pages go in `src/pages/` with a re-export in `src/pages/index.ts`. New feature files get re-exported from their feature's `index.ts`.

## Gotchas

- `WAPT_Report.md` is a pentest report for a _different_ Firebase app (`students-portal-94c83`) — unrelated to this repo; ignore it. `text.text` at root is junk.
- `src/pages/JoinUs.jsx` is the only page written in `.jsx`; new pages go in `src/pages/` with barrel exports in `src/pages/index.ts`.
