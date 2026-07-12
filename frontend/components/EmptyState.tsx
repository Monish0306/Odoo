'use client';

const EmptyState = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-[#2E4F66] mb-2" style={{ fontFamily: 'Sentient, serif' }}>
      {title}
    </h3>
    <p className="text-sm text-gray-600 max-w-sm">{description}</p>
  </div>
);

export default EmptyState;
