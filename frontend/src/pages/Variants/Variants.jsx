// src/pages/Variants/Variants.jsx
import React, { useState, useEffect } from "react";
import { Layout } from "../../components/Layout";
import { PageHeader } from "../../components/shared/PageHeader";
import { getMyFiles } from "../../services/genomeService";
import { runVariantDetection } from "../../services/variantService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import FileSelector from "../../components/analysis/FileSelector";
import AnalysisSummary from "../../components/analysis/AnalysisSummary";
import DnaHelixLoader from "../../components/DnaLoader";

export default function Variants() {
  const { toast } = useToast();
  const { token } = useAuth();
  const [availableFiles, setAvailableFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch uploaded files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const files = await getMyFiles();
        setAvailableFiles(files);
      } catch (err) {
        console.error("Failed to fetch files", err);
      }
    };
    fetchFiles();
  }, []);

  const startVariantAnalysis = async () => {
    setLoading(true);
    
    if (selectedFiles.length === 0) return;
    try {
      setLoading(true);
      const fileId = selectedFiles[0].fileId;

      toast({
        title: "Variant analysis started",
        description: "Your variant detection is now running.",
      }); 

      const data = await runVariantDetection(fileId, token);

      if (!data?.analysis) throw new Error("No analysis returned");

      navigate(`/variants/${fileId}`); // ✅ go to detail page for that file
    } catch (err) {
      console.error("Failed to start variant analysis", err.response?.data || err);
      toast({
        title: "Error",
        description: err?.response?.data?.error|| "Something went wrong",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-6">
          <DnaHelixLoader count={18} />
          <p className="mt-4 text-lg font-medium text-gray-900">Starting variant analysis…</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <PageHeader
          title="Variant Analysis"
          subtitle="Detect genetic variants from uploaded genome data"
        />

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

        <AnalysisSummary
          selectedFiles={selectedFiles}
          selectedAnalysis={[{ id: "variants", name: "Variant Detection" }]}
          onStart={startVariantAnalysis}
          loading={loading}
        />
      </div>
    </Layout>
  );
}
