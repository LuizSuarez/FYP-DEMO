import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

export function StatusCard({ 
  item, 
  title, 
  subtitle, 
  status, 
  progress, 
  details = [], 
  actions = [],
  className = ""
}) {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': case 'processed': return 'text-green-600';
      case 'processing': case 'uploading': return 'text-yellow-600';
      case 'failed': case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBadgeVariant = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': case 'processed': return 'success';
      case 'processing': case 'uploading': return 'warning';
      case 'failed': case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className={`transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
          </div>
          {status && (
            <Badge variant={getBadgeVariant(status)}>
              {status}
            </Badge>
          )}
        </div>

        {progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {details.length > 0 && (
          <div className="space-y-2 mb-4">
            {details.map((detail, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{detail.label}</span>
                <span className="font-medium">{detail.value}</span>
              </div>
            ))}
          </div>
        )}

        {actions.length > 0 && (
          <div className="flex space-x-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${action.className || 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}