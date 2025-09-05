import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';

export const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile menu button */}
        <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files, analyses, or genes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};