"use client";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Building2,
  CheckCircle2,
  Clock3,
  Headphones,
  MapPin,
  Package,
  PackageCheck,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    number: "01",
    icon: Package,
    title: "Parcel Delivery",
    description:
      "Send parcels to friends, family, and customers with a convenient delivery experience and shipment tracking.",
    features: [
      "Easy shipment booking",
      "Real-time tracking",
      "Delivery updates",
    ],
    accent: "bg-violet-100 text-violet-700",
  },
  {
    number: "02",
    icon: Zap,
    title: "Express Shipping",
    description:
      "For time-sensitive deliveries, choose an express-focused service designed to keep your shipments moving.",
    features: [
      "Priority handling",
      "Shipment visibility",
      "Status notifications",
    ],
    accent: "bg-amber-100 text-amber-700",
  },
  {
    number: "03",
    icon: Building2,
    title: "Business Logistics",
    description:
      "Manage business deliveries with a streamlined workflow for shipments, customers, and payment records.",
    features: [
      "Centralized shipment records",
      "Payment tracking",
      "Scalable workflow",
    ],
    accent: "bg-blue-100 text-blue-700",
  },
  {
    number: "04",
    icon: Truck,
    title: "Courier Assignment",
    description:
      "Connect shipments with available couriers through an organized assignment and delivery workflow.",
    features: ["Courier assignment", "Delivery progress", "Status management"],
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    number: "05",
    icon: MapPin,
    title: "Shipment Tracking",
    description:
      "Follow your parcel journey and check recorded shipment updates without guessing where your package is.",
    features: ["Tracking lookup", "Shipment timeline", "Delivery status"],
    accent: "bg-rose-100 text-rose-700",
  },
  {
    number: "06",
    icon: PackageCheck,
    title: "Delivery Confirmation",
    description:
      "Keep delivery records organized with shipment status updates and proof-of-delivery information.",
    features: ["Delivery records", "Status confirmation", "Organized history"],
    accent: "bg-indigo-100 text-indigo-700",
  },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Reliable processes",
    description:
      "Structured shipment workflows help keep delivery information organized.",
  },
  {
    icon: Clock3,
    title: "Clear visibility",
    description: "Follow shipment progress through recorded tracking updates.",
  },
  {
    icon: Headphones,
    title: "Support when needed",
    description:
      "Find help for shipment questions and platform-related concerns.",
  },
];

export default function ServicesContent() {
  return (
    <main className="overflow-hidden bg-white">
      {/* Hero */}
      <section className="relative isolate bg-slate-950">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.27),transparent_50%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-violet-200">
              <Boxes className="h-4 w-4" />
              Delivery solutions for every journey
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Logistics made
              <span className="block text-violet-400">simple and clear.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              From everyday parcels to business deliveries, manage your
              shipments through one streamlined courier platform.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/40"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
              >
                Talk to our team
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-violet-400" />
                Shipment visibility
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-violet-400" />
                Organized workflows
              </span>
            </div>
          </div>

          {/* Decorative shipment card */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 rounded-[2rem] bg-violet-500/10 blur-2xl" />

            <div className="relative rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">Shipment overview</p>
                  <h2 className="mt-1 text-lg font-semibold text-white">
                    Your delivery journey
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
                  <Package className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400">Tracking reference</p>
                    <p className="mt-1 font-semibold text-white">SHP-2048</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                    In transit
                  </span>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
                      <PackageCheck className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        Shipment created
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Shipment details recorded
                      </p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>

                  <div className="ml-4 h-5 border-l border-dashed border-violet-400/60" />

                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        On the way
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Follow your shipment updates
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-violet-300" />
                  </div>

                  <div className="ml-4 h-5 border-l border-dashed border-slate-600" />

                  <div className="flex gap-3 opacity-60">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-300">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Delivered
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Final delivery confirmation
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                Illustrative tracking preview — sample data only.
              </p>
            </div>

            <div className="absolute -right-2 -top-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 text-violet-300 shadow-xl sm:-right-5">
              <Zap className="h-5 w-5" />
            </div>
            <div className="absolute -bottom-4 -left-2 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-800 text-emerald-300 shadow-xl sm:-left-5">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
              What we offer
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Services built around your deliveries
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Explore the tools and workflows designed to make shipment
              management more convenient.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex w-fit shrink-0 items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
          >
            Ask us a question
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.number}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-slate-200/60 sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${service.accent}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">
                    {service.number}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {service.description}
                </p>

                <ul className="mt-5 space-y-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-slate-600"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-7">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 transition group-hover:text-violet-700"
                  >
                    Get started
                    <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-slate-100 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
              The experience
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              More clarity at every step
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Keep your shipment information organized from booking to delivery
              confirmation.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-violet-700 px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/15" />
          <div className="absolute -bottom-28 right-20 h-64 w-64 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-200">
                Ready to get started?
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Your next delivery starts here.
              </h2>
              <p className="mt-4 text-sm leading-7 text-violet-100 sm:text-base">
                Create your account and explore a more organized way to manage
                your shipments.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                Create an account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
