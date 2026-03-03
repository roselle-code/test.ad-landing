// "Why XForge is Different" section: animated reward counter, phone mockup, reward cards.
// Dependencies: lib/animations, hooks/useLiveCounter, why-different/RewardCards
// Counter animation uses requestAnimationFrame for smooth number increment.
// Desktop/mobile reward cards are separate components for layout differences.

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { fadeInUp, scaleIn } from "@/lib/animations";
import { useLiveCounter } from "@/hooks/useLiveCounter";
import { DesktopRewardCards, MobileRewardCards } from "./why-different/RewardCards";

export default function WhyDifferent() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { margin: "-100px" });
  const [hasAppeared, setHasAppeared] = useState(false);
  const rewardCount = useLiveCounter(6367200, isInView && hasAppeared);

  useEffect(() => {
    if (isInView && !hasAppeared) setHasAppeared(true);
  }, [isInView, hasAppeared]);

  return (
    <section
      ref={sectionRef}
      id="why-different"
      className="w-full bg-xforge-black py-6 sm:py-10 lg:py-[48px]"
    >
      <div className="max-w-[1096px] mx-auto px-4 sm:px-6 flex flex-col-reverse lg:flex-row items-center gap-4 sm:gap-6 lg:gap-5">
        {/* Phone + Reward Cards wrapper */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scaleIn}
          className="relative w-full sm:w-[400px] md:w-[460px] lg:w-[532px] h-[358px] sm:h-[380px] md:h-[420px] lg:h-[532px] flex-shrink-0"
        >
          {/* Mobile phone image */}
          <div className="absolute inset-0 rounded-[16px] overflow-hidden bg-xforge-black lg:hidden">
            <div
              className="absolute"
              style={{
                left: "50%",
                top: "-85px",
                width: "612px",
                height: "815px",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ transform: "rotate(11.52deg)" }}>
                <Image
                  src="/placeholders/xforge-widget.png"
                  alt="XForge phone showing network rewards"
                  width={475}
                  height={735}
                  className="max-w-none"
                />
              </div>
            </div>
          </div>

          {/* Desktop phone image */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden bg-xforge-black hidden lg:block">
            <div
              className="absolute"
              style={{
                left: "-158px",
                top: "-120px",
                width: "903px",
                height: "1210px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ transform: "rotate(11.52deg)" }}>
                <Image
                  src="/placeholders/xforge-widget.png"
                  alt="XForge phone showing network rewards"
                  width={699}
                  height={1092}
                  className="max-w-none"
                />
              </div>
            </div>
          </div>

          <DesktopRewardCards rewardCount={rewardCount} />
          <MobileRewardCards rewardCount={rewardCount} />
        </motion.div>

        {/* Info Container */}
        <div className="flex-1 min-w-0 flex flex-col items-center lg:items-start gap-6 sm:gap-8 lg:gap-[48px] text-center lg:text-left">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-[20px] sm:text-[28px] md:text-[36px] lg:text-[44px] font-semibold leading-[1.1]"
          >
            <span className="text-white">Why XForge is </span>
            <span className="font-serif italic text-xforge-gold">
              Different
            </span>
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3 className="text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] font-medium leading-[1.1] text-white mb-3 sm:mb-4">
              Passive Contribution, Real Rewards
            </h3>
            <p className="text-[14px] sm:text-sm lg:text-base font-normal leading-[1.3] text-xforge-gray max-w-[486px]">
              XForge works just like any other smartphone, with no learning
              curve or new habits to adopt, while quietly supporting a shared
              network in the background to earn you points, perks, and future
              benefits.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-8 lg:gap-[35px]"
          >
            <div className="flex items-center gap-4 lg:gap-5">
              <span className="relative flex h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4">
                <span className="animate-ping absolute inset-0 rounded-full bg-xforge-green opacity-75" />
                <span
                  className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4 bg-xforge-green"
                  style={{ boxShadow: "0 0 8px 3px rgba(44,181,117,0.6), 0 0 20px 6px rgba(44,181,117,0.3)" }}
                />
              </span>
              <span
                className="text-xforge-green text-[14px] sm:text-[16px] lg:text-[24px] leading-[1.1]"
                style={{ textShadow: "0 0 10px rgba(44,181,117,0.5), 0 0 24px rgba(44,181,117,0.25)" }}
              >
                Node is Running
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p
                className="text-[20px] sm:text-[22px] lg:text-[32px] font-medium leading-[1.1] text-xforge-gold"
                style={{
                  textShadow:
                    "0 0 20px rgba(255,188,14,0.4), 0 0 40px rgba(255,188,14,0.2)",
                }}
              >
                24/7
              </p>
              <p className="text-[14px] sm:text-sm lg:text-base font-normal leading-[1.3] text-xforge-gray">
                Auto Earning
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
