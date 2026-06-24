import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'Create Post' },
  { to: '/drafts', label: 'Drafts' },
  { to: '/history', label: 'History' },
  { to: '/settings', label: 'Settings' },
];

export default function TabNav() {
  return (
    <nav className="mx-auto flex max-w-7xl gap-1 px-4">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            `rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
