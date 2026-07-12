'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import RippleButton from '@/components/RippleButton';

const allocationHistoryData = [
  { action: 'Allocated to Priya Shah', dept: 'Engineering', date: 'Mar 12' },
  { action: 'Returned by Arjun Nair', condition: 'condition: good', date: 'Jan 4' },
];

export default function Allocation() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 600);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const shakeVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        type: 'spring',
        stiffness: 500,
        damping: 25,
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5ED]">
      <Sidebar />
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header
            title="Allocation & Transfer"
            subtitle="Assign assets to employees, or request a transfer if already held"
          />

          <div className="grid grid-cols-[60%_40%] gap-8">
            {/* Left Column */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-xs font-semibold text-[#2E4F66] mb-2">Asset</label>
                <input
                  type="text"
                  value="AF-0114 — Dell laptop"
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border border-[#7AAACE]/20 rounded-lg text-gray-600 cursor-not-allowed"
                />
              </motion.div>

              {/* Conflict Alert */}
              <motion.div
                className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-lg"
                variants={shakeVariants}
              >
                <p className="text-rose-700 font-semibold text-sm mb-1">
                  Already allocated to Priya Shah (Engineering)
                </p>
                <p className="text-rose-600 text-sm">
                  Direct re-allocation is blocked — submit a transfer request below.
                </p>
              </motion.div>

              {/* Transfer Request Form */}
              <motion.div variants={itemVariants} className="bg-white border border-[#7AAACE]/20 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-[#2E4F66] mb-6" style={{ fontFamily: 'Sentient, serif' }}>
                  Transfer Request
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2E4F66] mb-2">From</label>
                    <input
                      type="text"
                      value="Priya Shah"
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-[#7AAACE]/20 rounded-lg text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2E4F66] mb-2">To</label>
                    <select className="w-full px-4 py-3 bg-white border border-[#7AAACE]/20 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9ED8FF]">
                      <option>Select Employee…</option>
                      <option>Raj Kumar</option>
                      <option>Sana Iqbal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2E4F66] mb-2">Reason</label>
                    <textarea
                      placeholder="Enter reason for transfer…"
                      className="w-full px-4 py-3 bg-white border border-[#7AAACE]/20 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9ED8FF] resize-none"
                      rows={5}
                    />
                  </div>

                  <RippleButton
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-60"
                  >
                    {isSubmitting ? 'Submitting…' : 'Submit Request'}
                  </RippleButton>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Allocation History */}
            <motion.div
              className="bg-white border border-[#7AAACE]/20 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-lg font-semibold text-[#2E4F66] mb-6" style={{ fontFamily: 'Sentient, serif' }}>
                Allocation history
              </h2>

              <motion.ul
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {allocationHistoryData.map((entry, i) => (
                  <motion.li key={i} className="pb-4 border-b border-[#7AAACE]/10 last:border-b-0" variants={itemVariants}>
                    <p className="text-sm text-gray-700">
                      {entry.action}
                      {entry.dept && ` — ${entry.dept}`}
                      {entry.condition && ` — ${entry.condition}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{entry.date}</p>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
