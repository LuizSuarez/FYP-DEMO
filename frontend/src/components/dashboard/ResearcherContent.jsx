import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Database, CheckCircle, Clock } from "lucide-react";
import { InfoCard } from "./InfoCard";
import { RecentItemCard } from "./RecentItemCard";

export function ResearcherContent({ data }) {
  const projectItems = data.researchProjects.map((project, index) => ({
    content: (
      <div className="space-y-3">
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
    ),
    className: "space-y-3 p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:scale-102"
  }));

  const datasetItems = data.datasets.map((dataset, index) => ({
    content: (
      <>
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
      </>
    )
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <InfoCard
        title="Research Projects"
        description="Your ongoing research studies"
      >
        <div className="space-y-4">
          {projectItems.map((item, index) => (
            <div key={index} className={item.className}>
              {item.content}
            </div>
          ))}
        </div>
      </InfoCard>

      <RecentItemCard
        title="Recent Datasets"
        description="Your latest research datasets"
        items={datasetItems}
      />
    </div>
  );
}