// "Why XForge is Different" section — 3 staggered feature blocks with
// phone mockup, AI chatbot widget, floating badges, and camera photo.
// Dependencies: lib/animations, hooks/useLiveCounter, why-different/RewardCards

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate as fmAnimate,
} from "framer-motion";
import { fadeInUp, scaleIn } from "@/lib/animations";
import { useLiveCounter } from "@/hooks/useLiveCounter";
import { DesktopRewardCards, MobileRewardCards } from "./why-different/RewardCards";

function FloatingBadge({
  children,
  className,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`badge-glitch bg-[rgba(77,74,69,0.5)] border border-[#8b8b8b]/50 rounded-[7px] px-[9px] py-[2px] h-[32px] flex items-center justify-center font-mono text-[14px] text-white whitespace-nowrap ${className}`}
      style={{
        ...style,
        animationDelay: `${2 + delay * 2}s`,
      }}
    >
      {children}
    </motion.div>
  );
}

const CONVERSATION = [
  {
    user: "Give me a quick recap of what my node actually accomplished this month. I want to know if I'm making a real difference.",
    bot: "Big time! You processed 400+ secure requests and hit a 100% uptime streak.\nYour contribution just added 5 xKICK to your wallet!",
  },
  {
    user: "Current status of my nodes?",
    bot: "Node Status:\nLatest Challenge Created: 2026-02-27, 09:19:36\nLatest Submitted Challenge #: None\nLatest Claimed Challenge #: 1928\nWorker Status: No workers scheduled",
  },
  {
    user: "Show me summary of my wallet and assigned node",
    bot: "Operator Adders: 0x2134...d21\nPrivate Key: Configured\nDelegated Addresseses: None\nTotal Node IDs: 0\nRPC URL: https://sepolia.base.org\nRewarder Contract: 0x327eb861...",
  },
];

function TypingDots() {
  return (
    <div className="flex gap-1 items-center h-[18px] px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[5px] h-[5px] rounded-full bg-white/50"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

type ChatMessage = { role: "user" | "bot"; text: string };

function useChatAnimation(inView: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [showDots, setShowDots] = useState(false);
  const [started, setStarted] = useState(false);
  const hasRun = useRef(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (!inView || hasRun.current) return;
    hasRun.current = true;

    const q = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timeoutsRef.current.push(t);
    };

    const runCycle = () => {
      setMessages([]);
      setInputText("");
      setShowDots(false);

      const runExchange = (idx: number) => {
        if (idx >= CONVERSATION.length) {
          q(() => runCycle(), 2000);
          return;
        }
        const { user, bot } = CONVERSATION[idx];

        let ci = 0;
        const typeInInput = () => {
          if (ci <= user.length) {
            setInputText(user.slice(0, ci));
            ci++;
            q(typeInInput, 18);
          } else {
            q(() => {
              setInputText("");
              setMessages((prev) => [...prev, { role: "user", text: user }]);

              q(() => {
                setShowDots(true);
                q(() => {
                  setShowDots(false);
                  q(() => {
                    setMessages((prev) => [...prev, { role: "bot", text: bot }]);
                    q(() => runExchange(idx + 1), 1200);
                  }, 250);
                }, 1200);
              }, 500);
            }, 350);
          }
        };

        typeInInput();
      };

      runExchange(0);
    };

    q(() => { setStarted(true); runCycle(); }, 600);

    return () => timeoutsRef.current.forEach(clearTimeout);
  }, [inView]);

  return { messages, inputText, showDots, started };
}

function ChatbotWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const { messages, inputText, showDots, started } = useChatAnimation(inView);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, showDots]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[rgba(255,255,255,0.08)] rounded-[16px] p-3 flex flex-col gap-4 w-full max-w-[340px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-medium text-white">Xardian AI</span>
        <span className="text-white/60 text-[18px] cursor-pointer leading-none">&times;</span>
      </div>

      {/* Messages — fixed height, scrollable */}
      <div
        ref={scrollRef}
        className="flex flex-col gap-4 h-[223px] overflow-y-auto scrollbar-hide scroll-smooth"
      >
        <AnimatePresence>
          {messages.map((msg, i) =>
            msg.role === "user" ? (
              <motion.div
                key={`msg-${i}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-end p-[3px]"
              >
                <div className="bg-[rgba(255,186,12,0.15)] rounded-tl-[12px] rounded-tr-[12px] rounded-bl-[12px] p-[15px] max-w-[255px]">
                  <p className="text-[12px] text-[#ffbc0e] leading-[1.5]">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`msg-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex gap-[6px] items-end"
              >
                <div className="w-[33px] h-[33px] rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex-shrink-0" />
                <div className="bg-[rgba(255,255,255,0.1)] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] p-[15px]">
                  <p className="text-[12px] text-white leading-[1.5] max-w-[225px] whitespace-pre-line">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ),
          )}

          {/* Bot typing dots */}
          {showDots && (
            <motion.div
              key="typing-dots"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-[6px] items-end"
            >
              <div className="w-[33px] h-[33px] rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex-shrink-0" />
              <div className="bg-[rgba(255,255,255,0.1)] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] p-[15px]">
                <TypingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input field */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 bg-black rounded-full px-[15px] py-[9px] h-[34px] overflow-hidden">
          {started && inputText ? (
            <div className="overflow-x-auto scrollbar-hide h-full flex items-center" ref={(el) => { if (el) el.scrollLeft = el.scrollWidth; }}>
              <span className="text-[12px] text-white leading-[1.5] whitespace-nowrap">
                {inputText}
                <span className="inline-block w-[2px] h-[13px] bg-white ml-[1px] animate-pulse align-middle" />
              </span>
            </div>
          ) : (
            <span className="text-[12px] text-[#6e6e6e]">What else can I help?</span>
          )}
        </div>
        <div className="w-[36px] h-[36px] bg-[#e5a501] rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

const VF_W = 178;
const VF_H = 172;
const VF_BASE_X = 97;
const VF_BASE_Y = 40;
const CONTAINER_W = 377;
const CONTAINER_H = 257;

function ViewfinderCorners() {
  const cornerSize = { w: 20, h: 19 };
  const rectSize = 132;
  const radius = 12;
  const bw = 1.2;

  return (
    <>
      {/* Top-left */}
      <div className="absolute top-0 left-0 overflow-hidden" style={{ width: cornerSize.w, height: cornerSize.h }}>
        <div className="absolute" style={{ width: rectSize, height: rectSize, borderRadius: radius, border: `${bw}px solid rgba(255,255,255,0.85)`, bottom: -(rectSize - cornerSize.h), right: -(rectSize - cornerSize.w) }} />
      </div>
      {/* Top-right */}
      <div className="absolute top-0 right-0 overflow-hidden" style={{ width: cornerSize.w, height: cornerSize.h }}>
        <div className="absolute" style={{ width: rectSize, height: rectSize, borderRadius: radius, border: `${bw}px solid rgba(255,255,255,0.85)`, bottom: -(rectSize - cornerSize.h), left: -(rectSize - cornerSize.w) }} />
      </div>
      {/* Bottom-right */}
      <div className="absolute bottom-0 right-0 overflow-hidden" style={{ width: cornerSize.w, height: cornerSize.h }}>
        <div className="absolute" style={{ width: rectSize, height: rectSize, borderRadius: radius, border: `${bw}px solid rgba(255,255,255,0.85)`, top: -(rectSize - cornerSize.h), left: -(rectSize - cornerSize.w) }} />
      </div>
      {/* Bottom-left */}
      <div className="absolute bottom-0 left-0 overflow-hidden" style={{ width: cornerSize.w, height: cornerSize.h }}>
        <div className="absolute" style={{ width: rectSize, height: rectSize, borderRadius: radius, border: `${bw}px solid rgba(255,255,255,0.85)`, top: -(rectSize - cornerSize.h), right: -(rectSize - cornerSize.w) }} />
      </div>
    </>
  );
}

const MOBILE_VF_W = 159;
const MOBILE_VF_H = 154;
const MOBILE_VF_BASE_X = 87;
const MOBILE_VF_BASE_Y = 38;
const MOBILE_CONTAINER_W = 336;
const MOBILE_CONTAINER_H = 229;

function MobileCameraPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [flash, setFlash] = useState(false);
  const [scanBarActive, setScanBarActive] = useState(false);

  const vfX = useMotionValue(0);
  const vfY = useMotionValue(0);
  const imgX = useTransform(vfX, (v) => -(MOBILE_VF_BASE_X + v));
  const imgY = useTransform(vfY, (v) => -(MOBILE_VF_BASE_Y + v));

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;

    const cleanupRef = { current: () => {} };
    const runCycle = () => {
      if (cancelled) return;
      setScanBarActive(true);
      setFlash(false);

      const ctrlX = fmAnimate(vfX, [0, 40, -25, 18, 5], {
        duration: 3.2,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
      });
      const ctrlY = fmAnimate(vfY, [0, 14, -6, 10, 14], {
        duration: 3.2,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
      });

      const snapTimer = setTimeout(() => {
        if (cancelled) return;
        setFlash(true);
        setScanBarActive(false);
        setTimeout(() => {
          if (cancelled) return;
          setFlash(false);
          setTimeout(() => {
            if (cancelled) return;
            vfX.set(0);
            vfY.set(0);
            runCycle();
          }, 1200);
        }, 200);
      }, 3200);

      cleanupRef.current = () => {
        ctrlX.stop();
        ctrlY.stop();
        clearTimeout(snapTimer);
      };
    };

    runCycle();

    return () => {
      cancelled = true;
      cleanupRef.current();
    };
  }, [inView, vfX, vfY]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="relative rounded-[13px] overflow-hidden w-full"
      style={{ height: MOBILE_CONTAINER_H }}
    >
      <Image
        src="/placeholders/camera-plant.webp"
        alt="AI camera viewfinder"
        fill
        className="object-cover opacity-50 blur-[2px]"
        sizes="336px"
      />

      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: MOBILE_VF_W,
          height: MOBILE_VF_H,
          left: MOBILE_VF_BASE_X,
          top: MOBILE_VF_BASE_Y,
          x: vfX,
          y: vfY,
        }}
      >
        <div className="absolute inset-0 rounded-[10px] overflow-hidden">
          <motion.div
            className="absolute"
            style={{
              width: MOBILE_CONTAINER_W,
              height: MOBILE_CONTAINER_H,
              x: imgX,
              y: imgY,
            }}
          >
            <Image
              src="/placeholders/camera-plant.webp"
              alt=""
              fill
              className="object-cover"
              sizes="336px"
              aria-hidden
            />
          </motion.div>
        </div>

        <MobileViewfinderCorners />

        {scanBarActive && (
          <motion.div
            className="absolute left-0 w-full h-[2px] pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
              boxShadow: "0 0 12px 3px rgba(255,255,255,0.15)",
            }}
            initial={{ top: 0 }}
            animate={{ top: [0, MOBILE_VF_H, 0] }}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Scanning gradient below viewfinder */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-gradient-to-b from-[rgba(244,255,86,0.23)] to-transparent border-t border-[#919374]"
        style={{ bottom: 0, width: 193, height: 102 }}
      />

      <motion.div
        className="absolute inset-0 bg-white pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: flash ? 0.8 : 0 }}
        transition={{ duration: flash ? 0.04 : 0.25 }}
      />
    </motion.div>
  );
}

