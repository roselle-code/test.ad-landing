// Tech specs grid with per-icon hover animations (clip-path fills, rotations, etc.).
// Each spec has a custom Framer Motion variant in ICON_ANIMATIONS.
// To update specs: modify SPECS array. To update icons: replace SVGs in /public/placeholders/.

"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const ICON_ANIMATIONS: Record<string, Variants> = {
  OS: {
    idle: { scaleY: 1, scaleX: 1 },
    active: {
      scaleY: [1, 0.1, 1, 0.1, 1],
      scaleX: [1, 1.1, 1, 1.05, 1],
      transition: { duration: 0.7, times: [0, 0.15, 0.4, 0.55, 0.75] },
    },
  },
  Build: {
    idle: { x: 0 },
    active: {
      x: [0, -3, 3, -2, 2, 0],
      transition: { duration: 0.4 },
    },
  },
  Battery: {
    idle: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 },
    active: {
      clipPath: [
        "inset(0% 80% 0% 0%)",
        "inset(0% 60% 0% 0%)",
        "inset(0% 40% 0% 0%)",
        "inset(0% 20% 0% 0%)",
        "inset(0% 0% 0% 0%)",
      ],
      opacity: [0.4, 0.55, 0.7, 0.85, 1],
      transition: { duration: 0.8, ease: "easeOut" },
    },
  },
  "Connectivity + SIM": {
    idle: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 },
    active: {
      clipPath: [
        "inset(70% 0% 0% 0%)",
        "inset(50% 0% 0% 0%)",
        "inset(30% 0% 0% 0%)",
        "inset(0% 0% 0% 0%)",
      ],
      opacity: [0.3, 0.55, 0.8, 1],
      transition: { duration: 0.7, ease: "easeOut" },
    },
  },
  Display: {
    idle: { scaleX: 1 },
    active: {
      scaleX: [1, 1.25, 1, 1.15, 1],
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  },
  Processor: {
    idle: { rotate: 0 },
    active: {
      rotate: [0, 90, 180, 270, 360],
      transition: { duration: 0.7, ease: "linear" },
    },
  },
  Camera: {
    idle: { scale: 1, opacity: 1 },
    active: {
      scale: [1, 0.7, 1.2, 0.8, 1.1, 1],
      opacity: [1, 0.5, 1, 0.6, 1, 1],
      transition: { duration: 0.5 },
    },
  },
  "RAM + Storage": {
    idle: { x: 0, scaleX: 1 },
    active: {
      x: [0, -6, 6, -4, 4, 0],
      scaleX: [1, -1, 1, -1, 1, 1],
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  },
};

const SPECS = [
  [
    {
      icon: "/placeholders/spec-os.svg",
      title: "OS",
      subtitle: ["Android 15"],
    },
    {
      icon: "/placeholders/spec-build.svg",
      title: "Build",
      subtitle: ["Metal Frame + Glass"],
    },
    {
      icon: "/placeholders/spec-battery.svg",
      title: "Battery",
      subtitle: ["5000mAh", "18W Fast Charging"],
    },
    {
      icon: "/placeholders/spec-connectivity.svg",
      title: "Connectivity + SIM",
      subtitle: ["Dual SIM", "4G LTE, WiFi, BT5.0, NFC"],
    },
  ],
  [
    {
      icon: "/placeholders/spec-display.svg",
      title: "Display",
      subtitle: ['6.56" HD+ IPS'],
    },
    {
      icon: "/placeholders/spec-processor.svg",
      title: "Processor",
      subtitle: ["Octa-Core 2.0GHz"],
    },
    {
      icon: "/placeholders/spec-camera.svg",
      title: "Camera",
      subtitle: ["Rear 64MP + 2MP Macro", "Front 16MP AI Selfie"],
    },
    {
      icon: "/placeholders/spec-storage.svg",
      title: "RAM + Storage",
      subtitle: ["8GB RAM", "256GB Storage"],
    },
  ],
];

export default function TechSpecs() {
  return (
    <section
      id="tech-specs"
      className="w-full bg-xforge-black py-6 sm:py-12 lg:py-[120px] relative overflow-hidden"
    >
      <div className="max-w-[1096px] mx-auto px-4 sm:px-6">
        {/* Title */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-[20px] sm:text-[28px] lg:text-[32px] font-semibold leading-[1.1] text-white text-center mb-8 sm:mb-8 lg:mb-10"
        >
          This is the next generation of mobile technology
        </motion.h2>

        {/* Specs Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-col gap-2 sm:gap-4 lg:gap-6 max-w-[986px] mx-auto"
        >
          {SPECS.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4"
            >
              {row.map((spec) => (
                <motion.div
                  key={spec.title}
                  initial="idle"
                  whileHover="active"
                  whileTap="active"
                  className="flex flex-col gap-2 items-center justify-center text-center p-2 rounded-[24px] lg:rounded-[28px] border border-[#272727] h-[121px] sm:h-[130px] md:h-[140px] lg:h-[150px] cursor-pointer will-change-transform"
                  variants={{
                    idle: { y: 0, scale: 1 },
                    active: {
                      y: -6,
                      scale: 1.03,
                      transition: { type: "spring", stiffness: 400, damping: 25 },
                    },
                  }}
                >
                  <motion.div
                    variants={ICON_ANIMATIONS[spec.title]}
                    className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center"
                  >
                    <Image
                      src={spec.icon}
                      alt=""
                      width={32}
                      height={32}
                      className="w-6 h-6 lg:w-8 lg:h-8"
                      aria-hidden="true"
                    />
                  </motion.div>
                  <div className="flex flex-col gap-1 text-[14px] lg:text-base leading-[1.1] text-white">
                    <p className="font-semibold">{spec.title}</p>
                    {spec.subtitle.map((line, i) => (
                      <p key={i} className="font-normal text-[14px] lg:text-base">
                        {line}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
