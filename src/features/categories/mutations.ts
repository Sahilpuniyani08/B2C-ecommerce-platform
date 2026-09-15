import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCategory, updateCategory, deleteCategory } from "./api";
import { categoryKeys } from "./queries";
import type { CreateCategoryInput, UpdateCategoryInput } from "./types";
import { getErrorMessage } from "@/lib/api-client";

/** Mutation: create category */
export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => createCategory(input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success(`Category "${data.name}" created successfully`);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });
}

/** Mutation: update category */
export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
      updateCategory(id, input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success(`Category "${data.name}" updated`);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });
}

/** Mutation: delete category */
export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Category deleted");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });
}
