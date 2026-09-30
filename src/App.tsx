/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { VoiceModal } from './components/VoiceModal';
import { PostTrackingModal } from './components/PostTrackingModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';

import { DashboardView } from './pages/DashboardView';
import { CreatePostView } from './pages/CreatePostView';
import { CalendarView } from './pages/CalendarView';
import { MyPostsView } from './pages/MyPostsView';
import { AiAssistantView } from './pages/AiAssistantView';
import { AnalyticsView } from './pages/AnalyticsView';
import { SettingsView } from './pages/SettingsView';

import { Menu, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, trackingPostId, setTrackingPostId, setDraftToEdit } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'create':
        return <CreatePostView />;
      case 'calendar':
        return <CalendarView />;
      case 'posts':
        return <MyPostsView />;
      case 'assistant':
        return <AiAssistantView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden font-sans text-stone-900 selection:bg-amber-100 selection:text-amber-950">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 h-full shadow-2xl">
            <Sidebar />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-stone-900 text-white border-b border-stone-800">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1 text-stone-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-serif font-bold text-sm tracking-tight">PostPilot</span>
          <div className="w-6" />
        </div>

        {/* Top Header */}
        <TopHeader />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto bg-stone-50/60">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <VoiceModal
        onApplyVoiceDraft={(data) => {
          setDraftToEdit({
            id: '',
            userId: '',
            title: data.title,
            originalContent: data.content,
            createdAt: '',
            updatedAt: '',
            overallStatus: 'Draft',
            selectedPlatforms: ['instagram', 'linkedin', 'twitter'],
            platforms: {},
          });
        }}
      />
      <PostTrackingModal
        postId={trackingPostId}
        onClose={() => setTrackingPostId(null)}
      />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
