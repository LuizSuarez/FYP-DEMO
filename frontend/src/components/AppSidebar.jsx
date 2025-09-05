import { useState } from "react";
import { 
  Home, 
  Upload, 
  Dna, 
  Activity, 
  FileText, 
  Users, 
  Settings, 
  Stethoscope,
  BarChart3,
  Shield,
  Database,
  GitCompare,
  Brain,
  MapPin,
  MessageCircle,
  Target,
  FileCheck
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { filterNavigationByRole, USER_ROLES, permissions } from "../utils/roleBasedAccess";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../components/ui/sidebar";

// Genome File Upload & Management
const fileManagementItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home, requiredRoles: [] },
  { title: "Upload Genome Data", url: "/upload", icon: Upload, requiredRoles: [USER_ROLES.USER, USER_ROLES.CLINICIAN, USER_ROLES.ADMIN] },
  { title: "File Management", url: "/files", icon: FileText, requiredRoles: [USER_ROLES.USER, USER_ROLES.CLINICIAN, USER_ROLES.ADMIN] },
];

// Analysis & Processing Tools
const analysisItems = [
  { title: "Sequence Analyzer", url: "/analysis", icon: Dna, requiredRoles: [USER_ROLES.USER, USER_ROLES.CLINICIAN, USER_ROLES.ADMIN] },
  { title: "Variant Detection", url: "/variants", icon: Activity, requiredRoles: [USER_ROLES.USER, USER_ROLES.CLINICIAN, USER_ROLES.ADMIN] },
  { title: "Visualization Dashboard", url: "/visualizations", icon: BarChart3, requiredRoles: [USER_ROLES.USER, USER_ROLES.CLINICIAN, USER_ROLES.ADMIN] },
  { title: "Genome Comparison", url: "/comparison", icon: GitCompare, requiredRoles: [USER_ROLES.USER, USER_ROLES.CLINICIAN, USER_ROLES.ADMIN] },
  { title: "Gene Mapping", url: "/gene-mapping", icon: MapPin, requiredRoles: [USER_ROLES.CLINICIAN, USER_ROLES.ADMIN] },
];

// Predictions & Reports
const predictionItems = [
  { title: "Disease Risk Predictor", url: "/predictions", icon: Brain, requiredRoles: [USER_ROLES.USER, USER_ROLES.CLINICIAN, USER_ROLES.ADMIN] },
  { title: "Report Generator", url: "/reports", icon: FileCheck, requiredRoles: [USER_ROLES.CLINICIAN, USER_ROLES.ADMIN] },
  { title: "Reference Database", url: "/database", icon: Database, requiredRoles: [USER_ROLES.CLINICIAN, USER_ROLES.ADMIN] },
];

// Health & Lifestyle
const healthItems = [
  { title: "Lifestyle Tracker", url: "/lifestyle", icon: Target, requiredRoles: [USER_ROLES.USER, USER_ROLES.CLINICIAN, USER_ROLES.ADMIN] },
  { title: "Doctor Connect", url: "/doctor", icon: Stethoscope, requiredRoles: [USER_ROLES.USER] },
];

// Settings & Privacy
const settingsItems = [
  { title: "Privacy & Compliance", url: "/privacy", icon: Shield, requiredRoles: [] },
  { title: "Account Settings", url: "/settings", icon: Settings, requiredRoles: [] },
];

// Admin-only items
const adminItems = [
  { title: "User Management", url: "/admin/users", icon: Users, requiredRoles: [USER_ROLES.ADMIN] },
  { title: "System Logs", url: "/admin/logs", icon: FileText, requiredRoles: [USER_ROLES.ADMIN] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  
  // Filter navigation items based on user role
  const filteredFileManagement = filterNavigationByRole(fileManagementItems, user);
  const filteredAnalysisItems = filterNavigationByRole(analysisItems, user);
  const filteredPredictionItems = filterNavigationByRole(predictionItems, user);
  const filteredHealthItems = filterNavigationByRole(healthItems, user);
  const filteredSettingsItems = filterNavigationByRole(settingsItems, user);
  const filteredAdminItems = filterNavigationByRole(adminItems, user);

  const getNavCls = (isActive) =>
    isActive
      ? "flex items-center space-x-2 px-3 py-2 rounded-md bg-primary/10 text-primary font-medium border-r-2 border-primary"
      : "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-indigo-900/40 text-muted-foreground hover:text-blue-600 transition-colors duration-200";

  return (
    <Sidebar 
      className={`${collapsed ? "w-14" : "w-64"} bg-card text-foreground border-r`}
      collapsible="icon"
    >
      <SidebarContent>
        {filteredFileManagement.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase text-xs tracking-wider font-semibold text-muted-foreground">
              File Management
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredFileManagement.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={() => getNavCls(currentPath === item.url)}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredAnalysisItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase text-xs tracking-wider font-semibold text-muted-foreground">
              Analysis Tools
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredAnalysisItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={() => getNavCls(currentPath === item.url)}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredPredictionItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase text-xs tracking-wider font-semibold text-muted-foreground">
              Predictions & Reports
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredPredictionItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={() => getNavCls(currentPath === item.url)}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredHealthItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase text-xs tracking-wider font-semibold text-muted-foreground">
              Health & Support
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredHealthItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={() => getNavCls(currentPath === item.url)}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredAdminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase text-xs tracking-wider font-semibold text-muted-foreground">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredAdminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={() => getNavCls(currentPath === item.url)}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredSettingsItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase text-xs tracking-wider font-semibold text-muted-foreground">
              Settings
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredSettingsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={() => getNavCls(currentPath === item.url)}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}