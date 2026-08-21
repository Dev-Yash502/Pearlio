"use client";

import { useRef } from "react";
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

// ─── Scroll-progress-aware status bar pill ────────────────────────────────────
// Renders a tiny system-status badge whose text reflects the current stage.
// Driven purely by MotionValues — zero re-renders on scroll.
function SystemStatusBadge({ progress }: { progress: MotionValue<number> }) {
  // Four stages shown as overlapping opacity fades — no useState needed.
  const s0op = useTransform(progress, [0.00, 0.10, 0.28], [1, 1, 0], { clamp: true });
  const s1op = useTransform(progress, [0.20, 0.30, 0.48], [0, 1, 0], { clamp: true });
  const s2op = useTransform(progress, [0.42, 0.52, 0.72], [0, 1, 0], { clamp: true });
  const s3op = useTransform(progress, [0.68, 0.78, 1.00], [0, 1, 1], { clamp: true });

  const labels = [
    { op: s0op, text: "SYSTEM OFF",         color: "text-textMuted/50",  dot: "bg-textMuted/40"  },
    { op: s1op, text: "INITIALIZING…",      color: "text-secondary/80",  dot: "bg-secondary"     },
    { op: s2op, text: "PROCESSING…",        color: "text-primary/90",    dot: "bg-primary"       },
    { op: s3op, text: "SYSTEM ACTIVE",      color: "text-accent",        dot: "bg-accent"        },
  ];

  return (
    <div className="relative flex items-center gap-2 px-3 py-1 rounded-full bg-card/60 border border-border/70 backdrop-blur-md w-fit overflow-hidden">
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
      {/* Invisible spacer to hold width */}
      <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-0 whitespace-nowrap">
        SYSTEM ACTIVE
      </span>
    </div>
  );
}

