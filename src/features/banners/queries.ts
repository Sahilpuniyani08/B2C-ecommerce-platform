import { useQuery } from "@tanstack/react-query";
import { fetchBanners, fetchBannerById } from "./api";

export const bannerKeys = {
  all: ["banners"] as const,
  list: (activeOnly?: boolean) => ["banners", "list", { activeOnly }] as const,
  detail: (id: string) => ["banners", "detail", id] as const,
};

export function useBanners(activeOnly = false) {
  return useQuery({
    queryKey: bannerKeys.list(activeOnly),
    queryFn: () => fetchBanners(activeOnly),
  });
}

export function useBannerById(id: string) {
  return useQuery({
    queryKey: bannerKeys.detail(id),
    queryFn: () => fetchBannerById(id),
    enabled: Boolean(id),
  });
}
