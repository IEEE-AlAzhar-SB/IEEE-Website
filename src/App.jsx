import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer, Navbar, ProtectedRoute, ScrollToTop } from "./components";

// Route-level code splitting: each page becomes its own chunk so the
// initial bundle only ships what's needed for the current route.
// Dashboard (admin + better-auth + forms) is intentionally excluded
// from the public bundle.
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Events = lazy(() => import("./pages/Events"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const Committees = lazy(() => import("./pages/Committees"));
const Board = lazy(() => import("./pages/Board"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const JoinUs = lazy(() => import("./pages/JoinUs"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const PageFallback = () => (
  <div className="container mx-auto px-4 py-24">
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-64" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/committees" element={<Committees />} />
                  <Route path="/board" element={<Board />} />
                  <Route path="/events/:slug" element={<EventDetails />} />
                  <Route path="/eventdetails/:id" element={<EventDetails />} />
                  <Route path="/contactus" element={<ContactUs />} />
                  <Route path="/joinus" element={<JoinUs />} />
                </Routes>
              </Suspense>
              <Footer />
            </>
          }
        />

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
