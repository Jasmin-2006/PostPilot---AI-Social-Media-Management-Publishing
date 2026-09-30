import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Post, SocialPlatform } from '../types';
import { PlatformIcon } from '../components/PlatformIcon';
import { ScheduleModal } from '../components/ScheduleModal';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2,
  Eye,
  Edit3
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { 
    posts, 
    setCurrentView, 
    setDraftToEdit, 
    setTrackingPostId,
    schedulePost 
  } = useApp();

  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026

  // Selected date or post for rescheduling
  const [reschedulingPost, setReschedulingPost] = useState<Post | null>(null);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Days in month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday

  // Get posts for a specific day
  const getPostsForDay = (day: number) => {
    return posts.filter((p) => {
      const targetDateStr = p.scheduledAt || p.publishedAt || p.createdAt;
      if (!targetDateStr) return false;
      const d = new Date(targetDateStr);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day;
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
            Content Calendar
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Plan, reschedule, and visualize your multi-platform publishing cadence.
          </p>
        </div>

        {/* View mode toggle & Quick Create */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-600">
            {(['month', 'week', 'day'] as const).map(v => (
              <button
                key={v}
                onClick={() => setCalendarView(v)}
                className={`px-3 py-1 rounded-md capitalize transition-colors ${
                  calendarView === v ? 'bg-stone-900 text-white font-semibold shadow-sm' : 'hover:text-stone-900'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setDraftToEdit(null);
              setCurrentView('create');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Month Navigator */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-lg font-bold text-stone-900">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <span className="text-xs text-stone-400 font-mono">
            {posts.filter(p => p.overallStatus === 'Scheduled').length} upcoming broadcasts
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date(2026, 9, 1))}
            className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid (Month View) */}
      {calendarView === 'month' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50/70 text-center py-2.5 text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-stone-100">
            {/* Empty offset days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-32 bg-stone-50/40 p-2" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayPosts = getPostsForDay(day);
              const isToday = day === 30; // October 30

              return (
                <div
                  key={day}
                  className={`min-h-32 p-2.5 transition-colors group relative flex flex-col justify-between ${
                    isToday ? 'bg-amber-50/30' : 'hover:bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold font-mono rounded-full w-6 h-6 flex items-center justify-center ${
                      isToday ? 'bg-stone-900 text-amber-400 font-bold' : 'text-stone-700'
                    }`}>
                      {day}
                    </span>

                    <button
                      onClick={() => {
                        const target = new Date(currentYear, currentMonth, day, 10, 0);
                        setDraftToEdit({
                          id: '',
                          userId: '',
                          title: '',
                          originalContent: '',
                          createdAt: '',
                          updatedAt: '',
                          overallStatus: 'Scheduled',
                          scheduledAt: target.toISOString(),
                          selectedPlatforms: ['instagram', 'linkedin', 'twitter'],
                          platforms: {},
                        });
                        setCurrentView('create');
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-stone-900 rounded transition-opacity"
                      title="Add post to this date"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Day's Posts */}
                  <div className="space-y-1.5 flex-1">
                    {dayPosts.map((p) => {
                      const isPublished = p.overallStatus === 'Published';
                      const isScheduled = p.overallStatus === 'Scheduled';

                      return (
                        <div
                          key={p.id}
                          onClick={() => setTrackingPostId(p.id)}
                          className={`p-2 rounded-lg text-[11px] font-medium border cursor-pointer transition-all hover:scale-101 shadow-2xs space-y-1 ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                              : isScheduled
                              ? 'bg-amber-50 text-amber-950 border-amber-200'
                              : 'bg-stone-100 text-stone-800 border-stone-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold truncate max-w-[100px] leading-tight">
                              {p.title}
                            </span>
                            <span className="text-[10px] font-mono opacity-70">
                              {p.scheduledAt ? new Date(p.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 pt-0.5">
                            {p.selectedPlatforms.map(plat => (
                              <PlatformIcon key={plat} platform={plat} className="w-2.5 h-2.5 opacity-80" />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week / Day View Fallback Representation */}
      {calendarView !== 'month' && (
        <div className="p-8 bg-white rounded-2xl border border-stone-200 space-y-4">
          <h3 className="font-serif text-base font-bold text-stone-900">
            {calendarView === 'week' ? 'Week Schedule' : 'Day View Focus'}
          </h3>
          <p className="text-xs text-stone-500">
            Upcoming multi-platform publications scheduled across all networks:
          </p>

          <div className="space-y-3 pt-2">
            {posts.map(p => (
              <div key={p.id} className="p-4 rounded-xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${p.overallStatus === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{p.title}</h4>
                    <p className="text-[11px] text-stone-500">
                      {p.scheduledAt ? `Scheduled for ${new Date(p.scheduledAt).toLocaleString()}` : `Created on ${new Date(p.createdAt).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 mr-3">
                    {p.selectedPlatforms.map(plat => (
                      <PlatformIcon key={plat} platform={plat} className="w-3.5 h-3.5 text-stone-600" />
                    ))}
                  </div>

                  <button
                    onClick={() => setTrackingPostId(p.id)}
                    className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
                  >
                    View Tracker
                  </button>
                  <button
                    onClick={() => setReschedulingPost(p)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingPost && (
        <ScheduleModal
          isOpen={true}
          onClose={() => setReschedulingPost(null)}
          onConfirmSchedule={(iso) => {
            schedulePost(reschedulingPost.id, iso);
            setReschedulingPost(null);
          }}
          postTitle={reschedulingPost.title}
        />
      )}
    </div>
  );
};
