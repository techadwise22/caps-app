'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  VideoCameraIcon, 
  CalendarIcon,
  ClockIcon,
  PlayIcon,
  EyeIcon,
  UsersIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function StudentClassesPage() {
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

  // Mock data for CA classes
  const upcomingClasses = [
    {
      id: '1',
      title: 'CA Foundation - Business Laws Revision',
      instructor: 'Dr. Rajdeep Manwani',
      level: 'Foundation',
      subject: 'Business Laws',
      date: '2024-01-18',
      time: '10:00 AM',
      duration: '2 hours',
      students: 45,
      type: 'live',
      meetingLink: 'https://zoom.us/j/123456789',
      description: 'Comprehensive revision session covering company law and partnership law.',
    },
    {
      id: '2',
      title: 'CA Foundation - Accounting Practice Session',
      instructor: 'CA Chandrashekhar Shetty Mundkur',
      level: 'Foundation',
      subject: 'Accounting',
      date: '2024-01-20',
      time: '2:00 PM',
      duration: '1.5 hours',
      students: 38,
      type: 'live',
      meetingLink: 'https://zoom.us/j/987654321',
      description: 'Practice session focusing on journal entries and ledger accounts.',
    },
  ];

  const recordedClasses = [
    {
      id: '3',
      title: 'CA Foundation - Economics Concepts',
      instructor: 'Dr. Divyashree',
      level: 'Foundation',
      subject: 'Economics',
      date: '2024-01-15',
      duration: '1 hour 45 minutes',
      views: 125,
      recordingUrl: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwcozr0xl-9nBuJPowqsIgDl',
      description: 'Introduction to microeconomics and macroeconomics concepts.',
      thumbnail: '/api/placeholder/300/200',
      playlistTitle: 'CA Fdn Eco R2C',
    },
    {
      id: '4',
      title: 'CA Foundation - Mathematics Basics',
      instructor: 'CA Sudhindra MS',
      level: 'Foundation',
      subject: 'Mathematics',
      date: '2024-01-12',
      duration: '2 hours',
      views: 98,
      recordingUrl: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwctcAYH8Myyb-5CKdDFPJNR',
      description: 'Algebra and statistics fundamentals for CA students.',
      thumbnail: '/api/placeholder/300/200',
      playlistTitle: 'CA Fdn QA R2C',
    },
    {
      id: '5',
      title: 'CA Foundation - Accounting Fundamentals',
      instructor: 'CA Chandrashekhar Shetty Mundkur',
      level: 'Foundation',
      subject: 'Accounting',
      date: '2024-01-10',
      duration: '2 hours 30 minutes',
      views: 156,
      recordingUrl: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwe3FSEsrYm4ACWlxbg3dIet',
      description: 'Comprehensive coverage of accounting principles, double-entry bookkeeping, and financial statements.',
      thumbnail: '/api/placeholder/300/200',
      playlistTitle: 'CA Fdn Accounts R2C',
    },
    {
      id: '6',
      title: 'CA Foundation - Business Laws',
      instructor: 'Dr. Rajdeep Manwani',
      level: 'Foundation',
      subject: 'Business Laws',
      date: '2024-01-08',
      duration: '2 hours 15 minutes',
      views: 142,
      recordingUrl: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwfpmL4P3SBg7uC4DuV8G3kI',
      description: 'Complete coverage of business laws, company law, and legal frameworks for CA Foundation.',
      thumbnail: '/api/placeholder/300/200',
      playlistTitle: 'CA Fdn Law R2C',
    },
  ];

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

  const openYouTubePlaylist = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Live Classes</h1>
          <p className="text-surface-600">Attend live sessions and access recorded classes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <VideoCameraIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Total Classes</p>
                <p className="text-2xl font-bold text-surface-900">{upcomingClasses.length + recordedClasses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Upcoming</p>
                <p className="text-2xl font-bold text-surface-900">{upcomingClasses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Attended</p>
                <p className="text-2xl font-bold text-surface-900">{recordedClasses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Study Hours</p>
                <p className="text-2xl font-bold text-surface-900">8.5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Classes */}
        {upcomingClasses.length > 0 && (
          <div className="bg-white rounded-xl shadow-soft">
            <div className="p-6 border-b border-surface-200">
              <h2 className="text-xl font-semibold text-surface-900">Upcoming Live Classes</h2>
              <p className="text-surface-600 text-sm">Join these live sessions with your instructors</p>
            </div>
            <div className="p-6 space-y-4">
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="border border-surface-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <VideoCameraIcon className="h-5 w-5 text-primary-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-surface-900">{classItem.title}</h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-surface-600 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(classItem.level)}`}>
                          {classItem.level}
                        </span>
                        <span>{classItem.subject}</span>
                        <span>{classItem.duration}</span>
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          {classItem.students} students
                        </div>
                      </div>
                      <p className="text-sm text-surface-600 mb-3">{classItem.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-surface-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {classItem.date}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {classItem.time}
                        </div>
                        <span className="text-primary-600 font-medium">Instructor: {classItem.instructor}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                        <PlayIcon className="h-4 w-4 mr-2" />
                        Join Class
                      </button>
                      <button className="bg-surface-100 text-surface-700 px-4 py-2 rounded-lg hover:bg-surface-200 transition-colors flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Add to Calendar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recorded Classes */}
        <div className="bg-white rounded-xl shadow-soft">
          <div className="p-6 border-b border-surface-200">
            <h2 className="text-xl font-semibold text-surface-900">Recorded Classes</h2>
            <p className="text-surface-600 text-sm">Watch past sessions and review concepts</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recordedClasses.map((classItem) => (
                <div key={classItem.id} className="border border-surface-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-surface-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayIcon className="h-12 w-12 text-white opacity-80" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-surface-900 mb-2 line-clamp-2">{classItem.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-surface-600 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(classItem.level)}`}>
                        {classItem.level}
                      </span>
                      <span>{classItem.subject}</span>
                    </div>
                    <p className="text-sm text-surface-600 mb-3 line-clamp-2">{classItem.description}</p>
                    {classItem.playlistTitle && (
                      <div className="mb-3">
                        <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full font-medium">
                          {classItem.playlistTitle}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm text-surface-600 mb-3">
                      <span>Instructor: {classItem.instructor}</span>
                      <span>{classItem.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-surface-600">
                        <EyeIcon className="h-4 w-4" />
                        <span>{classItem.views} views</span>
                      </div>
                      <button 
                        onClick={() => openYouTubePlaylist(classItem.recordingUrl)}
                        className="bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center"
                      >
                        <PlayIcon className="h-3 w-3 mr-1" />
                        Watch Playlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-semibold text-surface-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-primary-600 text-white p-4 rounded-lg hover:bg-primary-700 transition-colors text-left">
              <VideoCameraIcon className="h-8 w-8 mb-3" />
              <h3 className="font-semibold mb-1">Join Next Class</h3>
              <p className="text-sm opacity-90">Join the upcoming live session</p>
            </button>
            <button className="bg-secondary-600 text-white p-4 rounded-lg hover:bg-secondary-700 transition-colors text-left">
              <CalendarIcon className="h-8 w-8 mb-3" />
              <h3 className="font-semibold mb-1">View Schedule</h3>
              <p className="text-sm opacity-90">Check your class calendar</p>
            </button>
            <button className="bg-success-600 text-white p-4 rounded-lg hover:bg-success-700 transition-colors text-left">
              <PlayIcon className="h-8 w-8 mb-3" />
              <h3 className="font-semibold mb-1">Watch Recordings</h3>
              <p className="text-sm opacity-90">Access past class recordings</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 