// Hero section: full-viewport video background + email capture CTA.
// Dependencies: hooks/useEmailSubscribe, lib/animations (S.btnGold, S.emailWrap), lib/utils
// Connected to: /api/subscribe (email form), /reserve (redirect after submit)
//
// Browser-sensitive: video uses WebM (Safari 16+ required), IntersectionObserver
// for lazy loading, matchMedia for responsive video source switching.
// Uses 100dvh for full viewport — requires iOS 15.4+.

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { S } from "@/lib/animations";
import { useEmailSubscribe } from "@/hooks/useEmailSubscribe";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const {
    email,
    setEmail,
    submitting,
    showError,
    error,
    inputRef,
    handleSubmit,
    handleBlur,
    handleKeyDown,
  } = useEmailSubscribe("hero");

  const pickSource = useCallback(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    return mq.matches
      ? "/placeholders/hero-video-web.webm"
      : "/placeholders/hero-video-mobile.webm";
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!videoSrc) {
            const src = pickSource();
            setVideoSrc(src);
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    io.observe(section);
    return () => io.disconnect();
  }, [videoSrc, pickSource]);

  useEffect(() => {
    if (!videoSrc || !videoRef.current) return;
    videoRef.current.load();
    videoRef.current.play().catch(() => {});
  }, [videoSrc]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => {
      const newSrc = pickSource();
      setVideoSrc((prev) => (prev !== newSrc ? newSrc : prev));
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [pickSource]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full h-[100dvh] bg-black overflow-hidden"
    >
      {/* Background Video — spans full viewport, poster shown until video loads */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster="/placeholders/reserve-product.webp"
        className="absolute inset-0 w-full h-full object-contain"
        aria-hidden="true"
      >
        {videoSrc && <source src={videoSrc} type="video/webm" />}
      </video>

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,1) 100%)",
        }}
      />

      {/* Black bleed to cover subpixel gap at section boundary */}
      <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-black z-20 translate-y-[2px]" />

      {/* Notification Bar — overlaid on top of video */}
      <div className="absolute top-0 left-0 right-0 z-10 w-full bg-[#291d00]/90 backdrop-blur-sm flex items-center justify-center px-4 py-3">
        <p className="text-xforge-gold text-[14px] sm:text-sm lg:text-base font-normal leading-[1.1] text-center">
          Launching soon on Kickstarter • Early-backer perks
        </p>
      </div>

      {/* Content overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-8 lg:px-[60px] pb-4 sm:pb-6 lg:pb-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-8">
          {/* Left: Logos + Title */}
          <div className="flex flex-col gap-3 lg:gap-6 max-w-[647px]">
            {/* XForge × Kickstarter logos */}
            <div className="relative w-[200px] h-[15px] sm:w-[320px] sm:h-[24px] lg:w-[424px] lg:h-[32px]">
              <Image
                src="/placeholders/footer-logo.svg"
                alt="XForge × Kickstarter"
                fill
                priority
                className="object-contain object-left"
              />
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-[28px] sm:text-[44px] lg:text-[60px] font-semibold leading-[1.1]"
            >
              <span className="text-white">AI Smartphone that </span>
              <br className="sm:hidden" />
              <span className="font-serif italic text-xforge-gold">
                Pays It Forward
              </span>
            </motion.h1>
          </div>

          {/* Right: Email input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="w-full max-w-[452px] lg:flex-shrink-0"
          >
            <div className="bg-white rounded-[16px] p-[6px] sm:p-2 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.12)]">
              <div
                className={`${S.emailWrap} flex items-center justify-between pl-3 sm:pl-4 pr-1 py-1 h-[40px] sm:h-[44px] ${
                    showError ? "border-red-500 border-2" : "border-xforge-border"
                }`}
              >
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="name@domain.com"
                  aria-label="Email address"
                  aria-invalid={showError}
                  className={`${S.emailField} text-sm sm:text-base font-normal`}
                />
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  whileHover={submitting ? undefined : "wiggle"}
                  whileTap={submitting ? undefined : { scale: 0.97, boxShadow: "0px 0px 20px 4px rgba(255,188,14,0.5), 0px 0px 0px 1px #fbc946, 0px 1px 2px 0px rgba(0,0,0,0.3)" }}
                  className={`${S.btnGold} flex-shrink-0 flex items-center gap-1.5 sm:gap-2 rounded-[10px] sm:rounded-[12px] px-3 sm:px-4 h-[28px] sm:h-[32px] text-sm sm:text-base font-medium transition-opacity ${submitting ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.04]"}`}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-[#050505]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Submitting…</span>
                    </>
                  ) : (
                    <>
                      <motion.span
                        variants={{
                          wiggle: { rotate: [0, -3, 3, -2, 1.5, 0] },
                        }}
                        transition={{ duration: 0.5 }}
                        style={{
                          display: "inline-block",
                          transformOrigin: "center bottom",
                        }}
                      >
                        Get 40% Discount
                      </motion.span>
                      <motion.div
                        variants={{
                          wiggle: { rotate: [0, -14, 12, -10, 8, -4, 0] },
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src="/placeholders/arrow-icon.svg"
                          alt=""
                          width={20}
                          height={20}
                          aria-hidden="true"
                        />
                      </motion.div>
                    </>
                  )}
                </motion.button>
                <div className={S.insetShadow} />
              </div>
            </div>
            {error && (
              <p className="text-red-400 text-xs mt-1 text-center">{error}</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
