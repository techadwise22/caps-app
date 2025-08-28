'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TestAssignment, Test, Cohort, User } from '@/types';
import { formatDate, formatDateTime } from '@/lib/utils';
import {
  PlusIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

export default function AssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<TestAssignment[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'upcoming' | 'ended'>('all');

  useEffect(() => {
    // Mock data for demonstration
    const mockAssignments: TestAssignment[] = [
      {
        id: '1',
        test_id: 'test-1',
        assigned_to_type: 'cohort',
        assigned_to_id: 'cohort-1',
        start_time: '2024-01-15T10:00:00Z',
        end_time: '2024-01-15T12:00:00Z',
        max_attempts: 1,
        is_active: true,
        created_by: 'instructor-1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        test_id: 'test-2',
        assigned_to_type: 'user',
        assigned_to_id: 'user-1',
        start_time: '2024-01-20T14:00:00Z',
        end_time: '2024-01-20T15:00:00Z',
        max_attempts: 2,
        is_active: true,
        created_by: 'instructor-1',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      },
      {
        id: '3',
        test_id: 'test-3',
        assigned_to_type: 'cohort',
        assigned_to_id: 'cohort-2',
        start_time: '2024-01-10T09:00:00Z',
        end_time: '2024-01-10T11:00:00Z',
        max_attempts: 1,
        is_active: false,
        created_by: 'instructor-1',
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
      },
    ];

    const mockTests: Test[] = [
      {
        id: 'test-1',
        title: 'Midterm Exam - Computer Science',
        description: 'Comprehensive test covering chapters 1-5',
        course_id: 'course-1',
        duration_minutes: 120,
        start_time: '2024-01-15T10:00:00Z',
        end_time: '2024-01-15T12:00:00Z',
        is_active: true,
        has_negative_marking: false,
        negative_marking_percentage: 0,
        shuffle_options: true,
        created_by: 'instructor-1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'test-2',
        title: 'Quiz - Data Structures',
        description: 'Quick assessment on basic data structures',
        course_id: 'course-1',
        duration_minutes: 30,
        start_time: '2024-01-20T14:00:00Z',
        end_time: '2024-01-20T14:30:00Z',
        is_active: true,
        has_negative_marking: true,
        negative_marking_percentage: 25,
        shuffle_options: false,
        created_by: 'instructor-1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    const mockCohorts: Cohort[] = [
      {
        id: 'cohort-1',
        name: 'Computer Science 2024',
        description: 'First year computer science students',
        course_id: 'course-1',
        created_by: 'admin-1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'cohort-2',
        name: 'Advanced Programming',
        description: 'Second year programming students',
        course_id: 'course-1',
        created_by: 'admin-1',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      },
    ];

    const mockUsers: User[] = [
      {
        id: 'user-1',
        email: 'john.doe@example.com',
        full_name: 'John Doe',
        role: 'student',
        course_id: 'course-1',
        cohort_id: 'cohort-1',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    setAssignments(mockAssignments);
    setTests(mockTests);
    setCohorts(mockCohorts);
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const filteredAssignments = assignments.filter(assignment => {
    const now = new Date();
    const startTime = new Date(assignment.start_time);
    const endTime = new Date(assignment.end_time);

    let status: 'active' | 'upcoming' | 'ended';
    if (!assignment.is_active) status = 'ended';
    else if (now < startTime) status = 'upcoming';
    else if (now >= startTime && now <= endTime) status = 'active';
    else status = 'ended';

    return filterStatus === 'all' || status === filterStatus;
  });

  const getAssignmentStatus = (assignment: TestAssignment) => {
    const now = new Date();
    const startTime = new Date(assignment.start_time);
    const endTime = new Date(assignment.end_time);

    if (!assignment.is_active) return { status: 'inactive', color: 'bg-surface-100 text-surface-600' };
    if (now < startTime) return { status: 'upcoming', color: 'bg-warning-100 text-warning-600' };
    if (now >= startTime && now <= endTime) return { status: 'active', color: 'bg-success-100 text-success-600' };
    return { status: 'ended', color: 'bg-danger-100 text-danger-600' };
  };

  const getAssignedToName = (assignment: TestAssignment) => {
    if (assignment.assigned_to_type === 'cohort') {
      const cohort = cohorts.find(c => c.id === assignment.assigned_to_id);
      return cohort?.name || 'Unknown Cohort';
    } else {
      const user = users.find(u => u.id === assignment.assigned_to_id);
      return user?.full_name || 'Unknown User';
    }
  };

  const getTestTitle = (testId: string) => {
    const test = tests.find(t => t.id === testId);
    return test?.title || 'Unknown Test';
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
            <h1 className="text-3xl font-bold text-surface-900">Test Assignments</h1>
            <p className="text-surface-600 mt-2">Assign tests to cohorts or individual students</p>
          </div>
          <button
            onClick={() => router.push('/instructor/assignments/create')}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Assignment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Total Assignments</p>
                <p className="text-2xl font-bold text-surface-900">{assignments.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Active</p>
                <p className="text-2xl font-bold text-surface-900">
                  {assignments.filter(a => getAssignmentStatus(a).status === 'active').length}
                </p>
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
                <p className="text-2xl font-bold text-surface-900">
                  {assignments.filter(a => getAssignmentStatus(a).status === 'upcoming').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Cohort Assignments</p>
                <p className="text-2xl font-bold text-surface-900">
                  {assignments.filter(a => a.assigned_to_type === 'cohort').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-surface-700">Filter by Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="form-select"
              >
                <option value="all">All Assignments</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-surface-900">All Assignments</h2>
          </div>
          <div className="card-body">
            {filteredAssignments.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-12 w-12 text-surface-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">No assignments found</h3>
                <p className="text-surface-600 mb-6">
                  {filterStatus !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'Get started by creating your first assignment'
                  }
                </p>
                {filterStatus === 'all' && (
                  <button
                    onClick={() => router.push('/instructor/assignments/create')}
                    className="btn-primary"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Assignment
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAssignments.map((assignment) => {
                  const status = getAssignmentStatus(assignment);
                  return (
                    <div key={assignment.id} className="border border-surface-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-surface-900">
                              {getTestTitle(assignment.test_id)}
                            </h3>
                            <span className={`badge ${status.color}`}>
                              {status.status}
                            </span>
                            <span className={`badge ${
                              assignment.assigned_to_type === 'cohort' ? 'badge-primary' : 'badge-secondary'
                            }`}>
                              {assignment.assigned_to_type === 'cohort' ? 'Cohort' : 'Individual'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-surface-500">Assigned to:</span>
                              <span className="ml-1 font-medium">{getAssignedToName(assignment)}</span>
                            </div>
                            <div>
                              <span className="text-surface-500">Start:</span>
                              <span className="ml-1 font-medium">{formatDateTime(assignment.start_time)}</span>
                            </div>
                            <div>
                              <span className="text-surface-500">End:</span>
                              <span className="ml-1 font-medium">{formatDateTime(assignment.end_time)}</span>
                            </div>
                            <div>
                              <span className="text-surface-500">Max Attempts:</span>
                              <span className="ml-1 font-medium">{assignment.max_attempts}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <UsersIcon className="h-4 w-4 text-surface-400" />
                              <span className="text-surface-600">
                                {assignment.assigned_to_type === 'cohort' ? 'Cohort Assignment' : 'Individual Assignment'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <ClockIcon className="h-4 w-4 text-surface-400" />
                              <span className="text-surface-600">
                                Created: {formatDate(assignment.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => router.push(`/instructor/assignments/${assignment.id}/view`)}
                            className="btn-ghost p-2"
                            title="View assignment"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/instructor/assignments/${assignment.id}/edit`)}
                            className="btn-ghost p-2"
                            title="Edit assignment"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this assignment?')) {
                                // Handle delete
                              }
                            }}
                            className="btn-ghost p-2 text-danger-600 hover:text-danger-700"
                            title="Delete assignment"
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
                onClick={() => router.push('/instructor/assignments/create')}
                className="flex items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <div className="p-2 bg-primary-100 rounded-lg mr-3">
                  <PlusIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-surface-900">Create Assignment</h3>
                  <p className="text-sm text-surface-600">Assign a test to students or cohorts</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/instructor/assignments/bulk')}
                className="flex items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <div className="p-2 bg-success-100 rounded-lg mr-3">
                  <UserGroupIcon className="h-6 w-6 text-success-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-surface-900">Bulk Assignment</h3>
                  <p className="text-sm text-surface-600">Assign multiple tests at once</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/instructor/assignments/schedule')}
                className="flex items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <div className="p-2 bg-secondary-100 rounded-lg mr-3">
                  <ClockIcon className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-surface-900">Schedule Assignments</h3>
                  <p className="text-sm text-surface-600">Plan future test assignments</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 