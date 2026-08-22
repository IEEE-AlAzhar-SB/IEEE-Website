import { useQuery } from "@tanstack/react-query";
import { getSubmissions } from "../service/forms";
import { queryKeys } from "../../../lib/queryKeys";

export const useSubmissionsQuery = (slug: string, page = 1, limit = 50) => {
  return useQuery({
    queryKey: [...queryKeys.forms.submissions(slug), page, limit],
    queryFn: () => getSubmissions(slug, page, limit),
    enabled: !!slug,
  });
};
