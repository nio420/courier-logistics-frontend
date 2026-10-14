"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  Package,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPaymentById } from "@/lib/api/payment-service";

function formatMoney(amount: string, currency: string) {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return `${currency} ${amount}`;
  }

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
    dateStyle: "long",
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

export default function PaymentDetailsPage() {
  const params = useParams();

  const rawId = params?.id;

  const paymentId =
    typeof rawId === "string"
      ? rawId.trim()
      : Array.isArray(rawId) && typeof rawId[0] === "string"
        ? rawId[0].trim()
        : "";

  const paymentQuery = useQuery({
    queryKey: ["payment", paymentId],
    queryFn: () => getPaymentById(paymentId),
    enabled: paymentId.length > 0,
  });

  const payment = paymentQuery.data;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <Link
          href="/dashboard/payments"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to payment history
        </Link>

        <p className="mt-6 text-sm font-semibold tracking-wide text-primary">
          CUSTOMER PORTAL
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Payment Details
        </h1>

        <p className="mt-2 text-muted-foreground">
          Review your transaction and the shipment associated with it.
        </p>
      </div>

      {!paymentId ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border bg-card p-8 text-center">
          <CreditCard className="size-8 text-destructive" />
          <h2 className="font-semibold">Payment ID is missing</h2>
          <p className="text-sm text-muted-foreground">
            Open this page using the Details link for a specific payment.
          </p>
          <Link
            href="/dashboard/payments"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Back to payment history
          </Link>
        </div>
      ) : paymentQuery.isPending ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border bg-card">
          <RefreshCw className="size-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading payment details...
          </p>
        </div>
      ) : paymentQuery.isError ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border bg-card p-8 text-center">
          <CreditCard className="size-8 text-destructive" />

          <h2 className="font-semibold">Could not load payment details</h2>

          <p className="max-w-md wrap-break-word text-sm text-muted-foreground">
            {paymentQuery.error instanceof Error
              ? paymentQuery.error.message
              : "Something went wrong. Please try again."}
          </p>

          <button
            type="button"
            onClick={() => paymentQuery.refetch()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
        </div>
      ) : payment ? (
        <>
          <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b bg-muted/30 p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Payment amount
                  </p>

                  <p className="mt-2 text-3xl font-bold sm:text-4xl">
                    {formatMoney(payment.amount, payment.currency)}
                  </p>

                  <p className="mt-2 break-all text-sm text-muted-foreground">
                    Payment ID: {payment.id}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${statusStyle(payment.status)}`}
                >
                  {payment.status.toUpperCase() === "PAID" ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Clock3 className="size-4" />
                  )}

                  {readableLabel(payment.status)}
                </span>
              </div>
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
              <div>
                <p className="text-sm text-muted-foreground">Payment gateway</p>
                <p className="mt-1 font-semibold">
                  {readableLabel(payment.gateway)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Paid at</p>
                <p className="mt-1 font-semibold">
                  {formatDate(payment.paidAt)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="mt-1 break-all font-medium">
                  {payment.transactionId || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Gateway payment reference
                </p>
                <p className="mt-1 break-all font-medium">
                  {payment.gatewayPaymentId || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Created at</p>
                <p className="mt-1 font-medium">
                  {formatDate(payment.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Last updated</p>
                <p className="mt-1 font-medium">
                  {formatDate(payment.updatedAt)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Package className="size-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">Related shipment</h2>
                <p className="text-sm text-muted-foreground">
                  Shipment associated with this payment
                </p>
              </div>
            </div>

            {payment.shipment ? (
              <div className="mt-6 space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Tracking number
                    </p>

                    <p className="mt-1 break-all font-semibold">
                      {payment.shipment.trackingNumber}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/shipments/${payment.shipmentId}`}
                    className="inline-flex h-9 w-fit items-center gap-2 rounded-lg border px-3 text-sm font-medium transition hover:bg-muted"
                  >
                    View shipment
                    <ExternalLink className="size-4" />
                  </Link>
                </div>

                <div className="grid gap-4 border-t pt-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Service type
                    </p>
                    <p className="mt-1 font-medium">
                      {readableLabel(payment.shipment.serviceType)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Package type
                    </p>
                    <p className="mt-1 font-medium">
                      {readableLabel(payment.shipment.packageType)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Shipment status
                    </p>
                    <p className="mt-1 font-medium">
                      {readableLabel(payment.shipment.status)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">
                Shipment details were not included in this payment response.
              </p>
            )}
          </section>
        </>
      ) : null}
    </main>
  );
}
