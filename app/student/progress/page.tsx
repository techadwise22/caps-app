'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import React from 'react';
import { 
  ChartBarIcon, 
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

export default function StudentProgressPage() {
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

  // Mock progress data
  const overallStats = {
    totalTests: 12,
    completedTests: 10,
    averageScore: 78.5,
    studyHours: 45.5,
    improvement: '+12%',
    trend: 'up'
  };

  const subjectPerformance = [
    {
      subject: 'Accounting',
      level: 'Foundation',
      testsTaken: 4,
      averageScore: 82,
      improvement: '+8%',
      trend: 'up',
      lastTest: '2024-01-15',
      topics: ['Journal Entries', 'Ledger Accounts', 'Trial Balance', 'Financial Statements']
    },
    {
      subject: 'Business Laws',
      level: 'Foundation',
      testsTaken: 3,
      averageScore: 75,
      improvement: '+15%',
      trend: 'up',
      lastTest: '2024-01-12',
      topics: ['Company Law', 'Partnership Law', 'Contract Law']
    },
    {
      subject: 'Economics',
      level: 'Foundation',
      testsTaken: 2,
      averageScore: 70,
      improvement: '+5%',
      trend: 'up',
      lastTest: '2024-01-10',
      topics: ['Microeconomics', 'Macroeconomics']
    },
    {
      subject: 'Mathematics',
      level: 'Foundation',
      testsTaken: 1,
      averageScore: 65,
      improvement: '-2%',
      trend: 'down',
      lastTest: '2024-01-08',
      topics: ['Algebra', 'Statistics']
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'test_completed',
      title: 'CA Foundation - Accounting Mock Test 1',
      date: '2024-01-15',
      score: 85,
      time: '2 hours 30 minutes',
      improvement: '+5%'
    },
    {
      id: '2',
      type: 'study_session',
      title: 'Business Laws - Company Law',
      date: '2024-01-14',
      duration: '1 hour 45 minutes',
      progress: 'Completed Chapter 3'
    },
    {
      id: '3',
      type: 'test_completed',
      title: 'CA Foundation - Business Laws Quiz',
      date: '2024-01-12',
      score: 78,
      time: '1 hour 15 minutes',
      improvement: '+12%'
    },
    {
      id: '4',
      type: 'class_attended',
      title: 'Economics Concepts Live Class',
      date: '2024-01-11',
      duration: '2 hours',
      instructor: 'Dr. Divyashree'
    },
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-success-600' : 'text-danger-600';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'test_completed':
        return CheckCircleIcon;
      case 'study_session':
        return BookOpenIcon;
      case 'class_attended':
        return AcademicCapIcon;
      default:
        return ChartBarIcon;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'test_completed':
        return 'bg-success-100 text-success-600';
      case 'study_session':
        return 'bg-primary-100 text-primary-600';
      case 'class_attended':
        return 'bg-secondary-100 text-secondary-600';
      default:
        return 'bg-surface-100 text-surface-600';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-surface-900">My Progress</h1>
          <p className="text-surface-600">Track your CA learning journey and performance</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">Total Tests</p>
                <p className="text-2xl font-bold text-surface-900">{overallStats.totalTests}</p>
                <p className="text-sm text-surface-500">{overallStats.completedTests} completed</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">Average Score</p>
                <p className="text-2xl font-bold text-surface-900">{overallStats.averageScore}%</p>
                <div className="flex items-center mt-1">
                  {React.createElement(getTrendIcon(overallStats.trend), { 
                    className: `h-4 w-4 ${getTrendColor(overallStats.trend)} mr-1` 
                  })}
                  <span className={`text-sm font-medium ${getTrendColor(overallStats.trend)}`}>
                    {overallStats.improvement}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-success-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">Study Hours</p>
                <p className="text-2xl font-bold text-surface-900">{overallStats.studyHours}</p>
                <p className="text-sm text-surface-500">This month</p>
              </div>
              <div className="p-3 bg-warning-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">Completion Rate</p>
                <p className="text-2xl font-bold text-surface-900">
                  {Math.round((overallStats.completedTests / overallStats.totalTests) * 100)}%
                </p>
                <p className="text-sm text-surface-500">Tests completed</p>
              </div>
              <div className="p-3 bg-secondary-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-xl shadow-soft">
          <div className="p-6 border-b border-surface-200">
            <h2 className="text-xl font-semibold text-surface-900">Subject Performance</h2>
            <p className="text-surface-600 text-sm">Your performance across different CA subjects</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjectPerformance.map((subject, index) => {
                const TrendIcon = getTrendIcon(subject.trend);
                return (
                  <div key={index} className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-surface-900">{subject.subject}</h3>
                        <p className="text-sm text-surface-600">{subject.level}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendIcon className={`h-4 w-4 ${getTrendColor(subject.trend)}`} />
                        <span className={`text-sm font-medium ${getTrendColor(subject.trend)}`}>
                          {subject.improvement}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-600">Tests Taken:</span>
                        <span className="font-medium text-surface-900">{subject.testsTaken}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-600">Average Score:</span>
                        <span className="font-medium text-surface-900">{subject.averageScore}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-600">Last Test:</span>
                        <span className="font-medium text-surface-900">{subject.lastTest}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium text-surface-900 mb-2">Topics Covered:</p>
                      <div className="flex flex-wrap gap-1">
                        {subject.topics.map((topic, topicIndex) => (
                          <span key={topicIndex} className="px-2 py-1 bg-surface-100 text-surface-700 rounded-full text-xs">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-soft">
          <div className="p-6 border-b border-surface-200">
            <h2 className="text-xl font-semibold text-surface-900">Recent Activity</h2>
            <p className="text-surface-600 text-sm">Your latest learning activities and achievements</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                      <ActivityIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-surface-900">{activity.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-surface-600 mt-1">
                        <span>{activity.date}</span>
                        {activity.type === 'test_completed' && (
                          <>
                            <span>Score: {activity.score}%</span>
                            <span>Time: {activity.time}</span>
                            <span className="text-success-600">{activity.improvement}</span>
                          </>
                        )}
                        {activity.type === 'study_session' && (
                          <>
                            <span>Duration: {activity.duration}</span>
                            <span>{activity.progress}</span>
                          </>
                        )}
                        {activity.type === 'class_attended' && (
                          <>
                            <span>Duration: {activity.duration}</span>
                            <span>Instructor: {activity.instructor}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Progress Insights */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-semibold text-surface-900 mb-4">Progress Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
              <h3 className="font-semibold text-surface-900 mb-2">Strong Areas</h3>
              <ul className="space-y-1 text-sm text-surface-700">
                <li>• Accounting fundamentals (82% avg)</li>
                <li>• Business Laws concepts (75% avg)</li>
                <li>• Consistent study routine</li>
              </ul>
            </div>
            <div className="p-4 bg-gradient-to-br from-warning-50 to-warning-100 rounded-lg">
              <h3 className="font-semibold text-surface-900 mb-2">Areas for Improvement</h3>
              <ul className="space-y-1 text-sm text-surface-700">
                <li>• Mathematics problem-solving (65% avg)</li>
                <li>• Economics application questions</li>
                <li>• Time management in tests</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 