import type { Metadata } from "next";
import React from "react";
import { Outfit, Plus_Jakarta_Sans, Anton, Instrument_Serif } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/ui/custom-cursor";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

// FIX: Use next/font instead of manual <link> — self-hosts the font, eliminates
// render-blocking network request to Google, prevents FOUT, and avoids user IP leakage.
const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pearlio | Bold & Colorful Web Development Agency",
  description:
    "We design and build high-performance websites, e-commerce stores, and high-converting landing pages for bold startups and small businesses.",
  // FIX: Use environment variable so local dev works correctly without hitting production URL
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://pearlio.agency"
  ),
  openGraph: {
    title: "Pearlio | Bold & Colorful Web Development Agency",
    description:
      "We build bold, high-performance websites, e-commerce stores, and landing pages.",
    type: "website",
    url: "/",
    siteName: "Pearlio Agency",
    // FIX: Added siteName and url — were missing from OG block
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pearlio — Bold Web Development Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pearlio | Bold & Colorful Web Development Agency",
    description: "We build bold, high-performance websites.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/* FIX: Manual Google Fonts <link> removed — now using next/font/google above
          which self-hosts, avoids render-blocking, and handles preloading automatically */}
      <body
        className={`${outfit.variable} ${plusJakartaSans.variable} ${anton.variable} ${instrumentSerif.variable} font-sans bg-background text-textPrimary antialiased`}
      >
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
