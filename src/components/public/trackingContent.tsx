"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Search,
  Truck,
} from "lucide-react";
import { type FormEvent, useState } from "react";

import {
  getShipmentTracking,
  getTrackingHistory,
  type TrackedShipment,
  type TrackingEvent,
} from "@/lib/api/tracking-service";

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusStyle(status: string) {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-100 text-emerald-700 ring-emerald-200";
    case "IN_TRANSIT":
    case "PICKED_UP":
      return "bg-blue-100 text-blue-700 ring-blue-200";
    case "PAYMENT_PENDING":
    case "PAYMENT_FAILED":
    case "DELIVERY_FAILED":
      return "bg-amber-100 text-amber-700 ring-amber-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyle(status)}`}
    >
      {formatStatus(status)}
    </span>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {message}
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
      Loading tracking information...
    </div>
  );
}

function TrackingTimeline({
  events,
  title = "Tracking history",
}: {
  events: TrackingEvent[];
  title?: string;
}) {
  // The history endpoint may return newest events first.
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  if (sortedEvents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-sm text-slate-500">
        No tracking events are available yet.
      </div>
    );
  }

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">
            {sortedEvents.length} tracking{" "}
            {sortedEvents.length === 1 ? "event" : "events"}
          </p>
        </div>
      </div>

      <div className="relative">
        {sortedEvents.map((event, index) => {
          const isLast = index === sortedEvents.length - 1;

          return (
            <div key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast && (
                <div className="absolute left-3.75 top-8 h-full w-px bg-slate-200" />
              )}

              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${
                  event.status === "DELIVERED"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {event.status === "DELIVERED" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Truck className="h-4 w-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <StatusBadge status={event.status} />
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatDate(event.createdAt)}
                  </span>
                </div>

                {event.note && (
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {event.note}
                  </p>
                )}

                {event.hub && (
                  <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-800">
                        {event.hub.name}
                      </p>
                      <p className="text-xs">
                        {event.hub.address}, {event.hub.city}
                      </p>
                    </div>
                  </div>
                )}

                {event.location && (
                  <p className="mt-2 text-xs text-slate-500">
                    Coordinates: {event.location.latitude},{" "}
                    {event.location.longitude}
                  </p>
                )}

                {event.courier && (
                  <p className="mt-2 text-sm text-slate-600">
                    Courier:{" "}
                    <span className="font-medium text-slate-800">
                      {event.courier.name}
                    </span>
                  </p>
                )}

                {event.updater && (
                  <p className="mt-1 text-xs text-slate-400">
                    Updated by {event.updater.name}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ShipmentDetails({ shipment }: { shipment: TrackedShipment }) {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Tracking number</p>
            <h2 className="mt-1 break-all text-xl font-bold text-slate-900">
              {shipment.trackingNumber}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Shipment ID: {shipment.id}
            </p>
          </div>
          <StatusBadge status={shipment.status} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Payment</p>
            <p className="mt-1 font-semibold text-slate-900">
              {formatStatus(shipment.paymentStatus)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Delivery fee</p>
            <p className="mt-1 font-semibold text-slate-900">
              ৳
              {Number(shipment.deliveryFee).toLocaleString("en-BD", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Service / Package</p>
            <p className="mt-1 font-semibold text-slate-900">
              {formatStatus(shipment.serviceType)}
            </p>
            <p className="text-xs text-slate-500">
              {formatStatus(shipment.packageType)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Weight</p>
            <p className="mt-1 font-semibold text-slate-900">
              {shipment.weight} kg
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <AddressCard title="Sender" address={shipment.senderAddress} />
          <AddressCard title="Receiver" address={shipment.receiverAddress} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <HubCard title="Origin hub" hub={shipment.originHub} />
          <HubCard title="Destination hub" hub={shipment.destinationHub} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DateCard
            label="Estimated delivery"
            value={shipment.estimatedDeliveryDate}
          />
          <DateCard label="Delivered at" value={shipment.deliveredAt} />
        </div>

        {shipment.failureReason && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Delivery note: {shipment.failureReason}
          </div>
        )}
      </section>

      <TrackingTimeline events={shipment.tracking ?? []} />
    </div>
  );
}

function AddressCard({
  title,
  address,
}: {
  title: string;
  address: TrackedShipment["senderAddress"];
}) {
  return (
    <div className="rounded-xl border p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <p className="font-semibold text-slate-900">{address.contactName}</p>
      <p className="mt-1 text-sm text-slate-600">{address.phone}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {address.addressLine}
        <br />
        {address.city}, {address.district} {address.postalCode}
      </p>
    </div>
  );
}

function HubCard({
  title,
  hub,
}: {
  title: string;
  hub: TrackedShipment["originHub"];
}) {
  return (
    <div className="rounded-xl border p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      {hub ? (
        <>
          <p className="font-semibold text-slate-900">{hub.name}</p>
          <p className="mt-1 text-sm text-slate-600">
            {hub.address}, {hub.city}
          </p>
          <p className="mt-2 text-xs text-slate-500">Hub code: {hub.code}</p>
        </>
      ) : (
        <p className="text-sm text-slate-400">Not assigned</p>
      )}
    </div>
  );
}

function DateCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border p-4">
      <CalendarDays className="mt-0.5 h-5 w-5 text-slate-400" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-slate-800">
          {formatDate(value)}
        </p>
      </div>
    </div>
  );
}

export default function TrackingPage() {
  const [trackingNumberInput, setTrackingNumberInput] = useState("");
  const [shipmentIdInput, setShipmentIdInput] = useState("");

  const [activeTrackingNumber, setActiveTrackingNumber] = useState("");
  const [activeShipmentId, setActiveShipmentId] = useState("");

  const shipmentQuery = useQuery({
    queryKey: ["shipment-tracking", activeTrackingNumber],
    queryFn: () => getShipmentTracking(activeTrackingNumber),
    enabled: Boolean(activeTrackingNumber),
    retry: false,
  });

  const historyQuery = useQuery({
    queryKey: ["tracking-history", activeShipmentId],
    queryFn: () => getTrackingHistory(activeShipmentId),
    enabled: Boolean(activeShipmentId),
    retry: false,
  });

  function handleTrackingSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = trackingNumberInput.trim();

    if (!value) return;

    setActiveShipmentId("");
    setActiveTrackingNumber(value);
  }

  function handleHistorySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = shipmentIdInput.trim();

    if (!value) return;

    setActiveTrackingNumber("");
    setActiveShipmentId(value);
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
          <Package className="h-4 w-4" />
          Shipment management
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Shipment Tracking
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Track a shipment using its tracking number or review its complete
          status history using the shipment ID.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                Track by tracking number
              </h2>
              <p className="text-xs text-slate-500">
                Get shipment and delivery information
              </p>
            </div>
          </div>

          <form onSubmit={handleTrackingSearch} className="space-y-3">
            <label
              htmlFor="trackingNumber"
              className="text-sm font-medium text-slate-700"
            >
              Tracking number
            </label>
            <input
              id="trackingNumber"
              value={trackingNumberInput}
              onChange={(event) => setTrackingNumberInput(event.target.value)}
              placeholder="CR-1788627051290-F893D2"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="submit"
              disabled={!trackingNumberInput.trim() || shipmentQuery.isFetching}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {shipmentQuery.isFetching ? "Searching..." : "Track shipment"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </section>

        <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                Tracking history by shipment ID
              </h2>
              <p className="text-xs text-slate-500">
                View every recorded shipment event
              </p>
            </div>
          </div>

          <form onSubmit={handleHistorySearch} className="space-y-3">
            <label
              htmlFor="shipmentId"
              className="text-sm font-medium text-slate-700"
            >
              Shipment ID
            </label>
            <input
              id="shipmentId"
              value={shipmentIdInput}
              onChange={(event) => setShipmentIdInput(event.target.value)}
              placeholder="Enter shipment UUID"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
            <button
              type="submit"
              disabled={!shipmentIdInput.trim() || historyQuery.isFetching}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {historyQuery.isFetching ? "Loading history..." : "View history"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </section>
      </div>

      {shipmentQuery.isError && (
        <ErrorMessage
          message={
            shipmentQuery.error instanceof Error
              ? shipmentQuery.error.message
              : "Unable to load shipment tracking."
          }
        />
      )}

      {historyQuery.isError && (
        <ErrorMessage
          message={
            historyQuery.error instanceof Error
              ? historyQuery.error.message
              : "Unable to load tracking history."
          }
        />
      )}

      {shipmentQuery.isFetching && <LoadingMessage />}

      {shipmentQuery.data && <ShipmentDetails shipment={shipmentQuery.data} />}

      {historyQuery.isFetching && <LoadingMessage />}

      {historyQuery.data && (
        <TrackingTimeline
          events={historyQuery.data}
          title="Complete tracking history"
        />
      )}
    </main>
  );
}
