"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Award } from "lucide-react";
import { TestimonialsColumn, TestimonialItem } from "@/components/ui/testimonials-columns-1";

const clientLogos = [
  { name: "VERTEX", icon: "▲" },
  { name: "ORBIT", icon: "●" },
  { name: "QUANTUM", icon: "■" },
  { name: "SYNERGY", icon: "◈" },
  { name: "VELOCITY", icon: "⚡" },
  { name: "APEX", icon: "◆" },
  { name: "NEXUS", icon: "❖" },
  { name: "KINETIC", icon: "✦" },
];

const testimonials: TestimonialItem[] = [
  // Column 1
  {
    text: "Pearlio rebuilt our product landing page in under 2 weeks. Conversions shot up from 2.4% to 7.8% on day one. Their design is literally a cheat code.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Liam Vance",
    role: "Founder, Vertex SaaS",
  },
  {
    text: "Our monthly active users spiked after the redesign. The speed optimizations they did are crazy—our Lighthouse score is 100 and it loads instantly on mobile.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Elena Rostova",
    role: "Growth Lead, Synergy",
  },
  {
    text: "We tried three different freelancers before finding Pearlio. Their engineering is top-tier and their design choices are bold. Zero regrets.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Daniel Kim",
    role: "CTO, Hyperion Labs",
  },
  // Column 2
  {
    text: "Most agencies build boring, carbon-copy templates. Pearlio built us an interactive 3D store that kept customers hooked. Session time doubled and sales increased by 42%.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Sophia Chen",
    role: "CEO, Orbit E-comm",
  },
  {
    text: "Their monthly maintenance add-on is worth every penny. If we need a new campaign page or layout update, they ship it in hours, not weeks.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Devon Carter",
    role: "Co-Founder, Velocity Pay",
  },
  {
    text: "We needed a complex dashboard with smooth custom charts. They shipped it ahead of schedule and with zero bugs. Excellent communication throughout.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Sarah Jenkins",
    role: "Product VP, Dashly",
  },
  // Column 3
  {
    text: "No long corporate meetings, no filler. They understand what startups need: speed, performance, and aggressive branding. The SEO setup got us on Google Page 1.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Marcus Miller",
    role: "CTO, Quantum Core",
  },
  {
    text: "The interactive 3D landing page they designed is a masterpiece. It literally makes people stop and interact. It's the best investment we made this year.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Amara Okoye",
    role: "Founder, Kinetic Studio",
  },
  {
    text: "From wireframe to deployment, the process was incredibly smooth. They are responsive, professional, and understand how to build high-converting UI.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Alex Mercer",
    role: "Founder, Prisma Creative",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function SocialProof() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(sectionRef, { margin: "30% 0px 30% 0px" });

  // Track scroll progress of the section relative to viewport (pinned scroll story)
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

  // Word by word scroll lighting reveals for header text (driven by spring progress)
  const w1 = useTransform(smoothProgress, [0.05, 0.2], [0.15, 1], { clamp: true });
  const w2 = useTransform(smoothProgress, [0.08, 0.23], [0.15, 1], { clamp: true });
  const w3 = useTransform(smoothProgress, [0.11, 0.26], [0.15, 1], { clamp: true });
  const w4 = useTransform(smoothProgress, [0.14, 0.29], [0.15, 1], { clamp: true });

  // Staggered words flying in from alternate sides (left/right)
  const w1X = useTransform(smoothProgress, [0.05, 0.2], [-120, 0], { clamp: true });
  const w2X = useTransform(smoothProgress, [0.08, 0.23], [120, 0], { clamp: true });
  const w3X = useTransform(smoothProgress, [0.11, 0.26], [-120, 0], { clamp: true });
  const w4X = useTransform(smoothProgress, [0.14, 0.29], [120, 0], { clamp: true });

  const subOpacity = useTransform(smoothProgress, [0.17, 0.32], [0.15, 1], { clamp: true });
  const subY = useTransform(smoothProgress, [0.17, 0.32], [15, 0], { clamp: true });
  const badgeOpacity = useTransform(smoothProgress, [0.0, 0.15], [0, 1], { clamp: true });

  // Logo Marquee transforms (slides in from the right)
  const marqueeOpacity = useTransform(smoothProgress, [0.15, 0.35, 0.85, 0.98], [0, 1, 1, 0], { clamp: true });
  const marqueeX = useTransform(smoothProgress, [0.15, 0.35], [400, 0], { clamp: true });

  // Staggered columns entries
  const col1X = useTransform(smoothProgress, [0.25, 0.45], [-80, 0], { clamp: true });
  const col1Y = useTransform(smoothProgress, [0.25, 0.45], [100, 0], { clamp: true });
  const col1Opacity = useTransform(smoothProgress, [0.25, 0.4], [0, 1], { clamp: true });

  const col2Y = useTransform(smoothProgress, [0.33, 0.53], [100, 0], { clamp: true });
  const col2Opacity = useTransform(smoothProgress, [0.33, 0.48], [0, 1], { clamp: true });

  const col3X = useTransform(smoothProgress, [0.41, 0.61], [80, 0], { clamp: true });
  const col3Y = useTransform(smoothProgress, [0.41, 0.61], [100, 0], { clamp: true });
  const col3Opacity = useTransform(smoothProgress, [0.41, 0.56], [0, 1], { clamp: true });

  // Global exit fade for everything inside sticky view
  const globalContentOpacity = useTransform(smoothProgress, [0.85, 0.98], [1, 0], { clamp: true });

  // Parallax vertical scrolls for the three columns (smooth, scroll-driven only)
  const col1ParallaxY = useTransform(smoothProgress, [0.2, 0.75], [0, -140], { clamp: true });
  const col2ParallaxY = useTransform(smoothProgress, [0.2, 0.75], [-120, 20], { clamp: true });
  const col3ParallaxY = useTransform(smoothProgress, [0.2, 0.75], [0, -180], { clamp: true });

  return (
    <div ref={sectionRef} className="relative h-[160vh] bg-background w-full">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden z-10 py-12 gpu-layer">
        {/* Background glow */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

        {/* Global Exit opacity motion wrapper */}
        <motion.div 
          style={{ opacity: globalContentOpacity }}
          className="max-w-7xl mx-auto px-6 relative z-10 text-center w-full flex flex-col justify-center h-full"
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              style={{ opacity: badgeOpacity }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border mb-4"
            >
              <Award className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-textPrimary">Client Success</span>
            </motion.div>
            
            <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight mb-4 text-white flex flex-wrap justify-center gap-x-3 gap-y-1 overflow-hidden py-2">
              <motion.span style={{ opacity: w1, x: w1X }} className="inline-block">Backed</motion.span>
              <motion.span style={{ opacity: w2, x: w2X }} className="inline-block">by</motion.span>
              <motion.span style={{ opacity: w3, x: w3X }} className="inline-block bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">bold</motion.span>
              <motion.span style={{ opacity: w4, x: w4X }} className="inline-block bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">brands.</motion.span>
            </h2>
            
            <motion.p 
              style={{ opacity: subOpacity, y: subY }}
              className="text-base sm:text-lg md:text-xl text-textMuted max-w-xl"
            >
              We partner with ambitious startups and small businesses to ship high-performance websites that deliver results.
            </motion.p>
          </div>

          {/* Infinite Logo Marquee */}
          <motion.div 
            style={{ opacity: marqueeOpacity, x: marqueeX }}
            className="relative w-full overflow-hidden py-4 border-y border-border/40 bg-card/20 backdrop-blur-sm mb-12 z-20 flex"
          >
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
            
            {/* FIX: Two side-by-side identical strips animate together from x=0 to x=-100%.
                When first strip exits left, the second (already in position) fills the gap seamlessly. */}
            <motion.div
              animate={{ x: ["0%", "-100%"] }}
              transition={{ ease: "linear", duration: 25, repeat: Infinity }}
              className="flex gap-12 select-none items-center shrink-0"
              aria-hidden="true"
            >
              {clientLogos.map((logo, idx) => (
                <div key={`strip1-${logo.name}-${idx}`} className="flex items-center gap-2.5 group">
                  <span className="font-mono text-lg font-black text-accent/60 group-hover:text-accent transition-colors duration-300">{logo.icon}</span>
                  <span className="font-heading font-black text-lg tracking-widest text-textMuted/60 group-hover:text-white transition-colors duration-300">{logo.name}</span>
                </div>
              ))}
            </motion.div>
            <motion.div
              animate={{ x: ["0%", "-100%"] }}
              transition={{ ease: "linear", duration: 25, repeat: Infinity }}
              className="flex gap-12 select-none items-center shrink-0"
              aria-hidden="true"
            >
              {clientLogos.map((logo, idx) => (
                <div key={`strip2-${logo.name}-${idx}`} className="flex items-center gap-2.5 group">
                  <span className="font-mono text-lg font-black text-accent/60 group-hover:text-accent transition-colors duration-300">{logo.icon}</span>
                  <span className="font-heading font-black text-lg tracking-widest text-textMuted/60 group-hover:text-white transition-colors duration-300">{logo.name}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Staggered Entrance Testimonials Columns with Parallax Scroll */}
          <div className="relative flex justify-center gap-6 mt-4 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[380px] md:max-h-[420px] lg:max-h-[460px] overflow-hidden w-full">
            <motion.div style={{ x: col1X, y: col1Y, opacity: col1Opacity }} className="flex h-full">
              <motion.div style={{ y: col1ParallaxY }}>
                <TestimonialsColumn testimonials={firstColumn} />
              </motion.div>
            </motion.div>
            
            <motion.div style={{ y: col2Y, opacity: col2Opacity }} className="hidden md:flex h-full">
              <motion.div style={{ y: col2ParallaxY }}>
                <TestimonialsColumn testimonials={secondColumn} />
              </motion.div>
            </motion.div>
            
            <motion.div style={{ x: col3X, y: col3Y, opacity: col3Opacity }} className="hidden lg:flex h-full">
              <motion.div style={{ y: col3ParallaxY }}>
                <TestimonialsColumn testimonials={thirdColumn} />
              </motion.div>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
