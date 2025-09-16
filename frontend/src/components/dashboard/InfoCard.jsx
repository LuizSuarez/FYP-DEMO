import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function InfoCard({ 
  title, 
  description, 
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
        {children}
      </CardContent>
    </Card>
  );
}