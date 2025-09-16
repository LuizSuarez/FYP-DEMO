import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function QuickActionsCard({ 
  title = "Quick Actions", 
  description = "Common tasks and next steps", 
  children,
  className = ""
}) {
  return (
    <Card className={`transform transition-all duration-300 hover:shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}