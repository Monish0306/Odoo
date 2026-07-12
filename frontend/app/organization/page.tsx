'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatusPill from '@/components/StatusPill';
import RippleButton from '@/components/RippleButton';

const departmentData = [
  { department: 'Engineering', head: 'Aditi Rao', parentDept: '—', status: 'Active' },
  { department: 'Facilities', head: 'Rohan Mehta', parentDept: '—', status: 'Active' },
  { department: 'Field Ops (East)', head: 'Sana Iqbal', parentDept: 'Field Ops', status: 'Inactive' },
];

export default function Organization() {
  const [activeTab, setActiveTab] = useState('Departments');
  const tabs = ['Departments', 'Categories', 'Employee'];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const mapStatusToPill = (status: string) => {
    if (status === 'Active') return 'Available' as const;
    if (status === 'Inactive') return 'Lost' as const;
    return 'Available' as const;
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
            title="Organization setup"
            subtitle="Admin only · this data drives dropdowns on Assets and Allocation"
          />

          {/* Tabs and Add Button */}
          <div className="flex items-center justify-between mb-8">
            {/* Tabs */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-colors relative ${
                    activeTab === tab
                      ? 'text-[#2E4F66] font-semibold'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-[#2E4F66] rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Add Button */}
            <RippleButton className="px-4 py-2 bg-[#2E4F66] text-white rounded-lg hover:bg-[#1a2f42] transition-colors">
              + Add
            </RippleButton>
          </div>

          {/* Table */}
          <motion.div
            className="bg-white border border-[#7AAACE]/20 rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#7AAACE]/20 bg-[#F5F5ED]">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66]">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66]">Head</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66]">Parent Dept</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66]">Status</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-[#7AAACE]/20"
              >
                {departmentData.map((row, index) => (
                  <motion.tr
                    key={index}
                    className="hover:bg-[#F5F5ED] transition-colors"
                    variants={rowVariants}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">{row.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.head}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.parentDept}</td>
                    <td className="px-6 py-4 text-sm">
                      <StatusPill status={mapStatusToPill(row.status)} />
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </motion.div>

          {/* Caption */}
          <motion.p
            className="text-xs text-gray-600 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Editing a department here also updates the picklist on Assets and Allocation & Transfer.
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
