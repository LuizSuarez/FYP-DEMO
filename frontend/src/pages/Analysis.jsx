import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { PageHeader } from "../components/shared/PageHeader";
import { SearchFilters } from "../components/shared/SearchFilters";
import { StatusCard } from "../components/shared/StatusCard";
import { Filter } from "lucide-react";
import FileSelector from "../components/analysis/FileSelector";
import AnalysisTypeSelector from "../components/analysis/AnalysisTypeSelector";
import AnalysisSummary from "../components/analysis/AnalysisSummary";
import {
  runSequenceAnalysis,
  getMyAnalyses,
  getAnalysis,
} from "../services/analysisService";
import { useAuth } from "../context/authContext";

const analysisTypes = [
  {
    id: "gc-content",
    name: "GC Content Analysis",
    description: "Calculate guanine-cytosine content distribution across sequences",
    duration: "5-10 minutes",
    complexity: "Basic",
    icon: "BarChart3",
  },
  {
    id: "codon-usage",
    name: "Codon Usage Frequency",
    description: "Analyze codon usage patterns and bias in protein-coding sequences",
    duration: "10-15 minutes",
    complexity: "Intermediate",
    icon: "Dna",
  },
  {
    id: "sequence-stats",
    name: "Sequence Statistics",
    description: "Comprehensive sequence composition and quality metrics",
    duration: "3-8 minutes",
    complexity: "Basic",
    icon: "Activity",
  },
  {
    id: "at-gc-ratio",
    name: "AT/GC Ratio Analysis",
    description: "Calculate adenine-thymine to guanine-cytosine ratios",
    duration: "5-12 minutes",
    complexity: "Basic",
    icon: "BarChart3",
  },
];

const availableFiles = [
  { id: 1, name: "sample_genome_001.fasta", size: "2.4 MB", type: "FASTA", status: "ready" },
  { id: 2, name: "exome_data_v2.fasta", size: "15.7 MB", type: "FASTA", status: "ready" },
  { id: 3, name: "variants_filtered.vcf", size: "892 KB", type: "VCF", status: "ready" },
];

export default function Analysis() {
  const user = useAuth();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState([]);
  const [runningAnalyses, setRunningAnalyses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Load user analyses from backend
  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const data = await getMyAnalyses(user.token, { type: "GenomeSequence"});
        setRunningAnalyses(data.analyses || []);
      } catch (err) {
        console.error("Failed to fetch analyses", err);
      }
    };
    fetchAnalyses();
  }, []);

  const toggleFileSelection = (file) => {
    setSelectedFiles((prev) =>
      prev.find((f) => f.id === file.id) ? prev.filter((f) => f.id !== file.id) : [...prev, file]
    );
  };

  const toggleAnalysisSelection = (analysis) => {
    setSelectedAnalysis((prev) =>
      prev.find((a) => a.id === analysis.id)
        ? prev.filter((a) => a.id !== analysis.id)
        : [...prev, analysis]
    );
  };

  // ✅ Start analysis with backend API
  const startAnalysis = async () => {
    if (selectedFiles.length === 0 || selectedAnalysis.length === 0) return;

    try {
      setLoading(true);
      const fileId = selectedFiles[0].id; // adjust if backend uses a different file identifier
      const data = await runSequenceAnalysis(fileId);

      // API gives { message, analysis }
      setRunningAnalyses((prev) => [...prev, data.analysis]);
      setSelectedFiles([]);
      setSelectedAnalysis([]);
    } catch (err) {
      console.error("Failed to start analysis", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Export results (from backend instead of dummy JSON)
  const exportAnalysis = async (analysis) => {
    try {
      const details = await getAnalysis(analysis._id);
      const dataStr = JSON.stringify(details, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `genome_analysis_${analysis._id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export analysis", err);
    }
  };

  const filterActions = [
    {
      icon: Filter,
      label: "Filter Files",
      onClick: () => {},
    },
  ];

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
          actions={filterActions}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <FileSelector
            availableFiles={availableFiles}
            selectedFiles={selectedFiles}
            onToggleFile={toggleFileSelection}
          />
          <AnalysisTypeSelector
            analysisTypes={analysisTypes}
            selectedAnalysis={selectedAnalysis}
            onToggleAnalysis={toggleAnalysisSelection}
          />
        </div>

        <AnalysisSummary
          selectedFiles={selectedFiles}
          selectedAnalysis={selectedAnalysis}
          onStart={startAnalysis}
          loading={loading}
        />

        {runningAnalyses.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">My Analyses</h3>
            {runningAnalyses.map((analysis) => (
              <StatusCard
                key={analysis._id || analysis.id}
                title={`Analysis ${(analysis._id || analysis.id).toString().substring(0, 8)}`}
                subtitle={`${analysis.files?.length || 1} files • ${
                  analysis.analyses?.length || 1
                } methods`}
                status={analysis.status}
                progress={analysis.progress || (analysis.status === "completed" ? 100 : 0)}
                details={[
                  { label: "Start Time", value: new Date(analysis.createdAt || Date.now()).toLocaleString() },
                  { label: "Files", value: analysis.file?.name || "N/A" },
                  { label: "Methods", value: analysis.analysisType || "GenomeSequence" },
                ]}
                actions={
                  analysis.status === "completed"
                    ? [
                        {
                          label: "Export Results",
                          onClick: () => exportAnalysis(analysis),
                          className: "bg-green-100 hover:bg-green-200 text-green-700",
                        },
                      ]
                    : []
                }
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
