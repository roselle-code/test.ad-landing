// Scroll-driven "scatter" gallery — photos tossed at random positions/rotations.
// As user scrolls, each feature step's photos scatter in with zoom + rotation,
// while the previous step's photos scatter away. Reversible on scroll-back.
//
// Gallery versions (revert by name):
//   "circular"  — commit ba773d8
//   "crossfade" — commit f7cdaad
//   "scatter"   — this version

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { FEATURES } from "./how-it-works/gallery-config";
import EmailSubscription from "./how-it-works/EmailSubscription";
import MobileGallery from "./how-it-works/MobileGallery";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const SCATTER_STEPS = [
  {
    photos: [
      { src: "/placeholders/carousel-5.png", left: "8%", top: "6%", w: 200, h: 220, rot: -12 },
      { src: "/placeholders/carousel-6.png", left: "60%", top: "2%", w: 185, h: 205, rot: 8 },
    ],
  },
  {
    photos: [
      { src: "/placeholders/carousel-1.png", left: "2%", top: "8%", w: 195, h: 230, rot: -8 },
      { src: "/placeholders/carousel-3.png", left: "33%", top: "-2%", w: 215, h: 255, rot: 3 },
      { src: "/placeholders/carousel-4.png", left: "67%", top: "12%", w: 175, h: 195, rot: 10 },
    ],
  },
  {
    photos: [
      { src: "/placeholders/carousel-2.png", left: "10%", top: "3%", w: 195, h: 230, rot: -5 },
      { src: "/placeholders/carousel-7.png", left: "56%", top: "0%", w: 200, h: 220, rot: 7 },
      { src: "/placeholders/carousel-8.png", left: "32%", top: "48%", w: 175, h: 195, rot: -3 },
    ],
  },
];

const ALL_PHOTOS = SCATTER_STEPS.flatMap((step, si) =>
  step.photos.map((photo) => ({ ...photo, stepIndex: si }))
);

