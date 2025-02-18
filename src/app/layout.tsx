"use client;"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Vortex } from "./components/ui/vortex"; // ✅ Ensure correct import path
import "./globals.css"; // ✅ Ensure global styles are applied

// Load Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ✅ Metadata for SEO and Favicon Support
export const metadata: Metadata = {
  title: "Pokémon Explorer",
  description: "Explore 151 Pokémon Cards, Stats, and Abilities in One Place.",
  icons: [
    { rel: "icon", type: "image/png", url: "/favicon.png" }, // PNG format
    { rel: "icon", type: "image/svg+xml", url: "/favicon.svg" }, // SVG format
    { rel: "apple-touch-icon", url: "/favicon.png" }, // Mobile/iOS support
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffcc00" />

        {/* ✅ Explicit Favicon Links */}
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ Global Vortex Background */}
        <Vortex containerClassName="fixed inset-0 h-full w-full z-0" />

        {/* ✅ Main Content (Ensures Vortex is Background) */}
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
