import { Suspense } from "react";
import AdminPaymentsTable from "@/components/admin/AdminPaymentsTable";

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<p>Loading payments...</p>}>
      <AdminPaymentsTable />
    </Suspense>
  );
}
