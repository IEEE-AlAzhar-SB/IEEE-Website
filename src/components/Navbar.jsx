import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import Logo from "../assets/logo.WebP";

const navLinks = [
  { label: "Homepage", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Events", path: "/events" },
  { label: "Committees", path: "/committees" },
  { label: "Board", path: "/board" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const closeNavbar = () => setIsOpen(false);
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="text-white px-4 sm:px-6 py-5 w-full fixed top-0 left-0 right-0 z-[999999] transition-all duration-300">
        <div className="container mx-auto flex items-center justify-between">
          {/*  Logo */}
          <Link
            to="/"
            className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
          >
            <img
              src={Logo}
              alt="IEEE Logo"
              className="h-9 sm:h-10 w-auto object-contain brightness-110 drop-shadow-sm bg-slate-900/50 backdrop-blur-xl p-1 rounded-full"
            />
          </Link>
          <div className="hidden md:flex justify-center items-center gap-4 bg-slate-900/50 backdrop-blur-xl border border-white/10 p-1.5 rounded-full mx-auto shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-semibold text-sm px-5 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${isActive(link.path) ? "bg-white text-[#05568D] shadow-sm font-bold" : "text-white/90 hover:bg-white/20 hover:text-white"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            to="/contactus"
            className="hidden md:flex items-center gap-2.5 bg-white text-[#05568D] font-extrabold py-2 px-5 rounded-full transition-all duration-300 shadow-md hover:bg-[#05568D]/10 transform hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0 group"
          >
            <span>Contact Us</span>
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#05568D] transition-transform group-hover:rotate-45 duration-300">
              <FaArrowUp className="text-white text-[10px] transform rotate-45" />
            </span>
          </Link>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white focus:outline-none transition active:scale-95"
              aria-label="Open Menu"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-[9999998]"
          onClick={closeNavbar}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-[280px] max-w-[85vw] bg-[#05568D] border-l border-white/10 shadow-2xl flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out z-[9999999] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <img
              src={Logo}
              alt="IEEE Logo"
              className="h-8 w-auto object-contain"
            />
            <button
              onClick={closeNavbar}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 block ${isActive(link.path) ? "bg-white text-[#05568D] shadow-md" : "text-white/80 hover:bg-white/5 hover:text-white"}`}
                onClick={closeNavbar}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-white/10">
          <Link
            to="/contactus"
            className="flex items-center justify-center gap-2 bg-white text-[#05568D] font-black py-3 px-4 rounded-xl transition-all duration-300 w-full shadow-lg text-sm"
            onClick={closeNavbar}
          >
            <span>Contact Us</span>
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#05568D]">
              <FaArrowUp className="text-white text-[10px] transform rotate-90" />
            </span>
          </Link>

          <Link
            to="/login"
            className={`w-full text-center py-2.5 text-xs rounded-lg border transition-all duration-200 block ${isActive("/login") ? "bg-red-500 text-white border-transparent" : "text-white/40 border-white/10 hover:text-white hover:bg-white/5"}`}
            onClick={closeNavbar}
          >
            System Portal (Login)
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
