import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-24 text-center min-h-[50vh] flex flex-col items-center justify-center">
      <p className="text-sm font-bold tracking-widest text-[#05568D] uppercase">
        404
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
        Page not found
      </h1>
      <p className="mt-3 text-slate-600">
        The page you are looking for does not exist or was moved.
      </p>
      <Link
        to="/"
        viewTransition
        className="mt-6 inline-flex items-center gap-2 bg-[#05568D] hover:bg-[#033e66] text-white font-bold py-2.5 px-6 rounded-full transition-all duration-300 shadow-md active:scale-95"
      >
        Back to Homepage
      </Link>
    </div>
  );
}

export default NotFound;
