'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  CheckCircleIcon,
  UserGroupIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
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

  // Mock data for admin dashboard
  const stats = [
    {
      title: 'Total Users',
      value: '1,247',
      change: '+23',
      changeType: 'positive',
      icon: UsersIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      title: 'Active Students',
      value: '892',
      change: '+15',
      changeType: 'positive',
      icon: UserGroupIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      title: 'Instructors',
      value: '45',
      change: '+3',
      changeType: 'positive',
      icon: AcademicCapIcon,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
    },
    {
      title: 'Total Tests',
      value: '156',
      change: '+8',
      changeType: 'positive',
      icon: DocumentTextIcon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
    },
  ];

  const recentUsers = [
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      role: 'student',
      level: 'Foundation',
      status: 'active',
      joinedDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      role: 'instructor',
      level: 'Intermediate',
      status: 'active',
      joinedDate: '2024-01-14',
    },
    {
      id: '3',
      name: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      role: 'student',
      level: 'Final',
      status: 'active',
      joinedDate: '2024-01-13',
    },
    {
      id: '4',
      name: 'Neha Singh',
      email: 'neha.singh@example.com',
      role: 'student',
      level: 'Foundation',
      status: 'pending',
      joinedDate: '2024-01-12',
    },
  ];

  const systemStats = [
    {
      title: 'Average Test Score',
      value: '76%',
      trend: '+2.5%',
      trendType: 'positive',
    },
    {
      title: 'Content Views',
      value: '2,847',
      trend: '+12%',
      trendType: 'positive',
    },
    {
      title: 'Active Sessions',
      value: '234',
      trend: '+8%',
      trendType: 'positive',
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      trend: 'Stable',
      trendType: 'neutral',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all user accounts',
      icon: UsersIcon,
      href: '/admin/users',
      color: 'bg-primary-600 hover:bg-primary-700',
    },
    {
      title: 'Course Management',
      description: 'Manage CA courses and levels',
      icon: AcademicCapIcon,
      href: '/admin/courses',
      color: 'bg-secondary-600 hover:bg-secondary-700',
    },
    {
      title: 'Content Moderation',
      description: 'Review and approve content',
      icon: DocumentTextIcon,
      href: '/admin/content',
      color: 'bg-success-600 hover:bg-success-700',
    },
    {
      title: 'System Analytics',
      description: 'View detailed system reports',
      icon: ChartBarIcon,
      href: '/admin/analytics',
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
            Manage the CAPS CA platform and monitor system performance
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
            <button 
              onClick={() => router.push('/admin/users')}
              className="flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <UsersIcon className="h-5 w-5" />
              <span>Manage Users</span>
            </button>
            <button 
              onClick={() => router.push('/admin/courses')}
              className="flex items-center justify-center space-x-2 bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-colors"
            >
              <AcademicCapIcon className="h-5 w-5" />
              <span>Manage Courses</span>
            </button>
            <button 
              onClick={() => router.push('/admin/content')}
              className="flex items-center justify-center space-x-2 bg-success-600 text-white px-6 py-3 rounded-lg hover:bg-success-700 transition-colors"
            >
              <DocumentTextIcon className="h-5 w-5" />
              <span>Manage Content</span>
            </button>
            <button 
              onClick={() => router.push('/admin/mcqs')}
              className="flex items-center justify-center space-x-2 bg-warning-600 text-white px-6 py-3 rounded-lg hover:bg-warning-700 transition-colors"
            >
              <QuestionMarkCircleIcon className="h-5 w-5" />
              <span>Manage MCQs</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-soft">
            <div className="p-6 border-b border-surface-200">
              <h2 className="text-xl font-semibold text-surface-900">Recent Users</h2>
              <p className="text-surface-600 text-sm">Latest user registrations</p>
            </div>
            <div className="p-6 space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="border border-surface-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-surface-900">{user.name}</h3>
                        <p className="text-sm text-surface-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'student' ? 'bg-primary-100 text-primary-700' :
                            'bg-secondary-100 text-secondary-700'
                          }`}>
                            {user.role}
                          </span>
                          {user.level && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-surface-100 text-surface-700">
                              {user.level}
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Statistics */}
          <div className="bg-white rounded-xl shadow-soft">
            <div className="p-6 border-b border-surface-200">
              <h2 className="text-xl font-semibold text-surface-900">System Statistics</h2>
              <p className="text-surface-600 text-sm">Platform performance metrics</p>
            </div>
            <div className="p-6 space-y-4">
              {systemStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-surface-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-surface-900">{stat.title}</h3>
                    <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                  </div>
                  <div className={`text-right ${
                    stat.trendType === 'positive' ? 'text-success-600' :
                    stat.trendType === 'negative' ? 'text-danger-600' : 'text-surface-600'
                  }`}>
                    <p className="text-sm font-medium">{stat.trend}</p>
                    <p className="text-xs">vs last week</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-semibold text-surface-900 mb-4">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-semibold text-surface-900 mb-1">User Growth</h3>
              <p className="text-2xl font-bold text-primary-600">+18%</p>
              <p className="text-sm text-surface-600">this month</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-success-50 to-success-100 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-success-600 mx-auto mb-2" />
              <h3 className="font-semibold text-surface-900 mb-1">System Health</h3>
              <p className="text-2xl font-bold text-success-600">Excellent</p>
              <p className="text-sm text-surface-600">99.9% uptime</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-warning-50 to-warning-100 rounded-lg">
              <ExclamationTriangleIcon className="h-8 w-8 text-warning-600 mx-auto mb-2" />
              <h3 className="font-semibold text-surface-900 mb-1">Pending Actions</h3>
              <p className="text-2xl font-bold text-warning-600">3</p>
              <p className="text-sm text-surface-600">require attention</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 