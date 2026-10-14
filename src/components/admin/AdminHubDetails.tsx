"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  LoaderCircle,
  MapPin,
  Pencil,
  Power,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  deleteAdminHub,
  getAdminHubById,
  type HubStatus,
  type UpdateHubPayload,
  updateAdminHub,
} from "@/lib/api/admin-hubs";

const updateHubSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Hub name must be at least 2 characters")
    .max(100, "Hub name cannot exceed 100 characters"),
  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(255, "Address cannot exceed 255 characters"),
  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(100, "City cannot exceed 100 characters"),
  district: z
    .string()
    .trim()
    .min(2, "District must be at least 2 characters")
    .max(100, "District cannot exceed 100 characters"),
  latitude: z
    .string()
    .refine(
      (value) =>
        value.trim() === "" ||
        (Number.isFinite(Number(value)) &&
          Number(value) >= -90 &&
          Number(value) <= 90),
      "Latitude must be between -90 and 90",
    ),
  longitude: z
    .string()
    .refine(
      (value) =>
        value.trim() === "" ||
        (Number.isFinite(Number(value)) &&
          Number(value) >= -180 &&
          Number(value) <= 180),
      "Longitude must be between -180 and 180",
    ),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type UpdateHubFormValues = z.infer<typeof updateHubSchema>;

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function StatusBadge({ status }: { status: HubStatus }) {
  const active = status === "ACTIVE";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
      <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
        {icon}
        {label}
      </p>
      <p className="mt-2 wrap-break-word text-sm font-semibold leading-6 text-slate-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="hub-modal-title"
        className="max-h-[92dvh] w-full max-w-xl animate-in fade-in slide-in-from-bottom-3 overflow-y-auto rounded-t-2xl bg-white shadow-2xl duration-200 sm:rounded-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div>
            <h2
              id="hub-modal-title"
              className="text-lg font-bold text-slate-900"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-5 sm:p-6">{children}</div>
      </section>
    </div>
  );
}

