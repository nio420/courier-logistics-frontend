"use client";

import { useEffect, useState } from "react";
import { PackageCheck, ShieldCheck, Truck } from "lucide-react";

const STORAGE_KEY = "courier-logistics-intro-seen";

export default function InitialLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      setIsVisible(false);
      setShouldRender(false);
      return;
    }

    let removeTimer: ReturnType<typeof setTimeout> | undefined;

    const finishTimer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsVisible(false);

      removeTimer = setTimeout(() => {
        setShouldRender(false);
      }, 650);
    }, 2400);

    return () => {
      clearTimeout(finishTimer);

      if (removeTimer) {
        clearTimeout(removeTimer);
      }
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Courier Logistics"
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#071321] text-white transition-opacity duration-[650ms] ease-in-out ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400/10 blur-[100px]" />

        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="mb-14 flex items-center justify-center gap-3 animate-loader-fade">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-300/20 bg-teal-300/10 shadow-lg shadow-teal-500/10">
            <PackageCheck className="h-7 w-7 text-teal-300" />
          </div>

          <div>
            <p className="text-lg font-bold tracking-[0.16em]">
              COURIER <span className="text-teal-300">LOGISTICS</span>
            </p>

            <p className="mt-1 text-[10px] tracking-[0.3em] text-slate-400">
              DELIVERING TRUST, EVERYWHERE
            </p>
          </div>
        </div>

        <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-teal-300/15 animate-loader-spin" />

          <div className="absolute inset-3 rounded-full border border-dashed border-teal-300/25 animate-loader-spin-reverse" />

          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-300/20 to-cyan-500/5 shadow-[0_0_50px_rgba(45,212,191,0.12)]">
            <Truck className="h-11 w-11 text-teal-300 animate-loader-float" />
          </div>

          <span className="absolute right-1 top-5 h-2 w-2 rounded-full bg-teal-300 shadow-[0_0_12px_#5eead4] animate-pulse" />

          <span className="absolute bottom-5 left-2 h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Your journey starts here.
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Preparing your delivery experience...
          </p>

          <div className="mt-9 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-full origin-left rounded-full bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400 animate-loader-progress" />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-medium tracking-[0.2em] text-teal-300">
            <ShieldCheck className="h-4 w-4" />
            FAST. SECURE. RELIABLE.
          </div>
        </div>
      </div>
    </div>
  );
}
