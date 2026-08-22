<!-- VERCEL BEST PRACTICES START -->

## Best practices for developing on Vercel

These defaults are optimized for AI coding agents (and humans) working on apps that deploy to Vercel.

- Treat Vercel Functions as stateless + ephemeral (no durable RAM/FS, no background daemons), use Blob or marketplace integrations for preserving state
- Edge Functions (standalone) are deprecated; prefer Vercel Functions
- Don't start new projects on Vercel KV/Postgres (both discontinued); use Marketplace Redis/Postgres instead
- Store secrets in Vercel Env Variables; not in git or `NEXT_PUBLIC_*`
- Provision Marketplace native integrations with `vercel integration add` (CI/agent-friendly)
- Sync env + project settings with `vercel env pull` / `vercel pull` when you need local/offline parity
- Use `waitUntil` for post-response work; avoid the deprecated Function `context` parameter
- Set Function regions near your primary data source; avoid cross-region DB/service roundtrips
- Tune Fluid Compute knobs (e.g., `maxDuration`, memory/CPU) for long I/O-heavy calls (LLMs, APIs)
- Use Runtime Cache for fast **regional** caching + tag invalidation (don't treat it as global KV)
- Use Cron Jobs for schedules; cron runs in UTC and triggers your production URL via HTTP GET
- Use Vercel Blob for uploads/media; Use Edge Config for small, globally-read config
- If Enable Deployment Protection is enabled, use a bypass secret to directly access them
- Add OpenTelemetry via `@vercel/otel` on Node; don't expect OTEL support on the Edge runtime
- Enable Web Analytics + Speed Insights early
- Use AI Gateway for model routing, set AI_GATEWAY_API_KEY, using a model string (e.g. 'anthropic/claude-sonnet-4.6'), Gateway is already default in AI SDK
  needed. Always curl https://ai-gateway.vercel.sh/v1/models first; never trust model IDs from memory
- For durable agent loops or untrusted code: use Workflow (pause/resume/state) + Sandbox; use Vercel MCP for secure infra access

<!-- VERCEL BEST PRACTICES END -->

# IEEE Website

Frontend-only React SPA (Vite). The backend API lives in a separate repo (`ieee-alazhar-api.vercel.app`) — don't search here for backend code. There is no test or lint setup; CI is git-push + Vercel auto-deploy.

## Commands

- `npm run dev` — Vite dev server (proxies `/api` → `VITE_BACKEND_URL`)
- `npm run typecheck` — `tsc --noEmit`; required before pushing (commits gate on TS types)
- `npm run build` — production build (run after typecheck)
- `npm run preview` — preview the built app

## Environment

- Local dev needs a `.env` (gitignored, no `.env.example`) with both `VITE_BACKEND_URL` (dev proxy target) and `VITE_FRONTEND_URL` (better-auth baseURL). See `src/vite-env.d.ts` for the typed env shape.
- better-auth (`src/lib/auth-client.ts`) uses `basePath: "/api/auth"` and `credentials: "include"` (cookie-based). `VITE_FRONTEND_URL` must match the browser origin or auth cookies break.
- In production `vercel.json` rewrites `/api/:path*` to the external backend and SPA-falls back all other routes to `/index.html`. Don't add backend routes here; they'd be rewritten.

## Architecture

- Code mixes `.jsx` (App, main, some components/pages) and `.tsx`. `tsconfig` has `allowJs: true`; `typecheck` covers both.
- Data flow: `src/service/*` (fetch layer) → `src/hooks/queries|mutations` (TanStack Query) → pages/features. Query keys live in `src/lib/queryKeys.ts`.
- Service convention: check `res.ok` via `throwIfNotOk` from `src/lib/apiError.ts`, return `json.data ?? json` (a few older files, e.g. `service/events.ts`, skip `throwIfNotOk` — keep new code on the convention).
- Mutations send `FormData` for board members (avatar as `avatar` field, omit empty optional fields like email/linkedin before appending).
- Feature modules live in `src/features/*` (e.g. `board`, `feedback`) each with `components/`, `hooks/`, and an `index.ts` barrel. Dashboard uses `useBoardMembers` from `src/features/board`.
- Routes (in `src/App.jsx`): public pages render inside a `/*` catch-all wrapper with `Navbar`/`Footer`; `/login` is standalone; `/dashboard/*` is wrapped in `ProtectedRoute` (better-auth session, redirects to `/login`) and has nested routes `/` (board members) and `/feedback`.
- Styling is Tailwind 3 (config in `tailwind.config.js`, `fontFamily.rubik`); base font Rubik loaded in `index.html`.

## Gotchas

- `WAPT_Report.md` is a pentest report for a _different_ Firebase app (`students-portal-94c83`) — unrelated to this repo; ignore it. `text.text` at root is junk.
- `src/pages/JoinUs.jsx` is the only page written in `.jsx`; new pages go in `src/pages/` with barrel exports in `src/pages/index.ts`.
