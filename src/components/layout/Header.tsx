import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import { ThemeToggle } from '../shared/ThemeToggle';

interface HeaderProps {
  onSignOut: () => void;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSignOut, toggleSidebar }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={onSignOut}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
};