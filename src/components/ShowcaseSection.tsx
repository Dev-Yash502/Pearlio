"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import dynamic from "next/dynamic";
import { MousePointer2 } from "lucide-react";

// Dynamically import — R3F/Three.js must be client-only
const LunarGravityCard = dynamic(
  () => import("@/components/ui/lunar-gravity-card"),
  {
    ssr: false,
    loading: () => <div className="w-full h-[600px]" aria-hidden="true" />,
  }
);

// ─── Animated chevron hint (beginning of section) ─────────────────────────────
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

// ─── Stage dot ────────────────────────────────────────────────────────────────
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

  // Tracks whether rings have completed and the Moon interaction phase is active.
  // Updated via useMotionValueEvent — properly reverses when user scrolls back.
  const [interactionEnabled, setInteractionEnabled] = useState(false);

  // ── Scroll tracking ──────────────────────────────────────────────────────
  // h-[400svh] gives:
  //   0–75%   → Moon entry + full ring animation
  //   75–88%  → Ring completion hold + instruction reveal
  //   88–100% → Interaction phase + section release
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Spring for cinematic smoothing
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 22,
    restDelta: 0.0005,
  });

  // Reduced-motion: skip journey, go straight to completed state
  const staticProgress = useMotionValue(1.0);
  const activeProgress = prefersReducedMotion ? staticProgress : springProgress;

  // ── Interaction phase gate (82% of total scroll = rings complete) ──────────
  // useMotionValueEvent keeps this in sync even during reverse scroll.
  useMotionValueEvent(activeProgress, "change", (v) => {
    setInteractionEnabled(v >= 0.82);
  });

  // ── Moon animation progress ────────────────────────────────────────────────
  // The first 82% of total scroll maps to 0→1 for the LunarGravityCard.
  // After 82%, moonProgress stays clamped at 1.0 — rings fully formed, Moon stable.
  const moonProgress = useTransform(activeProgress, [0, 0.82], [0, 1], { clamp: true });

  // ── Derived values ─────────────────────────────────────────────────────────
  // Scroll hint: visible at start, fades as user begins scrolling
  const hintOpacity = useTransform(activeProgress, [0, 0.10, 0.18], [1, 1, 0], { clamp: true });

  // Ambient glow: intensifies with the orbital scene
  const glowOpacity = useTransform(activeProgress, [0, 0.5, 1.0], [0.03, 0.08, 0.14], { clamp: true });

  // Full section exit fade at the very end
  const sectionFade = useTransform(activeProgress, [0.94, 1.0], [1, 0], { clamp: true });

  // Track-bar fill
  const trackFill = useTransform(activeProgress, [0, 1], [0, 1], { clamp: true });

  // ── Interaction instruction ────────────────────────────────────────────────
  // Fades in after ring completion (82%→90%), then lets sectionFade handle exit.
  const instructionOp = useTransform(activeProgress, [0.82, 0.91], [0, 1], { clamp: true });
  const instructionY  = useTransform(activeProgress, [0.82, 0.91], [18, 0], { clamp: true });

  // Pulse ring behind instruction (visual emphasis)
  const pulseOp = useTransform(activeProgress, [0.84, 0.93], [0, 1], { clamp: true });

  return (
    // OUTER — 400svh scroll runway.
    // 400svh ÷ 100vh = 4 screens. The sticky inner holds for 3 extra screen-heights of scroll.
    <section
      ref={outerRef}
      aria-label="Interactive 3D orbital showcase"
      className="relative h-[400svh] bg-background w-full"
    >
      {/* INNER — sticky, full-screen. overflow-hidden blocks any x-bleed from Moon entry. */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">

        {/* ── Deep-space ambient glow ──────────────────────────────────── */}
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

        {/* ── Main content — fades at section exit ─────────────────────── */}
        <motion.div
          style={{ opacity: sectionFade }}
          className="relative w-full h-full flex flex-col justify-center items-center z-10"
        >

          {/* LunarGravityCard ─────────────────────────────────────────────
              Receives moonProgress (0→1 over first 82% of total scroll).
              After 82% moonProgress is locked at 1.0 — rings complete, Moon visible.
              interactionEnabled enables OrbitControls rotation for Moon grab. */}
          <div className="w-full h-full flex items-center justify-center relative">
            <LunarGravityCard
              scrollProgress={moonProgress}
              interactionEnabled={interactionEnabled}
            />

            {/* ── Post-ring interaction instruction ──────────────────── */}
            {/* Fades in once rings are complete at 82%+ of scroll */}
            <motion.div
              style={{ opacity: instructionOp, y: instructionY }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
              aria-live="polite"
            >
              {/* Outer pulse ring — subtle attention-grabber */}
              <motion.div
                style={{ opacity: pulseOp }}
                className="absolute inset-0 rounded-full border border-accent/20"
                animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Pill label */}
              <div className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-full
                              bg-background/80 backdrop-blur-md
                              border border-border/80 shadow-2xl shadow-primary/10">
                <MousePointer2 className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="text-xs font-semibold text-textPrimary whitespace-nowrap">
                  Use your cursor to grab and rotate the Moon
                </span>
                {/* Animated cursor dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              </div>
            </motion.div>
          </div>

          {/* ── Sidebar progress track (desktop) ─────────────────────── */}
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

          {/* ── Scroll hint (section start only) ────────────────────── */}
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
