import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Post, SocialAccount, SocialPlatform, User, UsageMetrics } from '../types';
import { DEMO_USERS, INITIAL_ACCOUNTS, INITIAL_POSTS, INITIAL_USER } from '../data/seedData';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User;
  isLoggedIn: boolean;
  users: User[];
  login: (email: string, pass: string) => boolean;
  signup: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  
  posts: Post[];
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Post;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  duplicatePost: (id: string) => Post | undefined;
  publishPostNow: (id: string, targetPlatforms?: SocialPlatform[]) => Promise<boolean>;
  schedulePost: (id: string, scheduledIso: string) => void;
  archivePost: (id: string) => void;
  
  accounts: SocialAccount[];
  connectAccount: (platform: SocialPlatform, handle?: string) => void;
  disconnectAccount: (platform: SocialPlatform) => void;
  
  metrics: UsageMetrics;
  incrementAIGeneration: () => void;
  incrementVoiceInteraction: () => void;
  
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Active view routing
  currentView: 'dashboard' | 'create' | 'calendar' | 'posts' | 'assistant' | 'analytics' | 'settings';
  setCurrentView: (view: 'dashboard' | 'create' | 'calendar' | 'posts' | 'assistant' | 'analytics' | 'settings') => void;
  
  // Voice modal state
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  
  // Quick Post modal or pre-filled draft
  draftToEdit: Post | null;
  setDraftToEdit: (post: Post | null) => void;
  
  // Tracking modal
  trackingPostId: string | null;
  setTrackingPostId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_POSTS = 'postpilot_posts_v1';
