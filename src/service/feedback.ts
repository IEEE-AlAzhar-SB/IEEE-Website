import { throwIfNotOk } from "../lib/apiError";

export type FeedbackStatus = "unread" | "read" | "archived" | "resolved";

export interface FeedbackPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface FeedbackItem {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: FeedbackStatus;
  createdAt: string;
  date?: string;
}

interface DeleteFeedbackDTO {
  id: string;
}

export const submitFeedback = async (payload: FeedbackPayload) => {
  const res = await fetch(`/api/v1/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  await throwIfNotOk(res);

  return res.json();
};

interface UpdateFeedbackStatusDTO extends DeleteFeedbackDTO {
  status: FeedbackStatus;
}

export const getFeedbacks = async (): Promise<FeedbackItem[]> => {
  const res = await fetch(`/api/v1/feedback`, {
    credentials: "include",
  });
  await throwIfNotOk(res);
  const json = await res.json();
  return (json.data ?? json) as FeedbackItem[];
};

export const updateFeedbackStatus = async ({
  id,
  status,
}: UpdateFeedbackStatusDTO) => {
  const res = await fetch(
    `/api/v1/feedback/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  await throwIfNotOk(res);
  return res.json();
};

export const deleteFeedback = async ({ id }: DeleteFeedbackDTO) => {
  const res = await fetch(`/api/v1/feedback/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });
  await throwIfNotOk(res);

  if (res.status === 204) return;
  const data = await res.json();

  return data;
};
