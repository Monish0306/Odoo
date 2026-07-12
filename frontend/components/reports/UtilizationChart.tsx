'use client';

const departments = [
  { name: 'IT', value: 82 },
  { name: 'Finance', value: 68 },
  { name: 'HR', value: 74 },
  { name: 'Operations', value: 91 },
  { name: 'Sales', value: 57 },
];

const UtilizationChart = () => {
  return (
    <section className="rounded-2xl border border-[#7AAACE]/20 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#2E4F66]">Asset Utilization Chart</h3>
        <p className="text-sm text-gray-600">Department-wise usage percentage</p>
      </div>

      <div className="flex h-64 items-end justify-between gap-3 rounded-xl bg-[#F5F5ED] p-4">
        {departments.map((dept) => (
          <div key={dept.name} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-44 w-full items-end justify-center rounded-lg bg-[#EAF6FF] p-2">
              <div
                className="w-full rounded-md bg-[#2E4F66]"
                style={{ height: `${dept.value}%` }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#2E4F66]">{dept.name}</p>
              <p className="text-xs text-gray-600">{dept.value}%</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UtilizationChart;
