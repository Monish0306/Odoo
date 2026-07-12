'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import RippleButton from '@/components/RippleButton';
import AuthGuard from '@/components/AuthGuard';
import { apiFetch } from '@/lib/api';

type AllocationBlockedPayload = {
  blocked?: boolean;
  currentHolder?: { name?: string | null } | string | null;
  suggestTransfer?: boolean;
};

export default function Allocation() {
  const [assetId, setAssetId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [blockedInfo, setBlockedInfo] = useState<{ currentHolder?: string | null; suggestTransfer?: boolean } | null>(null);
  const [assetsList, setAssetsList] = useState<{ id: string; name: string; tag: string; status: string }[]>([]);
  const [employeesList, setEmployeesList] = useState<{ id: string; name: string; email: string }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [assetRes, empRes] = await Promise.all([
        apiFetch('/assets'),
        apiFetch('/employees')
      ]);
      if (assetRes.data) setAssetsList(assetRes.data);
      if (empRes.data) setEmployeesList(empRes.data);
    };
    loadData();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage(null);
    setBlockedInfo(null);
    const response = await apiFetch('/allocations', {
      method: 'POST',
      body: JSON.stringify({ assetId, employeeId, expectedReturnDate: expectedReturnDate || undefined }),
    });
    setIsSubmitting(false);

    if (response.error) {
      setMessage(response.error);
      return;
    }

    const payload = response.data as AllocationBlockedPayload | null;

    if (payload?.blocked) {
      const currentHolder = typeof payload.currentHolder === 'object' && payload.currentHolder !== null ? payload.currentHolder.name ?? null : payload.currentHolder ?? null;
      setBlockedInfo({
        currentHolder,
        suggestTransfer: Boolean(payload.suggestTransfer),
      });
      setMessage('Allocation is blocked because the asset already has an active holder.');
      return;
    }

    setMessage('Asset allocated successfully.');
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.06 } },
  };

  const itemVariants: Variants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F5F5ED]">
        <Sidebar />
        <main className="flex-1 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Header title="Allocation & Transfer" subtitle="Assign assets to employees, or request a transfer when blocked" />

            <div className="grid grid-cols-[60%_40%] gap-8">
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants} className="mb-6">
                  <label className="block text-xs font-semibold text-[#2E4F66] mb-2 uppercase tracking-wide">Asset</label>
                  <select
                    value={assetId}
                    onChange={(e) => setAssetId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#7AAACE]/20 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#9ED8FF]"
                  >
                    <option value="">Select Asset</option>
                    {assetsList.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.tag}) — {a.status}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-6">
                  <label className="block text-xs font-semibold text-[#2E4F66] mb-2 uppercase tracking-wide">Assign To Employee</label>
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#7AAACE]/20 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#9ED8FF]"
                  >
                    <option value="">Select Employee</option>
                    {employeesList.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.email})
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-6">
                  <label className="block text-xs font-semibold text-[#2E4F66] mb-2 uppercase tracking-wide">Expected return date</label>
                  <input type="date" value={expectedReturnDate} onChange={(e) => setExpectedReturnDate(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-[#7AAACE]/20 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#9ED8FF]" />
                </motion.div>

                {message && (
                  <div className={`mb-6 p-4 rounded-lg ${blockedInfo ? 'bg-rose-50 border border-rose-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <p className={`font-semibold text-sm ${blockedInfo ? 'text-rose-700' : 'text-emerald-700'}`}>{message}</p>
                    {blockedInfo?.currentHolder && <p className="text-sm text-gray-700 mt-2">Current holder: {blockedInfo.currentHolder}</p>}
                    {blockedInfo?.suggestTransfer && <p className="text-sm text-gray-700 mt-1">A transfer request should be used for reassignment.</p>}
                  </div>
                )}

                <motion.div variants={itemVariants} className="bg-white border border-[#7AAACE]/20 rounded-lg p-7">
                  <h2 className="text-lg font-semibold text-[#2E4F66] mb-6 tracking-tight" style={{ fontFamily: 'Sentient, serif' }}>Allocate asset</h2>
                  <RippleButton onClick={handleSubmit} disabled={isSubmitting} className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 hover:shadow-sm transition-all duration-200 font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Allocating…' : 'Allocate now'}
                  </RippleButton>
                </motion.div>
              </motion.div>

              <motion.div className="bg-white border border-[#7AAACE]/20 rounded-lg p-7" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
                <h2 className="text-lg font-semibold text-[#2E4F66] mb-6 tracking-tight" style={{ fontFamily: 'Sentient, serif' }}>Demo note</h2>
                <p className="text-sm text-gray-700">If the backend responds with a blocked allocation, the UI now surfaces that directly instead of falling back to a generic failure.</p>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </AuthGuard>
  );
}
