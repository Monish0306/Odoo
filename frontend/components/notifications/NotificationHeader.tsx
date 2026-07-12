'use client';

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
}

const NotificationHeader = ({ unreadCount, onMarkAllRead }: NotificationHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-[#2E4F66]">Recent Activity</h2>
        <p className="text-sm text-gray-600">{unreadCount} unread notifications</p>
      </div>
      <button
        onClick={onMarkAllRead}
        className="rounded-xl border border-[#7AAACE]/20 bg-white px-4 py-2 text-sm font-medium text-[#2E4F66] transition hover:border-[#2E4F66] hover:text-[#2E4F66]"
      >
        Mark All Read
      </button>
    </div>
  );
};

export default NotificationHeader;
