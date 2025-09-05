import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ProfileDropdown } from "../components/ProfileDropdown"; 
import { FloatingChatbot } from "../components/FloatingChatbot";
import { Upload, FileText, Activity, Calendar, Dna, Heart, Target, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getMyFiles } from "../services/genomeService";
import { getMyAnalyses } from "../services/analysisService";
import { authService } from "../services/authService";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [recentFiles, setRecentFiles] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [stats, setStats] = useState({
    filesCount: 0,
    analysesCount: 0,
    riskAssessments: 0,
    healthScore: 85
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock risk predictions and lifestyle stats for now
  const riskPredictions = [
    { condition: "Type 2 Diabetes", risk: "Low", confidence: 94, color: "success" },
    { condition: "Cardiovascular Disease", risk: "Moderate", confidence: 87, color: "warning" },
    { condition: "Alzheimer's Disease", risk: "Low", confidence: 91, color: "success" }
  ];

  const lifestyleStats = [
    { metric: "Weekly Activity", value: "4/7", target: "7 days", progress: 57, icon: Activity },
    { metric: "Sleep Quality", value: "7.2h", target: "8h average", progress: 90, icon: Calendar },
    { metric: "Health Score", value: "85", target: "100 points", progress: 85, icon: Heart }
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      // Only proceed if user is authenticated
      if (!user || !localStorage.getItem('token')) {
        console.log('User not authenticated, skipping dashboard data load');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Load user data
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
        
        // Initialize with empty arrays
        let filesData = [];
        let analysesData = [];
        let fileStats = { total: 0 };
        
        // Try to load files data - don't fail if this doesn't work
        try {
          const filesResponse = await getMyFiles({ limit: 3, page: 1 });
          if (filesResponse && filesResponse.success) {
            filesData = filesResponse.data.files || [];
            fileStats = filesResponse.data || { total: 0 };
          }
        } catch (fileErr) {
          console.log('Failed to load files, continuing with empty array:', fileErr.message);
        }
        
        // Try to load analyses data - don't fail if this doesn't work
        try {
          const analysesResponse = await getMyAnalyses({ limit: 5, page: 1 });
          analysesData = Array.isArray(analysesResponse) ? analysesResponse : [];
        } catch (analysisErr) {
          console.log('Failed to load analyses, continuing with empty array:', analysisErr.message);
        }
        
        // Set the data
        setRecentFiles(filesData);
        setAnalyses(analysesData);
        
        // Update stats
        setStats({
          filesCount: fileStats.total || 0,
          analysesCount: analysesData.length || 0,
          riskAssessments: 8, // TODO: Get from risk prediction API
          healthScore: 85
        });
        
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Some dashboard data could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user]);

  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {userData?.name || user?.name || "User"}</h1>
           <p className="text-gray-600 dark:text-gray-300">Your genomic data and health insights</p>
          </div>
          <div className="flex items-center space-x-3">
             <Button asChild className="dna-gradient">            
            <Link to="/upload"><Upload className="h-4 w-4 mr-2" />Upload Data</Link>
            </Button>
            <ProfileDropdown userData={userData} />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Genome Files</CardTitle>
              <FileText className="h-4 w-4 text-gray-500 transition-transform duration-300 hover:scale-110" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.filesCount}</div>
              <p className="text-xs text-gray-600">{loading ? 'Loading...' : '+2 from last month'}</p>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analyses Complete</CardTitle>
              <Dna className="h-4 w-4 text-gray-500 transition-transform duration-300 hover:scale-110 hover:rotate-12" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.analysesCount}</div>
              <p className="text-xs text-gray-600">{loading ? 'Loading...' : '+6 this week'}</p>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Assessments</CardTitle>
              <Activity className="h-4 w-4 text-gray-500 transition-transform duration-300 hover:scale-110" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.riskAssessments}</div>
              <p className="text-xs text-gray-600">All up to date</p>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <Heart className="h-4 w-4 text-gray-500 transition-transform duration-300 hover:scale-110" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.healthScore}</div>
              <p className="text-xs text-green-600">+5% from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Files */}
        <Card className="col-span-1 lg:col-span-2 transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Recent Genome Files</CardTitle>
            <CardDescription>Your latest uploaded and processed files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  Loading files...
                </div>
              ) : recentFiles.length > 0 ? (
                recentFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:scale-102 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-600 transition-transform duration-300 hover:scale-110" />
                      <div>
                        <p className="font-medium">{file.filename || file.name}</p>
                        <p className="text-sm text-gray-600">{new Date(file.uploadDate).toLocaleDateString()} • {file.size || 'Unknown size'}</p>
                      </div>
                    </div>
                    <Badge variant="success" className="transition-all duration-300 hover:scale-110">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No files uploaded yet</p>
                  <p className="text-sm">Upload your first genome file to get started</p>
                </div>
              )}
              <Button variant="outline" className="w-full transform transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95" asChild>
                <Link to="/files">View All Files</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Risk Predictions */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Risk Predictions</CardTitle>
            <CardDescription>AI-powered health risk assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskPredictions.map((prediction, i) => (
              <div key={i} className="space-y-2 p-3 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:scale-102 dark:hover:bg-blue-900/20">                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{prediction.condition}</span>
                    <Badge variant={prediction.color} className="transition-all duration-300 hover:scale-110">
                      {prediction.risk}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={prediction.confidence} className="flex-1" />
                    <span className="text-xs text-gray-600">{prediction.confidence}%</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full transform transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95" asChild>
                <Link to="/predictions">View All Predictions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lifestyle Tracking */}
        <Card className="col-span-1 lg:col-span-3 transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Lifestyle Tracking</CardTitle>
            <CardDescription>Your health and wellness progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {lifestyleStats.map((stat, i) => (
            <div key={i} className="space-y-4 p-4 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:scale-105 dark:hover:bg-blue-900/20">                  <div className="flex items-center space-x-2">
                    <stat.icon className="h-5 w-5 text-blue-600 transition-transform duration-300 hover:scale-110" />
                    <span className="font-medium">{stat.metric}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{stat.value}</span>
                      <span className="text-sm text-gray-600">{stat.target}</span>
                    </div>
                    <Progress value={stat.progress} className="transition-all duration-300 hover:scale-105" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Target className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
                <span>3 goals completed this week</span>
              </div>
              <Button variant="outline" className="transform transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95" asChild>
                <Link to="/lifestyle">View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and next steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 hover:-translate-y-1" asChild>
                <Link to="/upload"><Upload className="h-8 w-8" /><span>Upload Data</span></Link>
              </Button>
              <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 hover:-translate-y-1" asChild>
                <Link to="/analysis"><Dna className="h-8 w-8" /><span>Start Analysis</span></Link>
              </Button>
              <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 hover:-translate-y-1" asChild>
                <Link to="/reports"><FileText className="h-8 w-8" /><span>Generate Report</span></Link>
              </Button>
              <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 hover:-translate-y-1" asChild>
                <Link to="/doctor"><Activity className="h-8 w-8" /><span>Consult Doctor</span></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <FloatingChatbot />
    </Layout>
  );
}