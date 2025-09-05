import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
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
  Dna,
  Share,
  BookOpen,
  CheckCircle,
  X
} from "lucide-react";

const diseaseRisks = [
  {
    disease: "Type 2 Diabetes",
    risk: "Low",
    percentage: 15,
    populationAverage: 25,
    genes: ["TCF7L2", "PPARG", "KCNJ11"],
    recommendations: [
      "Maintain healthy weight",
      "Regular exercise routine",
      "Monitor blood glucose annually"
    ],
    riskLevel: "low"
  },
  {
    disease: "Cardiovascular Disease", 
    risk: "Moderate",
    percentage: 35,
    populationAverage: 30,
    genes: ["APOE", "LDL", "PCSK9"],
    recommendations: [
      "Monitor cholesterol levels",
      "Consider statins after 40",
      "Mediterranean diet recommended"
    ],
    riskLevel: "moderate"
  },
  {
    disease: "Alzheimer's Disease",
    risk: "Low",
    percentage: 12,
    populationAverage: 15,
    genes: ["APOE4", "TREM2", "CLU"],
    recommendations: [
      "Cognitive stimulation activities",
      "Regular physical exercise",
      "Social engagement maintenance"
    ],
    riskLevel: "low"
  },
  {
    disease: "Breast Cancer",
    risk: "High",
    percentage: 65,
    populationAverage: 12,
    genes: ["BRCA1", "BRCA2", "TP53"],
    recommendations: [
      "Enhanced screening protocol",
      "Genetic counseling advised",
      "Preventive options discussion"
    ],
    riskLevel: "high"
  }
];

const pharmacogenomics = [
  {
    drug: "Warfarin",
    gene: "CYP2C9",
    recommendation: "Standard Dosing",
    confidence: 95,
    notes: "Normal metabolism expected"
  },
  {
    drug: "Clopidogrel",
    gene: "CYP2C19",
    recommendation: "Alternative Therapy",
    confidence: 87,
    notes: "Poor metabolizer - reduced efficacy"
  },
  {
    drug: "Simvastatin",
    gene: "SLCO1B1",
    recommendation: "Reduced Dose",
    confidence: 92,
    notes: "Increased risk of myopathy"
  }
];

