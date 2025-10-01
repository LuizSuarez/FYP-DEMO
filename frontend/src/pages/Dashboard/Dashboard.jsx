import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { FloatingChatbot } from "../../components/FloatingChatbot";
import { Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { getDashboardData } from "../../components/dashboard/dashboardData";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { StatsGrid } from "../../components/dashboard/StatsGrid";
import { QuickActionButton } from "../../components/dashboard/QuickActionButton";
import { QuickActionsCard } from "../../components/dashboard/QuickActionsCard";
import { PatientContent } from "../../components/dashboard/UserContent";
import { ClinicianContent } from "../../components/dashboard/ClinicianContent";
import { AdminContent } from "../../components/dashboard/AdminContent";
import { useAuth } from "../../context/authContext";

export default function Dashboard() {
  const { loading, user } = useAuth();
  const userdata = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">No user data found. Please log in.</p>
        </div>
      </Layout>
    );
  }

  const userRole = user.role;
  const dashboardData = getDashboardData(userRole);

  console.log("User Role:", userRole);
  console.log("user data:", userdata);
  const renderRoleSpecificContent = () => {
    switch (userRole) {
      case 'user':
        return <PatientContent data={dashboardData} />;
      case 'Clinician':
        return <ClinicianContent data={dashboardData} />;
      case 'Admin':
        return <AdminContent data={dashboardData} />;
    }
  };

  const getHeaderActions = () => {
    if (userRole === 'user') {
      return [
        <Button key="upload" asChild className="dna-gradient">            
          <Link to="/upload"><Upload className="h-4 w-4 mr-2" />Upload Data</Link>
        </Button>
      ];
    }
    return [];
  };

  const getQuickActionsTitle = () => {
    switch (userRole) {
      case 'User':
        return "Quick Actions";
      case 'Clinician':
        return "Clinical Tools";
      case 'Admin':
        return "Admin Tools";
    }
  };

  const getQuickActionsDescription = () => {
    switch (userRole) {
      case 'User':
        return "Common tasks and next steps";
      case 'Clinician':
        return "Patient care and analysis tools";
      case 'Admin':
        return "Administrative tools and user management";
    }
  };

  const getWelcomeTitle = () => {
    const title = userRole === 'Clinician' ? 'Dr.' : '';
    const firstName = userdata.user?.name || "User";
    return `${dashboardData.title} ${title} ${firstName}`.trim();
  };

  const getWelcomeSubtitle = () => {
    let subtitle = dashboardData.subtitle;

    if (userRole === 'Clinician' && userdata?.license) {
      subtitle += ` • License: ${userdata.license}`;
    }

    if (userRole === 'Admin' && userdata?.institution) {
      subtitle += ` at ${userdata.institution}`;
    }
    
    return subtitle;
  };

  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6 max-w-7xl mx-auto">
        {/* Header - No Role Switcher */}
        <DashboardHeader
          title={getWelcomeTitle()}
          subtitle={getWelcomeSubtitle()}
          userData={userdata}
          actions={getHeaderActions()}
        />

        {/* Stats Overview */}
        <StatsGrid>
          {dashboardData.stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              descriptionColor={stat.descriptionColor}
            />
          ))}
        </StatsGrid>

        {/* Role-specific Content */}
        {renderRoleSpecificContent()}

        {/* Quick Actions */}
        <QuickActionsCard 
          title={getQuickActionsTitle()} 
          description={getQuickActionsDescription()}
        >
          {dashboardData.quickActions.map((action, index) => (
            <QuickActionButton
              key={index}
              to={action.to}
              icon={action.icon}
              label={action.label}
            />
          ))}
        </QuickActionsCard>
      </div>
      <FloatingChatbot />
    </Layout>
  );
}