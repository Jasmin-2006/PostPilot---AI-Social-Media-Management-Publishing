import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Post, SocialPlatform, PostStatus } from '../types';
import { PlatformIcon, getPlatformMeta } from '../components/PlatformIcon';
import { ScheduleModal } from '../components/ScheduleModal';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Edit3, 
  Copy, 
  Clock, 
  Send, 
  Archive, 
  Trash2, 
  Plus, 
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';

export const MyPostsView: React.FC = () => {
  const { 
    posts, 
    setCurrentView, 
    setDraftToEdit, 
    duplicatePost, 
    deletePost, 
    archivePost, 
    publishPostNow,
    schedulePost,
    setTrackingPostId 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Schedule modal state
  const [schedulingPostId, setSchedulingPostId] = useState<string | null>(null);

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.originalContent.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlatform = 
      selectedPlatform === 'all' || post.selectedPlatforms.includes(selectedPlatform as SocialPlatform);

    const matchesStatus = 
      selectedStatus === 'all' || post.overallStatus === selectedStatus;

    return matchesSearch && matchesPlatform && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return a.title.localeCompare(b.title);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Published</span>;
      case 'Scheduled':
        return <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Scheduled</span>;
      case 'Draft':
        return <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">Draft</span>;
      case 'Archived':
        return <span className="text-[11px] font-semibold text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full border border-stone-200">Archived</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
            My Posts
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage, duplicate, schedule, and track all your multi-platform creations.
          </p>
        </div>

        <button
          onClick={() => {
            setDraftToEdit(null);
            setCurrentView('create');
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>New Post</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or caption..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 bg-stone-50/50"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-stone-200 bg-white font-medium text-stone-700"
          >
            <option value="all">All Networks</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">X (Twitter)</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
            <option value="threads">Threads</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-stone-200 bg-white font-medium text-stone-700"
          >
            <option value="all">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs py-2 px-3 rounded-lg border border-stone-200 bg-white font-medium text-stone-700"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
          </select>

          {/* Grid / List View Toggle */}
          <div className="flex items-center border border-stone-200 rounded-lg p-0.5 bg-stone-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-700'}`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400 hover:text-stone-700'}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Posts Results */}
      {filteredPosts.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
          <p className="font-serif text-lg text-stone-800">No posts match your filters</p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new multi-platform post.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedPlatform('all');
              setSelectedStatus('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:border-stone-300 transition-all group"
            >
              <div>
                {/* Media Thumbnail */}
                {post.mediaUrl ? (
                  <div className="relative aspect-video bg-stone-100 overflow-hidden border-b border-stone-100">
                    <img
                      src={post.mediaUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(post.overallStatus)}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-stone-400">Text Post</span>
                    {getStatusBadge(post.overallStatus)}
                  </div>
                )}

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <h3 className="font-serif text-base font-bold text-stone-900 line-clamp-1 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {post.originalContent}
                  </p>

                  {/* Platforms strip */}
                  <div className="flex items-center gap-1.5 pt-2">
                    {post.selectedPlatforms.map((plat) => {
                      const platStatus = post.platforms[plat]?.status || post.overallStatus;
                      return (
                        <div
                          key={plat}
                          title={`${plat}: ${platStatus}`}
                          className="p-1.5 rounded-md bg-stone-100 text-stone-700"
                        >
                          <PlatformIcon platform={plat} className="w-3.5 h-3.5" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-stone-400">
                  {new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setTrackingPostId(post.id)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded"
                    title="Central Post Tracking"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setDraftToEdit(post);
                      setCurrentView('create');
                    }}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded"
                    title="Edit in Creator"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => duplicatePost(post.id)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded"
                    title="Duplicate Post"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSchedulingPostId(post.id)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded"
                    title="Schedule Broadcast"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>

                  {post.overallStatus !== 'Published' && (
                    <button
                      onClick={() => publishPostNow(post.id)}
                      className="p-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-100/60 rounded font-semibold"
                      title="Publish Now"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm divide-y divide-stone-100">
          {filteredPosts.map((post) => (
            <div key={post.id} className="p-4 flex items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {post.mediaUrl ? (
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-[10px] text-stone-400 shrink-0">
                    Text
                  </div>
                )}

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-stone-900 text-xs truncate">
                      {post.title}
                    </h4>
                    {getStatusBadge(post.overallStatus)}
                  </div>
                  <p className="text-[11px] text-stone-500 truncate max-w-xl">
                    {post.originalContent}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {post.selectedPlatforms.map(plat => (
                      <PlatformIcon key={plat} platform={plat} className="w-3 h-3 text-stone-500" />
                    ))}
                    <span className="text-[10px] text-stone-400 ml-2 font-mono">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setTrackingPostId(post.id)}
                  className="px-2.5 py-1.5 rounded-lg text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 font-medium"
                >
                  Track
                </button>
                <button
                  onClick={() => {
                    setDraftToEdit(post);
                    setCurrentView('create');
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 font-medium"
                >
                  Edit
                </button>
                {post.overallStatus !== 'Published' && (
                  <button
                    onClick={() => publishPostNow(post.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800"
                  >
                    Publish
                  </button>
                )}
                <button
                  onClick={() => deletePost(post.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal for quick scheduling */}
      {schedulingPostId && (
        <ScheduleModal
          isOpen={true}
          onClose={() => setSchedulingPostId(null)}
          onConfirmSchedule={(iso) => {
            schedulePost(schedulingPostId, iso);
            setSchedulingPostId(null);
          }}
          postTitle={posts.find(p => p.id === schedulingPostId)?.title}
        />
      )}
    </div>
  );
};
