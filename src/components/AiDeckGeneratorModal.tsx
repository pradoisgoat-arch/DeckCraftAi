import React, { useState } from 'react';
import { AiTone, PresentationDeck } from '../types/presentation';
import {
  Wand2,
  X,
  Sparkles,
  Loader2,
  Layers,
  Users,
  MessageSquare,
  FileText,
  Lightbulb,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDeckGenerated: (deckData: { title: string; subtitle: string; author: string; slides: any[] }) => void;
}

const TONES: AiTone[] = [
  'Professional',
  'Tech Startup',
  'Pitch Deck',
  'Educational',
  'Minimalist',
  'Executive',
  'Creative',
];

const QUICK_PROMPTS = [
  {
    topic: 'Series A Investor Pitch Deck for AI Autonomous Agents',
    audience: 'Venture Capital Investors',
    tone: 'Pitch Deck' as AiTone,
    slides: 6,
  },
  {
    topic: 'Q4 Product Roadmap & Feature Strategy',
    audience: 'Engineering & Product Leadership',
    tone: 'Executive' as AiTone,
    slides: 6,
  },
  {
    topic: 'Cybersecurity Zero Trust Architecture & Cloud Defense',
    audience: 'Enterprise CISOs & IT Risk Officers',
    tone: 'Professional' as AiTone,
    slides: 5,
  },
  {
    topic: 'FinTech Cross-Border Payment Protocol & API Infrastructure',
    audience: 'Institutional Partners & Banking Executives',
    tone: 'Tech Startup' as AiTone,
    slides: 6,
  },
  {
    topic: 'AI Precision Diagnostics in Healthcare & Clinical Imaging',
    audience: 'Hospital Board & Medical Directors',
    tone: 'Executive' as AiTone,
    slides: 6,
  },
  {
    topic: 'Go-To-Market Growth Strategy & B2B SaaS Sales Motion',
    audience: 'Marketing & Revenue Operations',
    tone: 'Professional' as AiTone,
    slides: 5,
  },
  {
    topic: 'Introduction to Generative AI & Large Language Models',
    audience: 'University Students & Software Engineers',
    tone: 'Educational' as AiTone,
    slides: 6,
  },
  {
    topic: 'Renewable Solar Tech & Clean Energy Infrastructure',
    audience: 'Impact Investors & ESG Committees',
    tone: 'Minimalist' as AiTone,
    slides: 5,
  },
  {
    topic: 'Commercial Real Estate Syndication & Property Portfolio',
    audience: 'Private Equity & Real Estate Investors',
    tone: 'Executive' as AiTone,
    slides: 6,
  },
  {
    topic: 'Global E-Commerce Omnichannel Growth & Supply Chain',
    audience: 'Retail Operations & Brand Founders',
    tone: 'Creative' as AiTone,
    slides: 5,
  },
];

export const AiDeckGeneratorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onDeckGenerated,
}) => {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(6);
  const [tone, setTone] = useState<AiTone>('Tech Startup');
  const [audience, setAudience] = useState('Investors & Executive Leadership');
  const [sourceNotes, setSourceNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a presentation topic or title');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          slideCount,
          tone,
          audience,
          sourceNotes: sourceNotes.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate presentation deck');
      }

      const data = await res.json();
      onDeckGenerated(data);
      onClose();
    } catch (err: any) {
      console.error('Error generating deck:', err);
      setError(err.message || 'Error communicating with AI service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: typeof QUICK_PROMPTS[0]) => {
    setTopic(prompt.topic);
    setAudience(prompt.audience);
    setTone(prompt.tone);
    setSlideCount(prompt.slides);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900/95 border border-slate-800/80 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shadow-sm">
              <Wand2 size={18} />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-white">Generate Presentation with AI</h3>
              <p className="text-xs text-slate-400">Transform any topic or outline into a complete presentation deck</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs rounded-2xl font-semibold">
              {error}
            </div>
          )}

          {/* Preset Quick Prompts */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
              <Lightbulb size={14} className="text-amber-400" />
              Quick Inspiration Templates
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {QUICK_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(p)}
                  className="p-3 rounded-2xl border border-slate-800/80 bg-slate-950/40 hover:bg-slate-800/80 hover:border-indigo-500/50 text-left text-xs transition-all duration-200 group"
                >
                  <div className="font-bold text-slate-200 group-hover:text-indigo-300 truncate">
                    {p.topic}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    {p.tone} · {p.slides} Slides
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-400" />
              Topic or Presentation Goal <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Next-Gen Autonomous AI Agents for Enterprise SaaS..."
              className="w-full bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 shadow-inner"
            />
          </div>

          {/* Tone & Audience Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <MessageSquare size={14} className="text-cyan-400" />
                Presentation Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as AiTone)}
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 shadow-inner"
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Users size={14} className="text-emerald-400" />
                Target Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Venture Capital Investors, Enterprise CTOs"
                className="w-full bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 shadow-inner"
              />
            </div>
          </div>

          {/* Slide Count Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Layers size={14} className="text-amber-400" />
                Slide Count
              </label>
              <span className="text-xs font-extrabold text-indigo-400 bg-indigo-950/60 border border-indigo-800/80 px-2.5 py-0.5 rounded-full">
                {slideCount} Slides
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={12}
              value={slideCount}
              onChange={(e) => setSlideCount(parseInt(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Source Notes / Raw Outline */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <FileText size={14} className="text-slate-400" />
              Source Notes / Document Outline (Optional)
            </label>
            <textarea
              value={sourceNotes}
              onChange={(e) => setSourceNotes(e.target.value)}
              placeholder="Paste raw notes, bullet points, article text, or specific key takeaways you want included..."
              className="w-full h-24 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none leading-relaxed shadow-inner"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4.5 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4.5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Crafting Presentation...</span>
              </>
            ) : (
              <>
                <Wand2 size={16} />
                <span>Generate {slideCount} Slides</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
