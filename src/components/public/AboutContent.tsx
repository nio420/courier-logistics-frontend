"use client";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Globe2,
  Package,
  PackageCheck,
  ShieldCheck,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    number: "01",
    icon: Package,
    title: "Effortless shipping",
    description:
      "Create shipments, manage delivery details, and keep everything organized from one place.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    number: "02",
    icon: Truck,
    title: "Smarter deliveries",
    description:
      "Give couriers a dedicated workspace to manage assignments and keep deliveries moving.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Reliable management",
    description:
      "Provide administrators with tools to oversee users, shipments, payments, and operations.",
    color: "bg-emerald-50 text-emerald-600",
  },
];

const principles = [
  {
    icon: Globe2,
    title: "Everything connected",
    description:
      "Bring customers, couriers, and administrators together in one platform.",
  },
  {
    icon: Clock3,
    title: "Clear shipment progress",
    description:
      "Make shipment information and delivery progress easier to follow.",
  },
  {
    icon: Zap,
    title: "Simple workflows",
    description:
      "Reduce unnecessary complexity with organized dashboards and focused actions.",
  },
];

export default function AboutContent() {
  return (
    <main className="overflow-hidden bg-white text-slate-900">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-slate-950">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.22),transparent_48%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.14),transparent_45%)]" />

        <div className="absolute -right-24 top-16 -z-10 h-72 w-72 rounded-full border border-white/10 sm:h-96 sm:w-96" />
        <div className="absolute -right-12 top-28 -z-10 h-56 w-56 rounded-full border border-white/10 sm:h-72 sm:w-72" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-orange-300 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              About our platform
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Moving parcels.
              <br />
              <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                Connecting people.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              We bring customers, couriers, and administrators together to make
              shipment management more organized, transparent, and convenient.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore platform
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Role-based dashboards
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Shipment tracking
              </span>
            </div>
          </div>

          {/* Decorative shipment illustration */}
          <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
            <div className="absolute inset-8 rounded-full bg-orange-500/15 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 px-2 pb-5">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Delivery overview
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    One connected workflow
                  </p>
                </div>
                <div className="rounded-xl bg-orange-500/15 p-3 text-orange-400">
                  <PackageCheck className="h-6 w-6" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-5">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
                    <Users className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-slate-300">
                    Customers
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Create and track shipments
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300">
                    <Truck className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-slate-300">
                    Couriers
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Manage assigned deliveries
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">
                      Shipment workflow
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      From creation to delivery
                    </p>
                  </div>
                  <ArrowDownRight className="h-5 w-5 text-orange-400" />
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-orange-400" />
                  <div className="h-1.5 flex-1 rounded-full bg-orange-400/60" />
                  <div className="h-1.5 flex-1 rounded-full bg-white/15" />
                  <div className="h-1.5 flex-1 rounded-full bg-white/10" />
                </div>

                <div className="mt-3 flex justify-between text-[11px] text-slate-400">
                  <span>Create</span>
                  <span>Manage</span>
                  <span>Track</span>
                  <span>Deliver</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl bg-emerald-400/10 px-4 py-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <p className="text-xs leading-5 text-emerald-100">
                  A more connected delivery experience starts here.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-2 hidden rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 shadow-xl sm:flex sm:items-center sm:gap-3">
              <div className="rounded-xl bg-emerald-400/10 p-2 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Role-based access
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Designed around each role
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Why we built it
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Delivery management, without the unnecessary complexity.
            </h2>
          </div>

          <div>
            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              Managing deliveries involves multiple people, information, and
              steps. Our platform brings those workflows into a single organized
              experience, helping each user focus on what matters most.
            </p>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Whether someone is arranging a shipment, handling a delivery, or
              overseeing operations, each role has a dedicated space to work
              with the information and tools relevant to them.
            </p>

            <div className="mt-7 h-1 w-24 rounded-full bg-gradient-to-r from-orange-500 to-amber-300" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              One platform, three roles
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything has its place.
            </h2>
            <p className="mt-5 leading-7 text-slate-600">
              A dedicated experience for every part of the delivery process.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3 lg:mt-16">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-200/60 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color}`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="text-sm font-semibold tracking-widest text-slate-300">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-8 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-3 min-h-20 leading-7 text-slate-600">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-500 transition group-hover:text-orange-600">
                    Built for your workflow
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>

                  <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-orange-50 opacity-0 blur-2xl transition group-hover:opacity-100" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Our approach
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Built around clarity, connection, and control.
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              Good logistics software should make complex operations easier to
              understand. We focus on straightforward workflows, relevant
              information, and a consistent experience across the platform.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-orange-600 transition hover:text-orange-700"
            >
              Start your journey
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {principles.map((principle, index) => {
              const Icon = principle.icon;

              return (
                <div
                  key={principle.title}
                  className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-orange-200 sm:p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-bold">{principle.title}</h3>
                      <span className="text-xs font-semibold text-slate-300">
                        0{index + 1}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {principle.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-10 lg:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-orange-500 px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div className="absolute -right-12 -top-24 h-72 w-72 rounded-full border border-white/20" />
          <div className="absolute -right-2 -top-12 h-52 w-52 rounded-full border border-white/20" />
          <div className="absolute bottom-0 right-40 h-40 w-40 rounded-full bg-orange-400/50 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-100">
                Ready to get started?
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Let’s make every delivery feel simpler.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-orange-50">
                Join the platform and explore a more organized way to manage
                shipments and delivery operations.
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-orange-700 shadow-lg transition hover:bg-orange-50"
            >
              Create an account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
