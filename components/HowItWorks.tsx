// Scroll-driven circular photo carousel with GSAP ScrollTrigger.
// Desktop: pinned section with scrub-controlled rotation.
// Mobile: separate MobileGallery component with lighter timeline.
//
// HIGH RISK: GSAP pin behavior is fragile on iOS Safari.
// Photo order matches Figma circular path — see gallery-config.ts.
// INITIAL_ROTATION controls which photo is centered on load.
// Changing PHOTOS array order requires recalculating INITIAL_ROTATION.

"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DESKTOP_PHOTOS,
  FEATURES,
  RADIUS,
  PHOTO_TOP_OFFSET,
  INITIAL_ROTATION,
  TOTAL_ROTATION,
  getPhotoStyle,
} from "./how-it-works/gallery-config";
import EmailSubscription from "./how-it-works/EmailSubscription";
import MobileGallery from "./how-it-works/MobileGallery";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!triggerRef.current || !wheelRef.current) return;

    const trigger = triggerRef.current;
    const wheel = wheelRef.current;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.set(wheel, { rotation: INITIAL_ROTATION });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: "+=350%",
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
          snap: {
            snapTo: [0, 0.33, 0.66, 1],
            duration: { min: 0.4, max: 0.8 },
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            const step = Math.min(2, Math.floor(self.progress * 3));
            setActiveStep(step);
          },
        },
      });

      tl.to(wheel, { rotation: INITIAL_ROTATION + TOTAL_ROTATION, ease: "none" }, 0);
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-white text-black">
      {/* Desktop layout */}
      <div ref={triggerRef} className="relative h-[100dvh] overflow-hidden hidden md:block">
        <div className="pt-[24px] lg:pt-[40px] px-6 md:px-[40px] lg:px-[60px] text-center">
          <h2 className="text-[36px] lg:text-[44px] font-semibold leading-[1.1]">
            <span>How XForge </span>
            <span className="font-serif italic underline">Works</span>
          </h2>
        </div>

        <div className="relative mt-[12px] lg:mt-[16px] mx-auto w-full h-[calc(100dvh-380px)] overflow-visible">
          <div
            ref={wheelRef}
            className="absolute inset-0 will-change-transform"
            style={{ transformOrigin: `50% ${RADIUS + PHOTO_TOP_OFFSET}px` }}
          >
            {DESKTOP_PHOTOS.map((src, i) => (
              <div
                key={i}
                className="absolute w-[180px] h-[200px] lg:w-[220px] lg:h-[240px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0px_5px_4.8px_0px_rgba(0,0,0,0.25)]"
                style={{
                  ...getPhotoStyle(i),
                  background:
                    "radial-gradient(ellipse at center top, #050505 0%, #141414 50%, #2a2a2a 62.5%, #404040 75%, #565656 87.5%, #6d6d6d 100%)",
                }}
              >
                <Image
                  src={src}
                  alt={`XForge photo ${(i % 8) + 1}`}
                  width={220}
                  height={240}
                  className="w-full h-full object-cover"
                  style={src.includes("carousel-4") ? { objectPosition: "35% center" } : undefined}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-[500px] lg:max-w-[600px] mx-auto px-6 mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="text-center"
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

        <div className="flex justify-center pt-4 lg:pt-6 pb-3">
          <EmailSubscription />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="block md:hidden">
        <MobileGallery />
      </div>
    </section>
  );
}
