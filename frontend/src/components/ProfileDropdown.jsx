import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { User, Settings, LogOut, FileText, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function ProfileDropdown({ userData }) {
  const navigate = useNavigate();

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userData");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-blue-50 transition-colors duration-200">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="!bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
            {userData && userData.firstName && userData.lastName 
            ? getInitials(userData.firstName, userData.lastName)
            : <User className="h-4 w-4" />
              }
         </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userData ? `${userData.firstName} ${userData.lastName}` : "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData?.email || "user@example.com"}
            </p>
            <p className="text-xs leading-none text-muted-foreground capitalize">
              {userData?.userType || "user"} account
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="hover:bg-purple-50 transition-colors duration-200">
          <Link to="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="hover:bg-green-50 transition-colors duration-200">
          <Link to="/privacy" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            <span>Privacy & Security</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="hover:bg-gray-50 transition-colors duration-200">
          <Link to="/reports" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            <span>My Reports</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          onClick={handleLogout}
          className="hover:bg-red-50 text-red-600 transition-colors duration-200"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
