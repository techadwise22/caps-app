'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  DocumentTextIcon, 
  QuestionMarkCircleIcon, 
  PlayIcon,
  BookOpenIcon,
  ClockIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface StudyMaterial {
  id: string;
  title: string;
  type: 'youtube' | 'file' | 'mcq';
  subject: string;
  level: string;
  lastAccessed: string;
  description: string;
  url?: string;
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user && !loadingData) {
      const hour = new Date().getHours();
      let greeting = 'Good morning';
      if (hour >= 12 && hour < 17) {
        greeting = 'Good afternoon';
      } else if (hour >= 17) {
        greeting = 'Good evening';
      }

      const hasShownWelcome = sessionStorage.getItem('welcome-shown');
      if (!hasShownWelcome) {
        toast.success(`${greeting}, ${user.full_name}! Welcome to CAPS Learn.`);
        sessionStorage.setItem('welcome-shown', 'true');
      }
    }
  }, [user, loadingData]);

  useEffect(() => {
    loadStudyMaterials();
  }, []);

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
        lastAccessed: '2024-01-13',
        description: 'Introduction to microeconomics and macroeconomics concepts.',
        url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwcozr0xl-9nBuJPowqsIgDl'
      },
      {
        id: '4',
        title: 'CA Foundation - Mathematics Basics',
        type: 'youtube',
        subject: 'Mathematics',
        level: 'Foundation',
        lastAccessed: '2024-01-12',
        description: 'Algebra and statistics fundamentals for CA students.',
        url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwctcAYH8Myyb-5CKdDFPJNR'
      },
      {
        id: '5',
        title: 'CA Foundation - Accounting Notes',
        type: 'file',
        subject: 'Accounting',
        level: 'Foundation',
        lastAccessed: '2024-01-15',
        description: 'Comprehensive PDF notes covering basic accounting principles, journal entries, and ledger accounts.'
      },
      {
        id: '6',
        title: 'CA Foundation - Business Laws Notes',
        type: 'file',
        subject: 'Business Laws',
        level: 'Foundation',
        lastAccessed: '2024-01-14',
        description: 'Detailed notes on company law, partnership law, and contract law fundamentals.'
      },
      {
        id: '7',
        title: 'CA Foundation - Economics Notes',
        type: 'file',
        subject: 'Economics',
        level: 'Foundation',
        lastAccessed: '2024-01-13',
        description: 'Comprehensive notes on microeconomics and macroeconomics concepts.'
      },
      {
        id: '8',
        title: 'CA Foundation - Mathematics Notes',
        type: 'file',
        subject: 'Mathematics',
        level: 'Foundation',
        lastAccessed: '2024-01-12',
        description: 'Algebra and statistics notes with practice problems and solutions.'
      },
      {
        id: '9',
        title: 'CA Foundation - Accounting MCQs',
        type: 'mcq',
        subject: 'Accounting',
        level: 'Foundation',
        lastAccessed: '2024-01-15',
        description: 'Practice MCQs covering accounting fundamentals and concepts.'
      },
      {
        id: '10',
        title: 'CA Foundation - Business Laws MCQs',
        type: 'mcq',
        subject: 'Business Laws',
        level: 'Foundation',
        lastAccessed: '2024-01-14',
        description: 'Practice MCQs on company law, partnership law, and contract law.'
      }
    ];
    setStudyMaterials(materials);
    setLoadingData(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <PlayIcon className="h-5 w-5 text-red-600" />;
      case 'file':
        return <DocumentTextIcon className="h-5 w-5 text-blue-600" />;
      case 'mcq':
        return <QuestionMarkCircleIcon className="h-5 w-5 text-green-600" />;
      default:
        return <BookOpenIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'youtube':
        return 'bg-red-100 text-red-800';
      case 'file':
        return 'bg-blue-100 text-blue-800';
      case 'mcq':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const openMaterial = (material: StudyMaterial) => {
    if (material.type === 'youtube' && material.url) {
      window.open(material.url, '_blank');
    } else if (material.type === 'mcq') {
      // Navigate to MCQ practice page
      window.location.href = `/student/practice/${material.subject.toLowerCase().replace(' ', '-')}`;
    } else if (material.type === 'file') {
      // For now, show a message about PDF notes
      toast.success('PDF notes are available for download in the Content section.');
    }
  };

  if (loadingData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 mb-2">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-surface-600">
            Continue your CA Foundation journey with our comprehensive study materials.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <PlayIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">Video Playlists</p>
                <p className="text-2xl font-bold text-surface-900">
                  {studyMaterials.filter(m => m.type === 'youtube').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <QuestionMarkCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">MCQ Sets</p>
                <p className="text-2xl font-bold text-surface-900">
                  {studyMaterials.filter(m => m.type === 'mcq').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">PDF Notes</p>
                <p className="text-2xl font-bold text-surface-900">
                  {studyMaterials.filter(m => m.type === 'file').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Study Materials */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-surface-900">Study Materials</h2>
              <p className="text-surface-600 text-sm">Access your learning resources</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyMaterials.map((material) => (
              <div
                key={material.id}
                className="border border-surface-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openMaterial(material)}
              >
                <div className="flex items-start justify-between mb-3">
                  {getTypeIcon(material.type)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(material.type)}`}>
                    {material.type.toUpperCase()}
                  </span>
                </div>
                
                <h3 className="font-semibold text-surface-900 mb-2 line-clamp-2">
                  {material.title}
                </h3>
                
                <p className="text-surface-600 text-sm mb-3 line-clamp-2">
                  {material.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-surface-500">
                  <span className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {material.lastAccessed}
                  </span>
                  <span className="px-2 py-1 bg-surface-100 rounded">
                    {material.subject}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 