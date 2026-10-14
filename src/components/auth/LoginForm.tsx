"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, ShieldCheck, Truck, UserRound } from "lucide-react";
import Image from "next/image"; // 👈 Image import করা হয়েছে
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/useAuth";
import { getCurrentUser } from "@/lib/api/auth";
import { getDashboardPath } from "@/lib/auth/token-storage";
import { type LoginInput, loginSchema } from "@/schemas/auth.schema";

const demoAccounts = [
  {
    role: "Admin",
    email: "admin@courier.com",
    password: "Admin@123456",
    icon: ShieldCheck,
    description: "Administrator access",
    color: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100",
  },
  {
    role: "Courier",
    email: "omitvici@gmail.com",
    password: "Pt!12345",
    icon: Truck,
    description: "Courier access",
    color: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
  },
  {
    role: "Customer",
    email: "naimulislamomit2002@gmail.com",
    password: "Mike@2026",
    icon: UserRound,
    description: "Customer access",
    color:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  },
];

export default function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { login, loginWithGoogle, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(data: LoginInput) {
    try {
      await login({
        email: data.email.trim(),
        password: data.password,
      });

      const user = await getCurrentUser();

      queryClient.setQueryData(["current-user"], user);

      toast.success("Login successful!");

      router.replace(getDashboardPath(user.role));
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    }
  }

  function handleGoogleLogin() {
    loginWithGoogle();
  }

  function fillDemoAccount(email: string, password: string) {
    form.setValue("email", email, {
      shouldValidate: true,
      shouldDirty: true,
    });

    form.setValue("password", password, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to continue to your account.
        </p>
      </div>

      {/* Demo Accounts */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold">Try a demo account</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Select a role to fill in the login credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {demoAccounts.map((account) => {
            const Icon = account.icon;

            return (
              <button
                key={account.role}
                type="button"
                onClick={() => fillDemoAccount(account.email, account.password)}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${account.color}`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80">
                  <Icon size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold">{account.role}</p>
                  <p className="mt-0.5 text-[11px] opacity-80">
                    {account.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        noValidate
        className="space-y-4"
      >
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email address
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
            placeholder="you@example.com"
            className="h-11 w-full rounded-lg border border-input bg-background px-4 outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/15 focus-visible:ring-primary/20"
          />

          {form.formState.errors.email && (
            <p className="mt-1 text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>

          <div className="group relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...form.register("password")}
              placeholder="Enter your password"
              className="h-11 w-full rounded-lg border border-input bg-background py-2 pl-4 pr-12 outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/15 focus-visible:ring-primary/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {form.formState.errors.password && (
            <p className="mt-1 text-sm text-destructive">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-sm font-medium text-primary transition-colors hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="relative flex items-center">
        <div className="w-full border-t" />
        <span className="absolute left-1/2 -translate-x-1/2 bg-background px-3 text-sm text-muted-foreground">
          OR
        </span>
      </div>

      {/* Google Login Button Updated */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Image
          src="/google.svg" // নিশ্চিত করুন এই ফাইলটি public/ ফোল্ডারে আছে
          alt="Google logo"
          width={18}
          height={18}
          className="shrink-0"
        />
        Continue with Google
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="font-medium text-primary hover:underline"
        >
          Create account
        </button>
      </p>
    </div>
  );
}
