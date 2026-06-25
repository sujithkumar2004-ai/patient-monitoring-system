import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PulseWard Monitor",
  description: "Live patient monitor dashboard with simulated IoT telemetry.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
