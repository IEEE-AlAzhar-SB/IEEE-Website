import { throwIfNotOk } from "../lib/apiError";

interface BoardQueryParams {
  yearFrom: string;
  yearTo?: string;
  memberType: string;
  position?: string;
  track?: string;
}

interface CreateMemberDTO {
  formData: FormData;
}

interface DeleteMemberDTO {
  id: string;
}

interface UpdateMemberDTO extends CreateMemberDTO, DeleteMemberDTO {}

export type MemberType = "officers" | "operation" | "technical" | "branding";

export interface BoardMetaResponse {
  memberTypes: MemberType[];
  genders: ("male" | "female")[];
  allowedPositionsByType: Record<string, string[]>;
  allowedTracksByType: Record<string, string[]>;
  technicalTrackGroups: Record<string, string[]>;
}

export const fetchBoardMeta = async (): Promise<BoardMetaResponse> => {
  const res = await fetch(`/api/v1/board/meta`);
  await throwIfNotOk(res);
  const json = await res.json();
  return json.data;
};

export const fetchBoard = async (params: BoardQueryParams) => {
  const searchParams = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined) as [
      string,
      string,
    ][],
  );

  const res = await fetch(`/api/v1/board?${searchParams}`);
  await throwIfNotOk(res);
  const json = await res.json();
  return json.data ?? json;
};

export const fetchBoardYears = async () => {
  const res = await fetch(`/api/v1/board/years`);
  await throwIfNotOk(res);
  const json = await res.json();
  return (json.data?.years ?? json.years) as string[];
};

export const createBoardMember = async ({ formData }: CreateMemberDTO) => {
  const res = await fetch(`/api/v1/board`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  await throwIfNotOk(res);
  const json = await res.json();
  return json;
};

export const updateBoardMember = async ({ id, formData }: UpdateMemberDTO) => {
  const res = await fetch(`/api/v1/board/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });
  await throwIfNotOk(res);
  const json = await res.json();
  return json;
};

export const deleteBoardMember = async ({ id }: DeleteMemberDTO) => {
  const res = await fetch(`/api/v1/board/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  await throwIfNotOk(res);

  if (res.status === 204) return;
  const json = await res.json();
  return json;
};
