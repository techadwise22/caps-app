'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseModal } from '@/components/admin/CourseModal';
import { CourseDetailModal } from '@/components/admin/CourseDetailModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useCourseManagement } from '@/hooks/useCourseManagement';
import { 
  AcademicCapIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  EyeIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminCoursesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<any>(null);

  const {
    courses,
    loading: coursesLoading,
    addCourse,
    updateCourse,
    deleteCourse,
    stats,
  } = useCourseManagement();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Check if current user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      router.push('/');
    }
  }, [user, router]);

  if (loading || coursesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleAddCourse = () => {
    setModalMode('add');
    setSelectedCourse(null);
    setIsCourseModalOpen(true);
  };

  const handleEditCourse = (course: any) => {
    setModalMode('edit');
    setSelectedCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleViewCourse = (course: any) => {
    setSelectedCourse(course);
    setIsDetailModalOpen(true);
  };

  const handleDeleteCourse = (course: any) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };

  const handleManageCourse = (course: any) => {
    // Navigate to detailed course management page
    router.push(`/admin/courses/${course.id}`);
  };

  const handleSaveCourse = async (courseData: any) => {
    try {
      if (modalMode === 'add') {
        await addCourse(courseData);
      } else {
        await updateCourse(selectedCourse.id, courseData);
      }
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (courseToDelete) {
      try {
        await deleteCourse(courseToDelete.id);
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Course Management</h1>
            <p className="text-surface-600">Manage CA courses and levels</p>
          </div>
          <button 
            onClick={handleAddCourse}
            className="btn-primary mt-4 sm:mt-0"
            aria-label="Add new course"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Course
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <AcademicCapIcon className="h-12 w-12 text-surface-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 mb-2">No courses found</h3>
              <p className="text-surface-600 mb-4">Get started by adding your first course</p>
              <button onClick={handleAddCourse} className="btn-primary">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add First Course
              </button>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-soft p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <AcademicCapIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-surface-900">{course.name}</h3>
                      <p className="text-sm text-surface-600 line-clamp-2">{course.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewCourse(course)}
                      className="text-primary-600 hover:text-primary-900 transition-colors"
                      aria-label={`View details for ${course.name}`}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditCourse(course)}
                      className="text-warning-600 hover:text-warning-900 transition-colors"
                      aria-label={`Edit ${course.name}`}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(course)}
                      className="text-danger-600 hover:text-danger-900 transition-colors"
                      aria-label={`Delete ${course.name}`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-600">Level:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.level === 'Foundation' ? 'bg-primary-100 text-primary-700' :
                      course.level === 'Intermediate' ? 'bg-secondary-100 text-secondary-700' :
                      'bg-success-100 text-success-700'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-600">Students:</span>
                    <span className="text-sm font-medium text-surface-900">{course.students}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-600">Instructors:</span>
                    <span className="text-sm font-medium text-surface-900">{course.instructors}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                    }`}>
                      {course.status}
                    </span>
                  </div>

                  {/* YouTube Links Preview */}
                  {course.youtubeLinks && course.youtubeLinks.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-surface-600">Materials:</span>
                      <div className="flex items-center space-x-1">
                        <PlayIcon className="h-3 w-3 text-surface-400" />
                        <span className="text-xs text-surface-500">{course.youtubeLinks.length} videos</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => handleManageCourse(course)}
                  className="w-full mt-4 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                  aria-label={`Manage ${course.name}`}
                >
                  Manage Course
                </button>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Total Courses</p>
                <p className="text-2xl font-bold text-surface-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Total Students</p>
                <p className="text-2xl font-bold text-surface-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Total Instructors</p>
                <p className="text-2xl font-bold text-surface-900">{stats.totalInstructors}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <CourseModal
          isOpen={isCourseModalOpen}
          onClose={() => setIsCourseModalOpen(false)}
          course={selectedCourse}
          onSave={handleSaveCourse}
          mode={modalMode}
        />

        <CourseDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          course={selectedCourse}
        />

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Course"
          message={`Are you sure you want to delete "${courseToDelete?.name}"? This action cannot be undone and will remove all associated materials including YouTube links.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </DashboardLayout>
  );
} 