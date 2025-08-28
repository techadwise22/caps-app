'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon, PlayIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const youtubeLinkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL').refine(
    (url) => url.includes('youtube.com') || url.includes('youtu.be'),
    'Must be a valid YouTube URL'
  ),
  description: z.string().optional(),
});

const courseSchema = z.object({
  name: z.string().min(2, 'Course name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  level: z.enum(['Foundation', 'Intermediate', 'Final']),
  status: z.enum(['active', 'inactive']),
  students: z.number().min(0, 'Students count cannot be negative'),
  instructors: z.number().min(0, 'Instructors count cannot be negative'),
  youtubeLinks: z.array(youtubeLinkSchema).optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;
type YouTubeLink = z.infer<typeof youtubeLinkSchema>;

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: any;
  onSave: (data: CourseFormData) => void;
  mode: 'add' | 'edit';
}

export function CourseModal({ isOpen, onClose, course, onSave, mode }: CourseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeLinks, setYoutubeLinks] = useState<YouTubeLink[]>(course?.youtubeLinks || []);
  const [newLink, setNewLink] = useState({ title: '', url: '', description: '' });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: course || {
      name: '',
      description: '',
      level: 'Foundation',
      status: 'active',
      students: 0,
      instructors: 0,
      youtubeLinks: [],
    },
  });

  useEffect(() => {
    if (isOpen && course) {
      reset(course);
      setYoutubeLinks(course.youtubeLinks || []);
    } else if (isOpen && !course) {
      reset({
        name: '',
        description: '',
        level: 'Foundation',
        status: 'active',
        students: 0,
        instructors: 0,
        youtubeLinks: [],
      });
      setYoutubeLinks([]);
    }
  }, [isOpen, course, reset]);

  const addYouTubeLink = () => {
    if (newLink.title && newLink.url) {
      setYoutubeLinks([...youtubeLinks, newLink]);
      setNewLink({ title: '', url: '', description: '' });
    }
  };

  const removeYouTubeLink = (index: number) => {
    setYoutubeLinks(youtubeLinks.filter((_, i) => i !== index));
  };

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const onSubmit = async (data: CourseFormData) => {
    setIsLoading(true);
    try {
      const courseData = {
        ...data,
        youtubeLinks,
      };
      await onSave(courseData);
      onClose();
      reset();
      setYoutubeLinks([]);
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <h2 className="text-xl font-semibold text-surface-900">
            {mode === 'add' ? 'Add New Course' : 'Edit Course'}
          </h2>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-600"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Course Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-surface-700 mb-1">
                Course Name
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                className="form-input w-full"
                placeholder="Enter course name"
              />
              {errors.name && (
                <p className="text-danger-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-surface-700 mb-1">
                Level
              </label>
              <select {...register('level')} id="level" className="form-select w-full">
                <option value="Foundation">Foundation</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Final">Final</option>
              </select>
              {errors.level && (
                <p className="text-danger-600 text-sm mt-1">{errors.level.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-surface-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className="form-textarea w-full"
              placeholder="Enter course description"
            />
            {errors.description && (
              <p className="text-danger-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-surface-700 mb-1">
                Status
              </label>
              <select {...register('status')} id="status" className="form-select w-full">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && (
                <p className="text-danger-600 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="students" className="block text-sm font-medium text-surface-700 mb-1">
                Students Count
              </label>
              <input
                {...register('students', { valueAsNumber: true })}
                type="number"
                id="students"
                min="0"
                className="form-input w-full"
                placeholder="0"
              />
              {errors.students && (
                <p className="text-danger-600 text-sm mt-1">{errors.students.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="instructors" className="block text-sm font-medium text-surface-700 mb-1">
                Instructors Count
              </label>
              <input
                {...register('instructors', { valueAsNumber: true })}
                type="number"
                id="instructors"
                min="0"
                className="form-input w-full"
                placeholder="0"
              />
              {errors.instructors && (
                <p className="text-danger-600 text-sm mt-1">{errors.instructors.message}</p>
              )}
            </div>
          </div>

          {/* YouTube Links Section */}
          <div className="border-t border-surface-200 pt-6">
            <h3 className="text-lg font-medium text-surface-900 mb-4">YouTube Course Materials</h3>
            
            {/* Add New YouTube Link */}
            <div className="bg-surface-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Video Title"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  className="form-input"
                />
                <input
                  type="url"
                  placeholder="YouTube URL"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={addYouTubeLink}
                  className="btn-primary flex items-center justify-center"
                  disabled={!newLink.title || !newLink.url}
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Link
                </button>
              </div>
              <input
                type="text"
                placeholder="Description (optional)"
                value={newLink.description}
                onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                className="form-input w-full"
              />
            </div>

            {/* Existing YouTube Links */}
            {youtubeLinks.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-surface-700">Current Links ({youtubeLinks.length})</h4>
                {youtubeLinks.map((link, index) => {
                  const videoId = getYouTubeVideoId(link.url);
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white border border-surface-200 rounded-lg">
                      {videoId && (
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                          alt={link.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-surface-900 truncate">{link.title}</h5>
                        <p className="text-xs text-surface-500 truncate">{link.url}</p>
                        {link.description && (
                          <p className="text-xs text-surface-600 mt-1">{link.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeYouTubeLink(index)}
                        className="text-danger-600 hover:text-danger-900"
                        aria-label={`Remove ${link.title}`}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-surface-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : mode === 'add' ? 'Add Course' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 