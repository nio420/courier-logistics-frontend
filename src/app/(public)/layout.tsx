import type { ReactNode } from "react";

import PublicFooter from "@/components/layout/public-footer";
import PublicNavbar from "@/components/layout/public-navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
    </>
  );
}
