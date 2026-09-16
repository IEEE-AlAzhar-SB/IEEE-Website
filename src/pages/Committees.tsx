import { useState } from "react";
import { Section, CardLogo } from "../components";
import { useCommitteesQuery } from "../hooks";
import { CommitteesType } from "../types";

const COMMITTEE_TITLES = {
  operation:
    "The Backbone of Strategic Execution, Empowering Every Initiative and Driving Long-Term Success.",
  branding:
    "Our events foster creativity and teamwork, pushing the boundaries of technology.",
  technical: "Your First Step into the World of Technical.",
};

const Committees = () => {
  const [activeTab, setActiveTab] = useState<CommitteesType>("technical");
  const { data: committees, isLoading, error } = useCommitteesQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Failed to load committees. Please try again later.</div>;
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Section Header */}
      <Section
        text="Empowering Through Action"
        additionalText="Committees working together to achieve our goals."
      />

      <div className="container mx-auto px-4 sm:px-10 mb-6">
        {/* Tabs Control Wrapper */}
        <div className="px-10 pt-3 2xl:pt-16">
          <div className="flex flex-col sm:flex-row mx-auto items-center gap-2 sm:gap-4 bg-[#acabab30] p-1 rounded-2xl sm:rounded-full w-full sm:w-fit mb-4">
            {committees &&
              Object.keys(committees).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveTab(section as CommitteesType)}
                  className={`px-4 py-1 text-white ${
                    activeTab === section ? "bg-[#05568D]" : "bg-gray-400"
                  } rounded-full w-full sm:w-auto mb-2 sm:mb-0`}
                >
                  {section} Section
                </button>
              ))}
          </div>
        </div>

        {/* Title & Description Section */}
        <h2 className="flex flex-col lg:flex-row items-start lg:items-center text-xl sm:text-2xl font-bold gap-3 lg:gap-4 leading-relaxed">
          <span className="bg-red-600 text-white px-3 py-1.5 rounded-tr-full rounded-br-full text-sm sm:text-base whitespace-nowrap shadow-sm capitalize">
            {`${activeTab} Committee`}
          </span>
          <span className="text-[#1A1A1A] text-base sm:text-lg font-medium">
            {COMMITTEE_TITLES[activeTab]}
          </span>
        </h2>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 sm:px-10 mt-6 mb-12">
        {committees && activeTab === "technical" && (
          <div className="flex flex-col gap-10">
            {Object.entries(committees.technical).map(([subSectionKey, cards]) => (
              <div key={subSectionKey} className="flex flex-col gap-4">
                {/* Sub-section Heading */}
                <h3 className="text-lg sm:text-xl font-bold capitalize text-[#05568D] border-b pb-2">
                  {subSectionKey.replaceAll("-", " ")}
                </h3>
                {/* Inner Grid for this specific sub-section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cards.map((card) => (
                    <CardLogo
                      key={card._id}
                      imageSrc={card.logo?.asset?.url || ""}
                      title={card.name}
                      description={card.description}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Flat Layout for Operation and Branding */}
        {committees && activeTab !== "technical" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {committees[activeTab as Exclude<CommitteesType, "technical">]?.map((card) => (
              <CardLogo
                key={card._id}
                imageSrc={card.logo?.asset?.url || ""}
                title={card.name}
                description={card.description}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Committees;
