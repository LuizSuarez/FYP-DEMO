import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';

export function SearchFilters({ 
  searchTerm, 
  setSearchTerm, 
  searchPlaceholder = "Search...",
  filters = [],
  actions = [],
  className = ""
}) {
  return (
    <Card className={`transform transition-all duration-300 hover:shadow-lg ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 transition-all duration-300 focus:scale-105"
            />
          </div>
          
          {/* Filters Dropdowns */}
          {filters.map((filter, index) => (
            <select
              key={index}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="
                px-3 py-2 border border-gray-300 rounded-md 
                bg-white text-gray-800 
                dark:bg-gray-800 dark:text-gray-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500
              "
            >
              <option value="all" className="bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                {filter.placeholder}
              </option>
              {filter.options.map(option => (
                <option 
                  key={option.value} 
                  value={option.value}
                  className="bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                >
                  {option.label}
                </option>
              ))}
            </select>
          ))}

          {/* Action Buttons */}
          {actions.map((action, index) => (
            <Button 
              key={index}
              variant="outline" 
              onClick={action.onClick}
              className={action.className}
            >
              {action.icon && <action.icon className="h-4 w-4 mr-2" />}
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
