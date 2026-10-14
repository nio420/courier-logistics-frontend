"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function GoogleLoginToast() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("auth") !== "google-success") {
      return;
    }

    toast.success("Google login successful!");

    router.replace(window.location.pathname);
  }, [router, searchParams]);

  return null;
}
