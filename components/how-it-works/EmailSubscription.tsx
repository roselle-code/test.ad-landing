// Email subscription form used inside HowItWorks (desktop + mobile).
// Shares same styling (S.btnGold, S.emailWrap) and logic pattern as Hero and Footer forms.
// Submits to /api/subscribe with source "how_it_works", redirects to /reserve on success.

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { S } from "@/lib/animations";
import { trackEmailSubmit } from "@/lib/analytics";
import { isValidEmail } from "@/lib/utils";

export default function EmailSubscription() {
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
        body: JSON.stringify({ email, source: "how_it_works" }),
      });
      trackEmailSubmit("how_it_works");
    } catch {}
    setEmail("");
    setTouched(false);
    setSubmitting(false);
    router.push("/reserve");
  }

  return (
    <div className="w-full max-w-[360px] sm:max-w-[465px]">
      <div
        className={`${S.emailWrap} flex items-center justify-between pl-4 pr-2 py-2 ${
          showError ? "border-red-500" : "border-xforge-border"
        }`}
      >
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
          className={`${S.emailField} text-base font-normal`}
        />
        <motion.button
          type="button"
          onClick={handleNotify}
          whileHover="wiggle"
          whileTap="wiggle"
          className={`${S.btnGold} flex-shrink-0 flex items-center gap-2 rounded-[12px] px-4 h-[44px] text-base font-medium hover:scale-[1.04]`}
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
      <p className="text-[14px] sm:text-sm font-normal leading-[1.1] text-[#4d4d4d] text-center mt-3 sm:mt-4">
        Reserve now and save about <span className="font-bold">$200</span>
      </p>
    </div>
  );
}
