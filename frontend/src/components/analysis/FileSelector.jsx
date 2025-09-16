import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { FileText, CheckCircle } from "lucide-react";

export default function FileSelector({ availableFiles, selectedFiles, onToggleFile }) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>Select Files</span>
        </CardTitle>
        <CardDescription>Choose genome files for analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {availableFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => onToggleFile(file)}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedFiles.find((f) => f.id === file.id)
                  ?"border-indigo-600 bg-indigo-100 dark:bg-indigo-900/40"
                  : "border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{file.size} • {file.type}</p>
                </div>
                {selectedFiles.find((f) => f.id === file.id) && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
