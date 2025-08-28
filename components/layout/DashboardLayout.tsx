'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  HomeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems = {
  admin: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Courses', href: '/admin/courses', icon: AcademicCapIcon },
    { name: 'Content', href: '/admin/content', icon: DocumentTextIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon },
  ],
  instructor: [
    { name: 'Dashboard', href: '/instructor/dashboard', icon: HomeIcon },
    { name: 'Tests', href: '/instructor/tests', icon: ClipboardDocumentListIcon },
    { name: 'Questions', href: '/instructor/questions', icon: DocumentTextIcon },
    { name: 'Content', href: '/instructor/content', icon: BookOpenIcon },
    { name: 'Classes', href: '/instructor/classes', icon: VideoCameraIcon },
    { name: 'Assignments', href: '/instructor/assignments', icon: DocumentTextIcon },
    { name: 'Analytics', href: '/instructor/analytics', icon: ChartBarIcon },
  ],
  student: [
    { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon },
    { name: 'Tests', href: '/student/tests', icon: ClipboardDocumentListIcon },
    { name: 'Content', href: '/student/content', icon: BookOpenIcon },
    { name: 'Classes', href: '/student/classes', icon: VideoCameraIcon },
    { name: 'Progress', href: '/student/progress', icon: ChartBarIcon },
  ],
  committee_tester: [
    { name: 'Dashboard', href: '/committee/dashboard', icon: HomeIcon },
    { name: 'Tests', href: '/committee/tests', icon: ClipboardDocumentListIcon },
    { name: 'Content', href: '/committee/content', icon: BookOpenIcon },
    { name: 'Analytics', href: '/committee/analytics', icon: ChartBarIcon },
  ],
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    router.push('/');
    return null;
  }

  const navigation = navigationItems[user.role] || [];

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-surface-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center">
              <div className="relative w-8 h-8 mr-3">
                <Image
                  src="/logo.svg"
                  alt="CAPS Learn Logo"
                  width={32}
                  height={32}
                  className="logo-spin"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-blue-900">CAPS Learn</h1>
                <span className="text-xs text-gray-500">CA Coaching Centre</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-surface-400 hover:text-surface-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="px-4 py-6">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`nav-link ${
                      pathname === item.href ? 'nav-link-active' : 'nav-link-inactive'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-xl">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center">
              <div className="relative w-8 h-8 mr-3">
                <Image
                  src="/logo.svg"
                  alt="CAPS Learn Logo"
                  width={32}
                  height={32}
                  className="logo-spin"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-blue-900">CAPS Learn</h1>
                <span className="text-xs text-gray-500">CA Coaching Centre</span>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`nav-link ${
                      pathname === item.href ? 'nav-link-active' : 'nav-link-inactive'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-surface-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-surface-400 hover:text-surface-600"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h2 className="text-lg font-semibold text-surface-900">
                  {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden sm:block">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-surface-400 hover:text-surface-600">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-surface-900">{user.full_name}</p>
                    <p className="text-xs text-surface-500 capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {user.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="text-surface-400 hover:text-surface-600"
                title="Sign out"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 