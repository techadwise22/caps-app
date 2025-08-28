'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['student', 'instructor', 'admin']),
  level: z.enum(['Foundation', 'Intermediate', 'Final']),
  status: z.enum(['active', 'pending']),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  onSave: (data: UserFormData) => void;
  mode: 'add' | 'edit';
}

export function UserModal({ isOpen, onClose, user, onSave, mode }: UserModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user || {
      name: '',
      email: '',
      role: 'student',
      level: 'Foundation',
      status: 'active',
    },
  });

  useEffect(() => {
    if (isOpen && user) {
      reset(user);
    } else if (isOpen && !user) {
      reset({
        name: '',
        email: '',
        role: 'student',
        level: 'Foundation',
        status: 'active',
      });
    }
  }, [isOpen, user, reset]);

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      await onSave(data);
      onClose();
      reset();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <h2 className="text-xl font-semibold text-surface-900">
            {mode === 'add' ? 'Add New User' : 'Edit User'}
          </h2>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-600"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-surface-700 mb-1">
              Full Name
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="form-input w-full"
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-danger-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1">
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="form-input w-full"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-danger-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-surface-700 mb-1">
              Role
            </label>
            <select {...register('role')} id="role" className="form-select w-full">
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-danger-600 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-surface-700 mb-1">
              Level
            </label>
            <select {...register('level')} id="level" className="form-select w-full">
              <option value="Foundation">Foundation</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Final">Final</option>
            </select>
            {errors.level && (
              <p className="text-danger-600 text-sm mt-1">{errors.level.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-surface-700 mb-1">
              Status
            </label>
            <select {...register('status')} id="status" className="form-select w-full">
              <option value="active">Active</option>
              <option value="pending">Pending</option>
            </select>
            {errors.status && (
              <p className="text-danger-600 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : mode === 'add' ? 'Add User' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 