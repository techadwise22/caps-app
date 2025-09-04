'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  BookOpenIcon, 
  DocumentTextIcon, 
  VideoCameraIcon, 
  QuestionMarkCircleIcon, 
  EyeIcon, 
  PlayIcon, 
  AcademicCapIcon 
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
  progress: number;
}

interface StudyMaterial {
  id: string;
  title: string;
  content_type: string;
  level: string;
  subtitle: string;
  description: string;
  views_count: number;
  progress: number;
  last_accessed: string;
}

interface MCQSet {
  id: string;
  title: string;
  level: string;
  subject: string;
  description: string;
  total_questions: number;
  progress: number;
  last_accessed: string;
}

export default function StudentContentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'videos' | 'materials' | 'mcqs'>('videos');

  // Mock data for working features only
  const youtubePlaylists = [
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
      views_count: 1250,
      progress: 75
    },
    {
      id: '2',
      title: 'CA Foundation - Business Laws',
      level: 'Foundation',
      subject: 'Business Laws',
      description: 'Complete video series covering business laws, company law, and legal frameworks.',
      instructor_name: 'Dr. Rajdeep Manwani',
      playlist_url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwfpmL4P3SBg7uC4DuV8G3kI',
      total_videos: 20,
      total_duration: '6 hours 45 minutes',
      views_count: 2100,
      progress: 100
    },
    {
      id: '3',
      title: 'CA Foundation - Economics Concepts',
      level: 'Foundation',
      subject: 'Economics',
      description: 'Complete video series covering microeconomics, macroeconomics, and economic theory.',
      instructor_name: 'Dr. Divyashree',
      playlist_url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwcozr0xl-9nBuJPowqsIgDl',
      total_videos: 18,
      total_duration: '5 hours 20 minutes',
      views_count: 890,
      progress: 60
    },
    {
      id: '4',
      title: 'CA Foundation - Quantitative Aptitude',
      level: 'Foundation',
      subject: 'Mathematics',
      description: 'Complete course covering mathematics, statistics, and quantitative methods.',
      instructor_name: 'CA Sudhindra MS',
      playlist_url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwctcAYH8Myyb-5CKdDFPJNR',
      total_videos: 22,
      total_duration: '7 hours 15 minutes',
      views_count: 756,
      progress: 45
    }
  ];

  const studyMaterials = [
    {
      id: '1',
      title: 'CA Foundation - Accounting Notes',
      content_type: 'file',
      level: 'Foundation',
      subtitle: 'Accounting',
      description: 'Comprehensive PDF notes covering basic accounting principles, journal entries, and ledger accounts.',
      views_count: 890,
      progress: 80,
      last_accessed: '2024-01-15'
    },
    {
      id: '2',
      title: 'CA Foundation - Business Laws Notes',
      content_type: 'file',
      level: 'Foundation',
      subtitle: 'Business Laws',
      description: 'Detailed PDF notes on business laws, company law, and legal frameworks.',
      views_count: 756,
      progress: 65,
      last_accessed: '2024-01-14'
    }
  ];

  const mcqSets = [
    {
      id: '1',
      title: 'CA Foundation - Accounting MCQs',
      level: 'Foundation',
      subject: 'Accounting',
      description: 'Practice MCQs covering accounting fundamentals and concepts.',
      total_questions: 150,
      progress: 70,
      last_accessed: '2024-01-15'
    },
    {
      id: '2',
      title: 'CA Foundation - Business Laws MCQs',
      level: 'Foundation',
      subject: 'Business Laws',
      description: 'Practice MCQs on business laws and legal concepts.',
      total_questions: 120,
      progress: 55,
      last_accessed: '2024-01-14'
    }
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // fetchContentData(); // No longer fetching from Supabase
    }
  }, [user]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'study_material':
        return DocumentTextIcon;
      case 'video_series':
        return VideoCameraIcon;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  const stats = [
    {
      title: 'Total Materials',
      value: (youtubePlaylists.length + studyMaterials.length + mcqSets.length).toString(),
      icon: BookOpenIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      title: 'Video Playlists',
      value: youtubePlaylists.length.toString(),
      icon: VideoCameraIcon,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
    },
    {
      title: 'Study Materials',
      value: studyMaterials.length.toString(),
      icon: DocumentTextIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      title: 'Practice Sets',
      value: mcqSets.length.toString(),
      icon: AcademicCapIcon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
    },
  ];

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
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-center">
                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-surface-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-soft">
          <div className="border-b border-surface-200 px-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('videos')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'videos'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <VideoCameraIcon className="h-5 w-5" />
                  <span>YouTube Playlists ({youtubePlaylists.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'materials'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <DocumentTextIcon className="h-5 w-5" />
                  <span>PDF Notes ({studyMaterials.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('mcqs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'mcqs'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <QuestionMarkCircleIcon className="h-5 w-5" />
                  <span>MCQs ({mcqSets.length})</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* YouTube Playlists Tab */}
            {activeTab === 'videos' && (
              <div className="space-y-4">
                {youtubePlaylists.length > 0 ? (
                  youtubePlaylists.map((playlist) => (
                    <div key={playlist.id} className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-secondary-100 rounded-lg">
                              <VideoCameraIcon className="h-5 w-5 text-secondary-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-surface-900">{playlist.title}</h3>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-surface-600 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(playlist.level)}`}>
                              {playlist.level}
                            </span>
                            <span>{playlist.subject}</span>
                            <span>{playlist.total_videos} videos</span>
                            <span>{playlist.total_duration}</span>
                          </div>
                          <p className="text-sm text-surface-600 mb-3">{playlist.description}</p>
                          <p className="text-xs text-surface-500">Instructor: {playlist.instructor_name}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => window.open(playlist.playlist_url, '_blank')}
                            className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center"
                          >
                            <PlayIcon className="h-4 w-4 mr-2" />
                            Watch Playlist
                          </button>
                          <button 
                            onClick={() => router.push(`/student/content/videos/${playlist.id}`)}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                          >
                            <EyeIcon className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-surface-600">
                    <VideoCameraIcon className="h-12 w-12 mx-auto mb-4 text-surface-400" />
                    <p>No video playlists available</p>
                  </div>
                )}
              </div>
            )}

            {/* Study Materials Tab */}
            {activeTab === 'materials' && (
              <div className="space-y-4">
                {studyMaterials.length > 0 ? (
                  studyMaterials.map((material) => {
                    const TypeIcon = getTypeIcon(material.content_type);
                    return (
                      <div key={material.id} className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className={`p-2 rounded-lg ${getTypeColor(material.content_type)}`}>
                                <TypeIcon className="h-5 w-5" />
                              </div>
                              <h3 className="text-lg font-semibold text-surface-900">{material.title}</h3>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-surface-600 mb-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(material.level)}`}>
                                {material.level}
                              </span>
                              <span>{material.subtitle}</span>
                              <span>{material.views_count} views</span>
                            </div>
                            <p className="text-sm text-surface-600 mb-3">{material.description}</p>
                            {material.progress && material.progress > 0 && (
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
                            {material.last_accessed && (
                              <p className="text-xs text-surface-500">Last accessed: {formatDate(material.last_accessed)}</p>
                            )}
                          </div>
                          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                            <EyeIcon className="h-4 w-4 mr-2" />
                            View Material
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-surface-600">
                    <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-surface-400" />
                    <p>No study materials available</p>
                  </div>
                )}
              </div>
            )}

            {/* MCQs Tab */}
            {activeTab === 'mcqs' && (
              <div className="space-y-4">
                {mcqSets.length > 0 ? (
                  mcqSets.map((mcqSet) => (
                    <div key={mcqSet.id} className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-success-100 rounded-lg">
                              <QuestionMarkCircleIcon className="h-5 w-5 text-success-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-surface-900">{mcqSet.title}</h3>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-surface-600 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(mcqSet.level)}`}>
                              {mcqSet.level}
                            </span>
                            <span>{mcqSet.subject}</span>
                            <span>{mcqSet.total_questions} questions</span>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm text-surface-600 mb-1">
                              <span>Progress</span>
                              <span>{mcqSet.progress}%</span>
                            </div>
                            <div className="w-full bg-surface-200 rounded-full h-2">
                              <div 
                                className="bg-success-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${mcqSet.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          {mcqSet.last_accessed && (
                            <p className="text-xs text-surface-500">Last accessed: {formatDate(mcqSet.last_accessed)}</p>
                          )}
                        </div>
                        <button 
                          onClick={() => router.push(`/student/practice/${mcqSet.subject.toLowerCase()}`)}
                          className="bg-success-600 text-white px-4 py-2 rounded-lg hover:bg-success-700 transition-colors flex items-center"
                        >
                          <PlayIcon className="h-4 w-4 mr-2" />
                          Start Practice
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-surface-600">
                    <QuestionMarkCircleIcon className="h-12 w-12 mx-auto mb-4 text-surface-400" />
                    <p>No MCQ sets available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 