import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock3,
  Globe2,
  MapPin,
  Package,
  PackageCheck,
  Route,
  ShieldCheck,
  Sparkles,
  Truck,
  Warehouse,
  Zap,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Parcel Delivery",
    description:
      "Send parcels with a reliable delivery process and shipment tracking from pickup to destination.",
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Packages prepared for delivery",
    icon: Package,
    label: "Everyday shipping",
    href: "/services",
  },
  {
    number: "02",
    title: "Express Delivery",
    description:
      "Choose priority delivery when timing matters and follow your shipment's progress.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Logistics warehouse and shipment operations",
    icon: Zap,
    label: "Priority shipping",
    href: "/services",
  },
  {
    number: "03",
    title: "Business Logistics",
    description:
      "Manage recurring shipments and streamline your business delivery operations in one place.",
    image:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Parcel distribution and logistics operations",
    icon: Warehouse,
    label: "Business solutions",
    href: "/services",
  },
];

const steps = [
  {
    number: "01",
    title: "Book your shipment",
    description:
      "Enter your parcel details, pickup information, and delivery address to get started.",
    icon: Package,
  },
  {
    number: "02",
    title: "Follow every update",
    description:
      "Use your tracking number to check shipment status and review recorded progress.",
    icon: MapPin,
  },
  {
    number: "03",
    title: "Receive your delivery",
    description:
      "Follow your parcel's journey through the delivery process until it reaches its destination.",
    icon: PackageCheck,
  },
];

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

