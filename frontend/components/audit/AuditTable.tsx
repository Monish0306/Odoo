'use client';

import AuditStatusBadge from '@/components/audit/AuditStatusBadge';

interface AuditRow {
  id: string;
  name: string;
  expectedLocation: string;
  actualLocation: string;
  status: 'Verified' | 'Missing' | 'Damaged' | 'Mismatch';
}

interface AuditTableProps {
  rows: AuditRow[];
}

const AuditTable = ({ rows }: AuditTableProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#7AAACE]/20 bg-white shadow-sm">
      <div className="border-b border-[#7AAACE]/20 bg-[#F5F5ED] px-6 py-4">
        <h3 className="text-lg font-semibold text-[#2E4F66]">Asset verification table</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#7AAACE]/20 bg-white/70 text-[#2E4F66]">
              <th className="px-6 py-4 font-semibold">Asset ID</th>
              <th className="px-6 py-4 font-semibold">Asset Name</th>
              <th className="px-6 py-4 font-semibold">Expected Location</th>
              <th className="px-6 py-4 font-semibold">Actual Location</th>
              <th className="px-6 py-4 font-semibold">Verification Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#7AAACE]/15">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-[#F5F5ED]">
                <td className="px-6 py-4 font-medium text-[#2E4F66]">{row.id}</td>
                <td className="px-6 py-4 text-gray-700">{row.name}</td>
                <td className="px-6 py-4 text-gray-700">{row.expectedLocation}</td>
                <td className="px-6 py-4 text-gray-700">{row.actualLocation}</td>
                <td className="px-6 py-4">
                  <AuditStatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AuditTable;
