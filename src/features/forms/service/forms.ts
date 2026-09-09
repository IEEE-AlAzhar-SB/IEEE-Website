import { throwIfNotOk } from "../../../lib/apiError";
import {
  AdminFormDTO,
  CreateFormInput,
  UpdateFormInput,
  AddFieldInput,
  UpdateFieldInput,
  PublicFormDTO,
  SubmissionsResponse,
  ExportResponse,
  FormField,
} from "../types";

// ─── Public ───

export const getPublicForm = async (
  slug: string,
): Promise<PublicFormDTO | null> => {
  const res = await fetch(`/api/v1/forms/${slug}`, { credentials: "omit" });
  if (res.status === 404) return null;
  await throwIfNotOk(res);
  const json = await res.json();
  return json.data as PublicFormDTO;
};

export const submitForm = async (
  slug: string,
  data: Record<string, unknown>,
): Promise<{
  formSlug: string;
  submitterEmail: string;
  submittedAt: string;
}> => {
  const res = await fetch(`/api/v1/forms/${slug}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "omit",
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(
      json?.message ?? json?.error ?? `Request failed (${res.status})`,
    ) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return json.data;
};

// ─── Admin: Form lifecycle ───

export const listForms = async (): Promise<AdminFormDTO[]> => {
  const res = await fetch(`/api/v1/admin/forms`, { credentials: "include" });
  await throwIfNotOk(res);
  const json = await res.json();
  return (json.data ?? json) as AdminFormDTO[];
};

export const getFormDetail = async (slug: string): Promise<AdminFormDTO> => {
  const res = await fetch(`/api/v1/admin/forms/${slug}`, {
    credentials: "include",
  });
  await throwIfNotOk(res);
  const json = await res.json();
  return json.data as AdminFormDTO;
};

export const createForm = async (
  input: CreateFormInput,
): Promise<AdminFormDTO> => {
  const res = await fetch(`/api/v1/admin/forms`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  await throwIfNotOk(res);
  const json = await res.json();
  return json.data as AdminFormDTO;
};

export const updateForm = async (
  slug: string,
  input: UpdateFormInput,
): Promise<AdminFormDTO> => {
  const res = await fetch(`/api/v1/admin/forms/${slug}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  await throwIfNotOk(res);
  const json = await res.json();
  return json.data as AdminFormDTO;
};

export const updateFormStatus = async (
  slug: string,
  status: "active" | "closed",
): Promise<AdminFormDTO> => {
  const res = await fetch(`/api/v1/admin/forms/${slug}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  await throwIfNotOk(res);
  const json = await res.json();
  return json.data as AdminFormDTO;
};

export const deleteForm = async (slug: string): Promise<void> => {
  const res = await fetch(`/api/v1/admin/forms/${slug}`, {
    method: "DELETE",
    credentials: "include",
  });
  await throwIfNotOk(res);
  if (res.status === 204) return;
  await res.json();
};

// ─── Admin: Field management ───

export const addField = async (
  slug: string,
  input: AddFieldInput,
): Promise<FormField> => {
  const res = await fetch(`/api/v1/admin/forms/${slug}/fields`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  await throwIfNotOk(res);
  const json = await res.json();
  return json.data as FormField;
};

export const updateField = async (
  slug: string,
  fieldKey: string,
  input: UpdateFieldInput,
): Promise<FormField> => {
  const res = await fetch(`/api/v1/admin/forms/${slug}/fields/${fieldKey}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  await throwIfNotOk(res);
  const json = await res.json();
  return json.data as FormField;
};

export const deleteField = async (
  slug: string,
  fieldKey: string,
): Promise<void> => {
  const res = await fetch(`/api/v1/admin/forms/${slug}/fields/${fieldKey}`, {
    method: "DELETE",
    credentials: "include",
  });
  await throwIfNotOk(res);
  if (res.status === 204) return;
  await res.json();
};

export const reorderFields = async (
  slug: string,
  orderedKeys: string[],
): Promise<void> => {
  const res = await fetch(`/api/v1/admin/forms/${slug}/fields/reorder`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderedKeys }),
  });
  await throwIfNotOk(res);
  if (res.status === 204) return;
  await res.json();
};

// ─── Admin: Submissions ───

export const getSubmissions = async (
  slug: string,
  page = 1,
  limit = 50,
): Promise<SubmissionsResponse> => {
  const res = await fetch(
    `/api/v1/admin/forms/${slug}/submissions?page=${page}&limit=${limit}`,
    { credentials: "include" },
  );
  await throwIfNotOk(res);
  const json = await res.json();
  return json.data ?? json;
};

export const getExportData = async (slug: string): Promise<ExportResponse> => {
  const res = await fetch(`/api/v1/admin/forms/${slug}/submissions/export`, {
    credentials: "include",
  });
  await throwIfNotOk(res);
  const json = await res.json();
  return json.data ?? json;
};
