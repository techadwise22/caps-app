'use client';

import { XMarkIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function UserDetailModal({ isOpen, onClose, user }: UserDetailModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <h2 className="text-xl font-semibold text-surface-900">User Details</h2>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-600"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-medium text-primary-700">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-surface-900">{user.name}</h3>
              <p className="text-surface-600">{user.email}</p>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Role</label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  user.role === 'student' ? 'bg-primary-100 text-primary-700' :
                  user.role === 'instructor' ? 'bg-secondary-100 text-secondary-700' :
                  'bg-danger-100 text-danger-700'
                }`}>
                  {user.role}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Level</label>
                <p className="text-surface-900">{user.level}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Status</label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  user.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                }`}>
                  {user.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Joined Date</label>
                <div className="flex items-center text-surface-900">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {user.joinedDate}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Last Active</label>
                <div className="flex items-center text-surface-900">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  {user.lastActive === 'Never' ? (
                    <span className="text-surface-500 italic">Never</span>
                  ) : (
                    user.lastActive
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">User ID</label>
                <p className="text-surface-900 font-mono text-sm">{user.id}</p>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="border-t border-surface-200 pt-6">
            <h4 className="text-lg font-medium text-surface-900 mb-4">Activity Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface-50 rounded-lg p-4">
                <p className="text-sm text-surface-600">Test Activity</p>
                <p className="text-2xl font-bold text-surface-900">0</p>
              </div>
              <div className="bg-surface-50 rounded-lg p-4">
                <p className="text-sm text-surface-600">Content Completed</p>
                <p className="text-2xl font-bold text-surface-900">0</p>
              </div>
              <div className="bg-surface-50 rounded-lg p-4">
                <p className="text-sm text-surface-600">Average Score</p>
                <p className="text-2xl font-bold text-surface-900">-</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-surface-200">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 