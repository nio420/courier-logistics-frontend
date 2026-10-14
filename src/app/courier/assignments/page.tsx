"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptAssignment,
  type CourierAssignment,
  completeAssignment,
  getCourierAssignments,
  rejectAssignment,
} from "@/lib/api/courier";

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMoney(value?: number | string) {
  if (value === undefined || value === null) return "—";

  const amount = Number(value);
  return Number.isFinite(amount) ? `৳${amount.toLocaleString("en-BD")}` : "—";
}

export default function CourierAssignmentsPage() {
  const queryClient = useQueryClient();

  const {
    data: assignments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["courier-assignments"],
    queryFn: () => getCourierAssignments(),
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });

  const refreshAssignments = async () => {
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
    onSuccess: refreshAssignments,
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      rejectAssignment(id, reason),
    onSuccess: refreshAssignments,
  });

  const completeMutation = useMutation({
    mutationFn: completeAssignment,
    onSuccess: refreshAssignments,
  });

  const isActionPending =
    acceptMutation.isPending ||
    rejectMutation.isPending ||
    completeMutation.isPending;

  const mutationError =
    acceptMutation.error || rejectMutation.error || completeMutation.error;

  const handleReject = (id: string) => {
    const input = window.prompt("Enter a rejection reason (optional):");

    if (input === null) return;

    const reason = input.trim();

    if (reason && reason.length < 3) {
      window.alert("Please enter at least 3 characters.");
      return;
    }

    rejectMutation.mutate({
      id,
      ...(reason ? { reason } : {}),
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading assignments...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">My Assignments</h1>
        <p className="text-sm text-red-600">
          {error instanceof Error
            ? error.message
            : "Failed to load assignments."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Try again
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Courier workspace</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          My Assignments
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          View and manage shipments assigned to you by the admin.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Total",
            count: assignments.length,
          },
          {
            label: "Pending",
            count: assignments.filter((item) => item.status === "PENDING")
              .length,
          },
          {
            label: "Accepted",
            count: assignments.filter((item) => item.status === "ACCEPTED")
              .length,
          },
          {
            label: "Completed",
            count: assignments.filter((item) => item.status === "COMPLETED")
              .length,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {item.count}
            </p>
          </div>
        ))}
      </div>

      {mutationError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {mutationError instanceof Error
            ? mutationError.message
            : "The action failed. Please try again."}
        </div>
      )}

      {assignments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            No assignments yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Assignments will appear here when an admin assigns a shipment to
            you.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment: CourierAssignment) => (
            <article
              key={assignment.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Tracking number
                  </p>
                  <h2 className="mt-1 break-all text-lg font-bold text-slate-900">
                    {assignment.shipment?.trackingNumber ??
                      assignment.shipmentId ??
                      assignment.shipment?.id ??
                      assignment.id}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {[
                      assignment.shipment?.serviceType,
                      assignment.shipment?.packageType,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "Shipment assignment"}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {formatStatus(assignment.status)}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Shipment status</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {assignment.shipment?.status
                      ? formatStatus(assignment.shipment.status)
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Delivery fee</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {formatMoney(assignment.shipment?.deliveryFee)}
                  </p>
                </div>
              </div>

              {assignment.status === "PENDING" && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={isActionPending}
                    onClick={() => acceptMutation.mutate(assignment.id)}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {acceptMutation.isPending ? "Accepting..." : "Accept"}
                  </button>
                  <button
                    type="button"
                    disabled={isActionPending}
                    onClick={() => handleReject(assignment.id)}
                    className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              )}

              {assignment.status === "ACCEPTED" && (
                <div className="mt-5">
                  <button
                    type="button"
                    disabled={isActionPending}
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure this delivery is complete?",
                        )
                      ) {
                        completeMutation.mutate(assignment.id);
                      }
                    }}
                    className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {completeMutation.isPending
                      ? "Completing..."
                      : "Mark as Complete"}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
