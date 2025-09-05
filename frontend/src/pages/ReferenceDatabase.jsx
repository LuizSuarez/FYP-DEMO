import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Search, Database, ExternalLink, RefreshCw, Download, AlertCircle, CheckCircle, Clock, Info, Globe, Activity } from 'lucide-react';

const referenceDataSources = [
  {
    name: "ClinVar",
    description: "Clinical variant interpretations and pathogenicity classifications",
    status: "Connected",
    url: "https://www.ncbi.nlm.nih.gov/clinvar/",
    records: "2.1M variants",
    lastUpdate: "2024-01-20",
    reliability: 98,
    apiStatus: "Active",
    color: "green"
  },
  {
    name: "NCBI",
    description: "National Center for Biotechnology Information genomic database",
    status: "Connected", 
    url: "https://www.ncbi.nlm.nih.gov/",
    records: "850M sequences",
    lastUpdate: "2024-01-20",
    reliability: 99,
    apiStatus: "Active",
    color: "blue"
  },
  {
    name: "Ensembl",
    description: "Genome annotation and comparative genomics database",
    status: "Connected",
    url: "https://www.ensembl.org/",
    records: "65K genomes",
    lastUpdate: "2024-01-19", 
    reliability: 97,
    apiStatus: "Active",
    color: "purple"
  },
  {
    name: "dbSNP",
    description: "Single Nucleotide Polymorphism database",
    status: "Connected",
    url: "https://www.ncbi.nlm.nih.gov/snp/",
    records: "150M SNPs",
    lastUpdate: "2024-01-18",
    reliability: 96,
    apiStatus: "Active",
    color: "orange"
  }
];

const mockVariantData = [
  {
    id: "rs1234567",
    gene: "BRCA1",
    position: "chr17:41197794",
    variant: "c.68_69delAG",
    pathogenicity: "Pathogenic",
    confidence: 95,
    source: "ClinVar",
    description: "Frameshift variant associated with hereditary breast cancer",
    clinicalSignificance: "High",
    frequency: "0.001%",
    references: 15,
    lastReviewed: "2024-01-15"
  },
  {
    id: "rs7654321", 
    gene: "APOE",
    position: "chr19:45411941",
    variant: "c.334T>C",
    pathogenicity: "Risk Factor",
    confidence: 88,
    source: "NCBI",
    description: "Associated with increased Alzheimer's disease risk",
    clinicalSignificance: "Moderate",
    frequency: "0.25%",
    references: 23,
    lastReviewed: "2024-01-10"
  },
  {
    id: "rs9876543",
    gene: "CFTR", 
    position: "chr7:117199644",
    variant: "c.1521_1523delCTT",
    pathogenicity: "Pathogenic",
    confidence: 97,
    source: "Ensembl",
    description: "Delta F508 deletion causing cystic fibrosis",
    clinicalSignificance: "High",
    frequency: "0.03%",
    references: 31,
    lastReviewed: "2024-01-12"
  }
];

const recentQueries = [
  { query: "BRCA1 pathogenic variants", results: 1247, timestamp: "2024-01-20 14:30", source: "ClinVar" },
  { query: "Alzheimer's risk SNPs", results: 89, timestamp: "2024-01-20 13:15", source: "NCBI" },
  { query: "Cystic fibrosis mutations", results: 342, timestamp: "2024-01-20 11:45", source: "Ensembl" }
];

const apiEndpoints = [
  {
    name: "ClinVar Variant Search",
    endpoint: "/api/clinvar/variants",
    description: "Search clinical variants by gene or condition",
    status: "Active",
    lastCall: "2024-01-20 14:35"
  },
  {
    name: "NCBI Gene Lookup",
    endpoint: "/api/ncbi/genes",
    description: "Retrieve gene information and sequences",
    status: "Active", 
    lastCall: "2024-01-20 14:20"
  },
  {
    name: "Ensembl Genome Browser",
    endpoint: "/api/ensembl/genome",
    description: "Access genome annotations and comparisons",
    status: "Active",
    lastCall: "2024-01-20 13:58"
  }
];

