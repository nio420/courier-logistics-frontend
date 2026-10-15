"use client";

import { usePathname } from "next/navigation";
import PublicFooter from "@/components/layout/public-footer";

export default function ConditionalPublicFooter() {
  const pathname = usePathname();

  const isDashboard =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/courier") ||
    pathname.startsWith("/dashboard");

  return (
    <div className={isDashboard ? "lg:ml-65" : ""}>
      <PublicFooter />
    </div>
  );
}
