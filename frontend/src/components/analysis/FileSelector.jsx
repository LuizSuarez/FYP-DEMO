import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { FileText, CheckCircle } from "lucide-react";

export default function FileSelector({
  availableFiles = [],
  selectedFiles,
  onToggleFile,
}) {
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
          {availableFiles.length === 0 ? (
            <p className="text-gray-500 text-sm">No files uploaded yet.</p>
          ) : (
            availableFiles.map((file) => {
              const isSelected = selectedFiles.find((f) => f._id === file._id);
              return (
                <div
                  key={file._id}
                  onClick={() => onToggleFile(file)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-100 dark:bg-indigo-900/40"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{file.filename}</p>
                      <p className="text-sm text-gray-500">
                        {file.size ? `${file.size} bytes` : "Unknown size"} •{" "}
                        {file.mimetype || "Unknown type"}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
