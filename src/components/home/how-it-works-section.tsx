"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  PackageCheck,
  Sparkles,
  Truck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Book your shipment",
    description:
      "Enter your parcel details, pickup information, and delivery address to get started.",
    icon: Package,
    label: "Shipment created",
    detail: "Pickup and delivery details",
    color: "from-violet-600 to-purple-500",
  },
  {
    number: "02",
    title: "Follow every update",
    description:
      "Use your tracking number to check shipment status and review recorded progress.",
    icon: MapPin,
    label: "Journey in progress",
    detail: "Check recorded shipment updates",
    color: "from-purple-600 to-fuchsia-500",
  },
  {
    number: "03",
    title: "Receive your delivery",
    description:
      "Follow your parcel's journey through the delivery process until it reaches its destination.",
    icon: PackageCheck,
    label: "At your destination",
    detail: "Delivery status at a glance",
    color: "from-fuchsia-600 to-pink-500",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#fcfaff] via-white to-[#f7f3ff] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -left-40 top-40 -z-10 h-96 w-96 rounded-full bg-violet-200/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 -z-10 h-96 w-96 rounded-full bg-fuchsia-200/25 blur-[120px]" />

      <div className="mx-auto max-w-[1440px]">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-4 py-2 shadow-sm shadow-violet-100/70 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-violet-600" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-800 sm:text-xs">
              How it works
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-5xl xl:text-[3.5rem]">
            From your doorstep
            <span className="block bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
              to theirs. Made simple.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Three simple steps bring your shipment journey into focus, from
            booking and tracking to checking the final delivery status.
          </p>
        </div>

        {/* Real-world logistics visual */}
        <div className="relative mt-12 overflow-hidden rounded-[2rem] border border-white bg-white p-2 shadow-[0_25px_80px_-28px_rgba(109,40,217,0.25)] sm:mt-16 sm:rounded-[2.5rem] sm:p-3">
          <div
            role="img"
            aria-label="Courier and parcel delivery operations in a logistics warehouse"
            className="relative min-h-[310px] overflow-hidden rounded-[1.5rem] bg-slate-200 bg-cover bg-center sm:min-h-[400px] sm:rounded-[2rem] lg:min-h-[440px]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(25,12,48,0.86) 0%, rgba(40,20,70,0.64) 48%, rgba(40,20,70,0.12) 100%), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=90')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-950/20 via-transparent to-fuchsia-300/10" />

            <div className="relative grid min-h-[310px] items-center gap-8 p-6 sm:min-h-[400px] sm:p-10 lg:min-h-[440px] lg:grid-cols-[1fr_340px] lg:gap-12 lg:p-14">
              {/* Visual copy */}
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-xl sm:text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  A clearer way to deliver
                </div>

                <h3 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Every parcel.
                  <span className="block text-violet-200">
                    A clearer journey.
                  </span>
                </h3>

                <p className="mt-4 max-w-lg text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
                  Know the steps, understand the progress, and keep the
                  information you need close at hand.
                </p>

                <Link
                  href="/tracking"
                  className="group mt-7 inline-flex min-h-12 items-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-800 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-violet-50 hover:shadow-2xl"
                >
                  Explore shipment tracking
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Glass tracking preview — illustrative, not live data */}
              <div className="relative mx-auto w-full max-w-[340px]">
                <div className="absolute -inset-5 rounded-[2rem] bg-violet-300/20 blur-2xl" />

                <div className="relative rounded-[1.75rem] border border-white/30 bg-white/90 p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">
                        Shipment journey
                      </p>
                      <p className="mt-1 text-lg font-extrabold text-slate-950">
                        Three key steps
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
                      <Truck className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-0">
                    {steps.map((step, index) => {
                      const Icon = step.icon;

                      return (
                        <div
                          key={step.number}
                          className="relative flex gap-3 pb-5 last:pb-0"
                        >
                          {index < steps.length - 1 && (
                            <div className="absolute bottom-0 left-[17px] top-9 w-px bg-gradient-to-b from-violet-300 to-fuchsia-200" />
                          )}

                          <div
                            className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-white shadow-md`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1 pt-0.5">
                            <p className="text-sm font-bold text-slate-900">
                              {step.title}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {step.detail}
                            </p>
                          </div>

                          <span className="pt-1 text-[10px] font-bold tracking-wider text-slate-400">
                            {step.number}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50/80 px-3 py-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-600" />
                    <p className="text-xs font-semibold text-violet-900">
                      One straightforward delivery process
                    </p>
                  </div>
                </div>

                <div className="absolute -right-2 -top-4 flex items-center gap-2 rounded-xl border border-white/80 bg-white px-3 py-2.5 shadow-xl sm:-right-5">
                  <Clock3 className="h-4 w-4 text-violet-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Updates at a glance
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three-step journey */}
        <div className="relative mt-12 sm:mt-16">
          {/* Connecting route on larger screens */}
          <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-[37px] hidden h-px bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-300 md:block" />

          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group relative rounded-[1.75rem] border border-white/90 bg-white/85 p-6 shadow-[0_15px_45px_-28px_rgba(109,40,217,0.25)] backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-violet-200 hover:shadow-[0_25px_60px_-25px_rgba(109,40,217,0.35)] sm:p-8"
                >
                  {/* Step icon and number */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`relative z-10 flex h-[74px] w-[74px] items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${step.color} text-white shadow-[0_12px_28px_-10px_rgba(109,40,217,0.55)] transition duration-500 group-hover:rotate-[-4deg] group-hover:scale-105`}
                    >
                      <div className="absolute inset-1 rounded-[1.2rem] border border-white/25" />
                      <Icon className="relative h-7 w-7" />
                    </div>

                    <span className="text-4xl font-black tracking-[-0.06em] text-violet-100 transition-colors duration-300 group-hover:text-violet-200 sm:text-5xl">
                      {step.number}
                    </span>
                  </div>

                  {/* Step label */}
                  <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50/80 px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-violet-800">
                      Step {index + 1}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-extrabold tracking-tight text-slate-950 transition-colors duration-300 group-hover:text-violet-800 sm:text-2xl">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>

                  <div className="mt-7 flex items-center justify-between border-t border-violet-100/80 pt-5">
                    <span className="text-xs font-semibold text-slate-500">
                      {step.label}
                    </span>

                    {index < steps.length - 1 ? (
                      <ArrowRight className="h-4 w-4 text-violet-500 transition-transform duration-300 group-hover:translate-x-1" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-fuchsia-500" />
                    )}
                  </div>

                  <div
                    className={`absolute bottom-0 left-7 right-7 h-1 origin-left scale-x-0 rounded-full bg-gradient-to-r ${step.color} transition-transform duration-500 group-hover:scale-x-100`}
                  />
                </article>
              );
            })}
          </div>
        </div>

        {/* Closing note */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:mt-12 sm:flex-row">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-100 bg-white text-violet-600 shadow-sm">
            <ArrowDownRight className="h-4 w-4" />
          </div>
          <p className="text-sm leading-6 text-slate-600">
            Ready to get started?{" "}
            <Link
              href="/register"
              className="font-bold text-violet-700 underline decoration-violet-300 underline-offset-4 transition hover:text-fuchsia-600"
            >
              Create your account
            </Link>{" "}
            and begin your delivery journey.
          </p>
        </div>
      </div>
    </section>
  );
}