const trackingStages = [
  {
    title: "Shipment booked",
    description: "Your shipment is registered",
    label: "STEP 01",
    completed: true,
  },
  {
    title: "In transit",
    description: "Your parcel moves through the delivery process",
    label: "STEP 02",
    completed: true,
  },
  {
    title: "Delivered",
    description: "Delivery completion is recorded",
    label: "STEP 03",
    completed: false,
  },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-white text-slate-900">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#080d19] text-white">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-blue-600/15 blur-[120px]" />
          <div className="absolute -bottom-52 right-0 h-[560px] w-[560px] rounded-full bg-indigo-500/15 blur-[140px]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.22) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[1fr_0.92fr] lg:gap-14 lg:px-12 lg:pb-24 lg:pt-24 xl:gap-20 xl:px-16">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-medium tracking-wide text-slate-200 backdrop-blur sm:text-sm">
              <Sparkles className="h-4 w-4 text-blue-400" />A smarter way to
              move forward
            </div>

            <h1 className="mt-7 max-w-3xl text-[2.65rem] font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-[4.5rem] xl:text-[5rem]">
              Every parcel has a journey.
              <span className="mt-2 block bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                Make yours seamless.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              From the moment you send it to the moment it arrives, manage your
              shipments with a clearer, simpler delivery experience.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/tracking"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-blue-950/30 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/40"
              >
                Track your parcel
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/register"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-white transition duration-300 hover:border-white/30 hover:bg-white/[0.09]"
              >
                Get started
                <ArrowUpRight className="h-4 w-4 text-slate-300" />
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              {["Shipment tracking", "Secure payments", "Delivery updates"].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400" />
                    {item}
                  </span>
                ),
              )}
            </div>

            <div className="mt-12 max-w-xl border-t border-white/10 pt-6">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Designed around your delivery journey
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3">
                <span className="text-sm font-semibold text-slate-300">
                  Simple shipping
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="text-sm font-semibold text-slate-300">
                  Clear tracking
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="text-sm font-semibold text-slate-300">
                  One platform
                </span>
              </div>
            </div>
          </div>

          {/* Hero image and shipment overview */}
          <div className="relative mx-auto w-full max-w-[620px] lg:ml-auto lg:max-w-none">
            <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/[0.08] blur-2xl" />

            <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.045] p-2.5 shadow-2xl shadow-black/30 backdrop-blur sm:rounded-[2rem] sm:p-3">
              <div
                role="img"
                aria-label="Logistics warehouse with parcels ready to be shipped"
                className="relative min-h-[270px] overflow-hidden rounded-[1.25rem] bg-slate-800 bg-cover bg-center sm:min-h-[360px] sm:rounded-[1.5rem] lg:min-h-[390px] xl:min-h-[440px]"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(8,13,25,0.02) 20%, rgba(8,13,25,0.88) 100%), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=90')",
                }}
              >
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/60 px-3 py-2 text-xs font-medium text-white backdrop-blur-md sm:left-5 sm:top-5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Your delivery, organized
                </div>

                <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                    The journey matters
                  </p>
                  <h2 className="mt-2 max-w-md text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    From pickup to destination.
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-200">
                    Shipment information, delivery progress, and recorded
                    updates in one place.
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      THE DELIVERY PROCESS
                    </p>
                    <p className="mt-1 text-base font-semibold text-white">
                      Your parcel journey
                    </p>
                  </div>
                  <span className="w-fit rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-medium text-blue-300">
                    3 simple stages
                  </span>
                </div>

                <div className="mt-5 space-y-0">
                  {trackingStages.map((stage, index) => (
                    <div
                      key={stage.label}
                      className="relative flex gap-3 pb-5 last:pb-0 sm:gap-4"
                    >
                      {index < trackingStages.length - 1 && (
                        <div className="absolute bottom-0 left-[15px] top-8 w-px bg-white/10" />
                      )}

                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          stage.completed
                            ? "bg-blue-600 text-white"
                            : "border border-white/15 bg-white/5 text-slate-400"
                        }`}
                      >
                        {stage.completed ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-white">
                            {stage.title}
                          </h3>
                          <span className="text-[10px] font-semibold tracking-wider text-slate-500">
                            {stage.label}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/tracking"
                  className="group mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition hover:border-blue-400/30 hover:bg-white/[0.07]"
                >
                  <span className="text-sm font-medium text-slate-200">
                    Explore shipment tracking
                  </span>
                  <ArrowRight className="h-4 w-4 text-blue-400 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="absolute -right-2 top-[32%] hidden items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl sm:flex lg:-right-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Your shipment details
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Conveniently accessible
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature strip */}
        <div className="border-t border-white/10 bg-white/[0.025]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-0 px-5 sm:grid-cols-3 sm:px-8 lg:px-12 xl:px-16">
            <div className="flex items-center gap-4 border-b border-white/10 py-5 sm:border-b-0 sm:border-r sm:py-6 sm:pr-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-blue-300">
                <PackageCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Shipment management
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Keep your parcel details together
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-white/10 py-5 sm:border-b-0 sm:border-r sm:px-5 sm:py-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-blue-300">
                <Route className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Delivery visibility
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Review your shipment's recorded progress
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-5 sm:py-6 sm:pl-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-blue-300">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  A simpler workflow
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Access useful tools in one place
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracking callout */}
      <section className="mx-auto max-w-[1440px] px-5 pt-8 sm:px-8 sm:pt-10 lg:px-12 xl:px-16">
        <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:flex-row sm:items-center sm:justify-between sm:p-7 lg:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                Already have a tracking number?
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Check your shipment details and available tracking history.
              </p>
            </div>
          </div>

          <Link
            href="/tracking"
            className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Track shipment
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700 sm:text-sm">
                What we offer
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
                Logistics that work
                <span className="block text-slate-400">around your needs.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                Practical delivery services and shipment tools designed to
                simplify the way you send and manage parcels.
              </p>
            </div>

            <Link
              href="/services"
              className="group inline-flex w-fit items-center gap-2 pb-1 text-sm font-semibold text-slate-900 transition hover:text-blue-700"
            >
              Explore all services
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-14 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.number}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60"
                >
                  <Link href={service.href} className="block">
                    <div
                      role="img"
                      aria-label={service.imageAlt}
                      className="relative h-56 overflow-hidden bg-slate-100 bg-cover bg-center sm:h-64"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.02) 35%, rgba(15,23,42,0.58) 100%), url('${service.image}')`,
                      }}
                    >
                      <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-slate-950/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                        {service.label}
                      </span>
                      <span className="absolute bottom-5 left-5 text-sm font-semibold tracking-[0.18em] text-white/80">
                        {service.number}
                      </span>
                      <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white backdrop-blur-md transition duration-300 group-hover:bg-white group-hover:text-slate-950">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="p-6 sm:p-7">
                      <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                        {service.title}
                      </h3>
                      <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">
                        {service.description}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                        Learn more
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why choose the platform */}
      <section className="overflow-hidden bg-[#f6f8fc] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div className="relative">
            <div className="absolute -left-5 -top-5 h-32 w-32 rounded-full border border-blue-200/70" />

            <div
              role="img"
              aria-label="Logistics team working with shipping packages"
              className="relative min-h-[330px] overflow-hidden rounded-3xl bg-slate-200 bg-cover bg-center shadow-xl shadow-slate-300/30 sm:min-h-[460px]"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(15,23,42,0.02), rgba(15,23,42,0.16)), url('https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1400&q=90')",
              }}
            >
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-slate-950/75 p-5 text-white backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                  Built for clarity
                </p>
                <p className="mt-2 text-lg font-semibold sm:text-xl">
                  Every important update, easier to find.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-2 hidden w-56 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:block md:-right-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="mt-3 font-semibold text-slate-900">
                A clearer overview
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Shipment details and available updates together.
              </p>
            </div>
          </div>

          <div className="pt-2 lg:py-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700 sm:text-sm">
              A better delivery experience
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
              Less uncertainty.
              <span className="block text-slate-400">
                More control over every shipment.
              </span>
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Shipping should not feel complicated. Our platform brings
              essential shipment information into one accessible place, helping
              you understand your parcel&apos;s progress without unnecessary
              steps.
            </p>

            <div className="mt-9 space-y-6">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-700 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {benefit.title}
                      </h3>
                      <p className="mt-1.5 max-w-lg text-sm leading-6 text-slate-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/about"
              className="group mt-9 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-blue-300 hover:text-blue-700"
            >
              Get to know us
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700 sm:text-sm">
              How it works
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
              Three steps. One smoother journey.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Get started with a straightforward process that keeps the
              important details within reach.
            </p>
          </div>

          <div className="relative mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
            <div className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-10 hidden border-t border-dashed border-slate-300 md:block" />

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="relative rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-bold tracking-[0.16em] text-slate-300">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-semibold tracking-tight text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>
                  <div className="mt-7 h-1 w-12 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-20" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28 xl:px-16">
        <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[1.75rem] bg-[#0b1220] px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute -right-20 -top-36 h-96 w-96 rounded-full border border-white/[0.08]" />
          <div className="pointer-events-none absolute -right-4 -top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-[90px]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-blue-200">
                <Sparkles className="h-3.5 w-3.5" />
                Your next delivery starts here
              </div>
              <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                Ready to make shipping simpler?
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Create your account to manage your shipments and access the
                delivery tools available on our platform.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Create your account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.09]"
              >
                Contact us
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
