import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock, CheckCircle } from "lucide-react";
import * as Icons from "lucide-react";

export default function AnalysisTypeSelector({ analysisTypes, selectedAnalysis, onToggleAnalysis }) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle>Select Analysis Types</CardTitle>
        <CardDescription>Select analysis methods to run</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {analysisTypes.map((analysis) => {
            const Icon = Icons[analysis.icon];
            return (
              <div
                key={analysis.id}
                onClick={() => onToggleAnalysis(analysis)}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedAnalysis.find((a) => a.id === analysis.id)
                    ? "border-indigo-600 bg-indigo-100 dark:bg-indigo-900/40"
                    : "border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon className="h-6 w-6 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <p className="font-medium">{analysis.name}</p>
                      <p className="text-sm text-gray-600">{analysis.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary">{analysis.complexity}</Badge>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {analysis.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedAnalysis.find((a) => a.id === analysis.id) && (
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-1" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