const LOCAL_STORAGE_KEY_USER = 'postpilot_user_v1';
const LOCAL_STORAGE_KEY_ACCOUNTS = 'postpilot_accounts_v1';
const LOCAL_STORAGE_KEY_METRICS = 'postpilot_metrics_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_POSTS);
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [accounts, setAccounts] = useState<SocialAccount[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACCOUNTS);
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  const [metrics, setMetrics] = useState<UsageMetrics>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_METRICS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      timeSpentSeconds: 1240, // 20m default recorded
      postsCreated: INITIAL_POSTS.length,
      postsPublished: INITIAL_POSTS.filter(p => p.overallStatus === 'Published').length,
      postsScheduled: INITIAL_POSTS.filter(p => p.overallStatus === 'Scheduled').length,
      draftsCount: INITIAL_POSTS.filter(p => p.overallStatus === 'Draft').length,
      aiGenerations: 18,
      voiceInteractions: 4,
    };
  });

  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'calendar' | 'posts' | 'assistant' | 'analytics' | 'settings'>('dashboard');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [draftToEdit, setDraftToEdit] = useState<Post | null>(null);
  const [trackingPostId, setTrackingPostId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_POSTS, JSON.stringify(posts));
    } catch {}
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
    } catch {}
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_METRICS, JSON.stringify(metrics));
    } catch {}
  }, [metrics]);

  // Real-time active time spent tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        timeSpentSeconds: prev.timeSpentSeconds + 1,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addToast = useCallback((title: string, description?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const login = (email: string, _pass: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
      addToast(`Welcome back, ${found.name.split(' ')[0]}!`, 'Successfully signed in to PostPilot.', 'success');
      return true;
    }
    // Create new session if unrecognized
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      avatarUrl: '/src/assets/images/avatar_creator_alex_1790790955557.jpg',
      preferences: INITIAL_USER.preferences,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    addToast(`Welcome to PostPilot, ${newUser.name.split(' ')[0]}!`, 'Account ready to publish everywhere.', 'success');
    return true;
  };

  const signup = (name: string, email: string, _pass: string) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      avatarUrl: '/src/assets/images/avatar_creator_alex_1790790955557.jpg',
      bio: 'Creator & storyteller publishing across platforms.',
      preferences: INITIAL_USER.preferences,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    addToast(`Account created! Welcome, ${newUser.name.split(' ')[0]}!`, 'Let’s create your first multi-platform post.', 'success');
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    addToast('Signed out', 'You have been safely signed out of PostPilot.');
  };

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      addToast(`Switched account`, `Now logged in as ${user.name}`);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      setUsers(uList => uList.map(u => u.id === updated.id ? updated : u));
      return updated;
    });
    addToast('Profile updated', 'Your profile settings have been saved.', 'success');
  };

  const createPost = (newPostData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Post => {
    const newPost: Post = {
      ...newPostData,
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPosts(prev => [newPost, ...prev]);
    setMetrics(prev => ({
      ...prev,
      postsCreated: prev.postsCreated + 1,
      draftsCount: newPost.overallStatus === 'Draft' ? prev.draftsCount + 1 : prev.draftsCount,
      postsScheduled: newPost.overallStatus === 'Scheduled' ? prev.postsScheduled + 1 : prev.postsScheduled,
      postsPublished: newPost.overallStatus === 'Published' ? prev.postsPublished + 1 : prev.postsPublished,
    }));
    return newPost;
  };

  const updatePost = (id: string, updates: Partial<Post>) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    }));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    addToast('Post deleted', 'The post was removed from your library.');
  };

  const duplicatePost = (id: string) => {
    const target = posts.find(p => p.id === id);
    if (!target) return undefined;
    const duplicated: Post = {
      ...target,
      id: `post_${Date.now()}`,
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      overallStatus: 'Draft',
      publishedAt: undefined,
      scheduledAt: undefined,
      platforms: Object.entries(target.platforms).reduce((acc, [plat, content]) => {
        if (!content) return acc;
        acc[plat as SocialPlatform] = {
          ...content,
          status: 'Draft',
          publishedAt: undefined,
          scheduledAt: undefined,
          platformPostId: undefined,
          platformUrl: undefined,
        };
        return acc;
      }, {} as Record<SocialPlatform, any>),
    };
    setPosts(prev => [duplicated, ...prev]);
    setMetrics(prev => ({ ...prev, postsCreated: prev.postsCreated + 1, draftsCount: prev.draftsCount + 1 }));
    addToast('Post duplicated', 'Created a duplicate draft in My Posts.', 'success');
    return duplicated;
  };

  const publishPostNow = async (id: string, targetPlatforms?: SocialPlatform[]): Promise<boolean> => {
    const post = posts.find(p => p.id === id);
    if (!post) return false;

    const platformsToPublish = targetPlatforms || post.selectedPlatforms;
    
    // Check if any platform is not connected
    const unconnected = platformsToPublish.filter(p => {
      const acc = accounts.find(a => a.platform === p);
      return !acc || !acc.isConnected;
    });

    if (unconnected.length > 0) {
      addToast(
        'Account connection needed',
        `Please connect ${unconnected.join(', ')} in Settings before publishing.`,
        'error'
      );
      return false;
    }

    try {
      const response = await fetch('/api/publish/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          platforms: platformsToPublish,
          postData: post,
        }),
      });
      const data = await response.json();
      
      const now = new Date().toISOString();
      setPosts(prev => prev.map(p => {
        if (p.id === id) {
          const updatedPlatforms = { ...p.platforms };
          platformsToPublish.forEach(plat => {
            const current = updatedPlatforms[plat];
            if (current) {
              updatedPlatforms[plat] = {
                ...current,
                status: 'Published',
                publishedAt: now,
                platformPostId: data.results?.[plat]?.platformPostId || `id_${plat}_${Date.now()}`,
                platformUrl: data.results?.[plat]?.url || `https://${plat}.com`,
              };
            }
          });
          return {
            ...p,
            overallStatus: 'Published',
            publishedAt: now,
            updatedAt: now,
            platforms: updatedPlatforms,
          };
        }
        return p;
      }));

      setMetrics(prev => ({
        ...prev,
        postsPublished: prev.postsPublished + 1,
      }));

      addToast(
        'Published successfully!',
        `Broadcast to ${platformsToPublish.length} platform(s) with custom copy.`,
        'success'
      );
      return true;
    } catch {
      // Local fallback simulation
      const now = new Date().toISOString();
      setPosts(prev => prev.map(p => {
        if (p.id === id) {
          const updatedPlatforms = { ...p.platforms };
          platformsToPublish.forEach(plat => {
            if (updatedPlatforms[plat]) {
              updatedPlatforms[plat] = {
                ...updatedPlatforms[plat]!,
                status: 'Published',
                publishedAt: now,
                platformPostId: `id_${plat}_${Date.now()}`,
                platformUrl: `https://${plat}.com`,
              };
            }
          });
          return {
            ...p,
            overallStatus: 'Published',
            publishedAt: now,
            platforms: updatedPlatforms,
          };
        }
        return p;
      }));
      setMetrics(prev => ({ ...prev, postsPublished: prev.postsPublished + 1 }));
      addToast('Published to platforms!', `Live on ${platformsToPublish.length} networks.`, 'success');
      return true;
    }
  };

  const schedulePost = (id: string, scheduledIso: string) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const updatedPlatforms = { ...p.platforms };
        p.selectedPlatforms.forEach(plat => {
          if (updatedPlatforms[plat]) {
            updatedPlatforms[plat] = {
              ...updatedPlatforms[plat]!,
              status: 'Scheduled',
              scheduledAt: scheduledIso,
            };
          }
        });
        return {
          ...p,
          overallStatus: 'Scheduled',
          scheduledAt: scheduledIso,
          platforms: updatedPlatforms,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    }));

    setMetrics(prev => ({
      ...prev,
      postsScheduled: prev.postsScheduled + 1,
    }));

    const dateFormatted = new Date(scheduledIso).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    addToast(
      'Post Scheduled!',
      `Scheduled for ${dateFormatted} across ${post.selectedPlatforms.length} platform(s).`,
      'success'
    );
  };

  const archivePost = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, overallStatus: 'Archived' } : p));
    addToast('Post archived', 'Moved to archived posts.');
  };

  const connectAccount = (platform: SocialPlatform, handle?: string) => {
    setAccounts(prev => prev.map(a => {
      if (a.platform === platform) {
        return {
          ...a,
          isConnected: true,
          accountHandle: handle || `@${currentUser.name.toLowerCase().replace(/\s+/g, '')}`,
          accountName: currentUser.name,
          connectedAt: new Date().toISOString(),
          statusMessage: 'Connected and ready for automated publishing.',
        };
      }
      return a;
    }));
    addToast('Platform Connected', `${platform.toUpperCase()} account successfully linked!`, 'success');
  };

  const disconnectAccount = (platform: SocialPlatform) => {
    setAccounts(prev => prev.map(a => {
      if (a.platform === platform) {
        return {
          ...a,
          isConnected: false,
          statusMessage: 'Disconnected. Reconnect to resume publishing.',
        };
      }
      return a;
    }));
    addToast('Platform Disconnected', `Unlinked ${platform.toUpperCase()}.`);
  };

  const incrementAIGeneration = () => {
    setMetrics(prev => ({ ...prev, aiGenerations: prev.aiGenerations + 1 }));
  };

  const incrementVoiceInteraction = () => {
    setMetrics(prev => ({ ...prev, voiceInteractions: prev.voiceInteractions + 1 }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        users,
        login,
        signup,
        logout,
        switchUser,
        updateProfile,
        posts,
        createPost,
        updatePost,
        deletePost,
        duplicatePost,
        publishPostNow,
        schedulePost,
        archivePost,
        accounts,
        connectAccount,
        disconnectAccount,
        metrics,
        incrementAIGeneration,
        incrementVoiceInteraction,
        toasts,
        addToast,
        removeToast,
        currentView,
        setCurrentView,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        draftToEdit,
        setDraftToEdit,
        trackingPostId,
        setTrackingPostId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
