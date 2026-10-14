"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  LoaderCircle,
  Package,
  Plus,
  Search,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { getMyShipments } from "@/lib/api/shipment-service";
import type { Shipment } from "@/lib/api/shipments";

const PAGE_SIZE = 10;

function formatCurrency(value: string | number) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "৳0.00";
  }

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function readableLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function statusClasses(status: string) {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 ring-rose-600/20";
    case "PAYMENT_PENDING":
    case "PENDING":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "IN_TRANSIT":
      return "bg-sky-50 text-sky-700 ring-sky-600/20";
    case "FAILED":
      return "bg-rose-50 text-rose-700 ring-rose-600/20";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-500/20";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClasses(status)}`}
    >
      {readableLabel(status)}
    </span>
  );
}

export default function ShipmentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["my-shipments"],
    queryFn: getMyShipments,
    staleTime: 30_000,
    retry: 1,
  });

  const shipments = data?.shipments ?? [];
  const meta = data?.meta;

  const normalizedSearch = search.trim().toLowerCase();

  const filteredShipments = shipments.filter((shipment: Shipment) => {
    const matchesStatus =
      statusFilter === "ALL" || shipment.status === statusFilter;

    const searchableText = [
      shipment.trackingNumber,
      shipment.senderAddress?.contactName,
      shipment.senderAddress?.city,
      shipment.receiverAddress?.contactName,
      shipment.receiverAddress?.city,
      shipment.serviceType,
      shipment.packageType,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesStatus && searchableText.includes(normalizedSearch);
  });

  // The API returns paginated results. This page displays the current
  // API page; client-side filtering searches only those returned results.
  const totalPages = Math.max(1, meta?.totalPage ?? 1);

  function goToPage(nextPage: number) {
    // Pagination parameters must be supported by the backend before
    // requesting a different page. Avoid displaying fake page changes.
    if (nextPage !== 1) {
      return;
    }

    setPage(1);
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Package className="size-4" />
            Customer Dashboard
            <span>/</span>
            Shipments
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            My Shipments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your deliveries and check their latest status.
          </p>
        </div>

        <Link
          href="/dashboard/shipments/create"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <Plus className="size-4" />
          Create Shipment
        </Link>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Total Shipments
            </p>
            <Package className="size-5 text-blue-600" />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {meta?.total ?? shipments.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            All shipments on your account
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">In Transit</p>
            <Truck className="size-5 text-sky-600" />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {
              shipments.filter((item: Shipment) => item.status === "IN_TRANSIT")
                .length
            }
          </p>
          <p className="mt-1 text-xs text-slate-500">
            On the way to their destination
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Delivered</p>
            <Package className="size-5 text-emerald-600" />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {
              shipments.filter((item: Shipment) => item.status === "DELIVERED")
                .length
            }
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Delivered shipments on this page
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tracking number, sender or city..."
                aria-label="Search shipments"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by shipment status"
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">All statuses</option>
              <option value="PAYMENT_PENDING">Payment Pending</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PICKED_UP">Picked Up</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              disabled={isFetching}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LoaderCircle
                className={`size-4 ${isFetching ? "animate-spin" : "hidden"}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {isPending ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8">
            <LoaderCircle className="size-8 animate-spin text-blue-600" />
            <p className="text-sm text-slate-500">Loading your shipments...</p>
          </div>
        ) : isError ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <CircleAlert className="size-9 text-rose-500" />
            <h2 className="mt-3 font-semibold text-slate-900">
              Couldn&apos;t load shipments
            </h2>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              {error instanceof Error
                ? error.message
                : "Something went wrong. Please try again."}
            </p>
            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100">
              <Package className="size-7 text-slate-500" />
            </div>
            <h2 className="mt-4 font-semibold text-slate-900">
              {shipments.length === 0
                ? "No shipments yet"
                : "No matching shipments"}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {shipments.length === 0
                ? "Create your first shipment to start tracking your deliveries."
                : "Try another tracking number, name, city or status filter."}
            </p>
            {shipments.length === 0 && (
              <Link
                href="/dashboard/shipments/create"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="size-4" />
                Create Shipment
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {filteredShipments.map((shipment: Shipment) => (
                <article
                  key={shipment.id}
                  className="p-4 transition hover:bg-slate-50/70 sm:p-5"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Tracking Number
                        </p>
                        <p className="mt-1 break-all font-semibold text-slate-950">
                          {shipment.trackingNumber}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <StatusBadge status={shipment.status} />
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            Payment: {readableLabel(shipment.paymentStatus)}
                          </span>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xs text-slate-500">Delivery fee</p>
                        <p className="mt-1 text-lg font-bold text-slate-950">
                          {formatCurrency(shipment.deliveryFee)}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400">
                          FROM
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                          {shipment.senderAddress?.contactName || "Sender"}
                        </p>
                        <p className="mt-0.5 wrap-break-word text-sm text-slate-500">
                          {[
                            shipment.senderAddress?.city,
                            shipment.senderAddress?.district,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Address unavailable"}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400">TO</p>
                        <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                          {shipment.receiverAddress?.contactName || "Receiver"}
                        </p>
                        <p className="mt-0.5 wrap-break-word text-sm text-slate-500">
                          {[
                            shipment.receiverAddress?.city,
                            shipment.receiverAddress?.district,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Address unavailable"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="size-4" />
                          {formatDate(shipment.createdAt)}
                        </span>
                        <span>{readableLabel(shipment.serviceType)}</span>
                        <span>{readableLabel(shipment.packageType)}</span>
                        <span>{shipment.weight} kg</span>
                      </div>

                      <Link
                        href={`/dashboard/shipments/${shipment.id}`}
                        className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl border border-blue-200 px-3.5 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 sm:self-auto"
                      >
                        View Details
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-sm text-slate-500">
                Showing {filteredShipments.length} matching shipment(s) on this
                page out of {meta?.total ?? shipments.length} total.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </button>
                <span className="text-sm text-slate-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