export default function AdminHubDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const id = typeof params.id === "string" ? params.id : "";
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);
  const [actionError, setActionError] = useState("");

  const hubQuery = useQuery({
    queryKey: ["admin-hub", id],
    queryFn: () => getAdminHubById(id),
    enabled: Boolean(id),
  });

  const hub = hubQuery.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateHubFormValues>({
    resolver: zodResolver(updateHubSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      district: "",
      latitude: "",
      longitude: "",
      status: "ACTIVE",
    },
  });

  function openEditModal() {
    if (!hub) return;

    setActionError("");
    reset({
      name: hub.name,
      address: hub.address,
      city: hub.city,
      district: hub.district,
      latitude:
        hub.latitude === null || hub.latitude === undefined
          ? ""
          : String(hub.latitude),
      longitude:
        hub.longitude === null || hub.longitude === undefined
          ? ""
          : String(hub.longitude),
      status: hub.status,
    });
    setIsEditOpen(true);
  }

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateHubPayload) => updateAdminHub(id, payload),
    onSuccess: async (updatedHub) => {
      queryClient.setQueryData(["admin-hub", id], updatedHub);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-hubs"] }),
        queryClient.invalidateQueries({
          queryKey: ["admin-hubs-stats"],
        }),
      ]);

      setIsEditOpen(false);
      setActionError("");
      toast.success("Hub updated successfully");
    },
    onError: (error: Error) => {
      setActionError(error.message || "Failed to update hub");
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: () => deleteAdminHub(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-hubs"] }),
        queryClient.invalidateQueries({
          queryKey: ["admin-hubs-stats"],
        }),
        queryClient.invalidateQueries({ queryKey: ["admin-hub", id] }),
      ]);

      setIsDeactivateOpen(false);
      setActionError("");
      toast.success("Hub deactivated successfully");
      router.push("/admin/hubs");
    },
    onError: (error: Error) => {
      setActionError(error.message || "Failed to deactivate hub");
    },
  });

  const activateMutation = useMutation({
    mutationFn: () => updateAdminHub(id, { status: "ACTIVE" }),
    onSuccess: async (updatedHub) => {
      queryClient.setQueryData(["admin-hub", id], updatedHub);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-hubs"] }),
        queryClient.invalidateQueries({
          queryKey: ["admin-hubs-stats"],
        }),
      ]);

      setIsActivateOpen(false);
      setActionError("");
      toast.success("Hub activated successfully");
    },
    onError: (error: Error) => {
      setActionError(error.message || "Failed to activate hub");
    },
  });

  function onUpdate(values: UpdateHubFormValues) {
    setActionError("");

    const payload: UpdateHubPayload = {
      name: values.name.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      district: values.district.trim(),
      status: values.status,
      latitude:
        values.latitude.trim() === "" ? undefined : Number(values.latitude),
      longitude:
        values.longitude.trim() === "" ? undefined : Number(values.longitude),
    };

    updateMutation.mutate(payload);
  }

  if (hubQuery.isLoading) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-3">
        <LoaderCircle className="animate-spin text-blue-600" size={32} />
        <p className="text-sm text-slate-500">Loading hub details...</p>
      </div>
    );
  }

  if (hubQuery.isError || !hub) {
    return (
      <div className="mx-auto flex min-h-80 max-w-lg flex-col items-center justify-center px-5 text-center">
        <div className="rounded-full bg-red-50 p-4 text-red-600">
          <Building2 size={28} />
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Unable to load hub
        </h2>
        <p className="mt-2 wrap-break-word text-sm text-slate-500">
          {hubQuery.error?.message || "The requested hub could not be found."}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => hubQuery.refetch()}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/hubs")}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Hubs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-8">
      <button
        type="button"
        onClick={() => router.push("/admin/hubs")}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        Back to Hubs
      </button>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-linear-to-br from-slate-900 via-slate-800 to-blue-950 px-5 py-7 sm:px-8 sm:py-9">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
                <Building2 size={28} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                  Hub Details
                </p>
                <h1 className="mt-2 wrap-break-word text-2xl font-bold text-white sm:text-3xl">
                  {hub.name}
                </h1>
                <p className="mt-2 text-sm text-slate-300">
                  Hub code: {hub.code}
                </p>
                <div className="mt-4">
                  <StatusBadge status={hub.status} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={openEditModal}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
              >
                <Pencil size={16} />
                Edit Hub
              </button>

              {hub.status === "ACTIVE" ? (
                <button
                  type="button"
                  onClick={() => {
                    setActionError("");
                    setIsDeactivateOpen(true);
                  }}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/25 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Power size={16} />
                  Deactivate
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setActionError("");
                    setIsActivateOpen(true);
                  }}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-emerald-300/50 bg-emerald-500/15 px-4 text-sm font-semibold text-white transition hover:bg-emerald-500/25"
                >
                  <Power size={16} />
                  Activate
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              General Information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Registered details and operational information for this hub.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailItem
              label="Hub Name"
              value={hub.name}
              icon={<Building2 size={15} />}
            />
            <DetailItem
              label="Hub Code"
              value={hub.code}
              icon={<Building2 size={15} />}
            />
            <DetailItem
              label="City"
              value={hub.city}
              icon={<MapPin size={15} />}
            />
            <DetailItem
              label="District"
              value={hub.district}
              icon={<MapPin size={15} />}
            />

            <div className="sm:col-span-2">
              <DetailItem
                label="Full Address"
                value={hub.address}
                icon={<MapPin size={15} />}
              />
            </div>

            <DetailItem
              label="Latitude"
              value={
                hub.latitude == null ? "Not provided" : String(hub.latitude)
              }
            />
            <DetailItem
              label="Longitude"
              value={
                hub.longitude == null ? "Not provided" : String(hub.longitude)
              }
            />

            <DetailItem
              label="Created At"
              value={
                hub.createdAt
                  ? new Date(hub.createdAt).toLocaleString()
                  : "Not available"
              }
              icon={<CalendarDays size={15} />}
            />
            <DetailItem
              label="Last Updated"
              value={
                hub.updatedAt
                  ? new Date(hub.updatedAt).toLocaleString()
                  : "Not available"
              }
              icon={<CalendarDays size={15} />}
            />
          </div>
        </div>
      </section>

      {isEditOpen && (
        <Modal
          title="Edit Hub"
          description="Update the hub information below. The hub code cannot be changed."
          onClose={() => {
            if (!updateMutation.isPending) {
              setIsEditOpen(false);
              setActionError("");
            }
          }}
        >
          <form
            onSubmit={handleSubmit(onUpdate)}
            noValidate
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Hub Code
              </label>
              <input
                value={hub.code}
                readOnly
                className={`${inputClass} bg-slate-50 text-slate-500`}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Hub Name
              </label>
              <input
                {...register("name")}
                maxLength={100}
                aria-invalid={Boolean(errors.name)}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-red-600">
                {errors.name?.message}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  City
                </label>
                <input
                  {...register("city")}
                  maxLength={100}
                  aria-invalid={Boolean(errors.city)}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-red-600">
                  {errors.city?.message}
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  District
                </label>
                <input
                  {...register("district")}
                  maxLength={100}
                  aria-invalid={Boolean(errors.district)}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-red-600">
                  {errors.district?.message}
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Address
              </label>
              <textarea
                {...register("address")}
                rows={3}
                maxLength={255}
                aria-invalid={Boolean(errors.address)}
                className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <p className="mt-1 text-xs text-red-600">
                {errors.address?.message}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Latitude
                </label>
                <input
                  {...register("latitude")}
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-red-600">
                  {errors.latitude?.message}
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Longitude
                </label>
                <input
                  {...register("longitude")}
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-red-600">
                  {errors.longitude?.message}
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Status
              </label>
              <select {...register("status")} className={inputClass}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            {actionError && (
              <p
                role="alert"
                className="wrap-break-word rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {actionError}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={updateMutation.isPending}
                onClick={() => {
                  setIsEditOpen(false);
                  setActionError("");
                }}
                className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updateMutation.isPending ? (
                  <LoaderCircle className="animate-spin" size={17} />
                ) : (
                  <CheckCircle2 size={17} />
                )}
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isDeactivateOpen && (
        <Modal
          title="Deactivate Hub?"
          description="This action will mark the hub as inactive. It will not permanently delete the hub."
          onClose={() => {
            if (!deactivateMutation.isPending) {
              setIsDeactivateOpen(false);
              setActionError("");
            }
          }}
        >
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Power className="mt-0.5 shrink-0 text-amber-700" size={21} />
            <div>
              <p className="font-semibold text-amber-900">{hub.name}</p>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                Hub code: {hub.code}. Confirm only if you want to deactivate
                this hub.
              </p>
            </div>
          </div>

          {actionError && (
            <p
              role="alert"
              className="mt-4 wrap-break-word rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {actionError}
            </p>
          )}

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={deactivateMutation.isPending}
              onClick={() => {
                setIsDeactivateOpen(false);
                setActionError("");
              }}
              className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={deactivateMutation.isPending}
              onClick={() => {
                setActionError("");
                deactivateMutation.mutate();
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deactivateMutation.isPending && (
                <LoaderCircle className="animate-spin" size={17} />
              )}
              {deactivateMutation.isPending
                ? "Deactivating..."
                : "Confirm Deactivation"}
            </button>
          </div>
        </Modal>
      )}

      {isActivateOpen && (
        <Modal
          title="Activate Hub?"
          description="This will make the hub active and available for normal operations again."
          onClose={() => {
            if (!activateMutation.isPending) {
              setIsActivateOpen(false);
              setActionError("");
            }
          }}
        >
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <Power className="mt-0.5 shrink-0 text-emerald-700" size={21} />
            <div>
              <p className="font-semibold text-emerald-900">{hub.name}</p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">
                Hub code: {hub.code}. Confirm if you want to activate this hub.
              </p>
            </div>
          </div>

          {actionError && (
            <p
              role="alert"
              className="mt-4 wrap-break-word rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {actionError}
            </p>
          )}

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={activateMutation.isPending}
              onClick={() => {
                setIsActivateOpen(false);
                setActionError("");
              }}
              className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={activateMutation.isPending}
              onClick={() => {
                setActionError("");
                activateMutation.mutate();
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {activateMutation.isPending && (
                <LoaderCircle className="animate-spin" size={17} />
              )}
              {activateMutation.isPending
                ? "Activating..."
                : "Confirm Activation"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
