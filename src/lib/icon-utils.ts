// Utility for optimized icon imports
import { LucideIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import React from 'react';

// Common icons used across the app - preload these
const COMMON_ICONS = [
  'home', 'user', 'settings', 'search', 'menu', 'close', 'edit', 'delete', 
  'save', 'upload', 'download', 'eye', 'eye-off', 'chevron-down', 'chevron-up',
  'chevron-left', 'chevron-right', 'plus', 'minus', 'check', 'x'
];

// Create optimized icon component with preloading
export const createOptimizedIcon = (iconName: string) => {
  return dynamic(
    () => import('lucide-react').then((mod) => ({ default: mod[iconName as keyof typeof mod] as LucideIcon })),
    {
      loading: () => React.createElement('div', { className: 'w-4 h-4 bg-gray-200 rounded animate-pulse' }),
      ssr: false
    }
  );
};

// Preload common icons
export const preloadCommonIcons = () => {
  if (typeof window !== 'undefined') {
    COMMON_ICONS.forEach(iconName => {
      import('lucide-react').then((mod) => {
        // Preload the icon
        mod[iconName as keyof typeof mod];
      });
    });
  }
};
