'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  UserGroupIcon,
  AcademicCapIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function AdminSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-surface-900">System Settings</h1>
          <p className="text-surface-600">Configure CAPS CA platform settings and preferences</p>
        </div>

        {/* Settings Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* General Settings */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <CogIcon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-surface-900">General Settings</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Platform Name</span>
                <span className="text-sm font-medium text-surface-900">CAPS CA</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Version</span>
                <span className="text-sm font-medium text-surface-900">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Maintenance Mode</span>
                <span className="text-sm font-medium text-success-600">Disabled</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
              Configure
            </button>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-success-100 rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-success-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-surface-900">Security</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Two-Factor Auth</span>
                <span className="text-sm font-medium text-success-600">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Session Timeout</span>
                <span className="text-sm font-medium text-surface-900">30 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Password Policy</span>
                <span className="text-sm font-medium text-success-600">Strong</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-success-600 text-white py-2 px-4 rounded-lg hover:bg-success-700 transition-colors">
              Manage Security
            </button>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-warning-100 rounded-lg">
                <BellIcon className="h-6 w-6 text-warning-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-surface-900">Notifications</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Email Notifications</span>
                <span className="text-sm font-medium text-success-600">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">SMS Notifications</span>
                <span className="text-sm font-medium text-surface-500">Disabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Push Notifications</span>
                <span className="text-sm font-medium text-success-600">Enabled</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-warning-600 text-white py-2 px-4 rounded-lg hover:bg-warning-700 transition-colors">
              Configure Notifications
            </button>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-surface-900">User Management</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Auto-approval</span>
                <span className="text-sm font-medium text-surface-500">Disabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Email Verification</span>
                <span className="text-sm font-medium text-success-600">Required</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">User Registration</span>
                <span className="text-sm font-medium text-success-600">Open</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-secondary-600 text-white py-2 px-4 rounded-lg hover:bg-secondary-700 transition-colors">
              Manage Users
            </button>
          </div>

          {/* Course Settings */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-surface-900">Course Settings</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Max Students per Course</span>
                <span className="text-sm font-medium text-surface-900">500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Course Creation</span>
                <span className="text-sm font-medium text-success-600">Instructors</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Auto-enrollment</span>
                <span className="text-sm font-medium text-surface-500">Disabled</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
              Configure Courses
            </button>
          </div>

          {/* Content Settings */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-warning-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-warning-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-surface-900">Content Settings</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">File Upload Limit</span>
                <span className="text-sm font-medium text-surface-900">50 MB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Content Moderation</span>
                <span className="text-sm font-medium text-success-600">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-surface-600">Auto-publish</span>
                <span className="text-sm font-medium text-surface-500">Disabled</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-warning-600 text-white py-2 px-4 rounded-lg hover:bg-warning-700 transition-colors">
              Configure Content
            </button>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-semibold text-surface-900 mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-surface-600 mb-2">Platform Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-500">Version:</span>
                  <span className="text-surface-900">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Build:</span>
                  <span className="text-surface-900">2024.01.15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Environment:</span>
                  <span className="text-surface-900">Production</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-surface-600 mb-2">Database</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-500">Type:</span>
                  <span className="text-surface-900">PostgreSQL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Version:</span>
                  <span className="text-surface-900">14.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Status:</span>
                  <span className="text-success-600">Connected</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-surface-600 mb-2">Storage</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-500">Used:</span>
                  <span className="text-surface-900">2.4 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Available:</span>
                  <span className="text-surface-900">47.6 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Usage:</span>
                  <span className="text-surface-900">4.8%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-surface-600 mb-2">Performance</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-500">Uptime:</span>
                  <span className="text-surface-900">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Response Time:</span>
                  <span className="text-surface-900">120ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Status:</span>
                  <span className="text-success-600">Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 