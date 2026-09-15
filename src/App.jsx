import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer, Navbar, ProtectedRoute, ScrollToTop } from "./components";
import {
  Home,
  About,
  Events,
  EventDetails,
  Committees,
  Board,
  ContactUs,
  JoinUs,
  Login,
  Dashboard,
} from "./pages";

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
              <Footer />
            </>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
