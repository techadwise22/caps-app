'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BookOpenIcon, PlayIcon, DocumentTextIcon, QuestionMarkCircleIcon, EyeIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface StudyMaterial {
  id: string;
  title: string;
  type: 'youtube' | 'pdf' | 'mcq';
  subject: string;
  level: string;
  progress: number;
  lastAccessed: string;
  description: string;
  url?: string;
}

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadStudyMaterials();
    }
  }, [user]);

  // Add welcome message effect
  useEffect(() => {
    if (user && !loadingData) {
      const hour = new Date().getHours();
      let greeting = 'Good morning';
      if (hour >= 12 && hour < 17) {
        greeting = 'Good afternoon';
      } else if (hour >= 17) {
        greeting = 'Good evening';
      }
      
      // Show welcome toast only once per session
      const hasShownWelcome = sessionStorage.getItem('welcome-shown');
      if (!hasShownWelcome) {
        toast.success(`${greeting}, ${user.full_name}! Welcome to CAPS Learn.`);
        sessionStorage.setItem('welcome-shown', 'true');
      }
    }
  }, [user, loadingData]);

  const loadStudyMaterials = () => {
    setLoadingData(true);
    
    // Mock data for working features only
    const materials: StudyMaterial[] = [
      {
        id: '1',
        title: 'CA Foundation - Accounting Fundamentals',
        type: 'youtube',
        subject: 'Accounting',
        level: 'Foundation',
        progress: 75,
        lastAccessed: '2024-01-15',
        description: 'Complete video series covering accounting principles, double-entry bookkeeping, and financial statements.',
        url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwe3FSEsrYm4ACWlxbg3dIet'
      },
      {
        id: '2',
        title: 'CA Foundation - Business Laws',
        type: 'youtube',
        subject: 'Business Laws',
        level: 'Foundation',
        progress: 100,
        lastAccessed: '2024-01-14',
        description: 'Comprehensive video series on company law, partnership law, and contract law.',
        url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwfpmL4P3SBg7uC4DuV8G3kI'
      },
      {
        id: '3',
        title: 'CA Foundation - Economics Concepts',
        type: 'youtube',
        subject: 'Economics',
        level: 'Foundation',
        progress: 60,
        lastAccessed: '2024-01-13',
        description: 'Video series covering microeconomics, macroeconomics, and economic theory.',
        url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwcozr0xl-9nBuJPowqsIgDl'
      },
      {
        id: '4',
        title: 'CA Foundation - Quantitative Aptitude',
        type: 'youtube',
        subject: 'Mathematics',
        level: 'Foundation',
        progress: 45,
        lastAccessed: '2024-01-12',
        description: 'Complete course on mathematics, statistics, and quantitative methods.',
        url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwctcAYH8Myyb-5CKdDFPJNR'
      },
      {
        id: '5',
        title: 'CA Foundation - Accounting Notes',
        type: 'pdf',
        subject: 'Accounting',
        level: 'Foundation',
        progress: 80,
        lastAccessed: '2024-01-15',
        description: 'Comprehensive PDF notes covering basic accounting principles and practices.'
      },
      {
        id: '6',
        title: 'CA Foundation - Business Laws Notes',
        type: 'pdf',
        subject: 'Business Laws',
        level: 'Foundation',
        progress: 65,
        lastAccessed: '2024-01-14',
        description: 'Detailed PDF notes on business laws, company law, and legal frameworks.'
      },
      {
        id: '7',
        title: 'CA Foundation - Accounting MCQs',
        type: 'mcq',
        subject: 'Accounting',
        level: 'Foundation',
        progress: 70,
        lastAccessed: '2024-01-15',
        description: 'Practice MCQs covering accounting fundamentals and concepts.'
      },
      {
        id: '8',
        title: 'CA Foundation - Business Laws MCQs',
        type: 'mcq',
        subject: 'Business Laws',
        level: 'Foundation',
        progress: 55,
        lastAccessed: '2024-01-14',
        description: 'Practice MCQs on business laws and legal concepts.'
      }
    ];

    setStudyMaterials(materials);
    setLoadingData(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return PlayIcon;
      case 'pdf':
        return DocumentTextIcon;
      case 'mcq':
        return QuestionMarkCircleIcon;
      default:
        return BookOpenIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'youtube':
        return 'bg-red-100 text-red-600';
      case 'pdf':
        return 'bg-blue-100 text-blue-600';
      case 'mcq':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
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

  const handleMaterialClick = (material: StudyMaterial) => {
    if (material.type === 'youtube' && material.url) {
      window.open(material.url, '_blank');
    } else if (material.type === 'pdf') {
      // For PDFs, navigate to content page
      router.push('/student/content');
    } else if (material.type === 'mcq') {
      // For MCQs, navigate to practice page
      router.push('/student/practice/accounting');
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-success-600';
    if (progress >= 60) return 'bg-warning-600';
    return 'bg-primary-600';
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalMaterials = studyMaterials.length;
  const completedMaterials = studyMaterials.filter(m => m.progress === 100).length;
  const inProgressMaterials = studyMaterials.filter(m => m.progress > 0 && m.progress < 100).length;
  const totalStudyHours = studyMaterials.reduce((sum, m) => sum + (m.progress / 100) * 2, 0);

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
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">Total Materials</p>
                <p className="text-2xl font-bold text-surface-900">{totalMaterials}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-surface-900">{completedMaterials}</p>
              </div>
              <div className="bg-success-100 p-3 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-surface-900">{inProgressMaterials}</p>
              </div>
              <div className="bg-warning-100 p-3 rounded-lg">
                <ClockIcon className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-surface-600 text-sm font-medium">Study Hours</p>
                <p className="text-2xl font-bold text-surface-900">{totalStudyHours.toFixed(1)}</p>
              </div>
              <div className="bg-secondary-100 p-3 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-secondary-600" />
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
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyMaterials.map((material) => {
                const TypeIcon = getTypeIcon(material.type);
                return (
                  <div key={material.id} className="border border-surface-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleMaterialClick(material)}>
                    <div className="flex items-start space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(material.type)}`}>
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-surface-900 text-sm line-clamp-2">{material.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(material.level)}`}>
                            {material.level}
                          </span>
                          <span className="text-xs text-surface-600">{material.subject}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-surface-600 mb-3 line-clamp-2">{material.description}</p>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-surface-600 mb-1">
                        <span>Progress</span>
                        <span>{material.progress}%</span>
                      </div>
                      <div className="w-full bg-surface-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(material.progress)}`}
                          style={{ width: `${material.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-surface-500">Last accessed: {material.lastAccessed}</span>
                      <button className="bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700 transition-colors text-xs flex items-center">
                        <EyeIcon className="h-3 w-3 mr-1" />
                        {material.type === 'youtube' ? 'Watch' : material.type === 'pdf' ? 'View' : 'Practice'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-semibold text-surface-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => router.push('/student/content')}
              className="flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <BookOpenIcon className="h-5 w-5" />
              <span>Study Materials</span>
            </button>
            <button 
              onClick={() => router.push('/student/classes')}
              className="flex items-center justify-center space-x-2 bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-colors"
            >
              <PlayIcon className="h-5 w-5" />
              <span>Video Classes</span>
            </button>
            <button 
              onClick={() => router.push('/student/practice/accounting')}
              className="flex items-center justify-center space-x-2 bg-success-600 text-white px-6 py-3 rounded-lg hover:bg-success-700 transition-colors"
            >
              <QuestionMarkCircleIcon className="h-5 w-5" />
              <span>Practice MCQs</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 