import { motion } from 'framer-motion';
import React from 'react';

// --- Text Reveal: splits text into words, animates each in with a stagger ---
export function TextReveal({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.5, delay: 0.06 * i, ease: [0.25, 1, 0.5, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// --- Animated Button: subtle scale on hover/tap, sweep highlight on hover ---
export function AnimatedButton({
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
