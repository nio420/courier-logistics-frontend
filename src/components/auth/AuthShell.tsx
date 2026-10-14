import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthShellProps {
  children: ReactNode;
  title: string;
  description: string;
  badge: string;
}

export default function AuthShell({
  children,
  title,
  description,
  badge,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.35),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.3),transparent_35%),linear-gradient(135deg,#020617,#0f172a_55%,#172554)]" />

          <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/30">
                <Truck className="h-5 w-5" />
              </span>
              Courier
              <span className="text-blue-300">Logistics</span>
            </Link>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-100 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Smart logistics platform
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-6xl">
                Everything you need to move
                <span className="text-blue-300"> smarter.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 xl:text-lg">
                Manage shipments, track deliveries, connect with couriers, and
                keep every delivery moving from one secure platform.
              </p>

              <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <ShieldCheck className="h-5 w-5 text-blue-300" />
                  <p className="mt-3 text-sm font-semibold text-white">
                    Secure
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Protected account
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <Clock3 className="h-5 w-5 text-blue-300" />
                  <p className="mt-3 text-sm font-semibold text-white">
                    Real-time
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Shipment tracking
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <CheckCircle2 className="h-5 w-5 text-blue-300" />
                  <p className="mt-3 text-sm font-semibold text-white">
                    Reliable
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Delivery management
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-500">© 2026 Courier Logistics</p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-white px-5 py-10 sm:px-8 lg:min-h-0 lg:px-12 xl:px-20">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-10 flex items-center justify-center gap-2 text-xl font-bold tracking-tight text-slate-950 lg:hidden"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Truck className="h-5 w-5" />
              </span>
              Courier
              <span className="text-blue-600">Logistics</span>
            </Link>

            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                {badge}
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>

            {children}

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              Your account information is securely protected.
            </div>

            <Link
              href="/"
              className="group mt-6 flex items-center justify-center gap-1 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              Back to home
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
