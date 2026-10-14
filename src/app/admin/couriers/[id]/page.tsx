"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, RefreshCw, Truck, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { getAdminCourierById } from "@/lib/api/admin-couriers";

function formatDate(value?: string | Date | null) {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not provided";
  }

  return date.toLocaleString();
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  return String(value);
}

function DetailItem({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 break-words font-medium text-slate-900">
        {formatValue(value)}
      </p>
    </div>
  );
}

export default function AdminCourierDetailsPage() {
  const params = useParams();
  const courierId = params.id as string;

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-courier", courierId],
    queryFn: () => getAdminCourierById(courierId),
    enabled: Boolean(courierId),
  });

  const courier = response;
  const profile = courier?.courier;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading courier details...</span>
        </div>
      </div>
    );
  }

  if (isError || !courier) {
    return (
      <div className="space-y-4 p-4 sm:p-6">
        <Link
          href="/admin/couriers"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Couriers
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <AlertCircle className="mb-3 h-8 w-8 text-red-600" />

          <h2 className="text-lg font-semibold text-red-900">
            Failed to load courier
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error instanceof Error
              ? error.message
              : "Unable to load courier details. Please try again."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/admin" className="hover:text-slate-900">
              Admin
            </Link>

            <span>/</span>

            <Link href="/admin/couriers" className="hover:text-slate-900">
              Couriers
            </Link>

            <span>/</span>
            <span className="text-slate-900">Details</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Courier Details</h1>

          <p className="mt-1 text-sm text-slate-500">
            View courier profile and delivery information.
          </p>
        </div>

        <Link
          href="/admin/couriers"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Couriers
        </Link>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          {courier.profileImage ? (
            <img
              src={courier.profileImage}
              alt={courier.name || "Courier"}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <User className="h-8 w-8 text-slate-500" />
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {formatValue(courier.name)}
            </h2>
            <p className="text-sm text-slate-500">
              {formatValue(courier.email)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="User ID" value={courier.id} />
          <DetailItem label="Role" value={courier.role} />
          <DetailItem label="Account Status" value={courier.status} />
          <DetailItem
            label="Approval Status"
            value={courier.courierApprovalStatus}
          />
          <DetailItem
            label="Account Created"
            value={formatDate(courier.createdAt)}
          />
          <DetailItem
            label="Account Updated"
            value={formatDate(courier.updatedAt)}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-3">
            <Truck className="h-6 w-6 text-blue-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Courier Information
            </h2>
            <p className="text-sm text-slate-500">
              Vehicle, availability, and performance details.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Courier ID" value={profile?.id} />
          <DetailItem label="Employee ID" value={profile?.employeeId} />
          <DetailItem label="Vehicle Type" value={profile?.vehicleType} />
          <DetailItem label="Vehicle Number" value={profile?.vehicleNumber} />
          <DetailItem label="License Number" value={profile?.licenseNumber} />
          <DetailItem
            label="Availability"
            value={profile?.availabilityStatus}
          />
          <DetailItem
            label="Total Deliveries"
            value={profile?.totalDeliveries}
          />
          <DetailItem label="Total Earnings" value={profile?.totalEarnings} />
          <DetailItem label="Rating" value={profile?.rating} />
          <DetailItem label="Current Latitude" value={profile?.currentLat} />
          <DetailItem label="Current Longitude" value={profile?.currentLng} />
          <DetailItem
            label="Courier Created"
            value={formatDate(profile?.createdAt)}
          />
          <DetailItem
            label="Courier Updated"
            value={formatDate(profile?.updatedAt)}
          />
        </div>
      </section>
    </div>
  );
}
