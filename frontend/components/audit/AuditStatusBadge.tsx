'use client';

interface AuditStatusBadgeProps {
  status: 'Verified' | 'Missing' | 'Damaged' | 'Mismatch';
}

const statusClasses: Record<AuditStatusBadgeProps['status'], string> = {
  Verified: 'bg-emerald-100 text-emerald-700',
  Missing: 'bg-rose-100 text-rose-700',
  Damaged: 'bg-amber-100 text-amber-700',
  Mismatch: 'bg-sky-100 text-sky-700',
};

const AuditStatusBadge = ({ status }: AuditStatusBadgeProps) => {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

export default AuditStatusBadge;
