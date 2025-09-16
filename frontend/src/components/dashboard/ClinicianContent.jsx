import { Badge } from "../ui/badge";
import { Users, CheckCircle, Clock } from "lucide-react";
import { RecentItemCard } from "./RecentItemCard";

export function ClinicianContent({ data }) {
  const patientItems = data.patients.map((patient, index) => ({
    content: (
      <>
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <p className="font-medium">{patient.name}</p>
            <p className="text-sm text-gray-600">
              {patient.id} • Last visit: {patient.lastVisit}
            </p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <Badge 
            variant="secondary"
            className={`transition-all duration-300 hover:scale-110 ${
              patient.status === "High Priority" ? "bg-orange-100 text-orange-700" :
              patient.status === "Follow-up" ? "bg-blue-100 text-blue-700" :
              "bg-gray-100 text-gray-700"
            }`}
          >
            {patient.status}
          </Badge>
          <p className="text-xs text-gray-600">
            Risk: {patient.riskLevel}
          </p>
        </div>
      </>
    )
  }));

  const testItems = data.clinicalTests.map((test, index) => ({
    content: (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">{test.test}</span>
          <Badge 
            variant={test.status === "Complete" ? "default" : "secondary"}
            className={`transition-all duration-300 hover:scale-110 ${
              test.status === "Complete" ? "bg-green-500 text-white" : "bg-orange-100 text-orange-700"
            }`}
          >
            {test.status === "Complete" ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <Clock className="h-3 w-3 mr-1 animate-pulse" />
            )}
            {test.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          Patient: {test.patient} • {test.date}
        </p>
      </div>
    ),
    className: "space-y-2 p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:scale-102"
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <RecentItemCard
        title="Recent Patients"
        description="Patients requiring attention"
        items={patientItems}
        viewAllLink="/patients"
        viewAllText="View All Patients"
      />

      <RecentItemCard
        title="Recent Tests"
        description="Latest genomic test results"
        items={testItems}
        viewAllLink="/tests"
        viewAllText="View All Tests"
      />
    </div>
  );
}