const CardLogo = ({ imageSrc, title, description }) => {
  return (
    <div className="group bg-white w-full h-full p-5 sm:p-6 border border-slate-200/80 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-slate-800 text-sm sm:text-base md:text-lg font-bold tracking-tight group-hover:text-[#05568D] transition-colors duration-200 capitalize">
          {title}
        </h3>
        <div className="w-[50px] sm:w-[55px] md:w-[60px] aspect-square flex items-center justify-center bg-slate-50 rounded-xl p-2 group-hover:bg-[#05568D]/10 transition-colors duration-300 border border-slate-100">
          <img
            src={imageSrc}
            alt={title || "Card Icon"}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>
      <div className="space-y-1.5 flex-1 flex flex-col">
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CardLogo;
