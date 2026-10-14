"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  type AdminPaymentDetails as AdminPaymentDetailsType,
  getAdminPaymentById,
} from "@/lib/api/admin-payments";

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatAmount(amount: number | string, currency: string) {
  const value = Number(amount);

  if (!Number.isFinite(value)) return String(amount);

  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return String(amount) + " " + currency.toUpperCase();
  }
}

function formatLabel(value: string | null | undefined) {
  if (!value) return "—";

  return value.replaceAll("_", " ");
}

function getStatusStyle(status: string) {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "FAILED":
      return "bg-red-100 text-red-700";
    case "REFUNDED":
      return "bg-purple-100 text-purple-700";
    case "CANCELLED":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="min-w-0">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 wrap-break-word text-sm font-medium text-gray-900">
        {value === null || value === undefined || value === ""
          ? "—"
          : String(value)}
      </p>
    </div>
  );
}

function AddressDetails({
  title,
  address,
}: {
  title: string;
  address: unknown;
}) {
  let content = "No address information available.";

  if (typeof address === "string" && address.trim()) {
    content = address;
  } else if (address && typeof address === "object") {
    const addressObject = address as Record<string, unknown>;

    const fields = Object.entries(addressObject).filter(
      ([, value]) =>
        value !== null && value !== undefined && typeof value !== "object",
    );

    if (fields.length > 0) {
      content = fields
        .map(([key, value]) => {
          return key.replaceAll(/([A-Z])/g, " $1") + ": " + String(value);
        })
        .join("\n");
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      <p className="mt-3 whitespace-pre-line wrap-break-word text-sm leading-6 text-gray-600">
        {content}
      </p>
    </section>
  );
}

function PaymentInformation({ payment }: { payment: AdminPaymentDetailsType }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="font-semibold text-gray-900">Payment Information</h2>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <DetailItem label="Payment ID" value={payment.id} />
        <DetailItem label="Transaction ID" value={payment.transactionId} />
        <DetailItem
          label="Gateway Payment ID"
          value={payment.gatewayPaymentId}
        />
        <DetailItem label="Payment Gateway" value={payment.gateway} />
        <DetailItem label="Currency" value={payment.currency.toUpperCase()} />
        <DetailItem
          label="Amount"
          value={formatAmount(payment.amount, payment.currency)}
        />
        <DetailItem label="Created At" value={formatDate(payment.createdAt)} />
        <DetailItem label="Updated At" value={formatDate(payment.updatedAt)} />
        <DetailItem label="Paid At" value={formatDate(payment.paidAt)} />
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-500">Payment Status</p>
        <span
          className={
            "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold " +
            getStatusStyle(payment.status)
          }
        >
          {formatLabel(payment.status)}
        </span>
      </div>
    </section>
  );
}

function CustomerInformation({
  payment,
}: {
  payment: AdminPaymentDetailsType;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="font-semibold text-gray-900">Customer Information</h2>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <DetailItem label="Customer ID" value={payment.customer.id} />
        <DetailItem label="Customer Name" value={payment.customer.name} />
        <DetailItem label="Email Address" value={payment.customer.email} />
        <DetailItem label="Phone Number" value={payment.customer.phone} />
      </div>
    </section>
  );
}

function ShipmentInformation({
  payment,
}: {
  payment: AdminPaymentDetailsType;
}) {
  const shipment = payment.shipment;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-gray-900">Shipment Information</h2>

        {shipment.trackingNumber && (
          <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            {shipment.trackingNumber}
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <DetailItem label="Shipment ID" value={shipment.id} />
        <DetailItem label="Tracking Number" value={shipment.trackingNumber} />
        <DetailItem
          label="Shipment Status"
          value={formatLabel(shipment.status)}
        />
        <DetailItem
          label="Shipment Payment Status"
          value={formatLabel(shipment.paymentStatus)}
        />
        <DetailItem label="Service Type" value={shipment.serviceType} />
        <DetailItem label="Package Type" value={shipment.packageType} />
        <DetailItem
          label="Package Weight"
          value={String(shipment.weight) + " "}
        />
        <DetailItem
          label="Delivery Fee"
          value={formatAmount(shipment.deliveryFee, payment.currency)}
        />
        <DetailItem
          label="Shipment Created At"
          value={formatDate(shipment.createdAt)}
        />
      </div>
    </section>
  );
}

function GatewayResponse({ response }: { response: unknown }) {
  let formattedResponse = "No gateway response available.";

  if (response !== null && response !== undefined) {
    if (typeof response === "string") {
      formattedResponse = response;
    } else {
      try {
        formattedResponse = JSON.stringify(response, null, 2);
      } catch {
        formattedResponse = "Gateway response could not be displayed.";
      }
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="font-semibold text-gray-900">Gateway Response</h2>

      <pre className="mt-4 max-h-96 overflow-auto rounded-lg bg-gray-50 p-4 text-xs leading-5 text-gray-700">
        {formattedResponse}
      </pre>
    </section>
  );
}

export default function AdminPaymentDetails() {
  const params = useParams();
  const rawId = params.id;
  const paymentId = typeof rawId === "string" ? rawId : "";

  const {
    data: payment,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-payment", paymentId],
    queryFn: () => getAdminPaymentById(paymentId),
    enabled: Boolean(paymentId),
  });

  if (!paymentId) {
    return <div className="p-6 text-sm text-red-600">Invalid payment ID.</div>;
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          Loading payment details...
        </div>
      </div>
    );
  }

  if (isError || !payment) {
    return (
      <div className="space-y-4 p-4 sm:p-6">
        <Link
          href="/admin/payments"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Payments
        </Link>

        <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
          <p className="text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Failed to load payment details."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/payments"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Payments
          </Link>

          <h1 className="mt-3 break-all text-2xl font-bold text-gray-900">
            Payment Details
          </h1>

          <p className="mt-1 break-all text-sm text-gray-500">
            Payment ID: {payment.id}
          </p>
        </div>

        <span
          className={
            "inline-flex w-fit rounded-full px-3 py-1.5 text-sm font-semibold " +
            getStatusStyle(payment.status)
          }
        >
          {formatLabel(payment.status)}
        </span>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-sm text-gray-500">Total Payment Amount</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          {formatAmount(payment.amount, payment.currency)}
        </p>
        <p className="mt-2 text-sm text-gray-500">Gateway: {payment.gateway}</p>
      </section>

      <PaymentInformation payment={payment} />

      <CustomerInformation payment={payment} />

      <ShipmentInformation payment={payment} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AddressDetails
          title="Sender Address"
          address={payment.shipment.senderAddress}
        />

        <AddressDetails
          title="Receiver Address"
          address={payment.shipment.receiverAddress}
        />
      </div>

      <GatewayResponse response={payment.gatewayResponse} />
    </div>
  );
}
