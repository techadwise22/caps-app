'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ClipboardDocumentListIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function StudentTestsPage() {
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

  // Mock data for CA student tests
  const upcomingTests = [
    {
      id: '1',
      title: 'CA Foundation - Accounting Mock Test 1',
      level: 'Foundation',
      subject: 'Accounting',
      duration: '3 hours',
      questions: 100,
      startDate: '2024-01-20',
      startTime: '10:00 AM',
      status: 'upcoming',
      instructions: 'This test covers basic accounting principles and concepts.',
    },
    {
      id: '2',
      title: 'CA Foundation - Business Laws Practice Test',
      level: 'Foundation',
      subject: 'Business Laws',
      duration: '2 hours',
      questions: 60,
      startDate: '2024-01-22',
      startTime: '2:00 PM',
      status: 'upcoming',
      instructions: 'Focus on company law and partnership law sections.',
    },
  ];

  const availableTests = [
    {
      id: '3',
      title: 'CA Foundation - Economics Quiz',
      level: 'Foundation',
      subject: 'Economics',
      duration: '1 hour',
      questions: 30,
      status: 'available',
      instructions: 'Quick quiz on economic concepts and theories.',
    },
    {
      id: '4',
      title: 'CA Foundation - Mathematics Practice',
      level: 'Foundation',
      subject: 'Mathematics',
      duration: '1.5 hours',
      questions: 45,
      status: 'available',
      instructions: 'Practice test covering algebra and statistics.',
    },
  ];

  const completedTests = [
    {
      id: '5',
      title: 'CA Foundation - Accounting Basics',
      level: 'Foundation',
      subject: 'Accounting',
      completedDate: '2024-01-15',
      score: 78,
      totalQuestions: 50,
      correctAnswers: 39,
      timeTaken: '2 hours 15 minutes',
      status: 'completed',
    },
    {
      id: '6',
      title: 'CA Foundation - Business Laws Introduction',
      level: 'Foundation',
      subject: 'Business Laws',
      completedDate: '2024-01-12',
      score: 82,
      totalQuestions: 40,
      correctAnswers: 33,
      timeTaken: '1 hour 45 minutes',
      status: 'completed',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-warning-100 text-warning-700';
      case 'available':
        return 'bg-success-100 text-success-700';
      case 'completed':
        return 'bg-primary-100 text-primary-700';
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
        <div>
          <h1 className="text-2xl font-bold text-surface-900">My Tests</h1>
          <p className="text-surface-600">Manage your CA mock tests and practice sessions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <ClipboardDocumentListIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Total Tests</p>
                <p className="text-2xl font-bold text-surface-900">{upcomingTests.length + availableTests.length + completedTests.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Upcoming</p>
                <p className="text-2xl font-bold text-surface-900">{upcomingTests.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Completed</p>
                <p className="text-2xl font-bold text-surface-900">{completedTests.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <ClipboardDocumentListIcon className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Average Score</p>
                <p className="text-2xl font-bold text-surface-900">
                  {completedTests.length > 0 
                    ? Math.round(completedTests.reduce((sum, test) => sum + test.score, 0) / completedTests.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tests */}
        {upcomingTests.length > 0 && (
          <div className="bg-white rounded-xl shadow-soft">
            <div className="p-6 border-b border-surface-200">
              <h2 className="text-xl font-semibold text-surface-900">Upcoming Tests</h2>
              <p className="text-surface-600 text-sm">Scheduled mock tests and examinations</p>
            </div>
            <div className="p-6 space-y-4">
              {upcomingTests.map((test) => (
                <div key={test.id} className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-surface-900 mb-2">{test.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-surface-600 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(test.level)}`}>
                          {test.level}
                        </span>
                        <span>{test.subject}</span>
                        <span>{test.duration}</span>
                        <span>{test.questions} questions</span>
                      </div>
                      <p className="text-sm text-surface-600 mb-3">{test.instructions}</p>
                      <div className="flex items-center space-x-4 text-sm text-surface-600">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {test.startDate} at {test.startTime}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                          {test.status}
                        </span>
                      </div>
                    </div>
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Tests */}
        {availableTests.length > 0 && (
          <div className="bg-white rounded-xl shadow-soft">
            <div className="p-6 border-b border-surface-200">
              <h2 className="text-xl font-semibold text-surface-900">Available Tests</h2>
              <p className="text-surface-600 text-sm">Practice tests you can start now</p>
            </div>
            <div className="p-6 space-y-4">
              {availableTests.map((test) => (
                <div key={test.id} className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-surface-900 mb-2">{test.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-surface-600 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(test.level)}`}>
                          {test.level}
                        </span>
                        <span>{test.subject}</span>
                        <span>{test.duration}</span>
                        <span>{test.questions} questions</span>
                      </div>
                      <p className="text-sm text-surface-600 mb-3">{test.instructions}</p>
                      <div className="flex items-center space-x-4 text-sm text-surface-600">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                          {test.status}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push(`/student/tests/${test.id}/start`)}
                      className="bg-success-600 text-white px-4 py-2 rounded-lg hover:bg-success-700 transition-colors flex items-center"
                    >
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Start Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Tests */}
        {completedTests.length > 0 && (
          <div className="bg-white rounded-xl shadow-soft">
            <div className="p-6 border-b border-surface-200">
              <h2 className="text-xl font-semibold text-surface-900">Completed Tests</h2>
              <p className="text-surface-600 text-sm">Your test history and performance</p>
            </div>
            <div className="p-6 space-y-4">
              {completedTests.map((test) => (
                <div key={test.id} className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-surface-900 mb-2">{test.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-surface-600 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(test.level)}`}>
                          {test.level}
                        </span>
                        <span>{test.subject}</span>
                        <span>Completed: {test.completedDate}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-surface-600">Score:</span>
                          <span className="ml-2 font-medium text-surface-900">{test.score}%</span>
                        </div>
                        <div>
                          <span className="text-surface-600">Correct:</span>
                          <span className="ml-2 font-medium text-surface-900">{test.correctAnswers}/{test.totalQuestions}</span>
                        </div>
                        <div>
                          <span className="text-surface-600">Time:</span>
                          <span className="ml-2 font-medium text-surface-900">{test.timeTaken}</span>
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                            {test.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Results
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 