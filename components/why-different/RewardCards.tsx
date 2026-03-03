"use client";

import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CARD_ANGLE = {
  rotate: -3.78,
  skewX: 3.73,
};

const cardTransform = `rotate(${CARD_ANGLE.rotate}deg) skewX(${CARD_ANGLE.skewX}deg)`;

const backCardReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: 0.2 },
  },
};

const midCardReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: 0.35 },
  },
};

const rewardElevate = {
  hidden: { opacity: 0, y: 50, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: EASE, delay: 0.5 },
  },
};

function StaticCard() {
  return (
    <div className="flex items-start justify-between mb-3 lg:mb-3">
      <span className="text-[#686c81] text-[11px] lg:text-[17px]">Network Rewards</span>
      <div className="flex items-center gap-2 lg:gap-3">
        <span className="inline-flex rounded-full h-[7px] w-[7px] lg:h-[11px] lg:w-[11px] bg-xforge-green" />
        <span className="text-xforge-green text-[11px] lg:text-[17px]">Node is Running</span>
      </div>
    </div>
  );
}

function StaticValue() {
  return (
    <span className="font-display font-bold text-xforge-gold text-[29px] lg:text-[43px] leading-[1.1]">
      6,367,200
    </span>
  );
}

export function DesktopRewardCards({ rewardCount }: { rewardCount: number }) {
  return (
    <>
      {/* Back card */}
      <div
        className="hidden lg:block absolute z-10 w-[326px]"
        style={{
          left: "calc(54% - 163px)",
          top: "calc(50% - 55px)",
          transform: cardTransform,
          filter: "blur(1.86px)",
        }}
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={backCardReveal}>
          <div className="bg-xforge-card-bg/90 backdrop-blur-sm border border-[#bdbdbd]/40 rounded-[14px] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
            <StaticCard />
            <div className="bg-xforge-card-bg2 border border-[#bdbdbd]/40 rounded-xl p-3 flex items-center justify-center">
              <StaticValue />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mid card */}
      <div
        className="hidden lg:block absolute z-20 w-[326px]"
        style={{
          left: "calc(58% - 163px)",
          top: "calc(47% - 55px)",
          transform: cardTransform,
          filter: "blur(0.93px)",
        }}
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={midCardReveal}>
          <div className="bg-xforge-card-bg/90 backdrop-blur-sm border border-[#bdbdbd]/40 rounded-[14px] p-4 shadow-[0_16px_50px_rgba(0,0,0,0.5)]">
            <StaticCard />
            <div className="bg-xforge-card-bg2 border border-[#bdbdbd]/40 rounded-xl p-3 flex items-center justify-center">
              <StaticValue />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Front card (live counter) */}
      <div
        className="hidden lg:block absolute z-30 w-[326px]"
        style={{
          left: "calc(61% - 163px)",
          top: "calc(43% - 55px)",
          transform: cardTransform,
        }}
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={rewardElevate}>
          <div className="bg-xforge-card-bg3 backdrop-blur-md border border-[#bdbdbd]/40 rounded-[14px] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="flex items-start mb-3">
              <span className="text-[#aeb2c7] text-[17px]">Network Rewards</span>
            </div>
            <div className="bg-xforge-card-bg2 border border-[#bdbdbd]/40 rounded-xl p-3 flex items-center justify-center">
              <span className="font-display font-bold text-xforge-gold text-[43px] leading-[1.1] tabular-nums">
                {rewardCount.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export function MobileRewardCards({ rewardCount }: { rewardCount: number }) {
  return (
    <>
      {/* Back card */}
      <div
        className="block lg:hidden absolute z-10 w-[220px]"
        style={{
          left: "calc(50% - 93px)",
          top: "calc(50% - 91px)",
          transform: cardTransform,
          filter: "blur(1.25px)",
        }}
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={backCardReveal}>
          <div className="bg-xforge-card-bg backdrop-blur-sm border border-[#bdbdbd]/40 rounded-[9px] p-[11px] shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
            <StaticCard />
            <div className="bg-xforge-card-bg2 border border-[#bdbdbd]/40 rounded-[8px] p-[7px] h-[53px] flex items-center justify-center">
              <StaticValue />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mid card */}
      <div
        className="block lg:hidden absolute z-20 w-[220px]"
        style={{
          left: "calc(50% - 82px)",
          top: "calc(50% - 103px)",
          transform: cardTransform,
          filter: "blur(0.63px)",
        }}
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={midCardReveal}>
          <div className="bg-xforge-card-bg backdrop-blur-sm border border-[#bdbdbd]/40 rounded-[9px] p-[11px] shadow-[0_16px_50px_rgba(0,0,0,0.5)]">
            <StaticCard />
            <div className="bg-xforge-card-bg2 border border-[#bdbdbd]/40 rounded-[8px] p-[7px] h-[53px] flex items-center justify-center">
              <StaticValue />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Front card (live counter) */}
      <div
        className="block lg:hidden absolute z-30 w-[220px]"
        style={{
          left: "calc(50% - 71px)",
          top: "calc(50% - 117px)",
          transform: cardTransform,
        }}
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={rewardElevate}>
          <div className="bg-xforge-card-bg3 backdrop-blur-md border border-[#bdbdbd]/40 rounded-[9px] p-[11px] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="flex items-start mb-[7px]">
              <span className="text-[#aeb2c7] text-[11px]">Network Rewards</span>
            </div>
            <div className="bg-xforge-card-bg2 border border-[#bdbdbd]/40 rounded-[8px] p-[7px] h-[53px] flex items-center justify-center">
              <span className="font-display font-bold text-xforge-gold text-[29px] leading-[1.1] tabular-nums">
                {rewardCount.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
