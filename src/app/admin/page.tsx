"use client";

import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  RefreshCw,
  ShieldCheck,
  UserRoundCheck,
  UserRoundPlus,
  Users,
  XCircle,
} from "lucide-react";

import { type AdminOverview, getAdminOverview } from "@/lib/api/admin";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  accent,
}: {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value.toLocaleString()}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${accent}`}>
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function RegistrationChart({
  data,
}: {
  data: AdminOverview["monthlyRegistrations"];
}) {
  const maxValue = Math.max(...data.map((item) => item.total), 1);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            User registrations
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Actual registrations over the last six calendar months
          </p>
        </div>

        <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
          Last 6 months
        </span>
      </div>

      <div className="mt-8 grid h-56 grid-cols-6 gap-3">
        {data.map((item) => {
          const height = item.total === 0 ? 0 : (item.total / maxValue) * 100;

          return (
            <div
              key={item.month}
              className="flex min-w-0 flex-col items-center justify-end"
            >
              <span className="mb-2 text-xs font-semibold text-slate-700">
                {item.total.toLocaleString()}
              </span>

              <div className="flex h-36 w-full items-end justify-center rounded-t-lg bg-slate-50">
                <div
                  title={`${item.month}: ${item.total} registrations`}
                  className="w-full max-w-10 rounded-t-lg bg-linear-to-t from-violet-600 to-indigo-400 transition-all duration-500"
                  style={{ height: `${height}%` }}
                />
              </div>

              <span className="mt-3 text-center text-xs text-slate-500">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      {data.every((item) => item.total === 0) && (
        <p className="mt-3 text-center text-sm text-slate-500">
          No registrations were recorded during this period.
        </p>
      )}
    </section>
  );
}

function CourierApprovalCard({
  summary,
}: {
  summary: AdminOverview["summary"];
}) {
  const total =
    summary.pendingCouriers +
    summary.approvedCouriers +
    summary.rejectedCouriers;

  const items = [
    {
      label: "Approved",
      value: summary.approvedCouriers,
      icon: CheckCircle2,
      color: "text-emerald-600",
      background: "bg-emerald-50",
      barColor: "bg-emerald-500",
    },
    {
      label: "Pending",
      value: summary.pendingCouriers,
      icon: Clock3,
      color: "text-amber-600",
      background: "bg-amber-50",
      barColor: "bg-amber-400",
    },
    {
      label: "Rejected",
      value: summary.rejectedCouriers,
      icon: XCircle,
      color: "text-rose-600",
      background: "bg-rose-50",
      barColor: "bg-rose-400",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-slate-900">Courier approvals</h2>
      <p className="mt-1 text-sm text-slate-500">
        Current application status from the database
      </p>

      <div className="mt-6 space-y-5">
        {items.map((item) => {
          const percentage = total === 0 ? 0 : (item.value / total) * 100;
          const Icon = item.icon;

          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`rounded-lg p-2 ${item.background}`}>
                    <Icon size={16} className={item.color} />
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {item.label}
                  </span>
                </div>

                <span className="text-sm font-bold text-slate-900">
                  {item.value.toLocaleString()}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-sm text-slate-500">
          Total courier profiles by approval status
        </span>
        <span className="font-bold text-slate-900">
          {total.toLocaleString()}
        </span>
      </div>
    </section>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}

function DashboardHeader({
  onRefresh,
  isFetching,
}: {
  onRefresh: () => void;
  isFetching: boolean;
}) {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-indigo-950 to-violet-900 p-6 text-white shadow-lg sm:p-8">
      <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-indigo-400/20 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-100">
            <ShieldCheck size={15} />
            Administration center
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Admin overview
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100/80 sm:text-base">
            Monitor your platform, manage courier approvals, and track real user
            registrations from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh data
        </button>
      </div>

      <div className="relative mt-7 flex items-center gap-2 text-xs text-indigo-100/75">
        <Activity size={15} />
        Database statistics · Updated when data is fetched
      </div>
    </header>
  );
}

function DashboardContent({ data }: { data: AdminOverview }) {
  const { summary, monthlyRegistrations } = data;

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total users"
          value={summary.totalUsers}
          description="All registered platform accounts"
          icon={Users}
          accent="bg-violet-50 text-violet-700"
        />

        <StatCard
          title="Customers"
          value={summary.totalCustomers}
          description="Accounts registered as customers"
          icon={UserRoundPlus}
          accent="bg-blue-50 text-blue-700"
        />

        <StatCard
          title="Total couriers"
          value={summary.totalCouriers}
          description="Accounts registered as couriers"
          icon={UserRoundCheck}
          accent="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          title="Pending approvals"
          value={summary.pendingCouriers}
          description="Courier applications awaiting review"
          icon={Clock3}
          accent="bg-amber-50 text-amber-700"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <RegistrationChart data={monthlyRegistrations} />
        <CourierApprovalCard summary={summary} />
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
            <ArrowUpRight size={21} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Platform account breakdown
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Account totals returned by the backend
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Customers", value: summary.totalCustomers },
            { label: "Couriers", value: summary.totalCouriers },
            { label: "Administrators", value: summary.totalAdmins },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {item.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default function AdminPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverview,
  });

  return (
    <div className="min-h-screen bg-slate-50/80">
      <div className="mx-auto max-w-[1600px] space-y-7 p-4 sm:p-6 lg:p-8">
        <DashboardHeader
          onRefresh={() => void refetch()}
          isFetching={isFetching}
        />

        {isLoading ? (
          <DashboardSkeleton />
        ) : isError || !data ? (
          <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
            <XCircle className="mx-auto text-rose-500" size={32} />

            <h2 className="mt-3 font-bold text-slate-900">
              Could not load dashboard data
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred."}
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Try again
            </button>
          </div>
        ) : (
          <DashboardContent data={data} />
        )}
      </div>
    </div>
  );
}
