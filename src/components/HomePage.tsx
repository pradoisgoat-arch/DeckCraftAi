import React, { useState } from 'react';
import { PresentationDeck, ThemeConfig, AiTone } from '../types/presentation';
import { SAMPLE_DECKS } from '../constants/templates';
import { THEMES, HEADING_FONTS, ACCENT_COLOR_PALETTES } from '../constants/themes';
import {
  Sparkles,
  Wand2,
  Plus,
  Play,
  FolderOpen,
  ArrowRight,
  Clock,
  Layers,
  Palette,
  Type,
  Trash2,
  Copy,
  ChevronRight,
  Monitor,
  CheckCircle2,
  Sliders,
  ExternalLink,
} from 'lucide-react';

interface Props {
  activeDeck: PresentationDeck;
  recentDecks: PresentationDeck[];
  onOpenDeck: (deck: PresentationDeck) => void;
  onOpenStudio: () => void;
  onNewEmptyDeck: () => void;
  onOpenAiGenerator: (initialTopic?: string) => void;
  onOpenTemplates: () => void;
  onDeleteDeck: (id: string) => void;
  onDuplicateDeck: (deck: PresentationDeck) => void;
  onQuickGenerate: (topic: string, slideCount: number, tone: AiTone) => Promise<void>;
}

