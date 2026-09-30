import React from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon, getPlatformMeta } from './PlatformIcon';
import { SocialPlatform, PostStatus } from '../types';
import { X, CheckCircle2, Clock, AlertCircle, ExternalLink, Calendar, Send, Copy } from 'lucide-react';

interface PostTrackingModalProps {
  postId: string | null;
  onClose: () => void;
}

export const PostTrackingModal: React.FC<PostTrackingModalProps> = ({ postId, onClose }) => {
  const { posts, publishPostNow, addToast } = useApp();

  if (!postId) return null;
  const post = posts.find(p => p.id === postId);
  if (!post) return null;

  const allPlatforms: SocialPlatform[] = ['instagram', 'linkedin', 'twitter', 'facebook', 'youtube', 'threads'];

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'Published':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Published
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Scheduled
          </span>
        );
      case 'Publishing':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 animate-pulse">
            Publishing...
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Failed
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200">
            Not Published
          </span>
        );
    }
  };

  const copyCaption = (caption: string) => {
    navigator.clipboard.writeText(caption);
    addToast('Copied to clipboard', 'Platform caption ready to paste.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-stone-500 font-semibold">
                Central Post Tracker
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500">Where Did I Post This?</span>
            </div>
            <h2 className="text-base font-serif font-bold text-stone-950 mt-1">
              {post.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Matrix */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-700">
            <span className="font-semibold text-stone-900 block mb-0.5">Original Core Content:</span>
            <p className="line-clamp-2 italic text-stone-600">"{post.originalContent}"</p>
          </div>

          <div className="space-y-3">
            {allPlatforms.map((plat) => {
              const platformData = post.platforms[plat];
              const isSelected = post.selectedPlatforms.includes(plat);
              const status: PostStatus = platformData?.status || (isSelected ? (post.overallStatus === 'Archived' ? 'Draft' : post.overallStatus) : 'Not Published');
              const meta = getPlatformMeta(plat);

              return (
                <div
                  key={plat}
                  className={`p-4 rounded-xl border transition-all ${
                    status === 'Published'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : status === 'Scheduled'
                      ? 'border-amber-200 bg-amber-50/20'
                      : isSelected
                      ? 'border-stone-200 bg-white'
                      : 'border-stone-200/60 bg-stone-50/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${meta.bgLight} ${meta.color} border ${meta.border}`}>
                        <PlatformIcon platform={plat} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-stone-900">{meta.name}</h4>
                          {getStatusBadge(status)}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {status === 'Published' && platformData?.publishedAt
                            ? `Published on ${new Date(platformData.publishedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}`
                            : status === 'Scheduled' && (platformData?.scheduledAt || post.scheduledAt)
                            ? `Scheduled for ${new Date(platformData?.scheduledAt || post.scheduledAt!).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}`
                            : isSelected
                            ? 'Selected for this post'
                            : 'Not selected for publishing'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {status === 'Published' && platformData?.platformUrl && (
                        <a
                          href={platformData.platformUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-800 bg-emerald-100/60 hover:bg-emerald-100 transition-colors"
                        >
                          <span>View Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {status !== 'Published' && isSelected && (
                        <button
                          onClick={() => publishPostNow(post.id, [plat])}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
                        >
                          <Send className="w-3 h-3 text-amber-600" />
                          <span>Publish Now</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Caption & Visual snippet if platform was customized */}
                  {platformData?.caption && (
                    <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-start justify-between gap-4">
                      <p className="text-xs text-stone-700 line-clamp-2 flex-1">
                        {platformData.caption}
                      </p>
                      <button
                        onClick={() => copyCaption(platformData.caption)}
                        title="Copy caption"
                        className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {platformData?.errorMessage && (
                    <div className="mt-2 text-[11px] text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
                      Error: {platformData.errorMessage}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-mono text-[11px]">
            Post ID: {post.id} · Created {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
