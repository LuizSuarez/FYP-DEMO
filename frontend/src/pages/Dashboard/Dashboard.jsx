import { Layout } from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { FloatingChatbot } from "../../components/FloatingChatbot";
import { Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserRole } from "../../hooks/useUserRole";
import { getDashboardData } from "../../components/dashboard/dashboardData";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { StatsGrid } from "../../components/dashboard/StatsGrid";
import { QuickActionButton } from "../../components/dashboard/QuickActionButton";
import { QuickActionsCard } from "../../components/dashboard/QuickActionsCard";
import { PatientContent } from "../../components/dashboard/PatientContent";
import { ClinicianContent } from "../../components/dashboard/ClinicianContent";
import { ResearcherContent } from "../../components/dashboard/ResearcherContent";
import { useAuth } from "../../context/authContext";

export default function Dashboard() {
  const { userRole, loading } = useUserRole();
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

  const dashboardData = getDashboardData(userRole);

  const renderRoleSpecificContent = () => {
    switch (userRole) {
      case 'clinician':
        return <ClinicianContent data={dashboardData} />;
      case 'researcher':
        return <ResearcherContent data={dashboardData} />;
      default:
        return <PatientContent data={dashboardData} />;
    }
  };

  const getHeaderActions = () => {
    if (userRole === 'patient') {
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
      case 'clinician':
        return "Clinical Tools";
      case 'researcher':
        return "Research Tools";
      default:
        return "Quick Actions";
    }
  };

  const getQuickActionsDescription = () => {
    switch (userRole) {
      case 'clinician':
        return "Patient care and analysis tools";
      case 'researcher':
        return "Advanced analysis and collaboration tools";
      default:
        return "Common tasks and next steps";
    }
  };

  const getWelcomeTitle = () => {
    const title = userRole === 'clinician' ? 'Dr.' : '';
    console.log(userdata);
    const firstName = userdata.user.name;
    return `${dashboardData.title} ${title} ${firstName}`.trim();
  };

  const getWelcomeSubtitle = () => {
    let subtitle = dashboardData.subtitle;
    
    if (userRole === 'clinician' && userdata?.license) {
      subtitle += ` • License: ${userdata.license}`;
    }
    
    if (userRole === 'researcher' && userdata?.institution) {
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