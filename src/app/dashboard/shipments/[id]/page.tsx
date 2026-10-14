"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Package, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import {
  cancelShipment,
  createPaymentSession,
  getShipmentById,
} from "@/lib/api/shipment-service";

type ShipmentAddress = {
  contactName: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
};

type ShipmentHub = {
  name: string;
  city: string;
  district: string;
};

type ShipmentItem = {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  weight: string;
  declaredValue: string;
};

type ShipmentTrackingEvent = {
  id: string;
  status: string;
  note: string | null;
  createdAt: string;
  location: {
    latitude: number;
    longitude: number;
  } | null;
};

type ShipmentDetails = {
  id: string;
  trackingNumber: string;
  serviceType: string;
  packageType: string;
  weight: string;
  deliveryFee: string;
  paymentStatus: string;
  status: string;
  pickupDate: string | null;
  estimatedDeliveryDate: string | null;
  deliveredAt: string | null;
  failureReason: string | null;
  createdAt: string;
  items: ShipmentItem[];
  tracking: ShipmentTrackingEvent[];
  senderAddress: ShipmentAddress;
  receiverAddress: ShipmentAddress;
  originHub: ShipmentHub | null;
  destinationHub: ShipmentHub | null;
};

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

function formatMoney(value: string | number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function StatusBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    DELIVERED: "bg-emerald-100 text-emerald-700",
    PAID: "bg-emerald-100 text-emerald-700",
    IN_TRANSIT: "bg-blue-100 text-blue-700",
    OUT_FOR_DELIVERY: "bg-blue-100 text-blue-700",
    CONFIRMED: "bg-sky-100 text-sky-700",
    PAYMENT_PENDING: "bg-amber-100 text-amber-800",
    PENDING: "bg-amber-100 text-amber-800",
    FAILED: "bg-red-100 text-red-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[value] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {formatLabel(value)}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="wrap-break-word text-sm font-medium sm:max-w-[60%] sm:text-right">
        {value || "Not available"}
      </span>
    </div>
  );
}

