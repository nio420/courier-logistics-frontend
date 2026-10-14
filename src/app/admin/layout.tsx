import type { ReactNode } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminDashboardSidebar from "@/components/dashboard/AdminDashboardSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminDashboardSidebar />

      <main className="min-w-0 lg:ml-65">
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </ProtectedRoute>
      </main>
    </div>
  );
}
