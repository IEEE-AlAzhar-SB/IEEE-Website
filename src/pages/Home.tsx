import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";

import { useBoardQuery, useEventsQuery, useHomeHeroImages } from "../hooks";
import { selectMemberPosition } from "../utils/member.position";
import { CardSlider, CardEvent, CardLogo, Card } from "../components";
import { BoardMember } from "../types";

import Logo from "../assets/logo.WebP";
import discover from "../assets/home-img/discover.jpg";
import multi from "../assets/home-img/multi.svg";
import operation from "../assets/home-img/operation.svg";
import tech from "../assets/home-img/tech.svg";

const committeesIntro = [
  {
    imageSrc: tech,
    title: "Technical Committees",
    description:
      "Technical Committees focus on advancing specific technology fields, driving research, standards, and innovation.",
  },
  {
    imageSrc: operation,
    title: "Operation Committees",
    description:
      "Operation Committees focus on managing logistics, organizing events, and ensuring smooth execution of all activities.",
  },
  {
    imageSrc: multi,
    title: "Multi Media Committees",
    description:
      "Multimedia Committees focus on crafting the team's identity through creative content, design, and digital communication.",
  },
];

const Home = () => {
  const lastYear = new Date().getFullYear().toString();
  const { data, isLoading, error } = useBoardQuery({
    year: lastYear,
    memberType: "officer",
  });

  const {
    data: homeHeroImages,
    isLoading: isLoadingHomeHeroImages,
    error: errorHomeHeroImages,
  } = useHomeHeroImages();
  const officers: BoardMember[] = data?.officer ?? [];

  const { data: events } = useEventsQuery();

  // Avoid rebuilding card arrays (and remounting the Swiper) on every
  // parent render; dates are formatted once per events payload.
  const eventCards = useMemo(
    () =>
      events?.map((event) => (
        <CardEvent
          key={event._id}
          id={event._id}
          slug={event.slug?.current}
          image={event.coverImage?.asset?.url ?? "image not found"}
          title={event.title}
          text={event.subtitle ?? "subtitle not found"}
          date={`${new Date(event.startDate).toLocaleDateString()} - ${event.endDate ? new Date(event.endDate).toLocaleDateString() : "TBD"}`}
          secondData={
            event.startDateSecondV
              ? `${new Date(event.startDateSecondV).toLocaleDateString()} - ${event.endDateSecondV ? new Date(event.endDateSecondV).toLocaleDateString() : "TBD"}`
              : undefined
          }
          registrationLink={event.registrationLink}
          location={event.location ?? "location not found"}
        />
      )) ?? [],
    [events],
  );

  const officerCards = useMemo(
    () =>
      officers.map((officer) => (
        <Card
          key={officer.id}
          imageSrc={officer.image_url}
          name={officer.name}
          text={`${selectMemberPosition(officer, officers[0]?.gender)}`}
          linkedinLink={officer.linkedin_url}
          publicId={officer.image_public_id}
        />
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  return (
    <div className="overflow-x-hidden bg-slate-50/50">
      {/* ستايل حقن الأنميشن المخصص للعناصر العائمة بشكل متداخل لضمان العمق الاحترافي */}
      <style>{`
        @keyframes hero-float-1 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(1.02); }
        }
        @keyframes hero-float-2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(12px) scale(0.98); }
        }
        @keyframes hero-float-3 {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(10px) translateY(-8px); }
        }
        @keyframes bg-bubble-1 {
          0%, 100% { transform: translateY(0px) rotate(43deg); }
          50% { transform: translateY(-20px) rotate(45deg); }
        }
        @keyframes bg-bubble-2 {
          0%, 100% { transform: translateY(0px) rotate(151deg); }
          50% { transform: translateY(20px) rotate(149deg); }
        }
        .animate-hero-1 { animation: hero-float-1 5s ease-in-out infinite; }
        .animate-hero-2 { animation: hero-float-2 6s ease-in-out infinite; }
        .animate-hero-3 { animation: hero-float-3 7s ease-in-out infinite; }
        .animate-bg-bubble-1 { animation: bg-bubble-1 9s ease-in-out infinite; }
        .animate-bg-bubble-2 { animation: bg-bubble-2 11s ease-in-out infinite; }
      `}</style>

      <div
        className="text-white pt-10 pb-16 z-5 relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #05568D 0%, #033e66 100%)",
        }}
      >
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative mt-[5rem]">
          <div className="space-y-6 z-10">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm">
              Empower Your Future, <br />
              <span className="text-white">
                Engineer the World
              </span>{" "}
              with
            </h1>

            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl px-5 py-2.5 w-fit shadow-lg shadow-black/10">
              <img
                src={Logo}
                alt="IEEE Logo"
                className="w-10 h-10 object-contain animate-pulse duration-3000"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width={40}
                height={40}
              />
              <span className="text-2xl font-black tracking-wider text-white">
                IEEE
              </span>
            </div>

            <p className="text-sm md:text-base lg:text-lg max-w-md text-white/80 leading-relaxed font-medium">
              Be part of the movement that pushes the limits of what's possible
              in technology and engineering innovation.
            </p>

            <Link
              to="/joinus"
              className="group flex items-center gap-3 bg-white hover:bg-[#05568D]/10 text-[#05568D] font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] w-max shadow-xl shadow-[#05568D]/20"
            >
              <span className="tracking-wide text-sm md:text-base">
                Join Us
              </span>
              <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#05568D] group-hover:bg-[#033e66] transition-colors shadow-md shadow-[#05568D]/30">
                <FaArrowUp className="text-white transform rotate-90 text-xs group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>

          <div className="relative flex justify-center items-center h-[380px] md:h-[450px] w-full max-w-[500px] mx-auto">
            {isLoadingHomeHeroImages ? (
              <div className="animate-pulse bg-gradient-to-r from-white/10 to-white/5 border border-white/5 w-full h-full rounded-2xl"></div>
            ) : (
              homeHeroImages?.map((item, index) => (
                <img
                  key={`${index}-${item.alt}`}
                  src={item.src}
                  alt={item.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  className={item.className}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 w-full shadow-md relative z-10">
        <div className="bg-white flex items-center justify-center py-4 px-6 border-b sm:border-b-0 sm:border-r border-slate-100">
          <div className="bg-slate-50 text-slate-700 rounded-full px-6 py-2.5 text-center text-xs md:text-sm font-semibold tracking-wide border border-slate-100 shadow-inner">
            🚀 Connect, Learn, and Build Tomorrow's Technology Together
          </div>
        </div>
        <div className="bg-[#05568D] rounded-bl-[24px] hidden sm:block shadow-inner" />
      </div>

      {/*  Discover Section */}
      <div className="px-6 md:px-12 py-16 container mx-auto space-y-12">
        <h2 className="flex flex-col sm:flex-row items-start sm:items-center text-base sm:text-xl lg:text-2xl gap-3 leading-snug">
          <span className="font-extrabold bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 rounded-tr-xl rounded-br-xl shadow-md shadow-red-600/10 whitespace-nowrap">
            Discover IEEE Al-Azhar SB
          </span>
          <span className="text-slate-800 font-bold tracking-tight">
            Empowering Future Innovators Through Connection and Knowledge
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center relative group">
            <div className="absolute inset-0 bg-[#05568D]/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all pointer-events-none"></div>
            <img
              src={discover}
              alt="About Section"
              className="w-full max-w-sm rounded-2xl shadow-xl border border-slate-200/60 object-cover transform transition duration-500 group-hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="space-y-6">
            <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
              IEEE Al-Azhar SB is dependent on the{" "}
              <strong className="text-slate-900 font-semibold">
                IEEE Egypt Section
              </strong>{" "}
              which was established on September 8, 1955, as the 2nd IEEE
              section outside the US, and the 2nd IEEE section in R8 (Africa,
              Europe and the Middle East). The IEEE Egypt section is supervising
              various activities in Egyptian Universities through IEEE student
              branches.
            </p>
            <Link
              to="/about"
              className="group inline-flex items-center gap-2.5 bg-[#05568D] hover:bg-[#033e66] text-white font-bold text-sm py-2.5 px-5 rounded-full transition-all duration-300 w-max shadow-md shadow-[#05568D]/20 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="transition-colors">
                See More About Us
              </span>
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white transition-all transform group-hover:translate-x-0.5 shadow-sm">
                <FaArrowUp className="text-[#05568D] transform rotate-90 text-[10px]" />
              </span>
            </Link>
          </div>
        </div>

        {/*  Events Title */}
        <h2 className="flex flex-col sm:flex-row items-start sm:items-center text-base sm:text-xl lg:text-2xl gap-3 pt-6">
          <span className="font-extrabold bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 rounded-tr-xl rounded-br-xl shadow-md shadow-red-600/10 whitespace-nowrap">
            Our Events
          </span>
          <span className="text-slate-800 font-bold tracking-tight">
            Stay Connected with the Latest Conferences, Workshops, and
            Competitions
          </span>
        </h2>
      </div>

      {/*  Events Slider Container */}
      <div className="mt-2 mb-12 container mx-auto">
        {events && <CardSlider cards={eventCards} />}
      </div>

      {/*  Committees Section */}
      <section className="w-full px-6 md:px-12 py-16 container mx-auto space-y-8">
        <h2 className="flex flex-col sm:flex-row items-start sm:items-center text-base sm:text-xl lg:text-2xl gap-3">
          <span className="font-extrabold bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 rounded-tr-xl rounded-br-xl shadow-md shadow-red-600/10 whitespace-nowrap">
            Our Committees
          </span>
          <span className="text-slate-800 font-bold tracking-tight">
            The Backbone of IEEE Al-Azhar SB — Where Vision Meets Action
          </span>
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pt-4">
          <div className="lg:w-1/2 w-full space-y-6">
            <h3 className="text-slate-600 text-base md:text-lg font-medium leading-relaxed">
              The Technical, Multimedia, and Operations Committees ensure the
              success of IEEE Al-Azhar SB. The Technical Committee advances
              innovation and research, the Multimedia Committee creates engaging
              visual content, and the Operations Committee manages logistics and
              planning. Together, they blend expertise, creativity, and
              organization to drive our branch forward.
            </h3>

            <Link
              to="/committees"
              className="group flex items-center gap-3 bg-[#05568D] hover:bg-[#033e66] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg shadow-[#05568D]/10 transform hover:scale-[1.02] w-max text-sm"
            >
              <span>Explore Committees</span>
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white transition-transform group-hover:translate-x-0.5">
                <FaArrowUp className="text-[#05568D] transform rotate-45 text-xs" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:w-1/2 w-full bg-slate-100/70 border border-slate-200/50 backdrop-blur-sm rounded-2xl p-6 shadow-inner">
            {committeesIntro.map((committee, index) => (
              <div
                key={`${index}-${committee.title}`}
                className={`${index % 2 === 0 && index > 0 ? "md:col-span-2" : ""}`}
              >
                <CardLogo
                  imageSrc={committee.imageSrc}
                  title={committee.title}
                  description={committee.description}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  Our Team Section */}
      <div className="px-6 pt-8 container mx-auto">
        <h2 className="flex flex-col sm:flex-row items-start sm:items-center text-base sm:text-xl lg:text-2xl gap-3">
          <span className="font-extrabold bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 rounded-tr-full rounded-br-full shadow-md shadow-red-600/10 whitespace-nowrap">
            Our Team
          </span>
          <span className="text-slate-800 font-bold tracking-tight">
            The Heart of IEEE Al-Azhar SB: Talented Individuals, Shared Goals
          </span>
        </h2>
      </div>

      <div className="mt-6 mb-16 mx-auto container">
        <CardSlider cards={officerCards} />
      </div>
    </div>
  );
};

export default Home;
