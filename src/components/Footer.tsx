"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sparkles, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [brief, setBrief] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress continuously as we approach the absolute bottom of the page
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Smooth out progress with high-fidelity spring transition
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // Left Column (Text copy) entries
  const leftColOpacity = useTransform(smoothProgress, [0.0, 0.45], [0, 1], { clamp: true });
  const leftColX = useTransform(smoothProgress, [0.0, 0.45], [-80, 0], { clamp: true });

  // Form Container fly-up spring entrance
  const formOpacity = useTransform(smoothProgress, [0.1, 0.55], [0, 1], { clamp: true });
  const formY = useTransform(smoothProgress, [0.1, 0.55], [100, 0], { clamp: true });
  const formScale = useTransform(smoothProgress, [0.1, 0.55], [0.94, 1.0], { clamp: true });

  // Staggered inputs fields reveals (scrubbed dynamically)
  const input1Opacity = useTransform(smoothProgress, [0.25, 0.55], [0, 1], { clamp: true });
  const input1Y = useTransform(smoothProgress, [0.25, 0.55], [20, 0], { clamp: true });

  // FIX: Email field uses its own stagger values (was incorrectly sharing input1Opacity/Y)
  const input1bOpacity = useTransform(smoothProgress, [0.29, 0.59], [0, 1], { clamp: true });
  const input1bY = useTransform(smoothProgress, [0.29, 0.59], [20, 0], { clamp: true });

  const input2Opacity = useTransform(smoothProgress, [0.32, 0.62], [0, 1], { clamp: true });
  const input2Y = useTransform(smoothProgress, [0.32, 0.62], [20, 0], { clamp: true });

  const input3Opacity = useTransform(smoothProgress, [0.39, 0.69], [0, 1], { clamp: true });
  const input3Y = useTransform(smoothProgress, [0.39, 0.69], [20, 0], { clamp: true });

  const btnOpacity = useTransform(smoothProgress, [0.46, 0.76], [0, 1], { clamp: true });
  const btnY = useTransform(smoothProgress, [0.46, 0.76], [20, 0], { clamp: true });

  // Bottom row (links, socials, credits) entries
  const bottomOpacity = useTransform(smoothProgress, [0.6, 0.9], [0, 1], { clamp: true });
  const bottomY = useTransform(smoothProgress, [0.6, 0.9], [30, 0], { clamp: true });

  // FIX: Store timeout ID in ref so we can clear it on unmount (prevents memory leak
  // and setState call on unmounted component)
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // Basic email format validation (native type="email" validates on blur,
    // but we add a regex check here as a defense-in-depth measure)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return;

    setSubmitted(true);

    // TODO: Replace this with a real API call, e.g.:
    // await fetch('https://formspree.io/f/YOUR_ID', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, brief }),
    // });
    // For now we log to console so data isn't silently lost during development
    console.log('[Contact Form Submission]', { name, email, brief });

    // FIX: Store timeout in ref so it can be cleared on unmount
    submitTimerRef.current = setTimeout(() => {
      setSubmitted(false);
      setName("");
      setEmail("");
      setBrief("");
    }, 4000);
  };

  return (
    <div ref={containerRef} className="relative h-[150vh] bg-background border-t border-border/80 w-full">
      {/* Sticky container that locks on screen at the bottom of the page */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden z-10 py-8">
        
        {/* Background decorations */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-1/4 left-10 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[100px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col justify-between h-[calc(100vh-100px)] mt-12">
          
          {/* Contact Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center flex-grow">
            
            {/* Left Column: Heading */}
            <motion.div 
              style={{ opacity: leftColOpacity, x: leftColX }}
              className="lg:col-span-5 flex flex-col justify-center text-left pointer-events-auto"
            >
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border mb-6 w-fit">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-textPrimary">Project Kickoff</span>
              </div>
              
              <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-white mb-6">
                Let's build <br />
                something <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">bold.</span>
              </h2>
              
              <p className="text-textMuted text-sm md:text-base leading-relaxed max-w-md font-semibold">
                We don't do boring briefs or long validation timelines. Fill in your project ideas and we will get back to you with a roadmap in 24 hours.
              </p>
            </motion.div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <motion.div 
                style={{ opacity: formOpacity, y: formY, scale: formScale }}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.div style={{ opacity: input1Opacity, y: input1Y }} className="space-y-1.5">
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
                      </motion.div>
                      {/* FIX: Email uses its own stagger (input1bOpacity/Y) — was sharing input1 causing both to appear simultaneously */}
                      <motion.div style={{ opacity: input1bOpacity, y: input1bY }} className="space-y-1.5">
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
                      </motion.div>
                    </div>

                    <motion.div style={{ opacity: input2Opacity, y: input2Y }} className="space-y-1.5">
                      <label htmlFor="brief" className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Project Scope / Brief</label>
                      <textarea
                        id="brief"
                        rows={3}
                        value={brief}
                        onChange={(e) => setBrief(e.target.value)}
                        placeholder="Tell us what you want to build (SaaS web app, interactive E-comm, campaign site...)"
                        className="w-full bg-[#0A0915] border border-border/80 rounded-xl px-4 py-3 text-xs text-white placeholder-textMuted/50 focus:outline-none focus:border-accent transition-all duration-300 resize-none font-semibold"
                      />
                    </motion.div>

                    <motion.button
                      style={{ opacity: btnOpacity, y: btnY }}
                      type="submit"
                      className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-glow-secondary transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-xs"
                    >
                      <span>Kickoff Project</span>
                      <Send className="w-3.5 h-3.5" />
                    </motion.button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>

          {/* Footer Navigation & Credits */}
          <motion.div 
            style={{ opacity: bottomOpacity, y: bottomY }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-border/40 pt-6"
          >
            {/* Logo Column */}
            <div className="flex flex-col items-start">
              <Link href="/" className="flex items-center gap-2 group mb-2">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-heading font-black text-lg text-white shadow-glow-primary transition-transform duration-300 group-hover:scale-110">
                  P
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
              <Link href="#work" className="text-xs text-textMuted hover:text-white transition-colors">Work</Link>
              <Link href="#pricing" className="text-xs text-textMuted hover:text-white transition-colors">Pricing</Link>
              <Link href="#faq" className="text-xs text-textMuted hover:text-white transition-colors">FAQ</Link>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Twitter/X"
                className="p-2 rounded-full bg-card hover:bg-primary/25 border border-border text-textMuted hover:text-white transition-all duration-300 hover:scale-110"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Check our Github code"
                className="p-2 rounded-full bg-card hover:bg-accent/25 border border-border text-textMuted hover:text-white transition-all duration-300 hover:scale-110"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with us on LinkedIn"
                className="p-2 rounded-full bg-card hover:bg-secondary/25 border border-border text-textMuted hover:text-white transition-all duration-300 hover:scale-110"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
