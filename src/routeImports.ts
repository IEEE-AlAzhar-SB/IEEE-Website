// Single source of truth for lazy route chunks. App.jsx feeds these exact
// function references to React.lazy(), and prefetch logic calls them early
// on link hover/focus. Dynamic import() is cached by the module system, so
// calling the same function twice never re-fetches the chunk.
export const routeImports = {
  home: () => import("./pages/Home"),
  about: () => import("./pages/About"),
  events: () => import("./pages/Events"),
  eventDetails: () => import("./pages/EventDetails"),
  committees: () => import("./pages/Committees"),
  board: () => import("./pages/Board"),
  contactUs: () => import("./pages/ContactUs"),
  joinUs: () => import("./pages/JoinUs"),
  login: () => import("./pages/Login"),
  dashboard: () => import("./pages/Dashboard"),
} as const;
