"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Star,
  type Truck,
  Wallet,
  Wifi,
} from "lucide-react";

import {
  type CourierAvailability,
  getCourierDashboard,
  updateCourierAvailability,
} from "@/lib/api/courier";

function formatCurrency(amount: number | string) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: typeof Truck;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 wrap-break-word text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
        </div>
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={22} />
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

export default function CourierDashboardPage() {
  const queryClient = useQueryClient();

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["courier-dashboard"],
    queryFn: getCourierDashboard,
    retry: 1,
    staleTime: 30_000,
  });

  const availabilityMutation = useMutation({
    mutationFn: updateCourierAvailability,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["courier-dashboard"],
      }),
  });

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-3xl bg-slate-200/70" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl bg-white shadow-sm"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <RefreshCw size={28} className="text-red-500" />
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Could not load your courier dashboard
        </h2>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          {error instanceof Error
            ? error.message
            : "Please check your connection and try again."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  const stats = [
    {
      title: "Pending Assignments",
      value: data.pendingAssignments,
      description: "Assignments waiting for your response",
      icon: Clock3,
      iconClass: "bg-amber-50 text-amber-600",
    },
    {
      title: "Accepted Assignments",
      value: data.acceptedAssignments,
      description: "Assignments currently accepted by you",
      icon: Activity,
      iconClass: "bg-blue-50 text-blue-600",
    },
    {
      title: "Completed Deliveries",
      value: data.totalDeliveries,
      description: "Total deliveries recorded on your profile",
      icon: CheckCircle2,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Rating",
      value: Number(data.rating).toFixed(1),
      description: "Your current courier rating",
      icon: Star,
      iconClass: "bg-amber-50 text-amber-600",
    },
  ];

  const canChangeAvailability = data.availabilityStatus !== "SUSPENDED";

  const nextAvailability: Exclude<CourierAvailability, "SUSPENDED"> =
    data.availabilityStatus === "AVAILABLE" ? "OFFLINE" : "AVAILABLE";

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-xl shadow-blue-900/10 sm:p-8 lg:p-9">
        <div className="pointer-events-none absolute -right-12 -top-20 size-64 rounded-full border-35 border-white/5" />
        <div className="pointer-events-none absolute -bottom-32 right-32 size-64 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50">
              <span className="size-2 rounded-full bg-emerald-300" />
              Courier Dashboard
            </span>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Your deliveries,
              <br className="hidden sm:block" /> your progress.
            </h1>

            <p className="mt-3 text-sm leading-6 text-blue-100 sm:text-base">
              Monitor assignments, manage availability, and track your delivery
              performance from one workspace.
            </p>

            <p className="mt-4 text-sm text-blue-100">
              Employee ID:{" "}
              <span className="font-bold text-white">
                {data.employeeId || "Not assigned"}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              disabled={
                !canChangeAvailability || availabilityMutation.isPending
              }
              onClick={() => availabilityMutation.mutate(nextAvailability)}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Wifi size={17} />
              {availabilityMutation.isPending
                ? "Updating..."
                : data.availabilityStatus === "AVAILABLE"
                  ? "Go Offline"
                  : "Go Available"}
            </button>
          </div>
        </div>
      </section>

      {availabilityMutation.isError && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {availabilityMutation.error instanceof Error
            ? availabilityMutation.error.message
            : "Could not update availability."}
        </p>
      )}

      {availabilityMutation.isSuccess && (
        <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
          Availability updated successfully.
        </p>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Earnings
              </p>
              <p className="mt-2 wrap-break-word text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {formatCurrency(data.totalEarnings)}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Total earnings recorded on your courier profile
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Wallet size={24} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                Completed assignments
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {data.completedAssignments}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                Current status
              </p>
              <p className="mt-2 wrap-break-word text-lg font-bold text-slate-900">
                {formatStatus(data.availabilityStatus)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-extrabold text-slate-900">
            Assignment Summary
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your current assignment counts
          </p>

          <div className="mt-5 space-y-4">
            {[
              {
                label: "Pending",
                value: data.pendingAssignments,
                dot: "bg-amber-500",
              },
              {
                label: "Accepted",
                value: data.acceptedAssignments,
                dot: "bg-blue-500",
              },
              {
                label: "Completed",
                value: data.completedAssignments,
                dot: "bg-emerald-500",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3"
              >
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <span className={`size-2.5 rounded-full ${item.dot}`} />
                  {item.label}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
