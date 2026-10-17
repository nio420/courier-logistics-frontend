"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const benefits = [
  {
    icon: Globe2,
    title: "Connected delivery journey",
    description:
      "Keep shipment details and tracking information together in one convenient platform.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by design",
    description:
      "Access your account and shipment information through a dedicated platform.",
  },
  {
    icon: Clock3,
    title: "Updates when you need them",
    description:
      "Check shipment history and review the latest recorded delivery events.",
  },
];

export default function AboutSection() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#f8f5ff] via-white to-[#fcfaff] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 h-96 w-96 rounded-full bg-violet-200/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-fuchsia-200/25 blur-[120px]" />

      <div className="mx-auto grid max-w-[1440px] items-center gap-14 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        {/* Image composition */}
        <div className="relative mx-auto w-full max-w-[620px] lg:mx-0">
          <div className="absolute -left-5 -top-5 h-32 w-32 rounded-[2rem] border border-violet-300/50 sm:-left-7 sm:-top-7 sm:h-40 sm:w-40" />

          <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-violet-300/25 blur-[70px]" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/90 bg-white p-2.5 shadow-[0_30px_80px_-28px_rgba(109,40,217,0.30)] sm:rounded-[2.5rem] sm:p-3">
            <div
              role="img"
              aria-label="Logistics team working with shipping packages"
              className="relative min-h-[360px] overflow-hidden rounded-[1.5rem] bg-violet-100 bg-cover bg-center sm:min-h-[480px] sm:rounded-[2rem] lg:min-h-[530px]"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(30,15,55,0.02) 20%, rgba(30,15,55,0.78) 100%), url('https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1400&q=90')",
              }}
            >
              {/* Image tint */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-violet-950/20 via-transparent to-fuchsia-300/15" />

              {/* Top label */}
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-xl sm:left-7 sm:top-7 sm:text-xs">
                <Sparkles className="h-4 w-4 text-fuchsia-200" />
                Built for clarity
              </div>

              {/* Bottom glass panel */}
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/25 bg-white/15 p-5 text-white shadow-2xl backdrop-blur-xl sm:bottom-7 sm:left-7 sm:right-7 sm:rounded-3xl sm:p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200 sm:text-xs">
                  A simpler way to ship
                </p>

                <h3 className="mt-3 max-w-md text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                  Every important update,
                  <span className="block text-violet-200">easier to find.</span>
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-white/80">
                  Keep your parcel information organized and follow its journey
                  from one convenient place.
                </p>
              </div>
            </div>
          </div>

          {/* Floating information card */}
          <div className="relative mx-auto mt-4 w-full max-w-[320px] rounded-2xl border border-white/90 bg-white/90 p-4 shadow-[0_18px_50px_-20px_rgba(109,40,217,0.28)] backdrop-blur-xl sm:absolute sm:-bottom-7 sm:-right-3 sm:mt-0 sm:w-64 sm:p-5 md:-right-5 lg:-right-7">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <p className="font-bold text-slate-900">A clearer overview</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Shipment details and available updates together.
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-1.5">
              <span className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-500" />
              <span className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-400" />
              <span className="h-1.5 flex-1 rounded-full bg-violet-100" />
            </div>
          </div>
        </div>

        {/* About content */}
        <div className="pt-2 lg:py-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-4 py-2 shadow-sm shadow-violet-100/60 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-violet-600" />
            <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-violet-800 sm:text-xs">
              A better delivery experience
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-5xl xl:text-[3.5rem]">
            Less uncertainty.
            <span className="mt-1 block bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
              More control over every shipment.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Shipping should not feel complicated. Our platform brings essential
            shipment information into one accessible place, helping you
            understand your parcel&apos;s progress without unnecessary steps.
          </p>

          {/* Benefits */}
          <div className="mt-9 space-y-4 sm:mt-10 sm:space-y-5">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="group flex gap-4 rounded-2xl border border-transparent p-3 transition duration-300 hover:border-violet-100 hover:bg-white/80 hover:shadow-[0_12px_35px_-22px_rgba(109,40,217,0.35)] sm:gap-5 sm:p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 text-violet-700 shadow-sm transition duration-300 group-hover:scale-105 group-hover:border-violet-200 group-hover:from-violet-600 group-hover:to-fuchsia-500 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="pt-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 transition-colors group-hover:text-violet-800 sm:text-base">
                        {benefit.title}
                      </h3>

                      <span className="text-[10px] font-bold tracking-widest text-violet-300">
                        0{index + 1}
                      </span>
                    </div>

                    <p className="mt-1.5 max-w-lg text-sm leading-6 text-slate-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-4 sm:mt-9 sm:flex-row sm:items-center">
            <Link
              href="/about"
              className="group inline-flex min-h-14 w-fit items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-600 px-6 py-4 text-sm font-bold text-white shadow-[0_12px_35px_-10px_rgba(124,58,237,0.5)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_-10px_rgba(124,58,237,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              Get to know us
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>

            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 sm:text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Simple. Organized. Convenient.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
