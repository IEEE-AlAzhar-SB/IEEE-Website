import { memo } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import CloudinaryImage from "./CloudinaryImage";
import { toSafeHttpUrl, toSafeImageSrc } from "../lib/safeUrl";

interface CardProps {
  imageSrc: string;
  name: string;
  title?: string;
  text: string;
  facebookLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  publicId?: string;
}

const CardMember = ({
  imageSrc,
  name,
  title,
  text,
  facebookLink,
  instagramLink,
  linkedinLink,
  publicId,
}: CardProps) => {
  const safeFacebook = toSafeHttpUrl(facebookLink);
  const safeInstagram = toSafeHttpUrl(instagramLink);
  const safeLinkedin = toSafeHttpUrl(linkedinLink);
  const safeImageSrc = toSafeImageSrc(imageSrc);
  return (
    <div className="group relative w-full aspect-[3/4] max-w-[340px] sm:max-w-[400px] md:max-w-[450px] mx-auto rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
      {publicId ? (
        <CloudinaryImage
          publicId={publicId}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={name || "Team Member"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : safeImageSrc ? (
        <img
          src={safeImageSrc}
          alt={name || "Team Member"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      ) : null}

      <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md rounded-xl p-3 sm:p-4 flex flex-col items-center justify-between border border-white/40 shadow-lg transition-all duration-300 group-hover:bg-white/90">
        <div className="w-full text-center space-y-1 capitalize">
          <p className="text-slate-900 text-base sm:text-lg md:text-[20px] font-extrabold tracking-tight line-clamp-1">
            {name} {title && `- ${title}`}
          </p>
          <p className="text-slate-600 text-xs sm:text-sm md:text-[15px] font-medium line-clamp-1">
            {text}
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 mt-3">
          {safeFacebook && (
            <a
              href={safeFacebook}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 text-white hover:bg-[#05568D] rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-sm"
              title="Facebook"
            >
              <FaFacebookF className="text-sm sm:text-base" />
            </a>
          )}

          {safeInstagram && (
            <a
              href={safeInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 text-white hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:to-[#ee2a7b] rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-sm"
              title="Instagram"
            >
              <FaInstagram className="text-sm sm:text-base" />
            </a>
          )}

          {safeLinkedin && (
            <a
              href={safeLinkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 text-white hover:bg-[#05568D] rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-sm"
              title="LinkedIn"
            >
              <FaLinkedinIn className="text-sm sm:text-base" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CardMember);
