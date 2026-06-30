'use client';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  title?: string;
  active?: boolean;
  className?: string;
}

export default function IconButton({ children, onClick, title, active, className = '' }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-lg p-1.5 transition-all duration-150 ${
        active
          ? 'bg-white/12 text-white'
          : 'text-white/30 hover:bg-white/[0.06] hover:text-white/60'
      } ${className}`}
    >
      {children}
    </button>
  );
}
