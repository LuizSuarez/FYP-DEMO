import { Badge } from "../ui/badge";
import { FileText, CheckCircle, Activity, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { RecentItemCard } from "./RecentItemCard";
import { ProgressItem } from "./ProgressItem";
import { InfoCard } from "./InfoCard";

export function PatientContent({ data }) {
  const fileItems = data.recentFiles.map((file, i) => ({
    content: (
      <>
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-blue-600 transition-transform duration-300 hover:scale-110" />
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-600">{file.uploadDate} • {file.fileSize}</p>
          </div>
        </div>
        <Badge variant={file.status === "Completed" ? "success" : "warning"} className="transition-all duration-300 hover:scale-110">
          {file.status === "Completed" ? <CheckCircle className="h-3 w-3 mr-1" /> : <Activity className="h-3 w-3 mr-1 animate-spin" />}
          {file.status}
        </Badge>
      </>
    )
  }));

  const predictionItems = data.riskPredictions.map((prediction, i) => ({
    content: (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{prediction.condition}</span>
          <Badge variant={prediction.color} className="transition-all duration-300 hover:scale-110">
            {prediction.risk}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{width: `${prediction.confidence}%`}}
            />
          </div>
          <span className="text-xs text-gray-600">{prediction.confidence}%</span>
        </div>
      </div>
    ),
    className: "space-y-2 p-3 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:scale-102 dark:hover:bg-blue-900/20"
  }));

  return (
    <>
      <RecentItemCard
        title="Recent Genome Files"
        description="Your latest uploaded and processed files"
        items={fileItems}
        viewAllLink="/files"
        viewAllText="View All Files"
        className="col-span-1 lg:col-span-2"
      />

      <RecentItemCard
        title="Risk Predictions"
        description="AI-powered health risk assessments"
        items={predictionItems}
        viewAllLink="/predictions"
        viewAllText="View All Predictions"
      />

      <InfoCard
        title="Lifestyle Tracking"
        description="Your health and wellness progress"
        className="col-span-1 lg:col-span-3"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {data.lifestyleStats.map((stat, i) => (
            <ProgressItem
              key={i}
              label={stat.metric}
              value={stat.value}
              target={stat.target}
              progress={stat.progress}
              icon={stat.icon}
            />
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
      </InfoCard>
    </>
  );
}