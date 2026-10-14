"use client";

import { useParams } from "next/navigation";
import AdminUserDetails from "@/components/admin/admin-user-details";

export default function AdminUserDetailsPage() {
  const params = useParams();
  const userId = params.id as string;

  return <AdminUserDetails userId={userId} />;
}
