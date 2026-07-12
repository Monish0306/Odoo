'use client';

import { AlertTriangle } from 'lucide-react';

interface AuditSummaryProps {
  flaggedCount: number;
}

const AuditSummary = ({ flaggedCount }: AuditSummaryProps) => {
  return (
    <section className="rounded-2xl border border-[#7AAACE]/20 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-[#FFF4E5] p-2 text-[#C97A00]">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#2E4F66]">Discrepancy Summary</p>
          <p className="text-xs text-gray-500">Auto-generated findings from the current audit</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[#7AAACE]/15 bg-[#F5F5ED] p-4">
        <p className="text-3xl font-bold text-[#2E4F66]">{flaggedCount} Assets Flagged</p>
        <p className="mt-2 text-sm text-gray-600">
          Generate discrepancy report automatically with the latest verification data.
        </p>
      </div>
    </section>
  );
};

export default AuditSummary;
