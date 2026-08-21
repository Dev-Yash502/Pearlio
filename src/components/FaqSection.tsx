"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Why hand-coded Next.js instead of Webflow or WordPress?",
    answer: "Performance and freedom. Page builders like WordPress and Webflow generate heavy, bloated code that slows down loading speeds, which hurts your search ranking (SEO) and user retention. We hand-code in Next.js to produce ultra-clean assets that load in milliseconds and support premium, interactive 3D elements that are impossible on builders.",
  },
  {
    question: "How long does it take to build and launch a site?",
    answer: "Landing pages and marketing sites typically take 2 to 3 weeks from kickoff to deployment. E-commerce stores and CMS-driven platforms take 4 to 6 weeks. Bespoke 3D interactive projects depend on overall assets complexity, but we always build and ship incrementally.",
  },
  {
    question: "What does the SEO & Maintenance add-on cover?",
    answer: "It covers hosting, SSL encryption, DNS routing, speed optimization checks, monthly technical SEO sweeps, and up to 5 hours of visual/content changes per month. Think of us as your external web development department on call.",
  },
  {
    question: "Will the 3D assets make my website load slowly?",
    answer: "No. We utilize advanced file compression, image texture baking, and progressive rendering systems (Suspense loader) so the main interactive layers load after the critical text content is already visible. This keeps your page load speeds lightning fast.",
  },
  {
    question: "How does the payment structure work?",
    answer: "We divide billing into a 50/50 structure: 50% kickoff deposit to lock in schedule and begin design wireframes, and 50% balance payment upon final staging approval and production deployment.",
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
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

  // Section Header transforms
  const badgeOpacity = useTransform(smoothProgress, [0.05, 0.18], [0, 1], { clamp: true });
  const badgeY = useTransform(smoothProgress, [0.05, 0.18], [30, 0], { clamp: true });

  const titleOpacity = useTransform(smoothProgress, [0.1, 0.24], [0, 1], { clamp: true });
  const titleY = useTransform(smoothProgress, [0.1, 0.24], [40, 0], { clamp: true });

  // Pinned scroll-scrub animations for accordion items:
  // Item 0: left slide
  const item0X = useTransform(smoothProgress, [0.18, 0.33], [-120, 0], { clamp: true });
  const item0Opacity = useTransform(smoothProgress, [0.18, 0.33], [0, 1], { clamp: true });

  // Item 1: right slide
  const item1X = useTransform(smoothProgress, [0.24, 0.39], [120, 0], { clamp: true });
  const item1Opacity = useTransform(smoothProgress, [0.24, 0.39], [0, 1], { clamp: true });

  // Item 2: left slide
  const item2X = useTransform(smoothProgress, [0.3, 0.45], [-120, 0], { clamp: true });
  const item2Opacity = useTransform(smoothProgress, [0.3, 0.45], [0, 1], { clamp: true });

  // Item 3: right slide
  const item3X = useTransform(smoothProgress, [0.36, 0.51], [120, 0], { clamp: true });
  const item3Opacity = useTransform(smoothProgress, [0.36, 0.51], [0, 1], { clamp: true });

  // Item 4: left slide
  const item4X = useTransform(smoothProgress, [0.42, 0.57], [-120, 0], { clamp: true });
  const item4Opacity = useTransform(smoothProgress, [0.42, 0.57], [0, 1], { clamp: true });

  // Global exit fade out for all FAQ elements (fades out only during viewport exit)
  const globalExitOpacity = useTransform(smoothProgress, [0.85, 0.98], [1, 0], { clamp: true });

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div id="faq" ref={containerRef} className="relative h-[200vh] bg-background w-full">
      {/* Sticky container that keeps elements locked until scroll-seek is complete */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden z-10 py-8">
        
        {/* Background radial aura */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none z-0" />

        {/* Global Exit opacity motion wrapper */}
        <motion.div
          style={{ opacity: globalExitOpacity }}
          className="w-full h-full flex flex-col justify-center items-center relative z-10 max-w-4xl mx-auto px-6"
        >
          {/* Section Header */}
          <div className="text-center mb-10 flex flex-col items-center">
            <motion.div 
              style={{ opacity: badgeOpacity, y: badgeY }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border mb-6"
            >
              <HelpCircle className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-textPrimary">Frequently Asked Questions</span>
            </motion.div>

            <motion.h2 
              style={{ opacity: titleOpacity, y: titleY }}
              className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white"
            >
              Got questions? <br />
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">We have answers.</span>
            </motion.h2>
          </div>

          {/* FAQs Accordion List */}
          <div className="space-y-3.5 w-full">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              
              // Dynamic coordinates and opacity bindings
              const itemX = idx === 0 ? item0X : idx === 1 ? item1X : idx === 2 ? item2X : idx === 3 ? item3X : item4X;
              const opacity = idx === 0 ? item0Opacity : idx === 1 ? item1Opacity : idx === 2 ? item2Opacity : idx === 3 ? item3Opacity : item4Opacity;

              return (
                <motion.div
                  style={{ x: itemX, opacity }}
                  key={faq.question}
                  className="rounded-[1.5rem] border border-border bg-card/45 backdrop-blur-md overflow-hidden"
                >
                  <button
                    id={`faq-question-${idx}`}
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-5 md:px-7 md:py-6 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-[1.5rem] group relative"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span className="font-heading font-bold text-base md:text-lg text-white group-hover:text-accent transition-colors duration-200 pr-4">
                      {faq.question}
                    </span>
                    <span className="p-1 rounded-full bg-background border border-border/80 text-textMuted group-hover:text-white transition-colors">
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </span>
                  </button>

                  <motion.div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    aria-hidden={!isOpen}
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 pt-1 md:px-7 md:pb-7 text-sm md:text-base text-textMuted font-medium leading-relaxed border-t border-border/40">
                      {faq.answer}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
