import AuthShell from "@/components/auth/AuthShell";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      badge="Secure password reset"
      title="Create a new password."
      description="Enter the verification code from your email and choose a new password for your account."
    >
      <Suspense fallback={<Skeleton className="h-20 w-full" count={4} />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
