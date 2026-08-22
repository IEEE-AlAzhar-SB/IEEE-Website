import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addField, updateField, deleteField, reorderFields } from "../service/forms";
import { queryKeys } from "../../../lib/queryKeys";
import { AddFieldInput, UpdateFieldInput } from "../types";

export const useAddField = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddFieldInput) => addField(slug, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.bySlug(slug) });
    },
  });
};

export const useUpdateField = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fieldKey, input }: { fieldKey: string; input: UpdateFieldInput }) =>
      updateField(slug, fieldKey, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.bySlug(slug) });
    },
  });
};

export const useDeleteField = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fieldKey: string) => deleteField(slug, fieldKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.bySlug(slug) });
    },
  });
};

export const useReorderFields = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedKeys: string[]) => reorderFields(slug, orderedKeys),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.bySlug(slug) });
    },
  });
};
