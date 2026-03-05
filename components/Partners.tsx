// Partner logo marquee with CSS animation + manual horizontal scroll override.
// Uses animation-play-state to pause/resume (not class toggle — that causes jumps).
// To add/remove logos: update PARTNERS array. Dimensions are Figma-matched.

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const PARTNERS = [
  { name: "Razer", src: "/placeholders/logos/razer.svg", w: 228, h: 35, dw: 335, dh: 51 },
  { name: "Saison Capital", src: "/placeholders/logos/saison-capital.png", w: 155, h: 79, dw: 228, dh: 116 },
  { name: "Dragonfly", src: "/placeholders/logos/dragonfly.svg", w: 254, h: 23, dw: 374, dh: 34 },
  { name: "CoinFund", src: "/placeholders/logos/coinfund.svg", w: 223, h: 39, dw: 328, dh: 57 },
  { name: "Drip", src: "/placeholders/logos/drip.svg", w: 198, h: 35, dw: 291, dh: 51 },
  { name: "Huddle01", src: "/placeholders/logos/huddle01.png", w: 198, h: 37, dw: 291, dh: 54 },
  { name: "Dogecoin", src: "/placeholders/logos/dogecoin-group.svg", w: 198, h: 61, dw: 291, dh: 90 },
  { name: "Zephyrus Capital", src: "/placeholders/logos/zephyrus-capital.svg", w: 168, h: 75, dw: 247, dh: 110 },
  { name: "YGG", src: "/placeholders/logos/ygg.svg", w: 159, h: 79, dw: 234, dh: 116 },
  { name: "Animoca Brands", src: "/placeholders/logos/animoca-brands.png", w: 138, h: 83, dw: 203, dh: 122 },
  { name: "MSA", src: "/placeholders/logos/msa.png", w: 202, h: 85, dw: 297, dh: 125 },
  { name: "RBV", src: "/placeholders/logos/rbv.png", w: 89, h: 83, dw: 131, dh: 122 },
  { name: "Caballeros Capital", src: "/placeholders/logos/caballeros-capital.png", w: 178, h: 75, dw: 262, dh: 110 },
  { name: "Stream", src: "/placeholders/logos/stream.svg", w: 212, h: 37, dw: 312, dh: 54 },
  { name: "EaseFlow", src: "/placeholders/logos/easeflow.svg", w: 215, h: 33, dw: 316, dh: 49 },
  { name: "Founder Heads", src: "/placeholders/logos/founders-heads-a.svg", w: 172, h: 61, dw: 253, dh: 90 },
  { name: "Nolcha Shows", src: "/placeholders/logos/nolcha-shows.png", w: 190, h: 65, dw: 279, dh: 96 },
  { name: "NodeOps", src: "/placeholders/logos/nodeops-text.svg", w: 196, h: 51, dw: 288, dh: 75 },
  { name: "Aethir", src: "/placeholders/logos/aethir.svg", w: 206, h: 43, dw: 303, dh: 63 },
  { name: "DePIN Alliance", src: "/placeholders/logos/depin-alliance.svg", w: 115, h: 77, dw: 169, dh: 113 },
  { name: "Ampchampment", src: "/placeholders/logos/ampchampment.png", w: 150, h: 77, dw: 221, dh: 113 },
  { name: "Gede Esports", src: "/placeholders/logos/gede-esports.svg", w: 172, h: 67, dw: 253, dh: 99 },
  { name: "aPhone", src: "/placeholders/logos/aphone.png", w: 156, h: 61, dw: 229, dh: 90 },
  { name: "DePIN Hub", src: "/placeholders/logos/depin-hub.svg", w: 196, h: 43, dw: 288, dh: 63 },
  { name: "Boxmining", src: "/placeholders/logos/boxmining.png", w: 216, h: 71, dw: 318, dh: 104 },
  { name: "Cogitent Ventures", src: "/placeholders/logos/cogitent-ventures.png", w: 183, h: 61, dw: 269, dh: 90 },
  { name: "BitDoctor", src: "/placeholders/logos/bitdoctor.png", w: 221, h: 44, dw: 325, dh: 64 },
];

type Partner = (typeof PARTNERS)[number];

function PartnerLogo({ partner }: { partner: Partner }) {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex-shrink-0 flex items-center justify-center will-change-transform"
      style={{ width: partner.dw * 0.68, height: partner.dh * 0.68 }}
    >
      <Image
        src={partner.src}
        alt={partner.name}
        width={partner.dw}
        height={partner.dh}
        className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity duration-200"
      />
    </motion.div>
  );
}

const PAUSE_AFTER_INTERACTION_MS = 3000;

export default function Partners() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const pauseTemporarily = useCallback(() => {
    setIsPaused(true);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => setIsPaused(false), PAUSE_AFTER_INTERACTION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
    };
  }, []);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!trackRef.current) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      trackRef.current.scrollLeft += e.deltaY;
      pauseTemporarily();
    },
    [pauseTemporarily]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!trackRef.current) return;
      isDragging.current = true;
      dragStartX.current = e.pageX - trackRef.current.offsetLeft;
      dragScrollLeft.current = trackRef.current.scrollLeft;
      trackRef.current.style.cursor = "grabbing";
      pauseTemporarily();
    },
    [pauseTemporarily]
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = dragScrollLeft.current - (x - dragStartX.current) * 1.5;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  }, []);

  return (
    <section className="w-full bg-black py-10 sm:py-14 lg:py-[80px] overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-8 sm:gap-10 lg:gap-[60px]">
        {/* Logo marquee with manual scroll override */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.12, 1, 0.2, 1] }}
          className="w-full relative"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
          }}
        >
          <div
            ref={trackRef}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            className="overflow-x-auto scrollbar-hide select-none"
            style={{ cursor: "grab", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div
              className="flex w-max animate-marquee"
              style={{ animationPlayState: isPaused ? "paused" : "running" }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {[0, 1].map((set) => (
                <div
                  key={set}
                  className="flex items-center gap-8 sm:gap-10 lg:gap-12 px-4 sm:px-5 lg:px-6"
                  aria-hidden={set === 1}
                >
                  {PARTNERS.map((p) => (
                    <PartnerLogo key={`${set}-${p.name}`} partner={p} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Description text */}
        <motion.p
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.12, 1, 0.2, 1], delay: 0.3 }}
          className="text-[20px] sm:text-[26px] lg:text-[32px] font-semibold leading-[1.1] text-center px-6 sm:px-10">
          <span className="font-serif italic text-xforge-gold">
            World-class partners
          </span>
          <span className="text-white">
            {" "}bring elite mobile power to your pocket.
          </span>
        </motion.p>
      </div>
    </section>
  );
}
