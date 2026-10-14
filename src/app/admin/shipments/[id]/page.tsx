"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  assignShipmentCourier,
  getAdminShipmentById,
  getAssignableCouriers,
  type ShipmentStatus,
  updateAdminShipmentStatus,
} from "@/lib/api/admin-shipments";

const statuses: ShipmentStatus[] = [
  "CREATED",
  "PAYMENT_PENDING",
  "CONFIRMED",
  "PICKUP_SCHEDULED",
  "COURIER_ASSIGNED",
  "PICKED_UP",
  "AT_ORIGIN_HUB",
  "IN_TRANSIT",
  "AT_DESTINATION_HUB",
  "OUT_FOR_DELIVERY",
  "DELIVERY_FAILED",
  "RETURN_TO_SENDER",
  "RETURNED",
  "DELIVERED",
  "CANCELLED",
];

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-900">
        {value === null || value === undefined || value === ""
          ? "Not provided"
          : value}
      </p>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleString();
}

export default function AdminShipmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const shipmentId = params.id;
  const queryClient = useQueryClient();

  const [selectedStatus, setSelectedStatus] = useState<ShipmentStatus | "">("");
  const [statusNote, setStatusNote] = useState("");
  const [selectedCourierId, setSelectedCourierId] = useState("");

  const shipmentQuery = useQuery({
    queryKey: ["admin-shipment", shipmentId],
    queryFn: () => getAdminShipmentById(shipmentId),
    enabled: Boolean(shipmentId),
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });

  const couriersQuery = useQuery({
    queryKey: ["admin-assignable-couriers"],
    queryFn: getAssignableCouriers,
    enabled: Boolean(shipmentId),
    refetchOnWindowFocus: true,
  });

  const couriers = couriersQuery.data ?? [];

  const refreshShipmentData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["admin-shipment", shipmentId],
      }),
      queryClient.invalidateQueries({
        queryKey: ["admin-shipments"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["my-shipments"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["customer-shipments"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["customer-tracking"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["courier-assignments"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["courier-dashboard"],
      }),
    ]);
  };

  const statusMutation = useMutation({
    mutationFn: () => {
      if (!selectedStatus) {
        throw new Error("Please select a shipment status.");
      }

      return updateAdminShipmentStatus(shipmentId, selectedStatus, statusNote);
    },
    onSuccess: async () => {
      toast.success("Shipment status updated successfully.");
      setSelectedStatus("");
      setStatusNote("");
      await refreshShipmentData();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update shipment status.",
      );
    },
  });

  const assignmentMutation = useMutation({
    mutationFn: () => {
      if (!selectedCourierId) {
        throw new Error("Please select a courier.");
      }

      const selectedCourier = couriers.find(
        (courier) => courier.id === selectedCourierId,
      );

      if (!selectedCourier || selectedCourier.emailVerified !== true) {
        throw new Error("Please select an email-verified courier.");
      }

      return assignShipmentCourier(shipmentId, selectedCourierId);
    },
    onSuccess: async () => {
      toast.success("Courier assigned successfully. Shipment status updated.");
      setSelectedCourierId("");

      await refreshShipmentData();

      await queryClient.invalidateQueries({
        queryKey: ["admin-assignable-couriers"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to assign courier.",
      );
    },
  });

  if (shipmentQuery.isLoading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading shipment details...
      </div>
    );
  }

  if (shipmentQuery.isError || !shipmentQuery.data) {
    return (
      <div className="space-y-4 p-6">
        <Link
          href="/admin/shipments"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          ← Back to shipments
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {shipmentQuery.error instanceof Error
            ? shipmentQuery.error.message
            : "Failed to load shipment details."}

          <button
            type="button"
            onClick={() => shipmentQuery.refetch()}
            className="ml-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const shipment = shipmentQuery.data;

  const canAssignCourier =
    !shipment.courierId &&
    (shipment.status === "CONFIRMED" || shipment.status === "PICKUP_SCHEDULED");

  const courierName =
    shipment.courier?.name || shipment.courierId || "Not assigned";

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <Link
        href="/admin/shipments"
        className="inline-flex text-sm font-semibold text-blue-600 hover:text-blue-800"
      >
        ← Back to shipments
      </Link>

      <section className="rounded-2xl bg-gradient-to-r from-slate-950 to-slate-800 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-slate-300">Shipment details</p>
            <h1 className="mt-2 break-all text-2xl font-bold sm:text-3xl">
              {shipment.trackingNumber}
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Created {formatDate(shipment.createdAt)}
            </p>
          </div>

          <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
            {formatStatus(shipment.status)}
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DetailItem label="Tracking number" value={shipment.trackingNumber} />
        <DetailItem
          label="Shipment status"
          value={formatStatus(shipment.status)}
        />
        <DetailItem label="Payment status" value={shipment.paymentStatus} />
        <DetailItem
          label="Delivery fee"
          value={`৳${Number(shipment.deliveryFee).toLocaleString()}`}
        />
        <DetailItem label="Service type" value={shipment.serviceType} />
        <DetailItem label="Package type" value={shipment.packageType} />
        <DetailItem label="Weight" value={`${shipment.weight} kg`} />
        <DetailItem label="Created at" value={formatDate(shipment.createdAt)} />
        <DetailItem
          label="Pickup date"
          value={formatDate(shipment.pickupDate)}
        />
        <DetailItem
          label="Estimated delivery"
          value={formatDate(shipment.estimatedDeliveryDate)}
        />
        <DetailItem
          label="Delivered at"
          value={formatDate(shipment.deliveredAt)}
        />
        <DetailItem label="Shipment ID" value={shipment.id} />
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Sender address</h2>
          <div className="mt-4 space-y-3 text-sm">
            <DetailItem
              label="Contact name"
              value={shipment.senderAddress?.contactName}
            />
            <DetailItem label="Phone" value={shipment.senderAddress?.phone} />
            <DetailItem
              label="Address"
              value={shipment.senderAddress?.addressLine}
            />
            <DetailItem
              label="City / District"
              value={[
                shipment.senderAddress?.city,
                shipment.senderAddress?.district,
              ]
                .filter(Boolean)
                .join(", ")}
            />
            <DetailItem
              label="Postal code"
              value={shipment.senderAddress?.postalCode}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Receiver address</h2>
          <div className="mt-4 space-y-3 text-sm">
            <DetailItem
              label="Contact name"
              value={shipment.receiverAddress?.contactName}
            />
            <DetailItem label="Phone" value={shipment.receiverAddress?.phone} />
            <DetailItem
              label="Address"
              value={shipment.receiverAddress?.addressLine}
            />
            <DetailItem
              label="City / District"
              value={[
                shipment.receiverAddress?.city,
                shipment.receiverAddress?.district,
              ]
                .filter(Boolean)
                .join(", ")}
            />
            <DetailItem
              label="Postal code"
              value={shipment.receiverAddress?.postalCode}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Hubs and customer</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Origin hub"
            value={
              shipment.originHub
                ? `${shipment.originHub.name} (${shipment.originHub.code})`
                : "Not assigned"
            }
          />
          <DetailItem
            label="Destination hub"
            value={
              shipment.destinationHub
                ? `${shipment.destinationHub.name} (${shipment.destinationHub.code})`
                : "Not assigned"
            }
          />
          <DetailItem
            label="Customer"
            value={
              shipment.customer
                ? `${shipment.customer.name} (${shipment.customer.email})`
                : shipment.customerId || "Customer details not returned by API"
            }
          />
          <DetailItem label="Courier" value={courierName} />
          <DetailItem label="Courier email" value={shipment.courier?.email} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Shipment items</h2>

        {!shipment.items?.length ? (
          <p className="mt-4 text-sm text-slate-500">
            No item details were returned by the API.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {shipment.items.map((item, index) => (
              <div
                key={item.id ?? `${item.name}-${index}`}
                className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                <DetailItem label="Name" value={item.name} />
                <DetailItem label="Quantity" value={item.quantity} />
                <DetailItem label="Weight" value={`${item.weight} kg`} />
                <DetailItem
                  label="Declared value"
                  value={`৳${Number(item.declaredValue).toLocaleString()}`}
                />
                {item.description && (
                  <div className="sm:col-span-2 lg:col-span-4">
                    <DetailItem label="Description" value={item.description} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">
            Update shipment status
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            The backend records each update in shipment tracking history.
          </p>

          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();

              if (!selectedStatus) {
                toast.error("Please select a status.");
                return;
              }

              if (selectedStatus === shipment.status) {
                toast.error("Select a different status.");
                return;
              }

              statusMutation.mutate();
            }}
          >
            <div>
              <label
                htmlFor="shipment-status"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                New status
              </label>
              <select
                id="shipment-status"
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(event.target.value as ShipmentStatus | "")
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm"
              >
                <option value="">Select a status</option>
                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                    disabled={status === shipment.status}
                  >
                    {formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="shipment-note"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Tracking note (optional)
              </label>
              <textarea
                id="shipment-note"
                value={statusNote}
                onChange={(event) => setStatusNote(event.target.value)}
                maxLength={255}
                rows={3}
                placeholder="Add a note for the tracking history..."
                className="w-full resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {statusNote.length}/255
              </p>
            </div>

            <button
              type="submit"
              disabled={statusMutation.isPending || !selectedStatus}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {statusMutation.isPending
                ? "Updating status..."
                : "Update shipment status"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Assign courier</h2>
          <p className="mt-1 text-sm text-slate-500">
            Only email-verified couriers are shown.
          </p>

          {shipment.courierId ? (
            <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
              A courier is already assigned to this shipment.
              <p className="mt-2 font-semibold">{courierName}</p>
            </div>
          ) : !canAssignCourier ? (
            <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              Courier assignment is available only when the shipment status is
              Confirmed or Pickup Scheduled.
            </div>
          ) : (
            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();

                if (!selectedCourierId) {
                  toast.error("Please select a courier.");
                  return;
                }

                assignmentMutation.mutate();
              }}
            >
              {couriersQuery.isLoading ? (
                <p className="text-sm text-slate-500">
                  Loading email-verified couriers...
                </p>
              ) : couriersQuery.isError ? (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {couriersQuery.error instanceof Error
                    ? couriersQuery.error.message
                    : "Failed to load couriers."}
                  <button
                    type="button"
                    onClick={() => couriersQuery.refetch()}
                    className="ml-2 font-semibold underline"
                  >
                    Retry
                  </button>
                </div>
              ) : couriers.length === 0 ? (
                <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                  No email-verified couriers were found.
                </div>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="assign-courier"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Email-verified courier
                    </label>
                    <select
                      id="assign-courier"
                      value={selectedCourierId}
                      onChange={(event) =>
                        setSelectedCourierId(event.target.value)
                      }
                      disabled={assignmentMutation.isPending}
                      className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      <option value="">Select a courier</option>
                      {couriers.map((courier) => (
                        <option key={courier.id} value={courier.id}>
                          {courier.name} — {courier.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      assignmentMutation.isPending || !selectedCourierId
                    }
                    className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {assignmentMutation.isPending
                      ? "Assigning courier..."
                      : "Assign courier"}
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Tracking history</h2>

        {!shipment.tracking?.length ? (
          <p className="mt-4 text-sm text-slate-500">
            No tracking history was returned by the API.
          </p>
        ) : (
          <div className="mt-5 space-y-5">
            {shipment.tracking.map((entry) => (
              <div key={entry.id} className="flex gap-3">
                <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600" />
                <div className="min-w-0 flex-1 border-b border-slate-100 pb-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold text-slate-900">
                      {formatStatus(entry.status)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(entry.createdAt)}
                    </p>
                  </div>
                  {entry.note && (
                    <p className="mt-2 break-words text-sm text-slate-600">
                      {entry.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
