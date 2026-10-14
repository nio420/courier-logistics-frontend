"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  type AdminPaymentQuery,
  getAdminPayments,
} from "@/lib/api/admin-payments";

const DEFAULT_LIMIT = 10;

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"];

export default function AdminPaymentsTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get("limit")) || DEFAULT_LIMIT),
  );
  const searchTerm = searchParams.get("searchTerm") ?? "";
  const status = searchParams.get("status") ?? "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  const [searchInput, setSearchInput] = useState(searchTerm);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = searchInput.trim();

      if (value === searchTerm) return;

      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("searchTerm", value);
      } else {
        params.delete("searchTerm");
      }

      params.set("page", "1");

      router.replace(pathname + "?" + params.toString(), {
        scroll: false,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, searchTerm, searchParams, pathname, router]);

  const updateQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(pathname + "?" + params.toString(), {
      scroll: false,
    });
  };

  const query: AdminPaymentQuery = {
    page,
    limit,
    searchTerm: searchTerm || undefined,
    status: status || undefined,
    sortBy,
    sortOrder,
  };

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-payments", query],
    queryFn: () => getAdminPayments(query),
  });

  const payments = data?.payments ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPage ?? 0;

  const formatAmount = (amount: number | string, currency: string) => {
    const value = Number(amount);

    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const statusStyle = (value: string) => {
    switch (value) {
      case "PAID":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "PENDING":
        return "border-amber-200 bg-amber-50 text-amber-700";
      case "FAILED":
        return "border-red-200 bg-red-50 text-red-700";
      case "REFUNDED":
        return "border-purple-200 bg-purple-50 text-purple-700";
      case "CANCELLED":
        return "border-gray-200 bg-gray-100 text-gray-700";
      default:
        return "border-gray-200 bg-gray-100 text-gray-700";
    }
  };

  const StatusBadge = ({ value }: { value: string }) => (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold " +
        statusStyle(value)
      }
    >
      <span
        className={
          "h-1.5 w-1.5 rounded-full " +
          (value === "PAID"
            ? "bg-emerald-500"
            : value === "PENDING"
              ? "bg-amber-500"
              : value === "FAILED"
                ? "bg-red-500"
                : value === "REFUNDED"
                  ? "bg-purple-500"
                  : "bg-gray-500")
        }
      />
      {value.replaceAll("_", " ")}
    </span>
  );

  return (
    <div className="min-w-0 space-y-6 overflow-hidden p-3 sm:space-y-8 sm:p-6 lg:p-8">
      <style jsx>{`
        @keyframes payment-enter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes payment-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .payment-enter {
          animation: payment-enter 0.45s ease-out both;
        }

        .payment-spinner {
          animation: payment-spin 0.8s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .payment-enter,
          .payment-spinner {
            animation: none;
          }
        }
      `}</style>

      {/* Header */}
      <div className="payment-enter relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-28 h-36 w-36 rounded-full bg-indigo-100/60 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              PAYMENT MANAGEMENT
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Payment History
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage transactions, monitor payment statuses, and review customer
              shipment charges in one place.
            </p>
          </div>

          {isFetching && !isLoading && (
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
              <span className="payment-spinner h-3.5 w-3.5 rounded-full border-2 border-blue-200 border-t-blue-600" />
              Updating results
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="payment-enter rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Find a transaction
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Search payments or narrow results using filters.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>

            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search customer, tracking or transaction..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              updateQuery({
                status: event.target.value,
                page: "1",
              })
            }
            aria-label="Filter by payment status"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 text-sm text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="">All payment statuses</option>
            {PAYMENT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>

          <select
            value={String(limit)}
            onChange={(event) =>
              updateQuery({
                limit: event.target.value,
                page: "1",
              })
            }
            aria-label="Payments per page"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 text-sm text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          >
            {[10, 20, 50, 100].map((value) => (
              <option key={value} value={value}>
                {value} per page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="payment-enter grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total matching payments
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {isLoading ? "—" : (meta?.total ?? 0).toLocaleString("en-BD")}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Based on current search and filters
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 10h18M7 15h3" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-medium text-slate-500">Current view</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            Page {page} <span className="font-normal text-slate-400">of</span>{" "}
            {Math.max(totalPages, 1)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {limit} records per page
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="payment-enter flex min-h-72 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-12 shadow-sm">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <span className="absolute inset-0 rounded-full border-4 border-blue-100" />
            <span className="payment-spinner absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-indigo-500" />
            <svg
              className="h-6 w-6 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 10h18M7 15h3" />
            </svg>
          </div>
          <h3 className="mt-5 text-base font-semibold text-slate-900">
            Loading payment history
          </h3>
          <p className="mt-1 text-center text-sm text-slate-500">
            Fetching the latest transaction records...
          </p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="payment-enter rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5m0 3h.01" />
            </svg>
          </div>

          <h3 className="mt-4 font-semibold text-slate-900">
            Unable to load payments
          </h3>
          <p className="mx-auto mt-2 max-w-lg break-words text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Failed to load payments."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            Try again
          </button>
        </div>
      )}

      {/* Mobile payment cards */}
      {!isLoading && !isError && (
        <>
          <div className="space-y-3 md:hidden">
            {payments.map((payment, index) => (
              <article
                key={payment.id}
                style={{ animationDelay: Math.min(index * 45, 300) + "ms" }}
                className="payment-enter overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Shipment tracking
                    </p>
                    <p className="mt-1 break-all text-sm font-bold text-slate-900">
                      {payment.shipment?.trackingNumber ?? "—"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {payment.shipment?.status?.replaceAll("_", " ") ?? "—"}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <StatusBadge value={payment.status} />
                  </div>
                </div>

                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">
                        Customer
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                        {payment.customer?.name ?? "Unknown customer"}
                      </p>
                      <p className="mt-1 break-all text-xs text-slate-500">
                        {payment.customer?.email ?? "—"}
                      </p>
                    </div>

                    <div className="min-w-0 text-right">
                      <p className="text-xs font-medium text-slate-400">
                        Amount
                      </p>
                      <p className="mt-1 break-words text-base font-bold text-slate-900">
                        {formatAmount(payment.amount, payment.currency)}
                      </p>
                      <p className="mt-1 break-words text-xs text-slate-500">
                        {payment.gateway}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">
                        Transaction ID
                      </p>
                      <p className="mt-1 break-all text-xs font-medium text-slate-700">
                        {payment.transactionId ||
                          payment.gatewayPaymentId ||
                          "—"}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">
                        Paid at
                      </p>
                      <p className="mt-1 break-words text-xs font-medium text-slate-700">
                        {formatDate(payment.paidAt)}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={"/admin/payments/" + payment.id}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition duration-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                  >
                    View payment details
                    <svg
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}

            {payments.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m16 16 4 4M8 11h6" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">
                  No payments found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filter.
                </p>
              </div>
            )}
          </div>

          {/* Desktop payment table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Transaction records
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Detailed payment information for each shipment.
                </p>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {meta?.total ?? 0} total records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-250 text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Customer</th>
                    <th className="px-5 py-4 font-semibold">Shipment</th>
                    <th className="px-5 py-4 font-semibold">Amount</th>
                    <th className="px-5 py-4 font-semibold">Gateway</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Paid at</th>
                    <th className="px-5 py-4 font-semibold">Details</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="transition-colors duration-200 hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {payment.customer?.name ?? "Unknown customer"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {payment.customer?.email ?? "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {payment.shipment?.trackingNumber ?? "—"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {payment.shipment?.status?.replaceAll("_", " ") ??
                            "—"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                        {formatAmount(payment.amount, payment.currency)}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {payment.gateway}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge value={payment.status} />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {formatDate(payment.paidAt)}
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          href={"/admin/payments/" + payment.id}
                          className="inline-flex items-center gap-1.5 font-semibold text-blue-600 transition-colors hover:text-blue-800"
                        >
                          View details
                          <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14m-6-6 6 6-6 6" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <p className="font-semibold text-slate-900">
                          No payments found
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Try changing your search or filter.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sorting */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Sort transactions
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Choose how payments are ordered.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label
                htmlFor="payment-sort"
                className="shrink-0 text-sm text-slate-500"
              >
                Sort by
              </label>

              <select
                id="payment-sort"
                value={sortBy + ":" + sortOrder}
                onChange={(event) => {
                  const [nextSortBy, nextSortOrder] =
                    event.target.value.split(":");

                  updateQuery({
                    sortBy: nextSortBy,
                    sortOrder: nextSortOrder,
                    page: "1",
                  });
                }}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:flex-none"
              >
                <option value="createdAt:desc">Newest first</option>
                <option value="createdAt:asc">Oldest first</option>
                <option value="amount:desc">Amount: high to low</option>
                <option value="amount:asc">Amount: low to high</option>
                <option value="paidAt:desc">Recently paid</option>
                <option value="paidAt:asc">Paid: oldest first</option>
                <option value="status:asc">Status A–Z</option>
                <option value="status:desc">Status Z–A</option>
              </select>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm text-slate-500">
              {meta?.total
                ? "Showing " +
                  String((page - 1) * limit + 1) +
                  "–" +
                  String(Math.min(page * limit, meta.total)) +
                  " of " +
                  String(meta.total) +
                  " payments"
                : "Showing 0 payments"}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updateQuery({ page: String(page - 1) })}
                className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-700 transition duration-200 hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
              >
                Previous
              </button>

              <span className="min-w-20 text-center text-sm font-medium text-slate-600">
                Page {page} of {Math.max(totalPages, 1)}
              </span>

              <button
                type="button"
                disabled={page >= totalPages || totalPages === 0}
                onClick={() => updateQuery({ page: String(page + 1) })}
                className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-700 transition duration-200 hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
