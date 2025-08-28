'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const youtubeLinkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL').refine(
    (url) => url.includes('youtube.com') || url.includes('youtu.be'),
    'Must be a valid YouTube URL'
  ),
  description: z.string().optional(),
});

const contentSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content_type: z.enum(['study_material', 'video_series', 'practice_questions', 'lecture_notes', 'case_study']),
  level: z.enum(['Foundation', 'Intermediate', 'Final']),
  status: z.enum(['published', 'pending_review', 'draft']),
  author_name: z.string().min(2, 'Author name is required'),
  youtubeLinks: z.array(youtubeLinkSchema).optional(),
});

interface YouTubeLink {
  title: string;
  url: string;
  description?: string;
}

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  content?: any;
  mode: 'add' | 'edit';
}

export function ContentModal({ isOpen, onClose, onSave, content, mode }: ContentModalProps) {
  const [youtubeLinks, setYoutubeLinks] = useState<YouTubeLink[]>([]);
  const [newYoutubeLink, setNewYoutubeLink] = useState<YouTubeLink>({
    title: '',
    url: '',
    description: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      content_type: 'study_material' as const,
      level: 'Foundation' as const,
      status: 'pending_review' as const,
      author_name: '',
      youtubeLinks: [],
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && content) {
        setValue('title', content.title);
        setValue('subtitle', content.subtitle);
        setValue('description', content.description);
        setValue('content_type', content.content_type);
        setValue('level', content.level);
        setValue('status', content.status);
        setValue('author_name', content.author_name);
        setYoutubeLinks(content.youtubeLinks || []);
      } else {
        reset();
        setYoutubeLinks([]);
      }
    }
  }, [isOpen, mode, content, setValue, reset]);

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  const addYoutubeLink = () => {
    if (!newYoutubeLink.title || !newYoutubeLink.url) {
      toast.error('Please fill in both title and URL');
      return;
    }

    if (!newYoutubeLink.url.includes('youtube.com') && !newYoutubeLink.url.includes('youtu.be')) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    setYoutubeLinks([...youtubeLinks, { ...newYoutubeLink }]);
    setNewYoutubeLink({ title: '', url: '', description: '' });
  };

  const removeYoutubeLink = (index: number) => {
    setYoutubeLinks(youtubeLinks.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    try {
      const contentData = {
        ...data,
        youtubeLinks,
      };
      await onSave(contentData);
      reset();
      setYoutubeLinks([]);
      onClose();
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'add' ? 'Add New Content' : 'Edit Content'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Title *
              </label>
              <input
                type="text"
                {...register('title')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter content title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle *
              </label>
              <input
                type="text"
                {...register('subtitle')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter subtitle"
              />
              {errors.subtitle && (
                <p className="mt-1 text-sm text-red-600">{errors.subtitle.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter detailed description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type *
              </label>
              <select
                {...register('content_type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="study_material">Study Material</option>
                <option value="video_series">Video Series</option>
                <option value="practice_questions">Practice Questions</option>
                <option value="lecture_notes">Lecture Notes</option>
                <option value="case_study">Case Study</option>
              </select>
              {errors.content_type && (
                <p className="mt-1 text-sm text-red-600">{errors.content_type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level *
              </label>
              <select
                {...register('level')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Foundation">Foundation</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Final">Final</option>
              </select>
              {errors.level && (
                <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="pending_review">Pending Review</option>
                <option value="published">Published</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Name *
            </label>
            <input
              type="text"
              {...register('author_name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter author name"
            />
            {errors.author_name && (
              <p className="mt-1 text-sm text-red-600">{errors.author_name.message}</p>
            )}
          </div>

          {/* YouTube Links Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">YouTube Links</h3>
            
            {/* Add New YouTube Link */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Video Title"
                  value={newYoutubeLink.title}
                  onChange={(e) => setNewYoutubeLink({ ...newYoutubeLink, title: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="url"
                  placeholder="YouTube URL"
                  value={newYoutubeLink.url}
                  onChange={(e) => setNewYoutubeLink({ ...newYoutubeLink, url: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newYoutubeLink.description}
                  onChange={(e) => setNewYoutubeLink({ ...newYoutubeLink, description: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={addYoutubeLink}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Video
              </button>
            </div>

            {/* Existing YouTube Links */}
            {youtubeLinks.length > 0 && (
              <div className="space-y-3">
                {youtubeLinks.map((link, index) => {
                  const thumbnail = getYouTubeThumbnail(link.url);
                  return (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-white border rounded-lg">
                      {thumbnail && (
                        <img
                          src={thumbnail}
                          alt={link.title}
                          className="w-20 h-15 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{link.title}</h4>
                        <p className="text-sm text-gray-500">{link.url}</p>
                        {link.description && (
                          <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeYoutubeLink(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Content' : 'Update Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 