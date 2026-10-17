"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Package,
  Warehouse,
  Zap,
  Sparkles,
} from "lucide-react";

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

export default function ServicesSection() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-[#fdfbff] to-[#f8f5ff] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute -left-40 top-32 -z-10 h-80 w-80 rounded-full bg-violet-200/30 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 -z-10 h-96 w-96 rounded-full bg-fuchsia-200/25 blur-[120px]" />

      <div className="mx-auto max-w-[1440px]">
        {/* Section heading */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-4 py-2 shadow-sm shadow-violet-100/60 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-800 sm:text-xs">
                What we offer
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-5xl xl:text-[3.5rem]">
              Logistics that work
              <span className="mt-1 block bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                around your needs.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Practical delivery services and shipment tools designed to
              simplify the way you send and manage parcels.
            </p>
          </div>

          <Link
            href="/services"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-violet-200/80 bg-white/80 px-5 py-3.5 text-sm font-bold text-violet-800 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:shadow-lg hover:shadow-violet-100/60"
          >
            Explore all services
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Service cards */}
        <div className="mt-10 grid gap-6 sm:mt-14 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.number}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white bg-white/85 shadow-[0_12px_45px_-22px_rgba(109,40,217,0.20)] backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-violet-200 hover:shadow-[0_28px_65px_-24px_rgba(109,40,217,0.32)]"
              >
                <Link
                  href={service.href}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500"
                >
                  {/* Image */}
                  <div className="relative h-60 overflow-hidden bg-violet-100 sm:h-64">
                    <div
                      role="img"
                      aria-label={service.imageAlt}
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(30,15,55,0.02) 20%, rgba(30,15,55,0.72) 100%), url('${service.image}')`,
                      }}
                    />

                    {/* Soft image tint */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-violet-950/10 via-transparent to-fuchsia-300/10 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Service label */}
                    <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-lg backdrop-blur-xl sm:text-[11px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-300 shadow-[0_0_10px_rgba(240,171,252,0.9)]" />
                      {service.label}
                    </span>

                    {/* Service number */}
                    <span className="absolute bottom-5 left-5 text-sm font-extrabold tracking-[0.2em] text-white/80">
                      {service.number}
                    </span>

                    {/* Icon */}
                    <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-xl transition duration-300 group-hover:scale-110 group-hover:border-white group-hover:bg-white group-hover:text-violet-700">
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Decorative corner glow */}
                    <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-fuchsia-300/20 blur-3xl transition duration-500 group-hover:bg-fuchsia-300/40" />
                  </div>

                  {/* Card content */}
                  <div className="relative p-6 sm:p-7">
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-bl from-violet-100/60 to-transparent" />

                    <div className="relative">
                      <h3 className="text-xl font-extrabold tracking-tight text-slate-950 transition-colors duration-300 group-hover:text-violet-800 sm:text-2xl">
                        {service.title}
                      </h3>

                      <p className="mt-3 min-h-[72px] text-sm leading-7 text-slate-600">
                        {service.description}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-violet-100/80 pt-5">
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-violet-700">
                          Learn more
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-100 bg-violet-50/80 text-violet-600 transition duration-300 group-hover:border-violet-600 group-hover:bg-gradient-to-br group-hover:from-violet-600 group-hover:to-fuchsia-500 group-hover:text-white">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Bottom accent */}
        <div className="mx-auto mt-12 h-1 w-24 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-400 sm:mt-16" />
      </div>
    </section>
  );
}
