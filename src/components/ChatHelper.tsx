import React, { useState, useRef, useEffect } from 'react';
import { Slide, PresentationDeck, ChatMessage, ThemeConfig } from '../types/presentation';
import { THEMES } from '../constants/themes';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Wand2,
  Check,
  ChevronDown,
  Layers,
  Lightbulb,
  Palette,
  FileText,
  PlusCircle,
  Loader2,
  ArrowRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: Slide;
  deck: PresentationDeck;
  onUpdateSlide: (updatedSlide: Slide) => void;
  onAddSlide: (slide: Slide) => void;
  onChangeTheme: (theme: ThemeConfig) => void;
}

const PRESET_PROMPTS = [
  { label: '⚡ Make slide punchier', prompt: 'Rewrite this slide copy to be sharper, more punchy and executive.' },
  { label: '📊 Add 3 metric callouts', prompt: 'Convert or add 3 compelling metric statistics for this slide.' },
  { label: '📝 Write speaker notes', prompt: 'Write 3 persuasive, natural speaker notes for presenting this slide.' },
  { label: '🎨 Recommend best theme', prompt: 'What theme and color palette would best fit this slide deck and why?' },
  { label: '➕ Add competitive slide', prompt: 'Add a new slide comparing our solution against traditional alternatives.' },
  { label: '💡 Suggest layout tweak', prompt: 'Analyze this slide content and recommend the best visual layout.' },
];

