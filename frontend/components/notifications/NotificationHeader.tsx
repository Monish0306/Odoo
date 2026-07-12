'use client';

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
}

const NotificationHeader = ({ unreadCount, onMarkAllRead }: NotificationHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        <p className="text-sm text-slate-400">{unreadCount} unread notifications</p>
      </div>
      <button
        onClick={onMarkAllRead}
        className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-500 hover:text-white"
      >
        Mark All Read
      </button>
    </div>
  );
};

export default NotificationHeader;
