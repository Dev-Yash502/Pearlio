"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Magnetic from "@/components/ui/magnetic";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.25], [0.05, 0], { clamp: true });
  const contentOpacity = useTransform(scrollYProgress, [0.25, 0.37], [1, 0], { clamp: true });

  return (
    <section ref={containerRef} className="relative h-[115svh] min-h-[720px] md:h-[145vh] bg-background w-full">
      <div className="sticky top-0 h-[100svh] min-h-[640px] w-full overflow-hidden">
        <video autoPlay={!shouldReduceMotion} muted loop playsInline preload="metadata" poster="/Frames/ezgif-frame-001.jpg" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-60">
          <source src="/fish-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10 pointer-events-none" />
        <div className="absolute inset-0 bg-background/25 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <motion.span style={{ opacity: shouldReduceMotion ? 0.04 : ghostOpacity }} className="font-display font-black text-white leading-none whitespace-nowrap text-[120px] sm:text-[24vw] tracking-tighter">PEARLIO</motion.span>
        </div>

        <motion.div style={{ opacity: shouldReduceMotion ? 1 : contentOpacity }} className="relative z-10 flex flex-col justify-between h-[calc(100svh-80px)] mt-20 px-6 pb-12 pt-8 sm:pb-16 sm:pt-12 md:px-12 md:pb-20 lg:px-16 w-full max-w-7xl mx-auto">
          <div className="max-w-3xl text-left">
            <motion.div initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border/80 text-xs sm:text-sm text-textPrimary mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="font-semibold uppercase tracking-wider">3D Web Engineering Agency</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }} className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-[1.05]">
              Shaping visual <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">narratives,</span> <br />
              <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">one pixel at a time.</span>
            </motion.h1>
          </div>
          <motion.div initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.16 }} className="max-w-xl text-left">
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-textMuted mb-6 font-medium">We combine high-performance WebGL/Three.js engineering with bold design aesthetics to construct online assets that rank high, run fast, and look stunning. No boring templates. Just raw, high-impact results.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Magnetic><Link href="#services" className="relative inline-flex min-h-11 items-center gap-2 px-6 py-3.5 rounded-full font-bold bg-white text-background hover:bg-accent hover:shadow-glow-accent transition-colors duration-200 text-sm sm:text-base group"><span>Explore Services</span><ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" /></Link></Magnetic>
              <Magnetic><Link href="#contact" className="relative inline-flex min-h-11 items-center gap-2 px-6 py-3.5 rounded-full font-bold text-white border-2 border-white/20 hover:border-white/80 hover:bg-white/5 transition-colors duration-200 text-sm sm:text-base"><span>Book a Call</span></Link></Magnetic>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
