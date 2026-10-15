"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth/useAuth";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { sendForgotPassword, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    const email = data.email.trim().toLowerCase();

    try {
      const response = await sendForgotPassword({ email });

      toast.success(response.message || "Password reset code sent.");

      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send reset code. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {" "}
      <div className="space-y-2">
        {" "}
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          disabled={isLoading}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="h-11 w-full rounded-xl cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? "Sending code..." : "Send reset code"}
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
