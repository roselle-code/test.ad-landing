// Footer with email CTA, legal links, and pattern background.
// Dependencies: hooks/useEmailSubscribe, lib/animations (S.btnGold, S.emailWrap), lib/utils
// Connected to: /api/subscribe (email form), /reserve (redirect after submit)
// Contains hardcoded links to /terms-and-conditions and /privacy-policy.

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { S } from "@/lib/animations";
import { useEmailSubscribe } from "@/hooks/useEmailSubscribe";

export default function Footer() {
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
  } = useEmailSubscribe("footer");

  return (
    <footer className="relative w-full bg-xforge-black overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 pointer-events-none footer-pattern"
        aria-hidden="true"
      />
      {/* Top gradient fade overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #050505 0%, rgba(5,5,5,0) 20%, rgba(5,5,5,0) 90%, #050505 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[874px] mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-[52px] pb-10 sm:pb-12 lg:pb-[52px] flex flex-col items-center gap-14 lg:gap-[80px]">
        {/* Top section */}
        <div className="flex flex-col items-center gap-10 lg:gap-[84px] w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.12, 1, 0.2, 1] }}
          >
            <Image
              src="/placeholders/footer-logo.svg"
              alt="XForge × Kickstarter"
              width={424}
              height={32}
              className="max-w-[280px] sm:max-w-[313px] lg:max-w-full h-auto"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.12, 1, 0.2, 1], delay: 0.3 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            <h2 className="text-[32px] lg:text-[44px] font-semibold leading-[1.1] text-white text-center">
              Reserve your spot
            </h2>

            {/* Email input with Get 40% Discount button */}
            {/* Mobile: stacked vertically */}
            <div className={`relative bg-xforge-input-bg border rounded-[20px] lg:rounded-[12px] flex flex-col lg:flex-row lg:items-center p-1 lg:pl-4 lg:pr-1 lg:py-1 gap-1 lg:gap-0 lg:h-[44px] w-full max-w-[452px] transition-colors duration-200 ${showError ? "border-red-500 border-2" : "border-xforge-border"}`}>
              <div className="flex items-center justify-center h-[48px] lg:h-auto lg:flex-1 lg:min-w-0">
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
                  className="bg-transparent text-base font-normal text-xforge-placeholder leading-[1.1] outline-none w-full text-center lg:text-left"
                />
              </div>
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                whileHover={submitting ? undefined : "wiggle"}
                whileTap={submitting ? undefined : { scale: 0.97, boxShadow: "0px 0px 20px 4px rgba(255,188,14,0.5), 0px 0px 0px 1px #fbc946, 0px 1px 2px 0px rgba(0,0,0,0.3)" }}
                className={`${S.btnGold} flex items-center justify-center gap-2 px-4 h-[48px] lg:h-[32px] rounded-[16px] lg:rounded-[12px] text-base font-medium shrink-0 w-full lg:w-auto transition-opacity ${submitting ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.04]"}`}
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
                      variants={{ wiggle: { rotate: [0, -3, 3, -2, 1.5, 0] } }}
                      transition={{ duration: 0.5 }}
                      style={{ display: "inline-block", transformOrigin: "center bottom" }}
                    >
                      Get 40% Discount
                    </motion.span>
                    <motion.div
                      variants={{ wiggle: { rotate: [0, -14, 12, -10, 8, -4, 0] } }}
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

            {/* Error feedback */}
            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}

            {/* Early bird text */}
            <p className="text-[14px] sm:text-sm font-normal leading-[1.1] text-center">
              <span className="font-semibold text-xforge-gold">
                Reserve now{" "}
              </span>
              <span className="text-white">and save </span>
              <span className="font-semibold text-xforge-green-bright">
                $200
              </span>
            </p>
          </motion.div>
        </div>

        {/* Footer links */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.12, 1, 0.2, 1], delay: 0.5 }}
          className="flex flex-col-reverse lg:flex-row items-center justify-between gap-4 lg:gap-0 w-full text-[11px] lg:text-sm leading-[1.1] text-[#999]"
        >
          <p className="font-normal text-center">
            © 2026 XForge. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://kickstarter.xforgephone.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="https://kickstarter.xforgephone.com/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal hover:text-white transition-colors duration-200"
            >
              Refund Policy
            </a>
            <a
              href="mailto:support@xforgephone.com"
              className="font-normal hover:text-white transition-colors duration-200"
            >
              Contact
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