const AUTO_PLAY_INTERVAL = 2500;
const AUTO_PLAY_RESUME_DELAY = 2000;
const SNAP_POINTS = [0, 1 / 3, 2 / 3, 1];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const stRef = useRef<ScrollTrigger | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAutoScrolling = useRef(false);

  const clearAutoTimer = useCallback(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    clearAutoTimer();
    autoTimerRef.current = setInterval(() => {
      const st = stRef.current;
      if (!st) return;

      const currentSnap = SNAP_POINTS.findIndex(
        (p) => Math.abs(st.progress - p) < 0.05
      );
      const nextIndex =
        currentSnap < SNAP_POINTS.length - 1 ? currentSnap + 1 : 0;
      const targetScroll =
        st.start + SNAP_POINTS[nextIndex] * (st.end - st.start);

      isAutoScrolling.current = true;
      gsap.to(window, {
        scrollTo: { y: targetScroll },
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          isAutoScrolling.current = false;
        },
      });
    }, AUTO_PLAY_INTERVAL);
  }, [clearAutoTimer]);

  const pauseAndResume = useCallback(() => {
    if (isAutoScrolling.current) return;
    clearAutoTimer();
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      startAutoPlay();
    }, AUTO_PLAY_RESUME_DELAY);
  }, [clearAutoTimer, startAutoPlay]);

  const goToStep = useCallback(
    (stepIndex: number) => {
      const st = stRef.current;
      if (!st) return;
      const targetScroll =
        st.start + SNAP_POINTS[stepIndex] * (st.end - st.start);
      clearAutoTimer();
      isAutoScrolling.current = true;
      gsap.to(window, {
        scrollTo: { y: targetScroll },
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          isAutoScrolling.current = false;
          startAutoPlay();
        },
      });
    },
    [clearAutoTimer, startAutoPlay]
  );

  useEffect(() => {
    if (!triggerRef.current) return;

    const trigger = triggerRef.current;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const els = photoRefs.current;

      // Build index ranges per step
      let idx = 0;
      const stepRanges = SCATTER_STEPS.map((step) => {
        const start = idx;
        idx += step.photos.length;
        return { start, end: idx };
      });

      // Initialize: step 0 visible, rest hidden
      ALL_PHOTOS.forEach((photo, i) => {
        if (!els[i]) return;
        if (photo.stepIndex === 0) {
          gsap.set(els[i]!, { opacity: 1, scale: 1, rotation: photo.rot, x: 0, y: 0 });
        } else {
          gsap.set(els[i]!, { opacity: 0, scale: 0.4, rotation: photo.rot + 20, x: 0, y: 40 });
        }
      });

      // Build scatter timeline: 3 units total (one per scroll segment)
      const tl = gsap.timeline();

      // Transition 0→1 (timeline 0 → 1)
      const s0 = stepRanges[0];
      const s1 = stepRanges[1];
      for (let i = s0.start; i < s0.end; i++) {
        const dir = i % 2 === 0 ? -1 : 1;
        tl.to(els[i]!, {
          opacity: 0, scale: 0.5, y: -50, x: dir * 80,
          rotation: `+=${dir * 20}`,
          duration: 0.45, ease: "power2.in",
        }, 0.05 + (i - s0.start) * 0.05);
      }
      for (let i = s1.start; i < s1.end; i++) {
        const photo = ALL_PHOTOS[i];
        tl.to(els[i]!, {
          opacity: 1, scale: 1, y: 0, x: 0,
          rotation: photo.rot,
          duration: 0.55, ease: "power2.out",
        }, 0.25 + (i - s1.start) * 0.06);
      }

      // Transition 1→2 (timeline 1 → 2)
      const s2 = stepRanges[2];
      for (let i = s1.start; i < s1.end; i++) {
        const dir = (i - s1.start) % 2 === 0 ? -1 : 1;
        tl.to(els[i]!, {
          opacity: 0, scale: 0.5, y: -50, x: dir * 80,
          rotation: `+=${dir * 20}`,
          duration: 0.45, ease: "power2.in",
        }, 1.05 + (i - s1.start) * 0.05);
      }
      for (let i = s2.start; i < s2.end; i++) {
        const photo = ALL_PHOTOS[i];
        tl.to(els[i]!, {
          opacity: 1, scale: 1, y: 0, x: 0,
          rotation: photo.rot,
          duration: 0.55, ease: "power2.out",
        }, 1.25 + (i - s2.start) * 0.06);
      }

      // Rest period: step 2 photos gently float (timeline 2 → 3)
      for (let i = s2.start; i < s2.end; i++) {
        tl.to(els[i]!, { y: -6, duration: 1, ease: "sine.inOut" }, 2);
      }

      const scrollTrigger = ScrollTrigger.create({
        trigger,
        animation: tl,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        snap: {
          snapTo: SNAP_POINTS,
          duration: { min: 0.4, max: 0.8 },
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const step = Math.min(2, Math.floor(self.progress * 3));
          setActiveStep(step);
        },
        onEnter: () => startAutoPlay(),
        onLeave: () => clearAutoTimer(),
        onEnterBack: () => startAutoPlay(),
        onLeaveBack: () => clearAutoTimer(),
      });

      stRef.current = scrollTrigger;

      const onUserScroll = () => pauseAndResume();
      window.addEventListener("wheel", onUserScroll, { passive: true });
      window.addEventListener("touchmove", onUserScroll, { passive: true });

      return () => {
        window.removeEventListener("wheel", onUserScroll);
        window.removeEventListener("touchmove", onUserScroll);
        clearAutoTimer();
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      };
    });

    return () => mm.revert();
  }, [startAutoPlay, clearAutoTimer, pauseAndResume]);

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-white text-black">
      {/* Desktop: tall scroll container with sticky visible content */}
      <div ref={triggerRef} className="relative min-h-[350vh] hidden md:block">
        <div className="sticky top-0 h-[100dvh] overflow-hidden">
          <div className="pt-[24px] lg:pt-[40px] px-6 md:px-[40px] lg:px-[60px] text-center">
            <h2 className="text-[36px] lg:text-[44px] font-semibold leading-[1.1]">
              <span>How XForge </span>
              <span className="font-serif italic underline">Works</span>
            </h2>
          </div>

          {/* Scatter gallery — photos at random positions/rotations */}
          <div className="relative mt-4 lg:mt-6 mx-auto w-full max-w-[950px] h-[min(calc(100dvh-370px),500px)]">
            {ALL_PHOTOS.map((photo, i) => (
              <div
                key={i}
                ref={(el) => {
                  photoRefs.current[i] = el;
                }}
                className="absolute rounded-2xl overflow-hidden shadow-[0px_5px_15px_rgba(0,0,0,0.2)] will-change-transform"
                style={{
                  left: photo.left,
                  top: photo.top,
                  width: photo.w,
                  height: photo.h,
                  opacity: photo.stepIndex === 0 ? 1 : 0,
                }}
              >
                <Image
                  src={photo.src}
                  alt={`XForge photo`}
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
          </div>

          {/* Step indicators */}
          <div className="relative z-10 flex justify-center gap-2 mt-4 lg:mt-6 mb-2">
            {FEATURES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to step ${i + 1}`}
                onClick={() => goToStep(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeStep ? "bg-black w-6" : "bg-gray-300 w-2"
                }`}
              />
            ))}
          </div>

          {/* Feature text + email */}
          <div className="relative z-10 pb-8 lg:pb-10">
            <div className="max-w-[500px] lg:max-w-[600px] mx-auto px-6 h-[120px] lg:h-[100px] flex items-start justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                  className="text-center w-full"
                >
                  <h3 className="text-[22px] lg:text-[28px] font-medium leading-[1.1] text-black mb-[12px] lg:mb-[17px]">
                    {FEATURES[activeStep].title}
                  </h3>
                  <p className="text-sm lg:text-base font-normal leading-[1.3] text-[#4d4d4d]">
                    {FEATURES[activeStep].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center pt-5 lg:pt-6">
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
