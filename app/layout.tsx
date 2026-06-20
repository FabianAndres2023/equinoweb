import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portal Equino | Venta de Caballos Criollos",
  description:
    "Portal Equino. Compra y venta de ejemplares equinos criollos colombianos. Encuentra caballos de paso fino, trocha, trocha y galope y trote y galope.",
  keywords: [
    "Portal Equino",
    "caballos",
    "caballos criollos",
    "venta de caballos",
    "caballos colombianos",
    "paso fino",
    "trocha",
    "trocha y galope",
    "trote y galope",
  ],
  openGraph: {
    title: "Portal Equino",
    description:
      "Los mejores ejemplares criollos colombianos en un solo lugar.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}