import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Anton } from "next/font/google";
import Script from "next/script";
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
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${outfit.variable} ${plusJakartaSans.variable} ${anton.variable} font-sans bg-background text-textPrimary antialiased`}>
        {/* Meta Pixel Code */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1736686907469602');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: "none" }} 
            src="https://www.facebook.com/tr?id=1736686907469602&ev=PageView&noscript=1" 
            alt="facebook pixel"
          />
        </noscript>
        {/* End Meta Pixel Code */}
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
