import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBoardMember,
  updateBoardMember,
  deleteBoardMember,
} from "../../service/board";
import { queryKeys } from "../../lib/queryKeys";

export const useCreateBoardMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoardMember,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.board.all,
        exact: false,
      });
      const previous = queryClient.getQueriesData({
        queryKey: queryKeys.board.all,
        exact: false,
      });
      return { previous };
    },
    onError: (_, __, context) => {
      context?.previous?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey as unknown[], data);
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.board.all,
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.boardYears.all });
    },
  });
};

export const useUpdateBoardMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBoardMember,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.board.all,
        exact: false,
      });
      const previous = queryClient.getQueriesData({
        queryKey: queryKeys.board.all,
        exact: false,
      });

      // Optimistic patch: merge formData entries onto the existing cached item(s)
      try {
        const { id, formData } = variables as any;
        const optimisticValues = {
          name: formData.get("name") as string,
          bio: formData.get("bio") as string,
          position: formData.get("position") as string,
          memberType: formData.get("memberType") as string,
          track: formData.get("track") as string,
          gender: formData.get("gender") as string,
          linkedin_url: formData.get("linkedin_url") as string,
          // CRITICAL: Parse the number!
          boardYear: Number(formData.get("boardYear")),
        };

        // Remove undefined/null values so they don't overwrite good data with nulls
        Object.keys(optimisticValues).forEach((key) => {
          if (
            optimisticValues[key as keyof typeof optimisticValues] === undefined
          ) {
            delete optimisticValues[key as keyof typeof optimisticValues];
          }
        });

        const queries = queryClient.getQueriesData({
          queryKey: queryKeys.board.all,
          exact: false,
        });
        queries.forEach(([qKey, cached]) => {
          if (!cached) return;
          if (Array.isArray(cached)) {
            queryClient.setQueryData(qKey as unknown[], (old: any[]) => {
              if (!old) return old;
              const next = old.map((item) =>
                item.id === id || item._id === id
                  ? { ...item, ...optimisticValues }
                  : item,
              );
              return next;
            });
            // Inside your onMutate object patch logic:
          } else if (typeof cached === "object") {
            queryClient.setQueryData(qKey as unknown[], (old: any) => {
              if (!old) return old;
              const copy: Record<string, any[]> = { ...old };

              let foundMember: any = null;
              let originalCategory = "";

              // 1. Find and extract the member
              Object.keys(copy).forEach((k) => {
                if (Array.isArray(copy[k])) {
                  const index = copy[k].findIndex(
                    (item) => item.id === id || item._id === id,
                  );
                  if (index !== -1) {
                    foundMember = { ...copy[k][index] };
                    originalCategory = k;
                    // Remove from old category
                    copy[k] = copy[k].filter(
                      (item) => item.id !== id && item._id !== id,
                    );
                  }
                }
              });

              if (foundMember) {
                // 2. Apply optimistic updates
                const updatedMember = { ...foundMember, ...optimisticValues };

                // 3. Determine the new category (fallback to original if not changing)
                const targetCategory =
                  optimisticValues.memberType || originalCategory;

                // 4. Insert into the correct array
                if (copy[targetCategory]) {
                  copy[targetCategory] = [
                    ...copy[targetCategory],
                    updatedMember,
                  ];
                } else {
                  // Fallback if the array doesn't exist for some reason
                  copy[originalCategory] = [
                    ...copy[originalCategory],
                    updatedMember,
                  ];
                }
              }

              return copy;
            });
          }
        });
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error(
            "[board-mutation][update][onMutate] optimistic patch error",
            err,
          );
        }
      }

      return { previous };
    },

    onError: (err, _variables, context) => {
      // Never log mutation variables: they contain member PII / FormData.
      if (import.meta.env.DEV) {
        console.error("[useUpdateBoardMember][onError] Mutation failed.", err);
      }
      context?.previous?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey as unknown[], data);
      });
    },
    onSuccess: async (data, variables) => {
      try {
        const updatedMember =
          data?.data ?? data?.member ?? data?.boardMember ?? data;
        const memberId =
          variables?.id || updatedMember?.id || updatedMember?._id;

        if (memberId) {
          const queries = queryClient.getQueriesData({
            queryKey: queryKeys.board.all,
            exact: false,
          });
          const patchedKeys: unknown[] = [];

          queries.forEach(([qKey, cached]) => {
            let newCached: any = cached;
            let replacedCount = 0;
            if (Array.isArray(cached)) {
              newCached = (cached as any[]).map((item) => {
                if (item.id === memberId || item._id === memberId) {
                  replacedCount++;
                  return { ...item, ...updatedMember };
                }
                return item;
              });
            } else if (cached && typeof cached === "object") {
              newCached = { ...(cached as Record<string, any>) };
              Object.keys(newCached).forEach((k) => {
                if (Array.isArray(newCached[k])) {
                  newCached[k] = (newCached[k] as any[]).map((item) => {
                    if (item.id === memberId || item._id === memberId) {
                      replacedCount++;
                      return { ...item, ...updatedMember };
                    }
                    return item;
                  });
                }
              });
            }
            if (replacedCount > 0) {
              patchedKeys.push(qKey);
            }
            queryClient.setQueryData(qKey as unknown[], newCached);
          });

          // Immediately refetch the specific queries we patched to ensure fresh authoritative data
          for (const k of patchedKeys) {
            try {
              await queryClient.refetchQueries({
                queryKey: k as any[],
                exact: true,
              });
            } catch (refErr) {
              if (import.meta.env.DEV) {
                console.error(
                  "[board-mutation][update][onSuccess] refetch error",
                  refErr,
                );
              }
            }
          }
        } else {
          if (import.meta.env.DEV) {
            console.warn(
              "[useUpdateBoardMember][onSuccess] No memberId found, skipping manual cache patching.",
            );
          }
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error(
            "[board-mutation][update][onSuccess] patch cache error",
            err,
          );
        }
      }
      // Invalidate to trigger fresh refetches for any remaining entries
      queryClient.invalidateQueries({
        queryKey: queryKeys.board.all,
        exact: false,
      });
      // If an update changes the member's boardYear, ensure years list is refreshed
      queryClient.invalidateQueries({ queryKey: queryKeys.boardYears.all });
    },
  });
};

export const useDeleteBoardMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBoardMember,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.board.all,
        exact: false,
      });
      const previous = queryClient.getQueriesData({
        queryKey: queryKeys.board.all,
        exact: false,
      });

      // Optimistically remove the member from the cache
      try {
        const queries = queryClient.getQueriesData({
          queryKey: queryKeys.board.all,
          exact: false,
        });

        queries.forEach(([qKey, cached]) => {
          if (!cached) return;

          if (Array.isArray(cached)) {
            queryClient.setQueryData(qKey as unknown[], (old: any[]) => {
              if (!old) return old;
              return old.filter((item) => item.id !== id && item._id !== id);
            });
          } else if (typeof cached === "object") {
            queryClient.setQueryData(qKey as unknown[], (old: any) => {
              if (!old) return old;
              const copy: Record<string, any[]> = { ...old };
              Object.keys(copy).forEach((k) => {
                if (Array.isArray(copy[k])) {
                  copy[k] = copy[k].filter(
                    (item) => item.id !== id && item._id !== id,
                  );
                }
              });
              return copy;
            });
          }
        });
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error(
            "[board-mutation][delete][onMutate] optimistic delete error",
            err,
          );
        }
      }

      return { previous };
    },
    onError: (_, __, context) => {
      context?.previous?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey as unknown[], data);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.board.all,
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.boardYears.all });
    },
  });
};
