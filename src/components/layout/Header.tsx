import React from 'react';
import {  LogOut } from 'lucide-react';
import { ThemeToggle } from '../shared/ThemeToggle';

interface HeaderProps {
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSignOut }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-6 flex justify-end items-center">
       
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