// src/pages/Predictions.jsx
import React, { useState } from "react";
import { predictFromFile } from "../services/predictionService";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { FloatingChatbot } from "../components/FloatingChatbot";
import {
  Brain,
  Heart,
  Activity,
  AlertTriangle,
  TrendingUp,
  Info,
  Download,
  Calendar,
  Share,
  BookOpen,
  CheckCircle,
  X,
  Upload
} from "lucide-react";

function getRiskBadgeColor(level) {
  switch ((level || "").toLowerCase()) {
    case "high":
      return "border-red-200 text-red-700 bg-red-50";
    case "moderate":
      return "border-orange-200 text-orange-700 bg-orange-50";
    case "low":
      return "border-green-200 text-green-700 bg-green-50";
    default:
      return "border-gray-200 text-gray-700 bg-gray-50";
  }
}

function getRiskColor(level) {
  switch ((level || "").toLowerCase()) {
    case "high":
      return "text-red-600";
    case "moderate":
      return "text-orange-600";
    case "low":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
}

export default function Predictions() {
  // file + upload/predict
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  const [predictionRaw, setPredictionRaw] = useState(null); // raw backend response
  const [diseaseRisks, setDiseaseRisks] = useState([]);
  const [modelConfidence, setModelConfidence] = useState(null);

  // UI/dialog states
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  // Dialogs kept minimal here (you already have implementations below, kept for parity)
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showTimelineDialog, setShowTimelineDialog] = useState(false);
  const [showLearnMoreDialog, setShowLearnMoreDialog] = useState(false);
  const [selectedEducationContent, setSelectedEducationContent] = useState(null);

  // File selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files?.[0] || null);
    setUploadedFilename(null);
    setUploadResult(null);
    setPredictionRaw(null);
    setDiseaseRisks([]);
    setModelConfidence(null);
    setError(null);
  };

  // Upload step
  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    try {
      const res = await uploadFile(selectedFile);
      setUploadResult(res);
      setUploadedFilename(res.filename || selectedFile.name);
      setShowSuccessMessage("Upload completed");
      setTimeout(() => setShowSuccessMessage(""), 3000);
    } catch (err) {
      setError(err?.response?.data || err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Predict step (we will send file again to /predict to avoid reliance on saved filename)
  const handlePredict = async () => {
    if (!selectedFile && !uploadedFilename) return;
    setLoading(true);
    setError(null);

    try {
      // Prefer sending the actual file to /predict (no dependency on server-side saved filename)
      const res = await predictFromFile(selectedFile || uploadedFilename);
      setPredictionRaw(res);

      // Map backend classes + probabilities to diseaseRisks for UI
      // Backend returns: classes (array), probabilities (array of arrays)
      const classes = res.classes || null;
      const probs = (res.probabilities && res.probabilities[0]) || null;

      let mapping = [];

      if (classes && probs) {
        const maxProb = Math.max(...probs);
        setModelConfidence(Math.round(maxProb * 100));

        mapping = classes.map((c, idx) => {
          const p = probs[idx] || 0;
          const percent = Math.round(p * 100);
          let riskLevel = "low";
          if (p >= 0.6) riskLevel = "high";
          else if (p >= 0.3) riskLevel = "moderate";

          return {
            disease: String(c),
            percentage: percent,
            populationAverage: Math.round(30 + Math.random() * 20), // placeholder population average
            genes: [], // placeholder (extend future)
            recommendations: ["Discuss with provider", "Consider genetic counseling"],
            riskLevel,
          };
        });
      } else {
        // fallback: show predicted label(s)
        const preds = res.predictions || [];
        mapping = preds.map((p, idx) => ({
          disease: String(p),
          percentage: 0,
          populationAverage: 0,
          genes: [],
          recommendations: [],
          riskLevel: "low",
        }));
      }

      setDiseaseRisks(mapping);
      setShowSuccessMessage("Prediction completed");
      setTimeout(() => setShowSuccessMessage(""), 3000);
    } catch (err) {
      setError(err?.response?.data || err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  // Pretty display helpers
  const renderOverviewCards = () => {
    const highCount = diseaseRisks.filter(d => d.riskLevel === "high").length;
    const moderateCount = diseaseRisks.filter(d => d.riskLevel === "moderate").length;
    const lowCount = diseaseRisks.filter(d => d.riskLevel === "low").length;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highCount}</div>
            <p className="text-xs text-gray-600">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moderate Risk</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{moderateCount}</div>
            <p className="text-xs text-gray-600">Monitor and prevent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Risk</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{lowCount}</div>
            <p className="text-xs text-gray-600">Maintain current health</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Confidence</CardTitle>
            <Brain className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modelConfidence !== null ? `${modelConfidence}%` : "—"}</div>
            <p className="text-xs text-gray-600">Prediction confidence (max)</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDiseaseCards = () => {
    if (!diseaseRisks.length) {
      return (
        <div className="p-6 border rounded-lg text-center text-gray-500">
          No prediction yet — upload a file and click <strong>Run Prediction</strong>.
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {diseaseRisks.map((disease, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <CardTitle className="text-xl">{disease.disease}</CardTitle>
                  <CardDescription>Based on model probabilities</CardDescription>
                </div>
                <Badge variant="outline" className={getRiskBadgeColor(disease.riskLevel)}>
                  {disease.riskLevel?.charAt(0).toUpperCase() + disease.riskLevel?.slice(1)} Risk
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-4">Risk Assessment</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Your Risk</span>
                        <span className={`font-medium ${getRiskColor(disease.riskLevel)}`}>
                          {disease.percentage}%
                        </span>
                      </div>
                      <Progress value={disease.percentage} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Population Average</span>
                        <span className="font-medium text-gray-600">{disease.populationAverage}%</span>
                      </div>
                      <Progress value={disease.populationAverage} className="h-2 opacity-50" />
                    </div>

                    <div className="text-xs text-gray-600">
                      {disease.percentage > disease.populationAverage ? (
                        <span className="text-orange-600">
                          ↑ {Math.round(((disease.percentage / Math.max(disease.populationAverage,1) - 1) * 100))}% above average
                        </span>
                      ) : (
                        <span className="text-green-600">
                          ↓ {Math.round(((1 - disease.percentage / Math.max(disease.populationAverage,1)) * 100))}% below average
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Contributing Genes</h4>
                  <div className="space-y-2">
                    {(disease.genes && disease.genes.length) ? (
                      disease.genes.map((g, gi) => (
                        <div key={gi} className="flex items-center justify-between p-2 border rounded">
                          <span className="font-mono text-sm">{g}</span>
                          <Button variant="ghost" size="sm" onClick={() => setShowLearnMoreDialog(true)}>
                            <Info className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No gene-level data available</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Personalized Recommendations</h4>
                <div className="grid gap-2 md:grid-cols-3">
                  {(disease.recommendations || []).map((rec, idx) => (
                    <div key={idx} className="p-3 border rounded-lg bg-gray-50">
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Brain className="h-4 w-4" />
                  <span>Last updated: just now</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setShowLearnMoreDialog(true)}>
                    <BookOpen className="h-4 w-4 mr-1" />
                    Learn More
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderProbabilitiesTable = () => {
    if (!predictionRaw || !predictionRaw.classes || !predictionRaw.probabilities) return null;
    const classes = predictionRaw.classes;
    const probs = predictionRaw.probabilities[0];

    return (
      <div className="mt-4">
        <h4 className="font-medium mb-2">Probability Distribution</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-sm rounded">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">Class</th>
                <th className="px-4 py-2">Probability</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{c}</td>
                  <td className="px-4 py-2">
                    {(probs[i] * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderFeaturesUsed = () => {
    if (!predictionRaw || !predictionRaw.features_used) return null;
    const features = predictionRaw.features_used[0] || {};
    return (
      <div className="mt-4">
        <h4 className="font-medium mb-2">Features used for prediction</h4>
        <div className="p-3 bg-gray-50 rounded border">
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(features, null, 2)}
          </pre>
        </div>
      </div>
    );
  };


  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6">
        {/* Success toast */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>{showSuccessMessage}</span>
              <button onClick={() => setShowSuccessMessage("")} className="ml-2 hover:bg-green-200 rounded-full p-1">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header / file controls */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Disease Risk Predictions</h1>
            <p className="text-gray-600">Upload a genomics file (FASTA / VCF / GFF) and run the model</p>
          </div>

          <div className="flex items-center space-x-3">
            <label className="cursor-pointer flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <input type="file" accept=".fasta,.fa,.vcf,.gff,.txt,.csv" onChange={handleFileChange} className="hidden" />
              <span className="text-sm">{selectedFile ? selectedFile.name : "Select file"}</span>
            </label>

            <Button variant="outline" onClick={handleUpload} disabled={!selectedFile || loading}>
              {loading ? "Uploading..." : "Upload"}
            </Button>

            <Button onClick={handlePredict} disabled={(!selectedFile && !uploadedFilename) || loading}>
              {loading ? "Running..." : "Run Prediction"}
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            <strong>Error:</strong> {typeof error === "string" ? error : JSON.stringify(error)}
          </div>
        )}

        {/* If prediction exists, show results */}
        {predictionRaw && (
          <>
            {renderOverviewCards()}

            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Prediction Results</h2>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  {renderDiseaseCards()}

                  {renderProbabilitiesTable()}

                  {renderFeaturesUsed()}
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Raw Response</CardTitle>
                      <CardDescription>Backend response (debug)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs max-h-80 overflow-auto">
                        {JSON.stringify(predictionRaw, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </>
        )}

        {/* If no prediction yet, show placeholder */}
        {!predictionRaw && (
          <div className="p-6 border rounded-lg text-center text-gray-500">
            Upload a file and click <strong>Run Prediction</strong> to see results.
          </div>
        )}
      </div>

      <FloatingChatbot />
    </Layout>
  );
}
