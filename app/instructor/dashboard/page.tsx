'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  BookOpenIcon, 
  UsersIcon, 
  ClockIcon, 
  CheckCircleIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  CalendarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export default function InstructorDashboard() {
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

  // Mock data for CA instructor dashboard
  const stats = [
    {
      title: 'Active Tests',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: DocumentTextIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      title: 'Total Students',
      value: '156',
      change: '+12',
      changeType: 'positive',
      icon: UsersIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      title: 'Average Score',
      value: '78%',
      change: '+3%',
      changeType: 'positive',
      icon: ChartBarIcon,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
    },
    {
      title: 'Study Hours',
      value: '342',
      change: '+28',
      changeType: 'positive',
      icon: ClockIcon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
    },
  ];

  const recentTests = [
    {
      id: '1',
      title: 'CA Foundation - Accounting Mock Test 1',
      level: 'Foundation',
      subject: 'Accounting',
      students: 45,
      averageScore: 78,
      status: 'active',
      date: '2024-01-15',
    },
    {
      id: '2',
      title: 'CA Intermediate - Advanced Accounting',
      level: 'Intermediate',
      subject: 'Advanced Accounting',
      students: 32,
      averageScore: 82,
      status: 'active',
      date: '2024-01-20',
    },
    {
      id: '3',
      title: 'CA Final - Strategic Financial Management',
      level: 'Final',
      subject: 'Strategic Financial Management',
      students: 28,
      averageScore: 75,
      status: 'completed',
      date: '2024-01-10',
    },
  ];

  const upcomingClasses = [
    {
      id: '1',
      title: 'CA Foundation - Business Laws Revision',
      level: 'Foundation',
      subject: 'Business Laws',
      date: '2024-01-18',
      time: '10:00 AM',
      duration: '2 hours',
      students: 45,
      type: 'live',
    },
    {
      id: '2',
      title: 'CA Intermediate - Cost Accounting Practice',
      level: 'Intermediate',
      subject: 'Cost Accounting',
      date: '2024-01-20',
      time: '2:00 PM',
      duration: '1.5 hours',
      students: 32,
      type: 'live',
    },
    {
      id: '3',
      title: 'CA Final - Direct Tax Laws Discussion',
      level: 'Final',
      subject: 'Direct Tax Laws',
      date: '2024-01-22',
      time: '6:00 PM',
      duration: '2 hours',
      students: 28,
      type: 'live',
    },
  ];

  const quickActions = [
    {
      title: 'Create New Test',
      description: 'Design a new mock test for your students',
      icon: DocumentTextIcon,
      href: '/instructor/tests/create',
      color: 'bg-primary-600 hover:bg-primary-700',
    },
    {
      title: 'Add Study Material',
      description: 'Upload or create new study content',
      icon: BookOpenIcon,
      href: '/instructor/content',
      color: 'bg-secondary-600 hover:bg-secondary-700',
    },
    {
      title: 'Schedule Class',
      description: 'Set up a live class session',
      icon: VideoCameraIcon,
      href: '/instructor/classes',
      color: 'bg-success-600 hover:bg-success-700',
    },
    {
      title: 'View Analytics',
      description: 'Check student performance data',
      icon: ChartBarIcon,
      href: '/instructor/analytics',
      color: 'bg-warning-600 hover:bg-warning-700',
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
            Manage your CA students and create engaging learning experiences
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
                  <p className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-semibold text-surface-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => router.push(action.href)}
                className={`${action.color} text-white p-4 rounded-lg text-left transition-colors`}
              >
                <action.icon className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tests */}
          <div className="bg-white rounded-xl shadow-soft">
            <div className="p-6 border-b border-surface-200">
              <h2 className="text-xl font-semibold text-surface-900">Recent Tests</h2>
              <p className="text-surface-600 text-sm">Your latest mock tests and their performance</p>
            </div>
            <div className="p-6 space-y-4">
              {recentTests.map((test) => (
                <div key={test.id} className="border border-surface-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-surface-900 mb-1">{test.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-surface-600 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          test.level === 'Foundation' ? 'bg-primary-100 text-primary-700' :
                          test.level === 'Intermediate' ? 'bg-secondary-100 text-secondary-700' :
                          'bg-success-100 text-success-700'
                        }`}>
                          {test.level}
                        </span>
                        <span>{test.subject}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-surface-600">
                        <span>{test.students} students</span>
                        <span>{test.averageScore}% avg score</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          test.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-surface-100 text-surface-700'
                        }`}>
                          {test.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/instructor/tests/${test.id}/analytics`)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white rounded-xl shadow-soft">
            <div className="p-6 border-b border-surface-200">
              <h2 className="text-xl font-semibold text-surface-900">Upcoming Classes</h2>
              <p className="text-surface-600 text-sm">Your scheduled live sessions</p>
            </div>
            <div className="p-6 space-y-4">
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="border border-surface-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-surface-900 mb-1">{classItem.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-surface-600 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          classItem.level === 'Foundation' ? 'bg-primary-100 text-primary-700' :
                          classItem.level === 'Intermediate' ? 'bg-secondary-100 text-secondary-700' :
                          'bg-success-100 text-success-700'
                        }`}>
                          {classItem.level}
                        </span>
                        <span>{classItem.subject}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-surface-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {classItem.date}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {classItem.time}
                        </div>
                        <span>{classItem.students} students</span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/instructor/classes/${classItem.id}`)}
                      className="bg-primary-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-semibold text-surface-900 mb-4">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-semibold text-surface-900 mb-1">Student Progress</h3>
              <p className="text-2xl font-bold text-primary-600">+15%</p>
              <p className="text-sm text-surface-600">vs last month</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-success-50 to-success-100 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-success-600 mx-auto mb-2" />
              <h3 className="font-semibold text-surface-900 mb-1">Completion Rate</h3>
              <p className="text-2xl font-bold text-success-600">92%</p>
              <p className="text-sm text-surface-600">of assigned tests</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg">
              <AcademicCapIcon className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
              <h3 className="font-semibold text-surface-900 mb-1">Active Students</h3>
              <p className="text-2xl font-bold text-secondary-600">142</p>
              <p className="text-sm text-surface-600">this week</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 