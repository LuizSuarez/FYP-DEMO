import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Shield, Lock, Eye, Download, Trash2, AlertTriangle, CheckCircle, Key } from 'lucide-react';

const privacySettings = [
  {
    category: 'Data Access',
    settings: [
      { name: 'Allow research participation', enabled: true, description: 'Contribute anonymized data to approved research studies' },
      { name: 'Share with healthcare providers', enabled: true, description: 'Allow secure sharing with your designated doctors' },
      { name: 'Family member access', enabled: false, description: 'Grant limited access to immediate family members' }
    ]
  },
  {
    category: 'Data Retention',
    settings: [
      { name: 'Auto-delete after 7 years', enabled: true, description: 'Automatically delete genomic data after retention period' },
      { name: 'Keep analysis results', enabled: true, description: 'Retain processed results even if raw data is deleted' },
      { name: 'Export reminder notifications', enabled: true, description: 'Notify before automatic data deletion' }
    ]
  },
  {
    category: 'Communication',
    settings: [
      { name: 'Analysis completion alerts', enabled: true, description: 'Email notifications when analyses complete' },
      { name: 'Risk update notifications', enabled: true, description: 'Alerts when new risk factors are identified' },
      { name: 'Research opportunity invitations', enabled: false, description: 'Invitations to participate in genetic research' }
    ]
  }
];

const dataAccessLog = [
  {
    date: '2024-01-15 14:32',
    action: 'Data Access',
    user: 'Dr. Sarah Johnson',
    details: 'Viewed comprehensive genomic report',
    status: 'Authorized'
  },
  {
    date: '2024-01-14 09:21',
    action: 'Report Export',
    user: 'You',
    details: 'Downloaded clinical summary report (PDF)',
    status: 'Completed'
  },
  {
    date: '2024-01-12 16:45',
    action: 'Analysis Run',
    user: 'System',
    details: 'Automated risk prediction analysis',
    status: 'Completed'
  }
];

export default function Privacy() {
  const [settings, setSettings] = useState(privacySettings);

  const toggleSetting = (categoryIndex, settingIndex) => {
    setSettings(prev => prev.map((category, catIdx) => 
      catIdx === categoryIndex 
        ? {
            ...category,
            settings: category.settings.map((setting, setIdx) => 
              setIdx === settingIndex 
                ? { ...setting, enabled: !setting.enabled }
                : setting
            )
          }
        : category
    ));
  };

  const requestDataExport = () => {
    alert('Data export request submitted. You will receive a download link within 24 hours.');
  };

  const requestDataDeletion = () => {
    if (confirm('Are you sure you want to permanently delete all your genomic data? This action cannot be undone.')) {
      alert('Data deletion request submitted. This process will take 30 days to complete.');
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy & Data Control</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your genomic data privacy and security settings</p>
        </div>

        {/* Security Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Encryption</p>
                  <p className="text-lg font-bold text-green-600">AES-256</p>
                  <p className="text-xs text-gray-500">End-to-end encrypted</p>
                </div>
                <Shield className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Access Controls</p>
                  <p className="text-lg font-bold text-blue-600">RBAC</p>
                  <p className="text-xs text-gray-500">Role-based permissions</p>
                </div>
                <Lock className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Compliance</p>
                  <p className="text-lg font-bold text-purple-600">HIPAA+</p>
                  <p className="text-xs text-gray-500">Healthcare grade</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Settings */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Privacy Settings</span>
            </CardTitle>
            <CardDescription>Control how your genomic data is used and shared</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {settings.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{category.category}</h3>
                  {category.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-md hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{setting.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{setting.description}</p>
                      </div>
                      <button
                        onClick={() => toggleSetting(categoryIndex, settingIndex)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                          setting.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-green-600" />
                <span>Data Export</span>
              </CardTitle>
              <CardDescription>Download your complete genomic data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Export Options</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Raw genomic files (FASTA, VCF, etc.)</li>
                    <li>• Analysis results and reports</li>
                    <li>• Account and activity data</li>
                    <li>• Privacy and consent records</li>
                  </ul>
                </div>
                <Button 
                  onClick={requestDataExport}
                  className="w-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Request Data Export
                </Button>
                <p className="text-xs text-gray-500">Export will be available for download within 24 hours</p>
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                <span>Data Deletion</span>
              </CardTitle>
              <CardDescription>Permanently remove your genomic data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">Permanent Deletion</p>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        This will permanently delete all your genomic data, analysis results, and account information. 
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="destructive"
                  onClick={requestDataDeletion}
                  className="w-full transform transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Request Data Deletion
                </Button>
                <p className="text-xs text-gray-500">Deletion process takes 30 days to complete</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Access Log */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <span>Data Access Log</span>
            </CardTitle>
            <CardDescription>Recent access and activity on your genomic data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Date & Time</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Action</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">User</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Details</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dataAccessLog.map((log, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300">
                      <td className="py-3 px-2 text-sm font-mono">{log.date}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className="text-xs">{log.action}</Badge>
                      </td>
                      <td className="py-3 px-2 text-sm">{log.user}</td>
                      <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400">{log.details}</td>
                      <td className="py-3 px-2">
                        <Badge variant={log.status === 'Authorized' ? 'success' : log.status === 'Completed' ? 'success' : 'secondary'}>
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Consent Management */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-purple-600" />
              <span>Consent Management</span>
            </CardTitle>
            <CardDescription>Review and manage your data usage consents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Primary Consent</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Genomic analysis and storage for personal health insights
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Granted on: January 10, 2024</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Research Participation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Anonymous contribution to approved genomic research studies
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Can be revoked at any time</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="warning">Pending Review</Badge>
                    <Button size="sm" variant="outline">Modify</Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Clinical Sharing</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Secure sharing with verified healthcare providers for consultation
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Currently shared with 1 doctor</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Controls */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Privacy Controls</CardTitle>
            <CardDescription>Configure how your data is used and accessed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {settings.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 pb-2">
                    {category.category}
                  </h3>
                  {category.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{setting.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</p>
                      </div>
                      <button
                        onClick={() => toggleSetting(categoryIndex, settingIndex)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                          setting.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Rights */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Your Data Rights</CardTitle>
              <CardDescription>Exercise your rights under privacy regulations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={requestDataExport}
                  variant="outline" 
                  className="w-full justify-start transform transition-all duration-300 hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-3" />
                  Export All My Data
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start transform transition-all duration-300 hover:scale-105"
                >
                  <Eye className="h-4 w-4 mr-3" />
                  View Privacy Policy
                </Button>
                
                <Button 
                  onClick={requestDataDeletion}
                  variant="outline" 
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 transform transition-all duration-300 hover:scale-105"
                >
                  <Trash2 className="h-4 w-4 mr-3" />
                  Delete All Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="transform transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Contact Privacy Officer</CardTitle>
              <CardDescription>Get help with privacy concerns or questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white">Data Protection Officer</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    privacy@genomehub.com
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Response within 48 hours for privacy inquiries
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full transform transition-all duration-300 hover:scale-105"
                >
                  Contact Privacy Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}