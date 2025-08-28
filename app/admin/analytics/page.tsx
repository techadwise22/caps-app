'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ChartBarIcon, 
  UsersIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

export default function AdminAnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Mock analytics data
  const analyticsData = {
    userGrowth: {
      current: 1247,
      previous: 1180,
      change: '+5.7%',
      trend: 'up'
    },
    testCompletions: {
      current: 3420,
      previous: 2980,
      change: '+14.8%',
      trend: 'up'
    },
    averageScore: {
      current: 76.5,
      previous: 73.2,
      change: '+3.3%',
      trend: 'up'
    },
    contentViews: {
      current: 15890,
      previous: 14200,
      change: '+11.9%',
      trend: 'up'
    }
  };

  const levelStats = [
    { level: 'Foundation', students: 450, tests: 1200, avgScore: 78.2 },
    { level: 'Intermediate', students: 320, tests: 980, avgScore: 74.8 },
    { level: 'Final', students: 280, tests: 850, avgScore: 72.1 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Analytics Dashboard</h1>
          <p className="text-surface-600">Comprehensive insights into CAPS CA platform performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-surface-900">{analyticsData.userGrowth.current.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {analyticsData.userGrowth.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-success-600 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-danger-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    analyticsData.userGrowth.trend === 'up' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {analyticsData.userGrowth.change}
                  </span>
                  <span className="text-sm text-surface-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">Test Completions</p>
                <p className="text-2xl font-bold text-surface-900">{analyticsData.testCompletions.current.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {analyticsData.testCompletions.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-success-600 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-danger-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    analyticsData.testCompletions.trend === 'up' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {analyticsData.testCompletions.change}
                  </span>
                  <span className="text-sm text-surface-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-success-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">Average Score</p>
                <p className="text-2xl font-bold text-surface-900">{analyticsData.averageScore.current}%</p>
                <div className="flex items-center mt-1">
                  {analyticsData.averageScore.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-success-600 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-danger-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    analyticsData.averageScore.trend === 'up' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {analyticsData.averageScore.change}
                  </span>
                  <span className="text-sm text-surface-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-secondary-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">Content Views</p>
                <p className="text-2xl font-bold text-surface-900">{analyticsData.contentViews.current.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {analyticsData.contentViews.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-success-600 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-danger-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    analyticsData.contentViews.trend === 'up' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {analyticsData.contentViews.change}
                  </span>
                  <span className="text-sm text-surface-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-warning-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Level-wise Statistics */}
        <div className="bg-white rounded-xl shadow-soft">
          <div className="p-6 border-b border-surface-200">
            <h2 className="text-xl font-semibold text-surface-900">Performance by CA Level</h2>
            <p className="text-surface-600 text-sm">Detailed breakdown of student performance across different levels</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {levelStats.map((stat, index) => (
                <div key={index} className="border border-surface-200 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className={`p-2 rounded-lg ${
                      stat.level === 'Foundation' ? 'bg-primary-100' :
                      stat.level === 'Intermediate' ? 'bg-secondary-100' :
                      'bg-success-100'
                    }`}>
                      <AcademicCapIcon className={`h-5 w-5 ${
                        stat.level === 'Foundation' ? 'text-primary-600' :
                        stat.level === 'Intermediate' ? 'text-secondary-600' :
                        'text-success-600'
                      }`} />
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-surface-900">{stat.level}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-600">Students:</span>
                      <span className="text-sm font-medium text-surface-900">{stat.students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-600">Tests Completed:</span>
                      <span className="text-sm font-medium text-surface-900">{stat.tests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-600">Average Score:</span>
                      <span className="text-sm font-medium text-surface-900">{stat.avgScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-soft">
          <div className="p-6 border-b border-surface-200">
            <h2 className="text-xl font-semibold text-surface-900">Recent Platform Activity</h2>
            <p className="text-surface-600 text-sm">Latest user activities and system events</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
                <div className="p-2 bg-success-100 rounded-lg">
                  <UsersIcon className="h-4 w-4 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900">New user registration</p>
                  <p className="text-xs text-surface-500">Rahul Sharma joined CA Foundation course</p>
                </div>
                <span className="text-xs text-surface-500 ml-auto">2 hours ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <DocumentTextIcon className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900">Test completed</p>
                  <p className="text-xs text-surface-500">Priya Patel completed CA Intermediate mock test</p>
                </div>
                <span className="text-xs text-surface-500 ml-auto">4 hours ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <AcademicCapIcon className="h-4 w-4 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900">Content published</p>
                  <p className="text-xs text-surface-500">New study material added for CA Final</p>
                </div>
                <span className="text-xs text-surface-500 ml-auto">6 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 