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
  content_type: 'study_material' | 'video_series' | 'practice_questions' | 'lecture_notes' | 'case_study';
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
    title: 'CA Foundation - Accounting Basics',
    subtitle: 'Accounting',
    description: 'Comprehensive study material covering fundamental accounting principles, double-entry bookkeeping, and financial statement preparation for CA Foundation students.',
    content_type: 'study_material',
    level: 'Foundation',
    status: 'published',
    views_count: 1250,
    author_name: 'Prof. Priya Patel',
    youtubeLinks: [
      {
        title: 'Accounting Fundamentals',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Introduction to basic accounting concepts'
      },
      {
        title: 'Double Entry Bookkeeping',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Understanding double entry system'
      }
    ],
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '2',
    title: 'CA Intermediate - Advanced Accounting Video Series',
    subtitle: 'Advanced Accounting',
    description: 'Complete video series covering advanced accounting topics including consolidation, foreign exchange, and complex financial instruments.',
    content_type: 'video_series',
    level: 'Intermediate',
    status: 'published',
    views_count: 890,
    author_name: 'Prof. Rajesh Verma',
    youtubeLinks: [
      {
        title: 'Advanced Accounting Part 1',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Consolidation techniques'
      },
      {
        title: 'Advanced Accounting Part 2',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Foreign exchange accounting'
      }
    ],
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z'
  },
  {
    id: '3',
    title: 'CA Final - Strategic Financial Management Notes',
    subtitle: 'Strategic Financial Management',
    description: 'Comprehensive study notes covering strategic financial management concepts, risk assessment, and investment decision-making.',
    content_type: 'study_material',
    level: 'Final',
    status: 'pending_review',
    views_count: 0,
    author_name: 'Prof. Amit Kumar',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '4',
    title: 'CA Foundation - Business Laws Practice Questions',
    subtitle: 'Business Laws',
    description: 'Extensive collection of practice questions covering business laws, company law, and legal frameworks for CA Foundation examination.',
    content_type: 'practice_questions',
    level: 'Foundation',
    status: 'published',
    views_count: 2100,
    author_name: 'Prof. Neha Singh',
    youtubeLinks: [
      {
        title: 'Business Laws Overview',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Introduction to business laws'
      }
    ],
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