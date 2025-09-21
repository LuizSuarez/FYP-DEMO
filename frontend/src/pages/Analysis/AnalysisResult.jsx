import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAnalysis } from "../../services/analysisService";
import { Dna, Activity, BarChart3 } from "lucide-react";

const metricIcons = {
  gc_percent: <BarChart3 className="w-5 h-5 text-indigo-500" />,
  at_gc_ratio: <Activity className="w-5 h-5 text-green-500" />,
  length: <Dna className="w-5 h-5 text-orange-500" />,
  sequences: <BarChart3 className="w-5 h-5 text-purple-500" />,
};

const AnalysisResults = () => {
  const { analysisId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let polling = true;

    const fetchData = async () => {
      try {
        const data = await getAnalysis(analysisId);
        setAnalysis(data.analysis || data);

        // Poll again if analysis is running
        if (polling && data.analysis?.status === "Running") {
          setTimeout(fetchData, 3000);
        }
      } catch (err) {
        console.error("Error fetching analysis:", err);
        setError(
          err.response?.status === 404
            ? "Analysis not found."
            : "Failed to load analysis"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      polling = false; // stop polling on unmount
    };
  }, [analysisId]);

  if (!analysis)
    return (
      <p className="p-6 text-center text-gray-600">
        {loading ? "Loading analysis..." : error || "No analysis found."}
      </p>
    );

  const metrics = analysis.results?.metrics || {};
  const summary = analysis.results?.summary || "";
  const progress = analysis.progress || (analysis.status === "Completed" ? 100 : 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analysis Result</h1>
          <p className="text-gray-500 mt-1">{summary}</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              analysis.status === "Running"
                ? "bg-yellow-100 text-yellow-700"
                : analysis.status === "Completed"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            Status: {analysis.status}
          </span>
          {analysis.status === "Running" && (
            <span className="text-sm text-gray-600">{progress.toFixed(0)}%</span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {analysis.status === "Running" && (
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 bg-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.keys(metrics).map((key) => {
          const value = metrics[key];
          if (value === undefined || value === null) return null;
          const displayValue = typeof value === "number" ? value.toFixed(2) : value;

          return (
            <div
              key={key}
              className="bg-white shadow rounded-lg p-4 flex items-center space-x-4 hover:shadow-lg transition"
            >
              <div className="p-3 bg-gray-100 rounded-full">{metricIcons[key]}</div>
              <div>
                <p className="text-sm text-gray-500 capitalize">{key.replace("_", " ")}</p>
                <p className="text-xl font-semibold text-gray-800">{displayValue}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Artifacts / Additional Results */}
      {analysis.artifacts?.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Artifacts</h2>
          <ul className="list-disc list-inside space-y-2">
            {analysis.artifacts.map((artifact) => (
              <li key={artifact.id}>
                <a
                  href={artifact.url}
                  className="text-indigo-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {artifact.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
