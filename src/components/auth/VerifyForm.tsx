"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  type VerifyEmailInput,
  verifyEmailSchema,
} from "@/schemas/auth.schema";

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const {
    verifyEmailOtp,
    isVerifyingEmail,
    resendVerificationOtp,
    isResendingOtp,
  } = useAuth();

  const [secondsLeft, setSecondsLeft] = useState(30);

  const form = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
    mode: "onBlur",
    defaultValues: {
      email,
      otp: "",
    },
  });

  // Keep the email field synchronized with the URL query parameter.
  useEffect(() => {
    form.setValue("email", email, {
      shouldValidate: true,
    });
  }, [email, form]);

  // Countdown for the resend button.
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = window.setTimeout(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  async function handleSubmit(data: VerifyEmailInput) {
    try {
      await verifyEmailOtp({
        email: data.email.trim(),
        otp: data.otp,
      });

      toast.success("Email verified successfully.");
      router.replace("/login");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "OTP verification failed. Please try again.",
      );
    }
  }

  async function handleResend() {
    if (secondsLeft > 0 || isResendingOtp || !email) {
      return;
    }

    try {
      await resendVerificationOtp({ email });

      form.setValue("otp", "");
      form.clearErrors("otp");
      setSecondsLeft(30);

      toast.success("A new OTP has been sent to your email.");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to resend OTP. Please try again.",
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
          <Mail className="size-7 text-primary" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Enter the 6-digit verification code sent to your email address.
        </p>
      </div>

      {!email && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          Email address is missing. Please register again to continue.
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="verification-email" className="text-sm font-medium">
            Email address
          </label>

          <Input
            id="verification-email"
            type="email"
            value={email}
            readOnly
            aria-readonly="true"
            className="h-11 bg-muted"
          />

          {form.formState.errors.email?.message && (
            <p className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-center text-sm font-medium">
            Verification code
          </label>

          <Controller
            control={form.control}
            name="otp"
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value.replace(/\D/g, ""));
                }}
                onBlur={field.onBlur}
                disabled={isVerifyingEmail || !email}
                aria-label="6-digit verification code"
                containerClassName="justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />

          {form.formState.errors.otp?.message && (
            <p role="alert" className="text-center text-sm text-destructive">
              {form.formState.errors.otp.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="h-11 w-full"
          disabled={
            isVerifyingEmail || !email || form.watch("otp").length !== 6
          }
        >
          {isVerifyingEmail ? "Verifying..." : "Verify email"}
        </Button>
      </form>

      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive the code?
        </p>

        <Button
          type="button"
          variant="ghost"
          className="gap-2"
          onClick={handleResend}
          disabled={
            secondsLeft > 0 || isVerifyingEmail || isResendingOtp || !email
          }
        >
          <RefreshCw className="size-4" />
          {isResendingOtp
            ? "Sending OTP..."
            : secondsLeft > 0
              ? `Resend OTP in ${secondsLeft}s`
              : "Resend OTP"}
        </Button>
      </div>
    </div>
  );
}
