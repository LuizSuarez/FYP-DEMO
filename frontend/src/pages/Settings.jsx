import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Settings as SettingsIcon, User, Bell, Database, Palette, Globe, Key, Shield } from 'lucide-react';

export default function Settings() {
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    institution: 'University Research Lab',
    position: 'Research Scientist'
  });

  const [notifications, setNotifications] = useState({
    analysisComplete: true,
    riskUpdates: true,
    securityAlerts: true,
    researchInvites: false,
    systemMaintenance: true
  });

  const [dataPreferences, setDataPreferences] = useState({
    autoAnalysis: true,
    backgroundProcessing: true,
    dataRetention: '7-years',
    exportFormat: 'pdf'
  });

  const updateProfile = () => {
    localStorage.setItem('userData', JSON.stringify(profile));
    alert('Profile updated successfully!');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your account and application preferences</p>
        </div>

        {/* Profile Settings */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Profile Information</span>
            </CardTitle>
            <CardDescription>Update your personal and professional information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                <Input
                  value={profile.firstName}
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Institution</label>
                <Input
                  value={profile.institution}
                  onChange={(e) => setProfile({...profile, institution: e.target.value})}
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position</label>
                <Input
                  value={profile.position}
                  onChange={(e) => setProfile({...profile, position: e.target.value})}
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>
            </div>
            <Button 
              onClick={updateProfile}
              className="mt-6 transform transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-purple-600" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {key === 'analysisComplete' && 'Get notified when genomic analyses finish'}
                      {key === 'riskUpdates' && 'Alerts for new risk predictions or updates'}
                      {key === 'securityAlerts' && 'Important security and privacy notifications'}
                      {key === 'researchInvites' && 'Invitations to participate in research studies'}
                      {key === 'systemMaintenance' && 'System maintenance and update notifications'}
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifications({...notifications, [key]: !value})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      value ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Preferences */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-green-600" />
              <span>Data Preferences</span>
            </CardTitle>
            <CardDescription>Configure data processing and storage options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Auto-Analysis</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setDataPreferences({...dataPreferences, autoAnalysis: !dataPreferences.autoAnalysis})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        dataPreferences.autoAnalysis ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        dataPreferences.autoAnalysis ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically run analysis on uploaded files
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Retention Period</label>
                  <select
                    value={dataPreferences.dataRetention}
                    onChange={(e) => setDataPreferences({...dataPreferences, dataRetention: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  >
                    <option value="1-year">1 Year</option>
                    <option value="3-years">3 Years</option>
                    <option value="5-years">5 Years</option>
                    <option value="7-years">7 Years</option>
                    <option value="indefinite">Indefinite</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background Processing</label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setDataPreferences({...dataPreferences, backgroundProcessing: !dataPreferences.backgroundProcessing})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        dataPreferences.backgroundProcessing ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        dataPreferences.backgroundProcessing ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Allow processing during off-peak hours
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Export Format</label>
                  <select
                    value={dataPreferences.exportFormat}
                    onChange={(e) => setDataPreferences({...dataPreferences, exportFormat: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  >
                    <option value="pdf">PDF Reports</option>
                    <option value="csv">CSV Data</option>
                    <option value="json">JSON Format</option>
                    <option value="xlsx">Excel Spreadsheet</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-600" />
              <span>Security</span>
            </CardTitle>
            <CardDescription>Manage your account security and access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <Badge variant="secondary">Disabled</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Password</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last changed 30 days ago</p>
                </div>
                <Button variant="outline" size="sm">
                  <Key className="h-3 w-3 mr-1" />
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">API Access</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generate API keys for external integrations</p>
                </div>
                <Button variant="outline" size="sm">
                  Manage API Keys
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Session Management</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View and manage active sessions</p>
                </div>
                <Button variant="outline" size="sm">
                  View Sessions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Preferences */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-purple-600" />
              <span>Application Preferences</span>
            </CardTitle>
            <CardDescription>Customize your GenomeHub experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+1 (CET)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Format</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Changes */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" className="transform transition-all duration-300 hover:scale-105">
            Reset to Defaults
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-blue-600 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95">
            Save All Changes
          </Button>
        </div>
      </div>
    </Layout>
  );
}