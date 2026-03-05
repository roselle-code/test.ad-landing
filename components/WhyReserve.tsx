// Pricing comparison section. Shows $499 → $299 value prop with Kickstarter early-bird.
// UPDATE pricing: search for "$299" and "$499" in this file.
// Stripe/payment text includes "100% Refundable" guarantee.

"use client";

import Image from "next/image";
import { motion } from "framer-motion";


export default function WhyReserve() {
  return (
    <section id="reserve" className="w-full bg-white py-8 sm:py-10 lg:py-[60px]">
      <div className="max-w-[874px] mx-auto px-4 sm:px-6 flex flex-col items-center gap-8 lg:gap-[48px]">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.12, 1, 0.2, 1] }}
          className="text-[20px] sm:text-[28px] md:text-[36px] lg:text-[40px] font-semibold leading-[1.1] text-black text-center"
        >
          <span>Why reserve with </span>
          <span className="font-serif italic font-bold underline">$3</span>
        </motion.h2>

        {/* Content Container */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.12, 1, 0.2, 1], delay: 0.3 }}
          className="flex flex-col items-center gap-4 w-full"
        >
          {/* Subtitle */}
          <p className="text-[14px] sm:text-lg lg:text-[20px] font-normal leading-[1.3] text-black text-center max-w-[671px]">
            <span className="font-bold">Save $200 </span>
            <span>when you reserve XForge today!</span>
          </p>

          {/* Price Comparison */}
          <div className="relative bg-[#ebebeb] border border-xforge-border rounded-[16px] sm:rounded-[24px] lg:rounded-[32px] px-7 sm:px-8 lg:px-[37px] py-3.5 sm:py-4 lg:py-[19px] flex items-center gap-4 sm:gap-5 lg:gap-5">
            {/* MSRP */}
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <span className="text-[#4b4b4b] text-[14px] sm:text-base lg:text-[18px] font-medium leading-[1.1] tracking-[0.28px] sm:tracking-[0.36px]">
                MSRP
              </span>
              <span className="text-[40px] sm:text-[44px] md:text-[52px] lg:text-[60px] font-bold leading-[1.1] text-[rgba(77,77,77,0.4)] lg:text-[#9e9c9c] line-through">
                $499
              </span>
            </div>

            {/* Arrow */}
            <span className="text-[40px] sm:text-[44px] md:text-[52px] lg:text-[60px] font-bold leading-[1.1] text-black">
              →
            </span>

            {/* Your Price */}
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <span className="text-[#4e4e4e] text-[14px] sm:text-base lg:text-[18px] font-medium leading-[1.1] tracking-[0.28px] sm:tracking-[0.36px]">
                YOUR PRICE
              </span>
              <span className="text-[40px] sm:text-[44px] md:text-[52px] lg:text-[60px] font-bold leading-[1.1] text-black">
                $299
              </span>
            </div>

            {/* Inset shadow overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_8px_0px_rgba(0,0,0,0.25)]" />
          </div>

          {/* Description */}
          <p className="text-[14px] sm:text-base lg:text-[18px] font-normal leading-[1.3] text-black text-center max-w-[874px]">
            <span>To receive this exclusive offer, simply place </span>
            <span className="font-bold">$3 deposit</span>
            <span>
              {" "}and you will be locked in for our 40% discount
            </span>
          </p>
        </motion.div>

        {/* Payment info */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.12, 1, 0.2, 1], delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[12px] sm:text-sm lg:text-base font-normal leading-[1.3] text-black text-center"
        >
          <Image
            src="/placeholders/shield-icon.svg"
            alt=""
            width={20}
            height={20}
            className="w-4 sm:w-5 h-4 sm:h-5"
            aria-hidden="true"
          />
          <span>100% Refundable  •  Secure payment powered by</span>
          <Image
            src="/placeholders/stripe-logo.svg"
            alt="Stripe"
            width={48}
            height={20}
            className="w-[39px] sm:w-10 lg:w-12 h-4 sm:h-5"
          />
        </motion.div>
      </div>
    </section>
  );
}
