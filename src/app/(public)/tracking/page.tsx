"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Clock3,
  MapPin,
  Package,
  Route,
  Search,
  ShieldCheck,
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
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "IN_TRANSIT":
    case "PICKED_UP":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "PAYMENT_PENDING":
    case "PAYMENT_FAILED":
    case "DELIVERY_FAILED":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusStyle(status)}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {formatStatus(status)}
    </span>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700 shadow-sm"
    >
      <CircleDot className="mt-0.5 h-5 w-5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm sm:p-6">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
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
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">Shipment activity</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center">
          <Package className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-700">
            No tracking events yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Shipment updates will appear here when available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              Follow your shipment&apos;s progress
            </p>
          </div>
        </div>

        <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
          {sortedEvents.length} {sortedEvents.length === 1 ? "event" : "events"}{" "}
          recorded
        </span>
      </div>

      <div className="relative">
        {sortedEvents.map((event, index) => {
          const isLast = index === sortedEvents.length - 1;

          return (
            <div
              key={event.id}
              className="relative flex gap-3 pb-8 last:pb-0 sm:gap-5"
            >
              {!isLast && (
                <div className="absolute bottom-0 left-4 top-9 w-px bg-slate-200 sm:left-[18px]" />
              )}

              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-white sm:h-9 sm:w-9 ${
                  event.status === "DELIVERED"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-violet-100 text-violet-700"
                }`}
              >
                {event.status === "DELIVERED" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Truck className="h-4 w-4" />
                )}
              </div>

              <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-white hover:shadow-sm sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <StatusBadge status={event.status} />
                  <span className="flex items-center gap-1.5 text-xs leading-5 text-slate-500">
                    <Clock3 className="h-3.5 w-3.5 shrink-0" />
                    {formatDate(event.createdAt)}
                  </span>
                </div>

                {event.note && (
                  <p className="mt-3 break-words text-sm leading-6 text-slate-700">
                    {event.note}
                  </p>
                )}

                {event.hub && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-slate-100 bg-white p-3 text-sm text-slate-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-slate-800">
                        {event.hub.name}
                      </p>
                      <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                        {event.hub.address}, {event.hub.city}
                      </p>
                    </div>
                  </div>
                )}

                {event.location && (
                  <p className="mt-3 break-words text-xs text-slate-500">
                    Coordinates: {event.location.latitude},{" "}
                    {event.location.longitude}
                  </p>
                )}

                {event.courier && (
                  <p className="mt-3 text-sm text-slate-600">
                    Courier:{" "}
                    <span className="font-semibold text-slate-800">
                      {event.courier.name}
                    </span>
                  </p>
                )}

                {event.updater && (
                  <p className="mt-2 text-xs text-slate-400">
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
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 px-5 py-6 sm:px-7 sm:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
                Tracking number
              </p>
              <h2 className="mt-2 break-all text-xl font-bold tracking-tight text-white sm:text-2xl">
                {shipment.trackingNumber}
              </h2>
              <p className="mt-2 break-all text-xs text-slate-400">
                Shipment ID: {shipment.id}
              </p>
            </div>

            <StatusBadge status={shipment.status} />
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-xs font-medium">Payment status</p>
              </div>
              <p className="mt-3 break-words text-sm font-bold text-slate-900">
                {formatStatus(shipment.paymentStatus)}
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Package className="h-4 w-4" />
                <p className="text-xs font-medium">Delivery fee</p>
              </div>
              <p className="mt-3 break-words text-lg font-bold text-slate-900">
                ৳
                {Number(shipment.deliveryFee).toLocaleString("en-BD", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Truck className="h-4 w-4" />
                <p className="text-xs font-medium">Service / Package</p>
              </div>
              <p className="mt-3 break-words text-sm font-bold text-slate-900">
                {formatStatus(shipment.serviceType)}
              </p>
              <p className="mt-1 break-words text-xs text-slate-500">
                {formatStatus(shipment.packageType)}
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Route className="h-4 w-4" />
                <p className="text-xs font-medium">Package weight</p>
              </div>
              <p className="mt-3 text-lg font-bold text-slate-900">
                {shipment.weight} kg
              </p>
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-violet-600" />
              <h3 className="font-bold text-slate-900">Delivery route</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AddressCard title="Sender" address={shipment.senderAddress} />
              <AddressCard
                title="Receiver"
                address={shipment.receiverAddress}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <HubCard title="Origin hub" hub={shipment.originHub} />
            <HubCard title="Destination hub" hub={shipment.destinationHub} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DateCard
              label="Estimated delivery"
              value={shipment.estimatedDeliveryDate}
            />
            <DateCard label="Delivered at" value={shipment.deliveredAt} />
          </div>

          {shipment.failureReason && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
              <p className="font-semibold">Delivery note</p>
              <p className="mt-1 break-words">{shipment.failureReason}</p>
            </div>
          )}
        </div>
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
    <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition hover:bg-white">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
          <MapPin className="h-4 w-4" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </p>
      </div>

      <p className="break-words font-semibold text-slate-900">
        {address.contactName}
      </p>
      <p className="mt-1 break-words text-sm text-slate-600">{address.phone}</p>
      <p className="mt-3 break-words text-sm leading-6 text-slate-600">
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
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <Truck className="h-4 w-4" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </p>
      </div>

      {hub ? (
        <>
          <p className="break-words font-semibold text-slate-900">{hub.name}</p>
          <p className="mt-1 break-words text-sm leading-6 text-slate-600">
            {hub.address}, {hub.city}
          </p>
          <p className="mt-3 inline-flex rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
            Hub code: {hub.code}
          </p>
        </>
      ) : (
        <p className="rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-400">
          Not assigned
        </p>
      )}
    </div>
  );
}

function DateCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
        <CalendarDays className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-800">
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
    <main className="min-h-screen w-full overflow-x-hidden bg-slate-50/80 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto w-full max-w-7xl space-y-7">
        <header className="relative overflow-hidden rounded-3xl bg-slate-950 px-5 py-7 shadow-lg shadow-slate-200/50 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-2 -top-10 h-48 w-48 rounded-full bg-violet-500/10 blur-2xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-violet-200 sm:text-sm">
              <Package className="h-4 w-4" />
              Shipment management
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Shipment Tracking
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Track your parcel, review delivery progress, and explore every
              recorded shipment update in one place.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:border-violet-200 hover:shadow-lg hover:shadow-slate-200/40 sm:p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <Search className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-slate-900">
                  Track by tracking number
                </h2>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Get shipment and delivery information
                </p>
              </div>
            </div>

            <form onSubmit={handleTrackingSearch} className="space-y-3">
              <label
                htmlFor="trackingNumber"
                className="block text-sm font-medium text-slate-700"
              >
                Tracking number
              </label>
              <input
                id="trackingNumber"
                value={trackingNumberInput}
                onChange={(event) => setTrackingNumberInput(event.target.value)}
                placeholder="CR-1788627051290-F893D2"
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
              />
              <button
                type="submit"
                disabled={
                  !trackingNumberInput.trim() || shipmentQuery.isFetching
                }
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {shipmentQuery.isFetching ? "Searching..." : "Track shipment"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:border-violet-200 hover:shadow-lg hover:shadow-slate-200/40 sm:p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Activity className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-slate-900">
                  Tracking history by shipment ID
                </h2>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  View every recorded shipment event
                </p>
              </div>
            </div>

            <form onSubmit={handleHistorySearch} className="space-y-3">
              <label
                htmlFor="shipmentId"
                className="block text-sm font-medium text-slate-700"
              >
                Shipment ID
              </label>
              <input
                id="shipmentId"
                value={shipmentIdInput}
                onChange={(event) => setShipmentIdInput(event.target.value)}
                placeholder="Enter shipment UUID"
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
              <button
                type="submit"
                disabled={!shipmentIdInput.trim() || historyQuery.isFetching}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {historyQuery.isFetching
                  ? "Loading history..."
                  : "View history"}
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

        {shipmentQuery.data && (
          <ShipmentDetails shipment={shipmentQuery.data} />
        )}

        {historyQuery.isFetching && <LoadingMessage />}

        {historyQuery.data && (
          <TrackingTimeline
            events={historyQuery.data}
            title="Complete tracking history"
          />
        )}

        {!shipmentQuery.data &&
          !historyQuery.data &&
          !shipmentQuery.isFetching &&
          !historyQuery.isFetching &&
          !shipmentQuery.isError &&
          !historyQuery.isError && (
            <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center sm:px-8 sm:py-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <Package className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-lg font-bold text-slate-900">
                Your shipment journey starts here
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Enter your tracking number or shipment ID above to see available
                shipment information and tracking updates.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-violet-600" />
                  Shipment details
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Route className="h-4 w-4 text-violet-600" />
                  Delivery progress
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4 text-violet-600" />
                  Tracking history
                </span>
              </div>
            </section>
          )}
      </div>
    </main>
  );
}
