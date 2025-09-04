'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/components/providers/AuthProvider';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await signIn(data.email, data.password);
      
      if (!result.success) {
        setError('root', { message: result.error || 'Failed to sign in' });
        toast.error(result.error || 'Failed to sign in');
      } else {
        toast.success('Signed in successfully! Redirecting...');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('root', { message: 'An unexpected error occurred' });
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
          <LockClosedIcon className="h-6 w-6 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-surface-900">Welcome back</h2>
        <p className="text-surface-600 mt-2">Sign in to your CAPS CA account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-surface-400" />
            </div>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`form-input pl-10 ${errors.email ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : ''}`}
              placeholder="Enter your email"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-surface-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={`form-input pl-10 pr-10 ${errors.password ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : ''}`}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-surface-400 hover:text-surface-600" />
              ) : (
                <EyeIcon className="h-5 w-5 text-surface-400 hover:text-surface-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        {errors.root && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
            <p className="text-sm text-danger-700">{errors.root.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 text-base font-medium"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="spinner w-5 h-5 mr-2"></div>
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-surface-600 text-sm">
          Don't have an account?{' '}
          <span className="text-primary-600 font-medium">
            Use the demo credentials above to explore the platform
          </span>
        </p>
      </div>

      {/* Demo Credentials Reminder */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-100">
        <h4 className="text-sm font-semibold text-primary-800 mb-2">Demo Access</h4>
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-primary-700">Student:</span>
            <span className="font-mono text-primary-800">ca.student@demo.com / demo123</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-700">Instructor:</span>
            <span className="font-mono text-secondary-800">ca.instructor@demo.com / demo123</span>
          </div>
          <div className="flex justify-between">
            <span className="text-success-700">Admin:</span>
            <span className="font-mono text-success-800">admin@demo.com / demo123</span>
          </div>
        </div>
      </div>
    </div>
  );
} 