export default function ShipmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const shipmentId = params.id;

  const shipmentQuery = useQuery({
    queryKey: ["shipment", shipmentId],
    queryFn: () => getShipmentById(shipmentId),
    enabled: Boolean(shipmentId),
    retry: 1,
  });

  const paymentMutation = useMutation({
    mutationFn: () => createPaymentSession(shipmentId),

    onSuccess: (response) => {
      const paymentUrl = response.data?.paymentUrl;

      if (!paymentUrl) {
        toast.error("Payment checkout URL was not returned.");
        return;
      }

      window.location.assign(paymentUrl);
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Could not start payment.",
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelShipment(shipmentId),

    onSuccess: async () => {
      toast.success("Shipment cancelled successfully.");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["shipment", shipmentId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["my-shipments"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["customer-dashboard"],
        }),
      ]);

      await shipmentQuery.refetch();
    },

    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel shipment.",
      );
    },
  });

  if (shipmentQuery.isPending) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-muted" />
          <div className="h-40 rounded-xl bg-muted" />
          <div className="h-64 rounded-xl bg-muted" />
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Loading shipment details...
        </p>
      </main>
    );
  }

  if (shipmentQuery.isError || !shipmentQuery.data) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/shipments"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shipments
        </Link>

        <div className="mt-8 rounded-xl border p-6">
          <h1 className="text-xl font-semibold">Unable to load shipment</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {shipmentQuery.error instanceof Error
              ? shipmentQuery.error.message
              : "Please try again."}
          </p>

          <button
            type="button"
            onClick={() => shipmentQuery.refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </main>
    );
  }

  // Explicitly type the detailed response to avoid missing-property
  // and implicit-any errors in the details page.
  const shipment: ShipmentDetails =
    shipmentQuery.data as unknown as ShipmentDetails;

  const canPay =
    shipment.paymentStatus === "PENDING" &&
    shipment.status === "PAYMENT_PENDING";

  // A paid shipment must never show the cancel action.
  const canCancel =
    shipment.paymentStatus !== "PAID" &&
    ["PAYMENT_PENDING", "PENDING", "CONFIRMED"].includes(shipment.status);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/shipments"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All shipments
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">SHIPMENT DETAILS</p>

          <h1 className="mt-2 break-all text-2xl font-bold tracking-tight sm:text-3xl">
            {shipment.trackingNumber}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Created {formatDate(shipment.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge value={shipment.status} />
          <StatusBadge value={shipment.paymentStatus} />
        </div>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <MapPin className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold">Delivery route</h2>
                <p className="text-sm text-muted-foreground">
                  Origin to destination
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  From
                </p>

                <p className="mt-2 font-semibold">
                  {shipment.originHub?.name ?? "Origin hub"}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {shipment.senderAddress?.city},{" "}
                  {shipment.senderAddress?.district}
                </p>

                <p className="mt-1 text-sm">
                  {shipment.senderAddress?.addressLine}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  To
                </p>

                <p className="mt-2 font-semibold">
                  {shipment.destinationHub?.name ?? "Destination hub"}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {shipment.receiverAddress?.city},{" "}
                  {shipment.receiverAddress?.district}
                </p>

                <p className="mt-1 text-sm">
                  {shipment.receiverAddress?.addressLine}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Package information</h2>
            </div>

            <div className="mt-4 divide-y">
              <InfoRow
                label="Service type"
                value={formatLabel(shipment.serviceType)}
              />

              <InfoRow
                label="Package type"
                value={formatLabel(shipment.packageType)}
              />

              <InfoRow label="Total weight" value={`${shipment.weight} kg`} />

              <InfoRow
                label="Pickup date"
                value={formatDate(shipment.pickupDate)}
              />

              <InfoRow
                label="Estimated delivery"
                value={formatDate(shipment.estimatedDeliveryDate)}
              />

              <InfoRow
                label="Delivered at"
                value={formatDate(shipment.deliveredAt)}
              />
            </div>

            <div className="mt-5 space-y-3">
              {shipment.items.map((item: ShipmentItem) => (
                <div key={item.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-medium">{item.name}</h3>

                    <span className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </span>
                  </div>

                  {item.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm">
                    <span className="text-muted-foreground">
                      Weight: {item.weight} kg
                    </span>

                    <span>
                      Declared value: {formatMoney(item.declaredValue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 sm:p-6">
            <h2 className="font-semibold">Tracking history</h2>

            {shipment.tracking.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No tracking updates are available yet.
              </p>
            ) : (
              <ol className="mt-5 space-y-5">
                {[...shipment.tracking]
                  .sort(
                    (a: ShipmentTrackingEvent, b: ShipmentTrackingEvent) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .map((event: ShipmentTrackingEvent) => (
                    <li key={event.id} className="flex gap-3">
                      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium">
                            {formatLabel(event.status)}
                          </span>

                          <span className="text-xs text-muted-foreground">
                            {formatDate(event.createdAt)}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {event.note || "Status updated"}
                        </p>

                        {event.location && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {event.location.latitude},{" "}
                            {event.location.longitude}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
              </ol>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border bg-card p-5 sm:p-6">
            <h2 className="font-semibold">Delivery charges</h2>

            <p className="mt-4 text-3xl font-bold">
              {formatMoney(shipment.deliveryFee)}
            </p>

            <div className="mt-4 divide-y">
              <InfoRow
                label="Payment status"
                value={formatLabel(shipment.paymentStatus)}
              />

              <InfoRow
                label="Shipment status"
                value={formatLabel(shipment.status)}
              />
            </div>

            {canPay && (
              <button
                type="button"
                onClick={() => paymentMutation.mutate()}
                disabled={paymentMutation.isPending}
                className="mt-5 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paymentMutation.isPending ? "Starting checkout..." : "Pay now"}
              </button>
            )}

            {canCancel && (
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to cancel this shipment?",
                    )
                  ) {
                    cancelMutation.mutate();
                  }
                }}
                disabled={cancelMutation.isPending}
                className="mt-3 w-full rounded-lg border border-destructive px-4 py-3 text-sm font-semibold text-destructive disabled:opacity-60"
              >
                {cancelMutation.isPending ? "Cancelling..." : "Cancel shipment"}
              </button>
            )}

            {shipment.status === "FAILED" && shipment.failureReason && (
              <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {shipment.failureReason}
              </p>
            )}
          </div>

          <div className="rounded-xl border bg-card p-5 sm:p-6">
            <h2 className="font-semibold">Sender</h2>

            <p className="mt-4 font-medium">
              {shipment.senderAddress?.contactName}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {shipment.senderAddress?.phone}
            </p>

            <div className="my-5 border-t" />

            <h2 className="font-semibold">Receiver</h2>

            <p className="mt-4 font-medium">
              {shipment.receiverAddress?.contactName}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {shipment.receiverAddress?.phone}
            </p>
          </div>

          <Link
            href="/dashboard/shipments"
            className="block rounded-lg border px-4 py-3 text-center text-sm font-medium hover:bg-muted"
          >
            Back to all shipments
          </Link>
        </aside>
      </section>
    </main>
  );
}
