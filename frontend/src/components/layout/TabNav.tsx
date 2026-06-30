'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PenLine, FileText, Clock, Settings } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Create', icon: PenLine },
  { href: '/drafts', label: 'Drafts', icon: FileText },
  { href: '/history', label: 'History', icon: Clock },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6">
      {tabs.map((tab) => {
        const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative flex items-center gap-1.5 pb-3 text-[13px] font-medium transition-colors duration-200 ${
              isActive
                ? 'text-white'
                : 'text-white/35 hover:text-white/60'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-purple-400" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
