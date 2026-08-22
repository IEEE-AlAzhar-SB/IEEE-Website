import { useQuery } from "@tanstack/react-query";
import { getFormDetail } from "../service/forms";
import { queryKeys } from "../../../lib/queryKeys";

export const useFormDetailQuery = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.forms.bySlug(slug),
    queryFn: () => getFormDetail(slug),
    enabled: !!slug,
  });
};
