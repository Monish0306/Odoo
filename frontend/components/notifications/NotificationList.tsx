'use client';

import NotificationCard from '@/components/notifications/NotificationCard';
import type { NotificationItem } from '@/components/notifications/Notifications';

interface NotificationListProps {
  items: NotificationItem[];
  onMarkRead: (id: number) => void;
}

const NotificationList = ({ items, onMarkRead }: NotificationListProps) => {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-400 shadow-sm">
        No notifications match your current filters.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <NotificationCard key={item.id} item={item} onMarkRead={onMarkRead} />
      ))}
    </div>
  );
};

export default NotificationList;
