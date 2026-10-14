import AuthShell from "@/components/auth/AuthShell";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      badge="Secure password reset"
      title="Create a new password."
      description="Enter the verification code from your email and choose a new password for your account."
    >
      <Suspense fallback={<p>Loading reset password form...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
