'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ReportsHeader from '@/components/reports/ReportsHeader';
import UtilizationChart from '@/components/reports/UtilizationChart';
import MaintenanceChart from '@/components/reports/MaintenanceChart';
import MostUsedAssets from '@/components/reports/MostUsedAssets';
import IdleAssets from '@/components/reports/IdleAssets';
import RetirementRecommendation from '@/components/reports/RetirementRecommendation';
import ExportReportButton from '@/components/reports/ExportReportButton';

export default function Reports() {
  return (
    <div className="flex min-h-screen bg-[#F5F5ED]">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <Header title="Reports & Analytics" subtitle="Track asset performance, utilization, and maintenance insights" />

          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <ReportsHeader />
            <ExportReportButton />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <UtilizationChart />
              <MaintenanceChart />
            </div>

            <div className="space-y-6">
              <MostUsedAssets />
              <IdleAssets />
              <RetirementRecommendation />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
