'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  PlayIcon, 
  DocumentTextIcon, 
  QuestionMarkCircleIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface YouTubePlaylist {
  id: string;
  title: string;
  level: string;
  subject: string;
  description: string;
  instructor_name: string;
  playlist_url: string;
  total_videos: number;
  total_duration: string;
  views_count: number;
}

interface StudyMaterial {
  id: string;
  title: string;
  content_type: 'file' | 'mcq_set';
  level: string;
  subtitle: string;
  description: string;
  views_count: number;
  last_accessed: string;
}

interface MCQSet {
  id: string;
  title: string;
  level: string;
  subject: string;
  description: string;
  total_questions: number;
  last_accessed: string;
}

export default function StudentContentPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('videos');
  const [youtubePlaylists, setYoutubePlaylists] = useState<YouTubePlaylist[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [mcqSets, setMcqSets] = useState<MCQSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    setLoading(true);

    // Mock data for YouTube playlists
    const playlists: YouTubePlaylist[] = [
      {
        id: '1',
        title: 'CA Foundation - Accounting Fundamentals',
        level: 'Foundation',
        subject: 'Accounting',
        description: 'Complete video series covering accounting principles, double-entry bookkeeping, and financial statements.',
        instructor_name: 'CA Chandrashekhar Shetty Mundkur',
        playlist_url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwe3FSEsrYm4ACWlxbg3dIet',
        total_videos: 25,
        total_duration: '8 hours 30 minutes',
        views_count: 1250
      },
      {
        id: '2',
        title: 'CA Foundation - Business Laws',
        level: 'Foundation',
        subject: 'Business Laws',
        description: 'Comprehensive video series on company law, partnership law, and contract law.',
        instructor_name: 'Dr. Rajdeep Manwani',
        playlist_url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwfpmL4P3SBg7uC4DuV8G3kI',
        total_videos: 20,
        total_duration: '6 hours 45 minutes',
        views_count: 980
      },
      {
        id: '3',
        title: 'CA Foundation - Economics Concepts',
        level: 'Foundation',
        subject: 'Economics',
        description: 'Introduction to microeconomics and macroeconomics concepts.',
        instructor_name: 'Dr. Divyashree',
        playlist_url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwcozr0xl-9nBuJPowqsIgDl',
        total_videos: 18,
        total_duration: '5 hours 20 minutes',
        views_count: 750
      },
      {
        id: '4',
        title: 'CA Foundation - Mathematics Basics',
        level: 'Foundation',
        subject: 'Mathematics',
        description: 'Algebra and statistics fundamentals for CA students.',
        instructor_name: 'CA Sudhindra MS',
        playlist_url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwctcAYH8Myyb-5CKdDFPJNR',
        total_videos: 22,
        total_duration: '7 hours 15 minutes',
        views_count: 890
      }
    ];

    // Mock data for study materials (PDF notes)
    const materials: StudyMaterial[] = [
      {
        id: '1',
        title: 'CA Foundation - Accounting Notes',
        content_type: 'file',
        level: 'Foundation',
        subtitle: 'Accounting',
        description: 'Comprehensive PDF notes covering basic accounting principles, journal entries, and ledger accounts.',
        views_count: 890,
        last_accessed: '2024-01-15'
      },
      {
        id: '2',
        title: 'CA Foundation - Business Laws Notes',
        content_type: 'file',
        level: 'Foundation',
        subtitle: 'Business Laws',
        description: 'Detailed notes on company law, partnership law, and contract law fundamentals.',
        views_count: 720,
        last_accessed: '2024-01-14'
      },
      {
        id: '3',
        title: 'CA Foundation - Economics Notes',
        content_type: 'file',
        level: 'Foundation',
        subtitle: 'Economics',
        description: 'Comprehensive notes on microeconomics and macroeconomics concepts.',
        views_count: 650,
        last_accessed: '2024-01-13'
      },
      {
        id: '4',
        title: 'CA Foundation - Mathematics Notes',
        content_type: 'file',
        level: 'Foundation',
        subtitle: 'Mathematics',
        description: 'Algebra and statistics notes with practice problems and solutions.',
        views_count: 580,
        last_accessed: '2024-01-12'
      }
    ];

    // Mock data for MCQ sets
    const mcqs: MCQSet[] = [
      {
        id: '1',
        title: 'CA Foundation - Accounting MCQs',
        level: 'Foundation',
        subject: 'Accounting',
        description: 'Practice MCQs covering accounting fundamentals and concepts.',
        total_questions: 150,
        last_accessed: '2024-01-15'
      },
      {
        id: '2',
        title: 'CA Foundation - Business Laws MCQs',
        level: 'Foundation',
        subject: 'Business Laws',
        description: 'Practice MCQs on company law, partnership law, and contract law.',
        total_questions: 120,
        last_accessed: '2024-01-14'
      },
      {
        id: '3',
        title: 'CA Foundation - Economics MCQs',
        level: 'Foundation',
        subject: 'Economics',
        description: 'Practice MCQs covering microeconomics and macroeconomics concepts.',
        total_questions: 100,
        last_accessed: '2024-01-13'
      },
      {
        id: '4',
        title: 'CA Foundation - Mathematics MCQs',
        level: 'Foundation',
        subject: 'Mathematics',
        description: 'Practice MCQs on algebra and statistics fundamentals.',
        total_questions: 130,
        last_accessed: '2024-01-12'
      }
    ];

    setYoutubePlaylists(playlists);
    setStudyMaterials(materials);
    setMcqSets(mcqs);
    setLoading(false);
  };

  const openYouTubePlaylist = (url: string) => {
    window.open(url, '_blank');
  };

  const openMCQPractice = (subject: string) => {
    const subjectPath = subject.toLowerCase().replace(' ', '-');
    window.location.href = `/student/practice/${subjectPath}`;
  };

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

  if (loading) {
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Study Content</h1>
          <p className="text-surface-600">
            Access comprehensive study materials, video playlists, and practice questions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <div className="flex space-x-1 bg-surface-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'videos'
                  ? 'bg-white text-surface-900 shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <PlayIcon className="h-4 w-4 inline mr-2" />
              Video Playlists
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'materials'
                  ? 'bg-white text-surface-900 shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <DocumentTextIcon className="h-4 w-4 inline mr-2" />
              PDF Notes
            </button>
            <button
              onClick={() => setActiveTab('mcqs')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'mcqs'
                  ? 'bg-white text-surface-900 shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <QuestionMarkCircleIcon className="h-4 w-4 inline mr-2" />
              MCQs
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          {/* Video Playlists Tab */}
          {activeTab === 'videos' && (
            <div>
              <h2 className="text-xl font-semibold text-surface-900 mb-6">Video Playlists</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {youtubePlaylists.map((playlist) => (
                  <div key={playlist.id} className="border border-surface-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <PlayIcon className="h-8 w-8 text-red-600" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(playlist.level)}`}>
                        {playlist.level}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-surface-900 mb-2 line-clamp-2">
                      {playlist.title}
                    </h3>
                    
                    <p className="text-surface-600 text-sm mb-3 line-clamp-2">
                      {playlist.description}
                    </p>
                    
                    <div className="space-y-2 mb-4 text-xs text-surface-500">
                      <div className="flex items-center">
                        <UserIcon className="h-3 w-3 mr-2" />
                        {playlist.instructor_name}
                      </div>
                      <div className="flex items-center">
                        <PlayIcon className="h-3 w-3 mr-2" />
                        {playlist.total_videos} videos • {playlist.total_duration}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-3 w-3 mr-2" />
                        {playlist.views_count.toLocaleString()} views
                      </div>
                    </div>
                    
                    <button
                      onClick={() => openYouTubePlaylist(playlist.playlist_url)}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center"
                    >
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Watch Playlist
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PDF Notes Tab */}
          {activeTab === 'materials' && (
            <div>
              <h2 className="text-xl font-semibold text-surface-900 mb-6">PDF Notes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studyMaterials.map((material) => (
                  <div key={material.id} className="border border-surface-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(material.level)}`}>
                        {material.level}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-surface-900 mb-2 line-clamp-2">
                      {material.title}
                    </h3>
                    
                    <p className="text-surface-600 text-sm mb-3 line-clamp-2">
                      {material.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-surface-500 mb-4">
                      <span className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {material.last_accessed}
                      </span>
                      <span className="px-2 py-1 bg-surface-100 rounded">
                        {material.subtitle}
                      </span>
                    </div>
                    
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Download Notes
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MCQs Tab */}
          {activeTab === 'mcqs' && (
            <div>
              <h2 className="text-xl font-semibold text-surface-900 mb-6">Multiple Choice Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mcqSets.map((mcqSet) => (
                  <div key={mcqSet.id} className="border border-surface-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <QuestionMarkCircleIcon className="h-8 w-8 text-green-600" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(mcqSet.level)}`}>
                        {mcqSet.level}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-surface-900 mb-2 line-clamp-2">
                      {mcqSet.title}
                    </h3>
                    
                    <p className="text-surface-600 text-sm mb-3 line-clamp-2">
                      {mcqSet.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-surface-500 mb-4">
                      <span className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {mcqSet.last_accessed}
                      </span>
                      <span className="px-2 py-1 bg-surface-100 rounded">
                        {mcqSet.total_questions} questions
                      </span>
                    </div>
                    
                    <button
                      onClick={() => openMCQPractice(mcqSet.subject)}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center"
                    >
                      <QuestionMarkCircleIcon className="h-4 w-4 mr-2" />
                      Start Practice
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 