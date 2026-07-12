'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  User,
  LogOut,
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

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
                    <div className={`absolute inset-0 rounded-lg transition-colors duration-200 ${
                      isActive ? '' : 'group-hover:bg-white/10'
                    }`} />

                    {/* Icon and text */}
                    <Icon className={`relative z-10 w-5 h-5 transition-colors duration-200 ${
                      isActive ? 'text-[#9ED8FF]' : 'text-white/60 group-hover:text-white/90'
                    }`} />
                    <span className={`relative z-10 transition-colors duration-200 ${
                      isActive ? 'text-white font-semibold' : 'text-white/70 group-hover:text-white'
                    }`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Divider between groups (not after last group) */}
            {groupIndex < navGroups.length - 1 && (
              <div className="my-2 h-px bg-white/10" />
            )}
          </div>
        ))}
      </nav>

      {/* User Profile Area */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#9ED8FF]/20 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-[#9ED8FF]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Geetha M.</p>
            <p className="text-xs text-white/60 truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
