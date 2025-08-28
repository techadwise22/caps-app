'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export default function Logo({ size = 'md', className = '', showText = true }: LogoProps) {
  const [logoError, setLogoError] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`relative ${sizeClasses[size]} mr-2`}>
        {!logoError ? (
          <Image
            src="/logo.svg"
            alt="CAPS Learn Logo"
            width={size === 'sm' ? 24 : size === 'md' ? 32 : 48}
            height={size === 'sm' ? 24 : size === 'md' ? 32 : 48}
            className="logo-spin"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className={`${sizeClasses[size]} bg-blue-600 rounded-full flex items-center justify-center`}>
            <AcademicCapIcon className={`${iconSizes[size]} text-white`} />
          </div>
        )}
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-blue-900 ${textSizes[size]}`}>CAPS Learn</span>
          <span className="text-xs text-gray-500">C's Academy for Professional Studies</span>
        </div>
      )}
    </div>
  );
} 