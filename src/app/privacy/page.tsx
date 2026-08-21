import Link from "next/link";

export const metadata = { title: "Privacy | Pearlio" };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-28 text-textPrimary sm:px-12">
      <article className="mx-auto max-w-3xl space-y-8">
        <Link href="/" className="text-sm font-semibold text-accent underline underline-offset-4">← Back to Pearlio</Link>
        <div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Privacy</p><h1 className="font-heading text-5xl font-black tracking-tight text-white">Privacy, in plain language.</h1></div>
        <div className="space-y-5 text-base leading-relaxed text-textMuted">
          <p>When you submit the contact form, we use your name, email address, and project brief only to respond to your enquiry. We do not sell this information.</p>
          <p>Optional analytics are disabled by default. If you accept them, Meta Pixel may process device and usage information to help us measure site performance and advertising effectiveness.</p>
          <p>You can change your choice by clearing this site’s local storage in your browser. For privacy requests, contact the email address published by Pearlio.</p>
        </div>
      </article>
    </main>
  );
}
