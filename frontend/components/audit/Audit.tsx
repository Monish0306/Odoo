'use client';

import { useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AuditHeader from '@/components/audit/AuditHeader';
import AuditOverview from '@/components/audit/AuditOverview';
import AuditTable from '@/components/audit/AuditTable';
import AuditSummary from '@/components/audit/AuditSummary';
import AuditActions from '@/components/audit/AuditActions';

const auditRows = [
  {
    id: 'AF-0012',
    name: 'Dell Laptop',
    expectedLocation: 'Bengaluru Office',
    actualLocation: 'Bengaluru Office',
    status: 'Verified',
  },
  {
    id: 'AF-0048',
    name: 'Projector',
    expectedLocation: 'HQ Floor 2',
    actualLocation: 'Warehouse',
    status: 'Mismatch',
  },
  {
    id: 'AF-0103',
    name: 'Office Chair',
    expectedLocation: 'Warehouse',
    actualLocation: 'Warehouse',
    status: 'Verified',
  },
  {
    id: 'AF-0174',
    name: 'Monitor',
    expectedLocation: 'R&D Lab',
    actualLocation: 'R&D Lab',
    status: 'Damaged',
  },
  {
    id: 'AF-0219',
    name: 'Printer',
    expectedLocation: 'Finance Desk',
    actualLocation: 'Finance Desk',
    status: 'Missing',
  },
];

export default function Audit() {
  const flaggedCount = useMemo(() => auditRows.filter((row) => row.status !== 'Verified').length, []);

  return (
    <div className="flex min-h-screen bg-[#F5F5ED]">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Header title="Asset Audit" subtitle="Review on-site asset conditions and resolve discrepancies" />

          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-6">
              <AuditHeader />
              <AuditOverview />
              <AuditTable rows={auditRows} />
            </div>

            <div className="space-y-6">
              <AuditSummary flaggedCount={flaggedCount} />
              <AuditActions />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
