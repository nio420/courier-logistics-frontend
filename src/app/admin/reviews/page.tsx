"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Eye,
  Loader2,
  MessageSquare,
  Package,
  RefreshCw,
  Search,
  Star,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { type AdminReview, getAdminReviews } from "@/lib/api/admin-reviews";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

function formatDate(date: string | null | undefined): string {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: string | null | undefined): string {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount: number | string): string {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "৳0.00";
  }

  return `৳${value.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatLabel(value: string | null | undefined): string {
  if (!value) return "Not available";

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return "NA";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getStatusStyle(status: string): string {
  const normalizedStatus = status.toUpperCase();

  if (
    normalizedStatus === "DELIVERED" ||
    normalizedStatus === "PAID" ||
    normalizedStatus === "COMPLETED"
  ) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  }

  if (
    normalizedStatus === "PENDING" ||
    normalizedStatus === "PROCESSING" ||
    normalizedStatus === "IN_TRANSIT"
  ) {
    return "bg-amber-50 text-amber-700 ring-amber-600/20";
  }

  if (
    normalizedStatus === "FAILED" ||
    normalizedStatus === "CANCELLED" ||
    normalizedStatus === "UNPAID"
  ) {
    return "bg-red-50 text-red-700 ring-red-600/20";
  }

  return "bg-slate-100 text-slate-700 ring-slate-500/20";
}

function Avatar({
  name,
  image,
  color = "blue",
}: {
  name: string;
  image: string | null;
  color?: "blue" | "purple";
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-violet-100 text-violet-700",
  };

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ${colors[color]}`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="text-sm font-semibold">{getInitials(name)}</span>
      )}
    </div>
  );
}

