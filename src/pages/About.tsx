import firstPic from "../assets/about-img/firstpic.jpg";
import secondPic from "../assets/about-img/2rdpic.jpg";
import firstBox from "../assets/about-img/firstbox.svg";
import since2013 from "../assets/about-img/sence2013.svg";
import codeBaker from "../assets/about-img/codebaker.svg";
import workshops from "../assets/about-img/workshops.svg";
import since2018 from "../assets/about-img/sence2018.svg";

import { useBoardQuery } from "../hooks";
import { Section, CardSlider, Card } from "../components";
import { selectMemberPosition } from "../utils/member.position";
import { BoardMember } from "../types";

const stats = [
  { number: "+50", text: "Workshops" },
  { number: "+200", text: "Trainees" },
  { number: "+150", text: "Events" },
  { number: "+10", text: "Years Experience" },
];

const About = () => {
  const lastYear = new Date().getFullYear().toString();

  const { data, isLoading, error } = useBoardQuery({
    year: lastYear,
    memberType: "officer",
    position: "Chair",
  });
  const lastChairPerson = data?.officer ?? [];

  return (
    <div className="w-full overflow-hidden bg-gray-50/50">
      <Section
        text={`We Are IEEE\nThe Heart of Student Tech`}
        additionalText="A community of tech enthusiasts driving innovation"
      />

      <div className="container mx-auto px-4 relative -mt-24 z-30">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="w-[calc(50%-8px)] sm:w-40 md:w-48 lg:w-56 h-28 bg-white shadow-xl shadow-[#05568D]/10 rounded-2xl flex flex-col items-center justify-center text-center p-3 border border-gray-100/50 transform hover:-translate-y-1 transition duration-300"
            >
              <h2 className="text-[#05568D] text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                {item.number}
              </h2>
              <h3 className="text-gray-600 text-xs sm:text-sm lg:text-base font-semibold mt-1">
                {item.text}
              </h3>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          <h2 className="flex flex-col sm:flex-row items-start sm:items-center text-lg sm:text-2xl font-extrabold gap-3">
            <span className="bg-red-600 text-white px-4 py-1.5 rounded-r-2xl text-sm sm:text-base tracking-wide shadow-sm">
              About IEEE
            </span>
            <span className="text-[#1A1A1A] mt-1 sm:mt-0">
              Your First Step into the World of IEEE
            </span>
          </h2>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-8 items-center justify-between">
            <div className="w-full lg:w-1/2 max-w-xl">
              <img
                src={firstPic}
                alt="IEEE Al-Azhar Student Branch Group"
                className="w-full rounded-2xl shadow-lg object-cover aspect-[4/3] hover:scale-[1.02] transition duration-300"
                loading="lazy"
              />
            </div>
            <p className="w-full lg:w-1/2 text-gray-600 font-medium text-sm sm:text-base leading-8 text-justify">
              At IEEE Al-Azhar SB, we inspire the next generation of innovators
              by fostering a community of tech enthusiasts dedicated to learning
              and growth. We provide access to resources, mentorship, and
              real-world experiences, empowering students to excel in
              cutting-edge fields. Rooted in creativity, collaboration, and
              inclusivity, we aim to drive technological advancements that
              positively impact society.
            </p>
          </div>
        </div>

        <div className="mt-16 lg:mt-24">
          <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 items-center justify-between">
            <p className="w-full lg:w-1/2 text-gray-600 font-medium text-sm sm:text-base leading-8 text-justify">
              IEEE Al-Azhar SB operates under the IEEE Egypt Section,
              established in 1955 as the 2nd section outside the US and in the
              R8 region. The IEEE Egypt Section supports various student
              branches across Egyptian universities, promoting excellence in
              engineering and technology.
            </p>
            <div className="w-full lg:w-1/2 max-w-xl">
              <img
                src={secondPic}
                alt="IEEE Egypt Section Context"
                className="w-full rounded-2xl shadow-lg object-cover aspect-[4/3] hover:scale-[1.02] transition duration-300"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#05568D] to-[#033e66] rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl my-16 lg:my-24 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-extrabold text-center lg:text-left lg:w-2/5 leading-snug">
            How a Passion for Technology Sparked a Movement
          </h2>
          <div className="h-0.5 w-24 bg-white/30 lg:h-16 lg:w-0.5 hidden sm:block"></div>
          <p className="text-white/90 text-sm sm:text-base leading-8 text-center lg:text-left lg:w-3/5 font-medium">
            A shared passion for technology grew into a movement that drives
            innovation and learning. At IEEE, we empower students to push
            boundaries, collaborate, and lead. IEEE Al-Azhar SB, guided by the
            IEEE Egypt Section, nurtures future tech leaders and fosters a
            culture of creativity and excellence.
          </p>
        </div>

        <div className="my-12">
          <h2 className="flex flex-col sm:flex-row items-start sm:items-center text-lg sm:text-2xl font-bold gap-3 mb-12">
            <span className="bg-red-600 text-white px-4 py-1.5 rounded-r-2xl text-sm sm:text-base tracking-wide shadow-sm">
              What We've Accomplished
            </span>
            <span className="text-[#1A1A1A]">
              From Workshops to Networking, See What We Offer Our Members
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            <div className="bg-[#05568D] rounded-2xl p-8 text-white font-bold flex flex-col justify-center items-center text-center shadow-lg lg:col-start-2 lg:row-start-2 min-h-[220px]">
              <h3 className="text-2xl md:text-3xl font-black tracking-wide leading-tight">
                Our <br className="hidden lg:block" /> Achievements
              </h3>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-200/60 border border-gray-100 flex flex-col items-center text-center transition duration-300 hover:shadow-xl lg:col-start-2 lg:row-start-1">
              <img
                src={firstBox}
                alt="Achievement icon"
                className="w-14 h-14 object-contain mb-4"
                loading="lazy"
              />
              <p className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed">
                Coached 1500+ students in embedded systems, communications,
                electronics, and algorithms through workshops.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-200/60 border border-gray-100 flex flex-col items-center text-center transition duration-300 hover:shadow-xl lg:col-start-1 lg:row-start-2">
              <img
                src={since2013}
                alt="Achievement icon"
                className="w-14 h-14 object-contain mb-4"
                loading="lazy"
              />
              <p className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed">
                In 2013, we launched a summer training program on Algorithms,
                Web Development, and Cyber Security.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-200/60 border border-gray-100 flex flex-col items-center text-center transition duration-300 hover:shadow-xl lg:col-start-3 lg:row-start-2">
              <img
                src={codeBaker}
                alt="Achievement icon"
                className="w-14 h-14 object-contain mb-4"
                loading="lazy"
              />
              <p className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed">
                Launched and supervise the Code Bakers program, preparing
                students for IEEE Xtreme since 2013.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-200/60 border border-gray-100 flex flex-col items-center text-center transition duration-300 hover:shadow-xl lg:col-start-1 lg:row-start-3">
              <img
                src={workshops}
                alt="Achievement icon"
                className="w-14 h-14 object-contain mb-4"
                loading="lazy"
              />
              <p className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed">
                Directed workshops on English Skills, Programming,
                Microcontrollers, Web Development, Cyber Security, and Linux.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-200/60 border border-gray-100 flex flex-col items-center text-center transition duration-300 hover:shadow-xl lg:col-start-3 lg:row-start-3">
              <img
                src={since2018}
                alt="Achievement icon"
                className="w-14 h-14 object-contain mb-4"
                loading="lazy"
              />
              <p className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed">
                In 2018, 2019, and 2020, IEEE Al-Azhar teams achieved top 4
                local ranks and strong international placements in IEEE Xtreme.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6">
          {isLoading && <p>Loading...</p>}
          {error && (
            <p className="text-red-600 font-bold">
              Failed to load content. Please try again later.
            </p>
          )}

          {/* 🚨 العرض المصحح: نتحقق من أن lastChairmen مصفوفة ونقوم بتمريرها */}
          {!isLoading && lastChairPerson.length > 0 ? (
            <CardSlider
              cards={lastChairPerson.map((chairPerson: BoardMember) => (
                <Card
                  key={chairPerson.id}
                  name={chairPerson.name}
                  text={selectMemberPosition(chairPerson, chairPerson.gender)}
                  imageSrc={chairPerson.image_url}
                  linkedinLink={chairPerson.linkedin_url}
                  publicId={chairPerson.image_public_id}
                />
              ))}
            />
          ) : !isLoading && !error ? (
            <p>No past chairmen data available.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default About;
