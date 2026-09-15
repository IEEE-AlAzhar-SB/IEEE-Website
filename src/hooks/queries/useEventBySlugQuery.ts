import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { getEventBySlug } from "../../service/events";

export const useEventBySlugQuery = (
  slug: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.events.bySlug(slug),
    queryFn: () => getEventBySlug(slug),
    enabled: options?.enabled ?? !!slug,
  });
};
