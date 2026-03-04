// Scroll-driven "scatter" gallery — all photos visible, shuffling positions on scroll.
// Sticky viewport: as user scrolls, all 8 photos smoothly rearrange to new
// scattered positions/rotations/scales for each feature step. Text changes in center.
//
// Gallery versions (revert by name):
//   "circular"  — commit ba773d8
//   "crossfade" — commit f7cdaad
//   "scatter"   — this version

"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FEATURES } from "./how-it-works/gallery-config";
import EmailSubscription from "./how-it-works/EmailSubscription";
import MobileGallery from "./how-it-works/MobileGallery";

gsap.registerPlugin(ScrollTrigger);

// Each photo has 3 scatter states (one per feature step).
// All photos are visible at all times — they rearrange on scroll.
const SCATTER_PHOTOS = [
  {
    src: "/placeholders/carousel-5.png",
    w: 180,
    h: 200,
    states: [
      { left: "3%", top: "2%", rotation: -14, scale: 0.85 },
      { left: "56%", top: "5%", rotation: 10, scale: 0.9 },
      { left: "60%", top: "0%", rotation: 6, scale: 0.88 },
    ],
  },
  {
    src: "/placeholders/carousel-6.png",
    w: 175,
    h: 195,
    states: [
      { left: "62%", top: "0%", rotation: 10, scale: 0.88 },
      { left: "3%", top: "3%", rotation: -12, scale: 0.85 },
      { left: "4%", top: "5%", rotation: -10, scale: 0.9 },
    ],
  },
  {
    src: "/placeholders/carousel-1.png",
    w: 185,
    h: 215,
    states: [
      { left: "0%", top: "38%", rotation: -8, scale: 0.88 },
      { left: "62%", top: "35%", rotation: 10, scale: 0.85 },
      { left: "56%", top: "40%", rotation: 8, scale: 0.88 },
    ],
  },
  {
    src: "/placeholders/carousel-3.png",
    w: 200,
    h: 240,
    states: [
      { left: "30%", top: "33%", rotation: 4, scale: 0.95 },
      { left: "28%", top: "28%", rotation: -5, scale: 1.0 },
      { left: "26%", top: "35%", rotation: 3, scale: 0.98 },
    ],
  },
  {
    src: "/placeholders/carousel-4.png",
    w: 170,
    h: 190,
    states: [
      { left: "66%", top: "36%", rotation: 12, scale: 0.82 },
      { left: "0%", top: "42%", rotation: -10, scale: 0.85 },
      { left: "64%", top: "33%", rotation: 7, scale: 0.85 },
    ],
  },
  {
    src: "/placeholders/carousel-2.png",
    w: 180,
    h: 210,
    states: [
      { left: "8%", top: "65%", rotation: -10, scale: 0.82 },
      { left: "58%", top: "60%", rotation: 8, scale: 0.85 },
      { left: "32%", top: "58%", rotation: -4, scale: 0.9 },
    ],
  },
  {
    src: "/placeholders/carousel-7.png",
    w: 170,
    h: 190,
    states: [
      { left: "40%", top: "64%", rotation: 5, scale: 0.8 },
      { left: "32%", top: "60%", rotation: -6, scale: 0.82 },
      { left: "5%", top: "60%", rotation: -10, scale: 0.82 },
    ],
  },
  {
    src: "/placeholders/carousel-8.png",
    w: 160,
    h: 180,
    states: [
      { left: "68%", top: "62%", rotation: -6, scale: 0.78 },
      { left: "8%", top: "65%", rotation: -8, scale: 0.8 },
      { left: "62%", top: "60%", rotation: 10, scale: 0.82 },
    ],
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const stRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!triggerRef.current) return;
    const trigger = triggerRef.current;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const els = photoRefs.current;

      // Set initial scatter positions (state 0)
      SCATTER_PHOTOS.forEach((photo, i) => {
        if (!els[i]) return;
        gsap.set(els[i]!, photo.states[0]);
      });

      // Timeline: photos rearrange between states
      const tl = gsap.timeline();

      // State 0 → State 1 (timeline 0 → 1)
      SCATTER_PHOTOS.forEach((photo, i) => {
        if (!els[i]) return;
        tl.to(
          els[i]!,
          { ...photo.states[1], duration: 1, ease: "power2.inOut" },
          0
        );
      });

      // State 1 → State 2 (timeline 1 → 2)
      SCATTER_PHOTOS.forEach((photo, i) => {
        if (!els[i]) return;
        tl.to(
          els[i]!,
          { ...photo.states[2], duration: 1, ease: "power2.inOut" },
          1
        );
      });

      // Rest period: subtle drift so photos feel alive (timeline 2 → 3)
      SCATTER_PHOTOS.forEach((photo, i) => {
        if (!els[i]) return;
        const drift = i % 2 === 0 ? -8 : 8;
        tl.to(
          els[i]!,
          {
            rotation: photo.states[2].rotation + drift * 0.5,
            scale: photo.states[2].scale + 0.02,
            duration: 1,
            ease: "sine.inOut",
          },
          2
        );
      });

      const scrollTrigger = ScrollTrigger.create({
        trigger,
        animation: tl,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const step = Math.min(2, Math.floor(self.progress * 3));
          setActiveStep(step);
        },
      });

      stRef.current = scrollTrigger;
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-white text-black">
      {/* Desktop: sticky viewport with shuffling scatter photos */}
      <div ref={triggerRef} className="relative h-[300vh] hidden md:block">
        <div className="sticky top-0 h-[100dvh] overflow-hidden flex flex-col">
          {/* Title */}
          <div className="pt-[24px] lg:pt-[40px] text-center shrink-0">
            <h2 className="text-[36px] lg:text-[44px] font-semibold leading-[1.1]">
              <span>How XForge </span>
              <span className="font-serif italic underline">Works</span>
            </h2>
          </div>

          {/* Gallery area — photos + centered text + email */}
          <div className="relative flex-1 mx-auto w-full max-w-[950px] mt-3">
            {/* Scattered photos */}
            {SCATTER_PHOTOS.map((photo, i) => (
              <div
                key={i}
                ref={(el) => {
                  photoRefs.current[i] = el;
                }}
                className="absolute rounded-2xl overflow-hidden shadow-[0px_5px_15px_rgba(0,0,0,0.2)] will-change-transform"
                style={{ width: photo.w, height: photo.h }}
              >
                <Image
                  src={photo.src}
                  alt={`XForge photo ${i + 1}`}
                  width={photo.w}
                  height={photo.h}
                  className="w-full h-full object-cover"
                  style={
                    photo.src.includes("carousel-4")
                      ? { objectPosition: "35% center" }
                      : undefined
                  }
                />
              </div>
            ))}

            {/* Feature text — centered on top of photos */}
            <div className="absolute inset-0 z-10 flex items-start justify-center pointer-events-none pt-[16%]">
              <div className="max-w-[420px] text-center pointer-events-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                  >
                    <h3 className="text-[24px] lg:text-[30px] font-medium leading-[1.1] text-black mb-[14px]">
                      {FEATURES[activeStep].title}
                    </h3>
                    <p className="text-sm lg:text-base font-normal leading-[1.4] text-[#4d4d4d]">
                      {FEATURES[activeStep].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Step indicators */}
            <div className="absolute bottom-[120px] left-0 right-0 z-10 flex justify-center gap-2">
              {FEATURES.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeStep ? "bg-black w-6" : "bg-gray-300 w-2"
                  }`}
                />
              ))}
            </div>

            {/* Email subscription at bottom */}
            <div className="absolute bottom-4 lg:bottom-6 left-0 right-0 z-10 flex justify-center">
              <EmailSubscription />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="block md:hidden">
        <MobileGallery />
      </div>
    </section>
  );
}
