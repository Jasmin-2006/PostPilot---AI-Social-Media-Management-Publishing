import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, Bot, User as UserIcon, RefreshCw, ArrowRight, CornerDownLeft } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiAssistantView: React.FC = () => {
  const { currentUser, posts, incrementAIGeneration, setCurrentView, setDraftToEdit } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${currentUser.name.split(' ')[0]}! I'm your PostPilot Editorial Assistant.

I can help you:
• Turn any idea or project into multi-channel campaigns
• Craft viral LinkedIn hooks or punchy Threads/X posts
• Audit which networks your recent posts haven't reached yet
• Refine captions for specific tones and audience segments

What would you like to brainstorm or adapt today?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const samplePrompts = [
    "Give me 5 LinkedIn post ideas about machine learning and productivity.",
    "Which platforms have I not posted my recent travel planner on?",
    "Turn my project launch into an engaging Instagram caption with emojis.",
    "Give me a high-CTR YouTube video title and full description for a desk tour.",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    incrementAIGeneration();

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          userPostsContext: posts,
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Here is an editorial perspective on your prompt...',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e: any) {
      console.error(e);
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: `I recommend crafting a 3-part narrative framework:
1. The Hook: What surprising insight did you uncover?
2. The Friction: What obstacle did you overcome?
3. The Solution: Clear actionable takeaway and discussion question for your audience.`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>AI Editorial Assistant</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Context-aware social strategist connected to your post library and brand voice.
          </p>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 font-serif font-bold text-sm shadow-sm mt-0.5">
                  P
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-stone-900 text-white rounded-tr-xs shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-900 rounded-tl-xs shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{m.content}</div>

                <div className={`mt-2 text-[10px] font-mono opacity-60 text-right ${isUser ? 'text-stone-300' : 'text-stone-400'}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {isUser && (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-stone-300 shrink-0 mt-0.5"
                />
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 font-serif font-bold text-sm shadow-sm">
              P
            </div>
            <div className="bg-white border border-stone-200 px-4 py-3 rounded-2xl rounded-tl-xs shadow-sm flex items-center gap-2 text-xs text-stone-500">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>Analyzing post history and formulating strategy...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts & Chat Input Form */}
      <div className="shrink-0 space-y-3 pt-2">
        {messages.length < 3 && (
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="text-left p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-[11px] text-stone-700 transition-colors border border-stone-200/80"
              >
                "{p}"
              </button>
            ))}
          </div>
        )}

        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask AI anything (e.g. 'Turn this into an Instagram caption', 'What should I post today?')..."
            rows={2}
            className="w-full text-xs p-3.5 pr-24 rounded-2xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 shadow-sm resize-none bg-white font-sans"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            className="absolute right-3.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition-all"
          >
            <span>Ask</span>
            <Send className="w-3 h-3 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
