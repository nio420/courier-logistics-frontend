"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Check,
  Clock,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Truck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import {
  type AdminCourier,
  approveAdminCourier,
  type CourierApprovalStatus,
  getAdminCouriers,
  getAdminOverview,
  rejectAdminCourier,
} from "@/lib/api/admin-couriers";

const PAGE_SIZE = 5;

function StatusBadge({ status }: { status: string | null }) {
  const value = status ?? "PENDING";

  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    APPROVED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-red-50 text-red-700",
    ACTIVE: "bg-emerald-50 text-emerald-700",
    SUSPENDED: "bg-amber-50 text-amber-700",
    BLOCKED: "bg-red-50 text-red-700",
    AVAILABLE: "bg-emerald-50 text-emerald-700",
    OFFLINE: "bg-slate-100 text-slate-600",
    BUSY: "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[value.toUpperCase()] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number | string;
  icon: typeof Users;
  description: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 break-words text-2xl font-bold text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function CourierCard({
  courier,
  onApprove,
  onReject,
  busy,
}: {
  courier: AdminCourier;
  onApprove: () => void;
  onReject: () => void;
  busy: boolean;
}) {
  return (
    <article className="min-w-0 rounded-xl border border-slate-200 p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-700">
          {courier.name
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <p className="break-words font-semibold text-slate-900">
            {courier.name}
          </p>
          <p className="mt-1 break-all text-sm text-slate-500">
            {courier.email}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={courier.courierApprovalStatus} />
            <StatusBadge status={courier.status} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="text-xs text-slate-500">Employee ID</p>
          <p className="mt-1 break-words text-sm font-medium text-slate-800">
            {courier.courier?.employeeId || "Not assigned"}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500">Availability</p>
          <div className="mt-1">
            <StatusBadge
              status={courier.courier?.availabilityStatus ?? "UNKNOWN"}
            />
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500">Vehicle</p>
          <p className="mt-1 break-words text-sm font-medium text-slate-800">
            {courier.courier?.vehicleType || "Not provided"}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500">Vehicle Number</p>
          <p className="mt-1 break-words text-sm font-medium text-slate-800">
            {courier.courier?.vehicleNumber || "Not provided"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Total Deliveries</p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {courier.courier?.totalDeliveries ?? 0}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Rating</p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {courier.courier?.rating ?? "Not rated"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
        {courier.courierApprovalStatus === "PENDING" && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={onApprove}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              Approve
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onReject}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Reject
            </button>
          </>
        )}

        <Link
          href={`/admin/couriers/${courier.id}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Eye className="h-4 w-4" />
          Details
        </Link>
      </div>
    </article>
  );
}

export default function AdminCouriersManagement() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [approvalStatus, setApprovalStatus] = useState<
    CourierApprovalStatus | "ALL"
  >("ALL");
  const [availabilityStatus, setAvailabilityStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  // Rejection modal state
  const [selectedCourier, setSelectedCourier] = useState<AdminCourier | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");

  const overviewQuery = useQuery({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverview,
  });

  const couriersQuery = useQuery({
    queryKey: [
      "admin-couriers",
      page,
      PAGE_SIZE,
      searchTerm,
      approvalStatus,
      availabilityStatus,
    ],
    queryFn: () =>
      getAdminCouriers({
        page,
        limit: PAGE_SIZE,
        searchTerm: searchTerm.trim() || undefined,
        approvalStatus: approvalStatus === "ALL" ? undefined : approvalStatus,
        availabilityStatus:
          availabilityStatus === "ALL" ? undefined : availabilityStatus,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
  });

  const approveMutation = useMutation({
    mutationFn: approveAdminCourier,
    onSuccess: async () => {
      toast.success("Courier approved successfully.");
      await queryClient.invalidateQueries({ queryKey: ["admin-couriers"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      rejectAdminCourier(userId, reason),
    onSuccess: async () => {
      toast.success("Courier rejected successfully.");
      setSelectedCourier(null);
      setRejectionReason("");
      await queryClient.invalidateQueries({ queryKey: ["admin-couriers"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const couriers = couriersQuery.data?.couriers ?? [];
  const meta = couriersQuery.data?.meta;
  const summary = overviewQuery.data?.summary;

  const busy = approveMutation.isPending || rejectMutation.isPending;

  function changeSearch(value: string) {
    setSearchTerm(value);
    setPage(1);
  }

  function changeApprovalStatus(value: string) {
    setApprovalStatus(value as CourierApprovalStatus | "ALL");
    setPage(1);
  }

  function changeAvailabilityStatus(value: string) {
    setAvailabilityStatus(value);
    setPage(1);
  }

  function handleApprove(courier: AdminCourier) {
    if (
      !window.confirm(
        `Are you sure you want to approve ${courier.name} as a courier?`,
      )
    ) {
      return;
    }

    approveMutation.mutate(courier.id);
  }

  function handleReject(courier: AdminCourier) {
    setSelectedCourier(courier);
    setRejectionReason("");
  }

  function closeRejectModal() {
    if (rejectMutation.isPending) return;

    setSelectedCourier(null);
    setRejectionReason("");
  }

  function confirmReject() {
    if (!selectedCourier) return;

    const reason = rejectionReason.trim();

    if (!reason) {
      toast.error("Please provide a rejection reason.");
      return;
    }

    rejectMutation.mutate({
      userId: selectedCourier.id,
      reason,
    });
  }

  const totalPages = meta?.totalPage ?? 1;

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Courier Management
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Review courier applications, manage approvals, and monitor courier
          availability.
        </p>
      </div>

      {overviewQuery.isLoading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading courier statistics...
        </div>
      ) : overviewQuery.isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Could not load courier statistics.{" "}
          <button
            type="button"
            onClick={() => void overviewQuery.refetch()}
            className="font-semibold underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Couriers"
            value={summary?.totalCouriers ?? 0}
            description="Registered courier accounts"
            icon={Truck}
          />
          <StatCard
            title="Pending Applications"
            value={summary?.pendingCouriers ?? 0}
            description="Awaiting admin review"
            icon={Clock}
          />
          <StatCard
            title="Approved Couriers"
            value={summary?.approvedCouriers ?? 0}
            description="Approved courier accounts"
            icon={Users}
          />
          <StatCard
            title="Rejected Applications"
            value={summary?.rejectedCouriers ?? 0}
            description="Rejected courier applications"
            icon={X}
          />
        </div>
      )}

      <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-4 border-b border-slate-200 p-4 sm:p-5">
          <div>
            <h2 className="font-bold text-slate-900">Courier Applications</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search and filter courier records. Approve or reject pending
              applications.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => changeSearch(event.target.value)}
                placeholder="Search name or email..."
                aria-label="Search couriers"
                className="w-full min-w-0 rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={approvalStatus}
              onChange={(event) => changeApprovalStatus(event.target.value)}
              aria-label="Filter by approval status"
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="PENDING">Pending applications</option>
              <option value="ALL">All courier&apos;s status</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select
              value={availabilityStatus}
              onChange={(event) => changeAvailabilityStatus(event.target.value)}
              aria-label="Filter by availability"
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="ALL">All availability statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="OFFLINE">Offline</option>
              <option value="BUSY">Busy</option>
            </select>
          </div>
        </div>

        {couriersQuery.isLoading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading couriers...
          </div>
        ) : couriersQuery.isError ? (
          <div className="flex flex-col items-center p-10 text-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="mt-3 font-semibold text-slate-900">
              Failed to load couriers
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {couriersQuery.error instanceof Error
                ? couriersQuery.error.message
                : "Please try again."}
            </p>
            <button
              type="button"
              onClick={() => void couriersQuery.refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        ) : couriers.length === 0 ? (
          <div className="p-10 text-center">
            <Truck className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-3 font-semibold text-slate-900">
              No couriers found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try changing the search or filters.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Courier</th>
                    <th className="px-5 py-4">Vehicle</th>
                    <th className="px-5 py-4">Approval</th>
                    <th className="px-5 py-4">Availability</th>
                    <th className="px-5 py-4">Deliveries</th>
                    <th className="px-5 py-4">Registered</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {couriers.map((courier) => (
                    <tr key={courier.id} className="hover:bg-slate-50">
                      <td className="max-w-[250px] px-5 py-4">
                        <p className="break-words text-sm font-semibold text-slate-900">
                          {courier.name}
                        </p>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {courier.email}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-800">
                          {courier.courier?.vehicleType || "Not provided"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {courier.courier?.vehicleNumber ||
                            "No vehicle number"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={courier.courierApprovalStatus} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge
                          status={
                            courier.courier?.availabilityStatus ?? "UNKNOWN"
                          }
                        />
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {courier.courier?.totalDeliveries ?? 0}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {new Date(courier.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {courier.courierApprovalStatus === "PENDING" && (
                            <>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleApprove(courier)}
                                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleReject(courier)}
                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          <Link
                            href={`/admin/couriers/${courier.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            <Eye className="h-4 w-4" />
                            Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Responsive mobile cards */}
            <div className="grid min-w-0 grid-cols-1 gap-3 p-3 sm:p-4 lg:hidden">
              {couriers.map((courier) => (
                <CourierCard
                  key={courier.id}
                  courier={courier}
                  busy={busy}
                  onApprove={() => handleApprove(courier)}
                  onReject={() => handleReject(courier)}
                />
              ))}
            </div>

            {/* Backend pagination */}
            <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Page {meta?.page ?? page} of {meta?.totalPage ?? 1} ·{" "}
                {meta?.total ?? couriers.length} couriers
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || couriersQuery.isFetching}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= totalPages || couriersQuery.isFetching}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {(approveMutation.isPending || rejectMutation.isPending) && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Updating courier application...
        </div>
      )}

      {/* Reject courier modal */}
      {selectedCourier && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeRejectModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-courier-title"
            aria-describedby="reject-courier-description"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                <X className="h-5 w-5" />
              </div>

              <button
                type="button"
                onClick={closeRejectModal}
                disabled={rejectMutation.isPending}
                aria-label="Close rejection dialog"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2
              id="reject-courier-title"
              className="mt-4 text-xl font-bold text-slate-900"
            >
              Reject courier application
            </h2>

            <p
              id="reject-courier-description"
              className="mt-2 text-sm leading-6 text-slate-500"
            >
              You are rejecting{" "}
              <span className="font-semibold text-slate-800">
                {selectedCourier.name}
              </span>
              . Please provide a reason for this decision.
            </p>

            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                confirmReject();
              }}
            >
              <div>
                <label
                  htmlFor="rejection-reason"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Rejection reason
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  placeholder="Explain why this application is being rejected..."
                  rows={4}
                  required
                  autoFocus
                  disabled={rejectMutation.isPending}
                  className="w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:bg-slate-50"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Please enter a clear reason before confirming.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeRejectModal}
                  disabled={rejectMutation.isPending}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={rejectMutation.isPending || !rejectionReason.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {rejectMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      Confirm Rejection
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
