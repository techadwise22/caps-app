'use client';

import { XMarkIcon, PlayIcon, UsersIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
}

export function CourseDetailModal({ isOpen, onClose, course }: CourseDetailModalProps) {
  if (!isOpen || !course) return null;

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <h2 className="text-xl font-semibold text-surface-900">Course Details</h2>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-600"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Course Header */}
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-surface-900">{course.name}</h3>
              <p className="text-surface-600 mt-1">{course.description}</p>
              <div className="flex items-center space-x-4 mt-3">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  course.level === 'Foundation' ? 'bg-primary-100 text-primary-700' :
                  course.level === 'Intermediate' ? 'bg-secondary-100 text-secondary-700' :
                  'bg-success-100 text-success-700'
                }`}>
                  {course.level}
                </span>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  course.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                }`}>
                  {course.status}
                </span>
              </div>
            </div>
          </div>

          {/* Course Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success-100 rounded-lg">
                  <UsersIcon className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm text-surface-600">Enrolled Students</p>
                  <p className="text-2xl font-bold text-surface-900">{course.students}</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary-100 rounded-lg">
                  <AcademicCapIcon className="h-5 w-5 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm text-surface-600">Assigned Instructors</p>
                  <p className="text-2xl font-bold text-surface-900">{course.instructors}</p>
                </div>
              </div>
            </div>
          </div>

          {/* YouTube Course Materials */}
          {course.youtubeLinks && course.youtubeLinks.length > 0 && (
            <div className="border-t border-surface-200 pt-6">
              <h4 className="text-lg font-medium text-surface-900 mb-4">
                YouTube Course Materials ({course.youtubeLinks.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.youtubeLinks.map((link: any, index: number) => {
                  const videoId = getYouTubeVideoId(link.url);
                  return (
                    <div key={index} className="bg-white border border-surface-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {videoId && (
                        <div className="relative">
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                            alt={link.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-50 rounded-full p-2">
                              <PlayIcon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <h5 className="font-medium text-surface-900 mb-2">{link.title}</h5>
                        {link.description && (
                          <p className="text-sm text-surface-600 mb-3">{link.description}</p>
                        )}
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          <PlayIcon className="h-4 w-4 mr-1" />
                          Watch on YouTube
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Course Information */}
          <div className="border-t border-surface-200 pt-6">
            <h4 className="text-lg font-medium text-surface-900 mb-4">Course Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-surface-700">Course ID</label>
                  <p className="text-surface-900 font-mono text-sm">{course.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700">Level</label>
                  <p className="text-surface-900">{course.level}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700">Status</label>
                  <p className="text-surface-900">{course.status}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-surface-700">Students</label>
                  <p className="text-surface-900">{course.students} enrolled</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700">Instructors</label>
                  <p className="text-surface-900">{course.instructors} assigned</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700">Materials</label>
                  <p className="text-surface-900">
                    {course.youtubeLinks ? course.youtubeLinks.length : 0} YouTube videos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-surface-200">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 