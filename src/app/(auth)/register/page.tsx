import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      badge="Create your account"
      title="Start shipping smarter."
      description="Create your account and get access to secure shipment management, tracking, and delivery services."
    >
      <RegisterForm />
    </AuthShell>
  );
}
