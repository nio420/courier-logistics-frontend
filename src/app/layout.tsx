import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import GoogleLoginToast from "@/components/auth/GoogleLoginToast";
import PublicNavbar from "@/components/layout/public-navbar";
import QueryProvider from "@/providers/QueryProvider";
import { Suspense } from "react";
import ConditionalPublicFooter from "@/components/layout/ConditionalPublicFooter";
import ScrollToTop from "@/components/layout/ScrollToTop";
import InitialLoader from "@/components/layout/InitialLoader";
import PageTransitionLoader from "@/components/layout/PageTransitionLoader";

export const metadata: Metadata = {
  title: "Courier Logistics",
  description: "Manage your courier deliveries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <InitialLoader />
          <PageTransitionLoader />
          <ScrollToTop />
          <PublicNavbar />
          {children}
          <Suspense fallback={null}>
            <GoogleLoginToast />
          </Suspense>
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={3000}
          />
          <ConditionalPublicFooter />
        </QueryProvider>
      </body>
    </html>
  );
}
