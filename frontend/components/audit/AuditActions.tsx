'use client';

import { FileText, CheckCircle2 } from 'lucide-react';

const AuditActions = () => {
  return (
    <section className="rounded-2xl border border-[#7AAACE]/20 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3">
        <button className="flex items-center justify-center gap-2 rounded-xl bg-[#2E4F66] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f394d]">
          <FileText className="h-4 w-4" />
          Generate Audit Report
        </button>
        <button className="flex items-center justify-center gap-2 rounded-xl border border-[#7AAACE]/30 bg-[#F5F5ED] px-4 py-3 text-sm font-semibold text-[#2E4F66] transition hover:bg-[#E9E6D8]">
          <CheckCircle2 className="h-4 w-4" />
          Complete Audit
        </button>
      </div>
    </section>
  );
};

export default AuditActions;
