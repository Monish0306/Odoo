'use client';

import { useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import NotificationHeader from '@/components/notifications/NotificationHeader';
import NotificationTabs from '@/components/notifications/NotificationTabs';
import NotificationFilters from '@/components/notifications/NotificationFilters';
import NotificationSearch from '@/components/notifications/NotificationSearch';
import NotificationList from '@/components/notifications/NotificationList';

export type NotificationType =
  | 'Maintenance Approved'
  | 'Booking Confirmed'
  | 'Transfer Approved'
  | 'Overdue Return'
  | 'Audit Discrepancy'
  | 'Warranty Expired'
  | 'Low Stock'
  | 'Booking Cancelled';

export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  priority: 'High' | 'Medium' | 'Low';
  unread: boolean;
  category: 'Alerts' | 'Approvals' | 'Bookings' | 'All';
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: 'Maintenance Approved',
    title: 'Maintenance Approved',
    description: 'Routine servicing for the Dell laptop has been approved.',
    timestamp: '2 mins ago',
    priority: 'Medium',
    unread: true,
    category: 'Approvals',
  },
  {
    id: 2,
    type: 'Booking Confirmed',
    title: 'Booking Confirmed',
    description: 'Conference room booking for 4 PM is now confirmed.',
    timestamp: '15 mins ago',
    priority: 'Low',
    unread: true,
    category: 'Bookings',
  },
  {
    id: 3,
    type: 'Transfer Approved',
    title: 'Transfer Approved',
    description: 'Asset transfer from Finance to Operations has been approved.',
    timestamp: '1 hour ago',
    priority: 'High',
    unread: false,
    category: 'Approvals',
  },
  {
    id: 4,
    type: 'Overdue Return',
    title: 'Overdue Return',
    description: 'The projector borrowed by Sales is now overdue by 3 days.',
    timestamp: '3 hours ago',
    priority: 'High',
    unread: true,
    category: 'Alerts',
  },
  {
    id: 5,
    type: 'Audit Discrepancy',
    title: 'Audit Discrepancy',
    description: 'Location mismatch detected for Monitor AF-0174.',
    timestamp: '5 hours ago',
    priority: 'High',
    unread: true,
    category: 'Alerts',
  },
  {
    id: 6,
    type: 'Warranty Expired',
    title: 'Warranty Expired',
    description: 'Warranty for Printer AF-0219 expired last week.',
    timestamp: 'Yesterday',
    priority: 'Medium',
    unread: false,
    category: 'Alerts',
  },
  {
    id: 7,
    type: 'Low Stock',
    title: 'Low Stock',
    description: 'Keyboard stock is below the minimum threshold.',
    timestamp: 'Yesterday',
    priority: 'Medium',
    unread: true,
    category: 'Alerts',
  },
  {
    id: 8,
    type: 'Booking Cancelled',
    title: 'Booking Cancelled',
    description: 'Training room booking for today has been cancelled.',
    timestamp: '2 days ago',
    priority: 'Low',
    unread: false,
    category: 'Bookings',
  },
];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<'All' | 'Alerts' | 'Approvals' | 'Bookings'>('All');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | NotificationType>('All');
  const [items, setItems] = useState(initialNotifications);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTab = activeTab === 'All' || item.category === activeTab;
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'All' || item.type === typeFilter;

      return matchesTab && matchesSearch && matchesType;
    });
  }, [activeTab, items, search, typeFilter]);

  const unreadCount = items.filter((item) => item.unread).length;

  const markAllRead = () => {
    setItems((current) => current.map((item) => ({ ...item, unread: false })));
  };

  const markOneRead = (id: number) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, unread: false } : item)));
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5ED]">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <Header title="Activity Log & Notifications" subtitle="Stay informed on approvals, bookings, alerts, and asset updates" />

          <div className="mb-6 rounded-2xl border border-[#7AAACE]/20 bg-white p-5 shadow-sm">
            <NotificationHeader unreadCount={unreadCount} onMarkAllRead={markAllRead} />
            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <NotificationTabs activeTab={activeTab} onChange={setActiveTab} />
              <div className="flex flex-col gap-3 sm:flex-row">
                <NotificationSearch value={search} onChange={setSearch} />
                <NotificationFilters value={typeFilter} onChange={setTypeFilter} />
              </div>
            </div>
          </div>

          <NotificationList items={filteredItems} onMarkRead={markOneRead} />
        </div>
      </main>
    </div>
  );
}
