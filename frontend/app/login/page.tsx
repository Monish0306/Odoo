"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/**
 * Screen 1 — Login / Signup
 * Palette: navy #2E4F66, mid-blue #7AAACE, sky #9ED8FF, cream #F5F5ED
 * Font: Sentient (display/headline) — add the Fontshare <link> in app/layout.tsx
 *
 * Paste at: app/login/page.tsx
 */

// --- Text Reveal: splits the headline into words, animates each in with a stagger ---
function TextReveal({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.25, 1, 0.5, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// --- Animated Button: subtle scale on hover/tap, sweep highlight on hover ---
function AnimatedButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="relative w-full overflow-hidden text-white text-sm font-medium py-2.5 rounded-md mt-2
                 bg-[#2E4F66] group"
    >
      <motion.span
        className="absolute inset-0 bg-[#7AAACE]"
        initial={{ x: "-100%" }}
        whileHover={{ x: "0%" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

export default function Page() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    // --- Fade In: whole card fades + lifts in on mount ---
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5ED] px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm bg-white border border-[#7AAACE]/30 rounded-xl p-8 shadow-sm"
      >
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-10 w-10 rounded-lg bg-[#2E4F66] text-white font-mono font-bold flex items-center justify-center mb-3">
            AF
          </div>
          <h2 className="text-2xl text-[#2E4F66]" style={{ fontFamily: "Sentient, serif" }}>
            <TextReveal
              text={mode === "login" ? "Sign in to AssetFlow" : "Create your account"}
            />
          </h2>
          <p className="text-sm text-[#2E4F66]/60 mt-2">
            Track, allocate, and audit company assets
          </p>
        </div>

        {/* Email */}
        <label className="block text-xs font-medium text-[#2E4F66]/80 mb-1.5">
          Work email
        </label>
        <input
          type="email"
          className="w-full mb-4 px-3 py-2 border border-[#7AAACE]/40 rounded-md text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#9ED8FF] focus:border-transparent
                     transition-shadow"
          placeholder="name@company.com"
        />

        {/* Password */}
        <label className="block text-xs font-medium text-[#2E4F66]/80 mb-1.5">
          Password
        </label>
        <input
          type="password"
          className="w-full mb-2 px-3 py-2 border border-[#7AAACE]/40 rounded-md text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#9ED8FF] focus:border-transparent
                     transition-shadow"
          placeholder="••••••••••"
        />

        {mode === "login" && (
          <div className="text-right mb-4">
            <button className="text-xs text-[#2E4F66] hover:underline">
              Forgot password
            </button>
          </div>
        )}

        <AnimatedButton>
          {mode === "login" ? "Sign in" : "Create account"}
        </AnimatedButton>

        {mode === "signup" && (
          <p className="text-xs text-[#2E4F66]/50 mt-3 text-center">
            New accounts start as Employee. An admin assigns other roles later.
          </p>
        )}

        {/* Toggle login/signup */}
        <div className="mt-6 pt-4 border-t border-[#7AAACE]/20 text-center text-sm text-[#2E4F66]/70">
          {mode === "login" ? (
            <>
              New here?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-[#2E4F66] font-medium hover:underline"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-[#2E4F66] font-medium hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
