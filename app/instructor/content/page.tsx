'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ContentItem, ContentType } from '@/types';
import { formatDate, formatFileSize } from '@/lib/utils';
import {
  PlusIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  DocumentTextIcon,
  PlayIcon,
  PhotoIcon,
  DocumentIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

export default function ContentPage() {
  const router = useRouter();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    // Mock data for demonstration
    const mockContent: ContentItem[] = [
      {
        id: '1',
        title: 'Introduction to Computer Science',
        description: 'Comprehensive overview of computer science fundamentals',
        type: 'youtube_playlist',
        course_id: 'course-1',
        created_by: 'instructor-1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        is_published: true,
        tags: ['computer-science', 'fundamentals'],
      },
      {
        id: '2',
        title: 'Data Structures Lecture Notes',
        description: 'Detailed notes on arrays, linked lists, and trees',
        type: 'file',
        course_id: 'course-1',
        created_by: 'instructor-1',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        is_published: true,
        tags: ['data-structures', 'notes'],
      },
      {
        id: '3',
        title: 'Algorithms Practice Set',
        description: 'Interactive MCQ practice questions on algorithms',
        type: 'mcq_set',
        course_id: 'course-1',
        created_by: 'instructor-1',
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
        is_published: false,
        tags: ['algorithms', 'practice'],
      },
      {
        id: '4',
        title: 'Course Syllabus',
        description: 'Complete course syllabus and schedule',
        type: 'page',
        course_id: 'course-1',
        created_by: 'instructor-1',
        created_at: '2024-01-04T00:00:00Z',
        updated_at: '2024-01-04T00:00:00Z',
        is_published: true,
        tags: ['syllabus', 'schedule'],
      },
    ];

    setContent(mockContent);
    setLoading(false);
  }, []);

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && item.is_published) ||
                         (filterStatus === 'draft' && !item.is_published);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getContentIcon = (type: ContentType) => {
    switch (type) {
      case 'youtube_playlist':
      case 'youtube_video':
        return <PlayIcon className="h-6 w-6 text-danger-600" />;
      case 'file':
        return <DocumentIcon className="h-6 w-6 text-primary-600" />;
      case 'page':
        return <DocumentTextIcon className="h-6 w-6 text-secondary-600" />;
      case 'mcq_set':
        return <DocumentTextIcon className="h-6 w-6 text-success-600" />;
      default:
        return <DocumentIcon className="h-6 w-6 text-surface-600" />;
    }
  };

  const getContentTypeLabel = (type: ContentType) => {
    switch (type) {
      case 'youtube_playlist':
        return 'YouTube Playlist';
      case 'youtube_video':
        return 'YouTube Video';
      case 'file':
        return 'File';
      case 'page':
        return 'Content Page';
      case 'mcq_set':
        return 'MCQ Set';
      default:
        return 'Unknown';
    }
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
            <h1 className="text-3xl font-bold text-surface-900">Content Library</h1>
            <p className="text-surface-600 mt-2">Manage your course materials and learning resources</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push('/instructor/content/upload')}
              className="btn-outline"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Upload File
            </button>
            <button
              onClick={() => router.push('/instructor/content/create')}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Content
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Total Content</p>
                <p className="text-2xl font-bold text-surface-900">{content.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <PlayIcon className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Published</p>
                <p className="text-2xl font-bold text-surface-900">
                  {content.filter(c => c.is_published).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <DocumentIcon className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Drafts</p>
                <p className="text-2xl font-bold text-surface-900">
                  {content.filter(c => !c.is_published).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <FolderIcon className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Categories</p>
                <p className="text-2xl font-bold text-surface-900">5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 form-input"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="form-select"
                >
                  <option value="all">All Types</option>
                  <option value="youtube_playlist">YouTube Playlist</option>
                  <option value="youtube_video">YouTube Video</option>
                  <option value="file">File</option>
                  <option value="page">Content Page</option>
                  <option value="mcq_set">MCQ Set</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="form-select"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-surface-900">All Content</h2>
          </div>
          <div className="card-body">
            {filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-12 w-12 text-surface-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-900 mb-2">No content found</h3>
                <p className="text-surface-600 mb-6">
                  {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Get started by creating your first piece of content'
                  }
                </p>
                {!searchTerm && filterType === 'all' && filterStatus === 'all' && (
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => router.push('/instructor/content/upload')}
                      className="btn-outline"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Upload File
                    </button>
                    <button
                      onClick={() => router.push('/instructor/content/create')}
                      className="btn-primary"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Create Content
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((item) => (
                  <div key={item.id} className="border border-surface-200 rounded-lg p-6 hover:shadow-medium transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-surface-100 rounded-lg">
                        {getContentIcon(item.type)}
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => router.push(`/instructor/content/${item.id}/view`)}
                          className="btn-ghost p-1"
                          title="View content"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/instructor/content/${item.id}/edit`)}
                          className="btn-ghost p-1"
                          title="Edit content"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this content?')) {
                              // Handle delete
                            }
                          }}
                          className="btn-ghost p-1 text-danger-600 hover:text-danger-700"
                          title="Delete content"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium text-surface-900 line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-surface-600 mt-1 line-clamp-2">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className={`badge ${item.is_published ? 'badge-success' : 'badge-warning'}`}>
                          {item.is_published ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-surface-500">{getContentTypeLabel(item.type)}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-surface-100 text-surface-600 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="inline-block bg-surface-100 text-surface-600 text-xs px-2 py-1 rounded">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-surface-500">
                        Created: {formatDate(item.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
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
                onClick={() => router.push('/instructor/content/upload')}
                className="flex items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <div className="p-2 bg-primary-100 rounded-lg mr-3">
                  <DocumentIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-surface-900">Upload File</h3>
                  <p className="text-sm text-surface-600">Upload PDFs, images, or documents</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/instructor/content/youtube')}
                className="flex items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <div className="p-2 bg-danger-100 rounded-lg mr-3">
                  <PlayIcon className="h-6 w-6 text-danger-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-surface-900">Add YouTube Content</h3>
                  <p className="text-sm text-surface-600">Add videos or playlists</p>
                </div>
              </button>

              <button
                onClick={() => router.push('/instructor/content/create')}
                className="flex items-center p-4 border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <div className="p-2 bg-secondary-100 rounded-lg mr-3">
                  <DocumentTextIcon className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-surface-900">Create Content Page</h3>
                  <p className="text-sm text-surface-600">Create rich content with mixed media</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 