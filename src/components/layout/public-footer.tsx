import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Camera,
  MapPin,
  Package,
  Phone,
  Share,
  Truck,
  Zap,
} from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Track Shipment", href: "/tracking" },
  { label: "Our Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const accountLinks = [
  { label: "Login", href: "/login" },
  { label: "Create Account", href: "/register" },
];

export default function PublicFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#080D24] text-slate-300">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-10 size-96 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute -right-32 top-20 size-96 rounded-full bg-violet-600/20 blur-[130px]" />
        <div className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-linear-to-r from-transparent via-cyan-400/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* CTA banner */}
        <div className="relative -mt-px overflow-hidden rounded-b-3xl border-x border-b border-white/10 bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 shadow-2xl shadow-blue-950/30 sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-20 size-64 rounded-full border-35 border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 right-40 size-44 rounded-full bg-cyan-300/20 blur-3xl"
          />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-50">
                <Zap size={14} className="text-yellow-300" />
                Delivery made simple
              </span>

              <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                Your parcels deserve
                <span className="block text-cyan-200">a faster journey.</span>
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-blue-100 sm:text-base">
                From pickup to doorstep, keep every delivery moving with
                confidence.
              </p>
            </div>

            <Link
              href="/tracking"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-blue-700 shadow-lg shadow-blue-950/20 transition duration-300 hover:-translate-y-1 hover:bg-cyan-50 hover:shadow-xl"
            >
              Track Your Parcel
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              aria-label="CourierPro home"
              className="group inline-flex items-center gap-3"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 via-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/25 transition duration-300 group-hover:-rotate-6 group-hover:scale-105">
                <Truck size={25} strokeWidth={2.2} />
              </span>

              <span className="text-2xl font-black tracking-tight text-white">
                Courier<span className="text-cyan-300">Pro</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Reliable courier and logistics services to keep your deliveries
              moving. We make shipping simpler, smoother, and easier to track.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300">
                <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
                Here for your deliveries
              </span>
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:bg-blue-500/15 hover:text-blue-300"
              >
                <Share size={18} />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-pink-400/40 hover:bg-pink-500/15 hover:text-pink-300"
              >
                <Camera size={18} />
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:bg-sky-500/15 hover:text-sky-300"
              >
                <BriefcaseBusiness size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-white">
              <span className="h-5 w-1 rounded-full bg-cyan-400" />
              Explore
            </h3>

            <div className="mt-5 flex flex-col gap-3.5">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex w-fit items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-cyan-300"
                >
                  <span className="size-1.5 rounded-full bg-slate-600 transition-colors group-hover:bg-cyan-300" />
                  {item.label}
                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Company links */}
          <div className="lg:col-span-2">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-white">
              <span className="h-5 w-1 rounded-full bg-violet-400" />
              Company
            </h3>

            <div className="mt-5 flex flex-col gap-3.5">
              {companyLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex w-fit items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-violet-300"
                >
                  <span className="size-1.5 rounded-full bg-slate-600 transition-colors group-hover:bg-violet-300" />
                  {item.label}
                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Account and contact */}
          <div className="lg:col-span-2">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-white">
              <span className="h-5 w-1 rounded-full bg-pink-400" />
              Your Account
            </h3>

            <div className="mt-5 flex flex-col gap-3.5">
              {accountLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex w-fit items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-pink-300"
                >
                  <span className="size-1.5 rounded-full bg-slate-600 transition-colors group-hover:bg-pink-300" />
                  {item.label}
                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>

            <div className="mt-7 border-t border-white/10 pt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Need help?
              </p>

              <Link
                href="/contact"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition-colors hover:text-cyan-300"
              >
                <Phone size={15} className="text-cyan-400" />
                Contact Support
              </Link>

              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <MapPin size={14} className="shrink-0 text-violet-400" />
                <span>Here to help with your shipments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-xs leading-5 text-slate-500 sm:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-slate-300">CourierPro</span>. All
            rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500 sm:justify-end">
            <span className="inline-flex items-center gap-2">
              <Package size={14} className="text-blue-400" />
              Every parcel matters
            </span>

            <span className="hidden h-4 w-px bg-white/10 sm:block" />

            <Link
              href="/contact"
              className="transition-colors hover:text-cyan-300"
            >
              Get in touch
            </Link>

            <Link href="/" className="transition-colors hover:text-cyan-300">
              Back to top ↑
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
