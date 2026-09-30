export type SocialPlatform = 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'youtube' | 'threads';

export interface UserPreferences {
  defaultTone: 'Professional' | 'Casual' | 'Friendly' | 'Creative' | 'Educational' | 'Exciting';
  defaultLength: 'Short' | 'Medium' | 'Long';
  hashtagCount: number;
  useEmojis: boolean;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  scheduledAlerts: boolean;
  failedPublishAlerts: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  role?: string;
  preferences: UserPreferences;
  createdAt: string;
}

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  platformName: string;
  isConnected: boolean;
  accountHandle: string;
  accountName: string;
  avatarUrl?: string;
  followersCount?: number;
  connectedAt?: string;
  clientId?: string;
  scope?: string[];
  statusMessage?: string;
}

export type PostStatus = 'Draft' | 'Scheduled' | 'Publishing' | 'Published' | 'Failed' | 'Not Published';

export interface PlatformPostContent {
  platform: SocialPlatform;
  caption: string;
  title?: string;
  hashtags: string[];
  tags?: string[];
  visualSuggestion?: string;
  status: PostStatus;
  scheduledAt?: string;
  publishedAt?: string;
  platformUrl?: string;
  platformPostId?: string;
  errorMessage?: string;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  originalContent: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  link?: string;
  createdAt: string;
  updatedAt: string;
  overallStatus: 'Draft' | 'Scheduled' | 'Published' | 'Archived';
  scheduledAt?: string;
  publishedAt?: string;
  selectedPlatforms: SocialPlatform[];
  platforms: Partial<Record<SocialPlatform, PlatformPostContent>>;
}

export interface IdeaSuggestion {
  id: string;
  category: string;
  title: string;
  hook: string;
  targetPlatforms: SocialPlatform[];
  suggestedFormat: string;
}

export interface AIUsageLog {
  id: string;
  userId: string;
  type: 'generate_post' | 'ideas' | 'refine' | 'voice_command' | 'assistant_chat';
  details: string;
  createdAt: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  activityType: 'post_created' | 'post_published' | 'post_scheduled' | 'voice_used' | 'ai_generated';
  details: string;
  timestamp: string;
}

export interface UsageMetrics {
  timeSpentSeconds: number;
  postsCreated: number;
  postsPublished: number;
  postsScheduled: number;
  draftsCount: number;
  aiGenerations: number;
  voiceInteractions: number;
}
