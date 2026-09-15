import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createBanner, updateBanner, deleteBanner } from "./api";
import { bannerKeys } from "./queries";
import type { CreateBannerInput, UpdateBannerInput } from "./types";
import { getErrorMessage } from "@/lib/api-client";

export function useCreateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBannerInput) => createBanner(input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: bannerKeys.all });
      toast.success(`Banner "${data.title}" created`);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useUpdateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBannerInput }) =>
      updateBanner(id, input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: bannerKeys.all });
      toast.success(`Banner "${data.title}" updated`);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBanner(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bannerKeys.all });
      toast.success("Banner deleted");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}
