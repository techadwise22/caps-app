'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClassSession, ZoomMeeting } from '@/types';
import { formatDate, formatDateTime, formatTime } from '@/lib/utils';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  VideoCameraIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  MegaphoneIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  useEffect(() => {
    // Mock data for demonstration
    const mockClasses: ClassSession[] = [
      {
        id: '1',
        title: 'Introduction to Data Structures',
        description: 'Learn about arrays, linked lists, and basic data structures',
        course_id: 'course-1',
        instructor_id: 'instructor-1',
        start_time: '2024-01-15T10:00:00Z',
        end_time: '2024-01-15T11:30:00Z',
        meeting_link: 'https://zoom.us/j/123456789',
        meeting_id: 'zoom-1',
        max_participants: 50,
        is_recurring: false,
        recurrence_pattern: null,
        status: 'scheduled',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        title: 'Algorithms Workshop',
        description: 'Hands-on practice with sorting and searching algorithms',
        course_id: 'course-1',
        instructor_id: 'instructor-1',
        start_time: '2024-01-17T14:00:00Z',
        end_time: '2024-01-17T16:00:00Z',
        meeting_link: 'https://zoom.us/j/987654321',
        meeting_id: 'zoom-2',
        max_participants: 30,
        is_recurring: true,
        recurrence_pattern: 'weekly',
        status: 'scheduled',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      },
      {
        id: '3',
        title: 'Office Hours - Q&A Session',
        description: 'Open office hours for student questions and clarifications',
        course_id: 'course-1',
        instructor_id: 'instructor-1',
        start_time: '2024-01-20T15:00:00Z',
        end_time: '2024-01-20T16:00:Z',
        meeting_link: 'https://zoom.us/j/555666777',
        meeting_id: 'zoom-3',
        max_participants: 20,
        is_recurring: false,
        recurrence_pattern: null,
        status: 'scheduled',
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
      },
    ];

    setClasses(mockClasses);
    setLoading(false);
  }, []);

  const getSessionStatus = (session: ClassSession) => {
    const now = new Date();
    const startTime = new Date(session.start_time);
    const endTime = new Date(session.end_time);

    if (now < startTime) return { status: 'upcoming', color: 'bg-warning-100 text-warning-600' };
    if (now >= startTime && now <= endTime) return { status: 'live', color: 'bg-success-100 text-success-600' };
    return { status: 'ended', color: 'bg-surface-100 text-surface-600' };
  };

  const getUpcomingSessions = () => {
    const now = new Date();
    return classes
      .filter(session => new Date(session.start_time) > now)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 5);
  };

  const getTodaySessions = () => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    return classes.filter(session => {
      const sessionDate = new Date(session.start_time);
      return sessionDate >= startOfDay && sessionDate < endOfDay;
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner w-8 h-8"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-surface-900">Classes & Guidance</h1>
            <p className="text-surface-600 mt-2">Schedule sessions, manage Zoom meetings, and guide your students</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
              className="btn-outline"
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              {viewMode === 'calendar' ? 'List View' : 'Calendar View'}
            </button>
            <button
              onClick={() => router.push('/instructor/classes/create')}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Schedule Class
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Total Sessions</p>
                <p className="text-2xl font-bold text-surface-900">{classes.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <VideoCameraIcon className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Today's Sessions</p>
                <p className="text-2xl font-bold text-surface-900">{getTodaySessions().length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Upcoming</p>
                <p className="text-2xl font-bold text-surface-900">{getUpcomingSessions().length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Avg Attendance</p>
                <p className="text-2xl font-bold text-surface-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-surface-900">Today's Schedule</h2>
          </div>
          <div className="card-body">
            {getTodaySessions().length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-surface-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">No sessions today</h3>
                <p className="text-surface-600 mb-4">You have a free day! Consider scheduling some office hours.</p>
                <button
                  onClick={() => router.push('/instructor/classes/create')}
                  className="btn-primary"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Schedule Session
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {getTodaySessions().map((session) => {
                  const status = getSessionStatus(session);
                  return (
                    <div key={session.id} className="border border-surface-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-surface-900">{session.title}</h3>
                            <span className={`badge ${status.color}`}>
                              {status.status}
                            </span>
                            {session.is_recurring && (
                              <span className="badge badge-secondary">Recurring</span>
                            )}
                          </div>
                          <p className="text-surface-600 mb-3">{session.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <ClockIcon className="h-4 w-4 text-surface-400" />
                              <span>{formatTime(session.start_time)} - {formatTime(session.end_time)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <UserGroupIcon className="h-4 w-4 text-surface-400" />
                              <span>Max {session.max_participants} participants</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <VideoCameraIcon className="h-4 w-4 text-surface-400" />
                              <span>Zoom Meeting</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="h-4 w-4 text-surface-400" />
                              <span>{formatDate(session.start_time)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {status.status === 'live' && (
                            <button
                              onClick={() => window.open(session.meeting_link, '_blank')}
                              className="btn-primary"
                            >
                              <LinkIcon className="h-4 w-4 mr-2" />
                              Join Now
                            </button>
                          )}
                          <button
                            onClick={() => router.push(`/instructor/classes/${session.id}/edit`)}
                            className="btn-outline"
                            title="Edit session"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this session?')) {
                                // Handle delete
                              }
                            }}
                            className="btn-ghost text-danger-600 hover:text-danger-700"
                            title="Delete session"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-surface-900">Upcoming Sessions</h2>
          </div>
          <div className="card-body">
            {getUpcomingSessions().length === 0 ? (
              <div className="text-center py-8">
                <ClockIcon className="h-12 w-12 text-surface-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">No upcoming sessions</h3>
                <p className="text-surface-600 mb-4">Schedule your next class or workshop.</p>
                <button
                  onClick={() => router.push('/instructor/classes/create')}
                  className="btn-primary"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Schedule Session
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {getUpcomingSessions().map((session) => {
                  const status = getSessionStatus(session);
                  return (
                    <div key={session.id} className="border border-surface-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-surface-900">{session.title}</h3>
                            <span className={`badge ${status.color}`}>
                              {status.status}
                            </span>
                            {session.is_recurring && (
                              <span className="badge badge-secondary">{session.recurrence_pattern}</span>
                            )}
                          </div>
                          <p className="text-surface-600 mb-3">{session.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <ClockIcon className="h-4 w-4 text-surface-400" />
                              <span>{formatDateTime(session.start_time)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <UserGroupIcon className="h-4 w-4 text-surface-400" />
                              <span>Max {session.max_participants} participants</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <VideoCameraIcon className="h-4 w-4 text-surface-400" />
                              <span>Zoom Meeting</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="h-4 w-4 text-surface-400" />
                              <span>{formatDate(session.start_time)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => router.push(`/instructor/classes/${session.id}/edit`)}
                            className="btn-outline"
                            title="Edit session"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this session?')) {
                                // Handle delete
                              }
                            }}
                            className="btn-ghost text-danger-600 hover:text-danger-700"
                            title="Delete session"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-surface-900">Quick Actions</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/instructor/classes/create')}
                className="flex items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <div className="p-2 bg-primary-100 rounded-lg mr-3">
                  <VideoCameraIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-surface-900">Schedule Class</h3>
                  <p className="text-sm text-surface-600">Create a new class session with Zoom integration</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/instructor/classes/office-hours')}
                className="flex items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <div className="p-2 bg-success-100 rounded-lg mr-3">
                  <UserGroupIcon className="h-6 w-6 text-success-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-surface-900">Office Hours</h3>
                  <p className="text-sm text-surface-600">Set up recurring office hours for student support</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/instructor/announcements/create')}
                className="flex items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <div className="p-2 bg-secondary-100 rounded-lg mr-3">
                  <MegaphoneIcon className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-surface-900">Post Announcement</h3>
                  <p className="text-sm text-surface-600">Share important updates with your students</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 