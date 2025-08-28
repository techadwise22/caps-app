'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserModal } from '@/components/admin/UserModal';
import { UserDetailModal } from '@/components/admin/UserDetailModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useUserManagement } from '@/hooks/useUserManagement';
import { 
  UsersIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const {
    users,
    loading: usersLoading,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    levelFilter,
    setLevelFilter,
    addUser,
    updateUser,
    deleteUser,
    stats,
  } = useUserManagement();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Check if current user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      router.push('/');
    }
  }, [user, router]);

  if (loading || usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleAddUser = () => {
    setModalMode('add');
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setModalMode('edit');
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveUser = async (userData: any) => {
    try {
      if (modalMode === 'add') {
        await addUser(userData);
      } else {
        await updateUser(selectedUser.id, userData);
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">User Management</h1>
            <p className="text-surface-600">Manage all CA platform users</p>
          </div>
          <button 
            onClick={handleAddUser}
            className="btn-primary mt-4 sm:mt-0"
            aria-label="Add new user"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
                aria-label="Search users"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-surface-400" />
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="form-select"
                  aria-label="Filter by role"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="instructor">Instructors</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <select 
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="form-select"
                  aria-label="Filter by level"
                >
                  <option value="all">All Levels</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Final">Final</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-200">
              <thead className="bg-surface-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Role & Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-surface-500">
                      {searchTerm || roleFilter !== 'all' || levelFilter !== 'all' 
                        ? 'No users match your filters' 
                        : 'No users found'}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-surface-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-700">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-surface-900">{user.name}</div>
                            <div className="text-sm text-surface-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'student' ? 'bg-primary-100 text-primary-700' :
                            user.role === 'instructor' ? 'bg-secondary-100 text-secondary-700' :
                            'bg-danger-100 text-danger-700'
                          }`}>
                            {user.role}
                          </span>
                          {user.level && (
                            <span className="text-sm text-surface-900">{user.level}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                        {user.joinedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                        {user.lastActive === 'Never' ? (
                          <span className="text-surface-400 italic">Never</span>
                        ) : (
                          user.lastActive
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewUser(user)}
                            className="text-primary-600 hover:text-primary-900 transition-colors"
                            aria-label={`View details for ${user.name}`}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="text-warning-600 hover:text-warning-900 transition-colors"
                            aria-label={`Edit ${user.name}`}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user)}
                            className="text-danger-600 hover:text-danger-900 transition-colors"
                            aria-label={`Delete ${user.name}`}
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Total Users</p>
                <p className="text-2xl font-bold text-surface-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Active Users</p>
                <p className="text-2xl font-bold text-surface-900">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Students</p>
                <p className="text-2xl font-bold text-surface-900">{stats.students}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">Instructors</p>
                <p className="text-2xl font-bold text-surface-900">{stats.instructors}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          user={selectedUser}
          onSave={handleSaveUser}
          mode={modalMode}
        />

        <UserDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          user={selectedUser}
        />

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete User"
          message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </DashboardLayout>
  );
} 