"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  PackageCheck,
  Radar,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

const trackingFeatures = [
  {
    icon: Radar,
    label: "Live tracking",
  },
  {
    icon: Clock3,
    label: "Delivery updates",
  },
  {
    icon: ShieldCheck,
    label: "Secure shipping",
  },
];

export default function TrackingCTA() {
  return (
    <section className="relative mx-auto max-w-[1440px] overflow-hidden px-5 pb-10 pt-8 sm:px-8 sm:pb-14 sm:pt-12 lg:px-12 xl:px-16">
      {/* Ambient background lighting */}
      <div className="pointer-events-none absolute left-1/4 top-10 -z-10 h-64 w-64 rounded-full bg-violet-300/30 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-10 -z-10 h-64 w-64 rounded-full bg-fuchsia-200/35 blur-[100px]" />

      {/* Main tracking card */}
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/90 bg-gradient-to-br from-white via-[#faf7ff] to-[#eee7ff] shadow-[0_25px_80px_-25px_rgba(109,40,217,0.22)] sm:rounded-[2.5rem]">
        {/* Decorative gradient layers */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(196,181,253,0.4),transparent_50%)]" />
        <div className="pointer-events-none absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full border border-violet-300/25" />
        <div className="pointer-events-none absolute -right-8 -top-16 -z-10 h-56 w-56 rounded-full border border-purple-300/25" />
        <div className="pointer-events-none absolute -bottom-32 left-[40%] -z-10 h-64 w-64 rounded-full bg-violet-200/25 blur-3xl" />

        <div className="grid items-center gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:gap-12 lg:p-12 xl:p-14">
          {/* Left content */}
          <div className="relative z-10">
            {/* Eyebrow */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/75 px-4 py-2 shadow-sm shadow-violet-100/70 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-violet-800 sm:text-xs">
                Your delivery, in focus
              </span>
            </div>

            <h2 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-5xl xl:text-[3.5rem]">
              Every parcel has a story.
              <br className="hidden sm:block" />{" "}
              <span className="bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                See where yours is.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Waiting for a delivery? Get closer to your parcel with shipment
              tracking, delivery updates, and a clearer view of its journey.
            </p>

            {/* Feature pills */}
            <div className="mt-7 flex flex-wrap gap-2.5">
              {trackingFeatures.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/70 px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-lg sm:text-sm"
                >
                  <Icon className="h-4 w-4 text-violet-600" />
                  {label}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/tracking"
                className="group relative inline-flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-600 px-7 py-4 text-sm font-bold text-white shadow-[0_12px_35px_-8px_rgba(124,58,237,0.55)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_-8px_rgba(124,58,237,0.55)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <MapPin className="relative h-5 w-5" />
                <span className="relative">Track my shipment</span>
                <ArrowRight className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Simple, convenient shipment tracking
              </span>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative mx-auto w-full max-w-[310px] lg:w-[280px] xl:w-[310px]">
            {/* Glowing backdrop */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-violet-300/60 via-purple-200/40 to-fuchsia-200/50 blur-3xl" />

            {/* Illustration frame */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/90 bg-white/55 p-5 shadow-[0_20px_60px_-20px_rgba(109,40,217,0.25)] backdrop-blur-xl sm:p-6">
              <div className="relative flex aspect-[4/4.5] flex-col items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-violet-100 via-[#f8f4ff] to-fuchsia-100">
                {/* Decorative rings */}
                <div className="absolute h-48 w-48 rounded-full border border-violet-300/30" />
                <div className="absolute h-36 w-36 rounded-full border border-violet-300/30" />
                <div className="absolute h-24 w-24 rounded-full border border-white/80 bg-white/30" />

                {/* Route decoration */}
                <svg
                  viewBox="0 0 240 250"
                  fill="none"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <path
                    d="M42 170 C 30 100, 105 110, 120 70 S 205 70, 198 130"
                    stroke="url(#route-gradient)"
                    strokeWidth="2.5"
                    strokeDasharray="5 7"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="route-gradient"
                      x1="42"
                      y1="170"
                      x2="198"
                      y2="70"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#8B5CF6" />
                      <stop offset="1" stopColor="#D946EF" />
                    </linearGradient>
                  </defs>
                  <circle cx="42" cy="170" r="5" fill="#8B5CF6" />
                  <circle cx="198" cy="130" r="5" fill="#C026D3" />
                </svg>

                {/* Parcel icon */}
                <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/90 bg-gradient-to-br from-white to-violet-50 text-violet-700 shadow-[0_20px_45px_-15px_rgba(109,40,217,0.3)] sm:h-32 sm:w-32">
                  <Package className="h-16 w-16 stroke-[1.4]" />
                  <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-white bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-300/50">
                    <PackageCheck className="h-5 w-5" />
                  </div>
                </div>

                {/* Floating location markers */}
                <div className="absolute left-4 top-6 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/90 bg-white/90 text-violet-600 shadow-lg">
                  <MapPin className="h-5 w-5" />
                </div>

                <div className="absolute bottom-7 right-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/90 bg-white/90 text-fuchsia-600 shadow-lg">
                  <Truck className="h-5 w-5" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/90 bg-white/85 px-3 py-2.5 shadow-lg backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      Your parcel journey
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-violet-600" />
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-violet-100">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating status badge */}
            <div className="absolute -right-3 top-10 flex items-center gap-2.5 rounded-2xl border border-white/90 bg-white/95 px-3.5 py-3 shadow-[0_12px_35px_-12px_rgba(109,40,217,0.3)] backdrop-blur-xl sm:-right-7">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Easy to track
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  Stay informed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative accent */}
        <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-400" />
      </div>
    </section>
  );
}
