import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Anton } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Pearlio | Bold & Colorful Web Development Agency",
  description: "We design and build high-performance websites, e-commerce stores, and high-converting landing pages for bold startups and small businesses.",
  metadataBase: new URL("https://pearlio.agency"),
  openGraph: {
    title: "Pearlio | Bold & Colorful Web Development Agency",
    description: "We build bold, high-performance websites, e-commerce stores, and landing pages.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${outfit.variable} ${plusJakartaSans.variable} ${anton.variable} font-sans bg-background text-textPrimary antialiased`}>
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
