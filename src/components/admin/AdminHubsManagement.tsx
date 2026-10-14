"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  type AdminHubQuery,
  getAdminHubs,
  type HubStatus,
} from "@/lib/api/admin-hubs";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Oldest first", sortBy: "createdAt", sortOrder: "asc" },
  { label: "Name A–Z", sortBy: "name", sortOrder: "asc" },
  { label: "Name Z–A", sortBy: "name", sortOrder: "desc" },
  { label: "City A–Z", sortBy: "city", sortOrder: "asc" },
] as const;

function getPositiveInteger(value: string | null, fallback: number) {
  const number = Number(value);

  return Number.isSafeInteger(number) && number > 0 ? number : fallback;
}

function getErrorMessage(error: Error) {
  return error.message || "Something went wrong. Please try again.";
}

function StatusBadge({ status }: { status: HubStatus }) {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        isActive
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
  loading,
}: {
  title: string;
  value: number | undefined;
  description: string;
  icon: typeof Building2;
  iconClass: string;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          {loading ? (
            <div className="mt-3 h-8 w-16 animate-pulse rounded-md bg-slate-100" />
          ) : (
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {value ?? "—"}
            </p>
          )}
          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>

        <div className={`rounded-xl p-3 ${iconClass}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function HubLocation({ hub }: { hub: { city: string; district: string } }) {
  return (
    <div className="flex items-start gap-2">
      <MapPin className="mt-0.5 shrink-0 text-slate-400" size={16} />
      <div>
        <p className="font-medium text-slate-800">{hub.city}</p>
        <p className="mt-0.5 text-xs text-slate-500">{hub.district}</p>
      </div>
    </div>
  );
}

export default function AdminHubsManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = getPositiveInteger(searchParams.get("page"), 1);
  const searchTerm = searchParams.get("searchTerm") ?? "";
  const statusParam = searchParams.get("status") ?? "";
  const city = searchParams.get("city") ?? "";
  const district = searchParams.get("district") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  const [searchInput, setSearchInput] = useState(searchTerm);
  const [cityInput, setCityInput] = useState(city);
  const [districtInput, setDistrictInput] = useState(district);
  const [statusInput, setStatusInput] = useState(statusParam);

  const status: HubStatus | "" =
    statusParam === "ACTIVE" || statusParam === "INACTIVE" ? statusParam : "";

  const query: AdminHubQuery = {};

  if (page > 1) {
    query.page = page;
  }

  if (searchTerm) {
    query.searchTerm = searchTerm;
  }

  if (status) {
    query.status = status;
  }

  if (city) {
    query.city = city;
  }

  if (district) {
    query.district = district;
  }

  if (searchParams.has("sortBy")) {
    query.sortBy = sortBy;
  }

  if (searchParams.has("sortOrder")) {
    query.sortOrder = sortOrder;
  }

  const hubsQuery = useQuery({
    queryKey: ["admin-hubs", query],
    queryFn: () => getAdminHubs(query),
  });

  const statsQuery = useQuery({
    queryKey: ["admin-hubs-stats"],
    queryFn: async () => {
      const response = await getAdminHubs();

      return {
        total: response.meta.total,
        active: undefined,
        inactive: undefined,
      };
    },
  });

  const hubs = hubsQuery.data?.data ?? [];
  const meta = hubsQuery.data?.meta;
  const totalPages = meta?.totalPages ?? 0;
  const total = meta?.total ?? 0;

  function updateUrl(updates: Record<string, string | number>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (String(value).trim() === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "?", { scroll: false });
  }

  function applyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    const filters = {
      searchTerm: searchInput.trim(),
      city: cityInput.trim(),
      district: districtInput.trim(),
      status: statusInput,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.set("page", "1");

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "?", { scroll: false });
  }

  function clearFilters() {
    setSearchInput("");
    setCityInput("");
    setDistrictInput("");
    setStatusInput("");
    router.push("?", { scroll: false });
  }

  function handleSort(value: string) {
    const selected = SORT_OPTIONS.find(
      (option) => `${option.sortBy}:${option.sortOrder}` === value,
    );

    if (!selected) return;

    updateUrl({
      sortBy: selected.sortBy,
      sortOrder: selected.sortOrder,
      page: 1,
    });
  }

  const currentSort = SORT_OPTIONS.some(
    (option) => option.sortBy === sortBy && option.sortOrder === sortOrder,
  )
    ? `${sortBy}:${sortOrder}`
    : "createdAt:desc";

  const hasFilters = Boolean(searchTerm || city || district || status);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Building2 size={16} />
            Admin Dashboard
            <span>/</span>
            <span className="text-slate-700">Hubs</span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Hub Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your logistics hubs, locations, and operational status.
          </p>
        </div>

        <Link
          href="/admin/hubs/create"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus size={18} />
          Create Hub
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Hubs"
          value={statsQuery.data?.total}
          description="All registered hubs"
          icon={Building2}
          iconClass="bg-blue-50 text-blue-600"
          loading={statsQuery.isLoading}
        />
        <StatCard
          title="Active Hubs"
          value={statsQuery.data?.active}
          description="Currently operational"
          icon={MapPin}
          iconClass="bg-emerald-50 text-emerald-600"
          loading={statsQuery.isLoading}
        />
        <StatCard
          title="Inactive Hubs"
          value={statsQuery.data?.inactive}
          description="Currently not operational"
          icon={Building2}
          iconClass="bg-amber-50 text-amber-600"
          loading={statsQuery.isLoading}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">All Hubs</h2>
              <p className="mt-1 text-sm text-slate-500">
                Search and manage registered hub locations.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
              <Building2 size={16} />
              <span>
                {hubsQuery.isLoading ? "Loading..." : `${total} hubs`}
              </span>
            </div>
          </div>

          <form onSubmit={applyFilters} className="mt-5 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="relative sm:col-span-2 xl:col-span-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search name, code..."
                  aria-label="Search hubs by name or code"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <input
                value={cityInput}
                onChange={(event) => setCityInput(event.target.value)}
                placeholder="Filter by city"
                aria-label="Filter hubs by city"
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <input
                value={districtInput}
                onChange={(event) => setDistrictInput(event.target.value)}
                placeholder="Filter by district"
                aria-label="Filter hubs by district"
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <select
                value={statusInput}
                onChange={(event) => setStatusInput(event.target.value)}
                aria-label="Filter hubs by status"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  <SlidersHorizontal size={16} />
                  Apply Filters
                </button>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <X size={16} />
                    Clear Filters
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="hub-sort"
                  className="shrink-0 text-sm text-slate-500"
                >
                  Sort by
                </label>
                <select
                  id="hub-sort"
                  value={currentSort}
                  onChange={(event) => handleSort(event.target.value)}
                  className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 sm:flex-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option
                      key={`${option.sortBy}:${option.sortOrder}`}
                      value={`${option.sortBy}:${option.sortOrder}`}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>

        {hubsQuery.isLoading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="text-sm text-slate-500">Loading hubs...</p>
          </div>
        ) : hubsQuery.isError ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 py-10 text-center">
            <div className="rounded-full bg-red-50 p-3 text-red-600">
              <Building2 size={24} />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">
              Failed to load hubs
            </h3>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              {getErrorMessage(hubsQuery.error)}
            </p>
            <button
              type="button"
              onClick={() => hubsQuery.refetch()}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : hubs.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 py-10 text-center">
            <div className="rounded-full bg-slate-100 p-4 text-slate-500">
              <Building2 size={28} />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">No hubs found</h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {hasFilters
                ? "Try changing your search or filters to find a hub."
                : "No hubs have been registered yet. Create your first hub to get started."}
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href="/admin/hubs/create"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={16} />
                Create Hub
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-190 text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">Hub</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Address</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hubs.map((hub) => (
                    <tr
                      key={hub.id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Building2 size={19} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">
                              {hub.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Code: {hub.code}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <HubLocation hub={hub} />
                      </td>
                      <td className="max-w-64 px-6 py-4">
                        <p className="truncate text-sm text-slate-600">
                          {hub.address}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={hub.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/hubs/${encodeURIComponent(hub.id)}`}
                          aria-label={`View ${hub.name} details`}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Eye size={16} />
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
              {hubs.map((hub) => (
                <article
                  key={hub.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 transition duration-200 hover:border-blue-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Building2 size={19} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="wrap-break-word font-semibold text-slate-900">
                          {hub.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Code: {hub.code}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={hub.status} />
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <HubLocation hub={hub} />
                    <p className="mt-3 wrap-break-word text-sm leading-6 text-slate-600">
                      {hub.address}
                    </p>
                  </div>

                  <Link
                    href={`/admin/hubs/${encodeURIComponent(hub.id)}`}
                    className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Eye size={16} />
                    View Hub Details
                  </Link>
                </article>
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {(page - 1) * PAGE_SIZE + 1}
                </span>
                {"–"}
                <span className="font-semibold text-slate-800">
                  {Math.min(page * PAGE_SIZE, total)}
                </span>{" "}
                of <span className="font-semibold text-slate-800">{total}</span>{" "}
                hubs
              </p>

              <div className="flex items-center justify-between gap-3 md:justify-end">
                <button
                  type="button"
                  disabled={page <= 1 || hubsQuery.isFetching}
                  onClick={() => updateUrl({ page: page - 1 })}
                  className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="whitespace-nowrap text-sm text-slate-500">
                  Page {page} of {Math.max(totalPages, 1)}
                </span>

                <button
                  type="button"
                  disabled={
                    page >= totalPages ||
                    totalPages === 0 ||
                    hubsQuery.isFetching
                  }
                  onClick={() => updateUrl({ page: page + 1 })}
                  className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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
