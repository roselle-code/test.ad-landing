// Footer with email CTA, legal links, and pattern background.
// Dependencies: lib/animations (S.btnGold, S.emailWrap, fadeInUp), lib/analytics, lib/utils
// Connected to: /api/subscribe (email form), /reserve (redirect after submit)
// Contains hardcoded links to /terms-and-conditions and /privacy-policy.

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInUp, S } from "@/lib/animations";
import { trackEmailSubmit } from "@/lib/analytics";
import { isValidEmail } from "@/lib/utils";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const showError = touched && email.length > 0 && !isValidEmail(email);

  async function handleNotify() {
    setTouched(true);
    if (!isValidEmail(email) || submitting) {
      if (!isValidEmail(email)) inputRef.current?.focus();
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      trackEmailSubmit("footer");
    } catch {}
    setEmail("");
    setTouched(false);
    setSubmitting(false);
    router.push("/reserve");
  }
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

      <div className="relative max-w-[874px] mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-[52px] pb-10 sm:pb-12 lg:pb-[52px] flex flex-col items-center gap-8 lg:gap-[60px]">
        {/* Top section */}
        <div className="flex flex-col items-center gap-10 lg:gap-[84px] w-full">
          {/* Logo */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col items-center gap-4 w-full"
          >
            <h2 className="text-[32px] lg:text-[44px] font-semibold leading-[1.1] text-white text-center">
              Reserve your spot
            </h2>

            {/* Email input with Get 40% Discount button */}
            {/* Mobile: stacked vertically */}
            <div className={`relative bg-xforge-input-bg border rounded-[20px] lg:rounded-[12px] flex flex-col lg:flex-row lg:items-center p-1 lg:pl-4 lg:pr-1 lg:py-1 gap-1 lg:gap-0 lg:h-[44px] w-full max-w-[452px] transition-colors duration-200 ${showError ? "border-red-500" : "border-xforge-border"}`}>
              <div className="flex items-center justify-center h-[48px] lg:h-auto lg:flex-1 lg:min-w-0">
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  onKeyDown={(e) => e.key === "Enter" && handleNotify()}
                  placeholder="name@domain.com"
                  aria-label="Email address"
                  aria-invalid={showError}
                  className="bg-transparent text-base font-normal text-xforge-placeholder leading-[1.1] outline-none w-full text-center lg:text-left"
                />
              </div>
              <motion.button
                type="button"
                onClick={handleNotify}
                whileHover="wiggle"
                whileTap="wiggle"
                className={`${S.btnGold} flex items-center justify-center gap-2 px-4 h-[48px] lg:h-[32px] rounded-[16px] lg:rounded-[12px] text-base font-medium hover:scale-[1.04] shrink-0 w-full lg:w-auto`}
              >
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
              </motion.button>
              <div className={S.insetShadow} />
            </div>

            {/* Early bird text */}
            <p className="text-[14px] sm:text-sm font-normal leading-[1.1] text-center">
              <span className="font-semibold text-xforge-gold">
                Reserve now{" "}
              </span>
              <span className="text-white">and save about </span>
              <span className="font-semibold text-xforge-green-bright">
                $200
              </span>
            </p>
          </motion.div>
        </div>

        {/* Footer links */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col gap-4 lg:gap-6 w-full"
        >
          <div className="flex items-center justify-center gap-5 lg:gap-6 text-base lg:text-xl leading-[1.1] text-white">
            <a
              href="https://kickstarter.xforgephone.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal hover:text-xforge-gold transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="https://kickstarter.xforgephone.com/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-xforge-gold transition-colors duration-200"
            >
              Refund Policy
            </a>
            <a
              href="mailto:support@xforgephone.com"
              className="font-normal hover:text-xforge-gold transition-colors duration-200"
            >
              Contact
            </a>
          </div>
          <p className="text-[11px] lg:text-sm font-normal leading-[1.1] text-xforge-gold text-center">
            © 2026 XForge. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
