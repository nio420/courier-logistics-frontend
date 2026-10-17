import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      badge="Account recovery"
      title="Forgot your password?"
      description="Enter your email address and we’ll send you a secure verification code to reset your password."
    >
      <Suspense fallback={<Skeleton className="h-20 w-full" count={4} />}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
