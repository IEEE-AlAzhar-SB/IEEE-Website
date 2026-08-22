import { throwIfNotOk } from "../lib/apiError";

interface Committee {
  _id: string;
  name: string;
  type: string;
  description: string;
  logo: { asset: { url: string } };
}

export interface GroupedCommitteesResponse {
  technical: {
    "cs-fundamentals": Committee[];
    "software-development": Committee[];
    "systems-and-data": Committee[];
    engineering: Committee[];
  };
  operation: Committee[];
  branding: Committee[];
}

export const getCommittees = async (): Promise<GroupedCommitteesResponse> => {
  const res = await fetch(`/api/v1/committees`);
  await throwIfNotOk(res);
  const json = await res.json();
  return json.data ?? json;
};
