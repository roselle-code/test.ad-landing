// Scroll-driven "scatter" gallery — long-scroll parallax layout.
// Photos are scattered at random positions/rotations around centered feature text.
// As user scrolls, photos float at different parallax speeds, creating depth.
// No sticky/pinning — everything scrolls naturally like an Apple product page.
//
// Gallery versions (revert by name):
//   "circular"  — commit ba773d8
//   "crossfade" — commit f7cdaad
//   "scatter"   — this version

"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FEATURES } from "./how-it-works/gallery-config";
import EmailSubscription from "./how-it-works/EmailSubscription";
import MobileGallery from "./how-it-works/MobileGallery";

gsap.registerPlugin(ScrollTrigger);

interface ScatterPhoto {
  src: string;
  left: string;
  top: string;
  w: number;
  h: number;
  rot: number;
  parallax: number;
}

const FEATURE_PHOTOS: ScatterPhoto[][] = [
  [
    { src: "/placeholders/carousel-5.png", left: "5%", top: "8%", w: 200, h: 230, rot: -12, parallax: -60 },
    { src: "/placeholders/carousel-6.png", left: "62%", top: "0%", w: 190, h: 210, rot: 8, parallax: -80 },
  ],
  [
    { src: "/placeholders/carousel-1.png", left: "0%", top: "5%", w: 195, h: 235, rot: -8, parallax: -50 },
    { src: "/placeholders/carousel-3.png", left: "35%", top: "-8%", w: 215, h: 255, rot: 3, parallax: -70 },
    { src: "/placeholders/carousel-4.png", left: "68%", top: "10%", w: 175, h: 200, rot: 10, parallax: -45 },
  ],
  [
    { src: "/placeholders/carousel-2.png", left: "8%", top: "0%", w: 200, h: 235, rot: -5, parallax: -55 },
    { src: "/placeholders/carousel-7.png", left: "58%", top: "-5%", w: 200, h: 220, rot: 7, parallax: -65 },
    { src: "/placeholders/carousel-8.png", left: "30%", top: "55%", w: 180, h: 200, rot: -3, parallax: -40 },
  ],
];

const ALL_FLAT = FEATURE_PHOTOS.flat();
const TOTAL_PHOTOS = ALL_FLAT.length;

function getRefIndex(fi: number, pi: number) {
  let idx = 0;
  for (let i = 0; i < fi; i++) idx += FEATURE_PHOTOS[i].length;
  return idx + pi;
}

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>(new Array(TOTAL_PHOTOS).fill(null));

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const animations: gsap.core.Timeline[] = [];

      photoRefs.current.forEach((el, i) => {
        if (!el) return;
        const photo = ALL_FLAT[i];
        const parent = el.closest("[data-feature-block]") as HTMLElement;
        if (!parent) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: parent,
            start: "top 90%",
            end: "bottom 10%",
            scrub: 1.5,
          },
        });

        // Phase 1: reveal — photo zooms in, fades in, moves with parallax
        tl.fromTo(
          el,
          {
            y: -photo.parallax * 0.5,
            scale: 0.82,
            opacity: 0,
            rotation: photo.rot + 8,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            rotation: photo.rot,
            duration: 0.4,
            ease: "power1.out",
          }
        );

        // Phase 2: float — continues parallax drift, slight scale bump
        tl.to(el, {
          y: photo.parallax * 0.5,
          scale: 1.03,
          opacity: 0.92,
          rotation: photo.rot - 3,
          duration: 0.6,
          ease: "none",
        });

        animations.push(tl);
      });

      return () => {
        animations.forEach((tl) => tl.scrollTrigger?.kill());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-white text-black">
      {/* Desktop: long-scroll parallax layout */}
      <div className="hidden md:block">
        <div className="pt-[60px] lg:pt-[80px] pb-[10px] text-center">
          <h2 className="text-[36px] lg:text-[44px] font-semibold leading-[1.1]">
            <span>How XForge </span>
            <span className="font-serif italic underline">Works</span>
          </h2>
        </div>

        {FEATURES.map((feature, fi) => {
          const photos = FEATURE_PHOTOS[fi];
          return (
            <div
              key={fi}
              data-feature-block
              className="relative max-w-[950px] mx-auto"
              style={{ minHeight: 560 }}
            >
              {/* Scattered photos */}
              {photos.map((photo, pi) => (
                <div
                  key={pi}
                  ref={(el) => {
                    photoRefs.current[getRefIndex(fi, pi)] = el;
                  }}
                  className="absolute rounded-2xl overflow-hidden shadow-[0px_5px_15px_rgba(0,0,0,0.2)] will-change-transform"
                  style={{
                    left: photo.left,
                    top: photo.top,
                    width: photo.w,
                    height: photo.h,
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={`XForge feature ${fi + 1}`}
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

              {/* Centered text */}
              <div
                className="relative z-10 flex items-center justify-center text-center px-6"
                style={{ minHeight: 560 }}
              >
                <div className="max-w-[420px]">
                  <h3 className="text-[24px] lg:text-[30px] font-medium leading-[1.1] text-black mb-[14px]">
                    {feature.title}
                  </h3>
                  <p className="text-sm lg:text-base font-normal leading-[1.4] text-[#4d4d4d]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Email subscription at bottom */}
        <div className="flex justify-center pt-6 pb-[60px] lg:pb-[80px]">
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
