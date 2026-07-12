'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AuthGuard from '@/components/AuthGuard';
import StatusPill from '@/components/StatusPill';
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
    setIssueDescription('');
    const refreshed = await apiFetch('/maintenance');
    if (refreshed.data) setRequests(refreshed.data as any[]);
  };

  const handleApprove = async (id: string, technicianId: string) => {
    if (!technicianId) {
      setMessage('Please select a technician to assign.');
      return;
    }
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
    const notes = prompt('Enter resolution notes:') || 'Resolved through demo flow.';
    const response = await apiFetch(`/maintenance/${id}/resolve`, { method: 'PATCH', body: JSON.stringify({ resolutionNotes: notes }) });
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
              <h2 className="text-lg font-semibold text-[#2E4F66] mb-4" style={{ fontFamily: 'Sentient, serif' }}>Open requests</h2>
              <ul className="space-y-4">
                {requests.map((request) => (
                  <li key={request.id} className="border border-[#7AAACE]/20 rounded-lg p-5 bg-white hover:shadow-sm transition-shadow duration-200">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <p className="text-sm font-semibold text-[#2E4F66]">{request.asset?.name || 'Asset ID: ' + request.assetId} ({request.asset?.tag || 'No Tag'})</p>
                        <p className="text-xs text-gray-500 mt-0.5">Reported by: {request.reporter?.name || 'Unknown'}</p>
                      </div>
                      <StatusPill status={request.status} />
                    </div>
                    <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2.5 rounded border border-[#7AAACE]/10 font-mono text-xs">{request.issueDescription}</p>
                    
                    {request.resolutionNotes && (
                      <p className="text-sm text-[#2E4F66] mt-2 bg-emerald-50/50 p-2.5 rounded border border-emerald-200/30 text-xs font-mono">
                        **Resolution**: {request.resolutionNotes}
                      </p>
                    )}

                    <div className="flex gap-3 mt-4 items-center justify-between pt-3 border-t border-[#7AAACE]/10">
                      <div>
                        {request.assignee && (
                          <p className="text-xs text-gray-500">Assigned To: **{request.assignee.name}**</p>
                        )}
                      </div>
                      <div className="flex gap-2 items-center">
                        {request.status === 'Pending' && (
                          <div className="flex items-center gap-2">
                            <select
                              id={`tech-select-${request.id}`}
                              className="px-2 py-1 border border-[#7AAACE]/20 rounded text-xs bg-white text-gray-700 focus:outline-none"
                            >
                              <option value="">Select Tech</option>
                              {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => {
                                const selectEl = document.getElementById(`tech-select-${request.id}`) as HTMLSelectElement;
                                const techId = selectEl?.value || employees[0]?.id;
                                if (techId) handleApprove(request.id, techId);
                              }}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs transition-colors font-medium"
                            >
                              Approve
                            </button>
                          </div>
                        )}
                        {(request.status === 'Assigned' || request.status === 'InProgress') && (
                          <button
                            onClick={() => handleResolve(request.id)}
                            className="px-3 py-1.5 bg-[#2E4F66] hover:bg-[#1a2f42] text-white rounded text-xs transition-colors font-medium"
                          >
                            Resolve Request
                          </button>
                        )}
                      </div>
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
