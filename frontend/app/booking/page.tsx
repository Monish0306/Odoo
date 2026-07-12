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
  const [assetId, setAssetId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadBookings = async () => {
      const response = await apiFetch('/bookings');
      if (response.data) setBookings((response.data as any[]).slice(0, 6));
    };
    loadBookings();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage(null);
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
      setMessage('Booking blocked by an existing booking in that window.');
      return;
    }
    setMessage('Booking created successfully.');
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
              <label className="block text-xs font-semibold text-[#2E4F66] mb-2 uppercase tracking-wide">Asset ID</label>
              <input value={assetId} onChange={(e) => setAssetId(e.target.value)} placeholder="Enter asset ID" className="w-full px-4 py-2.5 bg-white border border-[#7AAACE]/20 rounded-lg text-gray-700 text-sm" />
            </motion.div>

            <motion.div className="bg-white border border-[#7AAACE]/20 rounded-lg p-8 mb-10">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="px-3 py-2 border rounded-lg" />
                <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="px-3 py-2 border rounded-lg" />
              </div>
              <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Purpose" className="w-full px-3 py-2 border rounded-lg mb-4" />
              {message && <p className="text-sm text-[#2E4F66] mb-4">{message}</p>}
              <RippleButton onClick={handleSubmit} disabled={isSubmitting} className="px-5 py-2.5 bg-[#2E4F66] text-white text-sm rounded-lg">
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