export const HomePage: React.FC<Props> = ({
  activeDeck,
  recentDecks,
  onOpenDeck,
  onOpenStudio,
  onNewEmptyDeck,
  onOpenAiGenerator,
  onOpenTemplates,
  onDeleteDeck,
  onDuplicateDeck,
  onQuickGenerate,
}) => {
  const [quickTopic, setQuickTopic] = useState('');
  const [slideCount, setSlideCount] = useState(6);
  const [selectedTone, setSelectedTone] = useState<AiTone>('Tech Startup');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'startup' | 'business' | 'tech'>('all');

  const handleStartQuickGen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTopic.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      await onQuickGenerate(quickTopic.trim(), slideCount, selectedTone);
    } catch (err) {
      console.error('Quick generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const samplePromptChips = [
    'Series A Pitch Deck for an AI Code Review tool',
    'Quarterly Business Review & Financial Outlook',
    'Product Launch Strategy for Mobile Fitness App',
    'Clean Energy Transition & ESG Impact Report',
    'Next-Gen Cloud Microservices Architecture',
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white pb-20">
      {/* Hero Banner Section */}
      <section className="relative px-6 lg:px-12 pt-12 pb-16 overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950">
        {/* Glow ambient background lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-6 shadow-sm">
            <Sparkles size={14} className="text-indigo-400 animate-pulse" />
            <span>AI-Powered Executive Deck & Slide Creator</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-tight font-display">
            Design presentations that <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">captivate & close</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
            Generate full decks from any prompt, customize with 10+ Google Fonts, rich vibrant color palettes, diagrams, and export to PowerPoint & PDF.
          </p>

          {/* Quick AI Deck Prompt Bar */}
          <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-700/80 rounded-3xl p-3 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleStartQuickGen} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={quickTopic}
                onChange={(e) => setQuickTopic(e.target.value)}
                placeholder="What presentation do you want to create? (e.g. Seed pitch for an AI drone startup)"
                className="flex-1 bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
              />
              <button
                type="submit"
                disabled={!quickTopic.trim() || isGenerating}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
              >
                <Wand2 size={16} />
                <span>{isGenerating ? 'Generating...' : 'Generate with AI'}</span>
              </button>
            </form>

            {/* Quick Prompt Options / Parameters */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-800/80 px-2 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>Slides:</span>
                  <select
                    value={slideCount}
                    onChange={(e) => setSlideCount(Number(e.target.value))}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none"
                  >
                    <option value={4}>4 Slides</option>
                    <option value={6}>6 Slides</option>
                    <option value={8}>8 Slides</option>
                    <option value={10}>10 Slides</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>Tone:</span>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value as AiTone)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="Tech Startup">Tech Startup</option>
                    <option value="Pitch Deck">Pitch Deck</option>
                    <option value="Professional">Executive / Corp</option>
                    <option value="Creative">Creative & Bold</option>
                    <option value="Educational">Educational</option>
                  </select>
                </div>
              </div>

              {activeDeck && (
                <button
                  onClick={onOpenStudio}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                >
                  <span>Resume Current Deck ({activeDeck.title})</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Prompt Suggestion Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-3xl mx-auto">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">Suggestions:</span>
            {samplePromptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setQuickTopic(chip)}
                className="text-[11px] px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Workspace Hub */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 mt-10 space-y-12">
        {/* Quick Launch Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onOpenAiGenerator()}
            className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 text-left transition-all duration-300 group hover:-translate-y-1 shadow-lg"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Wand2 size={20} />
            </div>
            <h3 className="font-bold text-white text-sm mb-1 group-hover:text-indigo-300 transition-colors">
              AI Deck Generator
            </h3>
            <p className="text-xs text-slate-400">
              Generate full multi-slide presentations from a topic or speaker notes.
            </p>
          </button>

          <button
            onClick={onNewEmptyDeck}
            className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 text-left transition-all duration-300 group hover:-translate-y-1 shadow-md"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus size={20} />
            </div>
            <h3 className="font-bold text-white text-sm mb-1 group-hover:text-emerald-300 transition-colors">
              Start from Scratch
            </h3>
            <p className="text-xs text-slate-400">
              Create a fresh, empty deck with your preferred aspect ratio and theme.
            </p>
          </button>

          <button
            onClick={onOpenTemplates}
            className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 text-left transition-all duration-300 group hover:-translate-y-1 shadow-md"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FolderOpen size={20} />
            </div>
            <h3 className="font-bold text-white text-sm mb-1 group-hover:text-cyan-300 transition-colors">
              Sample Deck Library
            </h3>
            <p className="text-xs text-slate-400">
              Browse pre-built executive decks for Startups, SaaS, AI, and Strategy.
            </p>
          </button>

          <button
            onClick={onOpenStudio}
            className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 text-left transition-all duration-300 group hover:-translate-y-1 shadow-md"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Monitor size={20} />
            </div>
            <h3 className="font-bold text-white text-sm mb-1 group-hover:text-amber-300 transition-colors">
              Deck Editor Studio
            </h3>
            <p className="text-xs text-slate-400">
              Jump straight into the canvas to edit slides, inspect layouts, and present.
            </p>
          </button>
        </section>

        {/* Recent & Saved Presentations */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock size={18} className="text-indigo-400" />
                <span>Recent Presentations</span>
              </h2>
              <p className="text-xs text-slate-400">Continue editing your decks or start from existing drafts</p>
            </div>

            <button
              onClick={onNewEmptyDeck}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>+ New Blank</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentDecks.map((d) => {
              const isCurrent = d.id === activeDeck?.id;
              return (
                <div
                  key={d.id}
                  className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between group ${
                    isCurrent
                      ? 'bg-slate-900/90 border-indigo-500/60 ring-1 ring-indigo-500/30 shadow-lg'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                        {d.slides.length} slides • {d.aspectRatio}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-sm"
                          style={{ backgroundColor: d.theme.bgHex }}
                          title={`Theme: ${d.theme.name}`}
                        />
                        <div
                          className="w-3.5 h-3.5 rounded-full shadow-sm"
                          style={{ backgroundColor: d.theme.accentHex }}
                        />
                      </div>
                    </div>

                    <h3 className="font-bold text-white text-sm mb-1.5 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                      {d.title || 'Untitled Presentation'}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {d.subtitle || d.slides[0]?.subtitle || 'No subtitle provided'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">
                      {new Date(d.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onDuplicateDeck(d)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
                        title="Duplicate deck"
                      >
                        <Copy size={13} />
                      </button>

                      {recentDecks.length > 1 && (
                        <button
                          onClick={() => onDeleteDeck(d.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/60 transition-colors"
                          title="Delete deck"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}

                      <button
                        onClick={() => onOpenDeck(d)}
                        className="flex items-center gap-1 font-bold text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded-lg hover:bg-indigo-600/10 transition-colors"
                      >
                        <span>Open</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Curated Sample Decks Showcase */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers size={18} className="text-cyan-400" />
                <span>Curated Deck Templates</span>
              </h2>
              <p className="text-xs text-slate-400">Pre-built executive presentations ready to customize</p>
            </div>

            <button
              onClick={onOpenTemplates}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All Templates</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_DECKS.slice(0, 4).map((sample) => (
              <div
                key={sample.id}
                onClick={() => onOpenDeck(sample)}
                className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                      {sample.slides.length} slides
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${sample.theme.accentHex}20`,
                        color: sample.theme.accentHex,
                      }}
                    >
                      {sample.theme.name}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm mb-1.5 group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {sample.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {sample.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-400 font-bold transition-colors">
                  <span>Use Template</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Design System & Customization Highlights */}
        <section className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Palette size={18} className="text-pink-400" />
                <span>Rich Themes & Typography System</span>
              </h2>
              <p className="text-xs text-slate-400">10+ Google Fonts & 12+ Professional Color Themes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fonts Showcase */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                <Type size={14} />
                Featured Fonts Included
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {HEADING_FONTS.slice(0, 8).map((f) => (
                  <div key={f.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className={`font-bold text-white text-sm mb-0.5 ${f.className}`}>{f.name}</div>
                    <div className="text-[10px] text-slate-400">{f.previewText}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Themes Palette Showcase */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                <Palette size={14} />
                Featured Color Themes
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {THEMES.slice(0, 8).map((t) => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">{t.name}</div>
                      <div className="text-[10px] text-slate-500">{t.category || 'Theme'}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: t.bgHex }} />
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.accentHex }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
