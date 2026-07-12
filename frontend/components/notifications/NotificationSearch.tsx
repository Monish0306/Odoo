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
      className="w-full rounded-xl border border-[#7AAACE]/20 bg-white px-4 py-2 text-sm text-[#2E4F66] outline-none focus:border-[#9ED8FF] sm:w-56"
    />
  );
};

export default NotificationSearch;
