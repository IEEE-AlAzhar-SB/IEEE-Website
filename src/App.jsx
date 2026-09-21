import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  PageFallback,
  ProtectedRoute,
  ScrollToTop,
} from "./components";
import { PublicLayout } from "./components/PublicLayout";
import { routeImports } from "./routeImports";

// Route-level code splitting: each page becomes its own chunk so the
// initial bundle only ships what's needed for the current route.
// Dashboard (admin + better-auth + forms) is intentionally excluded
// from the public bundle.
// The import functions live in routeImports.ts so prefetch logic can call
// the exact same references (import() is module-cache safe to re-invoke).
const Home = lazy(routeImports.home);
const About = lazy(routeImports.about);
const Events = lazy(routeImports.events);
const EventDetails = lazy(routeImports.eventDetails);
const Committees = lazy(routeImports.committees);
const Board = lazy(routeImports.board);
const ContactUs = lazy(routeImports.contactUs);
const JoinUs = lazy(routeImports.joinUs);
const Login = lazy(routeImports.login);
const Dashboard = lazy(routeImports.dashboard);
const NotFound = lazy(routeImports.notFound);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="events" element={<Events />} />
          <Route path="committees" element={<Committees />} />
          <Route path="board" element={<Board />} />
          <Route path="events/:slug" element={<EventDetails />} />
          <Route path="eventdetails/:id" element={<EventDetails />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path="joinus" element={<JoinUs />} />
          {/* Unknown URLs render NotFound inside the public shell. */}
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/login"
          element={
            <Suspense fallback={<PageFallback />}>
              <Login />
            </Suspense>
          }
        />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageFallback />}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
