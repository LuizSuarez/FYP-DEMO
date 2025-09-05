import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dna, BarChart3, Activity, FileText, Play, Clock, CheckCircle, Download } from 'lucide-react';

const analysisTypes = [
  {
    id: 'gc-content',
    name: 'GC Content Analysis',
    description: 'Calculate guanine-cytosine content distribution across sequences',
    duration: '5-10 minutes',
    complexity: 'Basic',
    icon: BarChart3
  },
  {
    id: 'codon-usage',
    name: 'Codon Usage Frequency',
    description: 'Analyze codon usage patterns and bias in protein-coding sequences',
    duration: '10-15 minutes',
    complexity: 'Intermediate',
    icon: Dna
  },
  {
    id: 'sequence-stats',
    name: 'Sequence Statistics',
    description: 'Comprehensive sequence composition and quality metrics',
    duration: '3-8 minutes',
    complexity: 'Basic',
    icon: Activity
  },
  {
    id: 'at-gc-ratio',
    name: 'AT/GC Ratio Analysis',
    description: 'Calculate adenine-thymine to guanine-cytosine ratios',
    duration: '5-12 minutes',
    complexity: 'Basic',
    icon: BarChart3
  }
];

const availableFiles = [
  { id: 1, name: 'sample_genome_001.fasta', size: '2.4 MB', type: 'FASTA', status: 'ready' },
  { id: 2, name: 'exome_data_v2.fasta', size: '15.7 MB', type: 'FASTA', status: 'ready' },
  { id: 3, name: 'variants_filtered.vcf', size: '892 KB', type: 'VCF', status: 'ready' }
];

export default function Analysis() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState([]);
  const [runningAnalyses, setRunningAnalyses] = useState([]);

  // Redirect to upload page if no files are available
  useEffect(() => {
    if (availableFiles.length === 0) {
      window.location.href = '/upload';
    }
  }, []);

  const toggleFileSelection = (file) => {
    setSelectedFiles(prev => 
      prev.find(f => f.id === file.id)
        ? prev.filter(f => f.id !== file.id)
        : [...prev, file]
    );
  };

  const toggleAnalysisSelection = (analysis) => {
    setSelectedAnalysis(prev => 
      prev.find(a => a.id === analysis.id)
        ? prev.filter(a => a.id !== analysis.id)
        : [...prev, analysis]
    );
  };

  const startAnalysis = () => {
    if (selectedFiles.length === 0 || selectedAnalysis.length === 0) return;

    const newAnalysis = {
      id: Math.random().toString(36).substr(2, 9),
      files: selectedFiles,
      analyses: selectedAnalysis,
      startTime: new Date(),
      progress: 0,
      status: 'running'
    };

    setRunningAnalyses(prev => [...prev, newAnalysis]);

    // Simulate analysis progress with guaranteed completion
    const progressInterval = setInterval(() => {
      setRunningAnalyses(prev => prev.map(analysis => {
        if (analysis.id === newAnalysis.id) {
          const increment = analysis.progress < 90 ? Math.random() * 20 + 5 : 100 - analysis.progress;
          const newProgress = Math.min(analysis.progress + increment, 100);
          return {
            ...analysis,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'running'
          };
        }
        return analysis;
      }));
    }, 1000);

    // Clear interval when analysis completes
    const checkCompletion = setInterval(() => {
      setRunningAnalyses(prev => {
        const currentAnalysis = prev.find(a => a.id === newAnalysis.id);
        if (currentAnalysis && currentAnalysis.progress >= 100) {
          clearInterval(progressInterval);
          clearInterval(checkCompletion);
        }
        return prev;
      });
    }, 500);

    // Fallback to ensure completion after maximum time
    setTimeout(() => {
      clearInterval(progressInterval);
      clearInterval(checkCompletion);
      setRunningAnalyses(prev => prev.map(analysis => 
        analysis.id === newAnalysis.id 
          ? { ...analysis, progress: 100, status: 'completed' }
          : analysis
      ));
    }, 10000);
  };

  const exportAnalysis = (analysis) => {
    // Generate mock analysis results
    const results = {
      analysisId: analysis.id,
      timestamp: analysis.startTime.toISOString(),
      files: analysis.files.map(f => f.name),
      analysisTypes: analysis.analyses.map(a => a.name),
      results: {
        gcContent: Math.random() * 100,
        sequenceLength: Math.floor(Math.random() * 10000) + 1000,
        baseComposition: {
          A: Math.random() * 30,
          T: Math.random() * 30,
          G: Math.random() * 25,
          C: Math.random() * 25
        },
        summary: `Analysis completed successfully for ${analysis.files.length} file(s) using ${analysis.analyses.length} analysis method(s).`
      }
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `genome_analysis_${analysis.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Genome Sequence Analysis</h1>
          <p className="text-gray-600 dark:text-gray-300">Analyze DNA sequences using advanced BioPython algorithms</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* File Selection */}
          <Card className="transform transition-all duration-300 hover:shadow-lg">
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
                    onClick={() => toggleFileSelection(file)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-102 ${
                      selectedFiles.find(f => f.id === file.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{file.size} • {file.type}</p>
                        </div>
                      </div>
                      {selectedFiles.find(f => f.id === file.id) && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Types */}
          <Card className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Dna className="h-5 w-5 text-purple-600" />
                <span>Analysis Types</span>
              </CardTitle>
              <CardDescription>Select analysis methods to run</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisTypes.map((analysis) => (
                  <div
                    key={analysis.id}
                    onClick={() => toggleAnalysisSelection(analysis)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-102 ${
                      selectedAnalysis.find(a => a.id === analysis.id)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <analysis.icon className="h-6 w-6 text-purple-600 mt-1" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{analysis.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{analysis.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="secondary" className="text-xs">{analysis.complexity}</Badge>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {analysis.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      {selectedAnalysis.find(a => a.id === analysis.id) && (
                        <CheckCircle className="h-5 w-5 text-purple-600 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Start Analysis */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ready to Analyze</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedFiles.length} file(s) selected • {selectedAnalysis.length} analysis type(s) selected
                </p>
              </div>
              <Button
                onClick={startAnalysis}
                disabled={selectedFiles.length === 0 || selectedAnalysis.length === 0}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Running Analyses */}
        {runningAnalyses.length > 0 && (
          <Card className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-orange-600 animate-pulse" />
                <span>Analysis Progress</span>
              </CardTitle>
              <CardDescription>Real-time analysis execution status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {runningAnalyses.map((analysis) => (
                  <div key={analysis.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Analysis Job #{analysis.id}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {analysis.analyses.length} analysis type(s) on {analysis.files.length} file(s)
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={analysis.status === 'completed' ? 'success' : 'secondary'}>
                          {analysis.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                          {analysis.status === 'completed' ? 'Completed' : 'Running'}
                        </Badge>
                        {analysis.status === 'completed' && (
                          <Button
                            onClick={() => exportAnalysis(analysis)}
                            size="sm"
                            variant="outline"
                            className="ml-2 transform transition-all duration-300 hover:scale-105"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        )}
                      </div>
                    </div>
                    <Progress value={analysis.progress} />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">{Math.round(analysis.progress)}% complete</p>
                      {analysis.status === 'completed' && (
                        <p className="text-xs text-green-600 font-medium">Ready for export</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
