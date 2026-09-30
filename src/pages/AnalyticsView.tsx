import React from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon, getPlatformMeta } from '../components/PlatformIcon';
import { SocialPlatform } from '../types';
import { 
  BarChart3, 
  Clock, 
  Sparkles, 
  Mic, 
  CheckCircle2, 
  FileText, 
  Layers, 
  TrendingUp, 
  ShieldAlert, 
  ExternalLink,
  Lock
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { posts, metrics, accounts, setCurrentView } = useApp();

  const formatDuration = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  };

  // Compute platform usage counts based on actual saved posts
  const platformCounts: Record<SocialPlatform, number> = {
    instagram: 0,
    linkedin: 0,
    twitter: 0,
    facebook: 0,
    youtube: 0,
    threads: 0,
  };

  posts.forEach((p) => {
    p.selectedPlatforms.forEach((plat) => {
      if (platformCounts[plat] !== undefined) {
        platformCounts[plat]++;
      }
    });
  });

  const maxPlatformUsage = Math.max(...Object.values(platformCounts), 1);
  const mostUsedEntry = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0];
  const mostUsedPlatformName = getPlatformMeta(mostUsedEntry[0] as SocialPlatform).name;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
          Usage & Performance Metrics
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Audited analytics of your in-app content operations and external API telemetry.
        </p>
      </div>

      {/* SECTION 1: POSTPILOT USAGE (REAL USER-RECORDED DATA) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900 font-mono">
              In-App Platform Usage
            </h2>
          </div>
          <span className="text-xs text-stone-400 font-mono">100% Verified Telemetry</span>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Time Spent in App</span>
              <Clock className="w-4 h-4 text-stone-400" />
            </div>
            <p className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
              {formatDuration(metrics.timeSpentSeconds)}
            </p>
            <p className="text-[11px] text-stone-400">Live active browser session</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Posts Created</span>
              <FileText className="w-4 h-4 text-stone-400" />
            </div>
            <p className="font-mono text-2xl font-bold text-stone-900">
              {metrics.postsCreated}
            </p>
            <p className="text-[11px] text-stone-400">Across {posts.length} campaigns</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Published Broadcasts</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-mono text-2xl font-bold text-emerald-700">
              {metrics.postsPublished}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium">Successfully sent live</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Scheduled Ahead</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-mono text-2xl font-bold text-amber-700">
              {metrics.postsScheduled}
            </p>
            <p className="text-[11px] text-amber-600 font-medium">Queued in calendar</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>AI Operations Run</span>
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-mono text-2xl font-bold text-amber-800">
              {metrics.aiGenerations}
            </p>
            <p className="text-[11px] text-stone-400">Generations & tool polishes</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Voice Interactions</span>
              <Mic className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-mono text-2xl font-bold text-stone-900">
              {metrics.voiceInteractions}
            </p>
            <p className="text-[11px] text-stone-400">Voice prompts & dictations</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Active Drafts</span>
              <FileText className="w-4 h-4 text-stone-400" />
            </div>
            <p className="font-mono text-2xl font-bold text-stone-700">
              {metrics.draftsCount}
            </p>
            <p className="text-[11px] text-stone-400">Works in progress</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Most Used Platform</span>
              <TrendingUp className="w-4 h-4 text-stone-400" />
            </div>
            <p className="font-serif text-lg font-bold text-stone-900 truncate">
              {mostUsedPlatformName}
            </p>
            <p className="text-[11px] text-stone-400">{mostUsedEntry[1]} posts assigned</p>
          </div>
        </div>

        {/* Platform Breakdown Bars */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono">
            Platform Distribution Breakdown
          </h3>

          <div className="space-y-3">
            {(Object.keys(platformCounts) as SocialPlatform[]).map((plat) => {
              const count = platformCounts[plat];
              const pct = Math.round((count / maxPlatformUsage) * 100);
              const meta = getPlatformMeta(plat);

              return (
                <div key={plat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={plat} className={`w-3.5 h-3.5 ${meta.color}`} />
                      <span className="font-semibold text-stone-800">{meta.name}</span>
                    </div>
                    <span className="font-mono text-stone-500 text-[11px]">
                      {count} post{count === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-stone-900 rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(pct, count > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: EXTERNAL SOCIAL PLATFORM ANALYTICS (EXPLICIT SEPARATION & EMPTY STATE) */}
      <section className="space-y-4 pt-4 border-t border-stone-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-stone-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900 font-mono">
              External Social Platform Analytics
            </h2>
          </div>
          <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            API Read Permission Required
          </span>
        </div>

        {/* Clear truthful Empty State conforming to anti-slop guidelines */}
        <div className="p-8 rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" />
          </div>

          <h3 className="font-serif text-base font-bold text-stone-900">
            Live Follower & Impression Metrics Not Streamed
          </h3>

          <p className="text-xs text-stone-600 max-w-lg mx-auto leading-relaxed">
            In accordance with PostPilot's data integrity constitution, we do not fabricate or estimate third-party Instagram, LinkedIn, or X reach metrics. Real-time engagement counters will appear here once official API read tokens with <code className="font-mono text-stone-800 bg-white px-1 py-0.5 rounded">analytics.read</code> scopes are authorized in Settings.
          </p>

          <button
            onClick={() => setCurrentView('settings')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <span>Manage Connected Platforms</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
