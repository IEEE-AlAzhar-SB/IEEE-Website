import { useParams, useNavigate } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { Card, CardSlider } from "../components";
import { useEventByIdQuery } from "../hooks";
import { usePublicFormQuery, DynamicForm } from "../features/forms";
import { submitForm } from "../features/forms/service/forms";

const EventDetails = () => {
  const { id } = useParams();

  if (!id) {
    const navigate = useNavigate();
    navigate("/events");
    return null;
  }

  const { data: event, isLoading, error } = useEventByIdQuery(id);

  if (!event) {
    return (
      <div className="p-6 text-center">
        <h1 className="my-24 text-xl font-bold">Event Not Found</h1>
      </div>
    );
  }

  return (
    <div>
      <section
        className={`relative h-[500px] w-full bg-center bg-cover ${
          !event.coverImage?.asset.url ? "" : "bg-blue-600"
        }`}
        style={
          event.coverImage?.asset.url
            ? { backgroundImage: `url(${event.coverImage.asset.url})` }
            : {}
        }
      />

      <div className="w-fit px-4 py-6 relative top-[-45px] bg-white m-auto rounded-2xl shadow-md mx-3 sm:mx-5 md:mx-10 lg:mx-20">
        <h2 className="flex flex-col text-center gap-2">
          <span
            className={`w-fit bg-blue-600 text-white px-3 py-1 rounded-tr-2xl rounded-br-2xl text-base sm:text-lg md:text-xl font-bold`}
          >
            {event.title}
          </span>
          <span className="text-[#1A1A1A] text-sm sm:text-base md:text-lg font-semibold">
            {event.subtitle}
          </span>
        </h2>
      </div>

      {event.speakers && event.speakers.length > 0 && (
        <div className="my-10 px-6">
          <h2 className="flex flex-col sm:flex-row items-start sm:items-center text-lg sm:text-2xl font-bold gap-2 mb-8">
            <span className="bg-red-600 text-white px-2 py-1 rounded-tr-2xl rounded-br-2xl">
              Our Speaker
            </span>
            <span className="text-[#1A1A1A]">
              Gain valuable knowledge from the brightest minds in tech and
              engineering.
            </span>
          </h2>{" "}
          <CardSlider
            cards={event.speakers.map((speaker, index) => (
              <Card
                key={`${index}-${speaker.title}`}
                title={speaker.title}
                name={speaker.name}
                text={""}
                imageSrc={speaker.photo?.asset.url ?? ""}
              />
            ))}
          />
        </div>
      )}
      {event.memories && event.memories.length > 0 && (
        <div className="my-10 px-6">
          <h2 className="flex flex-col sm:flex-row items-start sm:items-center text-lg sm:text-2xl font-bold gap-2 mb-8">
            <span className="bg-red-600 text-white px-2 py-1 rounded-tr-2xl rounded-br-2xl">
              Moments That Inspire
            </span>
            <span className="text-[#1A1A1A]">
              Capturing the highlights of our innovative and collaborative
              events.
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {event.memories.map((memory, index) => (
              <img
                key={`${index}-${memory.photo.asset?.url}`}
                src={memory.photo.asset?.url ?? ""}
                alt={`Memory ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>
      )}

      {event.formSlug ? (
        <EventFormSection formSlug={event.formSlug} />
      ) : (
        event.registrationLink && (
          <ExternalRegisterSection link={event.registrationLink} />
        )
      )}
    </div>
  );
};

export default EventDetails;

function ExternalRegisterSection({ link }: { link: string }) {
  return (
    <div className="my-10 px-6 container mx-auto max-w-3xl">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center items-center gap-3 bg-[#05568D] hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-full transition-all duration-300 shadow-md active:scale-95 w-full sm:w-auto"
      >
        <span>Register</span>
        <span className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full bg-white">
          <FaArrowUp className="text-[#05568D] transform rotate-45 text-[10px] md:text-xs" />
        </span>
      </a>
    </div>
  );
}

function EventFormSection({ formSlug }: { formSlug: string }) {
  const { data: form, isLoading, error } = usePublicFormQuery(formSlug);

  if (isLoading) {
    return (
      <div className="my-10 px-6 container mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-200 rounded w-96" />
          <div className="space-y-3 mt-6">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !form) return null;

  return (
    <div className="my-10 px-6 container mx-auto max-w-3xl">
      <h2 className="flex flex-col sm:flex-row items-start sm:items-center text-lg sm:text-2xl font-bold gap-2 mb-8">
        <span className="bg-red-600 text-white px-2 py-1 rounded-tr-2xl rounded-br-2xl">
          Registration
        </span>
        <span className="text-[#1A1A1A]">
          {form.description || "Register for this event."}
        </span>
      </h2>

      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm">
        <DynamicForm
          form={form}
          onSubmit={(data) => submitForm(form.slug, data).then(() => {})}
        />
      </div>
    </div>
  );
}
