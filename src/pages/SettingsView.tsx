import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SocialPlatform } from '../types';
import { PlatformIcon, getPlatformMeta } from '../components/PlatformIcon';
import { IntegrationSetupModal } from '../components/IntegrationSetupModal';
import { 
  User, 
  Share2, 
  Sparkles, 
  Bell, 
  SunMoon, 
  ShieldCheck, 
  LogOut, 
  Save, 
  Trash2, 
  Key, 
  Users,
  Check,
  RefreshCw
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    currentUser, 
    updateProfile, 
    accounts, 
    users, 
    switchUser, 
    logout, 
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'platforms' | 'ai' | 'notifications' | 'appearance' | 'account'>('profile');

  // Form states
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);

  // Preferences
  const [tone, setTone] = useState(currentUser.preferences.defaultTone);
  const [length, setLength] = useState(currentUser.preferences.defaultLength);
  const [hashtagCount, setHashtagCount] = useState(currentUser.preferences.hashtagCount);
  const [useEmojis, setUseEmojis] = useState(currentUser.preferences.useEmojis);

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(currentUser.preferences.emailNotifications);
  const [scheduledAlerts, setScheduledAlerts] = useState(currentUser.preferences.scheduledAlerts);
  const [failedAlerts, setFailedAlerts] = useState(currentUser.preferences.failedPublishAlerts);

  // Modal for platform config
  const [modalPlatform, setModalPlatform] = useState<SocialPlatform | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      bio,
      avatarUrl,
      preferences: {
        ...currentUser.preferences,
        defaultTone: tone,
        defaultLength: length,
        hashtagCount,
        useEmojis,
        emailNotifications: emailAlerts,
        scheduledAlerts,
        failedPublishAlerts: failedAlerts,
      },
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
          System Settings & Integrations
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Configure connected social networks, editorial AI personas, and security preferences.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'platforms', label: 'Connected Platforms', icon: Share2 },
          { id: 'ai', label: 'AI Preferences', icon: Sparkles },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'appearance', label: 'Appearance', icon: SunMoon },
          { id: 'account', label: 'Account & Security', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
                isActive
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-sm">
          <div className="flex items-center gap-5">
            <img
              src={avatarUrl}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-stone-200 shadow-sm"
            />
            <div>
              <h3 className="text-sm font-bold text-stone-900">{name}</h3>
              <p className="text-xs text-stone-500">{email}</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAvatarUrl('/src/assets/images/avatar_creator_alex_1790790955557.jpg');
                    addToast('Avatar Selected', 'Portrait set as profile image.', 'success');
                  }}
                  className="text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-md"
                >
                  Reset Studio Avatar
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Bio / Headline</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell your audience about your background or craft..."
              className="w-full text-xs p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 resize-none font-sans"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>Save Profile</span>
          </button>
        </form>
      )}

      {/* 2. Connected Platforms Tab */}
      {activeTab === 'platforms' && (
        <div className="space-y-4">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
            <span className="font-semibold text-stone-800 block mb-0.5">Connected Networks Management:</span>
            Programmatic publishing connects to each platform via official OAuth 2.0 PKCE tokens.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {accounts.map((acc) => {
              const meta = getPlatformMeta(acc.platform);
              return (
                <div
                  key={acc.platform}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${meta.bgLight} ${meta.color} border ${meta.border}`}>
                        <PlatformIcon platform={acc.platform} className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">{meta.name}</h4>
                        <p className="text-xs text-stone-500 font-mono">
                          {acc.isConnected ? acc.accountHandle : 'Not connected'}
                        </p>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                      acc.isConnected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-stone-100 text-stone-600 border-stone-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${acc.isConnected ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                      {acc.isConnected ? 'Connected' : 'Offline'}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500 leading-normal">
                    {acc.statusMessage || `Enables direct multi-post broadcasting to ${meta.name}.`}
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-stone-400">
                      Limit: {meta.charLimit} chars
                    </span>

                    <button
                      onClick={() => setModalPlatform(acc.platform)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-colors"
                    >
                      {acc.isConnected ? 'Manage API' : 'Connect Account'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. AI Preferences Tab */}
      {activeTab === 'ai' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Default Generated Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
              >
                {['Professional', 'Casual', 'Friendly', 'Creative', 'Educational', 'Exciting'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Default Content Length
              </label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
              >
                {['Short', 'Medium', 'Long'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Hashtag Count Preference
              </label>
              <input
                type="number"
                min="0"
                max="15"
                value={hashtagCount}
                onChange={(e) => setHashtagCount(parseInt(e.target.value) || 0)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
              />
              <span className="text-[11px] text-stone-400 mt-0.5 block">Recommended: 3 to 5 tags</span>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="emojis-cb"
                checked={useEmojis}
                onChange={(e) => setUseEmojis(e.target.checked)}
                className="w-4 h-4 rounded text-stone-900 border-stone-300 focus:ring-stone-900"
              />
              <label htmlFor="emojis-cb" className="text-xs font-semibold text-stone-700">
                Include Context-Native Emojis in AI Captions
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>Update AI Defaults</span>
          </button>
        </form>
      )}

      {/* 4. Notifications Tab */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm">
          {[
            {
              id: 'sched',
              title: 'Scheduled Post Reminders',
              desc: 'Receive alerts 15 minutes before queued broadcasts go live.',
              checked: scheduledAlerts,
              setter: setScheduledAlerts,
            },
            {
              id: 'pub',
              title: 'Publishing Results & Status Delivery',
              desc: 'Real-time notifications confirming multi-channel distribution.',
              checked: emailAlerts,
              setter: setEmailAlerts,
            },
            {
              id: 'fail',
              title: 'Failed Publishing & API Token Warnings',
              desc: 'Immediate dispatch alerts if an external OAuth token expires.',
              checked: failedAlerts,
              setter: setFailedAlerts,
            },
          ].map((item) => (
            <div key={item.id} className="flex items-start justify-between py-3 border-b border-stone-100 last:border-b-0">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-stone-900">{item.title}</h4>
                <p className="text-[11px] text-stone-500">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.setter(e.target.checked)}
                className="w-4 h-4 text-stone-900 rounded border-stone-300 focus:ring-stone-900"
              />
            </div>
          ))}

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors pt-2"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>Save Notification Preferences</span>
          </button>
        </form>
      )}

      {/* 5. Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono">
            Color Palette & Interface Theme
          </h3>
          <p className="text-xs text-stone-500">
            Inspired by warm editorial print architecture and clean typography hierarchy.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { id: 'light', label: 'Editorial Stone (Default)', active: true },
              { id: 'dark', label: 'Dark Slate Studio', active: false },
              { id: 'system', label: 'Follow System Settings', active: false },
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => addToast('Theme set', `${theme.label} active`, 'info')}
                className={`p-4 rounded-xl border text-left text-xs transition-all ${
                  theme.active
                    ? 'border-stone-900 bg-stone-900 text-white font-semibold'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 6. Account & Security Tab */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          {/* Switch Demo Profile */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-stone-600" />
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono">
                Switch Profile (Demo Accounts)
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Personalized experiences change dynamically based on the active user profile:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {users.map((u) => {
                const isCurrent = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => switchUser(u.id)}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-stone-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-stone-900">{u.name}</p>
                        <p className="text-[11px] text-stone-500">{u.role || u.email}</p>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Change Password Simulation */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono flex items-center gap-2">
              <Key className="w-4 h-4 text-stone-600" />
              Security & Credentials
            </h3>

            <div className="flex items-center justify-between py-2 border-b border-stone-100 text-xs">
              <div>
                <p className="font-semibold text-stone-800">Password</p>
                <p className="text-[11px] text-stone-500">Last changed 28 days ago</p>
              </div>
              <button
                onClick={() => addToast('Password Reset', 'Verification link dispatched to your email.', 'info')}
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Change Password
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out of Session</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Reset demo data to default state?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Demo Store</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Integration Setup Modal */}
      {modalPlatform && (
        <IntegrationSetupModal
          isOpen={true}
          onClose={() => setModalPlatform(null)}
          platformToConfigure={modalPlatform}
        />
      )}
    </div>
  );
};
