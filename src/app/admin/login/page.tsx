"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useLoginAdmin } from "@/features/auth/mutations";
import { useAdminSession } from "@/features/auth/queries";
import { SITE_CONFIG } from "@/config/site";
import { FormInput } from "@/components/forms/FormController";

interface LoginFormData {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useAdminSession();
  const loginMutation = useLoginAdmin();
  const [showPwd, setShowPwd] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.replace("/admin");
    }
  }, [session, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      router.replace("/admin");
    } catch (e) {
      // Error handled by mutation
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#677a5d]/20 border-t-[#677a5d] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c2119] flex items-center justify-center p-4 relative overflow-hidden font-body">
      {/* Background brand glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#677a5d]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#d76d81]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#677a5d] text-white shadow-lg mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-display font-bold text-3xl text-white tracking-tight">{SITE_CONFIG.name}</h1>
          <p className="text-[#c9d4bd] text-xs font-semibold uppercase tracking-widest mt-1">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-[#e5e0d5]">
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl text-[#1c2119]">Sign In</h2>
            <p className="text-xs text-[#7d796f] mt-1">Enter your credentials to access the admin dashboard.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Email Address"
              type="email"
              placeholder="admin@example.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address" },
              })}
            />

            <div>
              <div className="relative">
                <FormInput
                  label="Password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  error={errors.password?.message}
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-[34px] text-[#7d796f] hover:text-[#1c2119] transition-colors cursor-pointer"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error banner */}
            {loginMutation.isError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600 font-medium">
                {(loginMutation.error as Error)?.message ?? "Login failed. Please verify credentials."}
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 px-4 rounded-xl bg-[#677a5d] hover:bg-[#52634a] text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
            >
              {loginMutation.isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
