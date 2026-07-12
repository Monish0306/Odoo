'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatusPill from '@/components/StatusPill';
import RippleButton from '@/components/RippleButton';
import AuthGuard from '@/components/AuthGuard';
import { apiFetch } from '@/lib/api';

type AssetRow = {
  id: string;
  tag: string;
  name: string;
  category?: { name?: string } | null;
  status: string;
  location?: string | null;
};

export default function Assets() {
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({ name: '', categoryId: '', serialNumber: '', condition: 'Good', location: '', departmentId: '' });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadAssets = async () => {
      const response = await apiFetch('/assets');
      if (response.data) {
        const rows = (response.data as Array<any>).map((asset) => ({
          id: asset.id,
          tag: asset.tag,
          name: asset.name,
          category: asset.category,
          status: asset.status,
          location: asset.location,
        }));
        setAssets(rows);
      }
      setIsLoading(false);
    };

    const loadMetadata = async () => {
      const [catRes, deptRes] = await Promise.all([
        apiFetch('/categories'),
        apiFetch('/departments')
      ]);
      if (catRes.data) setCategories(catRes.data);
      if (deptRes.data) setDepartments(deptRes.data);
    };

    loadAssets();
    loadMetadata();
  }, []);

  const handleCreateAsset = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    
    const finalCategoryId = form.categoryId || categories[0]?.id;
    if (!finalCategoryId) {
      setFeedback('Error: No asset category available.');
      setIsSubmitting(false);
      return;
    }

    const response = await apiFetch('/assets', {
      method: 'POST',
      body: JSON.stringify({
        name: form.name,
        categoryId: finalCategoryId,
        serialNumber: form.serialNumber,
        condition: form.condition,
        location: form.location,
        departmentId: form.departmentId || undefined,
      }),
    });
    setIsSubmitting(false);
    if (response.error) {
      setFeedback(response.error);
      return;
    }
    setFeedback(`Asset ${form.name} created.`);
    setShowCreateForm(false);
    setForm({ name: '', categoryId: '', serialNumber: '', condition: 'Good', location: '', departmentId: '' });
    const refresh = await apiFetch('/assets');
    if (refresh.data) {
      setAssets((refresh.data as Array<any>).map((asset) => ({ id: asset.id, tag: asset.tag, name: asset.name, category: asset.category, status: asset.status, location: asset.location })));
    }
  };

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
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F5F5ED]">
        <Sidebar />
        <main className="flex-1 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Header title="Assets" subtitle="Live inventory from the backend" />

            <motion.div className="flex gap-3 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.4 }}>
              <input type="text" placeholder="Search by tag, serial, or QR code…" className="flex-1 px-4 py-2.5 bg-white border border-[#7AAACE]/20 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9ED8FF] focus:border-transparent transition-all duration-200" />
              <RippleButton onClick={() => setShowCreateForm((value) => !value)} className="px-5 py-2.5 bg-[#2E4F66] text-white text-sm font-medium rounded-lg hover:bg-[#1a2f42] hover:shadow-sm transition-all duration-200">
                {showCreateForm ? 'Hide form' : '+ Register Asset'}
              </RippleButton>
            </motion.div>

            {showCreateForm && (
              <form onSubmit={handleCreateAsset} className="bg-white border border-[#7AAACE]/20 rounded-lg p-6 mb-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Asset name" className="px-3 py-2 border rounded-lg text-sm bg-white" />
                  <input value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} placeholder="Serial number" className="px-3 py-2 border rounded-lg text-sm bg-white" />
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="px-3 py-2 border rounded-lg text-sm bg-white" />
                  <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white">
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <select value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white col-span-2">
                    <option value="">Select Department (Optional)</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white">
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#2E4F66] text-white rounded-lg text-sm hover:bg-[#1a2f42] transition-colors">{isSubmitting ? 'Creating…' : 'Create asset'}</button>
                </div>
                {feedback && <p className="text-sm text-[#2E4F66]">{feedback}</p>}
              </form>
            )}

            {isLoading ? (
              <motion.div className="bg-white border border-[#7AAACE]/20 rounded-lg overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <table className="w-full"><thead><tr className="border-b border-[#7AAACE]/20 bg-[#F5F5ED]"><th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Tag</th><th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Name</th><th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Category</th><th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Status</th><th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Location</th></tr></thead><tbody className="divide-y divide-[#7AAACE]/10">{[0, 1, 2].map((i) => <tr key={i} className="px-6 py-4"><td className="px-6 py-4"><div className="h-3 bg-gray-200 rounded animate-pulse w-14"></div></td><td className="px-6 py-4"><div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div></td><td className="px-6 py-4"><div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div></td><td className="px-6 py-4"><div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div></td><td className="px-6 py-4"><div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div></td></tr>)}</tbody></table></motion.div>
            ) : (
              <motion.div className="bg-white border border-[#7AAACE]/20 rounded-lg overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <table className="w-full"><thead><tr className="border-b border-[#7AAACE]/20 bg-[#F5F5ED]"><th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Tag</th><th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Name</th><th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Category</th><th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Status</th><th className="px-6 py-4 text-left text-xs font-semibold text-[#2E4F66] uppercase tracking-wide">Location</th></tr></thead><motion.tbody variants={containerVariants} initial="hidden" animate="visible" className="divide-y divide-[#7AAACE]/10">{assets.map((asset, index) => <motion.tr key={asset.id || index} className="hover:bg-[#F5F5ED]/60 transition-colors duration-150 border-l-2 border-l-transparent hover:border-l-[#9ED8FF]" variants={rowVariants}><td className="px-6 py-4 text-sm font-medium text-[#2E4F66]">{asset.tag}</td><td className="px-6 py-4 text-sm text-gray-700">{asset.name}</td><td className="px-6 py-4 text-sm text-gray-700">{asset.category?.name || '—'}</td><td className="px-6 py-4 text-sm"><StatusPill status={asset.status} /></td><td className="px-6 py-4 text-sm text-gray-700">{asset.location || '—'}</td></motion.tr>)}</motion.tbody></table></motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </AuthGuard>
  );
}
