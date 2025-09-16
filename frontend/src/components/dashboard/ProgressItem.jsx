import { Progress } from "../ui/progress";

export function ProgressItem({ 
  label, 
  value, 
  target, 
  progress, 
  icon: Icon,
  className = ""
}) {
  return (
    <div className={`space-y-4 p-4 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:scale-105 dark:hover:bg-blue-900/20 ${className}`}>
      <div className="flex items-center space-x-2">
        {Icon && (
          <Icon className="h-5 w-5 text-blue-600 transition-transform duration-300 hover:scale-110" />
        )}
        <span className="font-medium">{label}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-sm text-gray-600">{target}</span>
        </div>
        <Progress value={progress} className="transition-all duration-300 hover:scale-105" />
      </div>
    </div>
  );
}