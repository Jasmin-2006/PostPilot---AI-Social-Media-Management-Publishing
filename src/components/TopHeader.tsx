import React from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Mic, Sparkles, Bell, Radio } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { 
    currentUser, 
    currentView, 
    setCurrentView, 
    setIsVoiceModalOpen,
    accounts,
    metrics
  } = useApp();

  // Dynamic time-based greeting using user's real name (never hardcoded)
  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = currentUser.name.split(' ')[0] || currentUser.name;
    if (hour < 12) return `Good morning, ${firstName}`;
    if (hour < 18) return `Good afternoon, ${firstName}`;
    return `Good evening, ${firstName}`;
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Command Center';
      case 'create': return 'Create & Adapt Post';
      case 'calendar': return 'Content Calendar';
      case 'posts': return 'Post Library';
      case 'assistant': return 'Editorial AI Assistant';
      case 'analytics': return 'Performance & Usage';
      case 'settings': return 'Settings & Accounts';
      default: return 'Overview';
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <header className="h-16 px-8 border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
      {/* Zone 1: Breadcrumb and View Context */}
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-widest font-mono text-stone-500 font-medium">
          PostPilot
        </span>
        <span className="text-stone-300">/</span>
        <h1 className="text-sm font-semibold text-stone-900 font-sans tracking-tight">
          {getViewTitle()}
        </h1>
      </div>

      {/* Zone 2: Dynamic Personalized Greeting Banner */}
      <div className="hidden lg:flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700">
          <span className="font-serif italic font-medium text-stone-900">
            {getGreeting()} 👋
          </span>
          <span className="text-stone-400">·</span>
          <span className="text-stone-500">
            {metrics.postsPublished} published this cycle
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-500 font-mono text-[11px] tabular-nums">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active: {formatTimer(metrics.timeSpentSeconds)}</span>
        </div>
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300/80 rounded-lg transition-colors whitespace-nowrap"
          title="Speak an Idea"
        >
          <Mic className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline">Voice Idea</span>
        </button>

        <button
          onClick={() => setCurrentView('create')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-all shadow-sm whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>Create Post</span>
        </button>
      </div>
    </header>
  );
};
