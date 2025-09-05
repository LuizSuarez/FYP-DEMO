import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { BarChart3, PieChart, Activity, Download, Eye, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

const gcContentData = [
  { region: 'Exon 1', gc: 45.2, at: 54.8 },
  { region: 'Intron 1', gc: 38.7, at: 61.3 },
  { region: 'Exon 2', gc: 52.1, at: 47.9 },
  { region: 'Intron 2', gc: 41.3, at: 58.7 },
  { region: 'Exon 3', gc: 48.9, at: 51.1 }
];

const codonUsageData = [
  { codon: 'UUU', frequency: 0.45, aminoAcid: 'Phe' },
  { codon: 'UUC', frequency: 0.55, aminoAcid: 'Phe' },
  { codon: 'UUA', frequency: 0.07, aminoAcid: 'Leu' },
  { codon: 'UUG', frequency: 0.13, aminoAcid: 'Leu' },
  { codon: 'UCU', frequency: 0.18, aminoAcid: 'Ser' },
  { codon: 'UCC', frequency: 0.22, aminoAcid: 'Ser' }
];

const mutationDensityData = [
  { chromosome: 'chr1', density: 2.3, variants: 234 },
  { chromosome: 'chr2', density: 1.8, variants: 189 },
  { chromosome: 'chr3', density: 2.1, variants: 201 },
  { chromosome: 'chr4', density: 1.5, variants: 156 },
  { chromosome: 'chr5', density: 1.9, variants: 178 }
];

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

export default function Visualizations() {
  const [activeView, setActiveView] = useState('gc-content');
  const [isExporting, setIsExporting] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleExportCharts = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      
      // Create CSV content based on current active view
      let csvContent = '';
      
      if (activeView === 'gc-content') {
        csvContent = 'Region,GC Content (%),AT Content (%)\n' +
          gcContentData.map(item => `${item.region},${item.gc},${item.at}`).join('\n');
      } else if (activeView === 'codon-usage') {
        csvContent = 'Codon,Frequency,Amino Acid\n' +
          codonUsageData.map(item => `${item.codon},${item.frequency},${item.aminoAcid}`).join('\n');
      } else if (activeView === 'mutation-density') {
        csvContent = 'Chromosome,Density (mut/Mb),Variants\n' +
          mutationDensityData.map(item => `${item.chromosome},${item.density},${item.variants}`).join('\n');
      }

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeView}_data.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }, 1500);
  };

  const handleConfigure = () => {
    setIsConfiguring(true);
    setTimeout(() => {
      setIsConfiguring(false);
      
      // Show configuration alert
      const viewName = views.find(v => v.id === activeView)?.name || 'current view';
      alert(`Configuration updated for ${viewName}:\n\n` +
            '✓ Chart colors updated\n' +
            '✓ Display settings saved\n' +
            '✓ Export preferences configured\n' +
            '✓ Visualization parameters optimized');
    }, 1200);
  };

  const renderGCContentChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={gcContentData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="region" />
        <YAxis />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }} 
        />
        <Bar dataKey="gc" fill="#3B82F6" name="GC Content %" radius={[4, 4, 0, 0]} />
        <Bar dataKey="at" fill="#8B5CF6" name="AT Content %" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderCodonUsageChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={codonUsageData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="codon" />
        <YAxis />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }} 
        />
        <Bar dataKey="frequency" fill="#10B981" name="Usage Frequency" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderMutationDensityChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={mutationDensityData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="chromosome" />
        <YAxis />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }} 
        />
        <Bar dataKey="density" fill="#EF4444" name="Mutations per Mb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const views = [
    { id: 'gc-content', name: 'GC Content', icon: BarChart3, render: renderGCContentChart },
    { id: 'codon-usage', name: 'Codon Usage', icon: PieChart, render: renderCodonUsageChart },
    { id: 'mutation-density', name: 'Mutation Density', icon: Activity, render: renderMutationDensityChart }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Genome Visualizations</h1>
            <p className="text-gray-600 dark:text-gray-300">Interactive charts and genome browser for data exploration</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              asChild
              className="dna-gradient"
              onClick={handleExportCharts}
              disabled={isExporting}
            >
              <div>
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export Charts'}
              </div>
            </Button>
            <Button 
              asChild
              className="dna-gradient"
              onClick={handleConfigure}
              disabled={isConfiguring}
            >
              <div>
                <Settings className="h-4 w-4 mr-2" />
                {isConfiguring ? 'Configuring...' : 'Configure'}
              </div>
            </Button>
          </div>
        </div>

        {/* Visualization Tabs */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700 pb-4">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeView === view.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 hover:scale-105'
                  }`}
                >
                  <view.icon className="h-4 w-4" />
                  <span>{view.name}</span>
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
              {views.find(v => v.id === activeView)?.render()}
            </div>
          </CardContent>
        </Card>

        {/* Interactive Genome Browser */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-600" />
              <span>Interactive Genome Browser</span>
            </CardTitle>
            <CardDescription>Navigate and explore your genomic sequences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-6 font-mono text-green-400 min-h-64 relative overflow-hidden">
              {/* Simulated genome browser interface */}
              <div className="mb-4 text-sm">
                <span className="text-blue-400">Position:</span> chr17:43,044,295-43,044,395
                <span className="ml-4 text-purple-400">Gene:</span> BRCA1
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 w-12">43044295</span>
                  <span className="bg-red-600 text-white px-1 rounded">C</span>
                  <span>ATGCGTACGATCGATCGTAGCTAGCTAG</span>
                  <span className="bg-blue-600 text-white px-1 rounded">T</span>
                  <span>CGATCGATCGTAGC</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 w-12">43044325</span>
                  <span>TAGCTAGCTAGCTAGCTAGCTAGCTAG</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 w-12">43044355</span>
                  <span>CGATCGATCGTAGCTAGCTAGCTAGC</span>
                </div>
              </div>
              
              <div className="absolute top-6 right-6 flex space-x-2">
                <Badge variant="error" className="text-xs">Pathogenic Variant</Badge>
                <Badge variant="secondary" className="text-xs">Exon 11</Badge>
              </div>

              <div className="mt-6 text-xs text-gray-400">
                Use mouse wheel to zoom • Click and drag to pan • Variants highlighted in color
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Summary */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="transform transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader>
              <CardTitle className="text-lg">Sequence Composition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Average GC Content</span>
                  <span className="font-mono">45.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">AT/GC Ratio</span>
                  <span className="font-mono">1.22</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Sequence Length</span>
                  <span className="font-mono">3.2M bp</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader>
              <CardTitle className="text-lg">Variant Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">High Impact</span>
                  <Badge variant="error">23 variants</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Moderate Impact</span>
                  <Badge variant="warning">156 variants</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Low Impact</span>
                  <Badge variant="success">2,668 variants</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader>
              <CardTitle className="text-lg">Analysis Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Variant Calling</span>
                  <Badge variant="success">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Annotation</span>
                  <Badge variant="success">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quality Control</span>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}