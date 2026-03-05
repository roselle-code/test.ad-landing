// Mosaic gallery — asymmetric photo grid with hover scale + tagline + email.
//
// Gallery versions (revert by name):
//   "circular"  — commit ba773d8
//   "crossfade" — commit f7cdaad
//   "scatter"   — previous version
//   "grid"      — commit f99c3e9
//   "mosaic"    — this version

"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

import EmailSubscription from "./mosaic-gallery/EmailSubscription";

const CARD_BG =
  "radial-gradient(ellipse at center top, #050505, #141414 50%, #2a2a2a 62.5%, #404040 75%, #565656 87.5%, #6d6d6d 100%)";

const hoverProps = {
  whileHover: { scale: 1.03, transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
  whileTap: { scale: 1.01, transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
};

interface CardProps {
  src: string;
  alt: string;
  className: string;
  objectPosition?: string;
  sizes?: string;
  parallaxRange?: number;
  zoom?: number;
  index?: number;
}

function PhotoCard({ src, alt, className, objectPosition, sizes, parallaxRange = 60, zoom, index = 0 }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [parallaxRange, -parallaxRange]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05, margin: "100px 0px 0px 0px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      {...hoverProps}
      className={`relative overflow-hidden rounded-[14px] sm:rounded-[18px] md:rounded-[20px] shadow-[0px_6px_6px_rgba(0,0,0,0.25)] cursor-pointer ${className}`}
      style={{ background: CARD_BG }}
    >
      <motion.div className="absolute inset-[-60px]" style={{ y, scale: zoom ?? 1 }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 50vw, 25vw"}
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
        />
      </motion.div>
    </motion.div>
  );
}

export default function MosaicGallery() {
  return (
    <section id="mosaic-gallery" className="bg-white text-black py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[60px]">
        <h2 className="sr-only">See XForge in Action</h2>
        {/* ── Desktop mosaic (md+) ─────────────────────────── */}
        <div className="hidden md:grid gap-[10px]" style={{
          gridTemplateColumns: "26.5% 32.5% 24.5% 14.3%",
          gridTemplateRows: "188px 276px 229px",
        }}>
          {/* Row 1-2 left: Dog camera — tall card spanning 2 rows */}
          <PhotoCard
            src="/placeholders/carousel-4.webp"
            alt="Camera with dog"
            className="row-span-2"
            objectPosition="40% 10%"
            sizes="26vw"
            index={0}
          />
          {/* Row 1 center: XForge on desk — short wide */}
          <PhotoCard
            src="/placeholders/carousel-6.webp"
            alt="XForge on desk"
            className=""
            objectPosition="60% 54%"
            sizes="32vw"
            index={1}
          />
          {/* Row 1 right: Gaming screen */}
          <PhotoCard
            src="/placeholders/carousel-1.webp"
            alt="Gaming on screen"
            className=""
            objectPosition="38% 29%"
            sizes="24vw"
            index={2}
          />
          {/* Row 1 far-right: XForge box — narrow */}
          <PhotoCard
            src="/placeholders/carousel-3.webp"
            alt="XForge packaging"
            className=""
            objectPosition="center center"
            sizes="14vw"
            index={3}
          />
          {/* Row 2 center: MOBA gaming */}
          <PhotoCard
            src="/placeholders/carousel-5.webp"
            alt="MOBA gaming"
            className=""
            objectPosition="center 42%"
            sizes="32vw"
            index={4}
          />
          {/* Row 2 right: Text card — spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05, margin: "100px 0px 0px 0px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="col-span-2 relative overflow-hidden rounded-[20px] shadow-[0px_6px_6px_rgba(0,0,0,0.25)] flex items-center px-10"
          >
            <p className="text-[46px] font-medium leading-[1.1]">
              <span className="text-[#707070]">Beautifully crafted and incredibly </span>
              <span className="text-black font-serif italic">smart</span>
            </p>
          </motion.div>
          {/* Row 3 left: Rewards / node dashboard */}
          <PhotoCard
            src="/placeholders/carousel-2.webp"
            alt="Rewards dashboard"
            className=""
            objectPosition="center 50%"
            sizes="26vw"
            index={6}
          />
          {/* Row 3 center: Selfie */}
          <PhotoCard
            src="/placeholders/carousel-8.webp"
            alt="Holding XForge"
            className=""
            sizes="32vw"
            objectPosition="55% 38%"
            zoom={1.2}
            index={7}
          />
          {/* Row 3 right: VR/back — wide, spans 2 cols */}
          <PhotoCard
            src="/placeholders/carousel-7.webp"
            alt="Back view"
            className="col-span-2"
            objectPosition="30% 58%"
            zoom={1.2}
            sizes="40vw"
            index={8}
          />
        </div>

        {/* ── Mobile mosaic ─────────────────────────── */}
        <div className="flex flex-col gap-[8px] md:hidden">
          {/* Group 1: Dog (tall left) + accessories & rewards (right) + text card & selfie */}
          <div className="grid gap-[4px]" style={{
            gridTemplateColumns: "44% 1fr",
            gridTemplateRows: "85px 121px 104px",
          }}>
            <PhotoCard src="/placeholders/carousel-4.webp" alt="Camera with dog" className="row-span-2" objectPosition="25% 15%" sizes="50vw" index={0} />
            <PhotoCard src="/placeholders/carousel-6.webp" alt="XForge on desk" className="" objectPosition="center 50%" sizes="50vw" index={1} />
            <PhotoCard src="/placeholders/carousel-2.webp" alt="Rewards dashboard" className="" objectPosition="center center" sizes="50vw" index={2} />
            {/* Text card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05, margin: "100px 0px 0px 0px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative overflow-hidden rounded-[9px] shadow-[0px_3px_3px_rgba(0,0,0,0.25)] flex items-center px-3"
            >
              <p className="text-[20px] font-medium leading-[1.1]">
                <span className="text-[#707070]">Beautifully crafted and incredibly </span>
                <span className="text-black font-serif italic">smart</span>
              </p>
            </motion.div>
            <PhotoCard src="/placeholders/carousel-8.webp" alt="Holding XForge" className="" objectPosition="65% 35%" sizes="50vw" index={4} />
          </div>

          {/* Group 2: Desktop + box (side by side), MOBA & back (full width) */}
          <div className="grid gap-[4px]" style={{
            gridTemplateColumns: "62% 1fr",
            gridTemplateRows: "155px 154px 156px",
          }}>
            <PhotoCard src="/placeholders/carousel-1.webp" alt="Gaming on screen" className="" objectPosition="center 35%" sizes="62vw" index={5} />
            <PhotoCard src="/placeholders/carousel-3.webp" alt="XForge packaging" className="" objectPosition="center 40%" sizes="38vw" index={6} />
            <PhotoCard src="/placeholders/carousel-5.webp" alt="MOBA gaming" className="col-span-2" objectPosition="center 40%" sizes="100vw" index={7} />
            <PhotoCard src="/placeholders/carousel-7.webp" alt="Back view" className="col-span-2" objectPosition="center 40%" sizes="100vw" index={8} />
          </div>
        </div>

        {/* Tagline — mobile only (desktop has it inside the grid) */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.08, 0.9, 0.15, 1] }}
          className="md:hidden mt-8 flex flex-col gap-1 text-[16px] leading-[1.1] text-center px-2">
          <p className="font-bold italic text-black">
            Beautifully crafted and incredibly smart,
          </p>
          <p className="font-normal text-[#999]">
            it is designed to help power a better internet and quietly reward
            you along the way.
          </p>
        </motion.div>

        {/* Email subscription */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.08, 0.9, 0.15, 1], delay: 0.3 }}
          className="flex justify-center mt-8 lg:mt-10">
          <EmailSubscription />
        </motion.div>
      </div>
    </section>
  );
}
