// Shared animation variants and Tailwind class strings used across ALL sections.
// Changing S.btnGold or S.emailWrap affects Hero, MosaicGallery, Footer, and /reserve.
import type { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const S = {
  btnGold:
    "bg-gradient-to-b from-xforge-gold to-xforge-gold-light border border-xforge-gold-border shadow-[0px_0px_0px_1px_#fbc946,0px_1px_2px_0px_rgba(0,0,0,0.3)] text-xforge-black leading-[1.1] transition-all duration-200 hover:brightness-110 hover:shadow-[0px_0px_20px_4px_rgba(255,188,14,0.5),0px_0px_0px_1px_#fbc946,0px_1px_2px_0px_rgba(0,0,0,0.3)]",
  btnNotify:
    "bg-gradient-to-b from-xforge-btn-bg to-white border border-xforge-border shadow-[0px_0px_0px_1px_#f5f5f5,0px_1px_2px_0px_rgba(0,0,0,0.3)] text-xforge-black leading-[1.1] transition-all duration-200 hover:shadow-[0px_0px_14px_3px_rgba(200,200,200,0.4),0px_0px_0px_1px_#f5f5f5,0px_1px_2px_0px_rgba(0,0,0,0.3)]",
  emailWrap:
    "bg-xforge-input-bg border rounded-[12px] relative overflow-hidden transition-colors duration-200",
  emailField:
    "bg-transparent text-xforge-placeholder leading-[1.1] outline-none flex-1 min-w-0",
  insetShadow:
    "absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(0,0,0,0.6)]",
} as const;
