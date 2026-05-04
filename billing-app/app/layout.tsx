import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PowerDillo — IT Construction, Subcontracting & Equipment Rental",
  description: "PowerDillo delivers integrated solutions across IT construction, subcontracting, and equipment rental.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
