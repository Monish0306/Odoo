'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CountUp from '@/components/CountUp';
import RippleButton from '@/components/RippleButton';

const kpiData = [
  { label: 'Available', value: 128 },
  { label: 'Allocated', value: 76 },
  { label: 'Available', value: 4 },
  { label: 'Active Bookings', value: 9 },
  { label: 'Pending Transfers', value: 3 },
  { label: 'Upcoming returns', value: 12 },
];

const activityItems = [
  'Laptop AF-0114 - allocated to Priya Shah - IT dept',
  'Room B2 - booking confirmed - 2:00 to 3:00 PM',
  'Projector AF-0062 - maintenance resolved',
];

export default function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const activityVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1 + 0.4,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5ED]">
      <Sidebar />
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Header
            title="Dashboard"
            subtitle="Today's Overview"
          />

          {/* KPI Cards Grid */}
          <motion.div
            className="grid grid-cols-3 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {kpiData.map((kpi, index) => (
              <motion.div
                key={index}
                className="bg-white border border-[#7AAACE]/20 rounded-lg p-6"
                variants={itemVariants}
              >
                <p className="text-gray-600 text-sm mb-2">{kpi.label}</p>
                <p className="text-3xl font-bold text-[#2E4F66]">
                  <CountUp value={kpi.value} />
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Alert Banner */}
          <motion.div
            className="bg-rose-100 border border-rose-300 rounded-lg p-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p className="text-rose-700 text-sm font-medium">
              3 assets overdue for return - Flagged for follow-up
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {['+ register asset', 'Book resource', 'Raise requests'].map((btn, i) => (
              <RippleButton
                key={i}
                className="px-6 py-3 bg-white border border-[#7AAACE] text-[#2E4F66] font-medium rounded-lg hover:border-[#2E4F66] transition-colors"
              >
                {btn}
              </RippleButton>
            ))}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="bg-white border border-[#7AAACE]/20 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h2 className="text-lg font-semibold text-[#2E4F66] mb-4" style={{ fontFamily: 'Sentient, serif' }}>
              Recent activity
            </h2>
            <ul className="space-y-3">
              {activityItems.map((item, i) => (
                <motion.li
                  key={i}
                  className="text-sm text-gray-600 pl-4 border-l-2 border-l-transparent"
                  custom={i}
                  variants={activityVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
