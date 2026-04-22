import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "sonner";
import { RideTrackerProvider } from "@/components/providers/ride-tracker-provider";
import "./globals.css";

const roboto = Roboto({
  variable: '--font-roboto',
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
      className={`${roboto.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col">
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