// ─── Subtle scan-line overlay on the Spline container ────────────────────────
function ScanLine({ progress }: { progress: MotionValue<number> }) {
  // Appears during the processing phase (30%–70%), then fades
  const op = useTransform(progress, [0.28, 0.42, 0.70, 0.82], [0, 0.35, 0.35, 0], { clamp: true });
  return (
    <motion.div
      style={{ opacity: op }}
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-inherit"
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

// ─── Corner HUD marks ─────────────────────────────────────────────────────────
// Simple L-shaped corner brackets, common in futuristic UI.
// Appear during INITIALIZATION and stay through ACTIVE.
function CornerMarks({ progress }: { progress: MotionValue<number> }) {
  const op = useTransform(progress, [0.28, 0.45, 0.90, 1.0], [0, 0.6, 0.6, 0], { clamp: true });
  const corners = ["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"];
  const rotations = ["", "rotate-90", "-rotate-90", "rotate-180"];

  return (
    <motion.div style={{ opacity: op }} className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
      {corners.map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-5 h-5 ${rotations[i]}`}>
          <div className="absolute top-0 left-0 w-5 h-[1.5px] bg-accent/50" />
          <div className="absolute top-0 left-0 w-[1.5px] h-5 bg-accent/50" />
        </div>
      ))}
    </motion.div>
  );
}

// ─── Mini data readouts floating beside the scene ─────────────────────────────
// Three subtle stats appear during PROCESSING. Framer-Motion opacity only.
const READOUTS = [
  { icon: Cpu,    label: "RENDER",  value: "WebGL 2.0" },
  { icon: Wifi,   label: "STREAM",  value: "Live"      },
  { icon: Shield, label: "SHADER",  value: "FXAA ON"   },
];

function DataReadouts({ progress }: { progress: MotionValue<number> }) {
  // Staggered entry per readout
  return (
    <div className="flex flex-col gap-2 pointer-events-none select-none">
      {READOUTS.map(({ icon: Icon, label, value }, i) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const entryStart = 0.40 + i * 0.05;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const op = useTransform(
          progress,
          [entryStart, entryStart + 0.12, 0.88, 0.97],
          [0, 1, 1, 0],
          { clamp: true }
        );
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const y = useTransform(progress, [entryStart, entryStart + 0.12], [10, 0], { clamp: true });

        return (
          <motion.div
            key={label}
            style={{ opacity: op, y }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg
                       bg-background/70 border border-border/50 backdrop-blur-sm"
          >
            <Icon className="w-3 h-3 text-accent/70 shrink-0" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-textMuted/60">{label}</span>
            <span className="text-[9px] font-mono font-bold text-accent/90 ml-auto">{value}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Main RobotSplineSection ──────────────────────────────────────────────────
export default function RobotSplineSection() {
  const outerRef = useRef<HTMLDivElement>(null);

  // ── Scroll tracking ────────────────────────────────────────────────────────
  // 0 → section-top hits viewport-top (sticky locks)
  // 1 → section-bottom hits viewport-bottom (sticky releases)
  // With h-[350svh] the user has ~250svh of runway inside the pin.
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // ── Spring: cinematic smoothing ────────────────────────────────────────────
  const sp = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 24,
    restDelta: 0.0005,
  });

  // ══════════════════════════════════════════════════════════════════════
  // ANIMATION TIMELINE  (all values driven by spring `sp`)
  //
  //  0%   SYSTEM OFF     — scene outside viewport, invisible
  //  15%  SYSTEM ENTERS  — scene begins flying in from right/bottom
  //  30%  INITIALIZATION — scene reaches position, text reveals
  //  50%  PROCESSING     — subtle parallax, readouts appear
  //  70%  ACTIVE STATE   — scene fully established
  //  85%  FULL ACTIVE    — final polish state
  //  100% RELEASE        — sticky exits, next section visible
  // ══════════════════════════════════════════════════════════════════════

  // ── Spline scene container transforms ─────────────────────────────────────
  // x: starts right (+14vw-equivalent in px), eases to final position
  const sceneX = useTransform(sp, [0, 0.15, 0.50, 0.85, 1.0], ["160px", "90px", "0px", "0px", "-8px"], { clamp: true });
  // y: starts lower, rises into position
  const sceneY = useTransform(sp, [0, 0.15, 0.50, 0.85], ["80px", "40px", "0px", "0px"], { clamp: true });
  // scale: starts small, grows to full
  const sceneScale = useTransform(sp, [0, 0.15, 0.50, 0.85], [0.78, 0.88, 1.0, 1.0], { clamp: true });
  // opacity: fades in during entry
  const sceneOpacity = useTransform(sp, [0, 0.08, 0.30], [0, 0.3, 1], { clamp: true });
  // subtle rotation during entry (gives cinematic feel, not a slide)
  const sceneRotateY = useTransform(sp, [0, 0.50, 0.85], [8, 2, 0], { clamp: true });
  // processing-phase subtle floating drift
  const sceneProcessX = useTransform(sp, [0.48, 0.70, 0.85], [0, -12, 0], { clamp: true });

  // ── Left text column ───────────────────────────────────────────────────────
  const badgeOp  = useTransform(sp, [0.06, 0.22], [0, 1], { clamp: true });
  const badgeY   = useTransform(sp, [0.06, 0.22], [24, 0], { clamp: true });

  const titleOp  = useTransform(sp, [0.12, 0.30], [0, 1], { clamp: true });
  const titleY   = useTransform(sp, [0.12, 0.30], [36, 0], { clamp: true });
  const titleX   = useTransform(sp, [0.12, 0.30], [-20, 0], { clamp: true });

  const descOp   = useTransform(sp, [0.18, 0.38], [0, 0.85], { clamp: true });
  const descY    = useTransform(sp, [0.18, 0.38], [24, 0], { clamp: true });

  // Text subtly shifts during processing phase for parallax depth
  const textParallaxY = useTransform(sp, [0.45, 0.72], [0, -18], { clamp: true });

  // Full section exit fade (last 6%)
  const sectionFade = useTransform(sp, [0.93, 1.0], [1, 0], { clamp: true });

  return (
    // OUTER — 350svh scroll runway. sticky inner pins for the entire journey.
    <div
      ref={outerRef}
      className="relative h-[350svh] bg-background w-full"
    >
      {/* STICKY VIEWPORT */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">

        {/* ── Background atmosphere ───────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          {/* Primary purple nebula — center-right, matches where Spline scene lands */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2
                          w-[600px] h-[600px] rounded-full bg-primary/6 blur-[130px]" />
          {/* Secondary accent — bottom left */}
          <div className="absolute bottom-0 left-1/4
                          w-[400px] h-[400px] rounded-full bg-accent/5 blur-[110px]" />
          {/* Warm tone — top left, behind text */}
          <div className="absolute top-0 left-0
                          w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[90px]" />
        </div>

        {/* ── Main layout wrapper — fades at section exit ─────────────── */}
        <motion.div
          style={{ opacity: sectionFade }}
          className="relative w-full h-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16
                     flex flex-col md:flex-row items-center justify-between z-10 gap-8 md:gap-0"
        >
          {/* Spotlight: mouse-tracking fill for the whole composition */}
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />

          {/* ══════════════════════════════════════════════════════
              LEFT COLUMN — Text Copy
          ══════════════════════════════════════════════════════ */}
          <motion.div
            style={{ y: textParallaxY }}
            className="w-full md:w-[42%] lg:w-[40%] flex flex-col justify-center
                       text-left relative z-20 pointer-events-none shrink-0 order-2 md:order-1"
          >
            {/* System status badge — driven by scroll stage */}
            <motion.div style={{ opacity: badgeOp, y: badgeY }} className="mb-5 w-fit">
              <SystemStatusBadge progress={sp} />
            </motion.div>

            {/* Heading */}
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

            {/* Description */}
            <motion.p
              style={{ opacity: descOp, y: descY }}
              className="text-sm sm:text-base leading-relaxed text-textMuted
                         mb-8 font-semibold max-w-md"
            >
              Bring your landing page to life with custom WebGL and Spline scenes.
              We construct lightweight, hardware-accelerated 3D elements that engage
              visitors, decrease bounce rates, and turn static pages into digital
              narratives.
            </motion.p>

            {/* Data readouts — appear during processing phase */}
            <DataReadouts progress={sp} />
          </motion.div>

          {/* ══════════════════════════════════════════════════════
              RIGHT COLUMN — Spline 3D Scene
          ══════════════════════════════════════════════════════ */}
          <motion.div
            style={{
              x: sceneX,
              y: sceneY,
              scale: sceneScale,
              opacity: sceneOpacity,
              // CSS perspective gives the subtle rotateY real depth
              perspective: "1200px",
            }}
            className="w-full md:w-[58%] lg:w-[60%] relative
                       h-[55vw] min-h-[320px] max-h-[560px]
                       md:h-full md:max-h-none
                       pointer-events-auto order-1 md:order-2"
          >
            {/* Inner: applies the rotateY + processing drift separately so perspective works */}
            <motion.div
              style={{
                rotateY: sceneRotateY,
                x: sceneProcessX,
              }}
              className="w-full h-full relative"
            >
              {/* Corner bracket HUD marks */}
              <CornerMarks progress={sp} />

              {/* Scan-line processing overlay */}
              <ScanLine progress={sp} />

              {/* ── THE ACTUAL SPLINE SCENE — untouched ────────── */}
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
