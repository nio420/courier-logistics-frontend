"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
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

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    control,
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
          readOnly
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

        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <InputOTP
              id="otp"
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={isResettingPassword}
              aria-invalid={Boolean(errors.otp)}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="^[0-9]*$"
            >
              <InputOTPGroup className="gap-2.5">
                <InputOTPSlot
                  index={0}
                  className="h-12 w-11 rounded-lg border border-input bg-muted/60 text-base font-semibold shadow-sm first:rounded-lg"
                />
                <InputOTPSlot
                  index={1}
                  className="h-12 w-11 rounded-lg border border-input bg-muted/60 text-base font-semibold shadow-sm"
                />
                <InputOTPSlot
                  index={2}
                  className="h-12 w-11 rounded-lg border border-input bg-muted/60 text-base font-semibold shadow-sm"
                />
                <InputOTPSlot
                  index={3}
                  className="h-12 w-11 rounded-lg border border-input bg-muted/60 text-base font-semibold shadow-sm"
                />
                <InputOTPSlot
                  index={4}
                  className="h-12 w-11 rounded-lg border border-input bg-muted/60 text-base font-semibold shadow-sm"
                />
                <InputOTPSlot
                  index={5}
                  className="h-12 w-11 rounded-lg border border-input bg-muted/60 text-base font-semibold shadow-sm last:rounded-lg"
                />
              </InputOTPGroup>
            </InputOTP>
          )}
        />

        {errors.otp && (
          <p className="text-xs text-destructive" role="alert">
            {errors.otp.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>

        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a new password"
            aria-invalid={Boolean(errors.newPassword)}
            disabled={isResettingPassword}
            className="pr-10"
            {...register("newPassword")}
          />

          <button
            type="button"
            onClick={() => setShowNewPassword((previous) => !previous)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            aria-label={
              showNewPassword ? "Hide new password" : "Show new password"
            }
            aria-pressed={showNewPassword}
            disabled={isResettingPassword}
          >
            {showNewPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        {errors.newPassword && (
          <p className="text-xs text-destructive" role="alert">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>

        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm your new password"
            aria-invalid={Boolean(errors.confirmPassword)}
            disabled={isResettingPassword}
            className="pr-10"
            {...register("confirmPassword")}
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword((previous) => !previous)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
            aria-pressed={showConfirmPassword}
            disabled={isResettingPassword}
          >
            {showConfirmPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

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
