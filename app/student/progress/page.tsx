'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  BookOpenIcon, 
  PlayIcon, 
  QuestionMarkCircleIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  title: string;
  instructor: string;
  type: 'video' | 'notes' | 'mcq' | 'test';
  subject: string;
  level: string;
  date: string;
  duration: string;
  status: 'completed' | 'in_progress' | 'not_started';
}

export default function StudentProgressPage() {
  const { user } = useAuth();

  // Mock activity data
  const activities: Activity[] = [
    {
      id: '1',
      title: 'Economics Concepts Live Class',
      instructor: 'Dr. Divyashree',
      type: 'video',
      subject: 'Economics',
      level: 'Foundation',
      date: '2024-01-15',
      duration: '1 hour 45 minutes',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Business Laws Practice Session',
      instructor: 'Dr. Rajdeep Manwani',
      type: 'mcq',
      subject: 'Business Laws',
      level: 'Foundation',
      date: '2024-01-14',
      duration: '45 minutes',
      status: 'completed'
    },
    {
      id: '3',
      title: 'Accounting Fundamentals Review',
      instructor: 'CA Chandrashekhar Shetty Mundkur',
      type: 'notes',
      subject: 'Accounting',
      level: 'Foundation',
      date: '2024-01-13',
      duration: '2 hours',
      status: 'in_progress'
    },
    {
      id: '4',
      title: 'Mathematics Problem Solving',
      instructor: 'CA Sudhindra MS',
      type: 'mcq',
      subject: 'Mathematics',
      level: 'Foundation',
      date: '2024-01-12',
      duration: '1 hour 30 minutes',
      status: 'completed'
    },
    {
      id: '5',
      title: 'Business Laws Case Studies',
      instructor: 'Dr. Rajdeep Manwani',
      type: 'notes',
      subject: 'Business Laws',
      level: 'Foundation',
      date: '2024-01-11',
      duration: '1 hour 15 minutes',
      status: 'not_started'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayIcon className="h-5 w-5 text-red-600" />;
      case 'notes':
        return <BookOpenIcon className="h-5 w-5 text-blue-600" />;
      case 'mcq':
        return <QuestionMarkCircleIcon className="h-5 w-5 text-green-600" />;
      case 'test':
        return <QuestionMarkCircleIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <BookOpenIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'notes':
        return 'bg-blue-100 text-blue-800';
      case 'mcq':
        return 'bg-green-100 text-green-800';
      case 'test':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'not_started':
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  const completedActivities = activities.filter(a => a.status === 'completed').length;
  const inProgressActivities = activities.filter(a => a.status === 'in_progress').length;
  const notStartedActivities = activities.filter(a => a.status === 'not_started').length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Learning Activity</h1>
          <p className="text-surface-600">
            Track your learning activities and study sessions
          </p>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-surface-900">{completedActivities}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-surface-900">{inProgressActivities}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-surface-600 text-sm font-medium">Not Started</p>
                <p className="text-2xl font-bold text-surface-900">{notStartedActivities}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-surface-900">Recent Activities</h2>
              <p className="text-surface-600 text-sm">Your learning journey timeline</p>
            </div>
          </div>

          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="border border-surface-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getTypeIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-surface-900 mb-1">
                          {activity.title}
                        </h3>
                        
                        <div className="flex items-center space-x-4 text-xs text-surface-500 mb-2">
                          <span className="flex items-center">
                            <UserIcon className="h-3 w-3 mr-1" />
                            {activity.instructor}
                          </span>
                          <span className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {activity.date}
                          </span>
                          <span className="flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {activity.duration}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                            {activity.type.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {activity.subject}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {activity.level}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                            {getStatusText(activity.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 