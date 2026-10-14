"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  CheckCircle,
  Eye,
  Loader2,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import {
  type AdminUser,
  getAdminUsers,
  type UserStatus,
  updateAdminUserStatus,
} from "@/lib/api/admin-users";

const PAGE_SIZE = 5;

type PendingStatusChange = {
  user: AdminUser;
  nextStatus: UserStatus;
};

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

function CustomerAvatar({ user }: { user: AdminUser }) {
  if (user.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={user.name}
        className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
      />
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 ring-2 ring-white">
      {user.name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0] || "")
        .join("")
        .toUpperCase()}
    </div>
  );
}

function CustomerActions({
  user,
  busy,
  onStatusChange,
}: {
  user: AdminUser;
  busy: boolean;
  onStatusChange: (status: UserStatus) => void;
}) {
  return (
    <div className="flex w-full max-w-[220px] flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        {user.status !== "ACTIVE" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onStatusChange("ACTIVE")}
            className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" />
            Activate
          </button>
        )}

        {user.status !== "SUSPENDED" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onStatusChange("SUSPENDED")}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
          >
            <LockKeyhole className="h-4 w-4" />
            Suspend
          </button>
        )}

        {user.status !== "BLOCKED" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onStatusChange("BLOCKED")}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
          >
            <Ban className="h-4 w-4" />
            Block
          </button>
        )}
      </div>

      <Link
        href={"/admin/users/" + user.id}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      >
        <Eye className="h-4 w-4" />
        Details
      </Link>
    </div>
  );
}

export default function AdminUsersManagement() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<"ALL" | UserStatus>("ALL");
  const [page, setPage] = useState(1);
  const [pendingStatusChange, setPendingStatusChange] =
    useState<PendingStatusChange | null>(null);

  const usersQuery = useQuery({
    queryKey: ["admin-users", page, PAGE_SIZE, searchTerm, status],
    queryFn: () =>
      getAdminUsers({
        page,
        limit: PAGE_SIZE,
        searchTerm: searchTerm.trim() || undefined,
        role: "CUSTOMER",
        status: status === "ALL" ? undefined : status,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
  });

  const statusMutation = useMutation({
    mutationFn: (input: { id: string; status: UserStatus }) =>
      updateAdminUserStatus(input.id, input.status),
    onSuccess: async () => {
      toast.success("Customer status updated successfully.");

      await queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["admin-user"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update customer status.");
    },
  });

  const users = usersQuery.data?.users ?? [];
  const meta = usersQuery.data?.meta;
  const totalPages = Math.max(meta?.totalPage ?? 1, 1);

  function handleSearch(value: string) {
    setSearchTerm(value);
    setPage(1);
  }

  function handleStatusFilter(value: string) {
    setStatus(value as "ALL" | UserStatus);
    setPage(1);
  }

  function handleStatusChange(user: AdminUser, nextStatus: UserStatus) {
    setPendingStatusChange({ user, nextStatus });
  }

  function confirmStatusChange() {
    if (!pendingStatusChange || statusMutation.isPending) return;

    statusMutation.mutate({
      id: pendingStatusChange.user.id,
      status: pendingStatusChange.nextStatus,
    });

    setPendingStatusChange(null);
  }

  const isBlocking = pendingStatusChange?.nextStatus === "BLOCKED";
  const isSuspending = pendingStatusChange?.nextStatus === "SUSPENDED";

  return (
    <div className="min-w-0 space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-5 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100">
              <Users className="h-4 w-4" />
              Customer administration
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Customer Management
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Find customers, review their profiles, and manage account access
              from one place.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <div className="rounded-lg bg-white/10 p-3">
              <Users className="h-6 w-6 text-blue-200" />
            </div>
            <div>
              <p className="text-xs text-slate-300">Matching customers</p>
              <p className="mt-1 text-2xl font-bold">
                {usersQuery.data ? (meta?.total ?? 0) : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-4 border-b border-slate-200 p-4 sm:p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Customer accounts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search by name or email and manage account status.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search customer name or email..."
                aria-label="Search customers"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={status}
              onChange={(event) => handleStatusFilter(event.target.value)}
              aria-label="Filter customers by status"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
        </div>

        {usersQuery.isLoading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            Loading customers...
          </div>
        ) : usersQuery.isError ? (
          <div className="flex flex-col items-center px-4 py-12 text-center">
            <div className="rounded-full bg-red-50 p-4">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">
              Failed to load customers
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {usersQuery.error instanceof Error
                ? usersQuery.error.message
                : "Please try again."}
            </p>
            <button
              type="button"
              onClick={() => void usersQuery.refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-12 text-center">
            <div className="rounded-full bg-slate-100 p-4">
              <Users className="h-7 w-7 text-slate-500" />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">
              No customers found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try another search term or status filter.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Account status</th>
                    <th className="px-5 py-4">Email verification</th>
                    <th className="px-5 py-4">Registered</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <CustomerAvatar user={user} />
                          <div className="min-w-0">
                            <p className="break-words text-sm font-semibold text-slate-900">
                              {user.name}
                            </p>
                            <p className="mt-1 break-all text-xs text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          {user.role}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <UserStatusBadge status={user.status} />
                      </td>

                      <td className="px-5 py-4">
                        {user.emailVerified ? (
                          <span className="text-sm font-medium text-emerald-700">
                            Verified
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-amber-700">
                            Unverified
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        <CustomerActions
                          user={user}
                          busy={
                            statusMutation.isPending &&
                            statusMutation.variables?.id === user.id
                          }
                          onStatusChange={(nextStatus) =>
                            handleStatusChange(user, nextStatus)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-3 p-3 sm:p-4 lg:hidden">
              {users.map((user) => (
                <article
                  key={user.id}
                  className="min-w-0 rounded-xl border border-slate-200 p-4 transition duration-200 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <CustomerAvatar user={user} />

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-semibold text-slate-900">
                        {user.name}
                      </h3>
                      <p className="mt-1 break-all text-sm text-slate-500">
                        {user.email}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <UserStatusBadge status={user.status} />
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {user.emailVerified
                            ? "Email verified"
                            : "Email unverified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-500">Role</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {user.role}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Registered</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <CustomerActions
                      user={user}
                      busy={
                        statusMutation.isPending &&
                        statusMutation.variables?.id === user.id
                      }
                      onStatusChange={(nextStatus) =>
                        handleStatusChange(user, nextStatus)
                      }
                    />
                  </div>
                </article>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Page {meta?.page ?? page} of {totalPages} ·{" "}
                {meta?.total ?? users.length} matching customers
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || usersQuery.isFetching}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= totalPages || usersQuery.isFetching}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {statusMutation.isPending && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-lg">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          Updating customer status...
        </div>
      )}

      {pendingStatusChange && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setPendingStatusChange(null)}
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
                onClick={() => setPendingStatusChange(null)}
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
              <span className="font-semibold text-slate-900">
                {pendingStatusChange.user.name}
              </span>
              ?
            </p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-500">Current status</span>
                <UserStatusBadge status={pendingStatusChange.user.status} />
              </div>

              <div className="my-3 border-t border-slate-200" />

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-500">New status</span>
                <UserStatusBadge status={pendingStatusChange.nextStatus} />
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
                onClick={() => setPendingStatusChange(null)}
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
