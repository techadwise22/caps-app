'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/components/providers/AuthProvider';
import toast from 'react-hot-toast';
import { UserRole } from '@/types';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'instructor'] as const),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const result = await signUp(data.email, data.password, data.fullName, data.role);
      
      if (!result.success) {
        toast.error(result.error || 'Failed to create account');
      } else {
        toast.success('Account created successfully! Welcome to CAPS CA.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-surface-900">Join CAPS CA</h2>
        <p className="text-surface-600 mt-2">Create your account to start your CA journey</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="form-label">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            {...register('fullName')}
            className={`form-input ${errors.fullName ? 'border-danger-500' : ''}`}
            placeholder="Enter your full name"
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="form-error">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`form-input ${errors.email ? 'border-danger-500' : ''}`}
            placeholder="Enter your email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`form-input ${errors.password ? 'border-danger-500' : ''}`}
            placeholder="Create a password"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="form-label">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className={`form-input ${errors.confirmPassword ? 'border-danger-500' : ''}`}
            placeholder="Confirm your password"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="form-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="form-label">
            I am a
          </label>
          <select
            id="role"
            {...register('role')}
            className={`form-input ${errors.role ? 'border-danger-500' : ''}`}
            disabled={isLoading}
          >
            <option value="">Select your role</option>
            <option value="student">CA Student</option>
            <option value="instructor">CA Instructor</option>
          </select>
          {errors.role && (
            <p className="form-error">{errors.role.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="spinner w-4 h-4 mr-2"></div>
              Creating account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-surface-600">
          Already have an account?{' '}
          <span className="text-primary-600 font-medium">
            Use the demo credentials above to explore the platform
          </span>
        </p>
      </div>
    </div>
  );
} 