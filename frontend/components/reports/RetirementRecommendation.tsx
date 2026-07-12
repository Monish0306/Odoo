'use client';

const RetirementRecommendation = () => {
  return (
    <section className="rounded-2xl border border-[#7AAACE]/20 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#2E4F66]">Asset Retirement Recommendation</h3>
        <p className="text-sm text-gray-600">Suggested replacements based on age and maintenance cost</p>
      </div>

      <div className="rounded-xl border border-[#7AAACE]/15 bg-[#F5F5ED] p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#2E4F66]">Laptop AF-002</p>
            <p className="mt-1 text-sm text-gray-600">Age: 6 years</p>
            <p className="text-sm text-gray-600">Maintenance Cost: High</p>
          </div>
          <span className="rounded-full bg-[#EAF6FF] px-3 py-1 text-xs font-semibold text-[#2E4F66]">
            Replace
          </span>
        </div>
      </div>
    </section>
  );
};

export default RetirementRecommendation;
