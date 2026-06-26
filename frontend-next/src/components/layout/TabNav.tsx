'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Create Post' },
  { href: '/drafts', label: 'Drafts' },
  { href: '/history', label: 'History' },
  { href: '/settings', label: 'Settings' },
];

export default function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex max-w-7xl gap-1 px-4">
      {tabs.map((tab) => {
        const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
