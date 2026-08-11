"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { Activity, Cpu, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import Magnetic from "@/components/ui/magnetic";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisible = useInView(containerRef);

  const [loading, setLoading] = useState(true);
  const [loadPercent, setLoadPercent] = useState(0);

  const framesRef = useRef<ImageBitmap[]>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);

  // Track the scroll progress of the Hero section container (pinned scroll story)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Extract frames from the fish video in the browser background on mount
  useEffect(() => {
    let active = true;

    // Create a hidden video element to decode mp4 frames locally
    const video = document.createElement("video");
    // FIX: Set event handler BEFORE setting src to avoid race condition where
    // metadata fires synchronously (e.g. cached video on iOS Safari)
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const FRAME_COUNT = 150; // Extract 150 high-quality frames for buttery smooth scroll scrub
    const tempFrames: ImageBitmap[] = [];

    const extractFrames = async () => {
      // Wait for video to load metadata — handler set before src assignment
      await new Promise<void>((resolve) => {
        if (video.readyState >= 1) {
          resolve();
        } else {
          video.addEventListener('loadedmetadata', () => resolve(), { once: true });
        }
      });

      const duration = video.duration;
      const step = duration / FRAME_COUNT;

      for (let i = 0; i < FRAME_COUNT; i++) {
        if (!active) return;

        const targetTime = i * step;
        video.currentTime = targetTime;

        // FIX: Use addEventListener with { once: true } instead of assigning onseeked
        // directly — overwriting onseeked inside a loop drops events from prior seeks.
        await new Promise<void>((resolve) => {
          video.addEventListener('seeked', () => resolve(), { once: true });
        });

        // Capture frame as hardware-accelerated ImageBitmap
        try {
          const bitmap = await createImageBitmap(video);
          tempFrames.push(bitmap);
        } catch (e) {
          console.error("Failed to capture frame at index:", i, e);
        }

        // Update progress percentage
        setLoadPercent(Math.round(((i + 1) / FRAME_COUNT) * 100));
      }

      if (active) {
        framesRef.current = tempFrames;
        setLoading(false);
      }
    };

    // Now set src (after handlers attached)
    video.src = "/fish-video.mp4";

    extractFrames().catch((err) => {
      console.error("Failed to extract video frames:", err);
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      video.src = "";
      // FIX: Close all ImageBitmaps to release GPU memory
      framesRef.current.forEach((b) => b.close());
      framesRef.current = [];
    };
  }, []);

  // Frame drawing function (object-fit: cover equivalent)
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const bitmap = framesRef.current[frameIndex];
    if (!bitmap) return;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = bitmap.width / bitmap.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Handle canvas resizing
  useEffect(() => {
    if (loading) return;

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(Math.round(currentFrameRef.current));
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Initial size

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [loading]);

  // Sync scroll progress directly to targetFrameRef
  useEffect(() => {
    if (loading) return;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Map scroll fraction [0 -> 1] to frames count [0 -> 149]
      targetFrameRef.current = Math.min(
        framesRef.current.length - 1,
        Math.max(0, Math.floor(latest * framesRef.current.length))
      );
    });

    return () => {
      unsubscribe();
    };
  }, [loading, scrollYProgress]);

  // Buttery-smooth rendering loop using LERP damping
  useEffect(() => {
    if (loading) return;

    let animationFrameId: number;

    const syncVideoFrame = () => {
      // FIX: When not visible, still reschedule the next frame — do NOT return early
      // without rescheduling, or the loop permanently dies and canvas freezes when
      // the user scrolls back to the Hero section.
      if (isVisible) {
        const diff = Math.abs(targetFrameRef.current - currentFrameRef.current);

        if (diff > 0.05) {
          // Damping factor of 0.15 for high-end organic scroll-linked easing
          currentFrameRef.current = currentFrameRef.current + (targetFrameRef.current - currentFrameRef.current) * 0.15;
          drawFrame(Math.round(currentFrameRef.current));
        } else if (currentFrameRef.current !== targetFrameRef.current) {
          currentFrameRef.current = targetFrameRef.current;
          drawFrame(Math.round(currentFrameRef.current));
        }
      }

      animationFrameId = requestAnimationFrame(syncVideoFrame);
    };

    animationFrameId = requestAnimationFrame(syncVideoFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [loading, isVisible]);

  // Background display text opacity mapping
  const ghostOpacity = useTransform(scrollYProgress, [0.0, 0.25], [0.05, 0.0], { clamp: true });
  
  // Global exit fade for everything inside sticky view (fades out completely BEFORE unpinning at 0.375)
  const globalContentOpacity = useTransform(scrollYProgress, [0.25, 0.37], [1, 0], { clamp: true });

  return (
    <div ref={containerRef} className="relative h-[160vh] bg-background w-full">
      {/* Sticky container that keeps canvas and texts locked until animation finishes */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden z-10">
        
        {/* Preloader overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full bg-background flex flex-col items-center justify-center z-[9999]"
              role="status"
              aria-live="polite"
              aria-label={`Loading: ${loadPercent}%`}
            >
              <div className="flex flex-col items-center gap-4">
                {/* FIX: Use border-2 + border-transparent + override t and r sides for correct cross-browser spinner */}
                <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-spin flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent animate-pulse" aria-hidden="true" />
                </div>
                <div className="font-heading font-black text-2xl text-white tracking-widest" aria-hidden="true">
                  PEARLIO<span className="text-secondary">.</span>
                </div>
                <div className="text-sm font-semibold font-mono text-textMuted">
                  DECODING VISUAL FLOW <span className="text-accent">{loadPercent}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Localized 60fps hardware-accelerated Canvas background */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover z-0 bg-background"
          style={{ opacity: loading ? 0 : 1, transition: "opacity 0.5s ease" }}
        />

        {/* Cinematic dark/gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent z-[1] pointer-events-none" />
        <div className="absolute inset-0 bg-background/25 backdrop-blur-[1px] z-[1] pointer-events-none" />

        {/* Giant Background display text — decorative, hidden from screen readers */}
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1]">
          <motion.span
            style={{ opacity: ghostOpacity }}
            className="font-display font-black text-white leading-none whitespace-nowrap text-[120px] sm:text-[24vw] tracking-tighter"
          >
            PEARLIO
          </motion.span>
        </div>

        {/* Hero Content Layer */}
        <motion.div 
          style={{ opacity: globalContentOpacity }}
          className="relative z-10 flex flex-col justify-between h-[calc(100vh-80px)] mt-20 px-6 pb-12 pt-8 sm:pb-16 sm:pt-12 md:px-12 md:pb-20 lg:px-16 w-full max-w-7xl mx-auto"
        >
          
          {/* Top Section */}
          <div className="max-w-3xl text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={loading ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border/80 text-xs sm:text-sm text-textPrimary mb-6 shadow-glow-primary/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span className="font-semibold uppercase tracking-wider">3D Web Engineering Agency</span>
            </motion.div>
            
            {/* Heading */}
            <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-[1.05] overflow-hidden py-1">
              <motion.span
                initial={{ opacity: 0, y: 35 }}
                animate={loading ? { opacity: 0, y: 35 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                Shaping visual <br />
                narratives, <br />
                one pixel at a time.
              </motion.span>
            </h1>
          </div>

          {/* Bottom Section */}
          <div className="max-w-xl text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={loading ? { opacity: 0, y: 20 } : { opacity: 0.85, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-sm sm:text-base md:text-lg leading-relaxed text-textMuted mb-6 font-medium"
            >
              We combine high-performance WebGL/Three.js engineering with bold design aesthetics to construct online assets that rank high, run fast, and look stunning. No boring templates. Just raw, high-impact results.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={loading ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Magnetic>
                <Link
                  href="#work"
                  className="relative inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold bg-white text-background hover:bg-accent hover:text-background hover:shadow-glow-accent hover:scale-105 active:scale-95 transition-all duration-300 text-sm sm:text-base group cursor-pointer"
                >
                  <span>Explore Work</span>
                  <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="#contact"
                  className="relative inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-white border-2 border-white/20 hover:border-white/80 hover:bg-white/5 hover:scale-105 active:scale-95 transition-all duration-300 text-sm sm:text-base cursor-pointer"
                >
                  <span>Book a Call</span>
                </Link>
              </Magnetic>
            </motion.div>
          </div>

        </motion.div>
      </div>

      {/* Floating Widget 1 - Left Side (Desktop Only) */}
      <motion.div
        style={{ opacity: globalContentOpacity }}
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="hidden lg:flex absolute left-12 bottom-24 z-20 items-center gap-3 px-4 py-3 rounded-2xl bg-card/65 backdrop-blur-lg border border-border/60 shadow-glow-primary/5 select-none"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Cpu className="w-5 h-5 animate-pulse" />
        </div>
        <div className="text-left">
          <div className="text-[10px] font-bold uppercase tracking-wider text-textMuted">R3F Scene status</div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>Interactive 3D Mesh</span>
          </div>
        </div>
      </motion.div>

      {/* Floating Widget 2 - Right Side (Desktop Only) */}
      <motion.div
        style={{ opacity: globalContentOpacity }}
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="hidden lg:flex absolute right-12 bottom-48 z-20 items-center gap-3 px-4 py-3 rounded-2xl bg-card/65 backdrop-blur-lg border border-border/60 shadow-glow-accent/5 select-none"
      >
        <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
          <Activity className="w-5 h-5" />
        </div>
        <div className="text-left">
          <div className="text-[10px] font-bold uppercase tracking-wider text-textMuted">Optimized Engine</div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
            <span>60FPS locked</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
