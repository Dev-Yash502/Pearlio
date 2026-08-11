"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  // FIX: Use null as initial state to defer rendering until client-side detection completes.
  // Previously useState(true) caused a flash on desktop: cursor was hidden for 1 frame
  // before useEffect corrected it (SSR/hydration mismatch).
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [hoveredEl, setHoveredEl] = useState(false);

  // Mouse coordinates motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth out coordinate tracking with spring dynamics
  const springConfig = { damping: 30, stiffness: 280, mass: 0.6 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device supports hover (desktop only)
    const mediaQuery = window.matchMedia("(hover: hover)");
    setIsMobile(!mediaQuery.matches);

    if (!mediaQuery.matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);

    // Track mouse hover state on interactive tags
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".cursor-pointer")
      ) {
        setHoveredEl(true);
      } else {
        setHoveredEl(false);
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // null = not yet detected (SSR / pre-hydration), true = mobile, false = desktop
  if (isMobile !== false) return null;

  return (
    <>
      {/* Outer fluid trailing ring */}
      <motion.div
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
        }}
        animate={{
          width: hoveredEl ? 48 : 24,
          height: hoveredEl ? 48 : 24,
          backgroundColor: hoveredEl ? "rgba(0, 240, 255, 0.08)" : "rgba(255, 255, 255, 0.0)",
          borderColor: hoveredEl ? "rgba(0, 240, 255, 0.8)" : "rgba(255, 255, 255, 0.25)",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="fixed top-0 left-0 border border-white/25 rounded-full pointer-events-none z-[99999] mix-blend-difference"
      />

      {/* Inner precise dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
        }}
        animate={{
          scale: hoveredEl ? 1.8 : 1.0,
          backgroundColor: hoveredEl ? "#00F0FF" : "#ffffff",
        }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[99999] mix-blend-difference"
      />
    </>
  );
}
