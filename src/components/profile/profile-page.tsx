"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Camera,
  LoaderCircle,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import {
  getMyProfile,
  type UserProfile,
  updateMyProfile,
  uploadProfileImage,
} from "@/lib/api/profile-service";

const profileQueryKey = ["my-profile"];

interface ProfilePageProps {
  requiredRole?: "ADMIN" | "COURIER" | "CUSTOMER";
}

export default function ProfilePage({ requiredRole }: ProfilePageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const profileQuery = useQuery({
    queryKey: profileQueryKey,
    queryFn: getMyProfile,
  });

  const profile = profileQuery.data;

  // রোলের মিল আছে কিনা তা চেক করার লজিক
  const hasUnauthorizedRole =
    requiredRole && profile && profile.role !== requiredRole;

  useEffect(() => {
    if (profile && requiredRole && profile.role !== requiredRole) {
      // ইউজারের রিয়েল রোল অনুযায়ী তাকে তার ড্যাশবোর্ডে রিডাইরেクト করে দিন
      if (profile.role === "ADMIN") {
        router.replace("/admin/profile");
      } else if (profile.role === "COURIER") {
        router.replace("/dashboard/courier/profile");
      } else {
        router.replace("/dashboard/profile");
      }
    }
  }, [profile, requiredRole]);

  const saveMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData<UserProfile>(profileQueryKey, (current) =>
        current ? { ...current, ...updatedProfile } : updatedProfile,
      );
      setNotice("Profile updated successfully.");
      setError("");
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to update profile.");
      setNotice("");
    },
  });

  const imageMutation = useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData<UserProfile>(profileQueryKey, (current) =>
        current ? { ...current, ...updatedProfile } : updatedProfile,
      );
      setNotice("Profile picture updated successfully.");
      setError("");
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to upload image.");
      setNotice("");
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setError("");

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
    };

    if (!payload.name) {
      setError("Name is required.");
      return;
    }

    saveMutation.mutate(payload);
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setNotice("");
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    imageMutation.mutate(file);
    event.target.value = "";
  }

  if (profileQuery.isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-sm text-gray-500">
          Loading your profile...
        </span>
      </div>
    );
  }

  if (profileQuery.isError || !profile) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">
          Could not load your profile
        </h2>
        <p className="mt-2 text-sm text-red-700">
          {profileQuery.error?.message || "Please try again."}
        </p>
        <button
          type="button"
          onClick={() => profileQuery.refetch()}
          className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  // if role is not match with required role
  if (hasUnauthorizedRole) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <h2 className="font-semibold text-amber-800 text-lg">Access Denied</h2>
        <p className="mt-2 text-sm text-amber-700">
          You do not have the required permissions to view this profile section.
        </p>
      </div>
    );
  }

  const roleLabel =
    profile.role.charAt(0) + profile.role.slice(1).toLowerCase();

  const createdDate = new Date(profile.createdAt).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information and account details.
        </p>
      </div>

      {notice && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {notice}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="h-24 bg-gradient-to-r from-blue-700 to-indigo-600" />

          <div className="-mt-12 px-6 pb-6">
            <div className="relative h-24 w-24">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 text-2xl font-bold text-gray-600 shadow-sm">
                {profile.profileImage ? (
                  <Image
                    src={profile.profileImage}
                    alt={`${profile.name}'s profile`}
                    width={96}
                    height={96}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile.name.charAt(0).toUpperCase()
                )}
              </div>

              <button
                type="button"
                aria-label="Upload profile picture"
                title="Upload profile picture"
                disabled={imageMutation.isPending}
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow hover:bg-blue-700 disabled:opacity-60"
              >
                {imageMutation.isPending ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <h2 className="mt-4 break-words text-xl font-semibold text-gray-900">
              {profile.name}
            </h2>
            <p className="mt-1 break-all text-sm text-gray-500">
              {profile.email}
            </p>

            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              <ShieldCheck className="h-4 w-4" />
              {roleLabel}
            </span>

            <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Email verification</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {profile.emailVerified ? "Verified" : "Not verified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Account status</p>
                  <p className="mt-1 text-sm font-medium capitalize text-gray-800">
                    {profile.status.toLowerCase().replaceAll("_", " ")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Member since</p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {createdDate}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Update your name, phone number, and bio.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>
                <input
                  id="profile-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={100}
                  autoComplete="name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
                />
                <p className="mt-1.5 text-xs text-gray-400">
                  Email cannot be changed here.
                </p>
              </div>

              <div>
                <label
                  htmlFor="profile-phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    maxLength={30}
                    autoComplete="tel"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="profile-bio"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>
                <textarea
                  id="profile-bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  maxLength={500}
                  rows={4}
                  className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Tell us a little about yourself..."
                />
                <p className="mt-1 text-right text-xs text-gray-400">
                  {bio.length}/500
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setName(profile.name ?? "");
                    setPhone(profile.phone ?? "");
                    setBio(profile.bio ?? "");
                    setError("");
                    setNotice("");
                  }}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={saveMutation.isPending || imageMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saveMutation.isPending ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saveMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>

          {profile.role === "COURIER" && profile.courier && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Courier Information
                  </h2>
                  <p className="text-sm text-gray-500">
                    Your delivery account details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoItem
                  label="Employee ID"
                  value={profile.courier.employeeId}
                />
                <InfoItem
                  label="Vehicle type"
                  value={profile.courier.vehicleType}
                />
                <InfoItem
                  label="Vehicle number"
                  value={profile.courier.vehicleNumber}
                />
                <InfoItem
                  label="License number"
                  value={profile.courier.licenseNumber}
                />
                <InfoItem
                  label="Availability"
                  value={profile.courier.availabilityStatus}
                />
                <InfoItem
                  label="Total deliveries"
                  value={String(profile.courier.totalDeliveries)}
                />
                <InfoItem
                  label="Total earnings"
                  value={String(profile.courier.totalEarnings)}
                />
                <InfoItem
                  label="Rating"
                  value={String(profile.courier.rating)}
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-gray-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}
