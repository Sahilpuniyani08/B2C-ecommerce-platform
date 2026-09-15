import apiClient from "@/lib/api-client";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "./types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** GET /api/categories */
export async function fetchCategories(activeOnly = false): Promise<Category[]> {
  const params = activeOnly ? { active: "true" } : {};
  const res = await apiClient.get<ApiResponse<Category[]>>("/categories", { params });
  return res.data.data;
}

/** GET /api/categories/[id] */
export async function fetchCategoryById(id: string): Promise<Category> {
  const res = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
  return res.data.data;
}

/** POST /api/categories (Admin) */
export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const res = await apiClient.post<ApiResponse<Category>>("/categories", input);
  return res.data.data;
}

/** PATCH /api/categories/[id] (Admin) */
export async function updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
  const res = await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, input);
  return res.data.data;
}

/** DELETE /api/categories/[id] (Admin) */
export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}
