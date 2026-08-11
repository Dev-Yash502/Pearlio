"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const FRAME_COUNT = 240;

const pad = (num: number) => String(num).padStart(3, "0");
const frameUrl = (index: number) => `/Frames/ezgif-frame-${pad(index)}.jpg`;

export default function ScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentIndexRef = useRef(0);
  const targetIndexRef = useRef(0);
  const requestRef = useRef<number | null>(null);

  // Preload all frames on mount
  useEffect(() => {
    let active = true;
    let loaded = 0;
    const preloadedImages: HTMLImageElement[] = [];

    const loadImages = async () => {
      const promises = Array.from({ length: FRAME_COUNT }, (_, i) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = frameUrl(i + 1);
          img.onload = () => {
            if (!active) return;
            loaded++;
            setLoadedCount(loaded);
            resolve();
          };
          img.onerror = () => {
            if (!active) return;
            console.error(`Failed to load frame: ${i + 1}`);
            loaded++;
            setLoadedCount(loaded);
            resolve();
          };
          preloadedImages[i] = img;
        });
      });

      await Promise.all(promises);
      if (active) {
        imagesRef.current = preloadedImages;
        setIsLoaded(true);
      }
    };

    loadImages();

    return () => {
      active = false;
    };
  }, []);

  // Frame drawing logic (object-fit: cover equivalent)
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const img = imagesRef.current[index];
    if (!img) return;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;

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
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Resize canvas handler
  useEffect(() => {
    if (!isLoaded) return;

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(Math.round(currentIndexRef.current));
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Initial size

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isLoaded]);

  // Scroll listener mapping scroll depth to target frame index
  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;
      const scrollFraction = maxScroll > 0 ? scrollTop / maxScroll : 0;
      
      // Map scrollFraction (0 to 1) to frame indices (0 to 239)
      targetIndexRef.current = Math.min(
        FRAME_COUNT - 1,
        Math.floor(scrollFraction * FRAME_COUNT)
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Set initial target

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoaded]);

  // Smooth rendering loop using LERP (Linear Interpolation)
  useEffect(() => {
    if (!isLoaded) return;

    const renderLoop = () => {
      const diff = Math.abs(targetIndexRef.current - currentIndexRef.current);

      if (diff > 0.05) {
        // Buttery smooth movement interpolation (0.1 damping factor)
        currentIndexRef.current = currentIndexRef.current + (targetIndexRef.current - currentIndexRef.current) * 0.1;
        drawFrame(Math.round(currentIndexRef.current));
      } else if (currentIndexRef.current !== targetIndexRef.current) {
        currentIndexRef.current = targetIndexRef.current;
        drawFrame(Math.round(currentIndexRef.current));
      }

      requestRef.current = requestAnimationFrame(renderLoop);
    };

    requestRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isLoaded]);

  const loadPercent = Math.min(100, Math.floor((loadedCount / FRAME_COUNT) * 100));

  return (
    <>
      {/* Dynamic Loader Screen */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 w-screen h-screen bg-[#0A0915] flex flex-col items-center justify-center z-[9999]"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border-t-2 border-primary border-r-2 border-transparent animate-spin flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent animate-pulse" />
              </div>
              <div className="font-heading font-black text-2xl text-white tracking-widest">
                PEARLIO<span className="text-secondary">.</span>
              </div>
              <div className="text-sm font-semibold font-mono text-textMuted">
                LOADING 3D SPACE <span className="text-accent">{loadPercent}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen-Fixed Background Canvas */}
      <canvas
        ref={canvasRef}
        id="animation-canvas"
        className="fixed inset-0 w-screen h-screen object-cover z-0 pointer-events-none bg-[#0A0915]"
        style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.5s ease" }}
      />
    </>
  );
}
