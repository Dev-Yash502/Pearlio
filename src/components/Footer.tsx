"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [brief, setBrief] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || isSubmitting || submitted) return;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, brief }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "We could not send your message.");
      setSubmitted(true);

      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq("track", "Lead");
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We could not send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact" className="relative overflow-hidden bg-[#07060F] border-t border-border/80 w-full py-20 md:py-28">
      <div className="relative w-full">
        
        {/* Background decorations */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-1/4 left-10 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[100px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full space-y-16">
          
          {/* Contact Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-5 flex flex-col justify-center text-left pointer-events-auto"
            >
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border mb-6 w-fit">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-textPrimary">Kickoff Project</span>
              </div>
              
              <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-white mb-6">
                Let's build <br />
                something <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">bold.</span>
              </h2>
              
              <p className="text-textMuted text-sm md:text-base leading-relaxed max-w-md font-semibold mb-6">
                We don't do boring briefs or long validation timelines. Fill in your project ideas and we will get back to you with a roadmap in 24 hours.
              </p>
            </motion.div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4 }}
                className="p-6 md:p-8 rounded-[2.5rem] bg-card/45 border border-border/85 backdrop-blur-md relative overflow-hidden"
              >
                
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <CheckCircle2 className="w-16 h-16 text-accent mb-6 animate-bounce" />
                    <h3 className="font-heading font-bold text-2xl text-white mb-3">
                      Message Received!
                    </h3>
                    <p className="text-textMuted max-w-sm font-semibold text-sm">
                      We will review your details and send you a proposal within 24 hours. Let's make it happen.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    {submitError && <p role="alert" className="rounded-xl border border-secondary/40 bg-secondary/10 px-4 py-3 text-sm font-medium text-white">{submitError}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Liam Vance"
                          className="w-full bg-[#0A0915] border border-border/80 rounded-xl px-4 py-3 text-xs text-white placeholder-textMuted/50 focus:outline-none focus:border-accent transition-all duration-300 font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Your Email</label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. liam@vertex.com"
                          className="w-full bg-[#0A0915] border border-border/80 rounded-xl px-4 py-3 text-xs text-white placeholder-textMuted/50 focus:outline-none focus:border-accent transition-all duration-300 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="brief" className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Project Scope / Brief</label>
                      <textarea
                        id="brief"
                        rows={3}
                        value={brief}
                        onChange={(e) => setBrief(e.target.value)}
                        placeholder="Tell us what you want to build (SaaS web app, interactive E-comm, campaign site...)"
                        className="w-full bg-[#0A0915] border border-border/80 rounded-xl px-4 py-3 text-xs text-white placeholder-textMuted/50 focus:outline-none focus:border-accent transition-all duration-300 resize-none font-semibold"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-11 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-glow-secondary transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2 text-xs"
                    >
                      <span>{isSubmitting ? "Sending…" : "Kickoff Project"}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>

          {/* Footer Navigation & Credits */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-border/40 pt-6"
          >
            {/* Logo Column */}
            <div className="flex flex-col items-start">
              <Link href="/" className="flex items-center gap-2 group mb-2">
                <span aria-hidden="true" className="relative h-8 w-8 overflow-hidden rounded-full shadow-glow-primary transition-transform duration-300 group-hover:scale-110">
                  <Image src="/logo.jpg" alt="" fill sizes="32px" className="scale-[1.65] object-cover object-[50%_28%]" />
                </span>
                <span className="font-heading font-bold text-xl tracking-tight text-white transition-colors duration-300 group-hover:text-accent">
                  Pearlio<span className="text-secondary">.</span>
                </span>
              </Link>
              <p className="text-[10px] text-textMuted font-bold">
                © {new Date().getFullYear()} Pearlio Agency. All rights reserved.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-6 font-semibold">
              <Link href="#services" className="text-xs text-textMuted hover:text-white transition-colors">Services</Link>
              <Link href="#pricing" className="text-xs text-textMuted hover:text-white transition-colors">Pricing</Link>
              <Link href="#faq" className="text-xs text-textMuted hover:text-white transition-colors">FAQ</Link>
              <Link href="/privacy" className="text-xs text-textMuted hover:text-white transition-colors">Privacy</Link>
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
}
