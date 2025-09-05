"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Notification } from "@/components/Notification";
import { Dna } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = ({ withSidebar = false }) => {
  const [hidden] = useState(false);

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
        <div className="flex items-center space-x-4">
          {withSidebar && <SidebarTrigger />}
          <div className="flex items-center space-x-2 cursor-pointer">
            <DnaLogo />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-400">
              DNAlytics
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          <Notification />
          <ThemeToggle />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="/avatars/user.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};
