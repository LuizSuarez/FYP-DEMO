// src/pages/Analysis/Analysis.jsx
import React, { useState, useEffect } from "react";
import { Layout } from "../../components/Layout";
import { PageHeader } from "../../components/shared/PageHeader";
import { SearchFilters } from "../../components/shared/SearchFilters";
import { StatusCard } from "../../components/shared/StatusCard";
import { Filter } from "lucide-react";
import FileSelector from "../../components/analysis/FileSelector";
import AnalysisTypeSelector from "../../components/analysis/AnalysisTypeSelector";
import AnalysisSummary from "../../components/analysis/AnalysisSummary";
import { runSequenceAnalysis, getMyAnalyses } from "../../services/analysisService";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { getMyFiles } from "../../services/genomeService";
import { useToast } from "@/hooks/use-toast";
import DnaHelixLoader from "../../components/DnaLoader";

const analysisTypes = [
  { id: "gc-content", name: "GC Content Analysis", description: "Calculate guanine-cytosine content distribution", duration: "5-10 minutes", complexity: "Basic", icon: "BarChart3" },
  { id: "codon-usage", name: "Codon Usage Frequency", description: "Analyze codon usage patterns and bias", duration: "10-15 minutes", complexity: "Intermediate", icon: "Dna" },
  { id: "sequence-stats", name: "Sequence Statistics", description: "Comprehensive sequence composition and metrics", duration: "3-8 minutes", complexity: "Basic", icon: "Activity" },
  { id: "at-gc-ratio", name: "AT/GC Ratio Analysis", description: "Calculate adenine-thymine to guanine-cytosine ratios", duration: "5-12 minutes", complexity: "Basic", icon: "BarChart3" },
];

export default function Analysis() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [availableFiles, setAvailableFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState([]);
  const [runningAnalyses, setRunningAnalyses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false); // reused to show immediate loader
  const navigate = useNavigate();

  // ✅ Fetch uploaded files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const files = await getMyFiles(token);
        setAvailableFiles(files);
      } catch (err) {
        console.error("Failed to fetch files", err);
      }
    };
    fetchFiles();
  }, [token]);

  // ✅ Fetch my analyses
  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const data = await getMyAnalyses(token);
        setRunningAnalyses(data.analyses || []);
      } catch (err) {
        console.error("Failed to fetch analyses", err);
      }
    };
    fetchAnalyses();
  }, [token]);

  // ---- Inline Loading UI (shows immediately when loading === true) ----
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-6">
          <DnaHelixLoader count={18} />
          <p className="mt-4 text-lg font-medium text-gray-900">Starting analysis…</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your analysis is being prepared. This may take a few moments.
          </p>
        </div>
      </div>
    );
  }

  // ---- Normal page UI (shown when not starting analysis) ----
  const startAnalysis = async () => {
    if (selectedFiles.length === 0 || selectedAnalysis.length === 0) return;

    try {
      // show immediate loader
      setLoading(true);

      const fileId = selectedFiles[0].fileId;
      const analysisType = selectedAnalysis[0].id;

      // immediate toast so the user knows things started
      toast({
        title: "Analysis started",
        description: "Your genome analysis is now running. We'll navigate you to the results shortly.",
      });

      // run in background (we're awaiting it but the UI already shows loader)
      const data = await runSequenceAnalysis(fileId, token);

      // extract real analysis id robustly
      const analysisId = data?.analysisId || data?.analysis?._id || data?.analysis?._id || data?.analysis?._id;

      // make sure we have an id
      if (!analysisId) {
        throw new Error("No analysis id returned from server");
      }

      // add to running analyses list (optional)
      setRunningAnalyses((prev) => [
        ...prev,
        { _id: analysisId, id: analysisId, fileId, status: "Running", analysisType}
      ]);

      // navigate to the loading/polling route that will handle progress/completion
      navigate(`/analysis/${analysisId}`);
    } catch (err) {
      console.error("Failed to start analysis", err);
      toast({
        title: "Error starting analysis",
        description: err?.message || "Something went wrong",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <PageHeader
          title="Genome Sequence Analysis"
          subtitle="Analyze DNA sequences using advanced algorithms"
        />

        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchPlaceholder="Search files or analysis types..."
          actions={[{ icon: Filter, label: "Filter Files", onClick: () => {} }]}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <FileSelector
            availableFiles={availableFiles}
            selectedFiles={selectedFiles}
            onToggleFile={(file) =>
              setSelectedFiles((prev) =>
                prev.find((f) => f._id === file._id)
                  ? prev.filter((f) => f._id !== file._id)
                  : [...prev, file]
              )
            }
          />
          <AnalysisTypeSelector
            analysisTypes={analysisTypes}
            selectedAnalysis={selectedAnalysis}
            onToggleAnalysis={(analysis) =>
              setSelectedAnalysis((prev) =>
                prev.find((a) => a.id === analysis.id)
                  ? prev.filter((a) => a.id !== analysis.id)
                  : [...prev, analysis]
              )
            }
          />
        </div>

        <AnalysisSummary
          selectedFiles={selectedFiles}
          selectedAnalysis={selectedAnalysis}
          onStart={startAnalysis}
          loading={loading} // will disable button in summary if you built that logic already
        />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Running Analyses</h2>
          {runningAnalyses.length === 0 ? (
            <p className="text-gray-500">No analyses running right now.</p>
          ) : (
            runningAnalyses.map((a) => (
              <StatusCard
                key={a._id || a.id}
                title={`Analysis: ${a.analysisType || "GenomeSequence"}`}
                status={a.status}
                description={`File: ${a.fileId}`}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
