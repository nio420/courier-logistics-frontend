"use client";

import { useQuery } from "@tanstack/react-query";
import { getCourierDashboard } from "@/lib/api/courier";

function formatMoney(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);
}

function StatCard({
  title,
  value,
  description,
  icon,
  iconStyle,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  iconStyle: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 wrap-break-word text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${iconStyle}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

export default function CourierEarningsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["courier-dashboard"],
    queryFn: getCourierDashboard,
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-9 w-56 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-52 animate-pulse rounded-2xl bg-white shadow-sm" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-32 animate-pulse rounded-2xl bg-white shadow-sm" />
            <div className="h-32 animate-pulse rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-xl font-bold text-rose-600">
            !
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load earnings
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading your earnings."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const totalEarnings = Number(data.totalEarnings ?? 0);
  const totalDeliveries = Number(data.totalDeliveries ?? 0);
  const averagePerDelivery =
    totalDeliveries > 0 && Number.isFinite(totalEarnings)
      ? totalEarnings / totalDeliveries
      : 0;

  return (
    <main className="min-h-screen bg-slate-50/80 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Heading */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Courier workspace
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Earnings
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Review your recorded earnings and completed delivery performance.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <span aria-hidden="true">↻</span>
            {isFetching ? "Refreshing..." : "Refresh earnings"}
          </button>
        </section>

        {/* Main earnings card */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-700 via-emerald-800 to-teal-950 p-6 text-white shadow-lg sm:p-8 lg:p-10">
          <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-teal-300/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  ৳
                </span>
                Total recorded earnings
              </div>

              <p className="mt-5 wrap-break-word text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {formatMoney(data.totalEarnings)}
              </p>

              <p className="mt-4 max-w-lg text-sm leading-6 text-emerald-100">
                Your cumulative earnings recorded in your courier profile.
                Completing a delivery adds its delivery fee to this total in
                your backend.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-emerald-50">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Live data from your dashboard API
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                <p className="text-sm text-emerald-100">Completed deliveries</p>
                <p className="mt-2 text-3xl font-bold">
                  {data.totalDeliveries}
                </p>
                <p className="mt-1 text-xs text-emerald-100/80">
                  Total recorded in your courier profile
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                <p className="text-sm text-emerald-100">
                  Average earnings per delivery
                </p>
                <p className="mt-2 wrap-break-word text-2xl font-bold sm:text-3xl">
                  {formatMoney(averagePerDelivery)}
                </p>
                <p className="mt-1 text-xs text-emerald-100/80">
                  Cumulative earnings divided by total deliveries
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Supporting cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            title="Total earnings"
            value={formatMoney(data.totalEarnings)}
            description="Cumulative amount stored in your courier profile."
            icon="৳"
            iconStyle="bg-emerald-50 text-emerald-700"
          />

          <StatCard
            title="Completed deliveries"
            value={data.totalDeliveries}
            description="Total successfully delivered shipments recorded by the backend."
            icon="✓"
            iconStyle="bg-blue-50 text-blue-700"
          />
        </section>

        {/* Earnings visual */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Earnings overview
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Your total earnings and delivery count, based on the current
              dashboard response.
            </p>
          </div>

          <div className="mt-7 grid gap-8 md:grid-cols-2 md:items-center">
            {/* Total earnings bar */}
            <div className="rounded-2xl bg-emerald-50/70 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-emerald-900">
                  Recorded earnings
                </span>
                <span className="text-sm font-bold text-emerald-800">
                  {formatMoney(data.totalEarnings)}
                </span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-emerald-100">
                <div
                  className="h-full rounded-full bg-emerald-600"
                  style={{
                    width: totalEarnings > 0 ? "100%" : "0%",
                  }}
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-emerald-800/80">
                This represents the full recorded total, not a daily or monthly
                breakdown.
              </p>
            </div>

            {/* Delivery count bar */}
            <div className="rounded-2xl bg-blue-50/70 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-blue-900">
                  Completed deliveries
                </span>
                <span className="text-sm font-bold text-blue-800">
                  {data.totalDeliveries}
                </span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-blue-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: totalDeliveries > 0 ? "100%" : "0%",
                  }}
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-blue-800/80">
                This represents your full recorded delivery count.
              </p>
            </div>
          </div>
        </section>

        {/* History limitation */}
        <section className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 font-bold text-amber-700">
            i
          </div>
          <div>
            <h2 className="text-sm font-bold text-amber-950">
              Earnings Summary
            </h2>
            <p className="mt-1 text-sm leading-6 text-amber-900/80">
              Your total earnings are calculated from completed deliveries.
              Detailed earnings records and payout information are not currently
              available.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
