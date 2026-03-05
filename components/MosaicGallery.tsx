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
  whileHover: { scale: 1.03 },
  whileTap: { scale: 1.01 },
  transition: { type: "spring" as const, stiffness: 300, damping: 20 },
};

interface CardProps {
  src: string;
  alt: string;
  className: string;
  objectPosition?: string;
  sizes?: string;
  parallaxRange?: number;
  zoom?: number;
}

function PhotoCard({ src, alt, className, objectPosition, sizes, parallaxRange = 60, zoom }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [parallaxRange, -parallaxRange]);

  return (
    <motion.div
      ref={ref}
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
          gridTemplateRows: "188px 276px 228px",
        }}>
          {/* Row 1-2 left: Dog camera — tall card spanning 2 rows */}
          <PhotoCard
            src="/placeholders/carousel-4.png"
            alt="Camera with dog"
            className="row-span-2"
            objectPosition="40% 10%"
            sizes="26vw"
          />
          {/* Row 1 center: XForge on desk — short wide */}
          <PhotoCard
            src="/placeholders/carousel-6.png"
            alt="XForge on desk"
            className=""
            objectPosition="55% 60%"
            sizes="32vw"
          />
          {/* Row 1 right: Gaming screen */}
          <PhotoCard
            src="/placeholders/carousel-1.png"
            alt="Gaming on screen"
            className=""
            objectPosition="55% 25%"
            sizes="24vw"
          />
          {/* Row 1 far-right: XForge box — narrow */}
          <PhotoCard
            src="/placeholders/carousel-3.png"
            alt="XForge packaging"
            className=""
            objectPosition="center center"
            sizes="14vw"
          />
          {/* Row 2 center: Blue rewards */}
          <PhotoCard
            src="/placeholders/carousel-2.png"
            alt="Rewards dashboard"
            className=""
            objectPosition="center 55%"
            sizes="32vw"
          />
          {/* Row 2 right: MOBA gaming — wide, spans 2 cols */}
          <PhotoCard
            src="/placeholders/carousel-5.png"
            alt="MOBA gaming"
            className="col-span-2"
            objectPosition="center 45%"
            sizes="40vw"
          />
          {/* Row 3 left: Camera close-up */}
          <PhotoCard
            src="/placeholders/carousel-4-closeup.png"
            alt="AI HD Camera close-up"
            className=""
            objectPosition="55% 40%"
            sizes="26vw"
          />
          {/* Row 3 center: Selfie */}
          <PhotoCard
            src="/placeholders/carousel-8.png"
            alt="Holding XForge"
            className=""
            sizes="32vw"
            objectPosition="center 40%"
            zoom={1.2}
          />
          {/* Row 3 right: VR/back — wide, spans 2 cols */}
          <PhotoCard
            src="/placeholders/carousel-7.png"
            alt="Back view"
            className="col-span-2"
            objectPosition="center 45%"
            zoom={1.2}
            sizes="40vw"
          />
        </div>

        {/* ── Mobile grid (2 cols) ─────────────────────────── */}
        <div className="grid md:hidden grid-cols-2 gap-2">
          <PhotoCard src="/placeholders/carousel-4.png" alt="Camera with dog" className="aspect-[3/4] col-span-2" objectPosition="40% 10%" sizes="100vw" />
          <PhotoCard src="/placeholders/carousel-6.png" alt="XForge on desk" className="aspect-[4/3]" objectPosition="55% 60%" sizes="50vw" />
          <PhotoCard src="/placeholders/carousel-1.png" alt="Gaming on screen" className="aspect-[4/3]" objectPosition="55% 25%" sizes="50vw" />
          <PhotoCard src="/placeholders/carousel-2.png" alt="Rewards dashboard" className="aspect-[4/3]" objectPosition="center 55%" sizes="50vw" />
          <PhotoCard src="/placeholders/carousel-5.png" alt="MOBA gaming" className="aspect-[4/3]" objectPosition="center 45%" sizes="50vw" />
          <PhotoCard src="/placeholders/carousel-3.png" alt="XForge packaging" className="aspect-[4/3]" sizes="50vw" />
          <PhotoCard src="/placeholders/carousel-8.png" alt="Holding XForge" className="aspect-[4/3]" sizes="50vw" />
          <PhotoCard src="/placeholders/carousel-7.png" alt="Back view" className="aspect-[4/3] col-span-2" sizes="100vw" />
        </div>

        {/* Tagline */}
        <p className="mt-8 lg:mt-10 text-[14px] sm:text-[16px] lg:text-[20px] leading-[1.4] text-center px-2 lg:whitespace-nowrap">
          <span className="font-bold italic text-black">
            Beautifully crafted and incredibly smart,
          </span>{" "}
          <span className="text-[#707070]">
            it is designed to help power a better internet and quietly reward
            you along the way.
          </span>
        </p>

        {/* Email subscription */}
        <div className="flex justify-center mt-8 lg:mt-10">
          <EmailSubscription />
        </div>
      </div>
    </section>
  );
}
