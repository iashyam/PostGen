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
      className={`rounded-md p-1.5 transition-colors ${
        active
          ? 'bg-primary-600 text-white'
          : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
      } ${className}`}
    >
      {children}
    </button>
  );
}
