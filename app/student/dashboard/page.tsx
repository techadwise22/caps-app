'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarIcon, ClockIcon, ChartBarIcon, BookOpenIcon, PlayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function StudentDashboard() {
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

  // Mock data for CA student dashboard
  const upcomingTests = [
    {
      id: '1',
      title: 'CA Foundation - Accounting Mock Test 1',
      subject: 'Accounting',
      level: 'Foundation',
      date: '2024-01-15',
      time: '10:00 AM',
      duration: '3 hours',
      totalQuestions: 100,
    },
    {
      id: '2',
      title: 'CA Intermediate - Advanced Accounting',
      subject: 'Advanced Accounting',
      level: 'Intermediate',
      date: '2024-01-20',
      time: '2:00 PM',
      duration: '3 hours',
      totalQuestions: 100,
    },
    {
      id: '3',
      title: 'CA Final - Strategic Financial Management',
      subject: 'Strategic Financial Management',
      level: 'Final',
      date: '2024-01-25',
      time: '9:00 AM',
      duration: '3 hours',
      totalQuestions: 100,
    },
  ];

  const recentResults = [
    {
      id: '1',
      testTitle: 'CA Foundation - Business Laws',
      subject: 'Business Laws',
      level: 'Foundation',
      score: 85,
      totalQuestions: 100,
      date: '2024-01-10',
      status: 'completed',
    },
    {
      id: '2',
      testTitle: 'CA Intermediate - Cost Accounting',
      subject: 'Cost Accounting',
      level: 'Intermediate',
      score: 78,
      totalQuestions: 100,
      date: '2024-01-05',
      status: 'completed',
    },
    {
      id: '3',
      testTitle: 'CA Final - Direct Tax Laws',
      subject: 'Direct Tax Laws',
      level: 'Final',
      score: 72,
      totalQuestions: 100,
      date: '2024-01-01',
      status: 'completed',
    },
  ];

  const announcements = [
    {
      id: '1',
      title: 'New CA Foundation Mock Tests Available',
      content: 'We have added new mock tests for CA Foundation students covering all subjects.',
      date: '2024-01-12',
      type: 'info',
    },
    {
      id: '2',
      title: 'CA Intermediate Study Material Updated',
      content: 'Updated study materials for CA Intermediate students are now available.',
      date: '2024-01-10',
      type: 'update',
    },
    {
      id: '3',
      title: 'Live CA Final Revision Classes',
      content: 'Join our live revision classes for CA Final students starting next week.',
      date: '2024-01-08',
      type: 'event',
    },
  ];

  const stats = [
    {
      title: 'Tests Completed',
      value: '24',
      icon: CheckCircleIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      title: 'Average Score',
      value: '82%',
      icon: ChartBarIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      title: 'Study Hours',
      value: '156',
      icon: ClockIcon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
    },
    {
      title: 'Topics Covered',
      value: '18',
      icon: BookOpenIcon,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user.full_name}! 👋
          </h1>
          <p className="text-primary-100">
            Continue your CA journey with our comprehensive learning platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-surface-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tests */}
          <div className="bg-white rounded-xl shadow-soft">
            <div className="p-6 border-b border-surface-200">
              <h2 className="text-xl font-semibold text-surface-900">Upcoming Tests</h2>
              <p className="text-surface-600 text-sm">Your scheduled mock tests</p>
            </div>
            <div className="p-6 space-y-4">
              {upcomingTests.map((test) => (
                <div key={test.id} className="border border-surface-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-surface-900 mb-1">{test.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-surface-600 mb-2">
                        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                          {test.level}
                        </span>
                        <span>{test.subject}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-surface-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {test.date}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {test.time}
                        </div>
                        <div className="flex items-center">
                          <BookOpenIcon className="h-4 w-4 mr-1" />
                          {test.totalQuestions} questions
                        </div>
                      </div>
                    </div>
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                      Start Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Results */}
          <div className="bg-white rounded-xl shadow-soft">
            <div className="p-6 border-b border-surface-200">
              <h2 className="text-xl font-semibold text-surface-900">Recent Results</h2>
              <p className="text-surface-600 text-sm">Your latest test performances</p>
            </div>
            <div className="p-6 space-y-4">
              {recentResults.map((result) => (
                <div key={result.id} className="border border-surface-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-surface-900">{result.testTitle}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      result.score >= 80 ? 'bg-success-100 text-success-700' :
                      result.score >= 60 ? 'bg-warning-100 text-warning-700' :
                      'bg-danger-100 text-danger-700'
                    }`}>
                      {result.score}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-surface-600 mb-2">
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                      {result.level}
                    </span>
                    <span>{result.subject}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-surface-600">
                    <span>{result.date}</span>
                    <span>{result.score}/{result.totalQuestions} correct</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl shadow-soft">
          <div className="p-6 border-b border-surface-200">
            <h2 className="text-xl font-semibold text-surface-900">Announcements</h2>
            <p className="text-surface-600 text-sm">Latest updates and news</p>
          </div>
          <div className="p-6 space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border-l-4 border-primary-500 pl-4 py-2">
                <h3 className="font-semibold text-surface-900 mb-1">{announcement.title}</h3>
                <p className="text-surface-600 text-sm mb-2">{announcement.content}</p>
                <span className="text-xs text-surface-500">{announcement.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-semibold text-surface-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
              <PlayIcon className="h-5 w-5" />
              <span>Start Practice Test</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-colors">
              <BookOpenIcon className="h-5 w-5" />
              <span>Study Materials</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-success-600 text-white px-6 py-3 rounded-lg hover:bg-success-700 transition-colors">
              <ChartBarIcon className="h-5 w-5" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 