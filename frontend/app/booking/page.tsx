'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import RippleButton from '@/components/RippleButton';

const timeSlots = ['9:00', '10:00', '11:00', '12:00', '1:00'];

export default function Booking() {
  const bookedVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  const conflictVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        type: 'spring',
        stiffness: 400,
        damping: 20,
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
            title="Resource booking"
            subtitle="Book shared resources without double-booking"
          />

          {/* Resource Field */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <label className="block text-xs font-semibold text-[#2E4F66] mb-2">Resource</label>
            <input
              type="text"
              value="Conference room B2 — Tue, 7 Jul"
              readOnly
              className="w-full px-4 py-3 bg-gray-100 border border-[#7AAACE]/20 rounded-lg text-gray-600 cursor-not-allowed"
            />
          </motion.div>

          {/* Time Slots */}
          <motion.div
            className="bg-white border border-[#7AAACE]/20 rounded-lg p-8 mb-8 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="space-y-2 relative">
              {timeSlots.map((slot, index) => (
                <div key={slot} className="flex items-center">
                  <div className="w-16 text-sm font-medium text-gray-600">{slot}</div>

                  {/* Existing Booking Block (between 9:00 and 10:00) */}
                  {index === 0 && (
                    <motion.div
                      className="flex-1 ml-4 h-16 bg-[#9ED8FF] border-2 border-[#7AAACE] rounded-lg flex items-center px-4 text-sm font-medium text-[#2E4F66]"
                      variants={bookedVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      Booked — Procurement Team — 9 to 10
                    </motion.div>
                  )}

                  {/* Conflict Block (overlapping, with dashed border) */}
                  {index === 0 && (
                    <motion.div
                      className="flex-1 ml-4 h-12 border-2 border-dashed border-rose-400 rounded-lg flex items-center px-4 text-xs font-medium text-rose-600 bg-rose-50 absolute top-12 left-20 right-0 w-[calc(100%-5rem)]"
                      variants={conflictVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      Requested 9:30 to 10:30 — conflict — slot is unavailable
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Book a Slot Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <RippleButton className="px-6 py-3 bg-white border border-[#7AAACE] text-[#2E4F66] font-medium rounded-lg hover:border-[#2E4F66] transition-colors">
              Book a slot
            </RippleButton>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
