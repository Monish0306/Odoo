'use client';

import type { NotificationType } from '@/components/notifications/Notifications';

interface NotificationFiltersProps {
  value: 'All' | NotificationType;
  onChange: (value: 'All' | NotificationType) => void;
}

const types: Array<'All' | NotificationType> = [
  'All',
  'Maintenance Approved',
  'Booking Confirmed',
  'Transfer Approved',
  'Overdue Return',
  'Audit Discrepancy',
  'Warranty Expired',
  'Low Stock',
  'Booking Cancelled',
];

const NotificationFilters = ({ value, onChange }: NotificationFiltersProps) => {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as 'All' | NotificationType)}
      className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
    >
      {types.map((type) => (
        <option key={type} value={type} className="bg-slate-800 text-slate-100">
          {type === 'All' ? 'Filter by Type' : type}
        </option>
      ))}
    </select>
  );
};

export default NotificationFilters;