export default function ReferenceDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState('all');
  const [activeTab, setActiveTab] = useState('search');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    // Simulate API call with loading delay
    setTimeout(() => {
      const filteredResults = mockVariantData.filter(variant => 
        variant.gene.toLowerCase().includes(searchQuery.toLowerCase()) ||
        variant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        variant.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredResults);
      setIsLoading(false);
    }, 1500);
  };

  const getPathogenicityColor = (pathogenicity) => {
    switch(pathogenicity) {
      case 'Pathogenic': return 'bg-red-100 text-red-700 border-red-200';
      case 'Risk Factor': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Benign': return 'bg-green-100 text-green-700 border-green-200';
      case 'Uncertain': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Connected': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Syncing': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'Error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Layout>
      <div className="flex-1 space-y-6 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reference Database</h1>
            <p className="text-gray-600 dark:text-gray-300">Access global genomic databases for variant validation and gene information</p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All Databases
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search">Search & Query</TabsTrigger>
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="apis">API Integration</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            {/* Search Interface */}
            <Card className="transform transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  <span>Search Reference Databases</span>
                </CardTitle>
                <CardDescription>Query variant data across ClinVar, NCBI, Ensembl, and dbSNP databases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by gene name, variant ID, or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10"
                    />
                  </div>
                  <select 
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Sources</option>
                    <option value="clinvar">ClinVar</option>
                    <option value="ncbi">NCBI</option>
                    <option value="ensembl">Ensembl</option>
                    <option value="dbsnp">dbSNP</option>
                  </select>
                  <Button 
                    onClick={handleSearch} 
                    disabled={isLoading || !searchQuery.trim()}
                    className="bg-blue-600 hover:bg-blue-700 transform transition-all duration-300 hover:scale-105"
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Quick Search Buttons */}
                <div className="flex flex-wrap gap-2">
                  {['BRCA1', 'BRCA2', 'TP53', 'CFTR', 'APOE', 'MTHFR', 'ACE', 'ACTN3'].map((gene) => (
                    <Button 
                      key={gene}
                      variant="outline" 
                      size="sm"
                      onClick={() => { setSearchQuery(gene); handleSearch(); }}
                      className="transform transition-all duration-300 hover:scale-105"
                    >
                      {gene}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card className="transform transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                  <CardDescription>Found {searchResults.length} variants matching your query</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {searchResults.map((variant, index) => (
                      <div key={index} className="border rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:bg-blue-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
                            <div>
                              <h4 className="font-semibold text-lg">{variant.gene} - {variant.id}</h4>
                              <p className="text-sm text-gray-600">{variant.position}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={getPathogenicityColor(variant.pathogenicity)}>
                              {variant.pathogenicity}
                            </Badge>
                            <Badge variant="outline">
                              {variant.source}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Variant:</p>
                            <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{variant.variant}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Frequency:</p>
                            <p className="text-sm">{variant.frequency}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">References:</p>
                            <p className="text-sm">{variant.references} publications</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Last Reviewed:</p>
                            <p className="text-sm">{variant.lastReviewed}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{variant.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center space-x-1">
                              <Database className="h-3 w-3" />
                              <span>Source: {variant.source}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Info className="h-3 w-3" />
                              <span>Confidence: {variant.confidence}%</span>
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="transform transition-all duration-300 hover:scale-105">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Source
                            </Button>
                            <Button variant="outline" size="sm" className="transform transition-all duration-300 hover:scale-105">
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Queries */}
            <Card className="transform transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Recent Database Queries</CardTitle>
                <CardDescription>Your latest searches across reference databases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentQueries.map((query, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg transition-all duration-300 hover:bg-blue-50 hover:scale-102">
                      <div className="flex-1">
                        <p className="font-medium">{query.query}</p>
                        <p className="text-sm text-gray-600">{query.results} results • {query.timestamp} • {query.source}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSearchQuery(query.query)}
                        className="transform transition-all duration-300 hover:scale-105"
                      >
                        Repeat
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Sources Tab */}
          <TabsContent value="sources" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {referenceDataSources.map((source, index) => (
                <Card key={index} className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(source.status)}
                        <Badge variant="outline" className={`text-${source.color}-700 border-${source.color}-200`}>
                          {source.apiStatus}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{source.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Records:</span>
                        <p className="font-medium">{source.records}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Reliability:</span>
                        <p className="font-medium text-green-600">{source.reliability}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Update:</span>
                        <p className="font-medium">{source.lastUpdate}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <p className="font-medium text-green-600">{source.status}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 transform transition-all duration-300 hover:scale-105"
                        onClick={() => window.open(source.url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Visit Database
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="transform transition-all duration-300 hover:scale-105"
                      >
                        <RefreshCw className="h-3 w-3 mr-2" />
                        Sync
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* API Integration Tab */}
          <TabsContent value="apis" className="space-y-6">
            <Card className="transform transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span>API Integration Status</span>
                </CardTitle>
                <CardDescription>Real-time connection status with external genomic databases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiEndpoints.map((api, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:bg-blue-50">
                      <div className="flex items-center space-x-4">
                        <Activity className="h-6 w-6 text-green-600" />
                        <div>
                          <h4 className="font-medium">{api.name}</h4>
                          <p className="text-sm text-gray-600">{api.description}</p>
                          <p className="text-xs text-gray-500 font-mono">{api.endpoint}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-700 mb-2">
                          {api.status}
                        </Badge>
                        <p className="text-xs text-gray-500">Last call: {api.lastCall}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* API Configuration */}
            <Card className="transform transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Configure database connection settings and rate limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Request Timeout:</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="30">30 seconds</option>
                      <option value="60">60 seconds</option>
                      <option value="120">2 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Rate Limit:</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="10">10 requests/minute</option>
                      <option value="50">50 requests/minute</option>
                      <option value="100">100 requests/minute</option>
                    </select>
                  </div>
                </div>
                <Button className="transform transition-all duration-300 hover:scale-105">
                  Update API Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-6">
            {/* Database Statistics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Variants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">3.15M</div>
                  <p className="text-xs text-gray-600">Across all databases</p>
                </CardContent>
              </Card>

              <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pathogenic Variants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">47.8K</div>
                  <p className="text-xs text-gray-600">Clinically significant</p>
                </CardContent>
              </Card>

              <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Genes Covered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">20.1K</div>
                  <p className="text-xs text-gray-600">Protein-coding genes</p>
                </CardContent>
              </Card>

              <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Data Freshness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">12h</div>
                  <p className="text-xs text-green-600">Last synchronized</p>
                </CardContent>
              </Card>
            </div>

            {/* Usage Analytics */}
            <Card className="transform transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Database Usage Analytics</CardTitle>
                <CardDescription>Your query patterns and database utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">247</div>
                    <p className="text-sm text-gray-600">Total Queries This Month</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">ClinVar</div>
                    <p className="text-sm text-gray-600">Most Used Database</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">1.2s</div>
                    <p className="text-sm text-gray-600">Average Response Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}