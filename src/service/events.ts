import { throwIfNotOk } from "../lib/apiError";

interface Speaker {
  name: string;
  title: string;
  photo?: Image;
}

interface Image {
  asset: { url: string };
}

export interface SanityEvent {
  _id: string;
  title: string;
  slug: { current: string };
  startDate: string;
  endDate: string;
  startDateSecondV?: string;
  endDateSecondV?: string;
  location?: string;
  subtitle?: string;
  registrationLink?: string;
  coverImage?: Image;
  speakers?: Speaker[];
  memories?: { photo: Image }[];
  formSlug?: string | null;
}

export const getEvents = async (): Promise<SanityEvent[]> => {
  const res = await fetch(`/api/v1/events`);
  await throwIfNotOk(res);
  const json = await res.json();
  return (json.data ?? json) as SanityEvent[];
};

export const getEventById = async (id: string): Promise<SanityEvent> => {
  const res = await fetch(`/api/v1/events/${id}`);
  await throwIfNotOk(res);
  const json = await res.json();
  return (json.data ?? json) as SanityEvent;
};
