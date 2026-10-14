import type { ReactNode } from "react";
import CustomerDashboardSidebar from "@/components/dashboard/customer-dashboard-sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile navigation header and drawer */}
      <div className="lg:hidden">
        <CustomerDashboardSidebar />
      </div>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Desktop sidebar */}
        <div className="sticky top-19 hidden h-[calc(100vh-76px)] w-70 shrink-0 lg:block">
          <CustomerDashboardSidebar />
        </div>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
