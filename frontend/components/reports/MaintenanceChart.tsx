'use client';

const monthlyData = [18, 24, 21, 29, 27, 35, 31, 33, 30, 28, 26, 32];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MaintenanceChart = () => {
  const max = Math.max(...monthlyData);

  return (
    <section className="rounded-2xl border border-[#7AAACE]/20 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#2E4F66]">Maintenance Frequency</h3>
        <p className="text-sm text-gray-600">Monthly maintenance activity</p>
      </div>

      <div className="rounded-xl bg-[#F5F5ED] p-4">
        <div className="flex h-56 items-end justify-between gap-2">
          {monthlyData.map((value, index) => (
            <div key={months[index]} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-44 w-full items-end justify-center rounded-lg bg-[#EAF6FF] p-1">
                <div
                  className="w-full rounded-md bg-[#7AAACE]"
                  style={{ height: `${(value / max) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600">{months[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MaintenanceChart;
