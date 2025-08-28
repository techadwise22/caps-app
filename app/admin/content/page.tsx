'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  DocumentIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon as EyeIconSolid
} from '@heroicons/react/24/outline';
import { useContentManagement } from '@/hooks/useContentManagement';
import { ContentModal } from '@/components/admin/ContentModal';
import { ContentDetailModal } from '@/components/admin/ContentDetailModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import toast from 'react-hot-toast';

export default function ContentManagementPage() {
  const router = useRouter();
  const {
    contentItems,
    loading,
    stats,
    addContent,
    updateContent,
    deleteContent,
    loadContent
  } = useContentManagement();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Check if user is admin (simplified for demo)
  const isAdmin = true; // In real app, check from auth context

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/dashboard');
      return;
    }
    loadContent();
  }, [isAdmin, router, loadContent]);

  const handleAddContent = () => {
    setSelectedContent(null);
    setIsAddModalOpen(true);
  };

  const handleEditContent = (content: any) => {
    setSelectedContent(content);
    setIsEditModalOpen(true);
  };

  const handleViewContent = (content: any) => {
    setSelectedContent(content);
    setIsDetailModalOpen(true);
  };

  const handleDeleteContent = (content: any) => {
    setSelectedContent(content);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveContent = async (contentData: any) => {
    try {
      if (selectedContent) {
        await updateContent(selectedContent.id, contentData);
        setIsEditModalOpen(false);
      } else {
        await addContent(contentData);
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedContent) return;
    
    try {
      await deleteContent(selectedContent.id);
      setIsDeleteDialogOpen(false);
      setSelectedContent(null);
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'study_material':
        return 'bg-blue-100 text-blue-800';
      case 'video_series':
        return 'bg-purple-100 text-purple-800';
      case 'practice_questions':
        return 'bg-green-100 text-green-800';
      case 'lecture_notes':
        return 'bg-yellow-100 text-yellow-800';
      case 'case_study':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'study_material':
        return 'study material';
      case 'video_series':
        return 'video series';
      case 'practice_questions':
        return 'practice questions';
      case 'lecture_notes':
        return 'lecture notes';
      case 'case_study':
        return 'case study';
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'published';
      case 'pending_review':
        return 'pending review';
      case 'draft':
        return 'draft';
      default:
        return status;
    }
  };

  const filteredContent = contentItems.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || content.content_type === typeFilter;
    const matchesLevel = levelFilter === 'all' || content.level === levelFilter;
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
    
    return matchesSearch && matchesType && matchesLevel && matchesStatus;
  });

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
              <p className="mt-1 text-sm text-gray-500">Review and manage CA study materials</p>
            </div>
            <button
              onClick={handleAddContent}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Content
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Content
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="study_material">Study Material</option>
                <option value="video_series">Video Series</option>
                <option value="practice_questions">Practice Questions</option>
                <option value="lecture_notes">Lecture Notes</option>
                <option value="case_study">Case Study</option>
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label htmlFor="level-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                id="level-filter"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="Foundation">Foundation</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Final">Final</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="pending_review">Pending Review</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Loading content...
                    </td>
                  </tr>
                ) : filteredContent.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No content found
                    </td>
                  </tr>
                ) : (
                  filteredContent.map((content) => (
                    <tr key={content.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {content.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {content.subtitle}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(content.content_type)}`}>
                            {getTypeLabel(content.content_type)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {content.level}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(content.status)}`}>
                          {getStatusLabel(content.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {content.views_count.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {content.author_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewContent(content)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View content"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditContent(content)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit content"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteContent(content)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete content"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Content</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalContent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Published</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.published}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingReview}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIconSolid className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ContentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveContent}
        mode="add"
      />

      <ContentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveContent}
        content={selectedContent}
        mode="edit"
      />

      <ContentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        content={selectedContent}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Content"
        message={`Are you sure you want to delete "${selectedContent?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
} 