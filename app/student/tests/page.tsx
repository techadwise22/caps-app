'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ClockIcon, 
  UserIcon, 
  CalendarIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Test {
  id: string;
  title: string;
  subject: string;
  level: string;
  duration: string;
  questions: number;
  startDate?: string;
  startTime?: string;
  status: 'upcoming' | 'available' | 'completed';
  instructions: string;
  score?: number;
  completedDate?: string;
}

export default function StudentTestsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);

  // Mock data for CA student tests
  const upcomingTests: Test[] = [
    {
      id: '1',
      title: 'CA Foundation - Accounting Mock Test 1',
      subject: 'Accounting',
      level: 'Foundation',
      duration: '2 hours 30 minutes',
      questions: 100,
      startDate: '2024-01-20',
      startTime: '10:00 AM',
      status: 'upcoming',
      instructions: 'This test covers basic accounting principles and concepts.'
    },
    {
      id: '2',
      title: 'CA Foundation - Business Laws Practice Test',
      subject: 'Business Laws',
      level: 'Foundation',
      duration: '1 hour 45 minutes',
      questions: 75,
      startDate: '2024-01-22',
      startTime: '2:00 PM',
      status: 'upcoming',
      instructions: 'Practice test covering company law, partnership law, and contract law.'
    }
  ];

  const availableTests: Test[] = [
    {
      id: '3',
      title: 'CA Foundation - Economics Quiz',
      subject: 'Economics',
      level: 'Foundation',
      duration: '1 hour',
      questions: 50,
      status: 'available',
      instructions: 'Quick quiz on microeconomics and macroeconomics concepts.'
    },
    {
      id: '4',
      title: 'CA Foundation - Mathematics Practice',
      subject: 'Mathematics',
      level: 'Foundation',
      duration: '1 hour 30 minutes',
      questions: 60,
      status: 'available',
      instructions: 'Practice test covering algebra and statistics fundamentals.'
    }
  ];

  const completedTests: Test[] = [
    {
      id: '5',
      title: 'CA Foundation - Accounting Basics',
      subject: 'Accounting',
      level: 'Foundation',
      duration: '2 hours',
      questions: 80,
      status: 'completed',
      instructions: 'Basic accounting concepts and principles.',
      score: 85,
      completedDate: '2024-01-10'
    },
    {
      id: '6',
      title: 'CA Foundation - Business Laws Intro',
      subject: 'Business Laws',
      level: 'Foundation',
      duration: '1 hour 30 minutes',
      questions: 60,
      status: 'completed',
      instructions: 'Introduction to business laws and legal frameworks.',
      score: 78,
      completedDate: '2024-01-08'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Foundation':
        return 'bg-blue-100 text-blue-800';
      case 'Intermediate':
        return 'bg-green-100 text-green-800';
      case 'Final':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const startTest = (test: Test) => {
    setSelectedTest(test);
    setShowTestModal(true);
  };

  const confirmStartTest = () => {
    if (selectedTest) {
      // Navigate to test player
      router.push(`/student/tests/${selectedTest.id}/start`);
    }
  };

  const closeTestModal = () => {
    setShowTestModal(false);
    setSelectedTest(null);
  };

  const totalTests = upcomingTests.length + availableTests.length + completedTests.length;
  const averageScore = completedTests.length > 0 
    ? Math.round(completedTests.reduce((sum, test) => sum + (test.score || 0), 0) / completedTests.length)
    : 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 mb-2">My Tests</h1>
          <p className="text-surface-600">Manage your CA mock tests and practice sessions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600">Total Tests</p>
                <p className="text-2xl font-bold text-surface-900">{totalTests}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600">Upcoming</p>
                <p className="text-2xl font-bold text-surface-900">{upcomingTests.length}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600">Completed</p>
                <p className="text-2xl font-bold text-surface-900">{completedTests.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600">Average Score</p>
                <p className="text-2xl font-bold text-surface-900">{averageScore}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tests */}
        {upcomingTests.length > 0 && (
          <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-surface-900">Upcoming Tests</h2>
              <p className="text-surface-600 text-sm">Scheduled mock tests and examinations</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingTests.map((test) => (
                <div key={test.id} className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(test.level)}`}>
                      {test.level}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                      {test.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-surface-900 mb-2">{test.title}</h3>
                  
                  <div className="space-y-2 text-sm text-surface-600 mb-3">
                    <span>{test.subject}</span>
                    <span>{test.duration}</span>
                    <span>{test.questions} questions</span>
                  </div>
                  
                  <p className="text-sm text-surface-600 mb-3">{test.instructions}</p>
                  
                  <div className="text-sm text-surface-500 mb-4">
                    <span className="font-medium">Scheduled:</span> {test.startDate} at {test.startTime}
                  </div>
                  
                  <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium">
                    <CalendarIcon className="h-4 w-4 inline mr-2" />
                    Scheduled
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Tests */}
        {availableTests.length > 0 && (
          <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-surface-900">Available Tests</h2>
              <p className="text-surface-600 text-sm">Practice tests you can start now</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableTests.map((test) => (
                <div key={test.id} className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(test.level)}`}>
                      {test.level}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                      {test.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-surface-900 mb-2">{test.title}</h3>
                  
                  <div className="space-y-2 text-sm text-surface-600 mb-3">
                    <span>{test.subject}</span>
                    <span>{test.duration}</span>
                    <span>{test.questions} questions</span>
                  </div>
                  
                  <p className="text-sm text-surface-600 mb-3">{test.instructions}</p>
                  
                  <button
                    onClick={() => startTest(test)}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Start Test
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Tests */}
        {completedTests.length > 0 && (
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-surface-900">Completed Tests</h2>
              <p className="text-surface-600 text-sm">Your test history and performance</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedTests.map((test) => (
                <div key={test.id} className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(test.level)}`}>
                      {test.level}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                      {test.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-surface-900 mb-2">{test.title}</h3>
                  
                  <div className="space-y-2 text-sm text-surface-600 mb-3">
                    <span>{test.subject}</span>
                    <span>{test.duration}</span>
                    <span>{test.questions} questions</span>
                  </div>
                  
                  <p className="text-sm text-surface-600 mb-3">{test.instructions}</p>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-surface-500">
                      Completed: {test.completedDate}
                    </span>
                    <span className={`font-bold ${getScoreColor(test.score || 0)}`}>
                      Score: {test.score}%
                    </span>
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    <CheckCircleIcon className="h-4 w-4 inline mr-2" />
                    View Results
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Start Confirmation Modal */}
        {showTestModal && selectedTest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-surface-900 mb-4">Start Test</h3>
              
              <div className="mb-6">
                <p className="text-surface-600 mb-2">
                  You are about to start: <strong>{selectedTest.title}</strong>
                </p>
                
                <div className="bg-surface-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{selectedTest.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="font-medium">{selectedTest.questions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subject:</span>
                    <span className="font-medium">{selectedTest.subject}</span>
                  </div>
                </div>
                
                <p className="text-sm text-surface-500 mt-4">
                  Once you start, the timer will begin and you cannot pause the test.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={closeTestModal}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStartTest}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Start Test
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 