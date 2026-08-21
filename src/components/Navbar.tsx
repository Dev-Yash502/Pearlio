"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Magnetic from "@/components/ui/magnetic";

const navItems = [
  { name: "Services", href: "#services" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Lock body overflow when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-4" : "py-6"
        }`}
      >
        {/* Scroll Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-accent origin-[0%] z-[60] shadow-glow-primary"
          style={{ scaleX }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-50">
            <span aria-hidden="true" className="relative h-9 w-9 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-110">
              <Image src="/logo.jpg" alt="" fill sizes="36px" className="scale-[1.65] object-cover object-[50%_28%]" />
            </span>
            <span className="font-heading font-black text-2xl tracking-tight text-white transition-colors duration-300 group-hover:text-accent">
              Pearlio<span className="text-secondary">.</span>
            </span>
          </Link>

          {/* Desktop Center Pill Nav (Liquid Glass styling, hidden on mobile) */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons (Liquid Glass styling, hidden on mobile) */}
          <div className="hidden md:flex items-center">
            <Magnetic>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass text-xs font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 z-50 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Let's Talk</span>
              </Link>
            </Magnetic>
          </div>

          {/* Mobile Hamburger toggle button (Liquid Glass, hidden md+) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-12 h-12 rounded-full liquid-glass text-white focus:outline-none z-50 cursor-pointer active:scale-90 transition-transform"
            aria-label="Toggle menu" aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <div className="flex flex-col gap-1.5 items-end justify-center">
                <span className="w-5 h-[1.5px] bg-white" />
                <span className="w-3.5 h-[1.5px] bg-white" />
              </div>
            )}
          </button>
        </div>
      </motion.header>

      {/* Mobile Fullscreen Menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.77, 0, 0.18, 1] }}
            className="fixed inset-0 w-screen h-screen bg-[#0a0a0a] z-[55] flex flex-col justify-between px-8 py-24 md:hidden overflow-hidden"
          >
            {/* Top Logo and Close container */}
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="relative h-9 w-9 overflow-hidden rounded-full">
                  <Image src="/logo.jpg" alt="" fill sizes="36px" className="scale-[1.65] object-cover object-[50%_28%]" />
                </span>
                <span className="font-heading font-black text-2xl tracking-tight text-white">Pearlio<span className="text-secondary">.</span></span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="flex items-center justify-center w-12 h-12 rounded-full liquid-glass text-white cursor-pointer hover:bg-white/5"
                style={{ transform: "rotate(-90deg) scale(0.8)", transition: "transform 0.4s" }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Links stack centered */}
            <div className="flex flex-col items-center justify-center gap-6 my-auto">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.77, 0, 0.18, 1], 
                    delay: 0.1 + idx * 0.06 
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl sm:text-4xl font-medium text-white/90 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Bottom CTA Reserve Button */}
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.77, 0, 0.18, 1], 
                delay: 0.1 + navItems.length * 0.06 
              }}
              className="w-full flex justify-center"
            >
              <Link
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full liquid-glass text-base font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                <span>Let's Talk</span>
              </Link>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
