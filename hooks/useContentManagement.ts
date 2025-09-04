import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

export interface YouTubeLink {
  title: string;
  url: string;
  description?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  content_type: 'youtube_playlist' | 'file' | 'mcq_set';
  level: 'Foundation' | 'Intermediate' | 'Final';
  status: 'published' | 'pending_review' | 'draft';
  views_count: number;
  author_name: string;
  youtubeLinks?: YouTubeLink[];
  created_at?: string;
  updated_at?: string;
}

// Mock data for fallback
const mockContentItems: ContentItem[] = [
  {
    id: '1',
    title: 'CA Foundation - Accounting Fundamentals',
    subtitle: 'Accounting',
    description: 'Complete video series covering accounting principles, double-entry bookkeeping, and financial statements.',
    content_type: 'youtube_playlist',
    level: 'Foundation',
    status: 'published',
    views_count: 1250,
    author_name: 'CA Chandrashekhar Shetty Mundkur',
    youtubeLinks: [
      {
        title: 'CA Fdn Accounts R2C - Complete Playlist',
        url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwe3FSEsrYm4ACWlxbg3dIet',
        description: 'Complete CA Foundation Accounts playlist covering all fundamentals'
      }
    ],
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '2',
    title: 'CA Foundation - Business Laws',
    subtitle: 'Business Laws',
    description: 'Complete video series covering business laws, company law, and legal frameworks.',
    content_type: 'youtube_playlist',
    level: 'Foundation',
    status: 'published',
    views_count: 2100,
    author_name: 'Dr. Rajdeep Manwani',
    youtubeLinks: [
      {
        title: 'CA Fdn Law R2C - Complete Playlist',
        url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwfpmL4P3SBg7uC4DuV8G3kI',
        description: 'Complete CA Foundation Business Laws playlist'
      }
    ],
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z'
  },
  {
    id: '3',
    title: 'CA Foundation - Economics Concepts',
    subtitle: 'Economics',
    description: 'Complete video series covering microeconomics, macroeconomics, and economic theory.',
    content_type: 'youtube_playlist',
    level: 'Foundation',
    status: 'published',
    views_count: 890,
    author_name: 'Dr. Divyashree',
    youtubeLinks: [
      {
        title: 'CA Fdn Eco R2C - Complete Playlist',
        url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwcozr0xl-9nBuJPowqsIgDl',
        description: 'Complete CA Foundation Economics playlist'
      }
    ],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '4',
    title: 'CA Foundation - Quantitative Aptitude',
    subtitle: 'Mathematics & Statistics',
    description: 'Complete course covering mathematics, statistics, and quantitative methods.',
    content_type: 'youtube_playlist',
    level: 'Foundation',
    status: 'published',
    views_count: 756,
    author_name: 'CA Sudhindra MS',
    youtubeLinks: [
      {
        title: 'CA Fdn QA R2C - Complete Playlist',
        url: 'https://www.youtube.com/playlist?list=PLM0TDe1dCcwctcAYH8Myyb-5CKdDFPJNR',
        description: 'Complete CA Foundation Quantitative Aptitude playlist'
      }
    ],
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z'
  },
  {
    id: '5',
    title: 'CA Foundation - Accounting Notes',
    subtitle: 'Accounting',
    description: 'Comprehensive PDF notes covering basic accounting principles, journal entries, and ledger accounts.',
    content_type: 'file',
    level: 'Foundation',
    status: 'published',
    views_count: 890,
    author_name: 'CA Chandrashekhar Shetty Mundkur',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '6',
    title: 'CA Foundation - Business Laws Notes',
    subtitle: 'Business Laws',
    description: 'Detailed PDF notes on business laws, company law, and legal frameworks.',
    content_type: 'file',
    level: 'Foundation',
    status: 'published',
    views_count: 756,
    author_name: 'Dr. Rajdeep Manwani',
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z'
  },
  {
    id: '7',
    title: 'CA Foundation - Accounting MCQs',
    subtitle: 'Accounting',
    description: 'Practice MCQs covering accounting fundamentals and concepts.',
    content_type: 'mcq_set',
    level: 'Foundation',
    status: 'published',
    views_count: 1200,
    author_name: 'CA Chandrashekhar Shetty Mundkur',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '8',
    title: 'CA Foundation - Business Laws MCQs',
    subtitle: 'Business Laws',
    description: 'Practice MCQs on business laws and legal concepts.',
    content_type: 'mcq_set',
    level: 'Foundation',
    status: 'published',
    views_count: 980,
    author_name: 'Dr. Rajdeep Manwani',
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z'
  }
];

export function useContentManagement() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load content from API
  const loadContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/content');
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const data = await response.json();
      setContentItems(data);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
      // Fallback to mock data for demonstration
      setContentItems(mockContentItems);
    } finally {
      setLoading(false);
    }
  };

  // Add new content
  const addContent = async (contentData: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });

      if (!response.ok) {
        throw new Error('Failed to add content');
      }

      const newContent = await response.json();
      setContentItems(prev => [newContent, ...prev]);
      toast.success('Content added successfully');
      return newContent;
    } catch (error) {
      console.error('Error adding content:', error);
      toast.error('Failed to add content');
      throw error;
    }
  };

  // Update content
  const updateContent = async (id: string, contentData: Partial<ContentItem>) => {
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });

      if (!response.ok) {
        throw new Error('Failed to update content');
      }

      const updatedContent = await response.json();
      setContentItems(prev => prev.map(content => 
        content.id === id ? updatedContent : content
      ));
      toast.success('Content updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
      throw error;
    }
  };

  // Delete content
  const deleteContent = async (id: string) => {
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete content');
      }

      setContentItems(prev => prev.filter(content => content.id !== id));
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
      throw error;
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalContent = contentItems.length;
    const published = contentItems.filter(item => item.status === 'published').length;
    const pendingReview = contentItems.filter(item => item.status === 'pending_review').length;
    const totalViews = contentItems.reduce((sum, item) => sum + (item.views_count || 0), 0);

    return {
      totalContent,
      published,
      pendingReview,
      totalViews,
    };
  }, [contentItems]);

  return {
    contentItems,
    loading,
    stats,
    addContent,
    updateContent,
    deleteContent,
    loadContent,
  };
} 