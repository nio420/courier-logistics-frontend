"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  ExternalLink,
  ReceiptText,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getPayments } from "@/lib/api/payment-service";

const PAGE_SIZE = 10;

function formatMoney(amount: string, currency: string) {
  const value = Number(amount);

  if (!Number.isFinite(value)) return `${currency} ${amount}`;

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function readableLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function statusStyle(status: string) {
  switch (status.toUpperCase()) {
    case "PAID":
    case "SUCCEEDED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "PENDING":
    case "PROCESSING":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "FAILED":
    case "CANCELLED":
      return "border-red-200 bg-red-50 text-red-700";
    case "REFUNDED":
      return "border-blue-200 bg-blue-50 text-blue-700";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

export default function PaymentHistoryPage() {
  const [page, setPage] = useState(1);

  const paymentsQuery = useQuery({
    queryKey: ["payment-history", page, PAGE_SIZE],
    queryFn: () => getPayments(page, PAGE_SIZE),
  });

  const payments = paymentsQuery.data?.payments ?? [];
  const meta = paymentsQuery.data?.meta;
  const totalPages = Math.max(meta?.totalPage ?? 1, 1);
  const totalPayments = meta?.total ?? 0;

  const paidTotal = payments
    .filter((payment) => payment.status.toUpperCase() === "PAID")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>

          <p className="text-sm font-semibold tracking-wide text-primary">
            CUSTOMER PORTAL
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Payment History
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Review your shipment payments, transaction references, and payment
            status in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => paymentsQuery.refetch()}
          disabled={paymentsQuery.isFetching}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`size-4 ${paymentsQuery.isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total payments</p>
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <ReceiptText className="size-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold">{totalPayments}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Records across all pages
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Paid amount on this page
            </p>
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600">
              <CreditCard className="size-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold">
            {formatMoney(String(paidTotal), payments[0]?.currency ?? "BDT")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sum of paid records on the current page
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex flex-col gap-2 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Transactions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your payment records and associated shipments
            </p>
          </div>
          <span className="text-sm text-muted-foreground">
            Page {meta?.page ?? page} of {totalPages}
          </span>
        </div>

        {paymentsQuery.isPending ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8">
            <RefreshCw className="size-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading payment history...
            </p>
          </div>
        ) : paymentsQuery.isError ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="rounded-full bg-destructive/10 p-3 text-destructive">
              <ArrowDownRight className="size-6" />
            </div>
            <h3 className="font-semibold">Could not load payments</h3>
            <p className="max-w-md text-sm text-muted-foreground">
              {paymentsQuery.error instanceof Error
                ? paymentsQuery.error.message
                : "Something went wrong. Please try again."}
            </p>
            <button
              type="button"
              onClick={() => paymentsQuery.refetch()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Try again
            </button>
          </div>
        ) : payments.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-muted p-4">
              <CreditCard className="size-7 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-semibold">No payments yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Your shipment payment records will appear here once available.
            </p>
            <Link
              href="/dashboard/shipments"
              className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              View shipments
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y">
              {payments.map((payment) => (
                <article
                  key={payment.id}
                  className="p-5 transition hover:bg-muted/30 sm:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-1 rounded-xl bg-primary/10 p-3 text-primary">
                        <CreditCard className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="break-all font-semibold">
                            {payment.shipment?.trackingNumber ??
                              "Shipment payment"}
                          </h3>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle(payment.status)}`}
                          >
                            {readableLabel(payment.status)}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {readableLabel(payment.gateway)} ·{" "}
                          {readableLabel(payment.shipment?.serviceType ?? "—")}
                          {" · "}
                          {readableLabel(payment.shipment?.packageType ?? "—")}
                        </p>

                        <p className="mt-2 break-all text-xs text-muted-foreground">
                          Transaction:{" "}
                          {payment.transactionId || "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-end">
                      <div className="lg:text-right">
                        <p className="text-xl font-bold">
                          {formatMoney(payment.amount, payment.currency)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(payment.paidAt ?? payment.createdAt)}
                        </p>
                      </div>

                      <Link
                        href={`/dashboard/payments/${payment.id}`}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition hover:bg-muted"
                      >
                        Details
                        <ExternalLink className="size-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-muted-foreground">
                Showing {payments.length} of {totalPayments} payment records
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1 || paymentsQuery.isFetching}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="size-4" />
                  Previous
                </button>

                <span className="min-w-20 text-center text-sm font-medium">
                  {meta?.page ?? page} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={page >= totalPages || paymentsQuery.isFetching}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
