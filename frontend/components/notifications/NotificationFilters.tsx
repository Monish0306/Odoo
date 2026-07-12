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
      className="rounded-xl border border-[#7AAACE]/20 bg-white px-4 py-2 text-sm text-[#2E4F66] outline-none focus:border-[#9ED8FF]"
    >
      {types.map((type) => (
        <option key={type} value={type} className="bg-white text-[#2E4F66]">
          {type === 'All' ? 'Filter by Type' : type}
        </option>
      ))}
    </select>
  );
};

export default NotificationFilters;
