"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  acceptAssignment,
  type CourierAssignment,
  type CourierAssignmentStatus,
  completeAssignment,
  getCourierAssignments,
  getCourierDashboard,
  rejectAssignment,
} from "@/lib/api/courier";

type StatusFilter = "ALL" | CourierAssignmentStatus | "IN_PROGRESS";

const PAGE_SIZE_OPTIONS = [6, 10, 15, 20];

const statusConfig: Record<
  CourierAssignmentStatus,
  { label: string; color: string; badge: string }
> = {
  PENDING: {
    label: "Pending",
    color: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  ACCEPTED: {
    label: "In Progress",
    color: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 ring-rose-200",
  },
};

function formatDate(date?: string) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatStatus(status?: string) {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getErrorMessage(error: Error) {
  return error.message || "Something went wrong. Please try again.";
}

export default function CourierDeliveriesPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const assignmentsQuery = useQuery({
    queryKey: ["courier-assignments"],
    queryFn: getCourierAssignments,
  });

  const dashboardQuery = useQuery({
    queryKey: ["courier-dashboard"],
    queryFn: getCourierDashboard,
  });

  const assignments = assignmentsQuery.data ?? [];
  const dashboard = dashboardQuery.data;

  const refreshCourierData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["courier-assignments"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["courier-dashboard"],
      }),
    ]);
  };

  const acceptMutation = useMutation({
    mutationFn: acceptAssignment,
    onSuccess: async (response) => {
      if (!response?.success) {
        toast.error(response?.message || "Could not accept assignment.");
        return;
      }

      toast.success("Assignment accepted successfully.");
      await refreshCourierData();
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      rejectAssignment(id, reason),
    onSuccess: async (response) => {
      if (!response?.success) {
        toast.error(response?.message || "Could not reject assignment.");
        return;
      }

      toast.success("Assignment rejected.");
      setRejectingId(null);
      setRejectReason("");
      await refreshCourierData();
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  });

  const completeMutation = useMutation({
    mutationFn: completeAssignment,
    onSuccess: async (response) => {
      if (!response?.success) {
        toast.error(response?.message || "Could not complete delivery.");
        return;
      }

      toast.success("Delivery marked as completed.");
      await refreshCourierData();
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  });

  const isActionPending =
    acceptMutation.isPending ||
    rejectMutation.isPending ||
    completeMutation.isPending;

  const counts = useMemo(() => {
    return {
      total: assignments.length,
      pending: assignments.filter((item) => item.status === "PENDING").length,
      inProgress: assignments.filter((item) => item.status === "ACCEPTED")
        .length,
      completed: assignments.filter((item) => item.status === "COMPLETED")
        .length,
      rejected: assignments.filter((item) => item.status === "REJECTED").length,
    };
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return assignments.filter((assignment) => {
      const shipment = assignment.shipment;

      const matchesSearch =
        !searchText ||
        assignment.id.toLowerCase().includes(searchText) ||
        (assignment.shipmentId ?? "").toLowerCase().includes(searchText) ||
        (shipment?.id ?? "").toLowerCase().includes(searchText) ||
        (shipment?.trackingNumber ?? "").toLowerCase().includes(searchText) ||
        (shipment?.serviceType ?? "").toLowerCase().includes(searchText) ||
        (shipment?.packageType ?? "").toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "IN_PROGRESS"
          ? assignment.status === "ACCEPTED"
          : assignment.status === statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [assignments, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAssignments.length / pageSize),
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedAssignments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredAssignments.slice(startIndex, startIndex + pageSize);
  }, [filteredAssignments, currentPage, pageSize]);

  const firstItem =
    filteredAssignments.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const lastItem = Math.min(currentPage * pageSize, filteredAssignments.length);

  const chartStatuses = [
    {
      key: "PENDING" as const,
      label: "Pending",
      count: counts.pending,
    },
    {
      key: "ACCEPTED" as const,
      label: "In Progress",
      count: counts.inProgress,
    },
    {
      key: "COMPLETED" as const,
      label: "Completed",
      count: counts.completed,
    },
    {
      key: "REJECTED" as const,
      label: "Rejected",
      count: counts.rejected,
    },
  ];

  const chartTotal = chartStatuses.reduce(
    (total, item) => total + item.count,
    0,
  );

  const handleFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleReject = (id: string) => {
    rejectMutation.mutate({
      id,
      reason: rejectReason.trim() || undefined,
    });
  };

  if (assignmentsQuery.isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-9 w-56 animate-pulse rounded-lg bg-slate-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-2xl bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  if (assignmentsQuery.isError) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-xl text-rose-600">
            !
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Could not load deliveries
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {getErrorMessage(assignmentsQuery.error)}
          </p>
          <button
            onClick={() => assignmentsQuery.refetch()}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/80 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Page heading */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Courier workspace
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Deliveries
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage your assigned deliveries, track their status, and update
              assignments as you work.
            </p>
          </div>

          <button
            onClick={() => {
              void refreshCourierData();
            }}
            disabled={assignmentsQuery.isFetching || dashboardQuery.isFetching}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <span aria-hidden="true">↻</span>
            Refresh data
          </button>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Deliveries"
            value={
              dashboardQuery.isError ? "—" : (dashboard?.totalDeliveries ?? 0)
            }
            subtitle="Delivered successfully"
            icon="✓"
            iconClass="bg-emerald-50 text-emerald-600"
            accent="border-t-emerald-500"
          />
          <SummaryCard
            title="In Progress"
            value={counts.inProgress}
            subtitle="Accepted assignments"
            icon="↗"
            iconClass="bg-blue-50 text-blue-600"
            accent="border-t-blue-500"
          />
          <SummaryCard
            title="Pending"
            value={counts.pending}
            subtitle="Awaiting your response"
            icon="◷"
            iconClass="bg-amber-50 text-amber-600"
            accent="border-t-amber-500"
          />
          <SummaryCard
            title="Rejected"
            value={counts.rejected}
            subtitle="Rejected assignments"
            icon="↩"
            iconClass="bg-rose-50 text-rose-600"
            accent="border-t-rose-500"
          />
        </section>

        {/* Status chart and completion summary */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Assignment overview
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Current status breakdown from your assignments
                </p>
              </div>
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {chartTotal} assignments
              </span>
            </div>

            {/* Stacked status bar */}
            <div
              className="mt-7 flex h-3 w-full overflow-hidden rounded-full bg-slate-100"
              role="img"
              aria-label={chartStatuses
                .map((item) => `${item.label}: ${item.count}`)
                .join(", ")}
            >
              {chartStatuses.map((item) => (
                <div
                  key={item.key}
                  className={`${statusConfig[item.key].color} transition-all duration-300`}
                  style={{
                    width:
                      chartTotal > 0
                        ? `${(item.count / chartTotal) * 100}%`
                        : "0%",
                  }}
                />
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {chartStatuses.map((item) => {
                const percentage =
                  chartTotal > 0
                    ? Math.round((item.count / chartTotal) * 100)
                    : 0;

                return (
                  <div key={item.key}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${statusConfig[item.key].color}`}
                        />
                        <span className="text-sm font-medium text-slate-600">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${statusConfig[item.key].color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">
                      {percentage}% of assignments
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-blue-950 p-6 text-white shadow-sm">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blue-500/15 blur-2xl" />
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xl">
                ✓
              </div>
              <p className="mt-6 text-sm font-medium text-slate-300">
                Completed assignments
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight">
                {counts.completed}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Assignments marked as completed in the assignment list returned
                by your backend.
              </p>
              <button
                onClick={() => handleFilterChange("COMPLETED")}
                className="mt-6 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
              >
                View completed
              </button>
            </div>
          </div>
        </section>

        {/* Assignment list */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All assignments
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search, filter, and manage your deliveries.
                </p>
              </div>

              <div className="relative w-full lg:max-w-sm">
                <label htmlFor="delivery-search" className="sr-only">
                  Search deliveries
                </label>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  ⌕
                </span>
                <input
                  id="delivery-search"
                  type="search"
                  value={search}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  placeholder="Search tracking or assignment ID..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {(
                [
                  ["ALL", "All assignments", counts.total],
                  ["PENDING", "Pending", counts.pending],
                  ["IN_PROGRESS", "In Progress", counts.inProgress],
                  ["COMPLETED", "Completed", counts.completed],
                  ["REJECTED", "Rejected", counts.rejected],
                ] as const
              ).map(([filter, label, count]) => {
                const active = statusFilter === filter;

                return (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-xs ${
                        active
                          ? "bg-white/15 text-white"
                          : "bg-white text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {paginatedAssignments.length === 0 ? (
            <div className="px-5 py-16 text-center sm:px-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500">
                ⌕
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                No assignments found
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {assignments.length === 0
                  ? "There are no assignments in the data returned by your backend yet."
                  : "Try another search term or status filter."}
              </p>
              {(search || statusFilter !== "ALL") && (
                <button
                  onClick={() => {
                    setSearch("");
                    handleFilterChange("ALL");
                  }}
                  className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                >
                  Clear search and filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-100">
                {paginatedAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    isActionPending={isActionPending}
                    isRejecting={rejectingId === assignment.id}
                    rejectReason={rejectReason}
                    onAccept={() => acceptMutation.mutate(assignment.id)}
                    onComplete={() => completeMutation.mutate(assignment.id)}
                    onStartReject={() => {
                      setRejectingId(assignment.id);
                      setRejectReason("");
                    }}
                    onCancelReject={() => {
                      setRejectingId(null);
                      setRejectReason("");
                    }}
                    onReject={() => handleReject(assignment.id)}
                    onRejectReasonChange={setRejectReason}
                  />
                ))}
              </div>

              {/* Pagination controls */}
              <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-800">
                    {firstItem}–{lastItem}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-800">
                    {filteredAssignments.length}
                  </span>{" "}
                  assignments
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="page-size"
                      className="whitespace-nowrap text-sm text-slate-500"
                    >
                      Rows per page
                    </label>
                    <select
                      id="page-size"
                      value={pageSize}
                      onChange={(event) =>
                        handlePageSizeChange(Number(event.target.value))
                      }
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      disabled={currentPage === 1}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {getPageNumbers(currentPage, totalPages).map(
                      (pageNumber, index) =>
                        pageNumber === "..." ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-1 text-slate-400"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            aria-label={`Go to page ${pageNumber}`}
                            aria-current={
                              currentPage === pageNumber ? "page" : undefined
                            }
                            className={`min-w-9 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                              currentPage === pageNumber
                                ? "bg-slate-900 text-white"
                                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        ),
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
  accent,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  iconClass: string;
  accent: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 border-t-4 ${accent} bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${iconClass}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{subtitle}</p>
    </div>
  );
}

function AssignmentCard({
  assignment,
  isActionPending,
  isRejecting,
  rejectReason,
  onAccept,
  onComplete,
  onStartReject,
  onCancelReject,
  onReject,
  onRejectReasonChange,
}: {
  assignment: CourierAssignment;
  isActionPending: boolean;
  isRejecting: boolean;
  rejectReason: string;
  onAccept: () => void;
  onComplete: () => void;
  onStartReject: () => void;
  onCancelReject: () => void;
  onReject: () => void;
  onRejectReasonChange: (value: string) => void;
}) {
  const shipment = assignment.shipment;
  const status = statusConfig[assignment.status];

  return (
    <article className="p-5 transition-colors hover:bg-slate-50/70 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${status.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${status.color}`} />
              {status.label}
            </span>
            <span className="text-xs text-slate-400">
              Assigned {formatDate(shipment?.createdAt)}
            </span>
          </div>

          <h3 className="mt-3 break-all text-base font-bold text-slate-900">
            {shipment?.trackingNumber || shipment?.id || assignment.id}
          </h3>

          <p className="mt-1 break-all text-xs text-slate-400">
            Assignment ID: {assignment.id}
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <DetailItem
              label="Service type"
              value={formatStatus(shipment?.serviceType)}
            />
            <DetailItem
              label="Package type"
              value={formatStatus(shipment?.packageType)}
            />
            <DetailItem
              label="Shipment status"
              value={formatStatus(shipment?.status)}
            />
          </div>

          {isRejecting && (
            <div className="mt-5 max-w-xl rounded-xl border border-rose-200 bg-rose-50/70 p-4">
              <label
                htmlFor={`reject-reason-${assignment.id}`}
                className="block text-sm font-semibold text-slate-800"
              >
                Rejection reason{" "}
                <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <textarea
                id={`reject-reason-${assignment.id}`}
                value={rejectReason}
                onChange={(event) => onRejectReasonChange(event.target.value)}
                rows={2}
                maxLength={500}
                placeholder="Tell us why you are rejecting this assignment..."
                className="mt-2 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={onReject}
                  disabled={isActionPending}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                >
                  {isActionPending ? "Processing..." : "Confirm rejection"}
                </button>
                <button
                  onClick={onCancelReject}
                  disabled={isActionPending}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 xl:max-w-64 xl:justify-end">
          {assignment.status === "PENDING" && !isRejecting && (
            <>
              <button
                onClick={onAccept}
                disabled={isActionPending}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Accept
              </button>
              <button
                onClick={onStartReject}
                disabled={isActionPending}
                className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject
              </button>
            </>
          )}

          {assignment.status === "ACCEPTED" && (
            <button
              onClick={onComplete}
              disabled={isActionPending}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isActionPending ? "Processing..." : "Mark as delivered"}
            </button>
          )}

          {assignment.status === "COMPLETED" && (
            <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
              <span aria-hidden="true">✓</span>
              Delivered
            </span>
          )}

          {assignment.status === "REJECTED" && (
            <span className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700">
              Rejected
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 px-3.5 py-3">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1 wrap-break-word text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}
