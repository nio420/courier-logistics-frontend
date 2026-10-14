import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import GoogleLoginToast from "@/components/auth/GoogleLoginToast";
import PublicFooter from "@/components/layout/public-footer";
import PublicNavbar from "@/components/layout/public-navbar";
import QueryProvider from "@/providers/QueryProvider";
import { Suspense } from "react";

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
          <PublicFooter />
        </QueryProvider>
      </body>
    </html>
  );
}
