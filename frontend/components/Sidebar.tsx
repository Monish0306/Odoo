'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Organization setup', href: '/organization' },
    { name: 'Assets', href: '/assets' },
    { name: 'Allocation & Transfer', href: '/allocation' },
    { name: 'Resource Booking', href: '/booking' },
    { name: 'Maintenance', href: '/maintenance' },
    { name: 'Audit', href: '/audit' },
    { name: 'Reports', href: '/reports' },
    { name: 'Notifications', href: '/notifications' },
  ];

  return (
    <aside className="w-64 bg-[#2E4F66] text-white flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-12" style={{ fontFamily: 'Sentient, serif' }}>
        AssetFlow
      </h1>
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#9ED8FF] text-[#2E4F66] font-semibold'
                  : 'text-white hover:bg-[#7AAACE]/30'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
