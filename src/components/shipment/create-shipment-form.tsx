"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  type FieldErrors,
  type Path,
  type UseFormRegister,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createPaymentSession,
  createShipment,
  getActiveHubs,
} from "@/lib/api/shipment-service";
import type {
  CreateShipmentPayload,
  CreateShipmentResponse,
  Hub,
} from "@/lib/api/shipments";

const addressSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Label must be at least 2 characters")
    .max(50),
  contactName: z.string().trim().min(2, "Contact name is required").max(100),
  phone: z.string().trim().min(10, "Enter a valid phone number").max(20),
  addressLine: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(255),
  city: z.string().trim().min(2, "City is required").max(100),
  district: z.string().trim().min(2, "District is required").max(100),
  postalCode: z
    .string()
    .trim()
    .min(3, "Postal code must be at least 3 characters")
    .max(20),

  latitude: z
    .string()
    .trim()
    .min(1, "Latitude is required")
    .refine(
      (value) =>
        Number.isFinite(Number(value)) &&
        Number(value) >= -90 &&
        Number(value) <= 90,
      {
        message: "Latitude must be between -90 and 90",
      },
    )
    .transform(Number),

  longitude: z
    .string()
    .trim()
    .min(1, "Longitude is required")
    .refine(
      (value) =>
        Number.isFinite(Number(value)) &&
        Number(value) >= -180 &&
        Number(value) <= 180,
      {
        message: "Longitude must be between -180 and 180",
      },
    )
    .transform(Number),
});

const positiveNumberString = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) > 0,
      `${label} must be greater than 0`,
    )
    .transform(Number);

const nonNegativeNumberString = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
      `${label} cannot be negative`,
    )
    .transform(Number);

const formSchema = z
  .object({
    senderAddress: addressSchema,
    receiverAddress: addressSchema,

    originHubId: z.string().uuid("Select an origin hub"),
    destinationHubId: z.string().uuid("Select a destination hub"),

    serviceType: z.enum(["STANDARD", "EXPRESS"]),
    packageType: z.enum([
      "DOCUMENT",
      "PARCEL",
      "FRAGILE",
      "ELECTRONICS",
      "OTHER",
    ]),

    weight: positiveNumberString("Package weight"),

    items: z
      .array(
        z.object({
          name: z.string().trim().min(2, "Item name is required").max(100),
          description: z
            .string()
            .max(255, "Description must be at most 255 characters")
            .optional(),
          quantity: positiveNumberString("Quantity").refine(
            Number.isInteger,
            "Quantity must be a whole number",
          ),
          weight: positiveNumberString("Item weight"),
          declaredValue: nonNegativeNumberString("Declared value"),
        }),
      )
      .min(1, "Add at least one item"),
  })
  .superRefine((values, ctx) => {
    if (
      values.originHubId &&
      values.destinationHubId &&
      values.originHubId === values.destinationHubId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destinationHubId"],
        message: "Origin and destination hubs must be different",
      });
    }
  });

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

function createDefaultValues(): FormInput {
  const emptyAddress = {
    label: "",
    contactName: "",
    phone: "",
    addressLine: "",
    city: "",
    district: "",
    postalCode: "",
    latitude: "",
    longitude: "",
  };

  return {
    senderAddress: { ...emptyAddress },
    receiverAddress: { ...emptyAddress },
    originHubId: "",
    destinationHubId: "",
    serviceType: "STANDARD",
    packageType: "PARCEL",
    weight: "",
    items: [
      {
        name: "",
        description: "",
        quantity: "1",
        weight: "",
        declaredValue: "0",
      },
    ],
  };
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1 text-sm text-destructive">{message}</p>;
}

function AddressFields({
  title,
  prefix,
  register,
  errors,
}: {
  title: string;
  prefix: "senderAddress" | "receiverAddress";
  register: UseFormRegister<FormInput>;
  errors: FieldErrors<FormInput>;
}) {
  const addressErrors = errors[prefix] as
    | FieldErrors<FormInput["senderAddress"]>
    | undefined;

  const getMessage = (key: keyof FormInput["senderAddress"]) => {
    const error = addressErrors?.[key];
    return error?.message ? String(error.message) : undefined;
  };

  const field = (
    key: keyof FormInput["senderAddress"],
    label: string,
    placeholder: string,
    type = "text",
  ) => {
    const name = `${prefix}.${key}` as Path<FormInput>;

    return (
      <div className="min-w-0 space-y-1.5" key={key}>
        <Label htmlFor={name}>{label}</Label>
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          step={type === "number" ? "any" : undefined}
          {...register(name)}
        />
        <ErrorText message={getMessage(key)} />
      </div>
    );
  };

  return (
    <section className="min-w-0 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          Enter the address and contact details accurately.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field("label", "Address label", "Home, Office")}
        {field("contactName", "Contact name", "Full name")}
        {field("phone", "Phone number", "+880...")}
        {field("postalCode", "Postal code", "Postal code")}
        {field("city", "City", "City name")}
        {field("district", "District", "District name")}

        <div className="sm:col-span-2">
          {field("addressLine", "Full address", "House, road, area")}
        </div>

        {field("latitude", "Latitude", "e.g. 23.8103", "number")}
        {field("longitude", "Longitude", "e.g. 90.4125", "number")}
      </div>
    </section>
  );
}

