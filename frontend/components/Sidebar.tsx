'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building2,
  Package,
  ArrowRightLeft,
  Calendar,
  Wrench,
  FileText,
  BarChart3,
  Bell,
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const navGroups = [
    {
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      items: [
        { name: 'Organization setup', href: '/organization', icon: Building2 },
        { name: 'Assets', href: '/assets', icon: Package },
        { name: 'Allocation & Transfer', href: '/allocation', icon: ArrowRightLeft },
        { name: 'Resource Booking', href: '/booking', icon: Calendar },
        { name: 'Maintenance', href: '/maintenance', icon: Wrench },
      ],
    },
    {
      items: [
        { name: 'Audit', href: '/audit', icon: FileText },
        { name: 'Reports', href: '/reports', icon: BarChart3 },
        { name: 'Notifications', href: '/notifications', icon: Bell },
      ],
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="w-64 bg-[#2E4F66] text-white flex flex-col p-6 h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-8 tracking-tight" style={{ fontFamily: 'Sentient, serif' }}>
        AssetFlow
      </h1>

      {/* Navigation Groups */}
      <nav className="flex flex-col flex-1 gap-6">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group"
                  >
                    {/* Left accent bar for active state */}
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-[#9ED8FF] rounded-r"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Background highlight for active state */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-[#9ED8FF]/15 rounded-lg"
                        layoutId="active-bg"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Hover background for non-active states */}
                    <div
                      className={`absolute inset-0 rounded-lg transition-colors duration-200 ${
                        isActive ? '' : 'group-hover:bg-white/10'
                      }`}
                    />

                    {/* Icon and text */}
                    <Icon
                      className={`relative z-10 w-5 h-5 transition-colors duration-200 ${
                        isActive ? 'text-[#9ED8FF]' : 'text-white/60 group-hover:text-white/90'
                      }`}
                    />
                    <span
                      className={`relative z-10 transition-colors duration-200 ${
                        isActive ? 'text-white font-semibold' : 'text-white/70 group-hover:text-white'
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Divider between groups (not after last group) */}
            {groupIndex < navGroups.length - 1 && <div className="my-2 h-px bg-white/10" />}
          </div>
        ))}
      </nav>

      <div className="relative mt-6" ref={profileRef}>
        <button
          type="button"
          onClick={() => setIsProfileOpen((open) => !open)}
          className="flex w-full items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left transition hover:bg-white/15"
        >
          <div className="h-11 w-11 rounded-full bg-[#9ED8FF] flex items-center justify-center text-[#2E4F66] font-semibold">
            G
          </div>
          <div>
            <p className="text-sm font-semibold">Geetha M.</p>
            <p className="text-xs text-[#DCE9F3]/90">Admin</p>
          </div>
        </button>

        <AnimatePresence>
          {isProfileOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute bottom-full left-0 mb-3 w-full rounded-2xl border border-[#7AAACE]/20 bg-white p-4 text-slate-900 shadow-sm"
            >
              <div className="mb-4 rounded-xl bg-[#F5F5ED]/80 p-3">
                <p className="text-sm font-semibold text-[#2E4F66]">Geetha M.</p>
                <p className="text-xs text-gray-600">Admin</p>
                <p className="mt-2 text-xs text-gray-500">geetha@company.com</p>
                {/* TODO: Replace placeholder email with real authenticated user data once backend auth is connected. */}
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  router.push('/login');
                  // TODO: Add real sign-out/session clearing once backend auth is integrated.
                }}
                className="w-full rounded-xl border border-[#7AAACE]/20 bg-[#F5F5ED] px-4 py-2 text-sm font-semibold text-[#2E4F66] transition hover:bg-white"
              >
                Sign out
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default Sidebar;
