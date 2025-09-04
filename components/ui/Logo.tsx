'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  animated?: boolean;
  animation?: 'spin' | 'pulse' | 'bounce' | 'glow' | 'none';
}

export default function Logo({ 
  size = 'md', 
  className = '', 
  showText = true, 
  animated = true,
  animation = 'none'
}: LogoProps) {
  const [logoError, setLogoError] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const textSizesSecondary = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-sm'
  };

  const getAnimationClass = () => {
    switch (animation) {
      case 'spin':
        return 'logo-spin';
      case 'pulse':
        return 'logo-pulse';
      case 'bounce':
        return 'logo-bounce';
      case 'glow':
        return 'logo-glow';
      default:
        return '';
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`logo-container ${sizeClasses[size]} mr-3`}>
        {!logoError ? (
          <Image
            src="/logo.svg"
            alt="CAPS @ 25 Logo"
            width={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 64}
            height={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 64}
            className={`${getAnimationClass()} ${animated ? 'hover:scale-110 hover:rotate-1' : ''}`}
            onError={() => setLogoError(true)}
            priority
          />
        ) : (
          <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg`}>
            <AcademicCapIcon className={`${iconSizes[size]} text-white`} />
          </div>
        )}
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent ${textSizes[size]} leading-tight`}>
            CAPS @ 25
          </span>
          <span className={`text-gray-600 ${textSizesSecondary[size]} leading-tight`}>
            C's Academy for Professional Studies
          </span>
        </div>
      )}
    </div>
  );
} 