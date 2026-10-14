import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      badge="Account recovery"
      title="Forgot your password?"
      description="Enter your email address and we’ll send you a secure verification code to reset your password."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
