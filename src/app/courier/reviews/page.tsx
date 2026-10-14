"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  RefreshCw,
  Search,
  Star,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import { getCurrentUser } from "@/lib/api/auth";
import { getCourierReviews, type Review } from "@/lib/api/review-service";

const PAGE_SIZE = 8;

type RatingFilter = "all" | 1 | 2 | 3 | 4 | 5;

function getErrorMessage(error: Error | null): string {
  return error?.message || "Something went wrong. Please try again.";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function RatingStars({ rating, size = 16 }: { rating: number; size?: number }) {
  const safeRating = Math.min(5, Math.max(0, rating));

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${safeRating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= safeRating
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300"
          }
        />
      ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ErrorState({
  title,
  message,
  onRetry,
  isRetrying = false,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
      <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

      <h2 className="mt-4 text-lg font-semibold text-slate-900">{title}</h2>

      <p className="mt-2 wrap-break-word text-sm text-slate-600">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={isRetrying ? "animate-spin" : ""} />
          Try again
        </button>
      )}
    </div>
  );
}

export default function CourierReviewsPage() {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Get the currently authenticated user.
  const userQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    staleTime: 60_000,
  });

  // The backend expects the Courier's database User ID.
  const courierId =
    userQuery.data?.id?.trim() || userQuery.data?.userId?.trim() || "";

  // Only request reviews after the Courier account is verified.
  const reviewsQuery = useQuery<Review[], Error>({
    queryKey: ["courier-reviews", courierId],
    queryFn: () => getCourierReviews(courierId),
    enabled: Boolean(courierId) && userQuery.data?.role === "COURIER",
    staleTime: 60_000,
  });

  const reviews: Review[] = reviewsQuery.data ?? [];

  // Calculate statistics using the reviews returned by the API.
  const stats = useMemo(() => {
    const totalReviews = reviews.length;

    const ratingTotal = reviews.reduce(
      (total, review) => total + review.rating,
      0,
    );

    const averageRating = totalReviews > 0 ? ratingTotal / totalReviews : 0;

    const fiveStarReviews = reviews.filter(
      (review) => review.rating === 5,
    ).length;

    const commentedReviews = reviews.filter((review) =>
      Boolean(review.comment?.trim()),
    ).length;

    const ratingDistribution: Record<number, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      if (review.rating in ratingDistribution) {
        ratingDistribution[review.rating] += 1;
      }
    });

    return {
      totalReviews,
      averageRating,
      fiveStarReviews,
      fiveStarPercentage:
        totalReviews > 0
          ? Math.round((fiveStarReviews / totalReviews) * 100)
          : 0,
      commentedReviews,
      ratingDistribution,
    };
  }, [reviews]);

  // Search and rating filters.
  const filteredReviews = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesRating =
        ratingFilter === "all" || review.rating === ratingFilter;

      const customerName = review.customer?.name ?? "Unknown Customer";
      const customerId = review.customer?.id ?? "";
      const comment = review.comment ?? "";
      const shipmentId = review.shipmentId ?? "";
      const reviewId = review.id ?? "";

      const matchesSearch =
        !normalizedSearch ||
        customerName.toLowerCase().includes(normalizedSearch) ||
        customerId.toLowerCase().includes(normalizedSearch) ||
        shipmentId.toLowerCase().includes(normalizedSearch) ||
        comment.toLowerCase().includes(normalizedSearch) ||
        reviewId.toLowerCase().includes(normalizedSearch);

      return matchesRating && matchesSearch;
    });
  }, [reviews, search, ratingFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedReviews = filteredReviews.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleRatingChange(value: RatingFilter) {
    setRatingFilter(value);
    setCurrentPage(1);
  }

  function resetFilters() {
    setSearch("");
    setRatingFilter("all");
    setCurrentPage(1);
  }

  // Account loading state.
  if (userQuery.isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Loading your account...
        </div>
      </div>
    );
  }

  // Account API error.
  if (userQuery.isError) {
    return (
      <ErrorState
        title="Could not load your account"
        message={getErrorMessage(userQuery.error)}
        onRetry={() => void userQuery.refetch()}
        isRetrying={userQuery.isFetching}
      />
    );
  }

  // Only Courier accounts can access this page.
  if (userQuery.data?.role !== "COURIER") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-white p-8 text-center">
        <AlertCircle className="mx-auto h-9 w-9 text-amber-500" />

        <h2 className="mt-3 text-lg font-semibold text-slate-900">
          Courier access required
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          This page is available only to courier accounts.
        </p>
      </div>
    );
  }

  // Handle missing ID before calling the reviews endpoint.
  if (!courierId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-white p-8 text-center">
        <AlertCircle className="mx-auto h-9 w-9 text-amber-500" />

        <h2 className="mt-3 text-lg font-semibold text-slate-900">
          Courier ID unavailable
        </h2>

        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
          Your account response does not contain a database user ID. Check that
          GET /auth/me returns the authenticated user's id or userId field.
        </p>
      </div>
    );
  }

  // Reviews loading state.
  if (reviewsQuery.isPending) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Customer Reviews
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            See feedback customers have left for your deliveries.
          </p>
        </div>

        <div className="flex min-h-56 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading customer reviews...
          </div>
        </div>
      </div>
    );
  }

  // Reviews API error.
  if (reviewsQuery.isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Customer Reviews
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            See feedback customers have left for your deliveries.
          </p>
        </div>

        <ErrorState
          title="Could not load reviews"
          message={getErrorMessage(reviewsQuery.error)}
          onRetry={() => void reviewsQuery.refetch()}
          isRetrying={reviewsQuery.isFetching}
        />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Customer Reviews
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track customer feedback and understand your delivery performance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void reviewsQuery.refetch()}
          disabled={reviewsQuery.isFetching}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw
            size={16}
            className={reviewsQuery.isFetching ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Reviews"
          value={String(stats.totalReviews)}
          description="Reviews received"
          icon={<MessageSquare size={20} />}
        />

        <StatCard
          title="Average Rating"
          value={stats.totalReviews > 0 ? stats.averageRating.toFixed(1) : "—"}
          description={
            stats.totalReviews > 0 ? "Out of 5 stars" : "No ratings yet"
          }
          icon={<Star size={20} />}
        />

        <StatCard
          title="5-Star Reviews"
          value={String(stats.fiveStarReviews)}
          description={`${stats.fiveStarPercentage}% of all reviews`}
          icon={<Star size={20} />}
        />

        <StatCard
          title="Written Feedback"
          value={String(stats.commentedReviews)}
          description="Reviews with comments"
          icon={<MessageSquare size={20} />}
        />
      </div>

      {/* Rating overview */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Rating Overview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribution of ratings from your customers.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr] md:items-center">
          <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 p-5">
            <span className="text-4xl font-bold text-slate-900">
              {stats.totalReviews > 0 ? stats.averageRating.toFixed(1) : "—"}
            </span>

            <RatingStars rating={Math.round(stats.averageRating)} size={20} />

            <p className="mt-2 text-xs text-slate-500">
              {stats.totalReviews}{" "}
              {stats.totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingDistribution[rating];

              const percentage =
                stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="w-3 text-sm font-medium text-slate-600">
                    {rating}
                  </span>

                  <Star
                    size={15}
                    className="shrink-0 fill-amber-400 text-amber-400"
                  />

                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-8 text-right text-xs text-slate-500">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews list and filters */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              All Reviews
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search by customer, shipment ID, review ID, or comment.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search reviews..."
                aria-label="Search reviews"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <select
              value={String(ratingFilter)}
              onChange={(event) => {
                const value = event.target.value;

                handleRatingChange(
                  value === "all"
                    ? "all"
                    : (Number(value) as 1 | 2 | 3 | 4 | 5),
                );
              }}
              aria-label="Filter by rating"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="all">All ratings</option>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <MessageSquare size={25} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-900">
              No reviews yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              Customer reviews will appear here when customers submit feedback
              for your completed deliveries.
            </p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <Search className="mx-auto h-9 w-9 text-slate-300" />

            <h3 className="mt-4 text-base font-semibold text-slate-900">
              No matching reviews
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another search term or rating filter.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {paginatedReviews.map((review) => {
                const customerName =
                  review.customer?.name || "Unknown Customer";

                const customerId = review.customer?.id || "Unavailable";
                const profileImage = review.customer?.profileImage || null;

                return (
                  <article
                    key={review.id}
                    className="p-5 transition-colors hover:bg-slate-50/70 sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      {/* Customer information */}
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        {profileImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={profileImage}
                            alt={customerName}
                            className="h-11 w-11 shrink-0 rounded-full border border-slate-200 object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                            {getInitials(customerName) || (
                              <UserRound size={20} />
                            )}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-slate-900">
                            {customerName}
                          </h3>

                          <p className="mt-0.5 break-all text-xs text-slate-500">
                            Customer ID: {customerId}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <RatingStars rating={review.rating} />

                            <span className="text-sm font-semibold text-slate-700">
                              {review.rating}/5
                            </span>
                          </div>
                        </div>
                      </div>

                      <time
                        dateTime={review.createdAt}
                        className="shrink-0 text-xs text-slate-500"
                      >
                        {formatDate(review.createdAt)}
                      </time>
                    </div>

                    {/* Review comment */}
                    <div className="mt-4 sm:pl-14">
                      <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-700">
                        {review.comment?.trim() ||
                          "The customer did not leave a written comment."}
                      </p>

                      {/* Actual identifiers returned by the API */}
                      <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
                        <span className="break-all">
                          <span className="font-medium text-slate-700">
                            Shipment ID:
                          </span>{" "}
                          {review.shipmentId}
                        </span>

                        <span className="break-all">
                          <span className="font-medium text-slate-700">
                            Review ID:
                          </span>{" "}
                          {review.id}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-slate-500">
                Showing {(safeCurrentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(safeCurrentPage * PAGE_SIZE, filteredReviews.length)}{" "}
                of {filteredReviews.length} reviews
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={safeCurrentPage === 1}
                  aria-label="Previous page"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="px-2 text-sm text-slate-600">
                  {safeCurrentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={safeCurrentPage >= totalPages}
                  aria-label="Next page"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
