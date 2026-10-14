import { Suspense } from "react";
import AdminHubsManagement from "@/components/admin/AdminHubsManagement";

export default function AdminHubsPage() {
  return (
    <Suspense fallback={<p>Loading hubs...</p>}>
      <AdminHubsManagement />
    </Suspense>
  );
}
