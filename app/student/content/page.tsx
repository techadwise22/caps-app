'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  BookOpenIcon, 
  PlayIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ClockIcon,
  EyeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function StudentContentPage() {
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

  // Mock data for CA study content
  const studyMaterials = [
    {
      id: '1',
      title: 'CA Foundation - Accounting Basics',
      type: 'study_material',
      level: 'Foundation',
      subject: 'Accounting',
      duration: '2 hours',
      progress: 75,
      status: 'in_progress',
      description: 'Comprehensive notes covering basic accounting principles, journal entries, and ledger accounts.',
      lastAccessed: '2024-01-15',
    },
    {
      id: '2',
      title: 'CA Foundation - Business Laws Video Series',
      type: 'video_series',
      level: 'Foundation',
      subject: 'Business Laws',
      duration: '4 hours',
      progress: 100,
      status: 'completed',
      description: 'Complete video series covering company law, partnership law, and contract law.',
      lastAccessed: '2024-01-14',
    },
    {
      id: '3',
      title: 'CA Foundation - Economics Notes',
      type: 'study_material',
      level: 'Foundation',
      subject: 'Economics',
      duration: '1.5 hours',
      progress: 0,
      status: 'not_started',
      description: 'Detailed notes on microeconomics and macroeconomics concepts.',
      lastAccessed: null,
    },
  ];

  const practiceQuestions = [
    {
      id: '4',
      title: 'CA Foundation - Accounting Practice Questions',
      type: 'practice_questions',
      level: 'Foundation',
      subject: 'Accounting',
      questions: 50,
      completed: 35,
      status: 'in_progress',
      description: 'MCQ practice questions covering all accounting topics.',
      lastAccessed: '2024-01-15',
    },
    {
      id: '5',
      title: 'CA Foundation - Business Laws MCQs',
      type: 'practice_questions',
      level: 'Foundation',
      subject: 'Business Laws',
      questions: 40,
      completed: 40,
      status: 'completed',
      description: 'Practice questions on company law and partnership law.',
      lastAccessed: '2024-01-13',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'study_material':
        return DocumentTextIcon;
      case 'video_series':
        return PlayIcon;
      case 'practice_questions':
        return BookOpenIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'study_material':
        return 'bg-primary-100 text-primary-700';
      case 'video_series':
        return 'bg-secondary-100 text-secondary-700';
      case 'practice_questions':
        return 'bg-success-100 text-success-700';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-700';
      case 'in_progress':
        return 'bg-warning-100 text-warning-700';
      case 'not_started':
        return 'bg-surface-100 text-surface-700';
      default:
        return 'bg-surface-100 text-surface-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Study Materials</h1>
          <p className="text-surface-600">Access your CA study materials and practice resources</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Total Materials</p>
                <p className="text-2xl font-bold text-surface-900">{studyMaterials.length + practiceQuestions.length}</p>
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
                <p className="text-2xl font-bold text-surface-900">
                  {(studyMaterials.filter(m => m.status === 'completed').length + 
                    practiceQuestions.filter(p => p.status === 'completed').length)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">In Progress</p>
                <p className="text-2xl font-bold text-surface-900">
                  {(studyMaterials.filter(m => m.status === 'in_progress').length + 
                    practiceQuestions.filter(p => p.status === 'in_progress').length)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Study Hours</p>
                <p className="text-2xl font-bold text-surface-900">12.5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Study Materials */}
        <div className="bg-white rounded-xl shadow-soft">
          <div className="p-6 border-b border-surface-200">
            <h2 className="text-xl font-semibold text-surface-900">Study Materials</h2>
            <p className="text-surface-600 text-sm">Notes, videos, and comprehensive study resources</p>
          </div>
          <div className="p-6 space-y-4">
            {studyMaterials.map((material) => {
              const TypeIcon = getTypeIcon(material.type);
              return (
                <div key={material.id} className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(material.type)}`}>
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-surface-900">{material.title}</h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-surface-600 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(material.level)}`}>
                          {material.level}
                        </span>
                        <span>{material.subject}</span>
                        <span>{material.duration}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(material.status)}`}>
                          {material.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-surface-600 mb-3">{material.description}</p>
                      {material.progress > 0 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-surface-600 mb-1">
                            <span>Progress</span>
                            <span>{material.progress}%</span>
                          </div>
                          <div className="w-full bg-surface-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${material.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      {material.lastAccessed && (
                        <p className="text-xs text-surface-500">Last accessed: {material.lastAccessed}</p>
                      )}
                    </div>
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      {material.status === 'not_started' ? 'Start' : 'Continue'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Practice Questions */}
        <div className="bg-white rounded-xl shadow-soft">
          <div className="p-6 border-b border-surface-200">
            <h2 className="text-xl font-semibold text-surface-900">Practice Questions</h2>
            <p className="text-surface-600 text-sm">MCQ practice sets and question banks</p>
          </div>
          <div className="p-6 space-y-4">
            {practiceQuestions.map((questionSet) => {
              const TypeIcon = getTypeIcon(questionSet.type);
              return (
                <div key={questionSet.id} className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(questionSet.type)}`}>
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-surface-900">{questionSet.title}</h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-surface-600 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(questionSet.level)}`}>
                          {questionSet.level}
                        </span>
                        <span>{questionSet.subject}</span>
                        <span>{questionSet.completed}/{questionSet.questions} questions</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(questionSet.status)}`}>
                          {questionSet.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-surface-600 mb-3">{questionSet.description}</p>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-surface-600 mb-1">
                          <span>Progress</span>
                          <span>{Math.round((questionSet.completed / questionSet.questions) * 100)}%</span>
                        </div>
                        <div className="w-full bg-surface-200 rounded-full h-2">
                          <div 
                            className="bg-success-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(questionSet.completed / questionSet.questions) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      {questionSet.lastAccessed && (
                        <p className="text-xs text-surface-500">Last accessed: {questionSet.lastAccessed}</p>
                      )}
                    </div>
                    <button className="bg-success-600 text-white px-4 py-2 rounded-lg hover:bg-success-700 transition-colors flex items-center">
                      <PlayIcon className="h-4 w-4 mr-2" />
                      {questionSet.status === 'completed' ? 'Review' : 'Practice'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 