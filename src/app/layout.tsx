import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Anton } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import AnalyticsConsent from "@/components/AnalyticsConsent";
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
    url: "https://pearlio.agency",
    siteName: "Pearlio Agency",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pearlio Web Development Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pearlio | Bold & Colorful Web Development Agency",
    description: "We build bold, high-performance websites, e-commerce stores, and landing pages.",
    images: ["/og-image.png"],
  },
  other: {
    "facebook-domain-verification": "isd9vmwgvmzmt8xt1a2109383wpzcd",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${plusJakartaSans.variable} ${anton.variable} font-sans bg-background text-textPrimary antialiased`}>
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
        <AnalyticsConsent />
      </body>
    </html>
  );
}
