import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Heart, Activity, Apple, Moon, Target, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

const riskBasedRecommendations = [
  {
    category: 'Diet',
    riskFactor: 'Type 2 Diabetes (23% risk)',
    recommendations: [
      'Follow Mediterranean diet pattern',
      'Limit refined carbohydrates and sugars',
      'Include omega-3 rich foods 2-3 times per week',
      'Portion control with smaller, frequent meals'
    ],
    priority: 'High'
  },
  {
    category: 'Exercise',
    riskFactor: 'Cardiovascular Disease (15% risk)',
    recommendations: [
      'Minimum 150 minutes moderate aerobic activity per week',
      'Include strength training 2 days per week',
      'Daily walking for 30+ minutes',
      'Monitor heart rate during exercise'
    ],
    priority: 'High'
  },
  {
    category: 'Screening',
    riskFactor: 'BRCA1/BRCA2 variants detected',
    recommendations: [
      'Annual mammography screening starting age 40',
      'Consider MRI screening in high-risk cases',
      'Regular clinical breast examinations',
      'Genetic counseling for family planning'
    ],
    priority: 'Critical'
  }
];

const lifestyleMetrics = [
  { name: 'Weekly Exercise', current: 4, target: 7, unit: 'days', progress: 57, trend: 'up' },
  { name: 'Sleep Quality', current: 7.2, target: 8, unit: 'hours', progress: 90, trend: 'up' },
  { name: 'Diet Score', current: 85, target: 100, unit: 'points', progress: 85, trend: 'stable' },
  { name: 'Stress Level', current: 3, target: 2, unit: '/10', progress: 70, trend: 'down' }
];

const screeningSchedule = [
  {
    test: 'Blood Glucose Test',
    dueDate: '2024-02-15',
    frequency: 'Every 6 months',
    priority: 'High',
    reason: 'Type 2 Diabetes risk monitoring',
    status: 'Scheduled'
  },
  {
    test: 'Lipid Panel',
    dueDate: '2024-03-01',
    frequency: 'Annual',
    priority: 'Medium',
    reason: 'Cardiovascular risk assessment',
    status: 'Pending'
  },
  {
    test: 'Mammography',
    dueDate: '2024-04-10',
    frequency: 'Annual',
    priority: 'Critical',
    reason: 'BRCA variant carrier screening',
    status: 'Scheduled'
  }
];

export default function Lifestyle() {
  const [activeTab, setActiveTab] = useState('recommendations');

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'secondary';
      default: return 'success';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lifestyle & Prevention</h1>
          <p className="text-gray-600 dark:text-gray-300">Personalized recommendations based on your genetic profile</p>
        </div>

        {/* Lifestyle Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {lifestyleMetrics.map((metric, i) => (
            <Card key={i} className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm">{metric.name}</h3>
                    <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                      {getTrendIcon(metric.trend)}
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.current}{metric.unit}
                    </p>
                    <p className="text-xs text-gray-500">Target: {metric.target}{metric.unit}</p>
                  </div>
                  <Progress value={metric.progress} className="transition-all duration-300 group-hover:scale-105" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Tabs */}
        <Card className="transform transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 pb-4">
              {[
                { id: 'recommendations', name: 'Recommendations', icon: Target },
                { id: 'screening', name: 'Screening Schedule', icon: Calendar },
                { id: 'progress', name: 'Progress Tracking', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 hover:scale-105'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                {riskBasedRecommendations.map((rec, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:scale-102">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                          {rec.category === 'Diet' && <Apple className="h-5 w-5 text-green-600" />}
                          {rec.category === 'Exercise' && <Activity className="h-5 w-5 text-blue-600" />}
                          {rec.category === 'Screening' && <Heart className="h-5 w-5 text-red-600" />}
                          <span>{rec.category} Recommendations</span>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{rec.riskFactor}</p>
                      </div>
                      <Badge variant={getPriorityColor(rec.priority)}>
                        {rec.priority} Priority
                      </Badge>
                    </div>
                    <ul className="space-y-2">
                      {rec.recommendations.map((recommendation, j) => (
                        <li key={j} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'screening' && (
              <div className="space-y-4">
                {screeningSchedule.map((test, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-102">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{test.test}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{test.reason}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due: {test.dueDate}
                        </span>
                        <span className="text-xs text-gray-500">{test.frequency}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={getPriorityColor(test.priority)}>
                        {test.priority}
                      </Badge>
                      <Badge variant={test.status === 'Scheduled' ? 'success' : 'secondary'}>
                        {test.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">Weekly Goals</h3>
                  {lifestyleMetrics.map((metric, i) => (
                    <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between text-sm mb-2">
                        <span>{metric.name}</span>
                        <span className="font-medium">{metric.current}/{metric.target} {metric.unit}</span>
                      </div>
                      <Progress value={metric.progress} />
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">Achievement Badges</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-xs font-medium">7-Day Streak</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                      <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-xs font-medium">Goal Achiever</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                      <Moon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-xs font-medium">Sleep Master</p>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
                      <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-xs font-medium">Active Life</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}