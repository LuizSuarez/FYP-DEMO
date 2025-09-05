import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Upload,
  FileText,
  Activity,
  FlaskConical,
  Users,
  Database,
  BarChart3,
  LogOut,
  CheckCircle,
  Clock
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const researchProjects = [
  {
    name: "Alzheimer's Genetic Markers Study",
    status: "Active",
    progress: 75,
    participants: 1247,
    deadline: "2024-03-15"
  },
  {
    name: "Cancer Mutation Analysis",
    status: "Data Collection", 
    progress: 45,
    participants: 892,
    deadline: "2024-04-20"
  },
  {
    name: "Rare Disease Genomics",
    status: "Analysis",
    progress: 90,
    participants: 156,
    deadline: "2024-02-28"
  }
];

const datasets = [
  {
    name: "GWAS_alzheimer_v3.dataset",
    status: "Processing",
    size: "847 MB",
    lastModified: "2024-01-15"
  },
  {
    name: "cancer_mutations_filtered.vcf",
    status: "Complete",
    size: "1.2 GB", 
    lastModified: "2024-01-14"
  },
  {
    name: "rare_variants_cohort.tsv",
    status: "Complete",
    size: "234 MB",
    lastModified: "2024-01-12"
  }
];

export default function ResearcherDashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Dr. {userData?.firstName || "Researcher"}</h1>
            <p className="text-gray-600">
              Advanced research tools and dataset management
              {userData?.institution && ` at ${userData.institution}`}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95" asChild>
              <Link to="/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Dataset
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="transform transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Studies</CardTitle>
              <FlaskConical className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-gray-600">2 pending approval</p>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,295</div>
              <p className="text-xs text-green-600">+127 this month</p>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Datasets</CardTitle>
              <Database className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-gray-600">3 processing</p>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Publications</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-green-600">+2 this year</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Research Projects */}
          <Card className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Research Projects</CardTitle>
              <CardDescription>Your ongoing research studies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {researchProjects.map((project, index) => (
                  <div key={index} className="space-y-3 p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:scale-102">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{project.name}</h4>
                      <Badge variant="secondary" className="transition-all duration-300 hover:scale-110 bg-blue-100 text-blue-700">
                        {project.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{project.participants} participants</span>
                      <span>Due: {project.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Datasets */}
          <Card className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Recent Datasets</CardTitle>
              <CardDescription>Your latest research datasets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {datasets.map((dataset, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:scale-102">
                    <div className="flex items-center space-x-3">
                      <Database className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium">{dataset.name}</p>
                        <p className="text-sm text-gray-600">
                          {dataset.lastModified} • {dataset.size}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={dataset.status === "Complete" ? "default" : "secondary"}
                      className={`transition-all duration-300 hover:scale-110 ${
                        dataset.status === "Complete" ? "bg-green-500 text-white" : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {dataset.status === "Complete" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1 animate-pulse" />
                      )}
                      {dataset.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Research Tools</CardTitle>
            <CardDescription>Advanced analysis and collaboration tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button 
                variant="outline" 
                className="h-auto p-6 flex flex-col items-center space-y-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 hover:-translate-y-1" 
                asChild
              >
                <Link to="/upload">
                  <Upload className="h-8 w-8" />
                  <span>Upload Dataset</span>
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-6 flex flex-col items-center space-y-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 hover:-translate-y-1" 
                asChild
              >
                <Link to="/analysis">
                  <BarChart3 className="h-8 w-8" />
                  <span>Statistical Analysis</span>
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-6 flex flex-col items-center space-y-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 hover:-translate-y-1" 
                asChild
              >
                <Link to="/collaborate">
                  <Users className="h-8 w-8" />
                  <span>Collaborate</span>
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-6 flex flex-col items-center space-y-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 hover:-translate-y-1" 
                asChild
              >
                <Link to="/publications">
                  <FileText className="h-8 w-8" />
                  <span>Publications</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}