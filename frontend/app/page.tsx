'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TextReveal, AnimatedButton } from '@/components/AnimationComponents';

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className="relative min-h-screen bg-[#F5F5ED] overflow-hidden flex items-center justify-center px-4">
      {/* Animated Background Glow */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#9ED8FF]/10 blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#7AAACE]/8 blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* Hero Content */}
      <motion.div
        className="relative z-10 max-w-2xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo Mark */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="h-16 w-16 rounded-lg bg-[#2E4F66] text-white font-mono font-bold flex items-center justify-center text-xl shadow-sm">
            AF
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          className="text-5xl font-bold text-[#2E4F66] mb-3"
          style={{ fontFamily: 'Sentient, serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          AssetFlow
        </motion.h1>

        {/* Main Tagline with TextReveal */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            <TextReveal
              text="Every asset, accounted for."
              className="text-[#2E4F66]"
            />
          </h2>
        </motion.div>

        {/* Supporting Subtext */}
        <motion.p
          className="text-lg text-gray-600 max-w-xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          Track, allocate, and audit every company asset — from laptops to lab equipment — in one place.
        </motion.p>

        {/* Primary CTA Button */}
        <motion.div
          className="max-w-xs mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85 }}
        >
          <AnimatedButton onClick={handleGetStarted}>
            Get Started
          </AnimatedButton>
        </motion.div>

        {/* Optional Footer Text */}
        <motion.p
          className="text-xs text-gray-500 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          Demo environment · No credit card required
        </motion.p>
      </motion.div>
    </div>
  );
}
