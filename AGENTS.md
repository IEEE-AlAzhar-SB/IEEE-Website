<!-- VERCEL BEST PRACTICES (trimmed — frontend-only SPA, no functions/edge/cron) -->

- Don't commit `.env*` — prod/preview env vars are injected from GitHub Actions secrets during deploy.

<!-- VERCEL BEST PRACTICES END -->

# IEEE Website

Frontend-only React SPA (Vite). The backend API lives in a separate repo ([`ieee-alazhar-api`](https://github.com/IEEE-AlAzhar-SB/ieee-alazhar-api), live at `ieee-alazhar-api.vercel.app`, [API docs](https://ieee-alazhar-api.vercel.app/api/docs)) — never search here for backend code.

## Commands

- `npm run dev` — Vite dev server (proxies `/api` → `VITE_BACKEND_URL`)
- `npm run typecheck` — `tsc --noEmit`; the only quality gate. There is **no lint or test script** (`npm test` no-ops), so only run `typecheck` then `npm run build`.
- `npm run build` / `npm run preview` — production build / preview

## Branches, CI & deploy

- Pushing `dev` triggers a Vercel **preview** deploy (`.github/workflows/cd_preview.yml`); pushing `main` triggers the **production** deploy (`cd_prod.yml`). Use `dev` for working/preview branches.
- `ci.yml` runs `npm audit` + `npm run typecheck` on push/PR to `main`. These deploy/CI workflows use `vercel` CLI + GitHub secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, plus the `VITE_*` vars).

## Environment

- Local dev needs a `.env` (gitignored, no `.env.example`) with `VITE_BACKEND_URL` (dev proxy target), `VITE_FRONTEND_URL` (better-auth baseURL), `VITE_CLOUDINARY_CLOUD_NAME`. Shape is typed in `src/vite-env.d.ts` — update it when adding env vars.
- better-auth (`src/lib/auth-client.ts`) uses `basePath: "/api/auth"` + `credentials: "include"`. `VITE_FRONTEND_URL` must match the browser origin or auth cookies break.
- In production `vercel.json` rewrites `/api/:path*` to the external backend and SPA-falls back all other routes to `/index.html`. Don't add backend routes there.

## Architecture

- Mixed `.jsx` (App, main, a few components/pages) and `.tsx`; `tsconfig` has `allowJs: true`, `typecheck` covers both. Imports use **relative paths** (`../components`) — README's `@/` alias is NOT configured (no tsconfig `paths`, no vite alias).
- Data flow: `src/service/*` (fetch layer) → `src/hooks/queries|mutations` (TanStack Query) → pages/features. Query keys live in `src/lib/queryKeys.ts`. QueryClient in `main.jsx` sets `staleTime: 5m`.
- Service convention: call `throwIfNotOk(res)` from `src/lib/apiError.ts`, then `return json.data ?? json`. Board mutations send `FormData` with `credentials: "include"` (avatar as `avatar` field, omit empty optional fields like email/linkedin before appending).
- Feature modules in `src/features/*` (`board`, `feedback`, `forms`) each have `components/`, `hooks/`, an `index.ts` barrel. `forms` also has a feature-local `service/` — keep feature-specific API calls there, shared/cross-feature endpoints in `src/service/`. Dashboard uses `useBoardMembers` from `src/features/board`.
- Routes in `src/App.jsx`: public pages render inside a `/*` catch-all wrapper with `Navbar`/`Footer`; `/login` standalone; `/dashboard/*` behind `ProtectedRoute` with nested `/` (board) and `/feedback`. `/eventdetails/:id` is a legacy alias for `/events/:slug` → `EventDetails`.
- Styling is Tailwind 3 (`tailwind.config.js`, `fontFamily.rubik`; font loaded in `index.html`). New components/pages go in `src/components/`/`src/pages/` with a re-export added to the directory's `index.ts`.
- `Card.tsx` uses `aspect-[3/4]` + `max-w-*` per breakpoint (not fixed pixel heights). Don't replace with `h-[Xpx]` — it causes inconsistent cropping between mobile and desktop.
- `Board.tsx` section headers use `px-4 sm:px-6` — the parent `container mx-auto` alone doesn't keep titles off the screen edge on small phones.

## Gotchas

- `text.text` at repo root is junk (an appended test line); ignore it.
- `src/pages/JoinUs.jsx` is the only page written in `.jsx`; write new pages as `.tsx`.
