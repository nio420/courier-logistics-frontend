"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShieldCheck,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { getCurrentUser } from "@/lib/api/auth";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Tracking", href: "/tracking" },
  { label: "Contact", href: "/contact" },
];

type UserWithOptionalAvatar = {
  profileImage?: string | null;
  image?: string | null;
  avatar?: string | null;
  avatarUrl?: string | null;
  profilePicture?: string | null;
  photoURL?: string | null;
};

function getUserAvatar(user: unknown): string | undefined {
  if (!user || typeof user !== "object") {
    return undefined;
  }

  const profile = user as UserWithOptionalAvatar;

  const avatarUrl = [
    profile.profileImage,
    profile.image,
    profile.avatar,
    profile.avatarUrl,
    profile.profilePicture,
    profile.photoURL,
  ].find(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );

  return avatarUrl?.trim();
}

function ProfileAvatar({
  avatarUrl,
  avatarFailed,
  onAvatarError,
  name,
  size = "normal",
}: {
  avatarUrl?: string;
  avatarFailed: boolean;
  onAvatarError: () => void;
  name?: string;
  size?: "normal" | "large";
}) {
  const isLarge = size === "large";

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 text-white ${
        isLarge ? "size-12 rounded-2xl" : "size-9"
      }`}
    >
      {avatarUrl && !avatarFailed ? (
        <img
          src={avatarUrl}
          alt={`${name || "User"} profile`}
          referrerPolicy="no-referrer"
          onError={onAvatarError}
          className="h-full w-full object-cover"
        />
      ) : isLarge ? (
        <CircleUserRound size={27} />
      ) : (
        <UserRound size={19} />
      )}
    </span>
  );
}

export default function PublicNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const { data: user, isPending } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    enabled: !loggingOut,
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const isAuthenticated = Boolean(user) && !loggingOut;
  const currentUser = isAuthenticated ? user : undefined;

  const avatarUrl = getUserAvatar(currentUser);

  const dashboardPath =
    currentUser?.role === "ADMIN"
      ? "/admin"
      : currentUser?.role === "COURIER"
        ? "/courier"
        : "/dashboard";

  const profilePath =
    currentUser?.role === "ADMIN"
      ? "/admin/profile"
      : currentUser?.role === "COURIER"
        ? "/courier/profile"
        : "/dashboard/profile";

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    setAvatarFailed(false);
  }, [avatarUrl]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setProfileOpen(false);
    setMenuOpen(false);

    try {
      const response = await fetch("/api/auth/session", {
        method: "DELETE",
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to clear the local session.");
      }

      queryClient.clear();

      try {
        await logout();
      } catch (error) {
        console.error("Backend logout failed:", error);
      }

      window.location.replace("/login");
    } catch (error) {
      console.error("Navbar logout failed:", error);
      setLoggingOut(false);
    }
  }

  function closeMenus() {
    setMenuOpen(false);
    setProfileOpen(false);
  }

  function isActiveLink(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 shadow-sm shadow-slate-900/3 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
      >
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMenus}
          className="group flex min-w-0 shrink-0 items-center gap-2.5"
          aria-label="CourierPro home"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/20 transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <Truck size={23} strokeWidth={2.2} />
          </span>

          <span className="text-[21px] font-extrabold tracking-tight text-slate-900">
            Courier<span className="text-blue-600">Pro</span>
            <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Delivery simplified
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => {
            const active = isActiveLink(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                }`}
              >
                {item.label}

                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop authentication */}
        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          {isPending && !loggingOut ? (
            <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />
          ) : isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-label="Open account menu"
                aria-expanded={profileOpen}
                className={`flex items-center gap-2.5 rounded-2xl border p-1.5 pr-3 transition ${
                  profileOpen
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                }`}
              >
                <ProfileAvatar
                  avatarUrl={avatarUrl}
                  avatarFailed={avatarFailed}
                  onAvatarError={() => setAvatarFailed(true)}
                  name={currentUser?.name}
                />

                <span className="max-w-28 text-left">
                  <span className="block max-w-28 truncate text-xs font-bold text-slate-800">
                    {currentUser?.name || "My Account"}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-medium capitalize text-slate-500">
                    {currentUser?.role?.toLowerCase() || "customer"}
                  </span>
                </span>

                <ChevronDown
                  size={15}
                  className={`text-slate-400 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
                  <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-5 text-white">
                    <div className="flex items-center gap-3">
                      <ProfileAvatar
                        avatarUrl={avatarUrl}
                        avatarFailed={avatarFailed}
                        onAvatarError={() => setAvatarFailed(true)}
                        name={currentUser?.name}
                        size="large"
                      />

                      <div className="min-w-0">
                        <p className="truncate font-bold">
                          {currentUser?.name || "Welcome back"}
                        </p>
                        <p className="mt-1 truncate text-xs text-blue-100">
                          {currentUser?.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
                      <ShieldCheck size={13} />
                      {currentUser?.role || "Customer"}
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href={dashboardPath}
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                      <ArrowRight size={15} className="ml-auto" />
                    </Link>

                    <Link
                      href={profilePath}
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <UserRound size={18} />
                      My Profile
                    </Link>

                    <Link
                      href="/tracking"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Package size={18} />
                      Track a Parcel
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 p-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <LogOut size={18} />
                      {loggingOut ? "Logging out..." : "Log Out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-blue-700"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/25"
              >
                Get Started
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 xl:hidden"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer: clipped so the closed panel cannot cause horizontal overflow */}
      <div
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[60] overflow-hidden xl:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <button
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-slate-950/40 transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Drawer */}
        <aside
          aria-label="Mobile navigation drawer"
          className={`absolute inset-y-0 right-0 flex h-dvh max-h-dvh min-h-0 w-[min(340px,88vw)] max-w-full flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer header */}
          <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-100 px-5">
            <span className="text-lg font-extrabold text-slate-900">Menu</span>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation"
              className="flex size-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X size={22} />
            </button>
          </div>

          {/* Drawer content */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-5 pt-5">
            {/* Public navigation stays at the top */}
            <nav
              aria-label="Mobile main navigation"
              className="flex shrink-0 flex-col gap-1.5"
            >
              {navItems.map((item) => {
                const active = isActiveLink(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenus}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? "border-blue-100 bg-blue-50 text-blue-700"
                        : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                    }`}
                  >
                    {item.label}

                    {active && (
                      <span className="ml-auto size-2 rounded-full bg-blue-600" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Account section stays at the bottom */}
            {isAuthenticated ? (
              <div className="mt-auto shrink-0 pt-5">
                <div className="mb-3 border-t border-slate-200" />

                <nav
                  aria-label="Mobile account navigation"
                  className="flex flex-col gap-1.5"
                >
                  <Link
                    href={dashboardPath}
                    onClick={closeMenus}
                    aria-current={
                      pathname === dashboardPath ||
                      pathname.startsWith(`${dashboardPath}/`)
                        ? "page"
                        : undefined
                    }
                    className={`flex min-h-11 items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                      pathname === dashboardPath ||
                      pathname.startsWith(`${dashboardPath}/`)
                        ? "border-blue-100 bg-blue-50 text-blue-700"
                        : "border-transparent text-slate-700 hover:bg-slate-50 hover:text-blue-700"
                    }`}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <Link
                    href={profilePath}
                    onClick={closeMenus}
                    aria-current={
                      pathname === profilePath ||
                      pathname.startsWith(`${profilePath}/`)
                        ? "page"
                        : undefined
                    }
                    className={`flex min-h-11 items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                      pathname === profilePath ||
                      pathname.startsWith(`${profilePath}/`)
                        ? "border-blue-100 bg-blue-50 text-blue-700"
                        : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                    }`}
                  >
                    <UserRound size={18} />
                    My Profile
                  </Link>

                  <Link
                    href="/tracking"
                    onClick={closeMenus}
                    aria-current={
                      pathname === "/tracking" ||
                      pathname.startsWith("/tracking/")
                        ? "page"
                        : undefined
                    }
                    className={`flex min-h-11 items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                      pathname === "/tracking" ||
                      pathname.startsWith("/tracking/")
                        ? "border-blue-100 bg-blue-50 text-blue-700"
                        : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Package size={18} />
                    Track a Parcel
                  </Link>
                </nav>

                <div className="mt-3 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LogOut size={18} />
                    {loggingOut ? "Logging out..." : "Log Out"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-auto grid shrink-0 grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                <Link
                  href="/login"
                  onClick={closeMenus}
                  className="flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenus}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-700 px-3 py-3 text-sm font-bold text-white transition hover:shadow-md"
                >
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </header>
  );
}
