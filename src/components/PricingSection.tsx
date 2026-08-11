"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, Variants } from "framer-motion";
import { Check, Flame } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$2,499",
    description: "Launch a clean, ultra-fast website to establish your brand.",
    features: [
      "Custom Next.js 14 Development",
      "Up to 5 Pages designed from scratch",
      "Mobile-first responsive layout",
      "Framer Motion entrance animations",
      "SEO-ready technical structure",
      "1 Month included maintenance",
    ],
    popular: false,
    cta: "Let's build a Starter",
    glow: "border-border hover:border-primary/40",
  },
  {
    name: "Growth",
    price: "$4,999",
    description: "Scale your customer acquisition with dynamic content and features.",
    features: [
      "Everything in Starter plan",
      "CMS integration (Sanity / headless)",
      "Up to 12 custom page layouts",
      "Full E-Commerce setup (Stripe)",
      "Interactive components (Spotlight cards)",
      "Advanced SEO Optimization setup",
      "3 Months included maintenance",
    ],
    popular: true,
    cta: "Scale with Growth",
    glow: "border-primary shadow-glow-primary",
  },
  {
    name: "Custom",
    price: "Bespoke",
    description: "Go beyond standard web experiences with fully immersive custom systems.",
    features: [
      "Unlimited pages & layouts",
      "Bespoke 3D scenes (Three.js/Canvas)",
      "Advanced custom shader particles",
      "Custom software & dashboard integrations",
      "High-end visual branding & copy",
      "Priority maintenance contract",
    ],
    popular: false,
    cta: "Book a Custom Call",
    glow: "border-border hover:border-accent/40",
  },
];

export default function PricingSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress continuously from entering viewport bottom to leaving viewport top
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth out progress with high-fidelity spring transition
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // Viewport scroll-linked animations for headers (start immediately on entry)
  const badgeOpacity = useTransform(smoothProgress, [0.05, 0.18], [0, 1], { clamp: true });
  const badgeY = useTransform(smoothProgress, [0.05, 0.18], [30, 0], { clamp: true });

  const titleOpacity = useTransform(smoothProgress, [0.1, 0.24], [0, 1], { clamp: true });
  const titleY = useTransform(smoothProgress, [0.1, 0.24], [40, 0], { clamp: true });

  const descOpacity = useTransform(smoothProgress, [0.15, 0.3], [0, 0.85], { clamp: true });
  const descY = useTransform(smoothProgress, [0.15, 0.3], [30, 0], { clamp: true });

  // Pinned scroll-scrub animations for cards:
  // Card 1 (Starter) slides in from left
  const card1X = useTransform(smoothProgress, [0.2, 0.38], [-250, 0], { clamp: true });
  const card1Opacity = useTransform(smoothProgress, [0.2, 0.38], [0, 1], { clamp: true });

  // Card 2 (Growth) drops in from top of screen
  const card2Y = useTransform(smoothProgress, [0.28, 0.48], [-250, 0], { clamp: true });
  const card2Opacity = useTransform(smoothProgress, [0.28, 0.48], [0, 1], { clamp: true });

  // Card 3 (Custom) slides in from right
  const card3X = useTransform(smoothProgress, [0.36, 0.56], [250, 0], { clamp: true });
  const card3Opacity = useTransform(smoothProgress, [0.36, 0.56], [0, 1], { clamp: true });

  // Background aura scaling and opacity mapping
  const bgGlowScale = useTransform(smoothProgress, [0.1, 0.6], [0.6, 1.25], { clamp: true });
  const bgGlowOpacity = useTransform(smoothProgress, [0.1, 0.3, 0.85, 0.98], [0, 0.8, 0.8, 0], { clamp: true });

  // Global exit fade out for all Pricing elements
  const globalExitOpacity = useTransform(smoothProgress, [0.85, 0.98], [1, 0], { clamp: true });

  return (
    <div ref={containerRef} className="relative h-[200vh] bg-background w-full">
      {/* Sticky container that keeps elements locked until scroll-seek is complete */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden z-10 py-8">
        
        {/* Background glow decoration */}
        <motion.div 
          style={{ scale: bgGlowScale, opacity: bgGlowOpacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" 
        />

        {/* Global Exit opacity motion wrapper */}
        <motion.div
          style={{ opacity: globalExitOpacity }}
          className="w-full h-full flex flex-col justify-center items-center relative z-10 max-w-7xl mx-auto px-6"
        >
          {/* Section Header */}
          <div className="flex flex-col items-center mb-12 text-center">
            <motion.div 
              style={{ opacity: badgeOpacity, y: badgeY }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border mb-6"
            >
              <Flame className="w-4 h-4 text-secondary" />
              <span className="text-xs font-bold uppercase tracking-wider text-textPrimary">Simple Pricing</span>
            </motion.div>

            <motion.h2 
              style={{ opacity: titleOpacity, y: titleY }}
              className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white mb-4"
            >
              Transparent pricing. <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Zero hidden fees.</span>
            </motion.h2>

            <motion.p 
              style={{ opacity: descOpacity, y: descY }}
              className="text-base md:text-lg text-textMuted max-w-xl font-medium"
            >
              Choose the plan that matches your goals. We code custom, lightning-fast sites built to convert.
            </motion.p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch w-full">
            {plans.map((plan, index) => {
              // Bind card motion transforms dynamically based on columns index
              const cardX = index === 0 ? card1X : index === 2 ? card3X : 0;
              const cardY = index === 1 ? card2Y : 0;
              const opacity = index === 0 ? card1Opacity : index === 2 ? card3Opacity : card2Opacity;

              return (
                <motion.div
                  style={{ x: cardX, y: cardY, opacity }}
                  key={index}
                  className={`p-6 md:p-8 rounded-[2.5rem] border bg-card/50 backdrop-blur-md flex flex-col justify-between text-left relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${plan.glow}`}
                >
                  {plan.popular && (
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-glow-primary">
                      MOST POPULAR
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <h3 className="font-heading font-bold text-2xl text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-textMuted leading-relaxed mb-4 min-h-[36px] font-semibold">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="font-heading font-black text-4xl md:text-5xl text-white">
                        {plan.price}
                      </span>
                      {plan.price !== "Bespoke" && (
                        <span className="text-textMuted text-xs font-semibold">/project</span>
                      )}
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 mb-8 border-t border-border/60 pt-6">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-accent" />
                          </span>
                          <span className="text-xs text-textPrimary font-semibold leading-tight">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Link
                    href="#contact"
                    className={`w-full py-3 rounded-xl font-bold transition-all duration-300 text-center text-xs ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary via-secondary to-accent text-white hover:shadow-glow-primary"
                        : "bg-background border border-border text-white hover:border-white/20 hover:bg-card"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
