import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Users, Stethoscope, FlaskConical } from "lucide-react";

const roleConfig = {
  patient: { label: "Patient", icon: Users, color: "bg-blue-500" },
  clinician: { label: "Clinician", icon: Stethoscope, color: "bg-green-500" },
  admin: { label: "Admin", icon: FlaskConical, color: "bg-purple-500" }
};

export function RoleSwitcher({ currentRole, onRoleChange }) {
  return (
    <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Switch Role:</span>
      {Object.entries(roleConfig).map(([role, config]) => {
        const Icon = config.icon;
        const isActive = currentRole === role;
        
        return (
          <Button
            key={role}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onRoleChange(role)}
            className={`flex items-center space-x-1 transition-all duration-300 hover:scale-105 ${
              isActive ? `${config.color} text-white` : ""
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{config.label}</span>
            {isActive && <Badge variant="secondary" className="ml-1 text-xs">Active</Badge>}
          </Button>
        );
      })}
    </div>
  );
}