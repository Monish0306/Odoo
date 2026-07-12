'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Plus, Calendar, Send, Package, Clock, Wrench } from 'lucide-react';
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
  { icon: Package, text: 'Laptop AF-0114 - allocated to Priya Shah - IT dept' },
  { icon: Calendar, text: 'Room B2 - booking confirmed - 2:00 to 3:00 PM' },
  { icon: Wrench, text: 'Projector AF-0062 - maintenance resolved' },
];

export default function Dashboard() {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const activityVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.08 + 0.3,
        duration: 0.4,
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
          transition={{ duration: 0.5 }}
        >
          <Header
            title="Dashboard"
            subtitle="Today's Overview"
          />

          {/* KPI Cards Grid */}
          <motion.div
            className="grid grid-cols-3 gap-6 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {kpiData.map((kpi, index) => (
              <motion.div
                key={index}
                className="bg-white border border-[#7AAACE]/20 rounded-lg p-6 cursor-default group"
                variants={itemVariants}
                whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(46, 79, 102, 0.08)' }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-4">{kpi.label}</p>
                <p className="text-5xl font-bold text-[#2E4F66] leading-tight">
                  <CountUp value={kpi.value} />
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Alert Banner */}
          <motion.div
            className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-10 flex items-start gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
          >
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="text-rose-700 text-sm font-semibold">
              3 assets overdue for return — Flagged for follow-up
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.4 }}
          >
            {/* Primary Action */}
            <RippleButton
              className="px-5 py-2.5 bg-[#2E4F66] text-white font-medium text-sm rounded-lg hover:bg-[#1a2f42] hover:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Register asset
            </RippleButton>

            {/* Secondary Actions */}
            {[
              { label: 'Book resource', icon: Calendar },
              { label: 'Raise requests', icon: Send },
            ].map((btn, i) => (
              <RippleButton
                key={i}
                className="px-5 py-2.5 bg-white border border-[#7AAACE] text-[#2E4F66] font-medium text-sm rounded-lg hover:border-[#2E4F66] hover:shadow-sm hover:bg-[#F5F5ED] transition-all duration-200 flex items-center gap-2"
              >
                <btn.icon className="w-4 h-4" />
                {btn.label}
              </RippleButton>
            ))}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="bg-white border border-[#7AAACE]/20 rounded-lg p-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-[#2E4F66] mb-5 tracking-tight" style={{ fontFamily: 'Sentient, serif' }}>
              Recent activity
            </h2>
            <ul className="space-y-4">
              {activityItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={i}
                    className="text-sm text-gray-600 pl-3 border-l-3 border-l-[#7AAACE]/30 hover:border-l-[#7AAACE] transition-colors duration-200 flex items-start gap-3"
                    custom={i}
                    variants={activityVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Icon className="w-4 h-4 text-[#7AAACE] flex-shrink-0 mt-0.5" />
                    <span>{item.text}</span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
