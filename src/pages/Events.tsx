import { useEventsQuery } from "../hooks";
import { Section, CardEvent } from "../components";

const Events = () => {
  const { data: events } = useEventsQuery();

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Top Header Section */}
      <Section
        text={`We Are IEEE\nThe Heart of Student Tech`}
        additionalText="A community of tech enthusiasts driving innovation"
      />

      {/* Main Title Section */}
      <div className="px-4 sm:px-10 py-1 mt-8 container mx-auto">
        <h2 className="flex flex-col lg:flex-row items-start lg:items-center text-xl sm:text-2xl font-bold gap-3 lg:gap-4 mb-8 leading-relaxed">
          <span className="bg-red-600 text-white px-3 py-1.5 rounded-tr-2xl rounded-br-2xl text-sm sm:text-base whitespace-nowrap shadow-sm">
            Our Events
          </span>
          <span className="text-[#1A1A1A] text-base sm:text-lg font-medium">
            Dive into a variety of events that fuel learning, creativity, and
            discovery.
          </span>
        </h2>
      </div>

      {/* Events Grid Container */}
      <div className="px-4 sm:px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-6 container mx-auto mb-12">
        {events?.map((event, index) => {
          const count = events?.length ?? 0;
          const isFirst = index === 0;
          const isLast = index === count - 1;
          const isOrphan =
            isLast && (count - 1) % 2 === 1 && count > 1;
          const isFullWidth = isFirst || isOrphan;
          return (
            <div
              key={event._id}
              className={`${isFullWidth ? "md:col-span-2 w-full" : ""}`}
            >
              <CardEvent
                id={event._id}
                image={event.coverImage?.asset?.url ?? ""}
                title={event.title}
                text={event.subtitle ?? ""}
                date={`${new Date(event.startDate).toLocaleDateString()} - ${event.endDate ? new Date(event.endDate).toLocaleDateString() : "TBD"}`}
                location={event.location ?? ""}
                className={`${isFullWidth ? "grid grid-cols-1 lg:grid-cols-2 lg:max-w-none" : ""}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Events;
