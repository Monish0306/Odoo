'use client';

import { BellRing, CheckCircle2, ClipboardCheck, CalendarCheck2, Truck, AlertTriangle, ShieldAlert, Boxes, XCircle } from 'lucide-react';
import type { NotificationItem, NotificationType } from '@/components/notifications/Notifications';

interface NotificationCardProps {
  item: NotificationItem;
  onMarkRead: (id: number) => void;
}

const iconMap: Record<NotificationType, JSX.Element> = {
  'Maintenance Approved': <CheckCircle2 className="h-5 w-5" />,
  'Booking Confirmed': <CalendarCheck2 className="h-5 w-5" />,
  'Transfer Approved': <Truck className="h-5 w-5" />,
  'Overdue Return': <AlertTriangle className="h-5 w-5" />,
  'Audit Discrepancy': <ShieldAlert className="h-5 w-5" />,
  'Warranty Expired': <ClipboardCheck className="h-5 w-5" />,
  'Low Stock': <Boxes className="h-5 w-5" />,
  'Booking Cancelled': <XCircle className="h-5 w-5" />,
};

const priorityClasses: Record<NotificationItem['priority'], string> = {
  High: 'text-rose-400',
  Medium: 'text-amber-400',
  Low: 'text-emerald-400',
};

const NotificationCard = ({ item, onMarkRead }: NotificationCardProps) => {
  return (
    <article className={`rounded-2xl border p-4 shadow-sm ${item.unread ? 'border-sky-500/30 bg-[#F5F5ED]' : 'border-[#7AAACE]/20 bg-white'}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 rounded-xl p-2 ${item.unread ? 'bg-sky-500/10 text-sky-500' : 'bg-[#EAF6FF] text-[#2E4F66]'}`}>
          {iconMap[item.type]}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#2E4F66]">{item.title}</h3>
                {item.unread && <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />}
              </div>
              <p className="mt-1 text-sm text-gray-600">{item.description}</p>
            </div>
            <button
              onClick={() => onMarkRead(item.id)}
              className="rounded-full border border-[#7AAACE]/20 bg-white px-3 py-1 text-xs font-medium text-[#2E4F66] transition hover:bg-[#F5F5ED]"
            >
              Mark Read
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
            <span>{item.timestamp}</span>
            <div className="flex items-center gap-3">
              <span className={`font-medium ${priorityClasses[item.priority]}`}>{item.priority} Priority</span>
              <span className="rounded-full bg-[#F5F5ED] px-2.5 py-1 text-sm text-[#2E4F66]">{item.type}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NotificationCard;
