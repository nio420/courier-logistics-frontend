import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      badge="Welcome back"
      title="Sign in to your account."
      description="Access your shipments, deliveries, tracking, payments, and account settings."
    >
      <LoginForm />
    </AuthShell>
  );
}
