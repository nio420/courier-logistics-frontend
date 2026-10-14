"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function establishSession() {
      try {
        const params = new URLSearchParams(window.location.hash.slice(1));

        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");
        const requestedPath = params.get("dashboardPath");

        if (!accessToken || !refreshToken) {
          throw new Error("Google authentication failed. Please try again.");
        }

        window.history.replaceState(null, "", window.location.pathname);

        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken, refreshToken }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Could not establish your login session.",
          );
        }

        const allowedPaths = ["/admin", "/courier", "/dashboard"];
        const dashboardPath = allowedPaths.includes(requestedPath || "")
          ? requestedPath!
          : "/dashboard";

        window.location.replace(dashboardPath);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Google login failed.");
      }
    }

    void establishSession();
  }, []);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.replace("/login")}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-white"
          >
            Back to login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p>Signing you in with Google...</p>
    </main>
  );
}
