import { useQuery } from "@tanstack/react-query";
import { getPublicForm } from "../service/forms";
import { queryKeys } from "../../../lib/queryKeys";

export const usePublicFormQuery = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.forms.publicBySlug(slug),
    queryFn: () => getPublicForm(slug),
    enabled: !!slug,
  });
};
