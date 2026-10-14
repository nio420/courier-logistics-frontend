"use client";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden bg-slate-50/50 p-6 dark:bg-slate-950/50">
      {/* Background Decorative Glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />

      {/* Main Content Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white/80 p-8 sm:p-10 text-center shadow-2xl shadow-slate-200/50 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none">
        {/* Icon / Badge */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner mb-6 ring-8 ring-primary/5">
          <ShieldAlert className="h-10 w-10 animate-bounce" />
        </div>

        {/* 404 Heading */}
        <h1 className="text-7xl sm:text-8xl font-black tracking-tighter text-primary">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Page not found
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Oops! The page you are looking for might have been removed, had its
          name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
