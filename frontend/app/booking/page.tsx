'use client';

import { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import RippleButton from '@/components/RippleButton';
import AuthGuard from '@/components/AuthGuard';
import { apiFetch } from '@/lib/api';

export default function Booking() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [assetsList, setAssetsList] = useState<any[]>([]);
  const [assetId, setAssetId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [blockedInfo, setBlockedInfo] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [bookingsRes, assetsRes] = await Promise.all([
        apiFetch('/bookings'),
        apiFetch('/assets')
      ]);
      if (bookingsRes.data) setBookings((bookingsRes.data as any[]).slice(0, 6));
      if (assetsRes.data) {
        setAssetsList((assetsRes.data as any[]).filter((a: any) => a.isBookable));
      }
    };
    loadData();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage(null);
    setBlockedInfo(null);
    const response = await apiFetch('/bookings', {
      method: 'POST',
      body: JSON.stringify({ assetId, startTime, endTime, purpose }),
    });
    setIsSubmitting(false);

    if (response.error) {
      setMessage(response.error);
      return;
    }
    if (response.data?.blocked) {
      setBlockedInfo(response.data.conflictingBooking);
      setMessage('Booking is blocked due to a schedule conflict.');
      return;
    }
    setMessage('Booking created successfully.');
    setAssetId('');
    setStartTime('');
    setEndTime('');
    setPurpose('');
    const refreshed = await apiFetch('/bookings');
    if (refreshed.data) setBookings((refreshed.data as any[]).slice(0, 6));
  };

  const bookedVariants: Variants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } } };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F5F5ED]">
        <Sidebar />
        <main className="flex-1 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Header title="Resource booking" subtitle="Book shared resources without double-booking" />

            <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.4 }}>
              <label className="block text-xs font-semibold text-[#2E4F66] mb-2 uppercase tracking-wide">Select Asset</label>
              <select
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#7AAACE]/20 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#9ED8FF]"
              >
                <option value="">Choose a bookable resource…</option>
                {assetsList.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.tag})
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div className="bg-white border border-[#7AAACE]/20 rounded-lg p-8 mb-10">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2E4F66] mb-1.5 uppercase tracking-wide">Start Time</label>
                  <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9ED8FF]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2E4F66] mb-1.5 uppercase tracking-wide">End Time</label>
                  <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9ED8FF]" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-[#2E4F66] mb-1.5 uppercase tracking-wide">Purpose / Notes</label>
                <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Purpose of booking" className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9ED8FF]" />
              </div>
              
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${blockedInfo ? 'bg-rose-50 border border-rose-200 text-rose-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'}`}>
                  <p className="font-semibold text-sm">{message}</p>
                  {blockedInfo && (
                    <div className="text-xs text-gray-700 mt-2 space-y-1 bg-white/60 p-2.5 rounded border border-rose-200/50">
                      <p className="font-semibold text-[#2E4F66]">Conflicting Slot:</p>
                      <p>• **Start**: {new Date(blockedInfo.startTime).toLocaleString()}</p>
                      <p>• **End**: {new Date(blockedInfo.endTime).toLocaleString()}</p>
                      {blockedInfo.purpose && <p>• **Purpose**: {blockedInfo.purpose}</p>}
                    </div>
                  )}
                </div>
              )}

              <RippleButton onClick={handleSubmit} disabled={isSubmitting} className="px-5 py-2.5 bg-[#2E4F66] text-white text-sm rounded-lg hover:bg-[#1a2f42] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {isSubmitting ? 'Booking…' : 'Book a slot'}
              </RippleButton>
            </motion.div>

            <motion.div className="bg-white border border-[#7AAACE]/20 rounded-lg p-8" variants={bookedVariants} initial="hidden" animate="visible">
              <h2 className="text-lg font-semibold text-[#2E4F66] mb-4">Recent bookings</h2>
              <ul className="space-y-3">
                {bookings.map((booking, i) => (
                  <li key={booking.id || i} className="text-sm text-gray-700 border-b border-[#7AAACE]/10 pb-2">
                    {booking.asset?.name || booking.assetId} — {new Date(booking.startTime).toLocaleString()} to {new Date(booking.endTime).toLocaleString()}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </AuthGuard>
  );
}
