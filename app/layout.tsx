import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Se exakt var det kommer att regna",
  description:
    "Regnradar över Sverige. Se prognos och live just nu var det kommer att regna via karta. På regnkarta.se ser du hur nederbördsområden med regn eller snö rör sig över Sverige.",
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
