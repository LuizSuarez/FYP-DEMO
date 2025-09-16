import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  className = "",
  valueColor = "text-gray-900 dark:text-white",
  descriptionColor = "text-gray-600 dark:text-gray-300"
}) {
  return (
    <Card className={`transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-gray-500 transition-transform duration-300 hover:scale-110" />
        )}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
        <p className={`text-xs ${descriptionColor}`}>{description}</p>
      </CardContent>
    </Card>
  );
}