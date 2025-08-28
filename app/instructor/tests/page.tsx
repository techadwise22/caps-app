'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  ChartBarIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export default function InstructorTestsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  // Mock data for CA instructor tests
  const tests = [
    {
      id: '1',
      title: 'CA Foundation - Accounting Mock Test 1',
      subject: 'Accounting',
      level: 'Foundation',
      duration: '3 hours',
      totalQuestions: 100,
      status: 'active',
      assignedStudents: 45,
      averageScore: 78,
      lastModified: '2024-01-10',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
    },
    {
      id: '2',
      title: 'CA Intermediate - Advanced Accounting',
      subject: 'Advanced Accounting',
      level: 'Intermediate',
      duration: '3 hours',
      totalQuestions: 100,
      status: 'draft',
      assignedStudents: 0,
      averageScore: 0,
      lastModified: '2024-01-12',
      startDate: '2024-01-25',
      endDate: '2024-01-30',
    },
    {
      id: '3',
      title: 'CA Final - Strategic Financial Management',
      subject: 'Strategic Financial Management',
      level: 'Final',
      duration: '3 hours',
      totalQuestions: 100,
      status: 'active',
      assignedStudents: 32,
      averageScore: 82,
      lastModified: '2024-01-08',
      startDate: '2024-01-18',
      endDate: '2024-01-25',
    },
    {
      id: '4',
      title: 'CA Foundation - Business Laws',
      subject: 'Business Laws',
      level: 'Foundation',
      duration: '3 hours',
      totalQuestions: 100,
      status: 'completed',
      assignedStudents: 50,
      averageScore: 75,
      lastModified: '2024-01-05',
      startDate: '2024-01-10',
      endDate: '2024-01-15',
    },
    {
      id: '5',
      title: 'CA Intermediate - Cost Accounting',
      subject: 'Cost Accounting',
      level: 'Intermediate',
      duration: '3 hours',
      totalQuestions: 100,
      status: 'active',
      assignedStudents: 28,
      averageScore: 79,
      lastModified: '2024-01-11',
      startDate: '2024-01-20',
      endDate: '2024-01-25',
    },
  ];

  const stats = [
    {
      title: 'Total Tests',
      value: tests.length.toString(),
      change: '+2',
      changeType: 'positive',
    },
    {
      title: 'Active Tests',
      value: tests.filter(t => t.status === 'active').length.toString(),
      change: '+1',
      changeType: 'positive',
    },
    {
      title: 'Average Score',
      value: '78%',
      change: '+3%',
      changeType: 'positive',
    },
    {
      title: 'Total Students',
      value: tests.reduce((sum, test) => sum + test.assignedStudents, 0).toString(),
      change: '+15',
      changeType: 'positive',
    },
  ];

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.level.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-700';
      case 'draft':
        return 'bg-warning-100 text-warning-700';
      case 'completed':
        return 'bg-surface-100 text-surface-700';
      default:
        return 'bg-surface-100 text-surface-700';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Foundation':
        return 'bg-primary-100 text-primary-700';
      case 'Intermediate':
        return 'bg-secondary-100 text-secondary-700';
      case 'Final':
        return 'bg-success-100 text-success-700';
      default:
        return 'bg-surface-100 text-surface-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">CA Mock Tests</h1>
            <p className="text-surface-600">Manage and create mock tests for CA students</p>
          </div>
          <button
            onClick={() => router.push('/instructor/tests/create')}
            className="btn-primary mt-4 sm:mt-0"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Test
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-surface-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-surface-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tests Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-200">
              <thead className="bg-surface-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Test Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Level & Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Duration & Questions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-200">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-surface-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-surface-900">{test.title}</div>
                        <div className="text-sm text-surface-500">Last modified: {test.lastModified}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(test.level)}`}>
                          {test.level}
                        </span>
                        <span className="text-sm text-surface-900">{test.subject}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-surface-900">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {test.duration}
                        </div>
                        <div className="text-sm text-surface-500">{test.totalQuestions} questions</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-surface-900">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          {test.assignedStudents} students
                        </div>
                        {test.averageScore > 0 && (
                          <div className="text-sm text-surface-500">{test.averageScore}% avg score</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/instructor/tests/${test.id}`)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/instructor/tests/${test.id}/edit`)}
                          className="text-warning-600 hover:text-warning-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/instructor/tests/${test.id}/analytics`)}
                          className="text-secondary-600 hover:text-secondary-900"
                        >
                          <ChartBarIcon className="h-4 w-4" />
                        </button>
                        <button className="text-danger-600 hover:text-danger-900">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-surface-400 mb-4">
              <FunnelIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-surface-900 mb-2">No tests found</h3>
            <p className="text-surface-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 