import { useQuery } from "@tanstack/react-query";
import { listForms } from "../service/forms";
import { queryKeys } from "../../../lib/queryKeys";

export const useFormsQuery = () => {
  return useQuery({
    queryKey: queryKeys.forms.all,
    queryFn: listForms,
  });
};
