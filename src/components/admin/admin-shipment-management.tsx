"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import {
  getAdminShipments,
  type ShipmentPackageType,
  type ShipmentServiceType,
  type ShipmentStatus,
} from "@/lib/api/admin-shipments";

const PAGE_SIZE = 10;

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

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "DELIVERED"
      ? "bg-emerald-50 text-emerald-700"
      : status === "CANCELLED" || status === "DELIVERY_FAILED"
        ? "bg-red-50 text-red-700"
        : status === "IN_TRANSIT" || status === "OUT_FOR_DELIVERY"
          ? "bg-blue-50 text-blue-700"
          : "bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${color}`}
    >
      {formatStatus(status)}
    </span>
  );
}

export default function AdminShipmentsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [packageType, setPackageType] = useState("");

  const shipmentsQuery = useQuery({
    queryKey: [
      "admin-shipments",
      page,
      searchTerm,
      status,
      serviceType,
      packageType,
    ],
    queryFn: () =>
      getAdminShipments({
        page,
        limit: PAGE_SIZE,
        searchTerm: searchTerm || undefined,
        status: (status || undefined) as ShipmentStatus | undefined,
        serviceType: (serviceType || undefined) as
          | ShipmentServiceType
          | undefined,
        packageType: (packageType || undefined) as
          | ShipmentPackageType
          | undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });

  const shipments = shipmentsQuery.data?.shipments ?? [];
  const meta = shipmentsQuery.data?.meta;

  function applySearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearchTerm(searchInput.trim());
  }

  function resetFilters() {
    setSearchInput("");
    setSearchTerm("");
    setStatus("");
    setServiceType("");
    setPackageType("");
    setPage(1);
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Shipment Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review shipments, track delivery progress, and manage assignments.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-medium text-slate-500">Total shipments</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {meta?.total ?? "—"}
          </p>
        </div>
      </div>

      <form
        onSubmit={applySearch}
        className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search tracking number"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {formatStatus(item)}
            </option>
          ))}
        </select>

        <select
          value={serviceType}
          onChange={(event) => {
            setServiceType(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">All services</option>
          <option value="STANDARD">Standard</option>
          <option value="EXPRESS">Express</option>
        </select>

        <select
          value={packageType}
          onChange={(event) => {
            setPackageType(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">All package types</option>
          <option value="DOCUMENT">Document</option>
          <option value="PARCEL">Parcel</option>
          <option value="FRAGILE">Fragile</option>
          <option value="ELECTRONICS">Electronics</option>
          <option value="OTHER">Other</option>
        </select>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Search
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </form>

      {shipmentsQuery.isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading shipments...
        </div>
      ) : shipmentsQuery.isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {shipmentsQuery.error instanceof Error
            ? shipmentsQuery.error.message
            : "Failed to load shipments."}
          <button
            type="button"
            onClick={() => shipmentsQuery.refetch()}
            className="ml-3 font-semibold underline"
          >
            Try again
          </button>
        </div>
      ) : shipments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h2 className="font-semibold text-slate-800">No shipments found</h2>
          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Tracking number</th>
                    <th className="px-5 py-4">Sender</th>
                    <th className="px-5 py-4">Destination</th>
                    <th className="px-5 py-4">Service</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {shipment.trackingNumber}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {shipment.senderAddress?.contactName || "—"}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {shipment.receiverAddress?.city || "—"}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {shipment.serviceType}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {shipment.paymentStatus}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={shipment.status} />
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/shipments/${shipment.id}`}
                          className="font-semibold text-blue-600 hover:text-blue-800"
                        >
                          View details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {shipments.map((shipment) => (
              <article
                key={shipment.id}
                className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-500">Tracking number</p>
                    <p className="mt-1 font-bold text-slate-900">
                      {shipment.trackingNumber}
                    </p>
                  </div>
                  <StatusBadge status={shipment.status} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Sender</p>
                    <p className="mt-1 text-slate-800">
                      {shipment.senderAddress?.contactName || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Destination</p>
                    <p className="mt-1 text-slate-800">
                      {shipment.receiverAddress?.city || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Service</p>
                    <p className="mt-1 text-slate-800">
                      {shipment.serviceType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Payment</p>
                    <p className="mt-1 text-slate-800">
                      {shipment.paymentStatus}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/admin/shipments/${shipment.id}`}
                  className="inline-flex w-full justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  View shipment details
                </Link>
              </article>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page {meta?.page ?? page} of {meta?.totalPage ?? 1} ·{" "}
              {meta?.total ?? shipments.length} shipments
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= (meta?.totalPage ?? 1)}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
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
