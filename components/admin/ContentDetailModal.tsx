'use client';

import { XMarkIcon, PlayIcon } from '@heroicons/react/24/outline';

interface ContentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: any;
}

export function ContentDetailModal({ isOpen, onClose, content }: ContentDetailModalProps) {
  if (!isOpen || !content) return null;

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
        return 'Study Material';
      case 'video_series':
        return 'Video Series';
      case 'practice_questions':
        return 'Practice Questions';
      case 'lecture_notes':
        return 'Lecture Notes';
      case 'case_study':
        return 'Case Study';
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'pending_review':
        return 'Pending Review';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Content Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-gray-900">{content.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <p className="text-gray-900">{content.subtitle}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(content.content_type)}`}>
                  {getTypeLabel(content.content_type)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <p className="text-gray-900">{content.level}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(content.status)}`}>
                  {getStatusLabel(content.status)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Views</label>
                <p className="text-gray-900">{content.views_count?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <p className="text-gray-900">{content.author_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                <p className="text-gray-900">
                  {content.created_at ? new Date(content.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{content.description}</p>
          </div>

          {/* YouTube Links */}
          {content.youtubeLinks && content.youtubeLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">YouTube Videos</h3>
              <div className="space-y-4">
                {content.youtubeLinks.map((link: any, index: number) => {
                  const thumbnail = getYouTubeThumbnail(link.url);
                  const embedUrl = getYouTubeEmbedUrl(link.url);
                  
                  return (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{link.title}</h4>
                        {link.description && (
                          <p className="text-sm text-gray-600 mb-3">{link.description}</p>
                        )}
                        
                        {embedUrl && (
                          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <iframe
                              src={embedUrl}
                              title={link.title}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        )}
                        
                        <div className="mt-3 flex items-center justify-between">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <PlayIcon className="h-4 w-4 mr-1" />
                            Watch on YouTube
                          </a>
                          {thumbnail && (
                            <img
                              src={thumbnail}
                              alt={link.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content ID</label>
                <p className="text-sm text-gray-500 font-mono">{content.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                <p className="text-gray-900">
                  {content.updated_at ? new Date(content.updated_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 