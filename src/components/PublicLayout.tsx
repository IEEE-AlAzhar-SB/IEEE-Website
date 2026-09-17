import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "./index";
import PageFallback from "./PageFallback";

export function PublicLayout() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  );
}
