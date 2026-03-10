// Shared email-subscribe hook used by Hero, Footer, and MosaicGallery forms.
// Handles state, validation, /api/subscribe call, analytics, and redirect.
// Changing this affects ALL email capture forms across the site.

"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { trackEmailSubmit } from "@/lib/analytics";
import { isValidEmail } from "@/lib/utils";

export interface UseEmailSubscribeReturn {
  email: string;
  setEmail: (email: string) => void;
  submitting: boolean;
  showError: boolean;
  error: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleSubmit: () => Promise<void>;
  handleBlur: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export function useEmailSubscribe(source: string): UseEmailSubscribeReturn {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const showError = touched && email.length > 0 && !isValidEmail(email);

  const handleSubmit = useCallback(async () => {
    setTouched(true);
    setError(null);
    if (!isValidEmail(email) || submitting) {
      if (!isValidEmail(email)) inputRef.current?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) throw new Error("Subscription failed");
      trackEmailSubmit(source);
      setEmail("");
      setTouched(false);
      router.push("/reserve");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [email, submitting, source, router]);

  const handleBlur = useCallback(() => setTouched(true), []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit],
  );

  return {
    email,
    setEmail,
    submitting,
    showError,
    error,
    inputRef,
    handleSubmit,
    handleBlur,
    handleKeyDown,
  };
}
