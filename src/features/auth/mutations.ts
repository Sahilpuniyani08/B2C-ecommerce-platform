import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginAdmin, logoutAdmin } from "./api";
import { authKeys } from "./queries";
import type { LoginInput } from "./types";

export function useLoginAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => loginAdmin(input),
    onSuccess: (res) => {
      qc.setQueryData(authKeys.session, res);
      qc.invalidateQueries({ queryKey: authKeys.session });
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Login failed. Please try again.");
    },
  });
}

export function useLogoutAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      qc.clear();
      toast.success("Logged out successfully");
    },
    onError: () => {
      // Always allow logout to proceed in UI
      qc.clear();
    },
  });
}
