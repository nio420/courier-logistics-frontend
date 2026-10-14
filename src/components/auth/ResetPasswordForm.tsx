"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth/useAuth";

const resetPasswordSchema = z
  .object({
    email: z.string().trim().email("Please enter a valid email address."),
    otp: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Enter the 6-digit code sent to your email."),
    newPassword: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { reset, isResettingPassword } = useAuth();

  const emailFromUrl = searchParams.get("email") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromUrl,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ResetPasswordFormData) {
    const payload = {
      email: data.email.trim().toLowerCase(),
      otp: data.otp.trim(),
      newPassword: data.newPassword,
    };

    try {
      const response = await reset(payload);

      toast.success(response.message || "Password reset successfully.");
      router.replace("/login");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Password reset failed. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          disabled={isResettingPassword}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp">Reset code</Label>
        <Input
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="Enter your 6-digit code"
          aria-invalid={Boolean(errors.otp)}
          disabled={isResettingPassword}
          {...register("otp")}
        />
        {errors.otp && (
          <p className="text-xs text-destructive" role="alert">
            {errors.otp.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Create a new password"
          aria-invalid={Boolean(errors.newPassword)}
          disabled={isResettingPassword}
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-xs text-destructive" role="alert">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your new password"
          aria-invalid={Boolean(errors.confirmPassword)}
          disabled={isResettingPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="h-11 w-full rounded-xl"
        disabled={isResettingPassword}
      >
        {isResettingPassword ? "Resetting password..." : "Reset password"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Back to login
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-muted-foreground">
          Loading reset form...
        </p>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
