"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  MessageSquare,
  Package,
  RefreshCw,
  Send,
  Star,
  Truck,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import {
  createReview,
  getMyReviews,
  getReviews,
  type Review,
} from "@/lib/api/review-service";
import { getMyShipments } from "@/lib/api/shipment-service";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function Stars({
  rating,
  interactive = false,
  onSelect,
}: {
  rating: number;
  interactive?: boolean;
  onSelect?: (rating: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          disabled={!interactive}
          onClick={() => onSelect?.(value)}
          aria-label={`Rate ${value} out of 5 stars`}
          aria-pressed={interactive ? rating === value : undefined}
          className={
            interactive
              ? "rounded p-0.5 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400"
              : "cursor-default p-0.5"
          }
        >
          <Star
            size={interactive ? 28 : 17}
            className={
              value <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        {review.customer.profileImage ? (
          <img
            src={review.customer.profileImage}
            alt={review.customer.name}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600">
            {review.customer.name?.charAt(0).toUpperCase() || "C"}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">{review.customer.name}</p>
          <p className="mt-1 text-sm text-slate-500">
            {formatDate(review.createdAt)}
          </p>
          <div className="mt-2">
            <Stars rating={review.rating} />
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          {review.rating}/5
        </span>
      </div>

      {review.comment && (
        <p className="mt-4 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-600">
          {review.comment}
        </p>
      )}

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-xs text-slate-500">Shipment ID</p>
        <p className="mt-1 break-all font-mono text-xs text-slate-700">
          {review.shipmentId}
        </p>
      </div>
    </article>
  );
}

export default function ReviewsPage() {
  const queryClient = useQueryClient();

  const [selectedShipmentId, setSelectedShipmentId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [courierFilter, setCourierFilter] = useState("");

  const shipmentsQuery = useQuery({
    queryKey: ["my-shipments"],
    queryFn: getMyShipments,
  });

  // All reviews displayed in the customer review list.
  const reviewsQuery = useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });

  // Only the logged-in customer's reviews are used for duplicate checking.
  const myReviewsQuery = useQuery({
    queryKey: ["my-reviews"],
    queryFn: getMyReviews,
  });

  const shipments = shipmentsQuery.data?.shipments ?? [];
  const reviews = reviewsQuery.data ?? [];
  const myReviews = myReviewsQuery.data ?? [];

  const reviewedShipmentIds = useMemo(
    () => new Set(myReviews.map((review) => review.shipmentId)),
    [myReviews],
  );

  const deliveredShipments = useMemo(
    () =>
      shipments.filter(
        (shipment) => String(shipment.status).toUpperCase() === "DELIVERED",
      ),
    [shipments],
  );

  const eligibleShipments = useMemo(
    () =>
      deliveredShipments.filter(
        (shipment) => !reviewedShipmentIds.has(shipment.id),
      ),
    [deliveredShipments, reviewedShipmentIds],
  );

  const selectedShipment = eligibleShipments.find(
    (shipment) => shipment.id === selectedShipmentId,
  );

  const submitMutation = useMutation({
    mutationFn: createReview,

    onSuccess: async () => {
      setSelectedShipmentId("");
      setRating(5);
      setComment("");

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reviews"] }),
        queryClient.invalidateQueries({ queryKey: ["my-reviews"] }),
        queryClient.invalidateQueries({ queryKey: ["my-shipments"] }),
      ]);
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Check the selected shipment against the latest available query data.
    const shipment = shipments.find((item) => item.id === selectedShipmentId);

    if (!shipment || String(shipment.status).toUpperCase() !== "DELIVERED") {
      return;
    }

    if (reviewedShipmentIds.has(shipment.id)) {
      return;
    }

    submitMutation.mutate({
      shipmentId: shipment.id,
      rating,
      comment: comment.trim() || undefined,
    });
  }

  const filteredReviews = reviews.filter((review) =>
    review.courierId.toLowerCase().includes(courierFilter.trim().toLowerCase()),
  );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : 0;

  const fiveStarReviews = reviews.filter(
    (review) => review.rating === 5,
  ).length;

  const loading =
    shipmentsQuery.isPending ||
    reviewsQuery.isPending ||
    myReviewsQuery.isPending;

  const loadError =
    shipmentsQuery.isError || reviewsQuery.isError || myReviewsQuery.isError;

  const loadErrorMessage =
    shipmentsQuery.error instanceof Error
      ? shipmentsQuery.error.message
      : myReviewsQuery.error instanceof Error
        ? myReviewsQuery.error.message
        : reviewsQuery.error instanceof Error
          ? reviewsQuery.error.message
          : "Please try again.";

  return (
    <main className="space-y-8 pb-10">
      <header>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <MessageSquare size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Reviews & Ratings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Share your experience after your shipment is successfully
              delivered.
            </p>
          </div>
        </div>
      </header>

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-10 text-slate-600">
          <LoaderCircle className="animate-spin" size={20} />
          Loading shipments and reviews...
        </div>
      )}

      {loadError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 text-red-600" size={20} />
            <div className="flex-1">
              <p className="font-semibold text-red-800">
                Could not load reviews
              </p>
              <p className="mt-1 text-sm text-red-700">{loadErrorMessage}</p>
              <button
                type="button"
                onClick={() => {
                  void shipmentsQuery.refetch();
                  void reviewsQuery.refetch();
                  void myReviewsQuery.refetch();
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                <RefreshCw size={15} />
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !loadError && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Total reviews</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {reviews.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Average rating</p>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-3xl font-bold text-slate-900">
                  {averageRating.toFixed(1)}
                </p>
                <Star className="fill-amber-400 text-amber-400" size={22} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Five-star reviews</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {fiveStarReviews}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Delivered shipments</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {deliveredShipments.length}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Truck size={21} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Review your courier
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Reviews are available only after successful delivery.
                </p>
              </div>
            </div>

            {eligibleShipments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                <Package className="mx-auto mb-3 text-slate-400" size={30} />
                <p className="font-semibold text-slate-800">
                  No shipments waiting for a review
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {shipments.length === 0
                    ? "Your shipments will appear here when available."
                    : deliveredShipments.length === 0
                      ? "Once a shipment is marked DELIVERED, you can review your courier."
                      : "You've already reviewed your delivered shipments."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <label
                    htmlFor="shipment"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Select a delivered shipment
                  </label>

                  <select
                    id="shipment"
                    value={selectedShipmentId}
                    onChange={(event) =>
                      setSelectedShipmentId(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Choose a shipment</option>
                    {eligibleShipments.map((shipment) => (
                      <option key={shipment.id} value={shipment.id}>
                        {shipment.trackingNumber || shipment.id} — Delivered
                      </option>
                    ))}
                  </select>

                  {selectedShipment && (
                    <div className="rounded-xl bg-emerald-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                        <CheckCircle2 size={18} />
                        Successfully delivered
                      </div>
                      <p className="mt-2 break-all font-mono text-xs text-emerald-700">
                        {selectedShipment.id}
                      </p>
                    </div>
                  )}

                  <p className="text-xs leading-5 text-slate-500">
                    Pending, in-transit, failed, and cancelled shipments cannot
                    be reviewed.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <fieldset
                    disabled={!selectedShipment || submitMutation.isPending}
                  >
                    <legend className="mb-3 text-sm font-medium text-slate-700">
                      Your rating
                    </legend>
                    <Stars rating={rating} interactive onSelect={setRating} />
                    <p className="mt-2 text-sm text-slate-500">
                      {rating} out of 5 stars
                    </p>
                  </fieldset>

                  <div>
                    <label
                      htmlFor="comment"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Comment <span className="text-slate-400">(optional)</span>
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      maxLength={1000}
                      rows={4}
                      placeholder="How was your delivery experience?"
                      disabled={!selectedShipment || submitMutation.isPending}
                      className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                    />
                    <p className="mt-1 text-right text-xs text-slate-400">
                      {comment.length}/1000
                    </p>
                  </div>

                  {submitMutation.isError && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    >
                      {submitMutation.error instanceof Error
                        ? submitMutation.error.message
                        : "Failed to submit review."}
                    </div>
                  )}

                  {submitMutation.isSuccess && (
                    <div
                      role="status"
                      className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
                    >
                      Your review was submitted successfully.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!selectedShipment || submitMutation.isPending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <LoaderCircle className="animate-spin" size={18} />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        Submit review
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </section>

          <section className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Customer reviews
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Feedback shared about courier deliveries.
                </p>
              </div>

              <div className="w-full sm:max-w-sm">
                <label
                  htmlFor="courier-filter"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Filter by courier ID
                </label>
                <input
                  id="courier-filter"
                  value={courierFilter}
                  onChange={(event) => setCourierFilter(event.target.value)}
                  placeholder="Enter courier ID"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {filteredReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <MessageSquare
                  className="mx-auto mb-3 text-slate-400"
                  size={30}
                />
                <p className="font-semibold text-slate-800">No reviews found</p>
                <p className="mt-1 text-sm text-slate-500">
                  Reviews will appear here after customers submit them.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
