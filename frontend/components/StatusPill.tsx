'use client';

interface StatusPillProps {
  status: 'Available' | 'Allocated' | 'Reserved' | 'Maintenance' | 'Lost';
}

const StatusPill = ({ status }: StatusPillProps) => {
  const statusConfig: Record<string, { bg: string; text: string }> = {
    Available: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    Allocated: { bg: 'bg-blue-100', text: 'text-blue-700' },
    Reserved: { bg: 'bg-violet-100', text: 'text-violet-700' },
    Maintenance: { bg: 'bg-amber-100', text: 'text-amber-700' },
    Lost: { bg: 'bg-rose-100', text: 'text-rose-700' },
  };

  const config = statusConfig[status] || statusConfig.Available;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
};

export default StatusPill;
