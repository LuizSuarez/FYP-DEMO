import React from 'react';
import { Button } from '../ui/button';

export function PageHeader({ 
  title, 
  subtitle, 
  actions = [], 
  className = "" 
}) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>}
      </div>
      {actions.length > 0 && (
        <div className="flex space-x-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "outline"}
              onClick={action.onClick}
              disabled={action.disabled}
              className={action.className || "bg-indigo-600 text-white hover:bg-indigo-700 transform transition-all duration-200 hover:scale-105"}
            >
              {action.icon && <action.icon className="h-4 w-4 mr-2" />}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}