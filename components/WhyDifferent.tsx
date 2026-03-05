// "Why XForge is Different" section — 3 staggered feature blocks with
// phone mockup, chat placeholder, and hologram placeholder.
// Dependencies: lib/animations, hooks/useLiveCounter, why-different/RewardCards

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
      className="w-full bg-[#050505] py-12 sm:py-16 lg:py-20"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-[60px]">
        <h2 className="sr-only">Why XForge is Different</h2>
        {/* ── Desktop layout (lg+) ─────────────────────────── */}
        <div className="hidden lg:grid grid-cols-2 gap-x-16 gap-y-10">
          {/* Row 1 left: Feature 1 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col gap-2 max-w-[400px] pt-4"
          >
            <h3 className="text-[28px] font-medium leading-[1.1] text-white">
              <span className="font-serif italic text-[#ffbc0e]">Intelligence</span>
              {" "}with a purpose
            </h3>
            <p className="text-[16px] font-normal leading-[1.3] text-[#999]">
              {`We built an exclusive hub that pairs a brilliant AI assistant with your daily rewards. It's a powerful tool that makes your life easier while you help power a better internet.`}
            </p>
          </motion.div>

          {/* Row 1 right: Chat placeholder */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="flex justify-end"
          >
            <div className="w-[220px] h-[280px] rounded-[12px] overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#0a0a14] border border-[#333] flex items-center justify-center">
              <Image
                src="/placeholders/chat-placeholder.png"
                alt="AI chat assistant"
                width={220}
                height={280}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  target.parentElement!.innerHTML =
                    '<span class="text-[#666] text-sm text-center px-4">Chat UI placeholder</span>';
                }}
              />
            </div>
          </motion.div>

          {/* Row 2 left: Phone mockup with rewards + 24/7 stat */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleIn}
            className="relative w-full h-[420px]"
          >
            {/* Phone container — top visible, bottom cropped */}
            <div className="relative w-[421px] h-[340px] rounded-[24px] overflow-hidden bg-[#050505]">
              <div
                className="absolute"
                style={{
                  left: "55%",
                  top: "10px",
                  transform: "translateX(-50%)",
                }}
              >
                <div style={{ transform: "rotate(11.52deg)", transformOrigin: "top center" }}>
                  <Image
                    src="/placeholders/xforge-widget.png"
                    alt="XForge phone showing network rewards"
                    width={586}
                    height={917}
                    className="max-w-none"
                    style={{ width: 550, height: "auto" }}
                  />
                </div>
              </div>
              <DesktopRewardCards rewardCount={rewardCount} />
            </div>

            {/* 24/7 stat — at the bottom edge of the phone */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <p
                className="text-[32px] font-medium leading-[1.1] text-[#ffbc0e]"
                style={{ textShadow: "0px 1px 20.2px #ffee53" }}
              >
                24/7
              </p>
              <p className="text-[16px] font-normal leading-[1.3] text-[#999]">
                Auto Earning
              </p>
            </div>
          </motion.div>

          {/* Row 2 right: Feature 2 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col gap-2 max-w-[400px] pt-8"
          >
            <h3 className="text-[28px] font-medium leading-[1.1] text-white">
              A quiet revolution in your pocket
            </h3>
            <p className="text-[16px] font-normal leading-[1.3] text-[#999]">
              {`When you use XForge, you are doing more than connecting with friends. You're helping to build a stronger, more resilient internet. It's a profound shift in how everyday technology works.`}
            </p>
          </motion.div>

          {/* Row 3 left: Feature 3 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col gap-2 max-w-[400px]"
          >
            <h3 className="text-[28px] font-medium leading-[1.1] text-white">
              Capture the magic
            </h3>
            <p className="text-[16px] font-normal leading-[1.3] text-[#999]">
              {`Life moves fast. Your camera should keep up. We designed the AI camera system on XForge to instantly understand what you're shooting and make it look spectacular.`}
            </p>
          </motion.div>

          {/* Row 3 right: Plant hologram placeholder */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="flex justify-end items-end"
          >
            <div className="w-[240px] h-[230px] rounded-[16px] overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0d2847] border border-[#1a3a5c] flex items-center justify-center">
              <Image
                src="/placeholders/hologram-placeholder.png"
                alt="AI camera magic"
                width={240}
                height={230}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  target.parentElement!.innerHTML =
                    '<span class="text-[#666] text-sm text-center px-4">Hologram placeholder</span>';
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* ── Mobile layout ────────────────────────────────── */}
        <div className="flex flex-col gap-10 lg:hidden">
          {/* Feature 1 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col gap-2 text-center"
          >
            <h3 className="text-[22px] sm:text-[26px] font-medium leading-[1.1] text-white">
              <span className="font-serif italic text-[#ffbc0e]">Intelligence</span>
              {" "}with a purpose
            </h3>
            <p className="text-[14px] sm:text-[15px] font-normal leading-[1.3] text-[#999]">
              {`We built an exclusive hub that pairs a brilliant AI assistant with your daily rewards. It's a powerful tool that makes your life easier while you help power a better internet.`}
            </p>
          </motion.div>

          {/* Phone mockup + rewards + 24/7 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleIn}
            className="relative w-full sm:w-[400px] mx-auto"
          >
            <div className="relative w-full h-[300px] sm:h-[340px] rounded-[16px] overflow-hidden bg-[#050505]">
              <div
                className="absolute"
                style={{
                  left: "50%",
                  top: "8px",
                  transform: "translateX(-50%)",
                }}
              >
                <div style={{ transform: "rotate(11.52deg)", transformOrigin: "top center" }}>
                  <Image
                    src="/placeholders/xforge-widget.png"
                    alt="XForge phone showing network rewards"
                    width={475}
                    height={735}
                    className="max-w-none"
                    style={{ width: 420, height: "auto" }}
                  />
                </div>
              </div>
              <MobileRewardCards rewardCount={rewardCount} />
            </div>

            {/* 24/7 stat — at edge of phone */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <p
                className="text-[24px] sm:text-[28px] font-medium leading-[1.1] text-[#ffbc0e]"
                style={{ textShadow: "0px 1px 20.2px #ffee53" }}
              >
                24/7
              </p>
              <p className="text-[14px] sm:text-[15px] font-normal leading-[1.3] text-[#999]">
                Auto Earning
              </p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col gap-2 text-center"
          >
            <h3 className="text-[22px] sm:text-[26px] font-medium leading-[1.1] text-white">
              A quiet revolution in your pocket
            </h3>
            <p className="text-[14px] sm:text-[15px] font-normal leading-[1.3] text-[#999]">
              {`When you use XForge, you are doing more than connecting with friends. You're helping to build a stronger, more resilient internet. It's a profound shift in how everyday technology works.`}
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col gap-2 text-center"
          >
            <h3 className="text-[22px] sm:text-[26px] font-medium leading-[1.1] text-white">
              Capture the magic
            </h3>
            <p className="text-[14px] sm:text-[15px] font-normal leading-[1.3] text-[#999]">
              {`Life moves fast. Your camera should keep up. We designed the AI camera system on XForge to instantly understand what you're shooting and make it look spectacular.`}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
