"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/api/auth";
import { getDashboardPath, type UserRole } from "@/lib/auth/token-storage";
import { ShieldCheck } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      setAuthorized(false);

      try {
        const user = await getCurrentUser();

        if (cancelled) return;

        if (!allowedRoles.includes(user.role)) {
          toast.error("You don't have permission to access that page.");
          router.replace(getDashboardPath(user.role));
          return;
        }

        setAuthorized(true);
      } catch {
        if (cancelled) return;

        toast.error("Please sign in to continue.");
        router.replace("/login");
      }
    }

    void checkAccess();

    return () => {
      cancelled = true;
    };
  }, [allowedRoles, pathname, router]);

  if (!authorized) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-border/60 bg-card/80 px-10 py-8 shadow-lg shadow-primary/5 backdrop-blur-sm">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-primary/10" />

            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-primary/50" />

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" strokeWidth={2} />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <p className="text-base font-semibold tracking-tight text-foreground">
              Checking your access
            </p>

            <p className="text-sm text-muted-foreground">
              Please wait while we securely verify your account.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
          </div>
        </div>
      </div>
    );
  }

  return children;
}
