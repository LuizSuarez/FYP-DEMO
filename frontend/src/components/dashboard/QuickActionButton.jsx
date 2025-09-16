import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export function QuickActionButton({ 
  to, 
  icon: Icon, 
  label, 
  className = "" 
}) {
  return (
    <Button 
      variant="outline" 
      className={`h-auto p-6 flex flex-col items-center space-y-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 hover:-translate-y-1 ${className}`} 
      asChild
    >
      <Link to={to}>
        <Icon className="h-8 w-8" />
        <span>{label}</span>
      </Link>
    </Button>
  );
}