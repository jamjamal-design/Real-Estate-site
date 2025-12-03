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
  title: "ZAHB Estates | Premium Real Estate & Property Management",
  description: "Secure verified farm lands, residential estates, and premium properties in Lagos, Nigeria. Expert estate management and property development services.",
  keywords: "real estate, land sales, estate management, property development, Lagos, Nigeria, farm lands, residential estates",
  authors: [{ name: "ZAHB Estates" }],
  openGraph: {
    title: "ZAHB Estates | Premium Real Estate & Property Management",
    description: "Secure verified farm lands, residential estates, and premium properties in Lagos, Nigeria.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
