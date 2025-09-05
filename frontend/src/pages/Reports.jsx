import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { FileText, Download, Eye, Calendar, User, Share2, Filter, Check, Copy, X } from 'lucide-react';

const reportTemplates = [
  {
    id: 'comprehensive',
    name: 'Comprehensive Genomic Report',
    description: 'Complete analysis including variants, risks, and recommendations',
    sections: ['Patient Info', 'Sequence Analysis', 'Variant Detection', 'Risk Predictions', 'Clinical Recommendations'],
    estimatedPages: 12,
    generationTime: '5-8 minutes'
  },
  {
    id: 'clinical',
    name: 'Clinical Summary Report',
    description: 'Focused report for healthcare providers',
    sections: ['Key Findings', 'Risk Assessment', 'Clinical Actionability', 'Follow-up Recommendations'],
    estimatedPages: 6,
    generationTime: '3-5 minutes'
  },
  {
    id: 'research',
    name: 'Research Data Export',
    description: 'Detailed data export for research purposes',
    sections: ['Raw Data', 'Statistical Analysis', 'Variant Annotations', 'Population Comparisons'],
    estimatedPages: 8,
    generationTime: '2-4 minutes'
  }
];

const existingReports = [
  {
    id: 1,
    name: 'Comprehensive Analysis - John Doe',
    type: 'Comprehensive',
    generatedDate: '2024-01-15',
    status: 'Ready',
    fileSize: '2.4 MB',
    pages: 12,
    downloads: 3
  },
  {
    id: 2,
    name: 'Clinical Summary - Family Study',
    type: 'Clinical',
    generatedDate: '2024-01-14',
    status: 'Ready',
    fileSize: '1.2 MB',
    pages: 6,
    downloads: 1
  },
  {
    id: 3,
    name: 'Research Export - Variant Analysis',
    type: 'Research',
    generatedDate: '2024-01-12',
    status: 'Generating',
    fileSize: '-',
    pages: 8,
    downloads: 0
  }
];