function Stars({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size === "md" ? "h-5 w-5" : "h-3.5 w-3.5"} ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-100 text-slate-300"
          }`}
        />
      ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: typeof MessageSquare;
  iconColor: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 wrap-break-word text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconColor}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 wrap-break-word text-sm font-semibold text-slate-800">
        {value === null || value === undefined || value === ""
          ? "Not available"
          : value}
      </p>
    </div>
  );
}

function ReviewDetails({
  review,
  onClose,
}: {
  review: AdminReview;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900">Review Details</h2>
            <p className="mt-1 break-all text-xs text-slate-500">
              Review ID: {review.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close review details"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-4 sm:p-6">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold text-slate-900">Customer Review</h3>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Stars rating={review.rating} size="md" />
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {review.rating} out of 5 stars
                  </p>
                </div>

                <span className="text-xs text-slate-500">
                  {formatDateTime(review.createdAt)}
                </span>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-700">
                  {review.comment?.trim() || "No written comment provided."}
                </p>
              </div>

              <p className="mt-3 break-all text-xs text-slate-500">
                Last updated: {formatDateTime(review.updatedAt)}
              </p>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <UserRound className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold text-slate-900">
                Customer Information
              </h3>
            </div>

            <div className="mb-3 flex min-w-0 items-center gap-3">
              <Avatar
                name={review.customer.name}
                image={review.customer.profileImage}
              />
              <div className="min-w-0">
                <p className="wrap-break-word font-semibold text-slate-900">
                  {review.customer.name}
                </p>
                <p className="break-all text-sm text-slate-500">
                  {review.customer.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem label="Customer ID" value={review.customer.id} />
              <DetailItem label="Customer Name" value={review.customer.name} />
              <DetailItem label="Email" value={review.customer.email} />
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Truck className="h-4 w-4 text-violet-600" />
              <h3 className="font-semibold text-slate-900">
                Courier Information
              </h3>
            </div>

            <div className="mb-3 flex min-w-0 items-center gap-3">
              <Avatar
                name={review.courier.name}
                image={review.courier.profileImage}
                color="purple"
              />
              <div className="min-w-0">
                <p className="wrap-break-word font-semibold text-slate-900">
                  {review.courier.name}
                </p>
                <p className="break-all text-sm text-slate-500">
                  {review.courier.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem label="Courier ID" value={review.courier.id} />
              <DetailItem label="Courier Name" value={review.courier.name} />
              <DetailItem label="Email" value={review.courier.email} />
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-600" />
              <h3 className="font-semibold text-slate-900">
                Shipment Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem
                label="Tracking Number"
                value={review.shipment.trackingNumber}
              />
              <DetailItem label="Shipment ID" value={review.shipment.id} />
              <DetailItem
                label="Shipment Status"
                value={formatLabel(review.shipment.status)}
              />
              <DetailItem
                label="Payment Status"
                value={formatLabel(review.shipment.paymentStatus)}
              />
              <DetailItem
                label="Service Type"
                value={formatLabel(review.shipment.serviceType)}
              />
              <DetailItem
                label="Package Type"
                value={formatLabel(review.shipment.packageType)}
              />
              <DetailItem
                label="Weight"
                value={`${review.shipment.weight} kg`}
              />
              <DetailItem
                label="Delivery Fee"
                value={formatAmount(review.shipment.deliveryFee)}
              />
              <DetailItem
                label="Shipment Created"
                value={formatDateTime(review.shipment.createdAt)}
              />
              <DetailItem
                label="Delivered At"
                value={formatDateTime(review.shipment.deliveredAt)}
              />
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  let pageNumbers: number[];

  if (totalPages <= 5) {
    pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  } else if (currentPage <= 3) {
    pageNumbers = [1, 2, 3, 4, 5];
  } else if (currentPage >= totalPages - 2) {
    pageNumbers = Array.from(
      { length: 5 },
      (_, index) => totalPages - 4 + index,
    );
  } else {
    pageNumbers = [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 sm:justify-start">
        <p>
          Showing{" "}
          <span className="font-semibold text-slate-800">{startItem}</span>
          {"–"}
          <span className="font-semibold text-slate-800">{endItem}</span>
          {" of "}
          <span className="font-semibold text-slate-800">{totalItems}</span>
        </p>

        <label className="flex items-center gap-2">
          <span className="whitespace-nowrap">Rows per page</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {pageNumbers[0] > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className="h-9 min-w-9 rounded-lg border border-slate-200 px-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="px-1 text-slate-400">…</span>
            )}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            onClick={() => onPageChange(page)}
            className={`h-9 min-w-9 rounded-lg border px-2 text-sm font-semibold transition ${
              currentPage === page
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {page}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-1 text-slate-400">…</span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="h-9 min-w-9 rounded-lg border border-slate-200 px-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function AdminReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(
    null,
  );

  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: getAdminReviews,
  });

  const stats = useMemo(() => {
    const total = reviews.length;

    const averageRating =
      total > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
        : 0;

    const fiveStarReviews = reviews.filter(
      (review) => review.rating === 5,
    ).length;

    const lowRatingReviews = reviews.filter(
      (review) => review.rating <= 2,
    ).length;

    return {
      total,
      averageRating: averageRating.toFixed(1),
      fiveStarReviews,
      lowRatingReviews,
    };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesSearch =
        !search ||
        [
          review.customer.name,
          review.customer.email,
          review.courier.name,
          review.courier.email,
          review.shipment.trackingNumber,
          review.shipment.id,
          review.id,
          review.comment ?? "",
        ].some((value) => value.toLowerCase().includes(search));

      const matchesRating =
        ratingFilter === "all" || review.rating === Number(ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [reviews, searchTerm, ratingFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize));

  // Keep the selected page valid when filters or page size change.
  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredReviews.slice(startIndex, startIndex + pageSize);
  }, [filteredReviews, currentPage, pageSize]);

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  function handleRatingChange(value: string) {
    setRatingFilter(value);
    setCurrentPage(1);
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setCurrentPage(1);
  }

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-clip bg-slate-50/80">
      <div className="mx-auto w-full min-w-0 max-w-[1600px] p-4 sm:p-6 lg:p-8">
        {/* Page heading */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
              <MessageSquare className="h-4 w-4" />
              Admin Management
            </div>

            <h1 className="mt-2 wrap-break-word text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Customer Reviews
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              View customer feedback, review courier performance, and inspect
              the related shipment information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh Data
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Reviews"
            value={stats.total}
            description="All customer reviews"
            icon={MessageSquare}
            iconColor="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Average Rating"
            value={stats.averageRating}
            description="Average customer satisfaction"
            icon={Star}
            iconColor="bg-amber-50 text-amber-600"
          />

          <StatCard
            title="5-Star Reviews"
            value={stats.fiveStarReviews}
            description="Highest-rated customer reviews"
            icon={CheckCircle2}
            iconColor="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Low Ratings"
            value={stats.lowRatingReviews}
            description="Reviews rated 1 or 2 stars"
            icon={AlertCircle}
            iconColor="bg-red-50 text-red-600"
          />
        </div>

        {/* Reviews section */}
        <section className="mt-6 min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:mt-8">
          <div className="border-b border-slate-200 p-4 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900">
                  All Reviews
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search, filter, and view complete review details.
                </p>
              </div>

              <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1 xl:w-80 xl:flex-none">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    placeholder="Search customer, courier, shipment..."
                    aria-label="Search reviews"
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="relative min-w-0 sm:w-44 sm:shrink-0">
                  <Star className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={ratingFilter}
                    onChange={(event) => handleRatingChange(event.target.value)}
                    aria-label="Filter by rating"
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                {filteredReviews.length}{" "}
                {filteredReviews.length === 1 ? "review" : "reviews"} found
              </span>

              {(searchTerm || ratingFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setRatingFilter("all");
                    setCurrentPage(1);
                  }}
                  className="font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="space-y-4 p-4 sm:p-6">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                Loading reviews...
              </div>

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          )}

          {/* Error state */}
          {!isLoading && isError && (
            <div className="flex flex-col items-center px-4 py-12 text-center sm:px-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertCircle className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                Could not load reviews
              </h3>

              <p className="mt-2 max-w-md wrap-break-word text-sm leading-6 text-slate-500">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong while fetching reviews."}
              </p>

              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && filteredReviews.length === 0 && (
            <div className="flex flex-col items-center px-4 py-12 text-center sm:px-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <MessageSquare className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No reviews found
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {reviews.length === 0
                  ? "Customer reviews will appear here when they are submitted."
                  : "Try changing your search or rating filter."}
              </p>

              {(searchTerm || ratingFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setRatingFilter("all");
                    setCurrentPage(1);
                  }}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Desktop table: visible only on larger screens */}
          {!isLoading && !isError && filteredReviews.length > 0 && (
            <>
              <div className="hidden w-full min-w-0 lg:block">
                <table className="w-full table-fixed text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="w-[20%] px-4 py-4 xl:px-6">Customer</th>
                      <th className="w-[18%] px-4 py-4 xl:px-6">Courier</th>
                      <th className="w-[16%] px-4 py-4">Shipment</th>
                      <th className="w-[14%] px-4 py-4">Rating</th>
                      <th className="w-[17%] px-4 py-4">Comment</th>
                      <th className="w-[9%] px-3 py-4">Date</th>
                      <th className="w-[6%] px-3 py-4 text-center">Details</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {paginatedReviews.map((review) => (
                      <tr
                        key={review.id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-4 py-4 xl:px-6">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <Avatar
                              name={review.customer.name}
                              image={review.customer.profileImage}
                            />
                            <div className="min-w-0">
                              <p className="wrap-break-word text-sm font-semibold text-slate-800">
                                {review.customer.name}
                              </p>
                              <p className="mt-1 break-all text-xs text-slate-500">
                                {review.customer.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 xl:px-6">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <Avatar
                              name={review.courier.name}
                              image={review.courier.profileImage}
                              color="purple"
                            />
                            <div className="min-w-0">
                              <p className="wrap-break-word text-sm font-semibold text-slate-800">
                                {review.courier.name}
                              </p>
                              <p className="mt-1 break-all text-xs text-slate-500">
                                {review.courier.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <p className="wrap-break-word text-sm font-semibold text-slate-800">
                            {review.shipment.trackingNumber}
                          </p>
                          <span
                            className={`mt-2 inline-flex max-w-full rounded-full px-2 py-1 text-[10px] font-semibold ring-1 ring-inset ${getStatusStyle(
                              review.shipment.status,
                            )}`}
                          >
                            {formatLabel(review.shipment.status)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <Stars rating={review.rating} />
                          <p className="mt-1 text-xs text-slate-500">
                            {review.rating}/5
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p
                            title={review.comment ?? ""}
                            className="wrap-break-word text-sm leading-5 text-slate-600"
                          >
                            {review.comment?.trim() || "No comment"}
                          </p>
                        </td>

                        <td className="px-3 py-4">
                          <p className="text-xs leading-5 text-slate-600">
                            {formatDate(review.createdAt)}
                          </p>
                        </td>

                        <td className="px-3 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedReview(review)}
                            aria-label={`View review by ${review.customer.name}`}
                            title="View details"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile and tablet cards: no horizontal table scrolling */}
              <div className="grid min-w-0 grid-cols-1 gap-3 p-3 sm:p-4 lg:hidden">
                {paginatedReviews.map((review) => (
                  <article
                    key={review.id}
                    className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
                  >
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar
                          name={review.customer.name}
                          image={review.customer.profileImage}
                        />

                        <div className="min-w-0">
                          <p className="wrap-break-word text-sm font-semibold text-slate-900">
                            {review.customer.name}
                          </p>
                          <p className="mt-1 break-all text-xs text-slate-500">
                            {review.customer.email}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedReview(review)}
                        aria-label={`View review by ${review.customer.name}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-500">
                          Courier
                        </p>
                        <div className="mt-2 flex min-w-0 items-center gap-2">
                          <Avatar
                            name={review.courier.name}
                            image={review.courier.profileImage}
                            color="purple"
                          />
                          <div className="min-w-0">
                            <p className="wrap-break-word text-sm font-medium text-slate-800">
                              {review.courier.name}
                            </p>
                            <p className="break-all text-xs text-slate-500">
                              {review.courier.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-500">
                          Shipment
                        </p>
                        <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                          {review.shipment.trackingNumber}
                        </p>
                        <span
                          className={`mt-2 inline-flex max-w-full rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusStyle(
                            review.shipment.status,
                          )}`}
                        >
                          {formatLabel(review.shipment.status)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 min-w-0 border-t border-slate-100 pt-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <Stars rating={review.rating} />
                          <p className="mt-1 text-xs text-slate-500">
                            {review.rating}/5 rating
                          </p>
                        </div>

                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                          {formatDate(review.createdAt)}
                        </span>
                      </div>

                      <div className="mt-3 rounded-lg bg-slate-50 p-3">
                        <p className="wrap-break-word text-xs font-medium text-slate-500">
                          Customer comment
                        </p>
                        <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-700">
                          {review.comment?.trim() || "No comment provided."}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedReview(review)}
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                        View Full Details
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredReviews.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          )}
        </section>

        <div className="mt-4 flex items-start gap-2 px-1 text-xs leading-5 text-slate-500">
          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>
            Review statistics and records are based on the data returned by your
            admin reviews API.
          </p>
        </div>
      </div>

      {selectedReview && (
        <ReviewDetails
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </main>
  );
}
