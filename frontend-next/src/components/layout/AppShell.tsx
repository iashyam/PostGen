'use client';

import type { ReactNode } from 'react';
import TabNav from './TabNav';

interface Props {
  children: ReactNode;
}

export default function AppShell({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50" style={{
        background: 'rgba(12, 13, 18, 0.72)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        <div className="mx-auto max-w-7xl px-6 pt-5 pb-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold tracking-tight text-white">
              Post<span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">Gen</span>
            </h1>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400/80" />
              <span className="text-xs text-white/40">Ready</span>
            </div>
          </div>
          <TabNav />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
