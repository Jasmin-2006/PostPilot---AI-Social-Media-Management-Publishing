import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  PenTool, 
  Calendar as CalendarIcon, 
  FileText, 
  Sparkles, 
  BarChart3, 
  Settings, 
  Mic, 
  LogOut, 
  CheckCircle2, 
  ChevronRight,
  User as UserIcon,
  Flame
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentUser, 
    logout, 
    setIsVoiceModalOpen,
    accounts,
    posts 
  } = useApp();

  const connectedCount = accounts.filter(a => a.isConnected).length;
  const draftCount = posts.filter(p => p.overallStatus === 'Draft').length;

  interface NavItem {
    id: 'dashboard' | 'create' | 'calendar' | 'posts' | 'assistant' | 'analytics' | 'settings';
    label: string;
    icon: any;
    badge?: string;
    count?: number;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Create Post', icon: PenTool, badge: 'AI' },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'posts', label: 'My Posts', icon: FileText, count: posts.length },
    { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-stone-900 text-stone-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-stone-800 select-none z-30">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-serif font-bold text-lg shadow-sm">
              P
            </div>
            <div>
              <span className="font-serif text-lg font-semibold tracking-tight text-white block leading-tight">
                PostPilot
              </span>
              <span className="text-[11px] text-stone-400 font-normal">
                Multi-Platform Engine
              </span>
            </div>
          </div>
        </div>

        {/* Quick Voice Idea Action */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 text-stone-200 hover:text-white transition-all group shadow-sm text-xs font-medium"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mic className="w-3.5 h-3.5" />
              </span>
              <span>Speak an Idea</span>
            </div>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">
              Voice AI
            </span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && (
                  <span className="text-[11px] text-stone-500 font-mono">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer & User Profile Section */}
      <div className="p-4 border-t border-stone-800 space-y-3">
        {/* Connected platforms status preview */}
        <div className="bg-stone-800/40 rounded-lg p-2.5 border border-stone-800/80">
          <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Networks Active
            </span>
            <span className="font-mono text-stone-300">{connectedCount}/6</span>
          </div>
          <div className="w-full bg-stone-700/60 rounded-full h-1 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(connectedCount / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-stone-700 shrink-0"
              onError={(e) => {
                // Fallback avatar
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-stone-100 truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-stone-400 truncate">
                {currentUser.role || 'Content Creator'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
