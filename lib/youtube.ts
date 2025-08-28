const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  channelTitle: string;
  viewCount: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  publishedAt: string;
  channelTitle: string;
  videos: YouTubeVideo[];
}

export class YouTubeAPI {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || YOUTUBE_API_KEY || '';
  }

  // Extract playlist ID from URL
  static extractPlaylistId(url: string): string | null {
    const match = url.match(/[?&]list=([^&]+)/);
    return match ? match[1] : null;
  }

  // Extract video ID from URL
  static extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  // Get playlist details
  async getPlaylist(playlistId: string): Promise<YouTubePlaylist> {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${this.apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch playlist details');
    }

    const data = await response.json();
    const playlist = data.items[0];

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    // Get playlist videos
    const videos = await this.getPlaylistVideos(playlistId);

    return {
      id: playlist.id,
      title: playlist.snippet.title,
      description: playlist.snippet.description,
      thumbnail: playlist.snippet.thumbnails?.high?.url || '',
      videoCount: playlist.contentDetails.itemCount,
      publishedAt: playlist.snippet.publishedAt,
      channelTitle: playlist.snippet.channelTitle,
      videos,
    };
  }

  // Get playlist videos
  async getPlaylistVideos(playlistId: string): Promise<YouTubeVideo[]> {
    const videos: YouTubeVideo[] = [];
    let nextPageToken: string | undefined;

    do {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${this.apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch playlist videos');
      }

      const data = await response.json();
      nextPageToken = data.nextPageToken;

      // Get video details for each video in the playlist
      const videoIds = data.items.map((item: any) => item.contentDetails.videoId).join(',');
      const videoDetails = await this.getVideoDetails(videoIds);

      for (const item of data.items) {
        const videoDetail = videoDetails.find(v => v.id === item.contentDetails.videoId);
        if (videoDetail) {
          videos.push({
            id: item.contentDetails.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails?.high?.url || '',
            duration: videoDetail.duration,
            publishedAt: item.snippet.publishedAt,
            channelTitle: item.snippet.channelTitle,
            viewCount: videoDetail.viewCount,
          });
        }
      }
    } while (nextPageToken);

    return videos;
  }

  // Get video details
  async getVideoDetails(videoIds: string): Promise<any[]> {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${this.apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }

    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.id,
      duration: item.contentDetails.duration,
      viewCount: item.statistics.viewCount,
    }));
  }

  // Get single video details
  async getVideo(videoId: string): Promise<YouTubeVideo> {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${this.apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }

    const data = await response.json();
    const video = data.items[0];

    if (!video) {
      throw new Error('Video not found');
    }

    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails?.high?.url || '',
      duration: video.contentDetails.duration,
      publishedAt: video.snippet.publishedAt,
      channelTitle: video.snippet.channelTitle,
      viewCount: video.statistics.viewCount,
    };
  }

  // Search videos
  async searchVideos(query: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${this.apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to search videos');
    }

    const data = await response.json();
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
    const videoDetails = await this.getVideoDetails(videoIds);

    return data.items.map((item: any, index: number) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || '',
      duration: videoDetails[index]?.duration || '',
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      viewCount: videoDetails[index]?.viewCount || '0',
    }));
  }

  // Format duration from ISO 8601 format
  static formatDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    let result = '';
    if (hours) {
      result += `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    } else {
      result += `${minutes || '0'}:${seconds.padStart(2, '0')}`;
    }

    return result;
  }

  // Get embed URL for a video
  static getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Get thumbnail URL for a video
  static getThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
    return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
  }
}

// Utility functions for YouTube integration
export const youtubeUtils = {
  // Validate YouTube URL
  isValidYouTubeUrl(url: string): boolean {
    const patterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/playlist\?list=[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
    ];

    return patterns.some(pattern => pattern.test(url));
  },

  // Get video ID from various YouTube URL formats
  getVideoId(url: string): string | null {
    return YouTubeAPI.extractVideoId(url);
  },

  // Get playlist ID from YouTube URL
  getPlaylistId(url: string): string | null {
    return YouTubeAPI.extractPlaylistId(url);
  },

  // Format view count
  formatViewCount(count: string): string {
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M views`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K views`;
    }
    return `${num} views`;
  },

  // Format published date
  formatPublishedDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  },
}; 