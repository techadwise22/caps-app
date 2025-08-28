'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  level: 'Foundation' | 'Intermediate' | 'Final';
  status: 'active' | 'pending';
  joinedDate: string;
  lastActive: string;
}

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  // Mock data for demonstration - replace with actual Supabase calls
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      role: 'student',
      level: 'Foundation',
      status: 'active',
      joinedDate: '2024-01-15',
      lastActive: '2024-01-15 10:30 AM',
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      role: 'instructor',
      level: 'Intermediate',
      status: 'active',
      joinedDate: '2024-01-14',
      lastActive: '2024-01-15 09:15 AM',
    },
    {
      id: '3',
      name: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      role: 'student',
      level: 'Final',
      status: 'active',
      joinedDate: '2024-01-13',
      lastActive: '2024-01-15 11:45 AM',
    },
    {
      id: '4',
      name: 'Neha Singh',
      email: 'neha.singh@example.com',
      role: 'student',
      level: 'Foundation',
      status: 'pending',
      joinedDate: '2024-01-12',
      lastActive: 'Never',
    },
    {
      id: '5',
      name: 'Rajesh Verma',
      email: 'rajesh.verma@example.com',
      role: 'instructor',
      level: 'Final',
      status: 'active',
      joinedDate: '2024-01-11',
      lastActive: '2024-01-15 08:20 AM',
    },
  ];

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (levelFilter !== 'all') params.append('level', levelFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/users?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Filtered users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesLevel = levelFilter === 'all' || user.level === levelFilter;
      
      return matchesSearch && matchesRole && matchesLevel;
    });
  }, [users, searchTerm, roleFilter, levelFilter]);

  // Add new user
  const addUser = async (userData: Omit<User, 'id' | 'joinedDate' | 'lastActive'>) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const newUser = await response.json();
      setUsers(prev => [newUser, ...prev]);
      toast.success('User added successfully');
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
      throw error;
    }
  };

  // Update user
  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ));
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      throw error;
    }
  };

  // Delete user
  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      throw error;
    }
  };

  // Get user statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'active').length;
    const students = users.filter(user => user.role === 'student').length;
    const instructors = users.filter(user => user.role === 'instructor').length;

    return {
      totalUsers,
      activeUsers,
      students,
      instructors,
    };
  }, [users]);

  return {
    users: filteredUsers,
    allUsers: users,
    loading,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    levelFilter,
    setLevelFilter,
    addUser,
    updateUser,
    deleteUser,
    loadUsers,
    stats,
  };
} 