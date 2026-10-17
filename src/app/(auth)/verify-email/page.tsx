import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import VerifyOtpForm from "@/components/auth/VerifyForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function VerifyPage() {
  return (
    <AuthShell
      badge="Email verification"
      title="Verify your account."
      description="Enter the verification code sent to your email to activate your Courier Logistics account."
    >
      <Suspense fallback={<Skeleton className="h-20 w-full" count={4} />}>
        <VerifyOtpForm />
      </Suspense>
    </AuthShell>
  );
}
