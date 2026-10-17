import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <AuthShell
      badge="Create your account"
      title="Start shipping smarter."
      description="Create your account and get access to secure shipment management, tracking, and delivery services."
    >
      <Suspense fallback={<Skeleton className="h-20 w-full" count={4} />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
