import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createForm, updateForm, updateFormStatus, deleteForm } from "../service/forms";
import { queryKeys } from "../../../lib/queryKeys";
import { CreateFormInput, UpdateFormInput } from "../types";

export const useCreateForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateFormInput) => createForm(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
};

export const useUpdateForm = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateFormInput) => updateForm(slug, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.bySlug(slug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
    },
  });
};

export const useUpdateFormStatus = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: "active" | "closed") => updateFormStatus(slug, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.bySlug(slug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
};

export const useDeleteForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => deleteForm(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
};
