"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, LoaderCircle, MapPin, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  type CreateHubPayload,
  createAdminHub,
  type HubStatus,
} from "@/lib/api/admin-hubs";

const createHubSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Hub name must be at least 2 characters")
    .max(100, "Hub name cannot exceed 100 characters"),
  code: z
    .string()
    .trim()
    .min(2, "Hub code must be at least 2 characters")
    .max(20, "Hub code cannot exceed 20 characters"),
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
      "Latitude must be a number between -90 and 90",
    ),
  longitude: z
    .string()
    .refine(
      (value) =>
        value.trim() === "" ||
        (Number.isFinite(Number(value)) &&
          Number(value) >= -180 &&
          Number(value) <= 180),
      "Longitude must be a number between -180 and 180",
    ),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type CreateHubFormValues = z.infer<typeof createHubSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p>;
}

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function AdminCreateHub() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateHubFormValues>({
    resolver: zodResolver(createHubSchema),
    defaultValues: {
      name: "",
      code: "",
      address: "",
      city: "",
      district: "",
      latitude: "",
      longitude: "",
      status: "ACTIVE",
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateHubPayload) => createAdminHub(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-hubs"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin-hubs-stats"],
      });

      toast.success("Hub created successfully");
      router.push("/admin/hubs");
    },
    onError: (error: Error) => {
      setSubmitError(error.message || "Failed to create hub");
    },
  });

  function onSubmit(values: CreateHubFormValues) {
    setSubmitError("");

    const payload: CreateHubPayload = {
      name: values.name.trim(),
      code: values.code.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      district: values.district.trim(),
      status: values.status as HubStatus,
    };

    if (values.latitude.trim() !== "") {
      payload.latitude = Number(values.latitude);
    }

    if (values.longitude.trim() !== "") {
      payload.longitude = Number(values.longitude);
    }

    createMutation.mutate(payload);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <div>
        <Link
          href="/admin/hubs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Hubs
        </Link>

        <div className="mt-4 flex items-start gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Building2 size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Create New Hub
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add a logistics hub and configure its location and status.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <h2 className="font-bold text-slate-900">Hub Information</h2>
            <p className="mt-1 text-sm text-slate-500">
              Fields marked with * are required.
            </p>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Hub Name" required error={errors.name?.message}>
                <input
                  {...register("name")}
                  placeholder="e.g. Dhaka Central Hub"
                  maxLength={100}
                  aria-invalid={Boolean(errors.name)}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Hub Code" required error={errors.code?.message}>
                <input
                  {...register("code")}
                  placeholder="e.g. DHA-001"
                  maxLength={20}
                  aria-invalid={Boolean(errors.code)}
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs text-slate-400">
                  Use a unique code for this hub.
                </p>
              </FormField>

              <FormField label="City" required error={errors.city?.message}>
                <input
                  {...register("city")}
                  placeholder="Enter city"
                  maxLength={100}
                  aria-invalid={Boolean(errors.city)}
                  className={inputClass}
                />
              </FormField>

              <FormField
                label="District"
                required
                error={errors.district?.message}
              >
                <input
                  {...register("district")}
                  placeholder="Enter district"
                  maxLength={100}
                  aria-invalid={Boolean(errors.district)}
                  className={inputClass}
                />
              </FormField>

              <div className="sm:col-span-2">
                <FormField
                  label="Full Address"
                  required
                  error={errors.address?.message}
                >
                  <textarea
                    {...register("address")}
                    placeholder="Enter the complete hub address"
                    rows={3}
                    maxLength={255}
                    aria-invalid={Boolean(errors.address)}
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </FormField>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-start gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <MapPin size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                Geographic Coordinates
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Coordinates are optional. Leave them blank if unavailable.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <FormField label="Latitude" error={errors.latitude?.message}>
              <input
                {...register("latitude")}
                type="number"
                step="any"
                min="-90"
                max="90"
                placeholder="e.g. 23.8103"
                aria-invalid={Boolean(errors.latitude)}
                className={inputClass}
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Valid range: -90 to 90.
              </p>
            </FormField>

            <FormField label="Longitude" error={errors.longitude?.message}>
              <input
                {...register("longitude")}
                type="number"
                step="any"
                min="-180"
                max="180"
                placeholder="e.g. 90.4125"
                aria-invalid={Boolean(errors.longitude)}
                className={inputClass}
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Valid range: -180 to 180.
              </p>
            </FormField>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <h2 className="font-bold text-slate-900">Operational Status</h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose whether this hub should be active immediately.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <FormField label="Status" required error={errors.status?.message}>
              <select {...register("status")} className={inputClass}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </FormField>
          </div>
        </section>

        {submitError && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <p className="font-semibold">Unable to create hub</p>
            <p className="mt-1 wrap-break-word">{submitError}</p>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/hubs"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createMutation.isPending ? (
              <>
                <LoaderCircle className="animate-spin" size={17} />
                Creating Hub...
              </>
            ) : (
              <>
                <Save size={17} />
                Create Hub
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
