import React from 'react';
import { SocialPlatform } from '../types';

interface PlatformIconProps {
  platform: SocialPlatform;
  className?: string;
  size?: number;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, className = 'w-4 h-4', size = 16 }) => {
  switch (platform) {
    case 'instagram':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case 'twitter':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3z" />
        </svg>
      );
    case 'threads':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
          <path d="M16 11.5c0-2.5-1.8-4-4-4s-4 1.5-4 4 1.8 4 4 4c1.5 0 2.8-.7 3.4-1.8" />
          <path d="M12 15.5c-1.9 0-3.5-1.6-3.5-3.5S10.1 8.5 12 8.5s3.5 1.6 3.5 3.5" />
        </svg>
      );
    default:
      return null;
  }
};

export const getPlatformMeta = (platform: SocialPlatform) => {
  switch (platform) {
    case 'instagram':
      return {
        name: 'Instagram',
        color: 'text-pink-600',
        bgLight: 'bg-pink-50',
        border: 'border-pink-200',
        charLimit: 2200,
        suggestedHashtags: '3-15 hashtags',
      };
    case 'linkedin':
      return {
        name: 'LinkedIn',
        color: 'text-blue-700',
        bgLight: 'bg-blue-50',
        border: 'border-blue-200',
        charLimit: 3000,
        suggestedHashtags: '3-5 hashtags',
      };
    case 'twitter':
      return {
        name: 'X (Twitter)',
        color: 'text-neutral-900',
        bgLight: 'bg-neutral-100',
        border: 'border-neutral-300',
        charLimit: 280,
        suggestedHashtags: '1-3 hashtags',
      };
    case 'facebook':
      return {
        name: 'Facebook',
        color: 'text-indigo-600',
        bgLight: 'bg-indigo-50',
        border: 'border-indigo-200',
        charLimit: 63206,
        suggestedHashtags: '1-2 hashtags',
      };
    case 'youtube':
      return {
        name: 'YouTube',
        color: 'text-red-600',
        bgLight: 'bg-red-50',
        border: 'border-red-200',
        charLimit: 5000,
        suggestedHashtags: 'Title + Description tags',
      };
    case 'threads':
      return {
        name: 'Threads',
        color: 'text-neutral-800',
        bgLight: 'bg-neutral-50',
        border: 'border-neutral-200',
        charLimit: 500,
        suggestedHashtags: '1 topic tag',
      };
  }
};
