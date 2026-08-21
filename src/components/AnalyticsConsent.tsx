"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";

type Consent = "accepted" | "declined" | null;

export default function AnalyticsConsent() {
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("pearlio-analytics-consent");
    setConsent(stored === "accepted" || stored === "declined" ? stored : null);
  }, []);

  const choose = (value: Exclude<Consent, null>) => {
    window.localStorage.setItem("pearlio-analytics-consent", value);
    setConsent(value);
  };

  return (
    <>
      {consent === "accepted" && (
        <Script id="meta-pixel" strategy="lazyOnload">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1736686907469602');
          fbq('track', 'PageView');
        `}</Script>
      )}
      {consent === null && (
        <aside aria-label="Analytics consent" className="fixed inset-x-4 bottom-4 z-[100000] mx-auto max-w-xl rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-md sm:p-5 md:left-auto md:right-6 md:mx-0">
          <p className="pr-2 text-xs leading-relaxed text-textPrimary">Optional analytics help us measure site performance. Accept or decline; the site works either way. <Link href="/privacy" className="text-accent underline underline-offset-2">Privacy details</Link>.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => choose("declined")} className="min-h-11 rounded-xl border border-border px-4 text-sm font-semibold text-textPrimary transition-colors hover:border-white/30">Decline</button>
            <button type="button" onClick={() => choose("accepted")} className="min-h-11 rounded-xl bg-accent px-4 text-sm font-bold text-background transition-colors hover:bg-accent-hover">Accept analytics</button>
          </div>
        </aside>
      )}
    </>
  );
}
