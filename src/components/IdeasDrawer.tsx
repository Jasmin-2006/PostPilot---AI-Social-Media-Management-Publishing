import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IdeaSuggestion, SocialPlatform } from '../types';
import { INITIAL_IDEAS } from '../data/seedData';
import { PlatformIcon } from './PlatformIcon';
import { X, Sparkles, Lightbulb, ArrowRight, RefreshCw } from 'lucide-react';

interface IdeasDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIdea: (idea: IdeaSuggestion) => void;
}

export const IdeasDrawer: React.FC<IdeasDrawerProps> = ({ isOpen, onClose, onSelectIdea }) => {
  const { incrementAIGeneration } = useApp();
  const [ideas, setIdeas] = useState<IdeaSuggestion[]>(INITIAL_IDEAS);
  const [selectedCategory, setSelectedCategory] = useState('AI / Machine Learning');
  const [customNiche, setCustomNiche] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const categories = [
    'AI / Machine Learning',
    'Creative Craft',
    'Productivity & Systems',
    'Career & Growth',
    'Tech Showcase',
    'Behind-The-Scenes',
  ];

  const handleFetchIdeas = async (category = selectedCategory) => {
    setIsLoading(true);
    incrementAIGeneration();
    try {
      const res = await fetch('/api/ai/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, nichePrompt: customNiche }),
      });
      const data = await res.json();
      if (data.ideas && data.ideas.length > 0) {
        setIdeas(data.ideas);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-stone-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-stone-900">
                AI Idea Generator
              </h2>
              <p className="text-[11px] text-stone-500">
                Discover high-engagement hooks and concepts
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills & Niche Input */}
        <div className="p-5 border-b border-stone-200 space-y-3 bg-stone-50/50">
          <div>
            <label className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block mb-2">
              Select Topic or Niche
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    handleFetchIdeas(cat);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customNiche}
              onChange={(e) => setCustomNiche(e.target.value)}
              placeholder="Or enter specific topic (e.g. 'Next.js 15 migration tips')..."
              className="flex-1 text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
            />
            <button
              onClick={() => handleFetchIdeas()}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Generate</span>
            </button>
          </div>
        </div>

        {/* List of Ideas */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3.5 bg-stone-100/40">
          {ideas.map((idea, idx) => (
            <div
              key={idea.id || idx}
              className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-sm hover:border-amber-400/80 transition-all group"
            >
              <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5">
                <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {idea.category || selectedCategory}
                </span>
                <span className="font-mono text-stone-400">
                  {idea.suggestedFormat || 'Multi-platform'}
                </span>
              </div>

              <h4 className="text-xs font-bold text-stone-950 mb-1 leading-snug">
                {idea.title}
              </h4>

              <p className="text-xs text-stone-600 mb-3 italic">
                "{idea.hook}"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <div className="flex items-center gap-1 text-stone-400">
                  <span className="text-[10px] mr-1">Best for:</span>
                  {(idea.targetPlatforms || ['linkedin', 'twitter']).map((plat) => (
                    <PlatformIcon key={plat} platform={plat as SocialPlatform} className="w-3.5 h-3.5" />
                  ))}
                </div>

                <button
                  onClick={() => {
                    onSelectIdea(idea);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
                >
                  <span>Use This Idea</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
