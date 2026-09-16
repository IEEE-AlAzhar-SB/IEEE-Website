import { memo } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowUp } from "react-icons/fa";

interface CardProps {
  image: string;
  title: string;
  text: string;
  date: string;
  secondData?: string;
  registrationLink?: string;
  location: string;
  className?: string;
  slug?: string;
  /** Legacy UUID fallback for events without a slug yet. */
  id?: string;
}

const Card = ({
  image,
  title,
  text,
  date,
  secondData,
  registrationLink,
  location,
  className,
  slug,
  id,
}: CardProps) => {
  const detailsPath = slug ? `/events/${slug}` : `/eventdetails/${id}`;
  return (
    <div
      className={`group w-full h-full max-w-[650px] bg-white shadow-md hover:shadow-xl rounded-2xl p-4 md:p-5 flex flex-col gap-5 mx-auto transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      <div className="w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-xl bg-slate-100 relative">
        <img
          src={image}
          alt={title || "Event Image"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 rounded-xl shadow-inner pointer-events-none"></div>
      </div>

      <div className="flex flex-col flex-1 justify-between gap-2">
        <div className="space-y-2">
          <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight line-clamp-1 group-hover:text-[#05568D] transition-colors duration-200">
            {title}
          </h3>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed line-clamp-2">
            {text}
          </p>
        </div>

        <div className="border-t-2 border-slate-200"></div>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-slate-500 text-xs md:text-sm font-medium">
            <FaCalendarAlt className="text-slate-400 text-sm flex-shrink-0" />
            <span className="line-clamp-1">{date}</span>
          </div>

          {secondData && (
            <div className="flex items-center gap-2.5 text-slate-500 text-xs md:text-sm font-medium">
              <FaCalendarAlt className="text-slate-400 text-sm flex-shrink-0" />
              <p className="line-clamp-1">{secondData}</p>
            </div>
          )}

          <div className="flex items-center gap-2.5 text-slate-500 text-xs md:text-sm font-medium">
            <FaMapMarkerAlt className="text-slate-400 text-sm flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={detailsPath}
            className="flex flex-1 justify-center items-center gap-3 bg-[#05568D] hover:bg-[#033e66] text-white font-bold py-1.5 px-2.5 rounded-full transition-all duration-300 text-xs md:text-sm shadow-md shadow-[#05568D]/10 transform active:scale-95"
          >
            <span>Explore Event</span>
            <span className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full bg-white transition-transform group-hover:translate-x-0.5">
              <FaArrowUp className="text-[#05568D] transform rotate-45 text-[10px] md:text-xs" />
            </span>
          </Link>

          {registrationLink && (
            <Link
              to={registrationLink}
              className="flex flex-1 justify-center items-center gap-3 bg-[#05568D] hover:bg-[#033e66] text-white font-bold py-1.5 px-2.5 rounded-full transition-all duration-300 text-xs md:text-sm shadow-md shadow-[#05568D]/10 transform active:scale-95"
            >
              <span>Register</span>
              <span className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full bg-white transition-transform group-hover:translate-x-0.5">
                <FaArrowUp className="text-[#05568D] transform rotate-45 text-[10px] md:text-xs" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Card);
