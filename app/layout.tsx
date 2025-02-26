import { BASE_URL } from "@/constants";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#3C88C3",
};

export const metadata: Metadata = {
  title: "Se exakt var det kommer att regna",
  description:
    "Regnradar över Sverige. Se prognos och live just nu var det kommer att regna via karta. På regnkarta.se ser du hur nederbördsområden med regn eller snö rör sig över Sverige.",
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "./",
  },
  other: {
    "google-adsense-account": "ca-pub-5578135265480546",
  },
  robots: {
    index: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
