'use client';

import { ShieldCheck } from 'lucide-react';

const AuditHeader = () => {
  return (
    <section className="rounded-2xl border border-[#7AAACE]/20 bg-[#2E4F66] p-6 text-white shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#9ED8FF]">
            Current audit session
          </p>
          <h2 className="text-2xl font-semibold">Quarterly Inventory Review</h2>
          <p className="mt-2 text-sm text-[#DCE9F3]">
            Track asset condition, verify locations, and flag inconsistencies in one place.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3">
          <ShieldCheck className="h-5 w-5 text-[#9ED8FF]" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#9ED8FF]">Audit date</p>
            <p className="text-sm font-medium">12 Jul 2026</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuditHeader;
