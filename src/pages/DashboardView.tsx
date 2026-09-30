import React from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon, getPlatformMeta } from '../components/PlatformIcon';
import { Post, SocialPlatform } from '../types';
import { 
  PenTool, 
  Sparkles, 
  Mic, 
  Calendar as CalendarIcon, 
  Send, 
  Clock, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Activity,
  Layers,
  Eye
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    setCurrentView, 
    setIsVoiceModalOpen, 
    posts, 
    metrics, 
    publishPostNow,
    setTrackingPostId,
    setDraftToEdit
  } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = currentUser.name.split(' ')[0] || currentUser.name;
    if (hour < 12) return `Good morning, ${firstName}! 👋`;
    if (hour < 18) return `Good afternoon, ${firstName}! 👋`;
    return `Good evening, ${firstName}! 👋`;
  };

  const recentPosts = posts.slice(0, 4);
  const upcomingPosts = posts.filter(p => p.overallStatus === 'Scheduled').slice(0, 3);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m ${totalSeconds % 60}s`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* 1. Welcome Section & Editorial Hero Banner */}
      <section className="relative rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-8 overflow-hidden shadow-xl border border-stone-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Multi-Platform Engine Active</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-white leading-tight">
            {getGreeting()}
          </h1>

          <p className="text-stone-300 text-sm leading-relaxed max-w-xl">
            Create once, let AI customize for Instagram, LinkedIn, X, Facebook, YouTube, and Threads, then schedule and broadcast everywhere.
          </p>

          {/* Quick Actions Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setDraftToEdit(null);
                setCurrentView('create');
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <PenTool className="w-4 h-4" />
              <span>Create Post</span>
            </button>

            <button
              onClick={() => {
                setDraftToEdit(null);
                setCurrentView('create');
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-medium rounded-lg border border-stone-700 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate with AI</span>
            </button>

            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-medium rounded-lg border border-stone-700 transition-colors"
            >
              <Mic className="w-4 h-4 text-amber-400" />
              <span>Speak an Idea</span>
            </button>

            <button
              onClick={() => setCurrentView('calendar')}
              className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-medium rounded-lg border border-stone-700 transition-colors"
            >
              <CalendarIcon className="w-4 h-4 text-stone-400" />
              <span>Schedule Post</span>
            </button>
          </div>
        </div>

        {/* Decorative Ambient Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block opacity-20 pointer-events-none">
          <img
            src="/src/assets/images/hero_workspace_laptop_1790790941869.jpg"
            alt="Workspace"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-stone-900/60 to-stone-900" />
        </div>
      </section>

      {/* 2. Real Statistics Section */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Posts', value: posts.length, icon: Layers, highlight: 'text-stone-900' },
          { label: 'Published', value: metrics.postsPublished, icon: CheckCircle2, highlight: 'text-emerald-700' },
          { label: 'Scheduled', value: metrics.postsScheduled, icon: Clock, highlight: 'text-amber-700' },
          { label: 'Drafts', value: metrics.draftsCount, icon: FileText, highlight: 'text-stone-700' },
          { label: 'AI Generations', value: metrics.aiGenerations, icon: Sparkles, highlight: 'text-amber-600' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-medium">{stat.label}</span>
                <Icon className="w-4 h-4 text-stone-400" />
              </div>
              <span className={`font-mono text-2xl font-bold tracking-tight ${stat.highlight}`}>
                {stat.value}
              </span>
            </div>
          );
        })}
      </section>

      {/* 3. Main Dashboard Grid: Recent Posts & Activity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Posts (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-serif font-bold text-stone-900">
                Recent Posts
              </h2>
              <p className="text-xs text-stone-500">
                Multi-channel status and platform distribution
              </p>
            </div>
            <button
              onClick={() => setCurrentView('posts')}
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1"
            >
              <span>View All ({posts.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-xl bg-white border border-stone-200/90 shadow-sm hover:border-stone-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-900 leading-snug">
                        {post.title}
                      </h3>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                        post.overallStatus === 'Published'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : post.overallStatus === 'Scheduled'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}>
                        {post.overallStatus}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-1 italic">
                      "{post.originalContent}"
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setTrackingPostId(post.id)}
                      className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                      title="View Central Tracking"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {post.overallStatus !== 'Published' && (
                      <button
                        onClick={() => publishPostNow(post.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                      >
                        <Send className="w-3 h-3 text-amber-400" />
                        <span>Publish</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Platforms breakdown badge strip */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-400">Published to:</span>
                    <div className="flex items-center gap-1.5">
                      {post.selectedPlatforms.map((plat) => {
                        const platData = post.platforms[plat];
                        const meta = getPlatformMeta(plat);
                        const isDone = platData?.status === 'Published';
                        return (
                          <div
                            key={plat}
                            title={`${meta.name}: ${platData?.status || 'Draft'}`}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                              isDone
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-stone-100 text-stone-600 border-stone-200'
                            }`}
                          >
                            <PlatformIcon platform={plat} className="w-3 h-3" />
                            <span className="capitalize">{plat}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <span className="text-[11px] text-stone-400 font-mono">
                    {new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Today's Activity & Scheduled Queue */}
        <div className="space-y-6">
          {/* Today's Activity */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-stone-900">Today's Activity</h3>
              </div>
              <span className="text-[11px] font-mono text-stone-400">Live Recording</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-stone-100 text-xs">
                <span className="text-stone-600">Active Time Spent:</span>
                <span className="font-mono font-semibold text-stone-900 tabular-nums">
                  {formatTimer(metrics.timeSpentSeconds)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-100 text-xs">
                <span className="text-stone-600">Posts Created Today:</span>
                <span className="font-mono font-semibold text-stone-900">
                  {metrics.postsCreated}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-100 text-xs">
                <span className="text-stone-600">Posts Published:</span>
                <span className="font-mono font-semibold text-emerald-700">
                  {metrics.postsPublished}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-100 text-xs">
                <span className="text-stone-600">AI Generations:</span>
                <span className="font-mono font-semibold text-amber-700">
                  {metrics.aiGenerations}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 text-xs">
                <span className="text-stone-600">Voice Interactions:</span>
                <span className="font-mono font-semibold text-stone-900">
                  {metrics.voiceInteractions}
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Posts Queue */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-stone-900">Upcoming Scheduled</h3>
              </div>
              <button
                onClick={() => setCurrentView('calendar')}
                className="text-xs text-stone-500 hover:text-stone-900"
              >
                Calendar View
              </button>
            </div>

            {upcomingPosts.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-400 bg-stone-50 rounded-xl">
                No scheduled posts queued.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <h4 className="font-semibold text-stone-900 line-clamp-1">{post.title}</h4>
                      <span className="text-[10px] font-mono text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded">
                        {post.scheduledAt ? new Date(post.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Soon'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {post.selectedPlatforms.map(plat => (
                        <PlatformIcon key={plat} platform={plat} className="w-3.5 h-3.5 text-stone-600" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
