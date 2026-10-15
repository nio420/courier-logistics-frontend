"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  PanelLeft,
  Star,
  Truck,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutUser } from "@/lib/api/auth";

const navigation = [
  { label: "Overview", href: "/courier", icon: LayoutDashboard },
  { label: "Assignments", href: "/courier/assignments", icon: ClipboardList },
  { label: "Deliveries", href: "/courier/deliveries", icon: PackageCheck },
  { label: "Earnings", href: "/courier/earnings", icon: Wallet },
  { label: "Reviews", href: "/courier/reviews", icon: Star },
  { label: "Profile", href: "/courier/profile", icon: UserRound },
];

export default function CourierDashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      setDrawerMounted(true);
      return;
    }

    if (!drawerMounted) return;

    const timeout = window.setTimeout(() => {
      setDrawerMounted(false);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [mobileMenuOpen, drawerMounted]);

  useEffect(() => {
    if (!drawerMounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawerMounted]);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      // Clear the local session first.
      const response = await fetch("/api/auth/session", {
        method: "DELETE",
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to clear the local session.");
      }

      // Clear cached user and dashboard data.
      queryClient.clear();
      setMobileMenuOpen(false);

      // Attempt backend logout without blocking navigation.
      void logoutUser().catch((error) => {
        console.error("Backend logout failed:", error);
      });

      // Fully navigate to login.
      window.location.replace("/login");
    } catch (error) {
      console.error("Admin logout failed:", error);
      setLoggingOut(false);
    }
  }

  const isActive = (href: string) =>
    href === "/courier"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const sidebarContent = (mobile = false) => (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex h-[72px] shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5">
        <Link
          href="/courier"
          onClick={closeMenu}
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Truck size={22} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-bold text-slate-900">
              Courier Portal
            </p>
            <p className="text-xs text-slate-500">Delivery workspace</p>
          </div>
        </Link>

        {mobile && (
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close navigation"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={22} />
          </button>
        )}
      </div>

      <nav
        aria-label="Courier navigation"
        className="flex-1 space-y-1 overflow-y-auto p-3"
      >
        <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        {navigation.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={19} className="shrink-0" />
              <span className="min-w-0 break-words">{label}</span>
            </Link>
          );
        })}

        {/* Logout now appears directly below the navigation items */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          <LogOut size={19} className="shrink-0" />
          <span>{loggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile and tablet top bar */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation"
          aria-expanded={mobileMenuOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-700 transition-colors duration-200 hover:bg-slate-100"
        >
          <PanelLeft size={23} strokeWidth={1.8} />
        </button>

        <Link href="/courier" className="flex min-w-0 items-center gap-2">
          <Truck size={21} className="shrink-0 text-blue-600" />
          <span className="truncate font-bold text-slate-900">
            Courier Portal
          </span>
        </Link>
      </header>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[260px] border-r border-slate-200 bg-white lg:block">
        {sidebarContent()}
      </aside>

      {/* Animated mobile and tablet drawer */}
      {drawerMounted && (
        <div
          className={`fixed inset-0 z-50 lg:hidden ${
            mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <button
            type="button"
            tabIndex={mobileMenuOpen ? 0 : -1}
            aria-label="Close navigation backdrop"
            onClick={closeMenu}
            className={`absolute inset-0 h-full w-full bg-slate-950/50 transition-opacity duration-300 ease-in-out ${
              mobileMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          />

          <aside
            className={`absolute inset-y-0 left-0 flex w-[min(300px,85vw)] max-w-full flex-col shadow-2xl transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {sidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
