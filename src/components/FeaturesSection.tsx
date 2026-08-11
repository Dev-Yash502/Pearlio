"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Code2, ShoppingBag, Rocket, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "High-End Website Design",
    description:
      "Stunning custom-coded websites built from scratch. No bloated themes. We focus on modern typography, sleek gradients, and micro-interactions that mirror your premium brand positioning.",
    techs: ["Next.js", "Three.js", "Framer Motion", "Tailwind"],
    icon: Code2,
    glowColor: "purple" as const,
  },
  {
    title: "High-Performance E-commerce",
    description:
      "Fast storefronts built to scale. We design robust checkout tunnels, lightning-quick page loading speeds, and database architectures tailored to capture sales and improve conversions.",
    techs: ["React", "Shopify headless", "Stripe API", "Node.js"],
    icon: ShoppingBag,
    glowColor: "blue" as const,
  },
  {
    title: "Conversion Landing Pages",
    description:
      "Laser-focused conversion templates. Clean copywriting layouts, responsive form states, and optimized script bundles designed specifically to scale startup marketing campaigns.",
    techs: ["Next.js", "Tailwind CSS", "TypeScript", "Google Analytics"],
    icon: Rocket,
    glowColor: "red" as const,
  },
];

export default function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of the section relative to viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth out progress with high-fidelity spring transition
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // Word by word scroll lighting reveals for header text (driven by spring progress)
  const w1 = useTransform(smoothProgress, [0.05, 0.2], [0.15, 1], { clamp: true });
  const w2 = useTransform(smoothProgress, [0.07, 0.22], [0.15, 1], { clamp: true });
  const w3 = useTransform(smoothProgress, [0.09, 0.24], [0.15, 1], { clamp: true });
  const w4 = useTransform(smoothProgress, [0.11, 0.26], [0.15, 1], { clamp: true });
  const w5 = useTransform(smoothProgress, [0.13, 0.28], [0.15, 1], { clamp: true });
  const w6 = useTransform(smoothProgress, [0.15, 0.3], [0.15, 1], { clamp: true });
  const w7 = useTransform(smoothProgress, [0.17, 0.32], [0.15, 1], { clamp: true });

  // Staggered words sliding in from alternate sides (left/right)
  const w1X = useTransform(smoothProgress, [0.05, 0.2], [-100, 0], { clamp: true });
  const w2X = useTransform(smoothProgress, [0.07, 0.22], [100, 0], { clamp: true });
  const w3X = useTransform(smoothProgress, [0.09, 0.24], [-100, 0], { clamp: true });
  const w4X = useTransform(smoothProgress, [0.11, 0.26], [100, 0], { clamp: true });
  const w5X = useTransform(smoothProgress, [0.13, 0.28], [-100, 0], { clamp: true });
  const w6X = useTransform(smoothProgress, [0.15, 0.3], [100, 0], { clamp: true });
  const w7X = useTransform(smoothProgress, [0.17, 0.32], [-100, 0], { clamp: true });

  const subOpacity = useTransform(smoothProgress, [0.19, 0.34], [0.15, 1], { clamp: true });
  const subY = useTransform(smoothProgress, [0.19, 0.34], [15, 0], { clamp: true });
  const badgeOpacity = useTransform(smoothProgress, [0.0, 0.15], [0, 1], { clamp: true });

  // Map scroll progress to horizontal/vertical card entries (staggered)
  const xLeft = useTransform(smoothProgress, [0.22, 0.42], [-150, 0], { clamp: true });
  const opacityLeft = useTransform(smoothProgress, [0.22, 0.34], [0, 1], { clamp: true });

  const yMiddle = useTransform(smoothProgress, [0.32, 0.52], [120, 0], { clamp: true });
  const opacityMiddle = useTransform(smoothProgress, [0.32, 0.44], [0, 1], { clamp: true });

  const xRight = useTransform(smoothProgress, [0.42, 0.62], [150, 0], { clamp: true });
  const opacityRight = useTransform(smoothProgress, [0.42, 0.54], [0, 1], { clamp: true });

  // Map scroll progress to SEO box entry
  const seoOpacity = useTransform(smoothProgress, [0.52, 0.72], [0, 1], { clamp: true });
  const seoY = useTransform(smoothProgress, [0.52, 0.72], [80, 0], { clamp: true });

  // Global exit fade for everything inside sticky view
  const globalContentOpacity = useTransform(smoothProgress, [0.85, 0.98], [1, 0], { clamp: true });

  return (
    <div ref={containerRef} className="relative h-[160vh] bg-background w-full">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden z-10 py-12">
        {/* Background glow elements */}
        <div className="absolute top-1/4 left-10 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

        <motion.div 
          style={{ opacity: globalContentOpacity }}
          className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col justify-center h-full"
        >
          {/* Section Header */}
          <div className="text-left mb-12 max-w-3xl">
            <motion.div 
              style={{ opacity: badgeOpacity }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border mb-4"
            >
              <Activity className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-textPrimary">Our Services</span>
            </motion.div>
            
            <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight mb-4 text-white leading-none flex flex-wrap gap-x-3 gap-y-1 overflow-hidden py-2">
              <motion.span style={{ opacity: w1, x: w1X }} className="inline-block">We</motion.span>
              <motion.span style={{ opacity: w2, x: w2X }} className="inline-block">build</motion.span>
              <motion.span style={{ opacity: w3, x: w3X }} className="inline-block">websites</motion.span>
              {/* FIX: <br /> has no effect inside display:flex. Use a full-width spacer div to force line break */}
              <div className="basis-full h-0" aria-hidden="true" />
              <motion.span style={{ opacity: w4, x: w4X }} className="inline-block">that</motion.span>
              <motion.span style={{ opacity: w5, x: w5X }} className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-heading">dominate</motion.span>
              <motion.span style={{ opacity: w6, x: w6X }} className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-heading">the</motion.span>
              <motion.span style={{ opacity: w7, x: w7X }} className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-heading">web.</motion.span>
            </h2>
            
            <motion.p 
              style={{ opacity: subOpacity, y: subY }}
              className="text-sm sm:text-base md:text-lg text-textMuted leading-relaxed"
            >
              We combine high-performance engineering with bold design aesthetics to construct online assets that rank high, run fast, and look stunning.
            </motion.p>
          </div>

          {/* 3 Columns Grid using GlowCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              
              // Assign scroll-linked motion transforms dynamically
              const cardX = index === 0 ? xLeft : index === 2 ? xRight : 0;
              const cardY = index === 1 ? yMiddle : 0;
              const cardOpacity = index === 0 ? opacityLeft : index === 1 ? opacityMiddle : opacityRight;

              return (
                <motion.div 
                  style={{ x: cardX, y: cardY, opacity: cardOpacity }}
                  key={index} 
                  className="flex h-full"
                >
                  <GlowCard
                    glowColor={service.glowColor}
                    customSize={true}
                    // FIX: Added `group` class so group-hover: utilities on children (arrow, text) actually work
                    className="group w-full min-h-[380px] md:min-h-[400px] flex flex-col justify-between h-full hover:scale-[1.02] duration-300 pointer-events-auto"
                  >
                    <div className="flex flex-col items-start text-left h-full justify-between">
                      <div>
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-6 border border-border/80 bg-background`}>
                          <IconComponent className={`w-5 h-5 ${
                            service.glowColor === "purple" ? "text-primary" : 
                            service.glowColor === "blue" ? "text-accent" : "text-secondary"
                          }`} />
                        </div>

                        {/* Title */}
                        <h3 className="font-heading font-bold text-xl text-white mb-2 leading-tight">
                          {service.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-textMuted leading-relaxed mb-4">
                          {service.description}
                        </p>
                      </div>

                      {/* Tech Stacks Tags & CTA */}
                      <div className="w-full">
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {service.techs.map((tech) => (
                            <span key={tech} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-border/50 text-textMuted">
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* FIX: Was a dead <div> with no href/onClick. Now a real Link to #contact */}
                        <Link
                          href="#contact"
                          className="flex items-center gap-1 text-xs font-semibold text-white group-hover:text-accent transition-colors duration-300 border-t border-border/40 pt-3 w-full"
                        >
                          <span>Get Started</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              );
            })}
          </div>

          {/* Add-on SEO & Maintenance Box */}
          <motion.div
            style={{ opacity: seoOpacity, y: seoY }}
            className="relative rounded-[2rem] p-6 md:p-8 overflow-hidden border border-border/80 bg-card/60 backdrop-blur-md text-left flex flex-col md:flex-row items-center md:items-stretch justify-between gap-6 group"
          >
            {/* Subtle Accent Light */}
            <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-accent/10 blur-[60px] pointer-events-none group-hover:bg-accent/15 transition-all duration-700" />
            
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border mb-4 w-fit">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Crucial Add-ons</span>
              </div>
              
              <h3 className="font-heading font-bold text-2xl text-white mb-2">
                SEO & Dynamic Maintenance
              </h3>
              
              <p className="text-textMuted text-xs sm:text-sm leading-relaxed">
                We don't just hand off files. We rank your site on Google page 1 with search engine optimization, optimize script bundles continuously, monitor health 24/7, and handle rapid content updates. Perfect for startups looking to grow without dedicated IT teams.
              </p>
            </div>

            <div className="flex flex-col justify-center items-stretch md:items-end w-full md:w-auto gap-3">
              <div className="bg-background/80 border border-border px-4 py-2 rounded-xl font-mono text-[10px] text-textMuted text-center md:text-right">
                <span className="text-accent font-bold">SEO Optimization</span> • <span className="text-primary font-bold">24/7 Hosting</span> • <span className="text-secondary font-bold">Updates</span>
              </div>
              <Link
                href="#contact"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-bold bg-white text-background hover:bg-accent hover:text-background hover:shadow-glow-accent transition-all duration-300 text-xs"
              >
                <span>Add to Your Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
