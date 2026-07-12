'use client';

interface NotificationTabsProps {
  activeTab: 'All' | 'Alerts' | 'Approvals' | 'Bookings';
  onChange: (tab: 'All' | 'Alerts' | 'Approvals' | 'Bookings') => void;
}

const tabs: Array<{ label: NotificationTabsProps['activeTab']; value: NotificationTabsProps['activeTab'] }> = [
  { label: 'All', value: 'All' },
  { label: 'Alerts', value: 'Alerts' },
  { label: 'Approvals', value: 'Approvals' },
  { label: 'Bookings', value: 'Bookings' },
];

const NotificationTabs = ({ activeTab, onChange }: NotificationTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === tab.value
              ? 'bg-[#2E4F66] text-white'
              : 'bg-white border border-[#7AAACE]/20 text-[#2E4F66] hover:bg-[#F5F5ED]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default NotificationTabs;
