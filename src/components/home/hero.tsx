"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

const slides = [
  {
    eyebrow: "DELIVERY, REIMAGINED",
    title: "Your world,\ncloser than ever.",
    description:
      "From local deliveries to long-distance shipping, move every package with confidence and care.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=85",
    tag: "Smart logistics",
  },
  {
    eyebrow: "EVERY DELIVERY MATTERS",
    title: "Fast delivery.\nPeace of mind.",
    description:
      "Enjoy a seamless shipping experience with dependable delivery and real-time parcel visibility.",
    image:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=2000&q=85",
    tag: "Reliable shipping",
  },
  {
    eyebrow: "YOUR BUSINESS, MOVING FORWARD",
    title: "Big ambitions.\nSmoother shipping.",
    description:
      "Give your business the delivery experience it deserves, with logistics that keep you moving.",
    image:
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=2000&q=85",
    tag: "Business delivery",
  },
];

const benefits = [
  { icon: Truck, label: "Reliable delivery" },
  { icon: ShieldCheck, label: "Secure handling" },
  { icon: Clock3, label: "On-time service" },
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[activeSlide];

  return (
    <section className="relative isolate overflow-hidden bg-[#faf7ff]">
      {/* Premium gradient background */}
      <div className="absolute inset-0 -z-20 overflow-hidden bg-gradient-to-br from-[#fcfaff] via-white to-[#eee7ff]">
        <div className="absolute -left-40 -top-32 h-[500px] w-[500px] rounded-full bg-violet-300/35 blur-[110px]" />
        <div className="absolute -right-32 top-10 h-[480px] w-[480px] rounded-full bg-fuchsia-200/30 blur-[120px]" />
        <div className="absolute -bottom-48 left-[30%] h-[500px] w-[650px] rounded-full bg-indigo-200/35 blur-[130px]" />
        <div className="absolute right-[8%] top-[12%] h-72 w-72 rounded-full border border-violet-300/25" />
        <div className="absolute right-[11%] top-[16%] h-56 w-56 rounded-full border border-purple-300/25" />
      </div>

      {/* Soft image carousel in the background */}
      <div className="absolute inset-0 -z-10">
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            aria-hidden="true"
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              activeSlide === index ? "opacity-[0.12]" : "opacity-0"
            }`}
            style={{ backgroundImage: `url("${slide.image}")` }}
          />
        ))}
      </div>

      {/* Lighting overlays */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-white/90 via-white/65 to-violet-100/40" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/35 via-transparent to-white/80" />

      {/* Hero content */}
      <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:min-h-[760px] lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-24">
        {/* Left content */}
        <div className="relative z-10 max-w-2xl">
          {/* Eyebrow badge */}
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-violet-200/80 bg-white/75 px-5 py-2.5 shadow-[0_8px_30px_-12px_rgba(124,58,237,0.25)] backdrop-blur-xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500/50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet-600" />
            </span>

            <span className="text-[11px] font-bold tracking-[0.18em] text-violet-800 sm:text-xs">
              {currentSlide.eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h1
            key={currentSlide.title}
            className="whitespace-pre-line text-5xl font-extrabold leading-[1.02] tracking-[-0.065em] text-slate-950 sm:text-7xl lg:text-[5.2rem] xl:text-[5.8rem]"
          >
            {currentSlide.title.split("\n")[0]}
            <br />
            <span className="relative inline-block bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500 bg-clip-text pb-2 text-transparent">
              {currentSlide.title.split("\n")[1]}
              <span className="absolute bottom-0 left-0 h-1.5 w-2/3 rounded-full bg-gradient-to-r from-violet-500/70 to-fuchsia-400/20" />
            </span>
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
            {currentSlide.description}
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group relative inline-flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-600 px-8 py-4 font-semibold text-white shadow-[0_12px_35px_-8px_rgba(124,58,237,0.6)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_-8px_rgba(124,58,237,0.55)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative">Ship a package</span>
              <ArrowRight className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/tracking"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/90 bg-white/70 px-7 py-4 font-semibold text-slate-800 shadow-[0_8px_30px_-12px_rgba(109,40,217,0.22)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:bg-white"
            >
              Track your parcel
              <ArrowUpRight className="h-5 w-5 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-4 sm:gap-x-7">
            {benefits.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/90 bg-white/85 text-primary shadow-[0_5px_20px_-8px_rgba(109,40,217,0.3)]">
                  <Icon className="h-[18px] w-[18px]" />
                </span>

                <span className="text-sm font-semibold text-slate-700">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right image carousel */}
        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          {/* Ambient glow behind the image */}
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-violet-300/50 via-fuchsia-200/35 to-indigo-300/45 opacity-80 blur-2xl" />

          {/* Premium outer frame */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/90 bg-white/55 p-2.5 shadow-[0_30px_100px_-25px_rgba(109,40,217,0.35)] backdrop-blur-xl sm:rounded-[3rem]">
            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] ring-1 ring-white/30 sm:min-h-[520px] sm:rounded-[2.5rem]">
              {/* Foreground carousel images */}
              {slides.map((slide, index) => (
                <div
                  key={slide.image}
                  aria-hidden="true"
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                    activeSlide === index
                      ? "scale-100 opacity-100"
                      : "scale-105 opacity-0"
                  }`}
                  style={{ backgroundImage: `url("${slide.image}")` }}
                />
              ))}

              {/* Cinematic image overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-violet-950/10" />
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-400/10" />

              {/* Top image label */}
              <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3 sm:left-7 sm:right-7 sm:top-7">
                <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3.5 py-2.5 text-xs font-bold text-slate-800 shadow-xl backdrop-blur-xl sm:text-sm">
                  <PackageCheck className="h-4 w-4 text-primary" />
                  {currentSlide.tag}
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/85 text-primary shadow-lg backdrop-blur-xl">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>

              {/* Image caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-100 sm:text-xs">
                    Delivering more than packages
                  </p>
                </div>

                <h2 className="max-w-sm text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  Every parcel has a destination.
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
                  We help get it there with care, clarity, and confidence.
                </p>

                {/* Carousel indicators and controls */}
                <div className="mt-7 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.image}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        aria-label={`Show slide ${index + 1}`}
                        aria-current={
                          activeSlide === index ? "true" : undefined
                        }
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeSlide === index
                            ? "w-10 bg-white"
                            : "w-2 bg-white/55 hover:bg-white/90"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={previousSlide}
                      aria-label="Previous slide"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white/30"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Next slide"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white/30"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating delivery card */}
          <div className="absolute -bottom-7 -left-2 flex items-center gap-3 rounded-2xl border border-white/90 bg-white/90 p-4 shadow-[0_20px_60px_-15px_rgba(109,40,217,0.3)] backdrop-blur-2xl sm:-left-8 sm:bottom-10 sm:p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-primary shadow-inner">
              <Box className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                Your parcel, in motion
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Carefully handled, every step.
              </p>
            </div>

            <CheckCircle2 className="ml-1 h-5 w-5 shrink-0 text-emerald-500" />
          </div>

          {/* Additional ambient glow */}
          <div className="pointer-events-none absolute -right-8 -top-8 -z-10 h-36 w-36 rounded-full bg-fuchsia-300/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 left-1/3 -z-10 h-32 w-40 rounded-full bg-violet-400/30 blur-3xl" />
        </div>
      </div>

      {/* Seamless transition into the next section */}
      <div className="h-12 bg-gradient-to-b from-transparent via-white/50 to-white" />
    </section>
  );
}
