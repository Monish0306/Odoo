'use client';

interface NotificationSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const NotificationSearch = ({ value, onChange }: NotificationSearchProps) => {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search notifications"
      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 sm:w-56"
    />
  );
};

export default NotificationSearch;
