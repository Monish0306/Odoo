"use client";

import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { cn } from "@/lib/utils";

export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function TextReveal({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <motion.h1
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.035 },
        },
      }}
    >
      {children.split("").map((character, index) => (
        <motion.span
          className="inline-block"
          key={`${character}-${index}`}
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {character === " " ? "\u00A0" : character}
        </motion.span>
      ))}
    </motion.h1>
  );
}

export function CountUp({
  value,
  suffix = "",
  duration = 900,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elementRef, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;

    const animate = (time: number) => {
      if (!startTime) startTime = time;

      const progress = Math.min((time - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [duration, isInView, value]);

  return (
    <span ref={elementRef}>
      {displayValue}
      {suffix}
    </span>
  );
}

export function HoverBorder({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        "rounded-xl border border-slate-800 transition-colors hover:border-teal-400/45",
        className,
      )}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function RippleButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-lg px-4 py-2.5 text-sm font-semibold transition",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-7 overflow-hidden rounded-xl border border-slate-800">
      {Array.from({ length: 42 }).map((_, index) => (
        <div
          className="min-h-24 border-b border-r border-slate-800 bg-slate-900 p-3"
          key={index}
        >
          <div className="size-6 rounded-md bg-slate-800" />
          {index % 5 === 0 && (
            <div className="mt-3 h-5 rounded bg-slate-800/80" />
          )}
        </div>
      ))}
    </div>
  );
}