export default function Predictions() {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showTimelineDialog, setShowTimelineDialog] = useState(false);
  const [showLearnMoreDialog, setShowLearnMoreDialog] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedEducationContent, setSelectedEducationContent] = useState(null);
  const [doctorEmail, setDoctorEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [updateFrequency, setUpdateFrequency] = useState('monthly');
  const [nextUpdateDate, setNextUpdateDate] = useState('2024-02-15');
  const [exportOptions, setExportOptions] = useState({
    diseaseRisk: true,
    pharmacogenomic: true,
    lifestyle: true,
    rawData: false
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const getRiskColor = (level) => {
    switch (level) {
      case "high":
        return "text-red-600";
      case "moderate":
        return "text-orange-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getRiskBadgeColor = (level) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "moderate":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleExportReport = () => {
    const selectedOptions = Object.entries(exportOptions)
      .filter(([key, value]) => value);
    
    if (selectedOptions.length === 0) {
      setShowSuccessMessage('Please select at least one option to export');
      setTimeout(() => setShowSuccessMessage(''), 3000);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const reportData = {
        timestamp: new Date().toISOString(),
        options: selectedOptions.map(([key, value]) => key),
        diseaseRisks: exportOptions.diseaseRisk ? diseaseRisks : null,
        pharmacogenomics: exportOptions.pharmacogenomic ? pharmacogenomics : null
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `genetic_risk_report_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      setIsProcessing(false);
      setShowExportDialog(false);
      setShowSuccessMessage('Report exported successfully!');
      setTimeout(() => setShowSuccessMessage(''), 3000);
    }, 2000);
  };

  const handleScheduleUpdate = () => {
    if (!nextUpdateDate) {
      setShowSuccessMessage('Please select a valid update date');
      setTimeout(() => setShowSuccessMessage(''), 3000);
      return;
    }

    const selectedDate = new Date(nextUpdateDate);
    const today = new Date();
    if (selectedDate <= today) {
      setShowSuccessMessage('Please select a future date');
      setTimeout(() => setShowSuccessMessage(''), 3000);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowScheduleDialog(false);
      setShowSuccessMessage(`Risk assessment update scheduled for ${nextUpdateDate} (${updateFrequency})`);
      setTimeout(() => setShowSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleShareWithDoctor = (disease) => {
    setSelectedDisease(disease);
    setDoctorEmail('');
    setShareMessage('');
    setShowShareDialog(true);
  };

  const confirmShare = () => {
    if (!doctorEmail.trim()) {
      setShowSuccessMessage('Please enter a doctor\'s email address');
      setTimeout(() => setShowSuccessMessage(''), 3000);
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(doctorEmail)) {
      setShowSuccessMessage('Please enter a valid email address');
      setTimeout(() => setShowSuccessMessage(''), 3000);
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowShareDialog(false);
      setSelectedDisease(null);
      setDoctorEmail('');
      setShareMessage('');
      setShowSuccessMessage(`Risk assessment for ${selectedDisease?.disease} shared with ${doctorEmail}`);
      setTimeout(() => setShowSuccessMessage(''), 3000);
    }, 1500);
  };

  const handleLearnMore = (disease) => {
    const educationContent = {
      disease: disease.disease || disease,
      genes: disease.genes || [],
      overview: `${disease.disease || disease} is a complex condition influenced by multiple genetic and environmental factors. Understanding your genetic predisposition helps in making informed healthcare decisions.`,
      geneticFactors: disease.genes || [],
      riskFactors: disease.recommendations || [
        "Maintain healthy lifestyle",
        "Regular medical check-ups",
        "Follow evidence-based guidelines"
      ],
      resources: [
        "National Institutes of Health (NIH) Genetics Home Reference",
        "American College of Medical Genetics (ACMG) Guidelines", 
        "International Society for Genetic Medicine Resources",
        "PubMed peer-reviewed research articles"
      ],
      clinicalGuidelines: [
        "Consult with genetic counselor for detailed interpretation",
        "Discuss results with primary healthcare provider",
        "Consider additional screening based on risk level",
        "Regular monitoring as recommended by guidelines"
      ]
    };
    
    setSelectedEducationContent(educationContent);
    setShowLearnMoreDialog(true);
  };

  const launchTimelineView = () => {
    setShowTimelineDialog(true);
  };

  const handleExportTimeline = () => {
    const timelineData = {
      diseases: diseaseRisks.map(disease => ({
        name: disease.disease,
        currentRisk: disease.percentage,
        ageProgression: Array.from({length: 61}, (_, i) => ({
          age: 20 + i,
          risk: Math.min(100, disease.percentage + (i * 0.5))
        }))
      }))
    };
    
    const blob = new Blob([JSON.stringify(timelineData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk_timeline_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setShowTimelineDialog(false);
    setShowSuccessMessage('Timeline data exported successfully!');
    setTimeout(() => setShowSuccessMessage(''), 3000);
  };

  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
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
            <h1 className="text-3xl font-bold">Disease Risk Predictions</h1>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered health risk assessments based on your genetic profile
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowScheduleDialog(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Update
            </Button>
            <Button variant="outline" onClick={() => setShowExportDialog(true)}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Risk Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">1</div>
              <p className="text-xs text-gray-600">
                Requires immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moderate Risk</CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">1</div>
              <p className="text-xs text-gray-600">
                Monitor and prevent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Risk</CardTitle>
              <Heart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">2</div>
              <p className="text-xs text-gray-600">
                Maintain current health
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Model Confidence</CardTitle>
              <Brain className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-gray-600">
                Prediction accuracy
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="diseases" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="diseases">Disease Risks</TabsTrigger>
            <TabsTrigger value="pharmacogenomics">Drug Response</TabsTrigger>
            <TabsTrigger value="timeline">Risk Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="diseases">
            <div className="space-y-6">
              {diseaseRisks.map((disease, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{disease.disease}</CardTitle>
                        <CardDescription>
                          Based on {disease.genes.length} genetic variants
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="outline"
                        className={getRiskBadgeColor(disease.riskLevel)}
                      >
                        {disease.risk} Risk
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Risk Comparison */}
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
                            <Progress 
                              value={disease.percentage} 
                              className="h-2"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Population Average</span>
                              <span className="font-medium text-gray-600">
                                {disease.populationAverage}%
                              </span>
                            </div>
                            <Progress 
                              value={disease.populationAverage} 
                              className="h-2 opacity-50"
                            />
                          </div>
                          
                          <div className="text-xs text-gray-600">
                            {disease.percentage > disease.populationAverage ? (
                              <span className="text-orange-600">
                                ↑ {((disease.percentage / disease.populationAverage - 1) * 100).toFixed(0)}% above average
                              </span>
                            ) : (
                              <span className="text-green-600">
                                ↓ {((1 - disease.percentage / disease.populationAverage) * 100).toFixed(0)}% below average
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-4">Contributing Genes</h4>
                        <div className="space-y-2">
                          {disease.genes.map((gene, geneIndex) => (
                            <div key={geneIndex} className="flex items-center justify-between p-2 border rounded">
                              <span className="font-mono text-sm">{gene}</span>
                              <Button variant="ghost" size="sm" onClick={() => handleLearnMore(disease)}>
                                <Info className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-medium mb-4">Personalized Recommendations</h4>
                      <div className="grid gap-2 md:grid-cols-3">
                        {disease.recommendations.map((rec, recIndex) => (
                          <div key={recIndex} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                            <p className="text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Brain className="h-4 w-4" />
                        <span>Last updated: January 15, 2024</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleLearnMore(disease)}>
                          <BookOpen className="h-4 w-4 mr-1" />
                          Learn More
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleShareWithDoctor(disease)}>
                          <Share className="h-4 w-4 mr-1" />
                          Share with Doctor
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pharmacogenomics">
            <Card>
              <CardHeader>
                <CardTitle>Pharmacogenomic Profile</CardTitle>
                <CardDescription>
                  How your genes affect drug metabolism and efficacy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {pharmacogenomics.map((drug, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{drug.drug}</h4>
                          <p className="text-sm text-gray-600">
                            Gene: {drug.gene}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="outline"
                            className={
                              drug.recommendation.includes("Standard") ? "border-green-200 text-green-700 bg-green-50" :
                              drug.recommendation.includes("Reduced") ? "border-orange-200 text-orange-700 bg-orange-50" :
                              "border-red-200 text-red-700 bg-red-50"
                            }
                          >
                            {drug.recommendation}
                          </Badge>
                          <p className="text-xs text-gray-600 mt-1">
                            {drug.confidence}% confidence
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                        <p className="text-sm">{drug.notes}</p>
                      </div>
                      
                      <div className="mt-3 flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => handleLearnMore({ disease: drug.drug, genes: [drug.gene], recommendations: [drug.notes] })}>
                          <Info className="h-3 w-3 mr-1" />
                          Clinical Guidelines
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Risk Development Timeline</CardTitle>
                <CardDescription>
                  How your disease risks may change over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Risk Timeline Visualization</h3>
                    <p className="text-gray-600 mb-4">
                      Interactive timeline showing risk evolution by age
                    </p>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600" onClick={launchTimelineView}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Launch Timeline View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Export Dialog */}
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Risk Assessment Report</DialogTitle>
              <DialogDescription>
                Generate a comprehensive report of your genetic risk predictions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={exportOptions.diseaseRisk}
                    onChange={(e) => setExportOptions(prev => ({...prev, diseaseRisk: e.target.checked}))}
                    className="rounded" 
                  />
                  <span className="text-sm">Disease Risk Predictions</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={exportOptions.pharmacogenomic}
                    onChange={(e) => setExportOptions(prev => ({...prev, pharmacogenomic: e.target.checked}))}
                    className="rounded" 
                  />
                  <span className="text-sm">Pharmacogenomic Profile</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={exportOptions.lifestyle}
                    onChange={(e) => setExportOptions(prev => ({...prev, lifestyle: e.target.checked}))}
                    className="rounded" 
                  />
                  <span className="text-sm">Lifestyle Recommendations</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={exportOptions.rawData}
                    onChange={(e) => setExportOptions(prev => ({...prev, rawData: e.target.checked}))}
                    className="rounded" 
                  />
                  <span className="text-sm">Raw Genetic Data</span>
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleExportReport} disabled={isProcessing}>
                {isProcessing ? (
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isProcessing ? 'Generating...' : 'Export Report'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Schedule Dialog */}
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Risk Assessment Update</DialogTitle>
              <DialogDescription>
                Set up automatic updates for your genetic risk predictions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Update Frequency</label>
                <select 
                  value={updateFrequency}
                  onChange={(e) => setUpdateFrequency(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="biannually">Every 6 months</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Next Update Date</label>
                <input 
                  type="date" 
                  value={nextUpdateDate}
                  onChange={(e) => setNextUpdateDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleUpdate} disabled={isProcessing}>
                {isProcessing ? (
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                ) : (
                  <Calendar className="h-4 w-4 mr-2" />
                )}
                {isProcessing ? 'Scheduling...' : 'Schedule Update'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share with Healthcare Provider</DialogTitle>
              <DialogDescription>
                Share {selectedDisease?.disease} risk assessment with your doctor
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Doctor's Email</label>
                <Input 
                  placeholder="doctor@example.com" 
                  type="email" 
                  value={doctorEmail}
                  onChange={(e) => setDoctorEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded-lg resize-none h-20 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                  placeholder="Add a personal message for your healthcare provider..."
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                Cancel
              </Button>
              <Button onClick={confirmShare} disabled={isProcessing || !doctorEmail.trim()}>
                {isProcessing ? (
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                ) : (
                  <Share className="h-4 w-4 mr-2" />
                )}
                {isProcessing ? 'Sharing...' : 'Share Report'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Learn More Dialog */}
        <Dialog open={showLearnMoreDialog} onOpenChange={setShowLearnMoreDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Learn More: {selectedEducationContent?.disease}</DialogTitle>
              <DialogDescription>
                Educational information and resources about this condition
              </DialogDescription>
            </DialogHeader>
            {selectedEducationContent && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <h4 className="font-medium mb-2">Overview</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    {selectedEducationContent.overview}
                  </p>
                </div>
                
                {selectedEducationContent.geneticFactors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Key Genetic Factors</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedEducationContent.geneticFactors.map((gene, index) => (
                        <div key={index} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border">
                          <span className="font-mono text-sm">{gene}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Prevention & Management</h4>
                  <ul className="space-y-1">
                    {selectedEducationContent.riskFactors.map((factor, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Clinical Guidelines</h4>
                  <ul className="space-y-1">
                    {selectedEducationContent.clinicalGuidelines.map((guideline, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Additional Resources</h4>
                  <div className="space-y-2">
                    {selectedEducationContent.resources.map((resource, index) => (
                      <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                        {resource}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLearnMoreDialog(false)}>
                Close
              </Button>
              <Button onClick={() => {
                const content = `Educational Information: ${selectedEducationContent?.disease}\n\n${JSON.stringify(selectedEducationContent, null, 2)}`;
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedEducationContent?.disease.toLowerCase().replace(/\s+/g, '_')}_education.txt`;
                a.click();
                URL.revokeObjectURL(url);
                setShowSuccessMessage('Educational resources downloaded');
                setTimeout(() => setShowSuccessMessage(''), 3000);
              }}>
                <Download className="h-4 w-4 mr-2" />
                Download Info
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Timeline Dialog */}
        <Dialog open={showTimelineDialog} onOpenChange={setShowTimelineDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Risk Timeline Visualization</DialogTitle>
              <DialogDescription>
                Interactive timeline showing how your disease risks evolve with age
              </DialogDescription>
            </DialogHeader>
            <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 flex items-center justify-center dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="text-center">
                <TrendingUp className="mx-auto h-16 w-16 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Timeline Visualization</h3>
                <p className="text-gray-600 mb-4">
                  This feature shows risk progression from age 20 to 80 based on your genetic profile
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <p className="font-medium">Current Age Risk</p>
                    <p className="text-blue-600">Baseline established</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <p className="font-medium">Future Projections</p>
                    <p className="text-purple-600">Trend analysis ready</p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTimelineDialog(false)}>
                Close
              </Button>
              <Button onClick={handleExportTimeline}>
                <Download className="h-4 w-4 mr-2" />
                Export Timeline
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <FloatingChatbot />
    </Layout>
  );
}