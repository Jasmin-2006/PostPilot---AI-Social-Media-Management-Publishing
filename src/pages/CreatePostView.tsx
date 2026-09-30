import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SocialPlatform, PlatformPostContent, Post } from '../types';
import { PlatformIcon, getPlatformMeta } from '../components/PlatformIcon';
import { IdeasDrawer } from '../components/IdeasDrawer';
import { PlatformPreviewModal } from '../components/PlatformPreviewModal';
import { ScheduleModal } from '../components/ScheduleModal';
import { 
  Sparkles, 
  Mic, 
  Lightbulb, 
  Send, 
  Clock, 
  Save, 
  Eye, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Hash, 
  Smile, 
  RefreshCw, 
  Scissors, 
  Maximize2, 
  SmilePlus, 
  Briefcase, 
  Flame, 
  Check, 
  AlertCircle,
  Copy,
  ChevronDown
} from 'lucide-react';

export const CreatePostView: React.FC = () => {
  const { 
    currentUser, 
    createPost, 
    updatePost,
    draftToEdit, 
    setDraftToEdit, 
    setCurrentView,
    setIsVoiceModalOpen,
    incrementAIGeneration,
    publishPostNow,
    schedulePost,
    accounts,
    addToast
  } = useApp();

  // Core Inputs
  const [title, setTitle] = useState(draftToEdit?.title || '');
  const [content, setContent] = useState(draftToEdit?.originalContent || '');
  const [link, setLink] = useState(draftToEdit?.link || '');
  const [mediaUrl, setMediaUrl] = useState(draftToEdit?.mediaUrl || '/src/assets/images/sample_post_design_1790790966824.jpg');
  
  // Platforms selected
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(
    draftToEdit?.selectedPlatforms || ['instagram', 'linkedin', 'twitter']
  );

  // Active platform tab for viewing/editing specific platform copy
  const [activePlatformTab, setActivePlatformTab] = useState<SocialPlatform>('instagram');

  // AI Generation Controls
  const [tone, setTone] = useState<string>(currentUser.preferences.defaultTone || 'Professional');
  const [length, setLength] = useState<string>(currentUser.preferences.defaultLength || 'Medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  // Platform-specific content state
  const [platformContents, setPlatformContents] = useState<Record<SocialPlatform, PlatformPostContent>>(() => {
    if (draftToEdit?.platforms) {
      return {
        instagram: draftToEdit.platforms.instagram || createEmptyPlatform('instagram'),
        linkedin: draftToEdit.platforms.linkedin || createEmptyPlatform('linkedin'),
        twitter: draftToEdit.platforms.twitter || createEmptyPlatform('twitter'),
        facebook: draftToEdit.platforms.facebook || createEmptyPlatform('facebook'),
        youtube: draftToEdit.platforms.youtube || createEmptyPlatform('youtube'),
        threads: draftToEdit.platforms.threads || createEmptyPlatform('threads'),
      };
    }
    return {
      instagram: createEmptyPlatform('instagram'),
      linkedin: createEmptyPlatform('linkedin'),
      twitter: createEmptyPlatform('twitter'),
      facebook: createEmptyPlatform('facebook'),
      youtube: createEmptyPlatform('youtube'),
      threads: createEmptyPlatform('threads'),
    };
  });

  // Modal States
  const [isIdeasDrawerOpen, setIsIdeasDrawerOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  function createEmptyPlatform(plat: SocialPlatform): PlatformPostContent {
    return {
      platform: plat,
      caption: '',
      title: '',
      hashtags: [],
      tags: [],
      visualSuggestion: '',
      status: 'Draft',
    };
  }

  // Toggle platform selection
  const togglePlatform = (plat: SocialPlatform) => {
    setSelectedPlatforms(prev => {
      const exists = prev.includes(plat);
      if (exists) {
        if (prev.length === 1) {
          addToast('At least one platform required', 'Select at least one social destination.', 'error');
          return prev;
        }
        return prev.filter(p => p !== plat);
      } else {
        return [...prev, plat];
      }
    });
  };

  // AI Full Multi-Platform Generation
  const handleAIGenerateAll = async () => {
    if (!content.trim() && !title.trim()) {
      addToast('Draft content needed', 'Please provide an idea, title, or rough notes first.', 'error');
      return;
    }

    setIsGenerating(true);
    incrementAIGeneration();

    try {
      const response = await fetch('/api/ai/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: title,
          rawContent: content,
          tone,
          length,
          selectedPlatforms,
        }),
      });
      const data = await response.json();

      if (data.platforms) {
        setPlatformContents(prev => {
          const updated = { ...prev };
          selectedPlatforms.forEach(plat => {
            const generated = data.platforms[plat];
            if (generated) {
              updated[plat] = {
                ...updated[plat],
                caption: generated.caption || updated[plat].caption,
                title: generated.title || title,
                hashtags: generated.hashtags || updated[plat].hashtags,
                tags: generated.tags || updated[plat].tags,
                visualSuggestion: generated.visualSuggestion || updated[plat].visualSuggestion,
              };
            }
          });
          return updated;
        });
        addToast('AI Customization Complete', `Generated customized copy for ${selectedPlatforms.length} platform(s)!`, 'success');
      }
    } catch (e: any) {
      console.error(e);
      addToast('Generation error', 'Using instant template generation.', 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  // Single Platform Refinement Tool (Improve, Shorten, Expand, Make Professional, Friendly, Engaging, Hashtags)
  const handleRefinePlatform = async (plat: SocialPlatform, action: string) => {
    const currentText = platformContents[plat]?.caption;
    if (!currentText) {
      addToast('No text to refine', 'Generate or type content for this platform first.', 'error');
      return;
    }

    setIsRefining(true);
    incrementAIGeneration();

    try {
      const res = await fetch('/api/ai/refine-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: plat,
          text: currentText,
          action,
          tone,
          length,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setPlatformContents(prev => ({
          ...prev,
          [plat]: {
            ...prev[plat],
            caption: data.result,
          }
        }));
        addToast('Refinement Applied', `Action "${action}" completed for ${plat}.`, 'success');
      }
    } catch (err: any) {
      console.error(err);
      addToast('Refinement error', err.message, 'error');
    } finally {
      setIsRefining(false);
    }
  };

  // Save current post
  const handleSaveDraft = () => {
    if (!title.trim() && !content.trim()) {
      addToast('Empty Post', 'Please add a title or content before saving.', 'error');
      return;
    }

    const postPayload = {
      title: title || 'Untitled Idea',
      originalContent: content,
      mediaUrl,
      mediaType: 'image' as const,
      link,
      overallStatus: 'Draft' as const,
      selectedPlatforms,
      platforms: platformContents,
    };

    if (draftToEdit?.id) {
      updatePost(draftToEdit.id, postPayload);
      addToast('Draft Updated', 'Changes saved to your post library.', 'success');
    } else {
      createPost(postPayload);
      addToast('Draft Saved', 'Post saved to My Posts.', 'success');
    }
  };

  // Publish Now
  const handlePublishNow = async () => {
    if (!title.trim() && !content.trim()) {
      addToast('Cannot publish empty post', 'Please create content before publishing.', 'error');
      return;
    }

    let postId = draftToEdit?.id;
    if (!postId) {
      const created = createPost({
        title: title || 'Social Broadcast',
        originalContent: content,
        mediaUrl,
        mediaType: 'image',
        link,
        overallStatus: 'Draft',
        selectedPlatforms,
        platforms: platformContents,
      });
      postId = created.id;
    } else {
      updatePost(postId, {
        title,
        originalContent: content,
        mediaUrl,
        selectedPlatforms,
        platforms: platformContents,
      });
    }

    const success = await publishPostNow(postId, selectedPlatforms);
    if (success) {
      setDraftToEdit(null);
      setCurrentView('posts');
    }
  };

  // Schedule Post Confirmation
  const handleConfirmSchedule = (isoString: string) => {
    let postId = draftToEdit?.id;
    if (!postId) {
      const created = createPost({
        title: title || 'Scheduled Post',
        originalContent: content,
        mediaUrl,
        mediaType: 'image',
        link,
        overallStatus: 'Scheduled',
        scheduledAt: isoString,
        selectedPlatforms,
        platforms: platformContents,
      });
      postId = created.id;
    } else {
      updatePost(postId, {
        title,
        originalContent: content,
        mediaUrl,
        selectedPlatforms,
        platforms: platformContents,
      });
    }

    schedulePost(postId, isoString);
    setDraftToEdit(null);
    setCurrentView('calendar');
  };

  const currentTabContent = platformContents[activePlatformTab];
  const meta = getPlatformMeta(activePlatformTab);
  const charCount = currentTabContent?.caption.length || 0;
  const isOverCharLimit = charCount > meta.charLimit;

  const presetImages = [
    { name: 'Architecture & Design Studio', url: '/src/assets/images/sample_post_design_1790790966824.jpg' },
    { name: 'Minimalist Workspace Desk', url: '/src/assets/images/hero_workspace_laptop_1790790941869.jpg' },
    { name: 'Editorial Studio Portrait', url: '/src/assets/images/avatar_creator_alex_1790790955557.jpg' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Top Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
            Create & Adapt Post
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Write once, AI adapts for each social channel, publish or schedule seamlessly.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg shadow-sm transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            <span>Preview Mode</span>
          </button>

          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-stone-500" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg shadow-sm transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Schedule</span>
          </button>

          <button
            onClick={handlePublishNow}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-amber-400" />
            <span>Publish to {selectedPlatforms.length} Channels</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: 2 Column Layout (Left: Source Idea & Media, Right: Platform Customizations) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Source Content & Platform Target Selection (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Platforms Checkbox Grid */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                1. Target Social Networks
              </label>
              <span className="text-[11px] text-stone-400 font-mono">
                {selectedPlatforms.length}/6 active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(['instagram', 'linkedin', 'twitter', 'facebook', 'youtube', 'threads'] as SocialPlatform[]).map((plat) => {
                const isChecked = selectedPlatforms.includes(plat);
                const pMeta = getPlatformMeta(plat);
                const isAccConnected = accounts.find(a => a.platform === plat)?.isConnected;

                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => togglePlatform(plat)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                      isChecked
                        ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                        : 'border-stone-200 bg-stone-50/50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={plat} className={`w-4 h-4 ${isChecked ? 'text-amber-400' : pMeta.color}`} />
                      <span className="font-semibold">{pMeta.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isAccConnected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Account connected" />
                      )}
                      <span className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] ${
                        isChecked ? 'bg-amber-500 border-amber-400 text-stone-950 font-bold' : 'border-stone-300'
                      }`}>
                        {isChecked ? <Check className="w-3 h-3" /> : ''}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Original Core Content Inputs */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                2. Core Post Idea & Draft
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsIdeasDrawerOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded border border-amber-200 transition-colors"
                >
                  <Lightbulb className="w-3 h-3" />
                  <span>Give Me Ideas</span>
                </button>

                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded border border-stone-200 transition-colors"
                >
                  <Mic className="w-3 h-3 text-amber-600" />
                  <span>Speak</span>
                </button>
              </div>
            </div>

            {/* Post Title */}
            <div>
              <label className="text-[11px] font-medium text-stone-500 block mb-1">
                Post Title / Campaign Concept
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI Travel Planner Project Launch"
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 font-medium"
              />
            </div>

            {/* Core Content Box */}
            <div>
              <label className="text-[11px] font-medium text-stone-500 block mb-1">
                Main Idea / Rough Draft / Story
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="Write your core thought once: What happened? What are the key takeaways? What should the audience know? PostPilot will adapt this for each channel..."
                className="w-full text-xs p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 resize-none font-sans leading-relaxed"
              />
            </div>

            {/* Media Upload & Link Input */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-stone-700 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                  Attached Visual Media
                </span>
                <button
                  onClick={() => setShowMediaPicker(!showMediaPicker)}
                  className="text-[11px] text-amber-700 font-semibold hover:underline"
                >
                  {showMediaPicker ? 'Hide Gallery' : 'Select from Library'}
                </button>
              </div>

              {mediaUrl && (
                <div className="relative rounded-xl overflow-hidden border border-stone-200 group aspect-video">
                  <img src={mediaUrl} alt="Attached visual" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setMediaUrl('')}
                    className="absolute top-2 right-2 bg-stone-950/70 hover:bg-stone-950 text-white text-[10px] px-2 py-1 rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}

              {showMediaPicker && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <span className="text-[11px] font-semibold text-stone-600 block">
                    Curated High-Fidelity Assets:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {presetImages.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setMediaUrl(p.url);
                          setShowMediaPicker(false);
                        }}
                        className={`rounded-lg overflow-hidden border transition-all ${
                          mediaUrl === p.url ? 'ring-2 ring-amber-500' : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={p.url} alt={p.name} className="w-full h-14 object-cover" />
                      </button>
                    ))}
                  </div>

                  {/* Local file upload simulation */}
                  <label className="block pt-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setMediaUrl(reader.result as string);
                            setShowMediaPicker(false);
                            addToast('Image uploaded', file.name, 'success');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div className="p-2 text-center text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg cursor-pointer transition-colors">
                      + Upload Custom Image / Video
                    </div>
                  </label>
                </div>
              )}

              {/* Destination URL */}
              <div>
                <label className="text-[11px] font-medium text-stone-500 block mb-1 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-stone-400" />
                  Primary Link / Call to Action URL (optional)
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://yourbrand.com/article"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>

            {/* AI Customization Controls: Tone, Length, and "Generate All" */}
            <div className="pt-3 border-t border-stone-200 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    AI Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                  >
                    {['Professional', 'Casual', 'Friendly', 'Creative', 'Educational', 'Exciting'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    Content Length
                  </label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                  >
                    {['Short', 'Medium', 'Long'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* GENERATE ALL BUTTON */}
              <button
                onClick={handleAIGenerateAll}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 text-stone-950 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isGenerating 
                    ? 'AI Adapting for All Selected Channels...' 
                    : `✨ Let AI Customize for ${selectedPlatforms.length} Platform(s)`}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Platform-Specific Independent Editors (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-5">
            {/* Tabs for each selected platform */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  3. Platform-Specific Copy & Customization
                </label>
                <span className="text-[11px] text-stone-400">
                  Each platform is editable independently
                </span>
              </div>

              <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
                {selectedPlatforms.map((plat) => {
                  const isTabActive = plat === activePlatformTab;
                  const pMeta = getPlatformMeta(plat);
                  const hasContent = !!platformContents[plat]?.caption;

                  return (
                    <button
                      key={plat}
                      onClick={() => setActivePlatformTab(plat)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                        isTabActive
                          ? 'bg-stone-900 text-white shadow-sm'
                          : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                      }`}
                    >
                      <PlatformIcon platform={plat} className={`w-3.5 h-3.5 ${isTabActive ? 'text-amber-400' : pMeta.color}`} />
                      <span>{pMeta.name}</span>
                      {hasContent && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isTabActive ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Platform Header Information */}
            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${meta.bgLight} ${meta.color}`}>
                  <PlatformIcon platform={activePlatformTab} className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 leading-tight">
                    {meta.name} Custom Version
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Recommended: {meta.suggestedHashtags}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className={`font-mono text-xs font-semibold ${isOverCharLimit ? 'text-rose-600' : 'text-stone-700'}`}>
                  {charCount} / {meta.charLimit} chars
                </span>
                {isOverCharLimit && (
                  <p className="text-[10px] text-rose-600 font-medium">Exceeds platform limit</p>
                )}
              </div>
            </div>

            {/* Quick AI Refine Toolbar */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5">
                <span className="font-semibold text-stone-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Quick AI Polish Tools for {meta.name}:
                </span>
                {isRefining && <span className="text-amber-700 font-mono">Applying...</span>}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'improve', label: '✨ Improve', action: 'improve' },
                  { id: 'shorten', label: '✂️ Shorten', action: 'shorten' },
                  { id: 'expand', label: '📝 Expand', action: 'expand' },
                  { id: 'professional', label: '🎯 Make Professional', action: 'professional' },
                  { id: 'friendly', label: '😊 Make Friendly', action: 'friendly' },
                  { id: 'engaging', label: '🔥 Make Engaging', action: 'engaging' },
                  { id: 'hashtags', label: '#️⃣ Add Hashtags', action: 'hashtags' },
                ].map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleRefinePlatform(activePlatformTab, tool.action)}
                    disabled={isRefining}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200/80 transition-colors disabled:opacity-50"
                  >
                    {tool.label}
                  </button>
                ))}
              </div>
            </div>

            {/* YouTube Title (Only when YouTube is selected) */}
            {activePlatformTab === 'youtube' && (
              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">
                  YouTube Video Title
                </label>
                <input
                  type="text"
                  value={currentTabContent?.title || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPlatformContents(prev => ({
                      ...prev,
                      youtube: { ...prev.youtube, title: val }
                    }));
                  }}
                  placeholder="Compelling video title (e.g. How We Built an AI Travel Planner in 48h)"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 font-semibold"
                />
              </div>
            )}

            {/* Platform Caption Text Area */}
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1">
                {activePlatformTab === 'youtube' ? 'Video Description & Timestamps' : 'Caption / Post Copy'}
              </label>
              <textarea
                value={currentTabContent?.caption || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setPlatformContents(prev => ({
                    ...prev,
                    [activePlatformTab]: {
                      ...prev[activePlatformTab],
                      caption: val,
                    }
                  }));
                }}
                rows={9}
                placeholder={`Write or let AI generate the specific ${meta.name} caption...`}
                className="w-full text-xs p-3.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 font-sans leading-relaxed resize-none"
              />
            </div>

            {/* Visual Art Direction / AI Suggestion */}
            <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 text-xs space-y-1">
              <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                AI Visual Art Direction Recommendation:
              </span>
              <p className="text-stone-700 italic text-[11px] leading-relaxed">
                {currentTabContent?.visualSuggestion ||
                  `A clean, authentic visual tailored for ${meta.name}, maintaining high contrast and uncluttered design.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Modals */}
      <IdeasDrawer
        isOpen={isIdeasDrawerOpen}
        onClose={() => setIsIdeasDrawerOpen(false)}
        onSelectIdea={(idea) => {
          setTitle(idea.title);
          setContent(idea.hook);
          if (idea.targetPlatforms) {
            setSelectedPlatforms(idea.targetPlatforms);
          }
          addToast('Idea Selected', `"${idea.title}" loaded into draft. Click "Let AI Customize" to adapt.`, 'success');
        }}
      />

      <PlatformPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        platformsContent={platformContents}
        initialPlatform={activePlatformTab}
        mediaUrl={mediaUrl}
        user={currentUser}
        postTitle={title}
      />

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onConfirmSchedule={handleConfirmSchedule}
        postTitle={title}
      />
    </div>
  );
};
