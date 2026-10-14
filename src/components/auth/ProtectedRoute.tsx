"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/api/auth";
import { getDashboardPath, type UserRole } from "@/lib/auth/token-storage";

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
      <div className="flex min-h-[40vh] items-center justify-center">
        {" "}
        <p className="text-sm text-muted-foreground">
          Checking your access...{" "}
        </p>{" "}
      </div>
    );
  }

  return children;
}