function MobileViewfinderCorners() {
  const cornerSize = { w: 18, h: 17 };
  const rectSize = 118;
  const radius = 10;
  const bw = 1.1;

  return (
    <>
      <div className="absolute top-0 left-0 overflow-hidden" style={{ width: cornerSize.w, height: cornerSize.h }}>
        <div className="absolute" style={{ width: rectSize, height: rectSize, borderRadius: radius, border: `${bw}px solid rgba(255,255,255,0.85)`, bottom: -(rectSize - cornerSize.h), right: -(rectSize - cornerSize.w) }} />
      </div>
      <div className="absolute top-0 right-0 overflow-hidden" style={{ width: cornerSize.w, height: cornerSize.h }}>
        <div className="absolute" style={{ width: rectSize, height: rectSize, borderRadius: radius, border: `${bw}px solid rgba(255,255,255,0.85)`, bottom: -(rectSize - cornerSize.h), left: -(rectSize - cornerSize.w) }} />
      </div>
      <div className="absolute bottom-0 right-0 overflow-hidden" style={{ width: cornerSize.w, height: cornerSize.h }}>
        <div className="absolute" style={{ width: rectSize, height: rectSize, borderRadius: radius, border: `${bw}px solid rgba(255,255,255,0.85)`, top: -(rectSize - cornerSize.h), left: -(rectSize - cornerSize.w) }} />
      </div>
      <div className="absolute bottom-0 left-0 overflow-hidden" style={{ width: cornerSize.w, height: cornerSize.h }}>
        <div className="absolute" style={{ width: rectSize, height: rectSize, borderRadius: radius, border: `${bw}px solid rgba(255,255,255,0.85)`, top: -(rectSize - cornerSize.h), right: -(rectSize - cornerSize.w) }} />
      </div>
    </>
  );
}

function CameraPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [flash, setFlash] = useState(false);
  const [scanBarActive, setScanBarActive] = useState(false);

  const vfX = useMotionValue(0);
  const vfY = useMotionValue(0);
  const imgX = useTransform(vfX, (v) => -(VF_BASE_X + v));
  const imgY = useTransform(vfY, (v) => -(VF_BASE_Y + v));

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;

    const runCycle = () => {
      if (cancelled) return;
      setScanBarActive(true);
      setFlash(false);

      const ctrlX = fmAnimate(vfX, [0, 55, -35, 25, 8], {
        duration: 3.2,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
      });
      const ctrlY = fmAnimate(vfY, [0, 18, -8, 12, 18], {
        duration: 3.2,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
      });

      const snapTimer = setTimeout(() => {
        if (cancelled) return;
        setFlash(true);
        setScanBarActive(false);
        setTimeout(() => {
          if (cancelled) return;
          setFlash(false);
          setTimeout(() => {
            if (cancelled) return;
            vfX.set(0);
            vfY.set(0);
            runCycle();
          }, 1200);
        }, 200);
      }, 3200);

      cleanupRef.current = () => {
        ctrlX.stop();
        ctrlY.stop();
        clearTimeout(snapTimer);
      };
    };

    const cleanupRef = { current: () => {} };
    runCycle();

    return () => {
      cancelled = true;
      cleanupRef.current();
    };
  }, [inView, vfX, vfY]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="relative rounded-[15px] overflow-hidden"
      style={{ width: CONTAINER_W, height: CONTAINER_H }}
    >
      {/* Background photo — dimmed & blurred */}
      <Image
        src="/placeholders/camera-plant.webp"
        alt="AI camera viewfinder"
        fill
        className="object-cover opacity-50 blur-[2px]"
        sizes="377px"
      />

      {/* Moving viewfinder group */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: VF_W,
          height: VF_H,
          left: VF_BASE_X,
          top: VF_BASE_Y,
          x: vfX,
          y: vfY,
        }}
      >
        {/* Clear photo inside viewfinder */}
        <div className="absolute inset-0 rounded-[12px] overflow-hidden">
          <motion.div
            className="absolute"
            style={{
              width: CONTAINER_W,
              height: CONTAINER_H,
              x: imgX,
              y: imgY,
            }}
          >
            <Image
              src="/placeholders/camera-plant.webp"
              alt=""
              fill
              className="object-cover"
              sizes="377px"
              aria-hidden
            />
          </motion.div>
        </div>

        {/* Corner brackets */}
        <ViewfinderCorners />

        {/* Scanning bar */}
        {scanBarActive && (
          <motion.div
            className="absolute left-0 w-full h-[2px] pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
              boxShadow: "0 0 12px 3px rgba(255,255,255,0.15)",
            }}
            initial={{ top: 0 }}
            animate={{ top: [0, VF_H, 0] }}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Flash on snap */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: flash ? 0.8 : 0 }}
        transition={{ duration: flash ? 0.04 : 0.25 }}
      />
    </motion.div>
  );
}

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
        <div className="hidden lg:block relative">
          <div className="grid grid-cols-2 gap-x-16 gap-y-10">
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

            {/* Row 1 right: Chatbot widget */}
            <div className="flex justify-end">
              <ChatbotWidget />
            </div>

            {/* Row 2 left: Phone mockup with rewards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              className="relative w-full h-[420px]"
            >
              <div className="relative w-[421px] h-[340px] rounded-[24px] overflow-hidden bg-[#050505]">
                <div
                  className="absolute"
                  style={{
                    left: "65%",
                    top: "10px",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div style={{ transform: "rotate(11.52deg)", transformOrigin: "top center" }}>
                    <Image
                      src="/placeholders/xforge-widget.webp"
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
            </motion.div>

            {/* Row 2 right: Feature 2 + 24/7 stat */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex flex-col gap-8 max-w-[400px] pt-8"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-[28px] font-medium leading-[1.1] text-white">
                  A quiet{" "}
                  <span className="font-serif italic text-[#ffbc0e]">Revolution</span>
                  {" "}in your pocket
                </h3>
                <p className="text-[16px] font-normal leading-[1.3] text-[#999]">
                  {`When you use XForge, you are doing more than connecting with friends. You're helping to build a stronger, more resilient internet. It's a profound shift in how everyday technology works.`}
                </p>
              </div>

              {/* 24/7 stat — green glow */}
              <div className="flex items-center gap-2">
                <p
                  className="text-[24px] font-medium leading-[1.1] text-[#81f900]"
                  style={{ textShadow: "0px 1px 20.2px #81f900" }}
                >
                  24/7
                </p>
                <p className="text-[16px] font-normal leading-[1.5] text-[#999]">
                  Auto Earning
                </p>
              </div>
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
                <span className="font-serif italic text-[#ffbc0e]">Capture</span>
                {" "}the magic
              </h3>
              <p className="text-[16px] font-normal leading-[1.3] text-[#999]">
                {`Life moves fast. Your camera should keep up. We designed the AI camera system on XForge to instantly understand what you're shooting and make it look spectacular.`}
              </p>
            </motion.div>

            {/* Row 3 right: Camera photo */}
            <div className="flex justify-start items-end">
              <CameraPhoto />
            </div>
          </div>

          {/* ── Scattered floating badges (absolute, matching Figma) ── */}

          {/* 🤖 AI — below Feature 1 text */}
          <FloatingBadge className="absolute z-10" delay={0.3} style={{ top: "20%", left: "22%" }}>
            🤖 AI
          </FloatingBadge>

          {/* 📸 — above Feature 2 heading */}
          <FloatingBadge className="absolute z-10 opacity-50 !w-[32px]" delay={0.5} style={{ top: "28%", left: "58%" }}>
            📸
          </FloatingBadge>

          {/* 🤖 — left side, between phone & Feature 3, semi-transparent */}
          <FloatingBadge className="absolute z-10 opacity-70 !w-[32px]" delay={0.7} style={{ top: "69%", left: "25%" }}>
            🤖
          </FloatingBadge>

          {/* 📸 CAM — far right, between Feature 2 & 3 */}
          <FloatingBadge className="absolute z-10" delay={0.6} style={{ top: "67%", left: "90%" }}>
            📸 CAM
          </FloatingBadge>

          {/* REC 🟢 — center, above "Capture the magic" */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="badge-glitch absolute z-10 bg-[rgba(212,26,26,0.2)] border border-[#d41a1a]/50 rounded-[6px] px-[7px] py-[2px] flex items-center gap-1"
            style={{ top: "78%", left: "44%", animationDelay: "5s" }}
          >
            <span className="font-mono text-[8px] text-[#d41a1a] font-medium">REC</span>
            <span className="inline-flex rounded-full h-[6px] w-[6px] bg-[#d41a1a]" />
          </motion.div>
        </div>

        {/* ── Mobile layout ────────────────────────────────── */}
        <div className="relative lg:hidden">
          <div className="flex flex-col items-center gap-14">
            {/* Feature 1: Intelligence */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex flex-col gap-2 text-center w-full"
            >
              <h3 className="text-[24px] font-medium leading-[1.1] text-white">
                <span className="font-serif italic text-[#ffbc0e]">Intelligence</span>
                {" "}with a purpose
              </h3>
              <p className="text-[14px] font-normal leading-[1.3] text-[#999]">
                {`We built an exclusive hub that pairs a brilliant AI assistant with your daily rewards. It's a powerful tool that makes your life easier while you help power a better internet.`}
              </p>
            </motion.div>

            {/* Chatbot widget */}
            <ChatbotWidget />

            {/* Feature 2: Revolution + 24/7 stat */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex flex-col gap-6 items-center text-center w-full"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-[24px] font-medium leading-[1.1] text-white">
                  A quiet{" "}
                  <span className="font-serif italic text-[#ffbc0e]">Revolution</span>
                  {" "}in your pocket
                </h3>
                <p className="text-[14px] font-normal leading-[1.3] text-[#999]">
                  {`When you use XForge, you are doing more than connecting with friends. You're helping to build a stronger, more resilient internet. It's a profound shift in how everyday technology works.`}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <p
                  className="text-[24px] font-medium leading-[1.1] text-[#81f900]"
                  style={{ textShadow: "0px 1px 20.2px #81f900" }}
                >
                  24/7
                </p>
                <p className="text-[16px] font-normal leading-[1.5] text-[#999]">
                  Auto Earning
                </p>
              </div>
            </motion.div>

            {/* Phone mockup + rewards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={scaleIn}
              className="relative w-full max-w-[336px]"
            >
              <div className="relative w-full h-[256px] rounded-[19px] overflow-hidden bg-[#050505]">
                <div
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "1px",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div style={{ transform: "rotate(11.52deg)", transformOrigin: "top center" }}>
                    <Image
                      src="/placeholders/xforge-widget.webp"
                      alt="XForge phone showing network rewards"
                      width={468}
                      height={732}
                      className="max-w-none"
                      style={{ width: 400, height: "auto" }}
                    />
                  </div>
                </div>
                <MobileRewardCards rewardCount={rewardCount} />
              </div>
            </motion.div>

            {/* Feature 3: Capture */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex flex-col gap-2 text-center w-full"
            >
              <h3 className="text-[24px] font-medium leading-[1.1] text-white">
                <span className="font-serif italic text-[#ffbc0e]">Capture</span>
                {" "}the magic
              </h3>
              <p className="text-[14px] font-normal leading-[1.3] text-[#999]">
                {`Life moves fast. Your camera should keep up. We designed the AI camera system on XForge to instantly understand what you're shooting and make it look spectacular.`}
              </p>
            </motion.div>

            {/* Camera photo with viewfinder — mobile */}
            <div className="w-full max-w-[336px]">
              <MobileCameraPhoto />
            </div>
          </div>

          {/* ── Mobile floating badges ── */}
          <FloatingBadge
            className="absolute z-10 !w-[80px]"
            delay={0.3}
            style={{ top: 331, left: -17 }}
          >
            🤖 AI
          </FloatingBadge>

          <FloatingBadge
            className="absolute z-10 opacity-50 !w-[32px]"
            delay={0.5}
            style={{ top: 470, left: "50%", transform: "translateX(-50%)" }}
          >
            📸
          </FloatingBadge>

          <FloatingBadge
            className="absolute z-10 opacity-70 !w-[32px]"
            delay={0.7}
            style={{ top: "69%", left: "72%", transform: "translateX(-50%)" }}
          >
            🤖
          </FloatingBadge>

          <FloatingBadge
            className="absolute z-10 !w-[80px]"
            delay={0.6}
            style={{ bottom: 40, right: 0 }}
          >
            📸 CAM
          </FloatingBadge>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="badge-glitch absolute z-10 bg-[rgba(212,26,26,0.2)] border border-[#d41a1a]/50 rounded-[6px] px-[7px] py-[2px] flex items-center gap-1"
            style={{ bottom: "18%", left: 7, animationDelay: "5s" }}
          >
            <span className="font-mono text-[8px] text-[#d41a1a] font-medium">REC</span>
            <span className="inline-flex rounded-full h-[6px] w-[6px] bg-[#d41a1a]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
