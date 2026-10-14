"use client";
import {
  ArrowRight,
  Clock3,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Send,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";

const contactDetails = [
  {
    icon: Mail,
    title: "Email us",
    value: "support@swiftship.com",
    description: "Send us your questions anytime.",
    href: "mailto:support@swiftship.com",
  },
  {
    icon: Phone,
    title: "Call our team",
    value: "+880 1700-000000",
    description: "We're happy to help with your delivery.",
    href: "tel:+8801700000000",
  },
  {
    icon: MapPin,
    title: "Our office",
    value: "Dhaka, Bangladesh",
    description: "Serving customers across Bangladesh.",
    href: null,
  },
];

const supportOptions = [
  {
    icon: Package,
    title: "Shipment support",
    description: "Get help with delivery status, delays, and tracking.",
    href: "/tracking",
  },
  {
    icon: Truck,
    title: "Delivery questions",
    description: "Learn more about delivery and courier services.",
    href: "/about",
  },
  {
    icon: Headphones,
    title: "General inquiries",
    description: "Questions about your account or our services?",
    href: "mailto:support@swiftship.com",
  },
];

export default function ContactContent() {
  return (
    <main className="overflow-hidden bg-white">
      {/* Hero */}
      <section className="relative isolate bg-slate-950">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.28),transparent_50%)]" />

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-violet-200">
              <MessageCircle className="h-4 w-4" />
              We're here to help
            </div>

            <h1 className="mt-7 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Let&apos;s get your
              <span className="block text-violet-400">shipment moving.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Have a question about a delivery, need help tracking a parcel, or
              want to learn more about our services? Our team is ready to help.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-5 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-violet-400" />
              Reliable shipment support
            </div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-violet-400" />
              We're ready to assist
            </div>
          </div>
        </div>

        <div className="absolute -bottom-20 -right-16 -z-10 h-64 w-64 rounded-full border border-white/10 sm:-right-8 sm:h-80 sm:w-80" />
        <div className="absolute -bottom-12 -right-4 -z-10 h-48 w-48 rounded-full border border-white/10 sm:h-64 sm:w-64" />
      </section>

      {/* Contact form and contact information */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          {/* Static form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8 lg:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
                Send a message
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                How can we help you?
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Fill out the form below and tell us what you need help with.
              </p>
            </div>

            <form className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  What do you need help with?
                </label>
                <select
                  id="subject"
                  name="subject"
                  defaultValue=""
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  <option value="tracking">Shipment tracking</option>
                  <option value="delivery">Delivery issue</option>
                  <option value="payment">Payment question</option>
                  <option value="account">Account support</option>
                  <option value="other">Other inquiry</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="trackingNumber"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Tracking number{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  id="trackingNumber"
                  name="trackingNumber"
                  type="text"
                  placeholder="e.g. SHP-123456"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us a little more about how we can help..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <button
                type="button"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/30 sm:w-auto"
              >
                Send message
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <p className="text-xs leading-5 text-slate-400">
                This is a demo form. Messages are not submitted or stored.
              </p>
            </form>
          </div>

          {/* Contact details */}
          <aside className="space-y-6">
            <div className="rounded-3xl bg-slate-50 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900">
                Contact information
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Choose the contact method that works best for you.
              </p>

              <div className="mt-7 space-y-6">
                {contactDetails.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 pt-0.5">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </h3>

                        {item.href ? (
                          <a
                            href={item.href}
                            className="mt-1 block break-words text-sm font-medium text-violet-700 transition hover:text-violet-900"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {item.value}
                          </p>
                        )}

                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-violet-700 p-6 text-white sm:p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-16 -right-2 h-44 w-44 rounded-full border border-white/15" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <Headphones className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  Need help with a shipment?
                </h3>
                <p className="mt-2 text-sm leading-6 text-violet-100">
                  Check your parcel&apos;s latest tracking information and stay
                  up to date with its journey.
                </p>

                <Link
                  href="/tracking"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
                >
                  Track your shipment
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="flex gap-3 rounded-2xl border border-slate-200 p-5">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Support hours
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Contact our team for assistance with your shipment and
                  account-related questions.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Quick help */}
      <section className="border-t border-slate-100 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
              Quick help
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              What can we help you with?
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Find the right place to get started with your delivery questions.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {supportOptions.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-slate-200/60 sm:p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 flex items-center justify-between gap-3 font-semibold text-slate-900">
                    {item.title}
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-600" />
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
