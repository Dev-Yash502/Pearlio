"use client";

import { useRef, useState, useEffect, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { Sparkles, Cpu, Wifi, Shield } from "lucide-react";

// ─── Scene URL constant — defined once, never recreated ───────────────────────
const SPLINE_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" as const;

// ─── SystemStatusBadge ────────────────────────────────────────────────────────
// Purely MotionValue-driven — zero React re-renders on scroll.
function SystemStatusBadge({ progress }: { progress: MotionValue<number> }) {
  const s0op = useTransform(progress, [0.00, 0.10, 0.28], [1, 1, 0], { clamp: true });
  const s1op = useTransform(progress, [0.20, 0.30, 0.48], [0, 1, 0], { clamp: true });
  const s2op = useTransform(progress, [0.42, 0.52, 0.72], [0, 1, 0], { clamp: true });
  const s3op = useTransform(progress, [0.68, 0.78, 1.00], [0, 1, 1], { clamp: true });

  const labels = [
    { op: s0op, text: "SYSTEM OFF",    color: "text-textMuted/50", dot: "bg-textMuted/40" },
    { op: s1op, text: "INITIALIZING…", color: "text-secondary/80", dot: "bg-secondary"    },
    { op: s2op, text: "PROCESSING…",   color: "text-primary/90",   dot: "bg-primary"      },
    { op: s3op, text: "SYSTEM ACTIVE", color: "text-accent",       dot: "bg-accent"       },
  ];

  return (
    <div className="relative flex items-center gap-2 px-3 py-1 rounded-full
                    bg-card/60 border border-border/70 backdrop-blur-md w-fit overflow-hidden">
      {labels.map(({ op, text, color, dot }) => (
        <motion.span
          key={text}
          style={{ opacity: op }}
          className={`absolute inset-0 flex items-center gap-2 px-3 py-1 ${color}`}
        >
          <span className={`w-2 h-2 rounded-full ${dot} animate-pulse`} />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest whitespace-nowrap">
            {text}
          </span>
        </motion.span>
      ))}
      {/* Invisible width spacer */}
      <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-0 whitespace-nowrap">
        SYSTEM ACTIVE
      </span>
    </div>
  );
}

// ─── ScanLine ─────────────────────────────────────────────────────────────────
// Appears only during the processing phase, then stops — no continuous filter.
function ScanLine({ progress }: { progress: MotionValue<number> }) {
  const op = useTransform(progress, [0.28, 0.42, 0.70, 0.82], [0, 0.35, 0.35, 0], { clamp: true });
  return (
    <motion.div
      style={{ opacity: op }}
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="w-full h-full"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,92,246,0.04) 3px, rgba(139,92,246,0.04) 4px)",
        }}
      />
    </motion.div>
  );
}

