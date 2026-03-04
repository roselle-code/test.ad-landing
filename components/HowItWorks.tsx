// Scroll-driven photo sequence with crossfade + zoom transitions.
// Desktop: sticky content inside a tall scroll container. Photos crossfade
// as the user scrolls, with a cinematic zoom effect (Apple product-page style).
// Mobile: separate MobileGallery component with swipeable cards.

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

const SEQUENCE_PHOTOS = [
  "/placeholders/carousel-5.png",
  "/placeholders/carousel-1.png",
  "/placeholders/carousel-4.png",
  "/placeholders/carousel-2.png",
];

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
      const nextProgress = SNAP_POINTS[nextIndex];

      const targetScroll =
        st.start + nextProgress * (st.end - st.start);

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
      const targetProgress = SNAP_POINTS[stepIndex];
      const targetScroll =
        st.start + targetProgress * (st.end - st.start);
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
      photoRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = i === 0 ? "1" : "0";
        el.style.transform = i === 0 ? "scale(1)" : "scale(1.15)";
      });

      const st = ScrollTrigger.create({
        trigger,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        snap: {
          snapTo: SNAP_POINTS,
          duration: { min: 0.4, max: 0.8 },
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const progress = self.progress;
          const step = Math.min(2, Math.floor(progress * 3));
          setActiveStep(step);

          // 4 photos → 3 transitions, mapped linearly to progress 0–1
          const count = SEQUENCE_PHOTOS.length;
          const p = progress * (count - 1);
          const idx = Math.min(Math.floor(p), count - 2);
          const blend = p - idx;

          photoRefs.current.forEach((el, i) => {
            if (!el) return;
            if (i === idx) {
              el.style.opacity = String(1 - blend);
              el.style.transform = `scale(${1 + blend * 0.08})`;
            } else if (i === idx + 1) {
              el.style.opacity = String(blend);
              el.style.transform = `scale(${1.15 - blend * 0.15})`;
            } else {
              el.style.opacity = "0";
            }
          });
        },
        onEnter: () => startAutoPlay(),
        onLeave: () => clearAutoTimer(),
        onEnterBack: () => startAutoPlay(),
        onLeaveBack: () => clearAutoTimer(),
      });

      stRef.current = st;

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

          {/* Scroll-driven photo sequence — crossfade + zoom */}
          <div className="relative mt-[16px] lg:mt-[24px] mx-auto flex items-center justify-center h-[min(calc(100dvh-370px),500px)]">
            {SEQUENCE_PHOTOS.map((src, i) => (
              <div
                key={i}
                ref={(el) => {
                  photoRefs.current[i] = el;
                }}
                className="absolute w-[260px] h-[320px] lg:w-[320px] lg:h-[400px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0px_8px_24px_rgba(0,0,0,0.15)] will-change-transform"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <Image
                  src={src}
                  alt={`XForge feature ${i + 1}`}
                  width={320}
                  height={400}
                  className="w-full h-full object-cover"
                  style={
                    src.includes("carousel-4")
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
