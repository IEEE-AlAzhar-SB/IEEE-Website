import Logo from "../assets/logo.WebP";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

interface SectionProps {
  text: string;
  additionalText?: string;
  showSocialIcons?: boolean;
  showIeeeBox?: boolean;
}

const Section = ({
  text,
  additionalText,
  showSocialIcons,
  showIeeeBox,
}: SectionProps) => {
  return (
    <div
      className="text-white min-h-[350px] md:min-h-[400px] w-full flex items-center justify-center relative overflow-hidden py-16 md:py-12"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #05568D 0%, #033e66 100%)",
      }}
    >
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(55deg); }
          50% { transform: translateY(-15px) rotate(58deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(15px) scale(1.05); }
        }
        .animate-float-1 { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-delayed 8s ease-in-out infinite; }
      `}</style>

      <div className="container mx-auto px-6 text-center flex flex-col items-center gap-4 relative z-30">
        <h2 className="whitespace-pre-line text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-sm">
          {text}
        </h2>

        {additionalText && (
          <p className="text-sm md:text-lg text-white/80 font-medium max-w-2xl mx-auto leading-relaxed mt-1">
            {additionalText}
          </p>
        )}

        {showIeeeBox && (
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl px-5 py-2.5 w-fit shadow-lg shadow-black/10 mt-2">
            <img
              src={Logo}
              alt="IEEE Logo"
              className="w-9 h-9 object-contain"
              loading="lazy"
              decoding="async"
              width={36}
              height={36}
            />
            <span className="text-xl md:text-2xl font-black tracking-wider text-white">
              IEEE
            </span>
          </div>
        )}

        {showSocialIcons && (
          <div className="flex gap-3 mt-4">
            {[
              {
                icon: FaFacebookF,
                url: "https://www.facebook.com/share/1A7kWQHZ4e/",
                hoverStyle: "hover:bg-[#05568D] hover:text-white",
              },
              {
                icon: FaInstagram,
                url: "https://www.instagram.com/ieee.alazhar?igsh=MTAwN2tmd2doNG44NA==",
                hoverStyle:
                  "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:to-[#ee2a7b] hover:text-white",
              },
              {
                icon: FaLinkedinIn,
                url: "https://www.linkedin.com/company/ieee-alazhar/",
                hoverStyle: "hover:bg-[#05568D] hover:text-white",
              },
            ].map(({ icon: Icon, url, hoverStyle }, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-9 h-9 rounded-full bg-white text-[#05568D] flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-md ${hoverStyle}`}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Decorative bubbles as pure CSS (previously 4.5MB of PNGs):
          radial-gradient circles with blur — zero bytes, GPU-friendly. */}
      <div
        aria-hidden="true"
        className="absolute top-4 left-6 md:left-12 w-24 md:w-36 aspect-square rounded-full opacity-30 md:opacity-50 pointer-events-none animate-float-1 z-10"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), rgba(255,255,255,0.15) 60%, transparent 70%)",
          filter: "blur(2px)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-4 right-6 md:right-16 w-24 md:w-36 aspect-square rounded-full opacity-30 md:opacity-50 pointer-events-none animate-float-2 z-10"
        style={{
          background:
            "radial-gradient(circle at 60% 60%, rgba(255,255,255,0.85), rgba(255,255,255,0.12) 60%, transparent 70%)",
          filter: "blur(3px)",
        }}
      />
    </div>
  );
};

export default Section;
