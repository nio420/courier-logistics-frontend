"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Package,
  PanelLeft,
  Star,
  Truck,
  UserRound,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getCurrentUser, logoutUser } from "@/lib/api/auth";

const items = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Courier", href: "/admin/couriers", icon: Truck },
  { label: "Customer", href: "/admin/users", icon: Users },
  { label: "Hubs", href: "/admin/hubs", icon: Warehouse },
  { label: "Shipments", href: "/admin/shipments", icon: Package },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Review", href: "/admin/reviews", icon: Star },
  { label: "Profile", href: "/admin/profile", icon: UserRound },
];

export default function AdminDashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);

  useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 60_000,
  });

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
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawerMounted]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  const sidebarContent = (mobile = false) => (
    <aside className="flex h-full min-h-0 flex-col border-r border-slate-200 bg-white">
      {/* Sidebar Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-white p-5">
        <div className="min-w-0 flex-1">
          <p className="block text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Admin Portal
          </p>

          <h2 className="mt-2 block text-xl font-extrabold tracking-tight text-slate-900">
            Admin Workspace
          </h2>

          <p className="mt-2 text-sm text-slate-500">Manage your platform</p>
        </div>

        {mobile && (
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close admin navigation"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={22} />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <nav aria-label="Admin dashboard" className="space-y-1.5 pt-2">
          {items.map(({ label, href, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <Icon size={19} className="shrink-0" />

                <span className="min-w-0 flex-1">{label}</span>

                {active && <ChevronRight size={16} className="shrink-0" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="shrink-0 px-4 pb-4 pt-1">
        <Button
          type="button"
          variant="ghost"
          disabled={loggingOut}
          onClick={handleLogout}
          className="w-full justify-start gap-3 rounded-xl px-3 text-red-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={19} />
          {loggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open admin navigation"
          aria-expanded={mobileMenuOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 active:scale-95"
        >
          <PanelLeft size={25} strokeWidth={2} />
        </button>

        <Link
          href="/admin"
          className="min-w-0 truncate text-base font-bold text-slate-900"
        >
          Admin Portal
        </Link>
      </header>

      {/* Permanent Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-20 hidden w-65 border-r border-slate-200 bg-white lg:block">
        {sidebarContent()}
      </div>

      {/* Animated Mobile Drawer */}
      {drawerMounted && (
        <div
          className={`fixed inset-0 z-50 lg:hidden ${
            mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          {/* Backdrop */}
          <button
            type="button"
            tabIndex={mobileMenuOpen ? 0 : -1}
            aria-label="Close admin navigation backdrop"
            onClick={closeMenu}
            className={`absolute inset-0 h-full w-full bg-slate-950/50 transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${
              mobileMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Sliding Drawer */}
          <div
            className={`absolute inset-y-0 left-0 w-[min(300px,85vw)] max-w-full shadow-2xl transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {sidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
