"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { Sparkles } from "lucide-react";

export default function RobotSplineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(containerRef, { margin: "50% 0px 50% 0px" });

  // A complete scroll chapter: progress starts when the section pins and ends
  // exactly when its sticky viewport is allowed to release.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth out progress with high-fidelity spring transition
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // Entrance reveals for left text copy (starts immediately as section enters the viewport)
  const badgeOpacity = useTransform(smoothProgress, [0.05, 0.25], [0, 1], { clamp: true });
  const badgeY = useTransform(smoothProgress, [0.05, 0.25], [25, 0], { clamp: true });

  const titleOpacity = useTransform(smoothProgress, [0.1, 0.32], [0, 1], { clamp: true });
  const titleY = useTransform(smoothProgress, [0.1, 0.32], [30, 0], { clamp: true });

  const descOpacity = useTransform(smoothProgress, [0.15, 0.40], [0, 0.85], { clamp: true });
  const descY = useTransform(smoothProgress, [0.15, 0.40], [25, 0], { clamp: true });

  // Let the robot continue its entrance through most of the pinned chapter.
  const robotX = useTransform(smoothProgress, [0.12, 0.68], [150, 0], { clamp: true });
  const robotOpacity = useTransform(smoothProgress, [0.08, 0.36], [0, 1], { clamp: true });
  const robotScale = useTransform(smoothProgress, [0.12, 0.68], [0.85, 1.0], { clamp: true });

  return (
    <div ref={containerRef} className="relative h-[220svh] md:h-[260vh] bg-background w-full">
      {/* Pin the viewport until the robot sequence reaches its final state. */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden z-10 px-6 gpu-layer">
        
        {/* Main Content Layout - No card border/background (Robot taken out of the box) */}
        <div className="w-full max-w-7xl h-[80vh] flex flex-col md:flex-row relative items-center justify-between z-10">
          {/* Spotlight background glow tracking hover directly on page background */}
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />

          {/* Left Column: Text Copy */}
          <div className="flex-1 pr-0 md:pr-14 relative z-10 flex flex-col justify-center text-left pointer-events-auto">
            <motion.div
              style={{ opacity: badgeOpacity, y: badgeY }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border mb-6 w-fit"
            >
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-textPrimary">3D Spatial Experience</span>
            </motion.div>

            <motion.h2 
              style={{ opacity: titleOpacity, y: titleY }}
              className="font-heading font-black text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-6 leading-[1.05]"
            >
              Interactive <br />
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">3D UI Scenes.</span>
            </motion.h2>

            <motion.p 
              style={{ opacity: descOpacity, y: descY }}
              className="text-sm sm:text-base leading-relaxed text-textMuted mb-8 font-semibold max-w-md"
            >
              Bring your landing page to life with custom WebGL and Spline scenes. We construct lightweight, hardware-accelerated 3D elements that engage visitors, decrease bounce rates, and turn static pages into digital narratives.
            </motion.p>
          </div>

          {/* Right Column: 3D Spline Robot (Floating freely on page background) */}
          <motion.div 
            style={{ x: robotX, opacity: robotOpacity, scale: robotScale }}
            className="flex-1 relative h-full w-full pointer-events-auto"
          >
            <div className="absolute inset-0 w-full h-full">
              {isVisible && (
                <SplineScene 
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
