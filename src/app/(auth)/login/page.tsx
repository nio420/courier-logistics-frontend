import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <AuthShell
      badge="Welcome back"
      title="Sign in to your account."
      description="Access your shipments, deliveries, tracking, payments, and account settings."
    >
      <Suspense fallback={<Skeleton className="h-20 w-full" count={4} />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
