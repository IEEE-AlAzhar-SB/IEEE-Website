import { Fragment, useCallback, useMemo, useState } from "react";

import { useBoardQuery } from "../hooks";
import { Section, CardSlider, Card, BoardYearSelector } from "../components";
import { selectMemberPosition } from "../utils/member.position";
import { BoardMember, BoardMemberType } from "../types";

// Keep this clean configuration
const sectionsToRender: { title: string; key: BoardMemberType; subtitle: string }[] = [
  { title: "Our Officers", key: "officer", subtitle: "The Heart of IEEE Al-Azhar SB: Talented Individuals, Shared Goals" },
  { title: "Technical Board", key: "technical", subtitle: "Our main focus, the technical genius" },
  { title: "Branding Board", key: "branding", subtitle: "Our creative force, the branding guru" },
  { title: "Operation Board", key: "operation", subtitle: "Our operational force, the operation guru" },
];

// Simple helper to transform "software-development" into "Software Development"
const formatTrackTitle = (slug: string) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const Board = () => {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );

  const { data, isLoading, error } = useBoardQuery({
    year: selectedYear,
    memberType: "officer,technical,operation,branding",
  });

  // Memoize derived data so year/type switches don't recompute on
  // every render; renderers are stable callbacks for memoized sliders.
  const flatBoardData = useMemo(
    () => ({
      officer: data?.officer ?? [],
      branding: data?.branding ?? [],
      operation: data?.operation ?? [],
    }),
    [data],
  );

  const technicalData: Record<string, BoardMember[]> = useMemo(
    () => data?.technical ?? {},
    [data],
  );

  const fallbackGender = data?.officer?.[0]?.gender;

  // Extracted slider renderer to keep the code DRY
  const renderSlider = useCallback(
    (members: BoardMember[]) => (
      <CardSlider
        cards={members.map((member) => {
          const position = selectMemberPosition(member, fallbackGender);

          return (
            <Card
              key={member.id}
              name={member.name}
              text={position}
              imageSrc={member.image_url}
              linkedinLink={member.linkedin_url}
              publicId={member.image_public_id}
            />
          );
        })}
      />
    ),
    [fallbackGender],
  );

  // Standard renderer for normal flat sections
  const renderStandardSection = useCallback(
    (title: string, subtitle: string, members: BoardMember[]) => {
      if (!members || members.length === 0) return null;

    return (
      <Fragment key={title}>
        <div className="py-1 mt-6 px-4 sm:px-6">
          <h2 className="flex flex-col sm:flex-row items-start sm:items-center text-lg sm:text-2xl font-bold gap-2 capitalize">
            <span className="bg-red-600 text-white px-2 py-1 rounded-r-full">
              {title}
            </span>
            <span className="text-[#000000]">
              {subtitle}
            </span>
          </h2>
        </div>
        {renderSlider(members)}
      </Fragment>
      );
    },
    [renderSlider],
  );

  // Dedicated renderer for the technical section and its sub-tracks
  const renderTechnicalSection = useCallback(
    (mainTitle: string, subtitle: string) => {
      const trackEntries = Object.entries(technicalData);
      if (trackEntries.length === 0) return null;

    return (
      <Fragment key={mainTitle}>
        {/* Main Technical Section Header */}
        <div className="py-1 mt-6 px-4 sm:px-6">
          <h2 className="flex flex-col sm:flex-row items-start sm:items-center text-lg sm:text-2xl font-bold gap-2 capitalize">
            <span className="bg-red-600 text-white px-2 py-1 rounded-r-full">
              {mainTitle}
            </span>
            <span className="text-[#000000]">
              {subtitle}
            </span>
          </h2>
        </div>

        {/* Dynamic sub-sections for each track layout */}
        <div className="space-y-6 pl-2 sm:pl-4 mt-4">
          {trackEntries.map(([trackKey, members]) => {
            if (!members || members.length === 0) return null;

            return (
              <div key={trackKey} className="space-y-2">
                <h3 className="text-md sm:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-1 inline-block">
                  {formatTrackTitle(trackKey)}
                </h3>
                {renderSlider(members)}
              </div>
            );
          })}
        </div>
      </Fragment>
      );
    },
    [technicalData, renderSlider],
  );

  // Extracted slider renderer to keep the code DRY (removed duplicate)

  return (
    <div className="w-full overflow-hidden bg-gray-50/50">
      <Section
        text={`We Are IEEE\nThe Heart of Student Tech`}
        additionalText="A community of tech enthusiasts driving innovation"
      />

      <div className="container mx-auto py-6 space-y-8">
        <div className="px-10 flex justify-end items-center gap-4">
          <BoardYearSelector selectedYear={selectedYear} onYearChange={setSelectedYear} />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <p>Loading…</p>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-600 font-bold">
              Failed to load board members. Please try again later.
            </p>
          </div>
        )}

        {!isLoading &&
          !error &&
          sectionsToRender.map((section) => {
            if (section.key === "technical") {
              return renderTechnicalSection(section.title, section.subtitle);
            }
            return renderStandardSection(
              section.title,
               section.subtitle,
              flatBoardData[section.key as Exclude<BoardMemberType, "technical">],
            );
          })}
      </div>
    </div>
  );
};

export default Board;
