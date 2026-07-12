'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const RippleButton = ({ children, onClick, className = '', disabled = false }: RippleButtonProps) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const ref = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const button = ref.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    const ripple = { id, x, y };
    setRipples((prev) => [...prev, ripple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.();
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
    >
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-white/50 pointer-events-none"
          initial={{ width: 0, height: 0, left: ripple.x, top: ripple.y, opacity: 1 }}
          animate={{ width: 300, height: 300, left: ripple.x - 150, top: ripple.y - 150, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
      {children}
    </button>
  );
};

export default RippleButton;
