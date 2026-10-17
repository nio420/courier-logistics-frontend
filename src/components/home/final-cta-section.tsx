"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Package,
  Sparkles,
  Truck,
} from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="relative isolate overflow-hidden px-5 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-12 lg:px-12 lg:pb-28 xl:px-16">
      {/* Ambient page glow */}
      <div className="pointer-events-none absolute left-1/4 top-0 -z-10 h-80 w-80 rounded-full bg-violet-300/25 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 -z-10 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-[120px]" />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-[#170e2c] shadow-[0_35px_100px_-25px_rgba(91,33,182,0.35)] sm:rounded-[2.75rem]">
          {/* Cinematic background image */}
          <div
            role="img"
            aria-label="Logistics warehouse filled with parcels ready for delivery"
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2200&q=90')",
            }}
          />

          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#160d2b]/95 via-[#24113f]/85 to-[#32145a]/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12091f]/75 via-transparent to-violet-950/20" />

          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-28 -top-32 h-[420px] w-[420px] rounded-full bg-violet-500/25 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[420px] w-[420px] rounded-full bg-fuchsia-500/20 blur-[110px]" />

          {/* Decorative rings */}
          <div className="pointer-events-none absolute -right-28 top-10 hidden h-[420px] w-[420px] rounded-full border border-white/10 lg:block" />
          <div className="pointer-events-none absolute -right-12 top-24 hidden h-[300px] w-[300px] rounded-full border border-white/[0.08] lg:block" />
          <div className="pointer-events-none absolute right-12 top-40 hidden h-[150px] w-[150px] rounded-full border border-white/[0.08] lg:block" />

          <div className="relative grid items-center gap-12 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1fr_340px] lg:gap-10 lg:px-16 lg:py-20 xl:gap-16 xl:px-20 xl:py-24">
            {/* Main message */}
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 shadow-lg backdrop-blur-xl">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-100 sm:text-xs">
                  Your next delivery starts here
                </span>
              </div>

              <h2 className="mt-7 text-4xl font-extrabold leading-[1.08] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                Your parcels.
                <span className="block">Your business.</span>
                <span className="mt-1 block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-200 bg-clip-text pb-2 text-transparent">
                  Moving forward.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-violet-100/80 sm:text-base sm:leading-8">
                Make every delivery feel simpler. Create your account to manage
                shipments, follow available tracking updates, and keep your
                delivery information organized in one place.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/register"
                  className="group relative inline-flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-7 py-4 text-sm font-bold text-white shadow-[0_15px_40px_-10px_rgba(168,85,247,0.65)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-10px_rgba(192,132,252,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-violet-950"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative">Create your account</span>
                  <ArrowRight className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>

                <Link
                  href="/contact"
                  className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl border border-white/25 bg-white/[0.08] px-6 py-4 text-sm font-bold text-white shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/[0.15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-violet-950"
                >
                  Talk to our team
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Trust details */}
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/15 pt-6 sm:gap-x-7">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-white/75 sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 text-violet-300" />
                  Convenient shipment management
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-medium text-white/75 sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 text-fuchsia-300" />
                  Shipment tracking tools
                </div>
              </div>
            </div>

            {/* Floating parcel composition */}
            <div className="relative mx-auto w-full max-w-[320px] lg:max-w-none">
              <div className="absolute inset-0 rounded-full bg-violet-400/20 blur-[70px]" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/[0.10] p-5 shadow-[0_25px_70px_-20px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200">
                      Delivery, simplified
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-white">
                      Ready when you are.
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-violet-200">
                    <Truck className="h-5 w-5" />
                  </div>
                </div>

                {/* Parcel illustration */}
                <div className="relative mt-6 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-violet-300/20 via-purple-200/10 to-fuchsia-300/20">
                  <div className="absolute h-48 w-48 rounded-full border border-white/10" />
                  <div className="absolute h-36 w-36 rounded-full border border-white/15" />
                  <div className="absolute h-24 w-24 rounded-full border border-white/15" />

                  <svg
                    viewBox="0 0 260 200"
                    fill="none"
                    className="absolute inset-0 h-full w-full"
                    aria-hidden="true"
                  >
                    <path
                      d="M25 145 C 55 145, 54 65, 105 65 S 175 145, 225 100"
                      stroke="url(#final-route-gradient)"
                      strokeWidth="2"
                      strokeDasharray="5 7"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="final-route-gradient"
                        x1="25"
                        y1="145"
                        x2="225"
                        y2="100"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#C4B5FD" />
                        <stop offset="1" stopColor="#F0ABFC" />
                      </linearGradient>
                    </defs>
                    <circle cx="25" cy="145" r="5" fill="#C4B5FD" />
                    <circle cx="225" cy="100" r="5" fill="#F0ABFC" />
                  </svg>

                  <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/40 bg-gradient-to-br from-white via-violet-50 to-fuchsia-100 text-violet-700 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] sm:h-32 sm:w-32">
                    <Package className="h-16 w-16 stroke-[1.35]" />
                    <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/80 bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-xl">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="absolute left-3 top-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-violet-100 backdrop-blur-xl">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div className="absolute bottom-4 right-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-fuchsia-100 backdrop-blur-xl">
                    <Truck className="h-5 w-5" />
                  </div>
                </div>

                {/* Bottom info */}
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/15 bg-black/10 p-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-violet-200">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">
                      Your delivery journey
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/60">
                      One place for your shipment details
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-violet-200" />
                </div>
              </div>

              {/* Floating accent badge */}
              <div className="absolute -right-2 top-20 flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white px-3.5 py-3 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.4)] sm:-right-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">
                    One simple process
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Start your journey
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gradient accent */}
          <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-400" />
        </div>

        <p className="mt-6 text-center text-xs leading-6 text-slate-500 sm:text-sm">
          Your next delivery journey starts with one simple step.
        </p>
      </div>
    </section>
  );
}
