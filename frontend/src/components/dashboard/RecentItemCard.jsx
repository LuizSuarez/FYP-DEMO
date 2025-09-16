import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export function RecentItemCard({ 
  title, 
  description, 
  items = [], 
  viewAllLink, 
  viewAllText = "View All",
  className = "" 
}) {
  return (
    <Card className={`transform transition-all duration-300 hover:shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className={item.className || "flex items-center justify-between p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:scale-102 hover:bg-blue-50 dark:hover:bg-blue-900/20"}>
              {item.content}
            </div>
          ))}
          {viewAllLink && (
            <Button variant="outline" className="w-full transform transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95" asChild>
              <Link to={viewAllLink}>{viewAllText}</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}