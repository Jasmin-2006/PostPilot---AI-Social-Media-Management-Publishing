import React, { useState } from 'react';
import { PlatformPostContent, SocialPlatform, User } from '../types';
import { PlatformIcon, getPlatformMeta } from './PlatformIcon';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  ThumbsUp, 
  Share2, 
  Repeat, 
  BarChart2, 
  MoreHorizontal,
  Play,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface PlatformPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformsContent: Partial<Record<SocialPlatform, PlatformPostContent>>;
  initialPlatform?: SocialPlatform;
  mediaUrl?: string;
  user: User;
  postTitle?: string;
}

export const PlatformPreviewModal: React.FC<PlatformPreviewModalProps> = ({
  isOpen,
  onClose,
  platformsContent,
  initialPlatform = 'instagram',
  mediaUrl,
  user,
  postTitle,
}) => {
  const availablePlatforms = Object.keys(platformsContent) as SocialPlatform[];
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>(
    availablePlatforms.includes(initialPlatform) ? initialPlatform : availablePlatforms[0] || 'instagram'
  );

  if (!isOpen) return null;

  const currentContent = platformsContent[selectedPlatform];
  const meta = getPlatformMeta(selectedPlatform);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header with Platform Switcher */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-stone-500 font-semibold">
                Preview Mode
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Pixel-Accurate Simulator
              </span>
            </div>
            <h2 className="text-sm font-semibold text-stone-900 mt-0.5">
              {postTitle || 'Multi-Platform Social Preview'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="px-6 py-2.5 bg-stone-100/70 border-b border-stone-200 flex items-center gap-2 overflow-x-auto">
          {availablePlatforms.map((plat) => {
            const pMeta = getPlatformMeta(plat);
            const isSel = plat === selectedPlatform;
            return (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isSel
                    ? 'bg-white text-stone-950 shadow-sm border border-stone-200/80 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <PlatformIcon platform={plat} className={`w-3.5 h-3.5 ${pMeta.color}`} />
                <span>{pMeta.name}</span>
              </button>
            );
          })}
        </div>

        {/* Preview Frame Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-stone-100/50 flex justify-center">
          <div className="w-full max-w-lg">
            {/* INSTAGRAM PREVIEW */}
            {selectedPlatform === 'instagram' && (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden text-stone-900 text-xs">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <p className="font-semibold text-xs leading-none">
                        {user.name.toLowerCase().replace(/\s+/g, '')}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5">Original Audio</p>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-stone-400" />
                </div>

                {/* Media */}
                {mediaUrl ? (
                  <img
                    src={mediaUrl}
                    alt="Post visual"
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <div className="w-full aspect-square bg-stone-100 flex flex-col items-center justify-center p-6 text-center text-stone-400 border-y border-stone-200/60">
                    <p className="text-xs font-medium text-stone-600 mb-1">Visual Suggestion:</p>
                    <p className="text-[11px] text-stone-500 italic max-w-xs">
                      {currentContent?.visualSuggestion || 'High-contrast aesthetic photograph matching editorial tone.'}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between text-stone-800">
                    <div className="flex items-center gap-4">
                      <Heart className="w-5 h-5 hover:text-red-500 cursor-pointer" />
                      <MessageCircle className="w-5 h-5 cursor-pointer" />
                      <Send className="w-5 h-5 cursor-pointer" />
                    </div>
                    <Bookmark className="w-5 h-5 cursor-pointer" />
                  </div>
                  <p className="font-semibold text-[11px]">842 likes</p>

                  {/* Caption & Hashtags */}
                  <div className="space-y-1 text-xs leading-relaxed">
                    <span className="font-semibold mr-1.5">
                      {user.name.toLowerCase().replace(/\s+/g, '')}
                    </span>
                    <span className="whitespace-pre-wrap text-stone-800">
                      {currentContent?.caption || 'No caption entered'}
                    </span>
                    {currentContent?.hashtags && currentContent.hashtags.length > 0 && (
                      <p className="text-blue-900 font-medium pt-1">
                        {currentContent.hashtags.join(' ')}
                      </p>
                    )}
                  </div>
                  <p className="text-[10px] text-stone-400 uppercase pt-1">Just now</p>
                </div>
              </div>
            )}

            {/* LINKEDIN PREVIEW */}
            {selectedPlatform === 'linkedin' && (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 text-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-stone-900 text-xs">{user.name}</span>
                        <span className="text-[10px] text-stone-400">· 1st</span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{user.bio || user.role}</p>
                      <p className="text-[10px] text-stone-400">Just now · 🌐</p>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-stone-400" />
                </div>

                <div className="whitespace-pre-wrap text-stone-900 leading-relaxed text-xs">
                  {currentContent?.caption}
                </div>

                {currentContent?.hashtags && currentContent.hashtags.length > 0 && (
                  <p className="text-blue-700 font-medium">
                    {currentContent.hashtags.join(' ')}
                  </p>
                )}

                {mediaUrl && (
                  <img
                    src={mediaUrl}
                    alt="Post media"
                    className="w-full rounded-lg object-cover max-h-72 border border-stone-200"
                  />
                )}

                <div className="pt-2 border-t border-stone-100 flex items-center justify-around text-stone-600 font-medium text-[11px]">
                  <button className="flex items-center gap-1.5 py-1 px-2 hover:bg-stone-50 rounded">
                    <ThumbsUp className="w-3.5 h-3.5" /> Like
                  </button>
                  <button className="flex items-center gap-1.5 py-1 px-2 hover:bg-stone-50 rounded">
                    <MessageCircle className="w-3.5 h-3.5" /> Comment
                  </button>
                  <button className="flex items-center gap-1.5 py-1 px-2 hover:bg-stone-50 rounded">
                    <Repeat className="w-3.5 h-3.5" /> Repost
                  </button>
                  <button className="flex items-center gap-1.5 py-1 px-2 hover:bg-stone-50 rounded">
                    <Send className="w-3.5 h-3.5" /> Send
                  </button>
                </div>
              </div>
            )}

            {/* X (TWITTER) PREVIEW */}
            {selectedPlatform === 'twitter' && (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 text-xs space-y-2.5">
                <div className="flex items-start gap-3">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-stone-950 truncate">{user.name}</span>
                      <span className="text-blue-500">
                        <CheckCircle className="w-3.5 h-3.5 fill-blue-500 text-white" />
                      </span>
                      <span className="text-stone-400 font-mono text-[11px]">
                        @{user.name.toLowerCase().replace(/\s+/g, '')}
                      </span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-400">1m</span>
                    </div>

                    <div className="mt-1 whitespace-pre-wrap text-stone-900 leading-normal text-xs">
                      {currentContent?.caption}
                    </div>

                    {currentContent?.hashtags && currentContent.hashtags.length > 0 && (
                      <p className="text-sky-600 pt-1 font-mono text-[11px]">
                        {currentContent.hashtags.join(' ')}
                      </p>
                    )}

                    {mediaUrl && (
                      <div className="mt-2.5 rounded-xl overflow-hidden border border-stone-200">
                        <img src={mediaUrl} alt="Tweet media" className="w-full max-h-60 object-cover" />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-stone-500 text-[11px] pt-3 pr-4">
                      <span className="flex items-center gap-1.5 hover:text-sky-600">
                        <MessageCircle className="w-3.5 h-3.5" /> 18
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-emerald-600">
                        <Repeat className="w-3.5 h-3.5" /> 42
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-rose-600">
                        <Heart className="w-3.5 h-3.5" /> 312
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-sky-600">
                        <BarChart2 className="w-3.5 h-3.5" /> 4.2K
                      </span>
                      <Share2 className="w-3.5 h-3.5 hover:text-stone-800" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* YOUTUBE PREVIEW */}
            {selectedPlatform === 'youtube' && (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden text-xs">
                {/* Thumbnail Preview */}
                <div className="relative aspect-video bg-stone-900 flex items-center justify-center overflow-hidden">
                  {mediaUrl ? (
                    <img src={mediaUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <div className="p-6 text-center text-stone-300">
                      <p className="font-serif text-lg font-bold text-white mb-2 line-clamp-2">
                        {currentContent?.title || postTitle}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        {currentContent?.visualSuggestion || 'High-contrast typography thumbnail'}
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-stone-950/20 flex items-center justify-center">
                    <span className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </span>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-stone-950/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    12:45
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-stone-900 text-sm leading-snug">
                    {currentContent?.title || postTitle || 'YouTube Video Title'}
                  </h3>

                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <p className="font-semibold text-xs text-stone-900">{user.name}</p>
                      <p className="text-[10px] text-stone-400">18.4K subscribers</p>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg text-stone-700 whitespace-pre-wrap leading-relaxed text-[11px] border border-stone-200/60 max-h-40 overflow-y-auto">
                    {currentContent?.caption}
                  </div>

                  {currentContent?.tags && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {currentContent.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FACEBOOK PREVIEW */}
            {selectedPlatform === 'facebook' && (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 text-xs space-y-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <p className="font-bold text-stone-900">{user.name}</p>
                    <p className="text-[10px] text-stone-400">Just now · 🌍 Public</p>
                  </div>
                </div>

                <div className="whitespace-pre-wrap text-stone-900 leading-relaxed">
                  {currentContent?.caption}
                </div>

                {mediaUrl && (
                  <img src={mediaUrl} alt="Post image" className="w-full rounded-lg object-cover max-h-64 border border-stone-200" />
                )}

                <div className="pt-2 border-t border-stone-100 flex items-center justify-around text-stone-600 font-medium text-[11px]">
                  <span className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600">
                    <ThumbsUp className="w-3.5 h-3.5" /> Like
                  </span>
                  <span className="flex items-center gap-1.5 cursor-pointer hover:text-stone-900">
                    <MessageCircle className="w-3.5 h-3.5" /> Comment
                  </span>
                  <span className="flex items-center gap-1.5 cursor-pointer hover:text-stone-900">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </span>
                </div>
              </div>
            )}

            {/* THREADS PREVIEW */}
            {selectedPlatform === 'threads' && (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 text-xs space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-stone-200"
                    />
                    <div className="w-0.5 bg-stone-200 flex-1 my-2" style={{ minHeight: '40px' }} />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-950">
                        {user.name.toLowerCase().replace(/\s+/g, '')}
                      </span>
                      <span className="text-[10px] text-stone-400">3m</span>
                    </div>

                    <p className="whitespace-pre-wrap text-stone-900 leading-relaxed">
                      {currentContent?.caption}
                    </p>

                    {mediaUrl && (
                      <img src={mediaUrl} alt="Threads media" className="w-full rounded-lg object-cover max-h-56 mt-2 border border-stone-200" />
                    )}

                    <div className="flex items-center gap-4 text-stone-700 pt-2">
                      <Heart className="w-4 h-4 hover:text-rose-500 cursor-pointer" />
                      <MessageCircle className="w-4 h-4 cursor-pointer" />
                      <Repeat className="w-4 h-4 cursor-pointer" />
                      <Send className="w-4 h-4 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
          <div className="text-stone-500">
            Char limit: <span className="font-mono text-stone-800">{currentContent?.caption.length || 0}</span> / {meta.charLimit}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors"
          >
            Done Previewing
          </button>
        </div>
      </div>
    </div>
  );
};
