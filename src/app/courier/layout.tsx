import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CourierDashboardSidebar from "@/components/dashboard/CourierDashboardSidebar";

export default function CourierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["COURIER"]}>
      <div className="min-h-screen w-full overflow-x-clip bg-slate-50">
        <div className="mx-auto min-h-screen w-full max-w-[1600px]">
          <CourierDashboardSidebar />

          <main className="min-w-0 w-full px-4 py-5 sm:px-6 sm:py-6 lg:ml-65 lg:w-[calc(100%-260px)] lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
