import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSchedule: (isoString: string) => void;
  postTitle?: string;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onConfirmSchedule,
  postTitle,
}) => {
  // Default to tomorrow 10:00 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('10:00');
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!date || !time) return;
    const combined = new Date(`${date}T${time}:00`);
    onConfirmSchedule(combined.toISOString());
    onClose();
  };

  const quickTimes = [
    { label: 'Tomorrow morning', dateOffset: 1, timeVal: '09:00' },
    { label: 'Tomorrow evening', dateOffset: 1, timeVal: '18:30' },
    { label: 'Next Monday 10 AM', dateOffset: ((8 - new Date().getDay()) % 7) || 7, timeVal: '10:00' },
    { label: 'Peak Weekend 12 PM', dateOffset: ((6 - new Date().getDay() + 7) % 7) || 7, timeVal: '12:00' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Schedule Post</h3>
              <p className="text-[11px] text-stone-500">Choose optimal broadcast timing</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {postTitle && (
            <div className="p-3 bg-stone-50 rounded-lg text-xs text-stone-700 border border-stone-200/80">
              <span className="font-semibold text-stone-900 block mb-0.5">Post:</span>
              <p className="truncate font-medium">{postTitle}</p>
            </div>
          )}

          {/* Quick slot selections */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">
              Smart Preset Slots
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {quickTimes.map((qt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const target = new Date();
                    target.setDate(target.getDate() + qt.dateOffset);
                    setDate(target.toISOString().split('T')[0]);
                    setTime(qt.timeVal);
                  }}
                  className="text-left p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-[11px] font-medium text-stone-800 border border-stone-200/60 transition-colors"
                >
                  {qt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Date & Time Inputs */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          <div className="text-[11px] text-stone-500 font-mono flex items-center justify-between pt-1">
            <span>Time Zone:</span>
            <span className="text-stone-700 font-semibold">{timeZone}</span>
          </div>
        </div>

        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-stone-500 hover:text-stone-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            Confirm & Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
