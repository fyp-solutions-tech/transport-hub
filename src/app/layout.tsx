import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { RideTrackerProvider } from "@/components/providers/ride-tracker-provider";
import "./globals.css";

const plus_jakarta_sans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TransportHub — Ride Booking",
  description: "Book rides, track drivers, and manage payments seamlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plus_jakarta_sans.className} h-full antialiased`}
      data-theme="stitch"
    >
      <body className="bg-base-100 text-base-content min-h-screen flex flex-col">
        <RideTrackerProvider>
          {children}
          <Toaster
            richColors
            position="top-right"
            closeButton
            toastOptions={{
              duration: 3500,
              style: { fontFamily: 'var(--font-roboto), system-ui, sans-serif' },
            }}
          />
        </RideTrackerProvider>
      </body>
    </html>
  );
}
