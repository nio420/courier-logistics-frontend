import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import VerifyOtpForm from "@/components/auth/VerifyForm";

export default function VerifyPage() {
  return (
    <AuthShell
      badge="Email verification"
      title="Verify your account."
      description="Enter the verification code sent to your email to activate your Courier Logistics account."
    >
      <Suspense fallback={<p>Loading verification form...</p>}>
        <VerifyOtpForm />
      </Suspense>
    </AuthShell>
  );
}
