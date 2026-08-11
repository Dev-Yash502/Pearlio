"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import LunarGravityCard from "@/components/ui/lunar-gravity-card";
import { Sparkles, MousePointer2 } from "lucide-react";

export default function ShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress continuously from entering viewport bottom to leaving viewport top
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smooth out progress with high-fidelity spring transition
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // Word by word scroll lighting reveals for header text (mapped to viewport entry)
  const w1 = useTransform(smoothProgress, [0.04, 0.16], [0.15, 1], { clamp: true });
  const w2 = useTransform(smoothProgress, [0.07, 0.19], [0.15, 1], { clamp: true });
  const w3 = useTransform(smoothProgress, [0.1, 0.22], [0.15, 1], { clamp: true });
  const w4 = useTransform(smoothProgress, [0.13, 0.25], [0.15, 1], { clamp: true });

  // Staggered words flying in from alternate sides (left/right) during entry
  const w1X = useTransform(smoothProgress, [0.04, 0.16], [-120, 0], { clamp: true });
  const w2X = useTransform(smoothProgress, [0.07, 0.19], [120, 0], { clamp: true });
  const w3X = useTransform(smoothProgress, [0.1, 0.22], [-120, 0], { clamp: true });
  const w4X = useTransform(smoothProgress, [0.13, 0.25], [120, 0], { clamp: true });

  const subOpacity = useTransform(smoothProgress, [0.15, 0.28], [0.15, 1], { clamp: true });
  const subY = useTransform(smoothProgress, [0.15, 0.28], [15, 0], { clamp: true });
  const badgeOpacity = useTransform(smoothProgress, [0.0, 0.12], [0, 1], { clamp: true });

  // Map scroll progress to 3D moon container transforms (fades in as it enters, fades out only at the end of viewport exit)
  const cardOpacity = useTransform(smoothProgress, [0.12, 0.28, 0.85, 0.98], [0, 1, 1, 0], { clamp: true });
  const cardScale = useTransform(smoothProgress, [0.12, 0.28], [0.92, 1], { clamp: true });

  // Pinned orbit ring expansion: spans from progress 0.28 (pin point) to 0.70 (complete expansion)
  const moonProgress = useTransform(smoothProgress, [0.28, 0.70], [0, 1], { clamp: true });

  // Global exit fade out for all Showcase content (fades out only during viewport exit)
  const globalExitOpacity = useTransform(smoothProgress, [0.85, 0.98], [1, 0], { clamp: true });

  return (
    <div ref={sectionRef} className="relative h-[250vh] bg-background w-full overflow-hidden">
      {/* Sticky container that stays fixed on screen while scrolling */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden z-10 gpu-layer">
        
        {/* Background radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none z-0" />
        
        {/* Global Exit opacity motion wrapper */}
        <motion.div
          style={{ opacity: globalExitOpacity }}
          className="w-full h-full flex flex-col justify-center items-center relative z-10"
        >
          {/* Centered header container */}
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mb-10 w-full">
            <motion.div 
              style={{ opacity: badgeOpacity }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border mb-4 w-fit mx-auto"
            >
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-xs font-bold uppercase tracking-wider text-textPrimary">
                Next-Level Capabilities
              </span>
            </motion.div>
            
            <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight mb-4 text-white flex flex-wrap justify-center gap-x-3 gap-y-1 overflow-hidden py-2">
              <motion.span style={{ opacity: w1, x: w1X }} className="inline-block">Websites</motion.span>
              <motion.span style={{ opacity: w2, x: w2X }} className="inline-block">that</motion.span>
              <motion.span style={{ opacity: w3, x: w3X }} className="inline-block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">feel</motion.span>
              <motion.span style={{ opacity: w4, x: w4X }} className="inline-block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">alive.</motion.span>
            </h2>
            
            <motion.p 
              style={{ opacity: subOpacity, y: subY }}
              className="text-sm sm:text-base md:text-lg text-textMuted max-w-2xl leading-relaxed mx-auto"
            >
              Static layouts don't capture attention. We build immersive 3D experiences that invite interaction, keep visitors hooked longer, and skyrocket conversions.
            </motion.p>
          </div>

          {/* Fullscreen 3D Component Container */}
          <motion.div
            style={{ opacity: cardOpacity, scale: cardScale }}
            className="w-full relative min-h-[500px] md:min-h-[540px] z-10 flex justify-center"
          >
            <LunarGravityCard scrollProgress={moonProgress} />
            
            {/* Hint Overlay */}
            <div aria-hidden="true" className="absolute bottom-6 right-8 md:bottom-8 md:right-16 z-30 pointer-events-none flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-border/80 text-xs font-semibold text-textPrimary animate-bounce shadow-lg">
              <MousePointer2 className="w-4 h-4 text-accent" />
              <span>Scroll to Control Gravitational Orbits</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
