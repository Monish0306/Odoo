'use client';

import { UserRound, MapPin, ClipboardCheck } from 'lucide-react';

const details = [
  { label: 'Auditor', value: 'Ava Patel', icon: UserRound },
  { label: 'Location', value: 'Bengaluru HQ', icon: MapPin },
  { label: 'Verified', value: '3 of 5', icon: ClipboardCheck },
];

const AuditOverview = () => {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {details.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-2xl border border-[#7AAACE]/20 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#EAF6FF] p-2 text-[#2E4F66]">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{label}</p>
              <p className="font-semibold text-[#2E4F66]">{value}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default AuditOverview;
