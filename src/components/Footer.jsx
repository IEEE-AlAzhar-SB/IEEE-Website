import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Logo from "../assets/logo.WebP";
import { Link } from "react-router-dom";
import { usePrefetchRoute } from "../hooks/usePrefetchRoute";

// Wrapper for the footer nav .map() loop: keeps the usePrefetchRoute call
// inside a real component (stable hook order) instead of in a loop.
const FooterNavLink = ({ to, children }) => {
  const prefetch = usePrefetchRoute(
    (
      {
        "/": "home",
        "/about": "about",
        "/events": "events",
        "/committees": "committees",
        "/board": "board",
        "/contactus": "contactUs",
      }
    )[to],
  );
  return (
    <Link
      to={to}
      viewTransition
      {...prefetch}
      className="text-white/80 hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
    >
      {children}
    </Link>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#05568D] text-white pt-12 pb-6 rounded-t-[24px] shadow-2xl relative z-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-white/10">
        {/* 🏢 Logo Container */}
        <div className="flex items-center gap-3 transform transition hover:scale-105 duration-300">
          <img
            src={Logo}
            alt="IEEE Logo"
            className="w-12 h-12 object-contain brightness-110 drop-shadow-md"
          />
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center text-center text-sm md:text-base font-medium">
          {[
            { label: "Home", url: "/" },
            { label: "About Us", url: "/about" },
            { label: "Events", url: "/events" },
            { label: "Committees", url: "/committees" },
            { label: "Board", url: "/board" },
            { label: "Contact Us", url: "/contactus" },
          ].map((link, i) => (
            <FooterNavLink key={i} to={link.url}>
              {link.label}
            </FooterNavLink>
          ))}
        </div>

        <div className="flex gap-3">
          {[
            {
              icon: FaFacebookF,
              url: "https://www.facebook.com/share/1A7kWQHZ4e/",
              hoverBg: "hover:bg-[#05568D] hover:text-white",
            },
            {
              icon: FaInstagram,
              url: "https://www.instagram.com/ieee.alazhar?igsh=MTAwN2tmd2doNG44NA==",
              hoverBg:
                "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:to-[#ee2a7b] hover:text-white",
            },
            {
              icon: FaLinkedinIn,
              url: "https://www.linkedin.com/company/ieee-alazhar/",
              hoverBg: "hover:bg-[#05568D] hover:text-white",
            },
          ].map(({ icon: Icon, url, hoverBg }, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-9 h-9 rounded-full bg-white text-[#05568D] flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-md ${hoverBg}`}
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="text-center lg:text-left space-y-3">
          <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            <h3 className="font-bold text-base tracking-wide text-white">
              Contact Us
            </h3>
          </div>
          <p className="text-sm text-white/80 font-medium">
            Email:{" "}
            <a
              href="mailto:alazharieee@gmail.com"
              className="hover:underline text-white"
            >
              alazharieee@gmail.com
            </a>
          </p>
        </div>

        <div className="w-full flex items-center">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full flex flex-col sm:flex-row items-center gap-3"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full sm:flex-1 px-4 py-3 rounded-full border border-white/30 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/10 transition text-sm font-medium"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto whitespace-nowrap bg-white text-[#05568D] font-bold px-6 py-3 rounded-full hover:bg-[#05568D]/10 transition transform active:scale-95 text-sm shadow-md shadow-[#05568D]/10"
            >
              Subscribe to news
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10 mt-10 pt-4 text-center text-xs text-white/60 flex flex-col md:flex-row justify-between items-center gap-3 w-[90%] max-w-7xl m-auto font-medium">
        <p>
          © {new Date().getFullYear()} IEEE Al-Azhar Student Branch. All Rights
          Reserved.
        </p>
        <a
          href="#"
          className="hover:text-white underline transition-colors duration-200"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
