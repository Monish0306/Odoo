'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AuthGuard from '@/components/AuthGuard';
import { apiFetch } from '@/lib/api';

export default function Maintenance() {
  const [requests, setRequests] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [assetId, setAssetId] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [requestsResponse, assetsResponse, employeesResponse] = await Promise.all([apiFetch('/maintenance'), apiFetch('/assets'), apiFetch('/employees')]);
      if (requestsResponse.data) setRequests(requestsResponse.data as any[]);
      if (assetsResponse.data) setAssets(assetsResponse.data as any[]);
      if (employeesResponse.data) setEmployees(employeesResponse.data as any[]);
      if (assetsResponse.data?.length) setAssetId((assetsResponse.data as any[])[0].id);
    };
    loadData();
  }, []);

  const handleReportIssue = async () => {
    setIsSubmitting(true);
    setMessage(null);
    const response = await apiFetch('/maintenance', { method: 'POST', body: JSON.stringify({ assetId, issueDescription }) });
    setIsSubmitting(false);
    if (response.error) {
      setMessage(response.error);
      return;
    }
    setMessage('Maintenance request reported.');
    const refreshed = await apiFetch('/maintenance');
    if (refreshed.data) setRequests(refreshed.data as any[]);
  };

  const handleApprove = async (id: string) => {
    const technicianId = employees[0]?.id;
    const response = await apiFetch(`/maintenance/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ assignedTo: technicianId }) });
    if (response.error) {
      setMessage(response.error);
      return;
    }
    setMessage('Maintenance request approved.');
    const refreshed = await apiFetch('/maintenance');
    if (refreshed.data) setRequests(refreshed.data as any[]);
  };

  const handleResolve = async (id: string) => {
    const response = await apiFetch(`/maintenance/${id}/resolve`, { method: 'PATCH', body: JSON.stringify({ resolutionNotes: 'Resolved through demo flow.' }) });
    if (response.error) {
      setMessage(response.error);
      return;
    }
    setMessage('Maintenance request resolved.');
    const refreshed = await apiFetch('/maintenance');
    if (refreshed.data) setRequests(refreshed.data as any[]);
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F5F5ED]">
        <Sidebar />
        <main className="flex-1 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Header title="Maintenance" subtitle="Report issues and drive them to resolution" />

            <div className="bg-white border border-[#7AAACE]/20 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-[#2E4F66] mb-4">Report an issue</h2>
              <select value={assetId} onChange={(e) => setAssetId(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-3">
                {assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.tag} — {asset.name}</option>)}
              </select>
              <textarea value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} placeholder="Describe the issue" className="w-full px-3 py-2 border rounded-lg mb-3" rows={3} />
              {message && <p className="text-sm text-[#2E4F66] mb-3">{message}</p>}
              <button onClick={handleReportIssue} disabled={isSubmitting} className="px-4 py-2 bg-[#2E4F66] text-white rounded-lg">{isSubmitting ? 'Reporting…' : 'Submit request'}</button>
            </div>

            <div className="bg-white border border-[#7AAACE]/20 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-[#2E4F66] mb-4">Open requests</h2>
              <ul className="space-y-3">
                {requests.map((request) => (
                  <li key={request.id} className="border border-[#7AAACE]/20 rounded-lg p-4">
                    <p className="text-sm font-semibold text-[#2E4F66]">{request.asset?.tag || request.assetId}</p>
                    <p className="text-sm text-gray-700">{request.issueDescription || request.resolutionNotes}</p>
                    <p className="text-xs text-gray-500 mt-2">Status: {request.status}</p>
                    <div className="flex gap-2 mt-3">
                      {request.status === 'Pending' && <button onClick={() => handleApprove(request.id)} className="px-3 py-1 bg-emerald-600 text-white rounded">Approve</button>}
                      {request.status === 'Assigned' || request.status === 'InProgress' ? <button onClick={() => handleResolve(request.id)} className="px-3 py-1 bg-[#2E4F66] text-white rounded">Resolve</button> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </main>
      </div>
    </AuthGuard>
  );
}
