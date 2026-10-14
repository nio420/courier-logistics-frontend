"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Star,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";
import Link from "next/link";

import {
  type DashboardShipment,
  getCustomerDashboard,
} from "@/lib/api/dashboard";

function formatCurrency(amount: number | string) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusStyle(status: string) {
  switch (status.toUpperCase()) {
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "PAYMENT_PENDING":
    case "PENDING":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "IN_TRANSIT":
    case "PICKED_UP":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";
    case "CANCELLED":
      return "bg-red-50 text-red-700 ring-red-600/20";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-600/10";
  }
}

function getStatusLabel(status: string) {
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
  icon: typeof Package;
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

function ShipmentRow({ shipment }: { shipment: DashboardShipment }) {
  const needsPayment = shipment.status === "PAYMENT_PENDING";

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Package size={20} />
        </div>

        <div className="min-w-0">
          <p className="break-all text-sm font-bold text-slate-800">
            {shipment.trackingNumber}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {shipment.serviceType} · {shipment.packageType}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatDate(shipment.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pl-13 sm:justify-end sm:pl-0">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(shipment.status)}`}
        >
          {getStatusLabel(shipment.status)}
        </span>

        <span className="text-sm font-bold text-slate-800">
          {formatCurrency(shipment.deliveryFee)}
        </span>

        <Link
          href={`/dashboard/shipments/${shipment.id}`}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          Details
          <ArrowRight size={14} />
        </Link>

        {needsPayment && (
          <Link
            href={`/dashboard/shipments/${shipment.id}`}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            Pay Now
          </Link>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["customer-dashboard"],
    queryFn: getCustomerDashboard,
    retry: 1,
    staleTime: 30_000,
  });

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-2xl bg-slate-200/70" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl bg-white shadow-sm"
            />
          ))}
        </div>

        <div className="h-72 animate-pulse rounded-2xl bg-white shadow-sm" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <RefreshCw size={25} />
        </div>

        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Could not load your dashboard
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
      title: "Total Shipments",
      value: data.totalShipments,
      description: "All shipments you've created",
      icon: Package,
      iconClass: "bg-blue-50 text-blue-600",
    },
    {
      title: "Pending Shipments",
      value: data.pendingShipments,
      description: "Shipments awaiting progress",
      icon: Clock3,
      iconClass: "bg-amber-50 text-amber-600",
    },
    {
      title: "In Transit",
      value: data.inTransitShipments,
      description: "Shipments currently on the way",
      icon: Truck,
      iconClass: "bg-violet-50 text-violet-600",
    },
    {
      title: "Delivered",
      value: data.deliveredShipments,
      description: "Successfully delivered shipments",
      icon: CheckCircle2,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-xl shadow-blue-900/10 sm:p-8 lg:p-9">
        <div className="pointer-events-none absolute -right-12 -top-20 size-64 rounded-full border-35 border-white/5" />
        <div className="pointer-events-none absolute -bottom-32 right-32 size-64 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50">
              <span className="size-2 rounded-full bg-emerald-300" />
              Customer Dashboard
            </span>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Your deliveries,
              <br className="hidden sm:block" /> all in one place.
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-blue-100 sm:text-base">
              Manage shipments, monitor delivery progress, and keep track of
              your payments from one simple workspace.
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

            <Link
              href="/dashboard/shipments/create"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <Plus size={18} />
              New Shipment
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Overview</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your delivery activity at a glance
            </p>
          </div>

          <span className="text-xs text-slate-400">
            {isFetching ? "Updating..." : "Live dashboard data"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* Financial and secondary statistics */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Amount Spent
              </p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {formatCurrency(data.totalSpent)}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Total spending recorded on your account
              </p>
            </div>

            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Wallet size={24} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <CreditCard size={16} />
                <span className="text-xs font-medium">Payments</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {data.totalPayments}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Star size={16} />
                <span className="text-xs font-medium">Reviews Given</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {data.totalReviews}
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/payments"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            View payment history
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-extrabold text-slate-900">
            Shipment Summary
          </h2>
          <p className="mt-1 text-sm text-slate-500">Current delivery status</p>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <span className="size-2.5 rounded-full bg-emerald-500" />
                Delivered
              </span>
              <span className="text-sm font-bold text-slate-900">
                {data.deliveredShipments}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <span className="size-2.5 rounded-full bg-blue-500" />
                In Transit
              </span>
              <span className="text-sm font-bold text-slate-900">
                {data.inTransitShipments}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <span className="size-2.5 rounded-full bg-amber-500" />
                Pending
              </span>
              <span className="text-sm font-bold text-slate-900">
                {data.pendingShipments}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <span className="size-2.5 rounded-full bg-red-500" />
                Cancelled
              </span>
              <span className="text-sm font-bold text-slate-900">
                {data.cancelledShipments}
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/shipments"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            All shipments
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Recent shipments */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Recent Shipments
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your latest parcel activity
            </p>
          </div>

          <Link
            href="/dashboard/shipments"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {data.recentShipments.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Package size={26} />
            </div>
            <p className="mt-4 font-bold text-slate-900">No shipments yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Create your first shipment to get started.
            </p>
            <Link
              href="/dashboard/shipments/new"
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create shipment
            </Link>
          </div>
        ) : (
          <div className="mt-3">
            {data.recentShipments.map((shipment) => (
              <ShipmentRow key={shipment.id} shipment={shipment} />
            ))}
          </div>
        )}
      </section>

      {/* Recent reviews */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Recent Reviews
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Feedback you have shared with couriers
            </p>
          </div>

          <Link
            href="/dashboard/reviews"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            All reviews
            <ArrowRight size={16} />
          </Link>
        </div>

        {data.recentReviews.length === 0 ? (
          <div className="py-10 text-center">
            <Star className="mx-auto text-slate-300" size={28} />
            <p className="mt-3 text-sm font-semibold text-slate-700">
              No reviews yet
            </p>
          </div>
        ) : (
          <div className="mt-3 divide-y divide-slate-100">
            {data.recentReviews.map((review) => (
              <div key={review.id} className="flex gap-3 py-4 first:pt-2">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <Star size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-800">
                      {review.courier.name}
                    </p>

                    <div
                      className="flex items-center gap-1"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={14}
                          className={
                            index < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-1 wrap-break-word text-sm leading-6 text-slate-600">
                    {review.comment}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                    <span className="break-all">
                      {review.shipment.trackingNumber}
                    </span>
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
