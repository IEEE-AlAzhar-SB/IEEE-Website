import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { getEventById } from "../../service/events";

export const useEventByIdQuery = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.events.byId(id),
    queryFn: () => getEventById(id),
    enabled: options?.enabled ?? !!id,
  });
};
