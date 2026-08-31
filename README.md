<p align="center">
  <img src="src/assets/logo.WebP" alt="IEEE Al-Azhar Logo" width="120" />
</p>

<h1 align="center">IEEE Al-Azhar Student Branch Website</h1>

<p align="center">
  The official website for the IEEE Al-Azhar Student Branch — a modern, fast, and maintainable frontend built with React and Vite.
</p>

---

## About

This is the frontend for **IEEE Al-Azhar Student Branch**, serving as the public-facing website and an admin dashboard for managing board members, feedback, and dynamic registration forms. It's a single-page application (SPA) that talks to a separate backend API.

- **Live site:** [ieee-website-phi.vercel.app](https://ieee-website-phi.vercel.app)
- **Backend repo:** [ieee-alazhar-api](https://github.com/IEEE-AlAzhar-SB/ieee-alazhar-api)

---

## Tech Stack

| Technology                                     | Purpose                                                  |
| ---------------------------------------------- | -------------------------------------------------------- |
| [React 18](https://react.dev)                  | UI framework                                             |
| [Vite](https://vitejs.dev)                     | Build tool and dev server                                |
| [TypeScript](https://www.typescriptlang.org)   | Type safety across `.tsx` and `.jsx` files               |
| [Tailwind CSS 3](https://tailwindcss.com)      | Utility-first styling (Rubik font family)                |
| [TanStack Query 5](https://tanstack.com/query) | Server state management, caching, optimistic updates     |
| [better-auth](https://www.better-auth.com)     | Email/password authentication with cookie-based sessions |
| [Swiper](https://swiperjs.com)                 | Carousel and slider components                           |
| [Cloudinary](https://cloudinary.com)           | Responsive image hosting and delivery                    |
| [Vercel](https://vercel.com)                   | Hosting and deployment with API proxy rewrites           |

---

## Features

### Public Site

- **Home** — Hero section, events slider, committees overview, team highlights
- **About** — Organization history, stats, achievements, current chair
- **Board** — Board members organized by year with sections (Officers, Technical, Branding, Operation)
- **Events** — Events listing with detail pages (speakers, photo gallery, inline registration forms)
- **Committees** — Tabbed view of Technical, Operation, and Multimedia committees
- **Contact Us** — Feedback submission form

### Admin Dashboard

- **Board Management** — Full CRUD for board members with image uploads, filters, and stats
- **Feedback Management** — View, filter by status (unread/read/archived/resolved), and manage user feedback
- **Dynamic Form Builder** — Create custom registration forms with drag-and-drop field ordering, field validation, submission tracking, and CSV export

---

## Project Structure

```
src/
├── assets/              # Static images (logos, committee SVGs, page images)
├── components/          # Shared UI components (Navbar, Footer, Card, Modals, etc.)
├── features/            # Feature modules (self-contained)
│   ├── board/           #   Board member management (hooks + components)
│   ├── feedback/        #   Feedback management (hooks + components)
│   └── forms/           #   Dynamic form builder (types + service + hooks + components)
├── hooks/               # Shared TanStack Query hooks (queries + mutations)
├── lib/                 # Utilities (auth-client, apiError, queryKeys)
├── pages/               # Route-level page components
├── service/             # Shared API fetch functions
├── types/               # Shared TypeScript types
└── utils/               # Helper functions (position formatter)
```

---

## Architecture

### Data Flow

Every feature follows a strict **three-layer pattern**:

```
Service Layer  →  Hook Layer  →  Page/Component Layer
(fetch functions)   (TanStack Query)   (React UI)
```

1. **Service** (`src/service/` or `features/*/service/`) — Pure async functions that call the backend API. All use `throwIfNotOk()` for consistent error handling.
2. **Hooks** (`src/hooks/` or `features/*/hooks/`) — TanStack Query wrappers that manage caching, loading states, and optimistic updates. Centralized query keys live in `src/lib/queryKeys.ts`.
3. **Pages/Components** — Consume hooks, manage local UI state, and handle user interactions.

### Feature Modules

Each feature in `src/features/` is self-contained with its own `components/`, `hooks/`, and an `index.ts` barrel export. This keeps related code together and makes features easy to navigate.

### Barrel Exports

Every directory has an `index.ts` barrel file for clean imports:

```ts
import { Card, Navbar, Footer } from "@/components";
import { useBoardQuery, useEventsQuery } from "@/hooks";
```

---

## Getting Started

### Prerequisites

- **Node.js 18+** (check with `node -v`)
- **npm** (comes with Node)

### Installation

```bash
git clone https://github.com/IEEE-AlAzhar-SB/IEEE-Website.git
cd IEEE-Website
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_BACKEND_URL=http://localhost:3001/api
VITE_FRONTEND_URL=http://localhost:5173
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

| Variable                     | Description                                                                 |
| ---------------------------- | --------------------------------------------------------------------------- |
| `VITE_BACKEND_URL`           | Backend API URL for the Vite dev proxy (not used in production)             |
| `VITE_FRONTEND_URL`          | Must match the browser origin — better-auth uses this for cookie-based auth |
| `VITE_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name for responsive image URLs                        |

### Development

```bash
npm run dev
```

The Vite dev server proxies `/api` requests to your `VITE_BACKEND_URL`.

### Scripts

| Command             | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Start Vite dev server                                  |
| `npm run typecheck` | Run TypeScript type checking (required before pushing) |
| `npm run build`     | Production build                                       |
| `npm run preview`   | Preview the production build locally                   |

---

## Deployment

The app is deployed on **Vercel** as a static site with two rewrites in `vercel.json`:

1. **API Proxy** — `/api/:path*` is rewritten to `https://ieee-alazhar-api.vercel.app/api/:path*`, so all API calls hit the external backend.
2. **SPA Fallback** — All other routes serve `/index.html` for client-side routing.

There are no serverless functions or Edge middleware — it's purely static hosting with proxy rewrites.

---

## Code Conventions

- **TypeScript first** — New files should be `.tsx`/`.ts`. Some legacy files remain `.jsx` (the project uses `allowJs: true`).
- **Feature modules** — Group related components, hooks, and services in `src/features/<name>/`.
- **Shared code** — Put reusable utilities in `src/lib/`, shared types in `src/types/`, and cross-feature services in `src/service/`.
- **Query keys** — Always use the centralized factory from `src/lib/queryKeys.ts`. Never hardcode query keys.
- **FormData for file uploads** — Board member create/update sends `FormData` (not JSON) because of avatar uploads. Append optional fields only when non-empty.
- **Optimistic updates** — Board and feedback mutations implement optimistic updates with rollback on error.
- **`throwIfNotOk`** — All service functions call this before parsing JSON for consistent error handling.
- **Cloudinary images** — Use the `CloudinaryImage` component for responsive images with `srcSet` and auto-format optimization.
- **No lint or test setup** — The only quality gate is `npm run typecheck`. Run it before pushing.

---

## Routes

### Public Routes

| Path                | Page         | Description                                       |
| ------------------- | ------------ | ------------------------------------------------- |
| `/`                 | Home         | Landing page with hero, events, committees, team  |
| `/about`            | About        | Organization history and achievements             |
| `/board`            | Board        | Board members by year with filterable sections    |
| `/events`           | Events       | Events listing                                    |
| `/eventdetails/:id` | EventDetails | Event detail with speakers, gallery, registration |
| `/committees`       | Committees   | Tabbed committee overview                         |
| `/contactus`        | ContactUs    | Feedback submission form                          |
| `/joinus`           | JoinUs       | Join application form                             |

### Auth Route

| Path     | Page  | Description                                  |
| -------- | ----- | -------------------------------------------- |
| `/login` | Login | Admin login (email/password via better-auth) |

### Dashboard Routes (protected)

| Path                     | Page                | Description                             |
| ------------------------ | ------------------- | --------------------------------------- |
| `/dashboard`             | Dashboard           | Board member management with CRUD       |
| `/dashboard/feedback`    | FeedbackDashboard   | Feedback management with status filters |
| `/dashboard/forms`       | FormsDashboard      | Form builder listing                    |
| `/dashboard/forms/:slug` | FormDetailDashboard | Form fields, submissions, CSV export    |

---

## Backend

This repo is **frontend only**. The backend API lives in a separate repository:

- **Repo:** [ieee-alazhar-api](https://github.com/IEEE-AlAzhar-SB/ieee-alazhar-api)
- **Live:** `ieee-alazhar-api.vercel.app`
- **Docs:** `ieee-alazhar-api.vercel.app/api/docs`

---

<p align="center">
  Built with care by the IEEE Al-Azhar Student Branch team.
</p>
