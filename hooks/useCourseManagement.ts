'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export interface YouTubeLink {
  title: string;
  url: string;
  description?: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  level: 'Foundation' | 'Intermediate' | 'Final';
  status: 'active' | 'inactive';
  students: number;
  instructors: number;
  youtubeLinks?: YouTubeLink[];
  created_at?: string;
  updated_at?: string;
}

export function useCourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - replace with actual Supabase calls
  const mockCourses: Course[] = [
    {
      id: '1',
      name: 'CA Foundation',
      description: 'Chartered Accountancy Foundation Course - Comprehensive introduction to accounting principles and business fundamentals',
      level: 'Foundation',
      students: 450,
      instructors: 8,
      status: 'active',
      youtubeLinks: [
        {
          title: 'Introduction to Accounting',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Basic accounting concepts and principles'
        },
        {
          title: 'Business Mathematics',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Mathematical foundations for business'
        }
      ],
    },
    {
      id: '2',
      name: 'CA Intermediate',
      description: 'Chartered Accountancy Intermediate Course - Advanced accounting techniques and professional standards',
      level: 'Intermediate',
      students: 320,
      instructors: 12,
      status: 'active',
      youtubeLinks: [
        {
          title: 'Advanced Financial Reporting',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'Complex financial reporting standards'
        }
      ],
    },
    {
      id: '3',
      name: 'CA Final',
      description: 'Chartered Accountancy Final Course - Professional practice and advanced topics',
      level: 'Final',
      students: 280,
      instructors: 15,
      status: 'active',
      youtubeLinks: [],
    },
  ];

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
      // Fallback to mock data for demonstration
      setCourses(mockCourses);
    } finally {
      setLoading(false);
    }
  };

  // Add new course
  const addCourse = async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error('Failed to add course');
      }

      const newCourse = await response.json();
      setCourses(prev => [newCourse, ...prev]);
      toast.success('Course added successfully');
      return newCourse;
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Failed to add course');
      throw error;
    }
  };

  // Update course
  const updateCourse = async (id: string, courseData: Partial<Course>) => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error('Failed to update course');
      }

      const updatedCourse = await response.json();
      setCourses(prev => prev.map(course => 
        course.id === id ? updatedCourse : course
      ));
      toast.success('Course updated successfully');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
      throw error;
    }
  };

  // Delete course
  const deleteCourse = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      setCourses(prev => prev.filter(course => course.id !== id));
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
      throw error;
    }
  };

  // Get course statistics
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
    const totalInstructors = courses.reduce((sum, course) => sum + course.instructors, 0);
    const activeCourses = courses.filter(course => course.status === 'active').length;

    return {
      totalCourses,
      totalStudents,
      totalInstructors,
      activeCourses,
    };
  }, [courses]);

  // Get courses by level
  const getCoursesByLevel = (level: Course['level']) => {
    return courses.filter(course => course.level === level);
  };

  // Get active courses
  const getActiveCourses = () => {
    return courses.filter(course => course.status === 'active');
  };

  return {
    courses,
    loading,
    addCourse,
    updateCourse,
    deleteCourse,
    loadCourses,
    stats,
    getCoursesByLevel,
    getActiveCourses,
  };
} 