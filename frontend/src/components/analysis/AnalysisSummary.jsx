import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Play } from "lucide-react";

export default function AnalysisSummary({ selectedFiles, selectedAnalysis, onStart }) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Ready to Analyze</h3>
          <p className="text-sm text-gray-600">
            {selectedFiles.length} file(s) selected • {selectedAnalysis.length} analysis type(s) selected
          </p>
        </div>
        <Button
          onClick={onStart}
          disabled={selectedFiles.length === 0 || selectedAnalysis.length === 0}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Analysis
        </Button>
      </CardContent>
    </Card>
  );
}
