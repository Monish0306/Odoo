'use client';

const idleAssets = [
  { id: 'AF-0034', name: 'Docking Station', days: '92 days' },
  { id: 'AF-0091', name: 'External Monitor', days: '81 days' },
  { id: 'AF-0112', name: 'Tablet', days: '74 days' },
];

const IdleAssets = () => {
  return (
    <section className="rounded-2xl border border-[#7AAACE]/20 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#2E4F66]">Idle Assets</h3>
        <p className="text-sm text-gray-600">Assets unused for more than 60 days</p>
      </div>

      <div className="space-y-3">
        {idleAssets.map((asset) => (
          <div key={asset.id} className="rounded-xl border border-[#7AAACE]/15 bg-[#FFF7E8] px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#2E4F66]">{asset.id}</p>
                <p className="text-sm text-gray-600">{asset.name}</p>
              </div>
              <span className="rounded-full bg-[#FDE7B4] px-3 py-1 text-xs font-semibold text-[#A35B00]">
                {asset.days}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IdleAssets;