// ─── CornerMarks ──────────────────────────────────────────────────────────────
function CornerMarks({ progress }: { progress: MotionValue<number> }) {
  const op = useTransform(progress, [0.28, 0.45, 0.90, 1.0], [0, 0.6, 0.6, 0], { clamp: true });
  return (
    <motion.div style={{ opacity: op }} className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
      {(["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"] as const).map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-5 h-5 ${["", "rotate-90", "-rotate-90", "rotate-180"][i]}`}>
          <div className="absolute top-0 left-0 w-5 h-[1.5px] bg-accent/50" />
          <div className="absolute top-0 left-0 w-[1.5px] h-5 bg-accent/50" />
        </div>
      ))}
    </motion.div>
  );
}

// ─── Individual readout row — each is its own component so hooks are legal ────
// This avoids the hooks-inside-.map() anti-pattern that was causing hidden
// render loop issues in the previous implementation.
const READOUT_DEFS = [
  { Icon: Cpu,    label: "RENDER", value: "WebGL 2.0", entryStart: 0.40 },
  { Icon: Wifi,   label: "STREAM", value: "Live",      entryStart: 0.45 },
  { Icon: Shield, label: "SHADER", value: "FXAA ON",   entryStart: 0.50 },
] as const;

function ReadoutRow({
  Icon,
  label,
  value,
  entryStart,
  progress,
}: {
  Icon: React.FC<{ className?: string }>;
  label: string;
  value: string;
  entryStart: number;
  progress: MotionValue<number>;
}) {
  const op = useTransform(
    progress,
    [entryStart, entryStart + 0.12, 0.88, 0.97],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const y = useTransform(progress, [entryStart, entryStart + 0.12], [10, 0], { clamp: true });

  return (
    <motion.div
      style={{ opacity: op, y }}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg
                 bg-background/70 border border-border/50 backdrop-blur-sm"
    >
      <Icon className="w-3 h-3 text-accent/70 shrink-0" />
      <span className="text-[9px] font-mono uppercase tracking-widest text-textMuted/60">{label}</span>
      <span className="text-[9px] font-mono font-bold text-accent/90 ml-auto">{value}</span>
    </motion.div>
  );
}

function DataReadouts({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="flex flex-col gap-2 pointer-events-none select-none">
      {READOUT_DEFS.map((def) => (
        <ReadoutRow key={def.label} {...def} progress={progress} />
      ))}
    </div>
  );
}

// ─── Persistent Spline scene — memoised to prevent any prop-driven remount ────
// SplineScene is expensive. Wrap it in memo so its parent's MotionValue
// changes never reach it as prop changes (the parent wrapper moves, not Spline).
const PersistentSplineScene = memo(function PersistentSplineScene() {
  return (
    <SplineScene
      scene={SPLINE_SCENE_URL}
      className="w-full h-full"
    />
  );
});
PersistentSplineScene.displayName = "PersistentSplineScene";

// ─── Main RobotSplineSection ──────────────────────────────────────────────────
export default function RobotSplineSection() {
  const outerRef  = useRef<HTMLDivElement>(null);
  const sceneRef  = useRef<HTMLDivElement>(null);

  // ── IntersectionObserver: load Spline when section is 200px from viewport ──
  // Spline stays mounted once shown — never destroyed/recreated during scroll.
  // The observer only controls the FIRST mount, not ongoing visibility.
  const [splineVisible, setSplineVisible] = useState(false);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSplineVisible(true);
          observer.disconnect(); // fire once — keep Spline mounted forever after
        }
      },
      // Start loading 50% of a viewport-height before the section enters view
      { rootMargin: "50% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Scroll tracking (MotionValues only — zero setState on scroll) ──────────
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Spring: stiffness/damping tuned for "responsive but cinematic" feel
  const sp = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 24,
    restDelta: 0.0005,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // ANIMATION TIMELINE — all values are MotionValues, no React state on scroll
  //
  //  0%   SYSTEM OFF      — scene outside viewport (right + below), invisible
  //  15%  SYSTEM ENTERS   — begins flying in, opacity rises
  //  30%  INITIALIZATION  — reaches position; text reveals
  //  50%  PROCESSING      — subtle parallax/drift; data readouts appear
  //  70%  ACTIVE STATE    — scene fully established
  //  85%  FULL ACTIVATION — final visual state (x:0 y:0 scale:1)
  //  100% RELEASE         — sticky exits, section fades
  //
  // All x/y values use NUMERIC pixels — no string units — so Framer Motion
  // can interpolate without layout recalculation.
  // ══════════════════════════════════════════════════════════════════════════

  // Spline wrapper — outer translate/scale/opacity
  const sceneX      = useTransform(sp, [0, 0.15, 0.50, 0.85, 1.0], [160, 80, 0, 0, -8], { clamp: true });
  const sceneY      = useTransform(sp, [0, 0.15, 0.50, 0.85],       [80,  40, 0, 0],     { clamp: true });
  const sceneScale  = useTransform(sp, [0, 0.15, 0.50, 0.85],       [0.78, 0.88, 1.0, 1.0], { clamp: true });
  const sceneOpacity = useTransform(sp, [0, 0.08, 0.30],             [0,   0.3,  1],      { clamp: true });

  // Inner — rotateY (perspective depth during entry) + processing drift
  // rotateY stops animating at 0.85, preventing any expensive mid-scroll 3D
  const sceneRotateY   = useTransform(sp, [0, 0.50, 0.85], [8, 2, 0], { clamp: true });
  const sceneProcessX  = useTransform(sp, [0.48, 0.70, 0.85], [0, -12, 0], { clamp: true });

  // Text column
  const badgeOp  = useTransform(sp, [0.06, 0.22], [0, 1], { clamp: true });
  const badgeY   = useTransform(sp, [0.06, 0.22], [24, 0], { clamp: true });
  const titleOp  = useTransform(sp, [0.12, 0.30], [0, 1], { clamp: true });
  const titleY   = useTransform(sp, [0.12, 0.30], [36, 0], { clamp: true });
  const titleX   = useTransform(sp, [0.12, 0.30], [-20, 0], { clamp: true });
  const descOp   = useTransform(sp, [0.18, 0.38], [0, 0.85], { clamp: true });
  const descY    = useTransform(sp, [0.18, 0.38], [24, 0], { clamp: true });
  // Parallax stops at 0.72 — no continuous animation during ACTIVE phase
  const textParallaxY = useTransform(sp, [0.45, 0.72], [0, -18], { clamp: true });

  // Section exit (last 7%)
  const sectionFade = useTransform(sp, [0.93, 1.0], [1, 0], { clamp: true });

  return (
    // OUTER — 350svh scroll runway
    <div
      ref={outerRef}
      className="relative h-[350svh] bg-background w-full"
    >
      {/* STICKY VIEWPORT — overflow-hidden prevents any horizontal bleed */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">

        {/* ── Static background atmosphere — NOT animated, paint once ─── */}
        {/* These blobs are static — no MotionValue drives them, zero repaint cost */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2
                          w-[600px] h-[600px] rounded-full bg-primary/6 blur-[130px]" />
          <div className="absolute bottom-0 left-1/4
                          w-[400px] h-[400px] rounded-full bg-accent/5 blur-[110px]" />
          <div className="absolute top-0 left-0
                          w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[90px]" />
        </div>

        {/* ── Main layout — fades only at section exit ─────────────────── */}
        <motion.div
          style={{ opacity: sectionFade }}
          className="relative w-full h-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16
                     flex flex-col md:flex-row items-center justify-between z-10 gap-8 md:gap-0"
        >
          {/* Mouse-tracking spotlight */}
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />

          {/* ══════════════════════════════════════════════════════
              LEFT COLUMN — Text
          ══════════════════════════════════════════════════════ */}
          <motion.div
            style={{ y: textParallaxY }}
            className="w-full md:w-[42%] lg:w-[40%] flex flex-col justify-center
                       text-left relative z-20 pointer-events-none shrink-0 order-2 md:order-1"
          >
            <motion.div style={{ opacity: badgeOp, y: badgeY }} className="mb-5 w-fit">
              <SystemStatusBadge progress={sp} />
            </motion.div>

            <motion.h2
              style={{ opacity: titleOp, y: titleY, x: titleX }}
              className="font-heading font-black text-4xl md:text-5xl lg:text-6xl
                         tracking-tight text-white mb-5 leading-[1.05]"
            >
              Interactive&nbsp;<br />
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                3D&nbsp;UI Scenes.
              </span>
            </motion.h2>

            <motion.p
              style={{ opacity: descOp, y: descY }}
              className="text-sm sm:text-base leading-relaxed text-textMuted mb-8 font-semibold max-w-md"
            >
              Bring your landing page to life with custom WebGL and Spline scenes.
              We construct lightweight, hardware-accelerated 3D elements that engage
              visitors, decrease bounce rates, and turn static pages into digital narratives.
            </motion.p>

            <DataReadouts progress={sp} />
          </motion.div>

          {/* ══════════════════════════════════════════════════════
              RIGHT COLUMN — Spline 3D Scene
          ══════════════════════════════════════════════════════ */}

          {/*
           * OUTER wrapper: x / y / scale / opacity — all GPU-composited transforms.
           * Canvas dimensions (w-full h-full) NEVER change during animation.
           * will-change hints to the browser to promote this layer to the GPU
           * before any scroll event fires.
           */}
          <motion.div
            ref={sceneRef}
            style={{
              x: sceneX,
              y: sceneY,
              scale: sceneScale,
              opacity: sceneOpacity,
              perspective: "1200px",
              willChange: "transform, opacity",
            }}
            className="w-full md:w-[58%] lg:w-[60%] relative
                       h-[55vw] min-h-[320px] max-h-[560px]
                       md:h-full md:max-h-none
                       pointer-events-auto order-1 md:order-2"
          >
            {/*
             * INNER wrapper: rotateY (perspective depth) + processing drift.
             * Separated so the outer perspective: 1200px applies correctly.
             * willChange promoted here too since rotateY is the heaviest transform.
             */}
            <motion.div
              style={{
                rotateY: sceneRotateY,
                x: sceneProcessX,
                willChange: "transform",
              }}
              className="w-full h-full relative"
            >
              {/* Corner HUD brackets */}
              <CornerMarks progress={sp} />

              {/* Scan-line overlay (opacity only, no filter) */}
              <ScanLine progress={sp} />

              {/*
               * PersistentSplineScene:
               * - memo() prevents re-render when parent MotionValues change
               * - Only mounts once (when splineVisible = true)
               * - NEVER unmounts after that — conditional is one-way gate
               * - Scene URL is a module-level constant — never a new reference
               */}
              {splineVisible && <PersistentSplineScene />}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
