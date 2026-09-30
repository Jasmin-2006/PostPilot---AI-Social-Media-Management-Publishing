import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, Sparkles, X, Volume2, ArrowRight, CornerDownLeft, Play } from 'lucide-react';

interface VoiceModalProps {
  onApplyVoiceDraft?: (data: {
    title: string;
    content: string;
    platforms?: string[];
    actionType?: string;
  }) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ onApplyVoiceDraft }) => {
  const { 
    isVoiceModalOpen, 
    setIsVoiceModalOpen, 
    setCurrentView, 
    incrementVoiceInteraction, 
    incrementAIGeneration,
    addToast 
  } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [aiInterpretation, setAiInterpretation] = useState<any>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  const sampleVoicePrompts = [
    "I want to create a post about our new AI travel planner project.",
    "Make this announcement sound more professional and authoritative.",
    "Shorten the Instagram caption and add 5 trending design hashtags.",
    "Create a LinkedIn post breaking down 3 lessons from our product launch."
  ];

  useEffect(() => {
    // Check for browser speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast('Microphone not supported in this browser', 'You can type your voice idea or select a prompt below.', 'info');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setTranscript('');
        setAiInterpretation(null);
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleProcessVoice = async (textToProcess?: string) => {
    const text = textToProcess || transcript;
    if (!text.trim()) {
      addToast('No voice input detected', 'Speak an idea or pick a preset prompt.', 'error');
      return;
    }

    stopListening();
    setIsProcessing(true);
    incrementVoiceInteraction();

    try {
      const res = await fetch('/api/ai/voice-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voiceTranscript: text }),
      });
      const data = await res.json();
      incrementAIGeneration();
      setAiInterpretation(data);
    } catch (err: any) {
      console.error(err);
      setAiInterpretation({
        actionType: 'create_post',
        interpretedIdea: text,
        suggestedTitle: text.slice(0, 36) + '...',
        suggestedContent: text,
        responseMessage: 'Captured idea ready for multi-platform adaptation!'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseResult = () => {
    if (!aiInterpretation) return;
    if (onApplyVoiceDraft) {
      onApplyVoiceDraft({
        title: aiInterpretation.suggestedTitle || 'Voice Idea',
        content: aiInterpretation.suggestedContent || transcript,
        platforms: ['instagram', 'linkedin', 'twitter'],
        actionType: aiInterpretation.actionType,
      });
    }
    setIsVoiceModalOpen(false);
    setCurrentView('create');
    addToast('Idea Loaded into Creator', 'Review and adapt for each platform.', 'success');
  };

  if (!isVoiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-stone-900">
                Speak Your Idea
              </h2>
              <p className="text-[11px] text-stone-500">
                Voice input with instant AI social adaptation
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopListening();
              setIsVoiceModalOpen(false);
            }}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {/* Visual Wave / Recording Controller */}
          <div className="flex flex-col items-center justify-center py-6 px-4 bg-stone-50/80 rounded-xl border border-stone-200/80">
            <div className="relative mb-4">
              {isRecording && (
                <div className="absolute -inset-3 rounded-full bg-amber-500/20 animate-ping" />
              )}
              <button
                onClick={toggleRecording}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md ${
                  isRecording
                    ? 'bg-rose-600 text-white scale-105'
                    : 'bg-stone-900 text-amber-400 hover:bg-stone-800 hover:scale-105'
                }`}
              >
                {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs font-semibold text-stone-900">
                {isRecording ? 'Listening to your voice...' : 'Press microphone to begin speaking'}
              </p>
              {isRecording && (
                <div className="flex items-center justify-center gap-2 text-rose-600 font-mono text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                  <span>00:{recordingSeconds.toString().padStart(2, '0')}</span>
                </div>
              )}
            </div>

            {/* Audio Wave Visualizer Simulation */}
            {isRecording && (
              <div className="flex items-center gap-1 mt-4 h-6">
                {[40, 70, 95, 60, 85, 45, 90, 75, 50, 80, 65, 90, 45].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-amber-500 rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDuration: `${0.3 + (i % 5) * 0.15}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Real-time Transcription Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span className="font-medium">Live Transcript / Spoken Text</span>
              <span className="text-[11px] text-stone-400">
                {transcript.length} characters
              </span>
            </div>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="e.g. 'I want to create a post about our new AI travel planner project' or 'Make this Instagram caption more engaging'..."
              rows={3}
              className="w-full text-xs p-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 resize-none font-sans"
            />
          </div>

          {/* Quick preset suggestions */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-stone-500 block">
              Or try a sample voice command:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {sampleVoicePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(p);
                    handleProcessVoice(p);
                  }}
                  className="text-left p-2 rounded-md bg-stone-100 hover:bg-stone-200 text-[11px] text-stone-700 transition-colors line-clamp-1 border border-stone-200/60"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>

          {/* AI Interpretation Result Box if available */}
          {aiInterpretation && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>AI Interpretation: {aiInterpretation.actionType === 'create_post' ? 'New Post Draft' : 'Refinement Command'}</span>
              </div>
              <p className="text-stone-700 font-medium">
                {aiInterpretation.responseMessage}
              </p>
              {aiInterpretation.suggestedTitle && (
                <div className="text-[11px] text-stone-600">
                  <span className="font-semibold text-stone-800">Title: </span>
                  {aiInterpretation.suggestedTitle}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              setTranscript('');
              setAiInterpretation(null);
            }}
            className="text-xs text-stone-500 hover:text-stone-800"
          >
            Clear
          </button>

          <div className="flex items-center gap-2">
            {!aiInterpretation ? (
              <button
                onClick={() => handleProcessVoice()}
                disabled={isProcessing || !transcript.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold disabled:opacity-50 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isProcessing ? 'Interpreting Voice...' : 'Process with AI'}</span>
              </button>
            ) : (
              <button
                onClick={handleUseResult}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all shadow-sm"
              >
                <span>Use This in Creator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