function HubSelect({
  id,
  label,
  hubs,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  hubs: Hub[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">Select a hub</option>
        {hubs.map((hub) => (
          <option key={hub.id} value={hub.id}>
            {hub.name} ({hub.code}) — {hub.city}
          </option>
        ))}
      </select>
      <ErrorText message={error} />
    </div>
  );
}

export default function CreateShipmentForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [created, setCreated] = useState<CreateShipmentResponse["data"] | null>(
    null,
  );

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues(),
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const hubsQuery = useQuery({
    queryKey: ["active-hubs"],
    queryFn: getActiveHubs,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateShipmentPayload) => createShipment(payload),
    onSuccess: async (response) => {
      const shipmentId = response.data?.shipment?.id;

      if (!shipmentId) {
        toast.error("Shipment was created, but its ID was not returned.");
        return;
      }

      toast.success(response.message || "Shipment created successfully.");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["my-shipments"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["customer-dashboard"],
        }),
      ]);

      router.replace(`/dashboard/shipments/${shipmentId}`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create shipment. Please try again.",
      );
    },
  });

  const paymentMutation = useMutation({
    mutationFn: createPaymentSession,
    onSuccess: (response) => {
      const paymentUrl = response.data?.paymentUrl;

      if (!paymentUrl) {
        toast.error("Payment checkout URL was not returned. Please try again.");
        return;
      }

      window.location.assign(paymentUrl);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not start payment. Please try again.",
      );
    },
  });

  const hubs = hubsQuery.data ?? [];
  const errors = form.formState.errors;

  function handleReset() {
    // Reset fields, validation errors, added items and previous result.
    form.reset(createDefaultValues());
    setCreated(null);
    createMutation.reset();
    paymentMutation.reset();
    toast.info("Shipment form has been reset.");
  }

  function handleCreateShipment(values: FormOutput) {
    const payload: CreateShipmentPayload = {
      senderAddress: values.senderAddress,
      receiverAddress: values.receiverAddress,
      originHubId: values.originHubId,
      destinationHubId: values.destinationHubId,
      serviceType: values.serviceType,
      packageType: values.packageType,
      weight: values.weight,
      items: values.items.map((item) => ({
        name: item.name,
        description: item.description || undefined,
        quantity: item.quantity,
        weight: item.weight,
        declaredValue: item.declaredValue,
      })),
    };

    createMutation.mutate(payload);
  }

  const isBusy = createMutation.isPending || paymentMutation.isPending;

  return (
    <div className="mx-auto w-full max-w-5xl min-w-0 space-y-6 px-3 py-5 sm:px-6 sm:py-8">
      {hubsQuery.isLoading && (
        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
          Loading active hubs...
        </div>
      )}

      {hubsQuery.isError && (
        <div className="space-y-3 rounded-lg border border-destructive/30 p-4">
          <p className="text-sm text-destructive">
            {hubsQuery.error instanceof Error
              ? hubsQuery.error.message
              : "Could not load active hubs."}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => void hubsQuery.refetch()}
          >
            Retry loading hubs
          </Button>
        </div>
      )}

      <form
        onSubmit={form.handleSubmit(handleCreateShipment)}
        className="min-w-0 space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Sender Details</CardTitle>
            <CardDescription>
              Enter the pickup address and sender contact information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddressFields
              title="Pickup address"
              prefix="senderAddress"
              register={form.register}
              errors={errors}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receiver Details</CardTitle>
            <CardDescription>
              Enter the destination address and receiver contact information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddressFields
              title="Delivery address"
              prefix="receiverAddress"
              register={form.register}
              errors={errors}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Information</CardTitle>
            <CardDescription>
              Choose the active hubs and service type for this shipment.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <HubSelect
                id="originHubId"
                label="Origin hub"
                hubs={hubs}
                value={form.watch("originHubId")}
                onChange={(value) =>
                  form.setValue("originHubId", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={errors.originHubId?.message}
              />

              <HubSelect
                id="destinationHubId"
                label="Destination hub"
                hubs={hubs}
                value={form.watch("destinationHubId")}
                onChange={(value) =>
                  form.setValue("destinationHubId", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={errors.destinationHubId?.message}
              />

              <div className="space-y-1.5">
                <Label htmlFor="serviceType">Service type</Label>
                <select
                  id="serviceType"
                  {...form.register("serviceType")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="STANDARD">Standard</option>
                  <option value="EXPRESS">Express</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="packageType">Package type</Label>
                <select
                  id="packageType"
                  {...form.register("packageType")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="DOCUMENT">Document</option>
                  <option value="PARCEL">Parcel</option>
                  <option value="FRAGILE">Fragile</option>
                  <option value="ELECTRONICS">Electronics</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="weight">Total package weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0.01"
                  step="any"
                  placeholder="Enter total package weight"
                  {...form.register("weight")}
                />
                <ErrorText message={errors.weight?.message} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Package Items</CardTitle>
                <CardDescription className="mt-1">
                  Add the items included in your shipment.
                </CardDescription>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() =>
                  append({
                    name: "",
                    description: "",
                    quantity: "1",
                    weight: "",
                    declaredValue: "0",
                  })
                }
              >
                Add another item
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="min-w-0 space-y-4 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">Item {index + 1}</h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`items.${index}.name`}>Item name</Label>
                    <Input
                      id={`items.${index}.name`}
                      placeholder="e.g. Mobile phone"
                      {...form.register(`items.${index}.name`)}
                    />
                    <ErrorText message={errors.items?.[index]?.name?.message} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`items.${index}.quantity`}>Quantity</Label>
                    <Input
                      id={`items.${index}.quantity`}
                      type="number"
                      min="1"
                      step="1"
                      {...form.register(`items.${index}.quantity`)}
                    />
                    <ErrorText
                      message={errors.items?.[index]?.quantity?.message}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`items.${index}.weight`}>
                      Item weight (kg)
                    </Label>
                    <Input
                      id={`items.${index}.weight`}
                      type="number"
                      min="0.01"
                      step="any"
                      {...form.register(`items.${index}.weight`)}
                    />
                    <ErrorText
                      message={errors.items?.[index]?.weight?.message}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`items.${index}.declaredValue`}>
                      Declared value (৳)
                    </Label>
                    <Input
                      id={`items.${index}.declaredValue`}
                      type="number"
                      min="0"
                      step="any"
                      {...form.register(`items.${index}.declaredValue`)}
                    />
                    <ErrorText
                      message={errors.items?.[index]?.declaredValue?.message}
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor={`items.${index}.description`}>
                      Description (optional)
                    </Label>
                    <Textarea
                      id={`items.${index}.description`}
                      placeholder="Describe the item"
                      rows={2}
                      {...form.register(`items.${index}.description`)}
                    />
                    <ErrorText
                      message={errors.items?.[index]?.description?.message}
                    />
                  </div>
                </div>
              </div>
            ))}

            {typeof errors.items?.message === "string" && (
              <ErrorText message={errors.items.message} />
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleReset}
            disabled={isBusy}
          >
            Reset Form
          </Button>

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={
              isBusy ||
              hubsQuery.isLoading ||
              hubsQuery.isError ||
              hubs.length === 0
            }
          >
            {createMutation.isPending
              ? "Creating shipment..."
              : "Create Shipment"}
          </Button>
        </div>
      </form>

      {created && (
        <Card className="overflow-hidden border-primary/30">
          <CardHeader className="bg-primary/5">
            <p className="text-sm font-medium text-primary">
              Shipment created successfully
            </p>
            <CardTitle className="wrap-break-word text-xl">
              Review your delivery fee
            </CardTitle>
            <CardDescription>
              Your shipment has been created. Complete payment to proceed.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="min-w-0 rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="mt-1 break-all font-semibold">
                  {created.shipment.trackingNumber}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Distance</p>
                <p className="mt-1 text-xl font-semibold">
                  {Number(created.distance).toLocaleString("en-BD", {
                    maximumFractionDigits: 2,
                  })}{" "}
                  km
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-muted/60 p-4 sm:p-5">
              <p className="text-sm text-muted-foreground">Delivery Fee</p>
              <p className="mt-1 wrap-break-word text-3xl font-bold tracking-tight sm:text-4xl">
                ৳
                {Number(created.deliveryFee).toLocaleString("en-BD", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Payment status: {created.shipment.paymentStatus}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                className="w-full"
                disabled={paymentMutation.isPending}
                onClick={() => {
                  paymentMutation.mutate(created.shipment.id);
                }}
              >
                {paymentMutation.isPending
                  ? "Preparing secure checkout..."
                  : "Pay Now"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                After payment is confirmed, check your registered email for the
                PDF invoice.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
