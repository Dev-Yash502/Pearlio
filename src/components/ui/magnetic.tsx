"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    // Only activate magnetic effect on devices that support hover (desktop) 
    // and that don't prefer reduced motion
    setIsHoverDevice(window.matchMedia('(hover: hover)').matches);
    setPrefersReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHoverDevice || prefersReduced) return;
    const el = ref.current;
    if (!el) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = el.getBoundingClientRect();

    // Calculate center of element
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Calculate distance from mouse to center
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Attract element slightly (e.g. 35% of the distance)
    setPosition({ x: distanceX * 0.35, y: distanceY * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  // On non-hover devices or reduced motion, render children directly without motion wrapper
  if (!isHoverDevice || prefersReduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
