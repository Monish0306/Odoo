'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatusPill from '@/components/StatusPill';
import RippleButton from '@/components/RippleButton';

const assetData = [
  { tag: 'AF-0012', name: 'Dell Laptop', category: 'Electronics', status: 'Allocated' as const, location: 'Bengaluru' },
  { tag: 'AF-0062', name: 'Projector', category: 'Electronics', status: 'Maintenance' as const, location: 'HQ Floor 2' },
  { tag: 'AF-0201', name: 'Office Chair', category: 'Furniture', status: 'Available' as const, location: 'Warehouse' },
];

export default function Assets() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.04,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
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
            title="Assets"
            subtitle="128 available · 76 allocated · 4 under maintenance"
          />

          {/* Search and Register */}
          <motion.div
            className="flex gap-3 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4 }}
          >
            <input
              type="text"
              placeholder="Search by tag, serial, or QR code…"
              className="flex-1 px-4 py-2.5 bg-white border border-[#7AAACE]/20 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9ED8FF] focus:border-transparent transition-all duration-200"
            />
            <RippleButton className="px-5 py-2.5 bg-[#2E4F66] text-white text-sm font-medium rounded-lg hover:bg-[#1a2f42] hover:shadow-sm transition-all duration-200">
              + Register Asset
            </RippleButton>
          </motion.div>

          {/* Filter Pills */}
          <motion.div
            className="flex gap-2 mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.4 }}
          >
            {['Category', 'Status', 'Department'].map((filter, i) => (
              <RippleButton
                key={i}
                className="px-3.5 py-2 bg-white border border-[#7AAACE]/20 text-[#2E4F66] rounded-lg hover:border-[#7AAACE]/60 hover:bg-[#F5F5ED] transition-all duration-200 text-xs font-medium"
              >
                {filter}
              </RippleButton>
            ))}
          </motion.div>

          {/* Table or Skeleton */}
          {isLoading ? (
            <motion.div
              className="bg-white border border-[#7AAACE]/20 rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#7AAACE]/20 bg-[#F5F5ED]">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Tag</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#7AAACE]/10">
                  {[0, 1, 2].map((i) => (
                    <tr key={i} className="px-6 py-4">
                      <td className="px-6 py-4">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-14"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div
              className="bg-white border border-[#7AAACE]/20 rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#7AAACE]/20 bg-[#F5F5ED]">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Tag</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Location</th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-[#7AAACE]/10"
                >
                  {assetData.map((asset, index) => (
                    <motion.tr
                      key={index}
                      className="hover:bg-[#F5F5ED]/60 transition-colors duration-150 border-l-2 border-l-transparent hover:border-l-[#9ED8FF]"
                      variants={rowVariants}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#2E4F66]">{asset.tag}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{asset.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{asset.category}</td>
                      <td className="px-6 py-4 text-sm">
                        <StatusPill status={asset.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{asset.location}</td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