export const ChatHelper: React.FC<Props> = ({
  isOpen,
  onClose,
  currentSlide,
  deck,
  onUpdateSlide,
  onAddSlide,
  onChangeTheme,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello! I'm your DeckCraft Copilot. I can edit this slide, rewrite copy, add metrics, adjust layout, or generate new slides for you. Try clicking a shortcut below or ask me anything!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          currentSlide,
          deckTitle: deck.title,
          deckSlidesCount: deck.slides.length,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat assistant request failed');
      }

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: data.actionType,
        actionLabel: data.actionLabel,
        payload: data.payload,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.warn('Backend chat assistant error, using local fallback:', err);
      // Fallback local intelligent generator
      const fallbackAiMsg = handleLocalFallback(text);
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalFallback = (query: string): ChatMessage => {
    const q = query.toLowerCase();

    if (q.includes('punchy') || q.includes('rewrite') || q.includes('sharp')) {
      const refinedBullets = (currentSlide.content.bullets || ['Key breakthrough concept', 'Unrivaled time to market', 'Proven efficiency gains']).map(
        (b) => `🚀 ${b.replace(/^[•\-\s]+/, '')} with verified ROI`
      );
      return {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: `I tightened the phrasing and strengthened the value proposition for "${currentSlide.title}". You can apply these high-impact bullets directly to the slide.`,
        timestamp: 'Just now',
        actionType: 'update_bullets',
        actionLabel: 'Apply Punchy Bullets',
        payload: { bullets: refinedBullets },
      };
    }

    if (q.includes('metric') || q.includes('stat') || q.includes('data')) {
      return {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: `Here are 3 compelling metric callouts tailored for this slide to provide instant credibility and authority.`,
        timestamp: 'Just now',
        actionType: 'add_metrics',
        actionLabel: 'Convert to Metrics Spotlight',
        payload: {
          metrics: [
            { id: 'm-1', value: '10x', label: 'Faster Execution', change: '+900%' },
            { id: 'm-2', value: '99.4%', label: 'Accuracy & Uptime', change: 'Tier 1' },
            { id: 'm-3', value: '$4.8M', label: 'Annual Value Delivered', change: 'ARR' },
          ],
        },
      };
    }

    if (q.includes('notes') || q.includes('speaker')) {
      const notes = `Good morning everyone. On this slide, focus on our core differentiation. Emphasize that our solution cuts complexity by over 70%, giving the team immediate runway and operational clarity. Pause here for any initial questions before we dive into the metrics.`;
      return {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: `I've prepared executive speaker notes with pacing and delivery cues.`,
        timestamp: 'Just now',
        actionType: 'update_notes',
        actionLabel: 'Save to Speaker Notes',
        payload: { speakerNotes: notes },
      };
    }

    if (q.includes('theme') || q.includes('palette') || q.includes('color')) {
      const suggested = THEMES.find((t) => t.id === 'midnight-gold' || t.id === 'velvet-plum') || THEMES[1];
      return {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: `For a sophisticated executive aesthetic, I recommend switching to "${suggested.name}". It offers high-contrast readability with rich accent highlights.`,
        timestamp: 'Just now',
        actionType: 'change_theme',
        actionLabel: `Apply ${suggested.name} Theme`,
        payload: { themeId: suggested.id },
      };
    }

    if (q.includes('slide') || q.includes('competitive') || q.includes('add')) {
      return {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: `I designed a new 2-column comparative analysis slide showing your advantages vs. legacy market alternatives.`,
        timestamp: 'Just now',
        actionType: 'add_slide',
        actionLabel: 'Insert Comparison Slide',
        payload: {
          title: 'Competitive Differentiation',
          subtitle: 'Why our approach outperforms traditional alternatives',
          layout: 'split-2-col',
          speakerNotes: 'Walk through each column clearly, drawing attention to our speed and cost advantages.',
          columns: [
            { id: 'col-1', title: 'Traditional Workflows', tag: 'Legacy', items: ['Manual 2-4 day turnaround', 'High error frequency', 'Siloed tools'] },
            { id: 'col-2', title: 'Our Automated Engine', tag: 'DeckCraft', items: ['Instant sub-second generation', '100% style consistency', 'End-to-end cloud pipeline'] },
          ],
        },
      };
    }

    return {
      id: `msg-ai-${Date.now()}`,
      sender: 'ai',
      text: `Got it! For "${currentSlide.title}", I recommend keeping text concise (under 25 words per bullet), using high-contrast typography, and backing up every claim with a clear statistic or diagram. Would you like me to rewrite the text or add metrics?`,
      timestamp: 'Just now',
    };
  };

  const handleApplyAction = (msg: ChatMessage) => {
    if (!msg.payload) return;

    if (msg.actionType === 'update_bullets' && msg.payload.bullets) {
      onUpdateSlide({
        ...currentSlide,
        content: {
          ...currentSlide.content,
          bullets: msg.payload.bullets,
        },
      });
    } else if (msg.actionType === 'add_metrics' && msg.payload.metrics) {
      onUpdateSlide({
        ...currentSlide,
        layout: 'metrics-spotlight',
        content: {
          ...currentSlide.content,
          metrics: msg.payload.metrics,
        },
      });
    } else if (msg.actionType === 'update_notes' && msg.payload.speakerNotes) {
      onUpdateSlide({
        ...currentSlide,
        speakerNotes: msg.payload.speakerNotes,
      });
    } else if (msg.actionType === 'change_theme' && msg.payload.themeId) {
      const found = THEMES.find((t) => t.id === msg.payload.themeId);
      if (found) onChangeTheme(found);
    } else if (msg.actionType === 'add_slide') {
      const newSlide: Slide = {
        id: `slide-${Date.now()}`,
        title: msg.payload.title || 'New Slide',
        subtitle: msg.payload.subtitle || '',
        layout: msg.payload.layout || 'title-body',
        speakerNotes: msg.payload.speakerNotes || 'Speaker notes.',
        content: {
          headline: msg.payload.title,
          subhead: msg.payload.subtitle,
          bullets: msg.payload.bullets || [],
          columns: msg.payload.columns || [],
          metrics: msg.payload.metrics || [],
        },
      };
      onAddSlide(newSlide);
    } else if (msg.actionType === 'suggest_layout' && msg.payload.layout) {
      onUpdateSlide({
        ...currentSlide,
        layout: msg.payload.layout,
      });
    }

    // Mark action applied in message
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, actionApplied: true } : m))
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col border border-slate-700/80 bg-slate-900/95 backdrop-blur-2xl text-slate-100 ${
        isExpanded
          ? 'right-6 bottom-6 w-[560px] h-[720px] max-h-[90vh] max-w-[95vw] rounded-3xl'
          : 'right-6 bottom-6 w-[400px] h-[580px] max-h-[85vh] max-w-[95vw] rounded-2xl'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <span>DeckCraft Copilot</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                AI Helper
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
              Editing: {currentSlide.title || 'Untitled Slide'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            title="Close Assistant"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white font-medium rounded-br-none'
                  : 'bg-slate-800/90 border border-slate-700/60 text-slate-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Action Button if attached */}
              {msg.actionType && msg.payload && (
                <div className="mt-3 pt-2.5 border-t border-slate-700/80">
                  {msg.actionApplied ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/60">
                      <Check size={13} />
                      <span>Applied to presentation</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApplyAction(msg)}
                      className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 px-3.5 py-1.5 rounded-full shadow-md transition-all duration-200"
                    >
                      <Wand2 size={13} />
                      <span>{msg.actionLabel || 'Apply Changes'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-slate-800/70 rounded-2xl border border-slate-700/60 text-xs text-indigo-300 w-fit">
            <Loader2 size={14} className="animate-spin text-indigo-400" />
            <span>DeckCraft AI is crafting advice...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="p-2.5 bg-slate-950/70 border-t border-slate-800/80 overflow-x-auto">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Lightbulb size={11} className="text-amber-400" />
          Quick Actions
        </div>
        <div className="flex gap-1.5 flex-nowrap overflow-x-auto pb-1">
          {PRESET_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.prompt)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center gap-2 rounded-b-2xl"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask AI Copilot to rewrite, design, or add slides..."
          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 shadow-inner"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center transition-all duration-200 shrink-0"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
