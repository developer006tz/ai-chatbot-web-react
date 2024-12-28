import { NavLink } from 'react-router-dom';
import { ChatBubbleLeftIcon, ClockIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export function Sidebar() {
  const navigationItems = [
    { name: 'Chat', path: '/', icon: ChatBubbleLeftIcon },
    { name: 'History', path: '/history', icon: ClockIcon },
    { name: 'Settings', path: '/settings', icon: Cog6ToothIcon }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900">AI Chat</h1>
      </div>
      <nav className="space-y-1 px-3">
        {navigationItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <Icon className="h-5 w-5 mr-3" />
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}