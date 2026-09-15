import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchCategoryById } from "./api";

export const categoryKeys = {
  all: ["categories"] as const,
  list: (activeOnly?: boolean) => ["categories", "list", { activeOnly }] as const,
  detail: (id: string) => ["categories", "detail", id] as const,
};

/** Hook: list all categories (or active-only) */
export function useCategories(activeOnly = false) {
  return useQuery({
    queryKey: categoryKeys.list(activeOnly),
    queryFn: () => fetchCategories(activeOnly),
  });
}

/** Hook: single category by id */
export function useCategoryById(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => fetchCategoryById(id),
    enabled: Boolean(id),
  });
}
