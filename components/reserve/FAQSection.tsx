"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ_ITEMS = [
  {
    question: "What is the reservation deposit?",
    answer:
      "By leaving a small deposit (typically 1-5% of the product's price), you reserve the right to buy this product at a discount if it launches. This is a binding agreement between you and the product creator until successful delivery and protected at all times by the Refund Guarantee.",
  },
  {
    question: "When can I get my product?",
    answer:
      "Product creators offer you the lowest ever exclusive price when you reserve. This is not yet a full purchase, and it's up to you to cancel or proceed with the purchase later. Product launch and delivery timelines are somewhat unpredictable. Where possible, creators offer estimates. And if you don't receive the product within 2 years, you'll get a full automatic refund.",
  },
  {
    question: "How can I claim a refund?",
    answer: (
      <>
        Claiming a refund is easy. Just email{" "}
        <a href="mailto:support@xforgephone.com" className="underline">
          support@xforgephone.com
        </a>{" "}
        from the email you used to reserve the discount.
      </>
    ),
  },
];

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

export default function FAQSection({ centered = false }: { centered?: boolean }) {
  return (
    <div>
      <h2
        className={`text-[20px] sm:text-[24px] font-semibold leading-[1.1] text-[#050505] mb-5 ${
          centered ? "text-center" : ""
        }`}
      >
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
  );
}
