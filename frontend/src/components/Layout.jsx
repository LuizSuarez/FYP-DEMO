import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Notification } from "@/components/Notification";
import { FloatingChatbot } from './FloatingChatbot';
import { Dna } from "lucide-react";
import Navbar from "./NavBar";

export const Layout = ({ children, showSidebar = true }) => {
  // DNA logo (consistent with Auth.jsx)
  const DnaLogo = () => (
    <div className="w-10 h-10 rounded-xl dna-gradient p-2.5 transition-transform duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">
      <Dna className="h-full w-full text-white" />
    </div>
  );

  if (!showSidebar) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
          <div className="flex items-center justify-between h-full px-6">
            {/* Left: Logo */}
            <div className="flex items-center space-x-2 cursor-pointer">
              <DnaLogo />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-400">
                DNAlytics
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
              <Notification />
              <ThemeToggle />
            </div>
          </div>
        </Navbar>
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Navbar className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div className="flex items-center space-x-2 cursor-pointer">
                  <DnaLogo />
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-400">
                    DNAlytics
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Notification />
                <ThemeToggle />
              </div>
            </div>
          </Navbar>
          <main className="flex-1">{children}</main>
          <FloatingChatbot />

        </div>
      </div>
    </SidebarProvider>
  );
};
