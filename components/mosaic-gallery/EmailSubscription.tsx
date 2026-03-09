// Email subscription form used inside MosaicGallery.
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
    <div className="w-full max-w-[360px] sm:max-w-[500px]">
      <div
        className={`relative bg-xforge-input-bg border rounded-[20px] md:rounded-[12px] flex flex-col md:flex-row md:items-center p-1 md:pl-4 md:pr-2 md:py-2 gap-1 md:gap-0 w-full transition-colors duration-200 ${
          showError ? "border-red-500 border-2" : "border-xforge-border"
        }`}
      >
        <div className="flex items-center justify-center h-[48px] md:h-auto md:flex-1 md:min-w-0">
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
            className="bg-transparent text-base font-normal text-xforge-placeholder leading-[1.1] outline-none w-full text-center md:text-left"
          />
        </div>
        <motion.button
          type="button"
          onClick={handleNotify}
          disabled={submitting}
          whileHover={submitting ? undefined : "wiggle"}
          whileTap={submitting ? undefined : { scale: 0.97, boxShadow: "0px 0px 20px 4px rgba(255,188,14,0.5), 0px 0px 0px 1px #fbc946, 0px 1px 2px 0px rgba(0,0,0,0.3)" }}
          className={`${S.btnGold} flex items-center justify-center gap-2 px-4 h-[48px] md:h-[44px] rounded-[16px] md:rounded-[12px] text-base font-medium shrink-0 w-full md:w-auto transition-opacity ${submitting ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.04]"}`}
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
      <p className="text-[14px] sm:text-sm font-normal leading-[1.1] text-[#707070] text-center mt-3 sm:mt-4">
        Reserve now and save <span className="font-bold">$200</span>
      </p>
    </div>
  );
}
