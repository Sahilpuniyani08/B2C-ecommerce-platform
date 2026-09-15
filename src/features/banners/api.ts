import apiClient from "@/lib/api-client";
import type { Banner, CreateBannerInput, UpdateBannerInput } from "./types";

interface ApiResponse<T> { success: boolean; data: T; }

export async function fetchBanners(activeOnly = false): Promise<Banner[]> {
  const params = activeOnly ? { active: "true" } : {};
  const res = await apiClient.get<ApiResponse<Banner[]>>("/banners", { params });
  return res.data.data;
}

export async function fetchBannerById(id: string): Promise<Banner> {
  const res = await apiClient.get<ApiResponse<Banner>>(`/banners/${id}`);
  return res.data.data;
}

export async function createBanner(input: CreateBannerInput): Promise<Banner> {
  const res = await apiClient.post<ApiResponse<Banner>>("/banners", input);
  return res.data.data;
}

export async function updateBanner(id: string, input: UpdateBannerInput): Promise<Banner> {
  const res = await apiClient.patch<ApiResponse<Banner>>(`/banners/${id}`, input);
  return res.data.data;
}

export async function deleteBanner(id: string): Promise<void> {
  await apiClient.delete(`/banners/${id}`);
}
