import React, { createContext, useContext, useState, useCallback, useMemo, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Sidebar context
const SidebarContext = createContext(null);
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

// SidebarProvider
export const SidebarProvider = forwardRef(({ defaultOpen = true, children, ...props }, ref) => {
  const [open, setOpen] = useState(defaultOpen);
  const toggleSidebar = useCallback(() => setOpen(o => !o), []);
  const state = open ? "expanded" : "collapsed";

  const value = useMemo(() => ({ open, setOpen, toggleSidebar, state }), [open, toggleSidebar, state]);

  return (
    <SidebarContext.Provider value={value}>
      <div ref={ref} {...props}>{children}</div>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

// Main Sidebar container
export const Sidebar = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col h-full bg-sidebar text-sidebar-foreground", className)} {...props}>
    {children}
  </div>
));
Sidebar.displayName = "Sidebar";

// SidebarTrigger
export const SidebarTrigger = forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button ref={ref} onClick={toggleSidebar} variant="ghost" size="icon" className={cn("h-7 w-7", className)} {...props}>
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

// Sidebar content
export const SidebarContent = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 flex flex-col p-2", className)} {...props}>
    {children}
  </div>
));
SidebarContent.displayName = "SidebarContent";

// Sidebar groups
export const SidebarGroup = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("mb-4", className)} {...props}>{children}</div>
));
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("text-xs font-semibold uppercase mb-2 px-2 text-muted-foreground", className)} {...props}>
    {children}
  </div>
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1", className)} {...props}>
    {children}
  </div>
));
SidebarGroupContent.displayName = "SidebarGroupContent";

// Sidebar menu & items
export const SidebarMenu = forwardRef(({ children, className, ...props }, ref) => (
  <nav ref={ref} className={cn("flex flex-col space-y-1", className)} {...props}>
    {children}
  </nav>
));
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn("group", className)} {...props}>
    {children}
  </div>
));
SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarMenuButton = forwardRef(({ asChild = false, children, className, ...props }, ref) => {
  if (asChild) {
    return (
      <div ref={ref} className={cn("flex items-center gap-2 w-full px-2 py-1 text-sm rounded hover:bg-muted/50 transition", className)}>
        {children}
      </div>
    );
  }
  return (
    <button ref={ref} className={cn("flex items-center gap-2 w-full px-2 py-1 text-sm rounded hover:bg-muted/50 transition", className)} {...props}>
      {children}
    </button>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";
