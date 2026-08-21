"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  useMotionValue,
} from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import — R3F/Three.js must be client-only
const LunarGravityCard = dynamic(
  () => import("@/components/ui/lunar-gravity-card"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px]" aria-hidden="true" />
    ),
  }
);

// ─── Animated chevron hint ────────────────────────────────────────────────────
function ScrollHint() {
  return (
    <div className="flex flex-col items-center gap-2 select-none pointer-events-none">
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="w-5 h-5 border-b-2 border-r-2 border-accent rotate-45 opacity-70"
      />
      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-textMuted/70">
        Scroll to control orbits
      </span>
    </div>
  );
}

// ─── Stage dot — own component so hooks are called legally at top-level ───────
const STAGES = [0, 0.2, 0.4, 0.6, 0.8, 1.0] as const;

function StageDot({
  stage,
  progress,
}: {
  stage: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const lo = Math.max(0, stage - 0.06);
  const hi = Math.min(1, stage + 0.06);
  const dotOpacity = useTransform(progress, [lo, stage, hi], [0.18, 1.0, 0.55]);
  const dotScale   = useTransform(progress, [lo, stage, hi], [0.6,  1.35, 0.8]);
  return (
    <motion.div
      style={{ opacity: dotOpacity, scale: dotScale }}
      className="w-1.5 h-1.5 rounded-full bg-accent"
    />
  );
}

// ─── Main ShowcaseSection ─────────────────────────────────────────────────────
export default function ShowcaseSection() {
  const outerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // useScroll: 0 when section-top hits viewport-top, 1 when section-bottom hits viewport-bottom.
  // With h-[300svh] this gives the user 200svh of scroll runway inside the sticky pin.
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Spring: cinematic smoothing — not robotic, not instant.
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 22,
    restDelta: 0.0005,
  });

  // Reduced-motion: show completed state immediately, skip the journey.
  const staticProgress = useMotionValue(1.0);
  const activeProgress = prefersReducedMotion ? staticProgress : springProgress;

  // Hint fades away once the user begins scrolling
  const hintOpacity = useTransform(activeProgress, [0, 0.10, 0.18], [1, 1, 0], { clamp: true });

  // Ambient glow intensifies as the orbital scene matures
  const glowOpacity = useTransform(activeProgress, [0, 0.5, 1.0], [0.03, 0.07, 0.12], { clamp: true });

  // Entire sticky view fades out in the final 8% so the next section slides in gracefully
  const sectionFade = useTransform(activeProgress, [0.90, 1.0], [1, 0], { clamp: true });

  // Track-fill bar
  const trackFill = useTransform(activeProgress, [0, 1], [0, 1], { clamp: true });

  return (
    // OUTER — 300svh tall. This is the scroll runway.
    // sticky inner "locks" the viewport while user scrolls through all 300svh.
    <section
      ref={outerRef}
      aria-label="Interactive 3D orbital showcase"
      className="relative h-[300svh] bg-background w-full"
    >
      {/* INNER — sticky full-screen cinema. overflow-hidden prevents x-bleed from moon entry. */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">

        {/* Deep-space ambient glow */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute inset-0 pointer-events-none z-0"
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[700px] h-[700px] rounded-full bg-primary/10 blur-[140px]" />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full
                          bg-secondary/8 blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] rounded-full
                          bg-accent/5 blur-[120px]" />
        </motion.div>

        {/* Main content — fades at section exit */}
        <motion.div
          style={{ opacity: sectionFade }}
          className="relative w-full h-full flex flex-col justify-center items-center z-10"
        >
          {/* LunarGravityCard: internal animations are fully driven by this 0→1 progress value.
              Nothing inside the component has been changed. */}
          <div className="w-full h-full flex items-center justify-center">
            <LunarGravityCard scrollProgress={activeProgress} />
          </div>

          {/* Sidebar progress track — desktop only */}
          <div
            className="absolute left-5 top-1/2 -translate-y-1/2
                       hidden md:flex flex-col items-center gap-3 z-20 pointer-events-none"
            aria-hidden="true"
          >
            <div className="relative w-[2px] h-24 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                style={{ scaleY: trackFill }}
                className="absolute top-0 left-0 w-full h-full
                           bg-gradient-to-b from-accent to-primary origin-top rounded-full"
              />
            </div>
            {STAGES.map((stage) => (
              <StageDot key={stage} stage={stage} progress={springProgress} />
            ))}
          </div>

          {/* Scroll hint — vanishes once the user scrolls */}
          <motion.div
            style={{ opacity: hintOpacity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
            aria-hidden="true"
          >
            <ScrollHint />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