export default function Reports() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [reportTitle, setReportTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewReportDialog, setShowNewReportDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState('');
  const [copiedReportId, setCopiedReportId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Filter and sort states
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const handleNewReport = () => {
    setShowNewReportDialog(!showNewReportDialog);
    setSelectedTemplate(null);
    setReportTitle('');
  };

  const generateReport = () => {
    if (!selectedTemplate || !reportTitle) return;
    
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setSelectedTemplate(null);
      setReportTitle('');
      setShowNewReportDialog(false);
      setShowSuccessMessage('Report generated successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage('');
      }, 3000);
      
      // Add new report to existing reports list
      const newReport = {
        id: existingReports.length + 1,
        name: reportTitle,
        type: reportTemplates.find(t => t.id === selectedTemplate)?.name.split(' ')[0] || 'Custom',
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'Ready',
        fileSize: '1.8 MB',
        pages: reportTemplates.find(t => t.id === selectedTemplate)?.estimatedPages || 10,
        downloads: 0
      };
      
      // In a real app, this would update the backend
      console.log('New report generated:', newReport);
    }, 3000);
  };

  const handleDownloadPDF = (report) => {
    console.log(`Downloading PDF for: ${report.name}`);
    // Simulate PDF download
    const blob = new Blob([`PDF content for ${report.name}`], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '_').toLowerCase()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = (report) => {
    console.log(`Downloading CSV for: ${report.name}`);
    // Simulate CSV download
    const csvContent = `Report Name,Type,Generated Date,Status,File Size,Pages,Downloads\n${report.name},${report.type},${report.generatedDate},${report.status},${report.fileSize},${report.pages},${report.downloads}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '_').toLowerCase()}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowPreviewDialog(true);
  };

  const downloadFullReport = () => {
    console.log(`Downloading full report: ${selectedReport.name}`);
    // Create a comprehensive report content
    const reportContent = `
GENOMIC ANALYSIS REPORT
${selectedReport.name}
Generated: ${selectedReport.generatedDate}
Type: ${selectedReport.type}
Pages: ${selectedReport.pages}

=====================================
EXECUTIVE SUMMARY
=====================================

This comprehensive genomic analysis report contains detailed findings from whole genome sequencing and variant analysis. The report includes risk assessments, clinical recommendations, and actionable insights based on current scientific evidence.

=====================================
KEY FINDINGS
=====================================

Variant Analysis:
- Total variants identified: 2,847
- Pathogenic variants: 23
- Likely pathogenic variants: 156
- Variants of uncertain significance: 489
- Benign variants: 2,179

Risk Assessment:
- High-risk conditions identified: 1
- Moderate-risk conditions: 1
- Low-risk conditions: 2
- Pharmacogenomic insights: 15 medications analyzed

=====================================
CLINICAL RECOMMENDATIONS
=====================================

1. Enhanced screening for high-risk conditions
2. Genetic counseling consultation recommended
3. Family screening considerations
4. Lifestyle modifications based on genetic profile
5. Personalized medication protocols

=====================================
TECHNICAL DETAILS
=====================================

Sequencing Platform: Illumina NovaSeq 6000
Coverage: 30x average depth
Reference Genome: GRCh38/hg38
Pipeline Version: GATK 4.2.6
Analysis Date: ${selectedReport.generatedDate}

=====================================
DISCLAIMER
=====================================

This report is for research and educational purposes. Clinical decisions should always be made in consultation with qualified healthcare professionals.
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport.name.replace(/\s+/g, '_').toLowerCase()}_full_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowPreviewDialog(false);
    setShowSuccessMessage('Full report downloaded successfully!');
    setTimeout(() => setShowSuccessMessage(''), 3000);
  };

  const handleShareReport = (report) => {
    setSelectedReport(report);
    setShowShareDialog(true);
  };

  // State for share dialog
  const [shareEmail, setShareEmail] = useState('');

  const confirmShare = () => {
    if (!shareEmail.trim()) {
      setShowSuccessMessage('Please enter an email address');
      setTimeout(() => setShowSuccessMessage(''), 3000);
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shareEmail)) {
      setShowSuccessMessage('Please enter a valid email address');
      setTimeout(() => setShowSuccessMessage(''), 3000);
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowShareDialog(false);
      setShareEmail('');
      setShowSuccessMessage(`Report shared successfully with ${shareEmail}`);
      setTimeout(() => setShowSuccessMessage(''), 3000);
    }, 1500);
  };

  const applyFilters = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowFilterDialog(false);
      setShowSuccessMessage(`Filters applied: ${filterBy} status, sorted by ${sortBy}`);
      setTimeout(() => setShowSuccessMessage(''), 3000);
    }, 500);
  };

  const filteredReports = existingReports.filter(report => {
    if (filterBy === 'all') return true;
    return report.status.toLowerCase() === filterBy.toLowerCase();
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.generatedDate) - new Date(a.generatedDate);
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5" />
              <span>{showSuccessMessage}</span>
              <button 
                onClick={() => setShowSuccessMessage('')}
                className="ml-2 hover:bg-green-200 rounded-full p-1 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Report Generator</h1>
            <p className="text-gray-600 dark:text-gray-300">Generate comprehensive genomic analysis reports</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              className="bg-gradient-to-r from-green-600 to-blue-600 transform transition-all duration-200 hover:scale-105" 
              disabled={isGenerating}
              onClick={handleNewReport}
            >
              <FileText className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'New Report'}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Report Templates */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="transform transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
                <CardDescription>Choose from pre-configured report formats</CardDescription>
              </CardHeader>
              <CardContent>
                {!showNewReportDialog ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Click "New Report" to start generating a report</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reportTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id === selectedTemplate ? null : template.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-102 ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.description}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {template.sections.map((section, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {section}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                              <span>~{template.estimatedPages} pages</span>
                              <span>•</span>
                              <span>{template.generationTime}</span>
                            </div>
                          </div>
                          {selectedTemplate === template.id && (
                            <div className="ml-4">
                              <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                                <div className="h-2 w-2 bg-white rounded-full"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {selectedTemplate && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Report Configuration</h4>
                        <Input
                          placeholder="Enter report title..."
                          value={reportTitle}
                          onChange={(e) => setReportTitle(e.target.value)}
                          className="mb-4 transition-all duration-300 focus:scale-105"
                        />
                        <Button 
                          onClick={generateReport}
                          disabled={!reportTitle || isGenerating}
                          className="w-full transform transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                          {isGenerating ? 'Generating Report...' : 'Generate Report'}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Existing Reports */}
          <div>
            <Card className="transform transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Reports</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="transform transition-all duration-200 hover:scale-110"
                    onClick={() => setShowFilterDialog(true)}
                  >
                    <Filter className="h-4 w-4 text-gray-500" />
                  </Button>
                </CardTitle>
                <CardDescription>Your previously generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="p-3 border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-102 group">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">{report.name}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {report.type} • {report.pages} pages
                            </p>
                          </div>
                          <Badge 
                            variant={report.status === 'Ready' ? 'success' : 'secondary'}
                            className="transition-all duration-300 group-hover:scale-110 ml-2 flex-shrink-0"
                          >
                            {report.status}
                          </Badge>
                        </div>

                        <div className="flex items-center text-xs text-gray-500 space-x-3">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {report.generatedDate}
                          </span>
                          <span>{report.fileSize}</span>
                          <span>{report.downloads} downloads</span>
                        </div>

                        {report.status === 'Ready' && (
                          <div className="grid grid-cols-4 gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="transform transition-all duration-300 hover:scale-105 text-xs p-1"
                              onClick={() => handleDownloadPDF(report)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="transform transition-all duration-300 hover:scale-105 text-xs p-1"
                              onClick={() => handleDownloadCSV(report)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              CSV
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="transform transition-all duration-300 hover:scale-105 p-1"
                              onClick={() => handleViewReport(report)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="transform transition-all duration-300 hover:scale-105 p-1"
                              onClick={() => handleShareReport(report)}
                            >
                              {copiedReportId === report.id ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Share2 className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Report Preview */}
        {isGenerating && (
          <Card className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600 animate-pulse" />
                <span>Report Generation Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">Generating your comprehensive genomic report...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter Dialog */}
        <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter & Sort Reports</DialogTitle>
              <DialogDescription>
                Customize how your reports are displayed and organized
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Status</label>
                <select 
                  value={filterBy} 
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                >
                  <option value="all">All Status</option>
                  <option value="ready">Ready</option>
                  <option value="generating">Generating</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sort by</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                >
                  <option value="date">Date (Newest First)</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFilterDialog(false)}>
                Cancel
              </Button>
              <Button onClick={applyFilters} disabled={isProcessing}>
                {isProcessing ? (
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                ) : (
                  <Filter className="h-4 w-4 mr-2" />
                )}
                {isProcessing ? 'Applying...' : 'Apply Filters'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Report</DialogTitle>
              <DialogDescription>
                Send {selectedReport?.name} to colleagues or healthcare providers via email
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Report Details</label>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-2">
                  <div className="text-sm"><strong>Name:</strong> {selectedReport?.name}</div>
                  <div className="text-sm"><strong>Type:</strong> {selectedReport?.type}</div>
                  <div className="text-sm"><strong>Generated:</strong> {selectedReport?.generatedDate}</div>
                  <div className="text-sm"><strong>Pages:</strong> {selectedReport?.pages}</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Recipient Email</label>
                <Input 
                  placeholder="Enter email address..."
                  type="email" 
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
              </div>
              <div className="text-xs text-gray-600">
                * The report will be sent as a secure PDF attachment with access controls
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                Cancel
              </Button>
              <Button onClick={confirmShare} disabled={isProcessing || !shareEmail.trim()}>
                {isProcessing ? (
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                ) : (
                  <Share2 className="h-4 w-4 mr-2" />
                )}
                {isProcessing ? 'Sharing...' : 'Share Report'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report Preview</DialogTitle>
              <DialogDescription>
                Quick overview of {selectedReport?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Report Name</label>
                    <div className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      {selectedReport.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <div className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      {selectedReport.type}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pages</label>
                    <div className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      {selectedReport.pages}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Generated</label>
                    <div className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      {selectedReport.generatedDate}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Report Summary</label>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      This genomic analysis report contains comprehensive findings from the sequencing and variant analysis process. 
                      Key findings include variant identification, risk assessments, and clinical recommendations.
                    </p>
                    <div className="mt-3 space-y-1">
                      <div className="text-xs text-gray-500">• Total variants identified: 2,847</div>
                      <div className="text-xs text-gray-500">• Pathogenic variants: 23</div>
                      <div className="text-xs text-gray-500">• Benign variants: 2,689</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
                Close
              </Button>
              <Button onClick={downloadFullReport}>
                <Download className="h-4 w-4 mr-2" />
                Download Full Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}