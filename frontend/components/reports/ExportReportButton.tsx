'use client';

import { Download } from 'lucide-react';

const ExportReportButton = () => {
  return (
    <button className="flex items-center justify-center gap-2 rounded-xl bg-[#2E4F66] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f394d]">
      <Download className="h-4 w-4" />
      Export Report
    </button>
  );
};

export default ExportReportButton;
