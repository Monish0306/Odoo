'use client';

const assets = [
  { name: 'Dell Latitude 7420', hours: '184h' },
  { name: 'HP LaserJet Pro', hours: '162h' },
  { name: 'Lenovo ThinkPad', hours: '148h' },
  { name: 'Cisco Router', hours: '135h' },
  { name: 'Projector X100', hours: '128h' },
];

const MostUsedAssets = () => {
  return (
    <section className="rounded-2xl border border-[#7AAACE]/20 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#2E4F66]">Most Used Assets</h3>
        <p className="text-sm text-gray-600">Top 5 assets by usage hours</p>
      </div>

      <div className="space-y-3">
        {assets.map((asset, index) => (
          <div key={asset.name} className="flex items-center justify-between rounded-xl border border-[#7AAACE]/15 bg-[#F5F5ED] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2E4F66] text-sm font-semibold text-white">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-[#2E4F66]">{asset.name}</span>
            </div>
            <span className="text-sm text-gray-600">{asset.hours}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MostUsedAssets;
