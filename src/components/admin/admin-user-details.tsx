"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Ban,
  CheckCircle,
  Clock,
  Loader2,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import {
  getAdminUserById,
  type UserStatus,
  updateAdminUserStatus,
} from "@/lib/api/admin-users";

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 transition duration-200 hover:border-blue-200 hover:shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-slate-900">
        {value === null || value === undefined || value === ""
          ? "Not provided"
          : String(value)}
      </p>
    </div>
  );
}

function formatDate(value: string | undefined) {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not provided";

  return date.toLocaleString();
}

function UserStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
    SUSPENDED: "border-amber-200 bg-amber-50 text-amber-700",
    BLOCKED: "border-red-200 bg-red-50 text-red-700",
  };

  const icons: Record<string, typeof CheckCircle> = {
    ACTIVE: CheckCircle,
    SUSPENDED: LockKeyhole,
    BLOCKED: Ban,
  };

  const Icon = icons[status] || ShieldCheck;

  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold " +
        (styles[status] || "border-slate-200 bg-slate-50 text-slate-600")
      }
    >
      <Icon className="h-3.5 w-3.5" />
      {status.replace(/_/g, " ")}
    </span>
  );
}

export default function AdminUserDetails({ userId }: { userId: string }) {
  const queryClient = useQueryClient();

  const [pendingStatus, setPendingStatus] = useState<UserStatus | null>(null);

  const userQuery = useQuery({
    queryKey: ["admin-user", userId],
    queryFn: () => getAdminUserById(userId),
    enabled: Boolean(userId),
  });

  const statusMutation = useMutation({
    mutationFn: (status: UserStatus) => updateAdminUserStatus(userId, status),
    onSuccess: async () => {
      toast.success("Customer status updated successfully.");

      await queryClient.invalidateQueries({
        queryKey: ["admin-user", userId],
      });

      await queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (userQuery.isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center gap-3 text-sm text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        Loading customer details...
      </div>
    );
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <h2 className="mt-3 text-lg font-bold text-red-900">
            Failed to load customer
          </h2>
          <p className="mt-2 text-sm text-red-700">
            {userQuery.error instanceof Error
              ? userQuery.error.message
              : "Customer details could not be loaded."}
          </p>
          <button
            type="button"
            onClick={() => void userQuery.refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const user = userQuery.data;

  function changeStatus(status: UserStatus) {
    setPendingStatus(status);
  }

  function confirmStatusChange() {
    if (!pendingStatus || statusMutation.isPending) return;

    statusMutation.mutate(pendingStatus);
    setPendingStatus(null);
  }

  const isBlocking = pendingStatus === "BLOCKED";
  const isSuspending = pendingStatus === "SUSPENDED";

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/admin" className="transition hover:text-blue-700">
              Admin
            </Link>
            <span>/</span>
            <Link
              href="/admin/users"
              className="transition hover:text-blue-700"
            >
              Customers
            </Link>
            <span>/</span>
            <span className="text-slate-900">Details</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Customer Details
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review customer information and manage account access.
          </p>
        </div>

        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Link>
      </div>

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-5 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white/20"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
              <UserRound className="h-10 w-10 text-blue-100" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="break-words text-2xl font-bold">{user.name}</h2>
            <p className="mt-2 break-all text-sm text-slate-300">
              {user.email}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold">
                {user.role}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold">
                {user.status}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Personal information</h2>
            <p className="text-sm text-slate-500">Customer account details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <DetailItem label="Full name" value={user.name} />
          <DetailItem label="Email address" value={user.email} />
          <DetailItem label="User ID" value={user.id} />
          <DetailItem label="Role" value={user.role} />
          <DetailItem
            label="Authentication provider"
            value={user.authProvider}
          />
          <DetailItem
            label="Email verification"
            value={user.emailVerified ? "Verified" : "Not verified"}
          />
          <DetailItem
            label="Registered at"
            value={formatDate(user.createdAt)}
          />
          <DetailItem label="Last updated" value={formatDate(user.updatedAt)} />
          <DetailItem
            label="Courier approval status"
            value={user.courierApprovalStatus}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Account access</h2>
            <p className="text-sm text-slate-500">
              Change this customer's account status.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Current status</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {user.status}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Suspended and blocked accounts should be rejected by the backend
              login flow.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {user.status !== "ACTIVE" && (
              <button
                type="button"
                disabled={statusMutation.isPending}
                onClick={() => changeStatus("ACTIVE")}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                Activate
              </button>
            )}

            {user.status !== "SUSPENDED" && (
              <button
                type="button"
                disabled={statusMutation.isPending}
                onClick={() => changeStatus("SUSPENDED")}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 disabled:opacity-50"
              >
                <Clock className="h-4 w-4" />
                Suspend
              </button>
            )}

            {user.status !== "BLOCKED" && (
              <button
                type="button"
                disabled={statusMutation.isPending}
                onClick={() => changeStatus("BLOCKED")}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                <Ban className="h-4 w-4" />
                Block
              </button>
            )}
          </div>
        </div>

        {statusMutation.isPending && (
          <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating account status...
          </p>
        )}
      </section>

      {user.courier && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Courier information</h2>
              <p className="text-sm text-slate-500">
                Additional courier profile information
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <DetailItem label="Employee ID" value={user.courier.employeeId} />
            <DetailItem label="Vehicle type" value={user.courier.vehicleType} />
            <DetailItem
              label="Vehicle number"
              value={user.courier.vehicleNumber}
            />
            <DetailItem
              label="License number"
              value={user.courier.licenseNumber}
            />
            <DetailItem
              label="Availability"
              value={user.courier.availabilityStatus}
            />
            <DetailItem
              label="Total deliveries"
              value={user.courier.totalDeliveries}
            />
            <DetailItem
              label="Total earnings"
              value={user.courier.totalEarnings}
            />
            <DetailItem label="Rating" value={user.courier.rating} />
          </div>
        </section>
      )}

      {pendingStatus && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setPendingStatus(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-modal-title"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className={
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl " +
                  (isBlocking
                    ? "bg-red-50 text-red-600"
                    : isSuspending
                      ? "bg-amber-50 text-amber-600"
                      : "bg-emerald-50 text-emerald-600")
                }
              >
                {isBlocking ? (
                  <Ban className="h-6 w-6" />
                ) : isSuspending ? (
                  <LockKeyhole className="h-6 w-6" />
                ) : (
                  <CheckCircle className="h-6 w-6" />
                )}
              </div>

              <button
                type="button"
                aria-label="Close confirmation modal"
                onClick={() => setPendingStatus(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2
              id="status-modal-title"
              className="mt-5 text-xl font-bold text-slate-900"
            >
              {isBlocking
                ? "Block this customer?"
                : isSuspending
                  ? "Suspend this customer?"
                  : "Activate this customer?"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Are you sure you want to change the account status for{" "}
              <span className="font-semibold text-slate-900">{user.name}</span>?
            </p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-500">Current status</span>
                <UserStatusBadge status={user.status} />
              </div>

              <div className="my-3 border-t border-slate-200" />

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-500">New status</span>
                <UserStatusBadge status={pendingStatus} />
              </div>
            </div>

            <div
              className={
                "mt-4 flex items-start gap-2 rounded-lg p-3 text-xs leading-5 " +
                (isBlocking
                  ? "bg-red-50 text-red-700"
                  : isSuspending
                    ? "bg-amber-50 text-amber-700"
                    : "bg-emerald-50 text-emerald-700")
              }
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                {isBlocking
                  ? "Blocking this customer will restrict their account access."
                  : isSuspending
                    ? "Suspending this customer will temporarily restrict their account access."
                    : "Activating this customer will restore their account status to active."}
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPendingStatus(null)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmStatusChange}
                disabled={statusMutation.isPending}
                className={
                  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 " +
                  (isBlocking
                    ? "bg-red-600 hover:bg-red-700"
                    : isSuspending
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-emerald-600 hover:bg-emerald-700")
                }
              >
                {statusMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
