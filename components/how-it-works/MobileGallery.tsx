// Mobile version of the HowItWorks carousel. Uses only first 5 photos.
// Has its own GSAP timeline (lighter than desktop) with separate rotation params.
// mobileInitialRotation=18 centers carousel-5.png (MOBA gaming) on mobile.

"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PHOTOS, FEATURES } from "./gallery-config";
import EmailSubscription from "./EmailSubscription";

gsap.registerPlugin(ScrollTrigger);

export default function MobileGallery() {
  const [activeStep, setActiveStep] = useState(0);
  const mobileTriggerRef = useRef<HTMLDivElement>(null);
  const mobileWheelRef = useRef<HTMLDivElement>(null);

  const mobileRadius = 600;
  const mobileAngleStep = 18;
  const mobilePhotoCount = 5;
  const mobileStartAngle = -((mobilePhotoCount - 1) / 2) * mobileAngleStep;
  const mobileInitialRotation = 18;
  const mobileTotalRotation = -(FEATURES.length - 1) * mobileAngleStep;

  useEffect(() => {
    if (!mobileTriggerRef.current || !mobileWheelRef.current) return;

    const trigger = mobileTriggerRef.current;
    const wheel = mobileWheelRef.current;

    gsap.set(wheel, { rotation: mobileInitialRotation });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        pinSpacing: true,
        snap: {
          snapTo: [0, 0.5, 1],
          duration: { min: 0.2, max: 0.4 },
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const step = Math.min(2, Math.floor(self.progress * 3));
          setActiveStep(step);
        },
      },
    });

    tl.to(wheel, { rotation: mobileInitialRotation + mobileTotalRotation, ease: "none" }, 0);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === trigger) st.kill();
      });
    };
  }, [mobileInitialRotation, mobileTotalRotation]);

  return (
    <div ref={mobileTriggerRef} className="relative h-[100dvh] overflow-hidden bg-white flex flex-col justify-center pb-[40px]">
      <div className="px-4 sm:px-6">
        <h2 className="text-[20px] sm:text-[28px] font-semibold leading-[1.1] text-center mb-4 sm:mb-6">
          <span>How XForge </span>
          <span className="font-serif italic underline">Works</span>
        </h2>
      </div>

      <div className="relative overflow-visible mx-auto w-full h-[200px] sm:h-[240px] shrink-0">
        <div
          ref={mobileWheelRef}
          className="absolute inset-0 will-change-transform"
          style={{ transformOrigin: `50% ${mobileRadius}px` }}
        >
          {PHOTOS.slice(0, mobilePhotoCount).map((src, i) => {
            const angleDeg = mobileStartAngle + i * mobileAngleStep;
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = mobileRadius * Math.sin(angleRad);
            const y = mobileRadius * (1 - Math.cos(angleRad));
            const photoW = 120;
            return (
              <div
                key={i}
                className="absolute w-[120px] h-[140px] sm:w-[160px] sm:h-[180px] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0px_3px_4px_0px_rgba(0,0,0,0.2)]"
                style={{
                  left: `calc(50% + ${x}px - ${photoW / 2}px)`,
                  top: `${y + 16}px`,
                  transform: `rotate(${angleDeg}deg)`,
                  background:
                    "radial-gradient(ellipse at center top, #050505 0%, #141414 50%, #2a2a2a 62.5%, #404040 75%, #565656 87.5%, #6d6d6d 100%)",
                }}
              >
                <Image
                  src={src}
                  alt={`XForge photo ${i + 1}`}
                  width={160}
                  height={180}
                  className="w-full h-full object-cover"
                  style={i === 3 ? { objectPosition: "35% center" } : undefined}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4 mb-3 px-4">
        {FEATURES.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeStep ? "bg-black w-6" : "bg-gray-300 w-2"
            }`}
          />
        ))}
      </div>

      <div className="max-w-[500px] mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h3 className="text-[18px] sm:text-[22px] font-medium leading-[1.1] text-black mb-3">
              {FEATURES[activeStep].title}
            </h3>
            <p className="text-[14px] sm:text-base font-normal leading-[1.4] text-[#4d4d4d]">
              {FEATURES[activeStep].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex justify-center px-4 sm:px-6">
        <EmailSubscription />
      </div>
    </div>
  );
}
