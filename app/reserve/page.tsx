// Reserve page: $3 deposit form + FAQ + product image + guarantee cards.
// Dependencies: lib/animations (S), lib/analytics, lib/utils
// Connected to: /api/checkout (Stripe redirect), Kickstarter (notify button)
// FAQ renders in different positions: inside left column on desktop, bottom on mobile.
// UPDATE pricing: search for "$3", "$299", "$499".
// UPDATE Stripe URL: set STRIPE_CHECKOUT_URL env var (not hardcoded).

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { S } from "@/lib/animations";
import { trackReserveClick, trackKickstarterClick } from "@/lib/analytics";
import { KICKSTARTER_URL } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "What is the reservation deposit?",
    answer:
      "By leaving a small deposit (typically 1-5% of the product's price), you reserve the right to buy this product at a discount if it launches. This is a binding agreement between you and the product creator until successful delivery and protected at all times by the Refund Guarantee.",
  },
  {
    question: "When can I get my product?",
    answer:
      "Product creators offer you the lowest ever exclusive price when you reserve. This is not yet a full purchase, and it's up to you to cancel or proceed with the purchase later. Product launch and delivery timelines are somewhat unpredictable. Where possible, creators offer estimates.",
  },
];

export default function ReservePage() {
  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-[60px] py-8 sm:py-12 lg:py-[60px] pb-16 sm:pb-20 lg:pb-[80px]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Left column: Product image + Guarantees (+ FAQ on desktop) */}
          <div className="flex-1 flex flex-col gap-5 min-w-0">
            <ProductImage />
            <GuaranteeCards />

            {/* FAQ — desktop only (aligned with left column) */}
            <div className="hidden lg:block mt-10">
              <h2 className="text-[20px] sm:text-[24px] font-semibold leading-[1.1] text-[#050505] mb-5">
                Frequently Asked Questions
              </h2>
              <div className="flex flex-col gap-3">
                {FAQ_ITEMS.map((item, i) => (
                  <FAQItem
                    key={i}
                    question={item.question}
                    answer={item.answer}
                    defaultOpen={i === 0}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Reserve form */}
          <div className="w-full lg:w-[426px] shrink-0">
            <ReserveForm />
          </div>
        </div>

        {/* FAQ — mobile only (below everything) */}
        <div className="lg:hidden mt-10 sm:mt-12">
          <h2 className="text-[20px] sm:text-[24px] font-semibold leading-[1.1] text-[#050505] mb-5 text-center">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-3">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem
                key={i}
                question={item.question}
                answer={item.answer}
                defaultOpen={i === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function ProductImage() {
  return (
    <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[550px] rounded-[12px] overflow-hidden bg-[#050505]">
      <Image
        src="/placeholders/reserve-photo.webp"
        alt="XForge Phone"
        fill
        className="object-cover object-top"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
      <div className="absolute bottom-5 sm:bottom-8 left-5 sm:left-8 z-10 flex flex-col gap-3 sm:gap-4">
        <Image
          src="/placeholders/footer-logo.svg"
          alt="XForge × Kickstarter"
          width={200}
          height={15}
          className="h-[14px] sm:h-[18px] w-auto"
        />
        <p className="text-[24px] sm:text-[32px] lg:text-[38px] font-semibold leading-[1.1]">
          <span className="text-white">AI Smartphone that </span>
          <br />
          <span className="text-[#ffbc0e] font-serif italic">
            Pays It Forward
          </span>
        </p>
      </div>
    </div>
  );
}

function GuaranteeCards() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
      <div className="flex-1 flex gap-3 items-start bg-white border border-xforge-border rounded-[12px] px-3 sm:px-4 py-4 sm:py-6 shadow-[0px_0px_0px_1px_#fafafa,0px_1px_2px_0px_rgba(0,0,0,0.3)]">
        <Image
          src="/placeholders/icon-refundable.svg"
          alt=""
          width={24}
          height={24}
          className="shrink-0"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-2 leading-[1.1] min-w-0">
          <p className="text-[14px] sm:text-[18px] font-medium text-[#050505]">
            100% Refundable Deposit
          </p>
          <p className="text-[12px] sm:text-[14px] font-normal leading-[1.3] text-[#707070]">
            Cancel anytime before launch and get your full deposit back. No
            questions asked.
          </p>
        </div>
      </div>

      <div className="flex-1 flex gap-3 items-start bg-white border border-xforge-border rounded-[12px] px-3 sm:px-4 py-4 sm:py-6 shadow-[0px_0px_0px_1px_#fafafa,0px_1px_2px_0px_rgba(0,0,0,0.3)]">
        <Image
          src="/placeholders/icon-pricelock.svg"
          alt=""
          width={24}
          height={24}
          className="shrink-0"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-2 leading-[1.1] min-w-0">
          <p className="text-[14px] sm:text-[18px] font-medium text-[#050505]">
            Price Lock Guarantee
          </p>
          <p className="text-[12px] sm:text-[14px] font-normal leading-[1.3] text-[#707070]">
            {`You're locking in the lowest price XForge will ever be.`}
          </p>
        </div>
      </div>
    </div>
  );
}

function ReserveForm() {
  const [reserving, setReserving] = useState(false);

  return (
    <div className="flex flex-col gap-[16px] items-center lg:sticky lg:top-[60px]">
      <div className="w-full bg-white border border-xforge-border rounded-[16px] px-[16px] py-[20px] shadow-[0px_0px_0px_1px_#fafafa,0px_1px_2px_0px_rgba(0,0,0,0.3)] flex flex-col gap-[24px] overflow-hidden">
        {/* Logo */}
        <Image
          src="/placeholders/nav-logos.svg"
          alt="XForge × Kickstarter"
          width={213}
          height={16}
          className="h-[16px] w-auto"
        />

        {/* Discount info */}
        <div className="flex flex-col gap-[8px]">
          <h1 className="text-[20px] sm:text-[24px] font-semibold leading-[1.1] text-[#050505] max-w-[364px]">
            Reserve your 40% Special Discount
          </h1>
          <p className="text-[14px] sm:text-[16px] font-normal leading-[1.3] text-[#707070]">
            Leave a small refundable deposit and reserve the lowest price ever.
          </p>
        </div>

        {/* Launch info */}
        <div className="flex items-center gap-[8px]">
          <Image
            src="/placeholders/icon-launch.svg"
            alt=""
            width={16}
            height={16}
            className="shrink-0"
            aria-hidden="true"
          />
          <p className="text-[14px] sm:text-[16px] font-normal leading-[1.3] text-[#050505]">
            Launching soon on Kickstarter
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center gap-[8px] sm:gap-[12px] flex-wrap">
          <span className="text-[32px] sm:text-[40px] font-bold italic leading-[1.1] text-[#050505]">
            $299
          </span>
          <span className="text-[20px] sm:text-[24px] font-medium italic leading-[1.1] text-[#707070] line-through">
            $499
          </span>
          <span className="bg-gradient-to-b from-[#1d6100] to-[#05ce78] border border-[#05ce78] text-white text-[12px] font-bold italic leading-[1.1] px-[8px] py-[4px] rounded-[94px]">
            Save $200
          </span>
        </div>

        {/* Reserve button + Notify + checkout info */}
        <div className="flex flex-col gap-[12px]">
          <motion.a
            href="/api/checkout"
            onClick={() => { setReserving(true); trackReserveClick(); }}
            whileHover={reserving ? undefined : "wiggle"}
            whileTap={reserving ? undefined : { scale: 0.97, boxShadow: "0px 0px 20px 4px rgba(255,188,14,0.5), 0px 0px 0px 1px #fbc946, 0px 1px 2px 0px rgba(0,0,0,0.3)" }}
            className={`${S.btnGold} flex items-center justify-center gap-2 h-[44px] w-full rounded-[12px] text-[14px] sm:text-[16px] font-medium transition-opacity ${reserving ? "opacity-70 pointer-events-none" : "hover:scale-[1.04]"}`}
            aria-disabled={reserving}
          >
            {reserving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-[#050505]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Redirecting…</span>
              </>
            ) : (
              <motion.span
                variants={{ wiggle: { rotate: [0, -3, 3, -2, 1.5, 0] } }}
                transition={{ duration: 0.5 }}
                style={{ display: "inline-block", transformOrigin: "center bottom" }}
              >
                Reserve Discount for $3
              </motion.span>
            )}
          </motion.a>

          <motion.a
            href={KICKSTARTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackKickstarterClick("reserve_page")}
            whileHover="wiggle"
            whileTap={{ scale: 0.97, boxShadow: "0px 0px 14px 3px rgba(200,200,200,0.4), 0px 0px 0px 1px #f5f5f5, 0px 1px 2px 0px rgba(0,0,0,0.3)" }}
            className={`${S.btnNotify} flex items-center justify-center gap-[8px] h-[44px] w-full rounded-[12px] text-[14px] sm:text-[16px] font-medium hover:scale-[1.04]`}
          >
            <motion.span
              variants={{ wiggle: { rotate: [0, -3, 3, -2, 1.5, 0] } }}
              transition={{ duration: 0.5 }}
              style={{ display: "inline-block", transformOrigin: "center bottom" }}
            >
              Notify me
            </motion.span>
            <motion.div
              variants={{ wiggle: { rotate: [0, -14, 12, -10, 8, -4, 0] } }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/placeholders/icon-notification.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
              />
            </motion.div>
          </motion.a>

          {/* Secure checkout */}
          <div className="flex items-center justify-center gap-[6px] sm:gap-[8px] flex-wrap">
            <div className="flex items-center gap-[6px] sm:gap-[8px]">
              <Image
                src="/placeholders/icon-shield.svg"
                alt=""
                width={20}
                height={20}
                className="shrink-0 w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]"
                aria-hidden="true"
              />
              <span className="text-[12px] sm:text-[14px] font-normal leading-[1.3] text-[#050505]">
                Secure checkout powered by
              </span>
            </div>
            <Image
              src="/placeholders/stripe-logo.svg"
              alt="Stripe"
              width={50}
              height={24}
              className="h-[20px] sm:h-[24px] w-auto"
            />
          </div>
        </div>
      </div>

      {/* Terms */}
      <p className="text-[14px] font-normal leading-[1.3] text-[#050505] text-center">
        By reserving, you accept the{" "}
        <Link
          href="https://kickstarter.xforgephone.com/terms-and-conditions"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Terms & Conditions
        </Link>
      </p>

    </div>
  );
}

function FAQItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-xforge-border rounded-[12px] shadow-[0px_0px_0px_1px_#fafafa,0px_1px_2px_0px_rgba(0,0,0,0.3)]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 sm:p-6 text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="text-[14px] sm:text-[18px] font-medium leading-[1.4] text-[#050505] pr-4 min-w-0">
          {question}
        </span>
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="shrink-0"
          aria-hidden="true"
        >
          <path
            d="M6 15L12 9L18 15"
            stroke="#050505"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 -mt-1">
              <p className="text-[12px] sm:text-[14px] font-normal leading-[1.4] text-[#707070]">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
