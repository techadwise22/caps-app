'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  PlayIcon,
  ClockIcon,
  EyeIcon,
  ArrowLeftIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';

interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  playlist_url: string;
  playlist_id: string;
  subject: string;
  level: string;
  total_videos: number;
  total_duration: string;
  instructor_name: string;
}

interface YouTubeVideo {
  id: string;
  video_id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail_url: string;
  order_index: number;
}

export default function VideoPlaylistPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [playlist, setPlaylist] = useState<YouTubePlaylist | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && params.id) {
      fetchPlaylistData();
    }
  }, [user, params.id]);

  const fetchPlaylistData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch playlist details
      const { data: playlistData } = await supabase
        .from('youtube_playlists')
        .select(`
          *,
          users!youtube_playlists_instructor_id_fkey(full_name)
        `)
        .eq('id', params.id)
        .single();

      if (playlistData) {
        setPlaylist({
          id: playlistData.id,
          title: playlistData.title,
          description: playlistData.description,
          playlist_url: playlistData.playlist_url,
          playlist_id: playlistData.playlist_id,
          subject: playlistData.subject,
          level: playlistData.level,
          total_videos: playlistData.total_videos,
          total_duration: playlistData.total_duration,
          instructor_name: playlistData.users?.full_name || 'Unknown Instructor'
        });
      }

      // Fetch videos in the playlist
      const { data: videosData } = await supabase
        .from('youtube_videos')
        .select('*')
        .eq('playlist_id', params.id)
        .order('order_index', { ascending: true });

      if (videosData && videosData.length > 0) {
        setVideos(videosData);
        setSelectedVideo(videosData[0]); // Select first video by default
      }

    } catch (error) {
      console.error('Error fetching playlist data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Foundation':
        return 'bg-primary-100 text-primary-700';
      case 'Intermediate':
        return 'bg-secondary-100 text-secondary-700';
      case 'Final':
        return 'bg-success-100 text-success-700';
      default:
        return 'bg-surface-100 text-surface-700';
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!playlist) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-surface-900 mb-4">Playlist Not Found</h1>
          <p className="text-surface-600 mb-6">The requested playlist could not be found.</p>
          <button 
            onClick={() => router.push('/student/content')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Content
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.push('/student/content')}
            className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-surface-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-surface-900">{playlist.title}</h1>
            <p className="text-surface-600">Instructor: {playlist.instructor_name}</p>
          </div>
        </div>

        {/* Playlist Info */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(playlist.level)}`}>
              {playlist.level}
            </span>
            <span className="text-surface-600">{playlist.subject}</span>
            <div className="flex items-center space-x-1 text-surface-600">
              <BookOpenIcon className="h-4 w-4" />
              <span>{playlist.total_videos} videos</span>
            </div>
            <div className="flex items-center space-x-1 text-surface-600">
              <ClockIcon className="h-4 w-4" />
              <span>{playlist.total_duration}</span>
            </div>
          </div>
          <p className="text-surface-700 mb-4">{playlist.description}</p>
          <button 
            onClick={() => window.open(playlist.playlist_url, '_blank')}
            className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center space-x-2"
          >
            <PlayIcon className="h-4 w-4" />
            <span>Open in YouTube</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-surface-900 mb-4">Video Player</h2>
              {selectedVideo ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-surface-100 rounded-lg flex items-center justify-center">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo.video_id}?list=${playlist.playlist_id}`}
                      title={selectedVideo.title}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-2">{selectedVideo.title}</h3>
                    <p className="text-surface-600 text-sm mb-2">{selectedVideo.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-surface-500">
                      <span>{selectedVideo.duration}</span>
                      <span>Video {selectedVideo.order_index}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-surface-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PlayIcon className="h-12 w-12 mx-auto mb-4 text-surface-400" />
                    <p className="text-surface-600">Select a video to start watching</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Video List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-surface-900 mb-4">Videos in Playlist</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {videos.length > 0 ? (
                  videos.map((video) => (
                    <button
                      key={video.id}
                      onClick={() => handleVideoSelect(video)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedVideo?.id === video.id
                          ? 'bg-primary-100 border border-primary-200'
                          : 'hover:bg-surface-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-16 h-12 bg-surface-200 rounded overflow-hidden">
                          {video.thumbnail_url && (
                            <img 
                              src={video.thumbnail_url} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-surface-900 truncate">
                            {video.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-surface-500 mt-1">
                            <span>{video.duration}</span>
                            <span>•</span>
                            <span>Video {video.order_index}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-surface-600">
                    <p>No videos available in this playlist</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 