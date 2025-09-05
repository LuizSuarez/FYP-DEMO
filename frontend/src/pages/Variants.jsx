import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dna,
  Search,
  Download,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';

const mutations = [
  { id: "rs123456", gene: "BRCA1", chromosome: "17", position: "41197694", type: "SNP", effect: "Missense", significance: "Pathogenic", frequency: "0.002" },
  { id: "rs789012", gene: "APOE", chromosome: "19", position: "45411941", type: "SNP", effect: "Synonymous", significance: "Benign", frequency: "0.132" },
  { id: "rs345678", gene: "TP53", chromosome: "17", position: "7577120", type: "Deletion", effect: "Frameshift", significance: "Likely Pathogenic", frequency: "0.001" }
];

const geneLocations = [
  { gene: "BRCA1", chromosome: "17", start: "41196312", end: "41277500", variants: 12 },
  { gene: "BRCA2", chromosome: "13", start: "32315508", end: "32400266", variants: 8 },
  { gene: "TP53", chromosome: "17", start: "7565097", end: "7590856", variants: 15 },
  { gene: "APOE", chromosome: "19", start: "45409039", end: "45412650", variants: 5 }
];

export default function Analysis() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const getSignificanceColor = (significance) => {
    switch (significance.toLowerCase()) {
      case "pathogenic":
        return "bg-red-100 text-red-800 border-red-200";
      case "likely pathogenic":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "benign":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    console.log('Filter panel opened');
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const blob = new Blob(['Mutation analysis data exported'], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mutation_analysis.csv';
      a.click();
      URL.revokeObjectURL(url);
    }, 2000);
  };

  const handleViewDetails = (mutation) => {
    console.log('Viewing details for mutation:', mutation.id);
    window.open(`https://www.ncbi.nlm.nih.gov/snp/${mutation.id}`, '_blank');
  };

  const handleLiterature = (mutation) => {
    console.log('Searching literature for:', mutation.gene);
    window.open(`https://pubmed.ncbi.nlm.nih.gov/?term=${mutation.gene}+mutation`, '_blank');
  };

  const handleLaunchGenomeBrowser = () => {
    console.log('Launching genome browser');
    window.open('https://genome.ucsc.edu/', '_blank');
  };

  const handleViewOnGenome = (gene) => {
    console.log('Viewing gene on genome:', gene.gene);
    window.open(`https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&position=chr${gene.chromosome}:${gene.start}-${gene.end}`, '_blank');
  };

  const handleGeneratePDF = (reportType) => {
    console.log('Generating PDF for:', reportType);
    setTimeout(() => {
      const blob = new Blob([`${reportType} report content`], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType.toLowerCase().replace(' ', '_')}_report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const handleDownloadCSV = () => {
    console.log('Downloading CSV data');
    const csvContent = mutations.map(m => `${m.id},${m.gene},${m.chromosome},${m.position},${m.type},${m.effect},${m.significance},${m.frequency}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'raw_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mutation & SNP Analysis</h1>
            <p className="text-gray-600">Comprehensive analysis of genetic variants and mutations</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleFilter}
              className="bg-indigo-600 text-white hover:bg-indigo-700 transform transition-all duration-200 hover:scale-105"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExport}
              disabled={isExporting}
              className="bg-indigo-600 text-white hover:bg-indigo-700 transform transition-all duration-200 hover:scale-105"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Variants</CardTitle>
              <Dna className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-gray-600">+124 from previous analysis</p>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pathogenic</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">23</div>
              <p className="text-xs text-gray-600">Require attention</p>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Benign</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">2,689</div>
              <p className="text-xs text-gray-600">No clinical significance</p>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coverage</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.7%</div>
              <p className="text-xs text-gray-600">Genome coverage</p>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Tabs */}
        <Tabs defaultValue="mutations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mutations">Mutations</TabsTrigger>
            <TabsTrigger value="genome">Genome View</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="mutations">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Mutations List */}
              <Card className="lg:col-span-2 transform transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Detected Mutations</CardTitle>
                  <CardDescription>Significant genetic variants requiring review</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mutations.map((mutation, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{mutation.id}</h4>
                            <p className="text-sm text-gray-600">
                              {mutation.gene} • Chr{mutation.chromosome}:{mutation.position}
                            </p>
                          </div>
                          <Badge variant="outline" className={getSignificanceColor(mutation.significance)}>
                            {mutation.significance}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div><span className="text-gray-600">Type:</span><div className="font-medium">{mutation.type}</div></div>
                          <div><span className="text-gray-600">Effect:</span><div className="font-medium">{mutation.effect}</div></div>
                          <div><span className="text-gray-600">Frequency:</span><div className="font-medium">{mutation.frequency}</div></div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(mutation)}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 transform transition-all duration-200 hover:scale-105"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleLiterature(mutation)}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 transform transition-all duration-200 hover:scale-105"
                          >
                            <Search className="h-3 w-3 mr-1" />
                            Literature
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Summary */}
              <Card className="transform transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Analysis Summary</CardTitle>
                  <CardDescription>Key findings and recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Quality Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span>Read Depth</span><span>45x</span></div>
                      <Progress value={90} />
                      <div className="flex justify-between text-sm"><span>Mapping Quality</span><span>Q42</span></div>
                      <Progress value={85} />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Variant Distribution</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>SNPs</span><span className="font-medium">2,654</span></div>
                      <div className="flex justify-between"><span>Insertions</span><span className="font-medium">98</span></div>
                      <div className="flex justify-between"><span>Deletions</span><span className="font-medium">95</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Review pathogenic variants with geneticist</p>
                      <p>• Consider family history analysis</p>
                      <p>• Schedule follow-up in 6 months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="genome">
            <Card className="transform transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Interactive Genome Viewer</CardTitle>
                <CardDescription>Visualize gene locations and variant distributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg border bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                  <div className="bg-white/90 rounded-lg p-6 text-center shadow-xl">
                    <Dna className="mx-auto h-12 w-12 text-blue-600 mb-4 animate-spin" />
                    <h3 className="text-lg font-semibold mb-2">Genome Visualization</h3>
                    <p className="text-gray-600 mb-4">Interactive chromosome view with variant mapping</p>
                    <Button 
                      className="bg-indigo-600 text-white hover:bg-indigo-700 transform transition-all duration-200 hover:scale-105"
                      onClick={handleLaunchGenomeBrowser}
                    >
                      Launch Genome Browser
                    </Button>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <h4 className="font-medium">Gene Locations</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {geneLocations.map((gene, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{gene.gene}</h5>
                          <Badge variant="outline">
                            <MapPin className="h-3 w-3 mr-1" />
                            Chr{gene.chromosome}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Position: {gene.start} - {gene.end}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{gene.variants} variants found</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewOnGenome(gene)}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 transform transition-all duration-200 hover:scale-105"
                          >
                            View on Genome
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="transform transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Analysis Reports</CardTitle>
                <CardDescription>Generate and download comprehensive reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {["Variant Report", "Clinical Summary", "Raw Data"].map((report, idx) => (
                    <Card key={idx} className="border-dashed border-2 hover:border-blue-500 transition-all duration-300 cursor-pointer transform hover:scale-105">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <Download className="h-8 w-8 text-gray-600 mb-2" />
                        <h4 className="font-medium mb-1">{report}</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          {report === "Variant Report" ? "Comprehensive variant analysis" :
                           report === "Clinical Summary" ? "Clinician-ready summary" :
                           "Export processed variants"}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => report === "Raw Data" ? handleDownloadCSV() : handleGeneratePDF(report)}
                          className="bg-indigo-600 text-white hover:bg-indigo-700 transform transition-all duration-200 hover:scale-105"
                        >
                          {report === "Raw Data" ? "Download CSV" : "Generate PDF"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}