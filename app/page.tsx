'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useState } from 'react';
import Image from 'next/image';
import { AcademicCapIcon, ChartBarIcon, BookOpenIcon, UsersIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on user role
      switch (user.role) {
        case 'student':
          router.push('/student/dashboard');
          break;
        case 'instructor':
          router.push('/instructor/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/student/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-surface-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-surface-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="relative w-10 h-10 mr-3">
                {!logoError ? (
                  <Image
                    src="/logo.svg"
                    alt="CAPS Learn Logo"
                    width={40}
                    height={40}
                    className="logo-spin"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <AcademicCapIcon className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-blue-900">CAPS Learn</h1>
                <span className="text-xs text-gray-500">CA Coaching Centre</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#features" className="text-surface-600 hover:text-primary-600 transition-colors">
                Features
              </a>
              <a href="#demo" className="text-surface-600 hover:text-primary-600 transition-colors">
                Demo
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6">
            Master Your
            <span className="text-yellow-600"> CA Journey</span>
          </h1>
                      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive learning platform by <span className="font-semibold text-blue-800">C's Academy for Professional Studies</span>. 
              Access mock tests, study materials, and track your progress across CA Foundation, Intermediate, and Final levels.
            </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setActiveTab('login')}
              className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors"
            >
              Get Started
            </button>
            <a
              href="#features"
              className="border border-primary-600 text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-primary-50 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-surface-900 mb-4">
              Everything You Need for CA Success
            </h2>
            <p className="text-xl text-surface-600 max-w-3xl mx-auto">
              From Foundation to Final, we provide comprehensive tools and resources to help you excel in your CA journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 mb-2">Mock Tests</h3>
              <p className="text-surface-600">
                Practice with topic-wise and full-length mock tests designed by CA experts
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 mb-2">Performance Analytics</h3>
              <p className="text-surface-600">
                Track your progress with detailed analytics and identify areas for improvement
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 mb-2">Expert Guidance</h3>
              <p className="text-surface-600">
                Learn from experienced CA professionals through live classes and recorded sessions
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-warning-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 mb-2">Study Materials</h3>
              <p className="text-surface-600">
                Access comprehensive study materials, notes, and practice questions
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-danger-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-danger-600" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 mb-2">Progress Tracking</h3>
              <p className="text-surface-600">
                Monitor your learning journey with detailed progress reports and insights
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 mb-2">CA Levels</h3>
              <p className="text-surface-600">
                Complete coverage of CA Foundation, Intermediate, and Final levels
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-surface-900 mb-4">
                Start Your CA Learning Journey
              </h2>
              <p className="text-surface-600">
                Join thousands of CA students who are already using CAPS CA to excel in their studies
              </p>
            </div>

            {/* Demo Credentials */}
            <div id="demo" className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-surface-900 mb-4">Demo Access</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-primary-600 mb-2">CA Student</h4>
                  <p className="text-surface-600">Email: ca.student@demo.com</p>
                  <p className="text-surface-600">Password: demo123</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-secondary-600 mb-2">CA Instructor</h4>
                  <p className="text-surface-600">Email: ca.instructor@demo.com</p>
                  <p className="text-surface-600">Password: demo123</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-success-600 mb-2">Admin</h4>
                  <p className="text-surface-600">Email: admin@demo.com</p>
                  <p className="text-surface-600">Password: demo123</p>
                </div>
              </div>
            </div>

            {/* Auth Tabs */}
            <div className="flex border-b border-surface-200 mb-8">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 px-4 text-center font-semibold transition-colors ${
                  activeTab === 'login'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-3 px-4 text-center font-semibold transition-colors ${
                  activeTab === 'register'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Auth Forms */}
            <div className="min-h-[400px]">
              {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-8 h-8 mr-3">
                {!logoError ? (
                  <Image
                    src="/logo.svg"
                    alt="CAPS Learn Logo"
                    width={32}
                    height={32}
                    className="logo-spin"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <AcademicCapIcon className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold">CAPS Learn</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering CA students to achieve excellence in their professional journey by C's Academy for Professional Studies
            </p>
            <div className="flex justify-center space-x-6 text-surface-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 