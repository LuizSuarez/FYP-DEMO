"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Notification } from "@/components/Notification";
import { Dna } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/authContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ withSidebar = false }) => {
  const [hidden] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const DnaLogo = () => (
    <div className="w-10 h-10 rounded-xl dna-gradient p-2.5 transition-transform duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">
      <Dna className="h-full w-full text-white" />
    </div>
  );

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: hidden ? -80 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="h-16 sticky top-0 z-50 shadow-sm 
                 backdrop-blur-md 
                 bg-gradient-to-r from-teal-900/70 via-teal-800/70 to-cyan-800/70 dark:bg-card/50
                 dark:bg-gradient-to-r dark:from-gray-900/60 dark:via-teal-900/60 dark:to-teal-900/60"
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Sidebar + Logo */}
        <div className="flex items-center space-x-4 flex-1">
          {withSidebar && <SidebarTrigger />}
          <div className="flex items-center space-x-2 cursor-pointer">
            <DnaLogo />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-400">
              DNAlytics
            </span>
          </div>
        </div>

        {/* Middle: Navigation Links (always centered) */}
        <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
          <Link
            to="/"
            className="text-white hover:text-indigo-400 transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-indigo-400 transition-colors font-medium"
          >
            About
          </Link>
          <Link
            to="/services"
            className="text-white hover:text-indigo-400 transition-colors font-medium"
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-indigo-400 transition-colors font-medium"
          >
            Contact
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          {/* Theme toggle stays always visible */}
          <ThemeToggle />
          {/* ✅ Only show Notification + Profile if user logged in */}
          {user ? (
            <>
              <Notification />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={user.avatar || "/avatars/user.png"}
                      alt="User"
                    />
                    <AvatarFallback>
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500" onClick={() => {
                    logout();
                    navigate("/");
                  }}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full text-white hover:bg-gradient-to-r hover:from-cyan-600 hover:to-teal-600 hover:text-white
             dark:hover:from-teal-700 dark:hover:to-cyan-700 transition-colors duration-300
               shadow-sm hover:shadow-md"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 rounded-full text-white hover:bg-gradient-to-r hover:from-cyan-600 hover:to-teal-600 hover:text-white
             dark:hover:from-teal-700 dark:hover:to-cyan-700 
               transition-colors duration-300 shadow-sm hover:shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}

        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
