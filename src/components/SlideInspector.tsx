import React, { useState } from 'react';
import { Slide, SlideLayoutType, ThemeConfig } from '../types/presentation';
import {
  THEMES,
  HEADING_FONTS,
  BODY_FONTS,
  ACCENT_COLOR_PALETTES,
  CANVAS_BG_PALETTES,
} from '../constants/themes';
import {
  Palette,
  Layout,
  MessageSquare,
  Sparkles,
  Wand2,
  Loader2,
  Monitor,
  Check,
  Zap,
  Type,
  Maximize2,
  Sliders,
  RotateCcw,
  Sparkle,
  Layers,
  Bot,
} from 'lucide-react';

interface Props {
  slide: Slide;
  theme: ThemeConfig;
  aspectRatio: '16:9' | '4:3';
  onUpdateSlide: (updatedSlide: Slide) => void;
  onChangeTheme: (theme: ThemeConfig) => void;
  onChangeAspectRatio: (ratio: '16:9' | '4:3') => void;
  onAiTransform: (action: string, text: string, context?: string) => Promise<string>;
  onOpenChatHelper?: () => void;
}

const LAYOUT_OPTIONS: { type: SlideLayoutType; name: string; category: string }[] = [
  { type: 'title-slide', name: 'Title Slide', category: 'Standard' },
  { type: 'title-body', name: 'Title + Content', category: 'Standard' },
  { type: 'split-2-col', name: '2 Columns', category: 'Structure' },
  { type: 'grid-3-cards', name: '3 Cards Grid', category: 'Structure' },
  { type: 'grid-4-cards', name: '4 Cards Grid', category: 'Structure' },
  { type: 'metrics-spotlight', name: 'Metrics 3-Up', category: 'Data' },
  { type: 'metrics-grid-4', name: 'Metrics 4-Up', category: 'Data' },
  { type: 'comparison', name: 'Comparison / VS', category: 'Structure' },
  { type: 'timeline', name: 'Timeline / Roadmap', category: 'Flow' },
  { type: 'diagram', name: 'Pipeline Diagram', category: 'Flow' },
  { type: 'team-bio', name: 'Team / Speakers', category: 'Media' },
  { type: 'pricing-table', name: 'Pricing Tiers', category: 'Commercial' },
  { type: 'faq-accordion', name: 'FAQ / Q&A', category: 'Structure' },
  { type: 'code-snippet', name: 'Code Snippet', category: 'Tech' },
  { type: 'quadrant-matrix', name: 'Quadrant Matrix', category: 'Data' },
  { type: 'quote', name: 'Quote / Feature', category: 'Media' },
  { type: 'callout-hero', name: 'Hero Callout', category: 'Standard' },
  { type: 'conclusion', name: 'Conclusion CTA', category: 'Standard' },
];

export const SlideInspector: React.FC<Props> = ({
  slide,
  theme,
  aspectRatio,
  onUpdateSlide,
  onChangeTheme,
  onChangeAspectRatio,
  onAiTransform,
  onOpenChatHelper,
}) => {
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [activeTab, setActiveTab] = useState<'design' | 'typography' | 'notes' | 'ai'>('design');

  const handleGenerateSpeakerNotes = async () => {
    setIsGeneratingNotes(true);
    try {
      const notes = await onAiTransform(
        'speaker_notes',
        `Slide Title: ${slide.title}\nSlide Layout: ${slide.layout}\nContent: ${JSON.stringify(slide.content)}`
      );
      onUpdateSlide({ ...slide, speakerNotes: notes });
    } catch (e) {
      console.error('Failed to generate speaker notes:', e);
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  const handleResetSlideColors = () => {
    onUpdateSlide({
      ...slide,
      bgOverrideHex: undefined,
      accentOverrideHex: undefined,
    });
  };

  return (
    <aside className="w-80 bg-slate-950/80 backdrop-blur-md border-l border-slate-800/60 flex flex-col h-full shrink-0 select-none">
      {/* Inspector Tabs Header */}
      <div className="flex items-center border-b border-slate-800/60 bg-slate-900/40 p-1.5 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-full flex items-center justify-center gap-1 transition-all duration-200 whitespace-nowrap ${
            activeTab === 'design'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette size={13} />
          <span>Style</span>
        </button>

        <button
          onClick={() => setActiveTab('typography')}
          className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-full flex items-center justify-center gap-1 transition-all duration-200 whitespace-nowrap ${
            activeTab === 'typography'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Type size={13} />
          <span>Fonts</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-full flex items-center justify-center gap-1 transition-all duration-200 whitespace-nowrap ${
            activeTab === 'notes'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare size={13} />
          <span>Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-full flex items-center justify-center gap-1 transition-all duration-200 whitespace-nowrap ${
            activeTab === 'ai'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles size={13} />
          <span>AI Assist</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* DESIGN TAB */}
        {activeTab === 'design' && (
          <>
            {/* Slide Layout Selector */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layout size={14} className="text-indigo-400" />
                  Slide Layout ({LAYOUT_OPTIONS.length})
                </label>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-indigo-400 border border-slate-800">
                  {slide.layout}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-1 bg-slate-900/40 rounded-2xl border border-slate-800/60">
                {LAYOUT_OPTIONS.map((opt) => {
                  const isSelected = slide.layout === opt.type;
                  return (
                    <button
                      key={opt.type}
                      onClick={() => onUpdateSlide({ ...slide, layout: opt.type })}
                      className={`p-2 rounded-xl border text-left text-xs font-semibold transition-all duration-150 truncate ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-600/25 text-white shadow-sm'
                          : 'border-slate-800/80 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="truncate">{opt.name}</div>
                      <div className="text-[9px] text-slate-500">{opt.category}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Deck Theme Selector */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                <Palette size={14} className="text-cyan-400" />
                Color Theme Preset ({THEMES.length})
              </label>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {THEMES.map((t) => {
                  const isSelected = theme.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => onChangeTheme(t)}
                      className={`w-full p-2.5 rounded-2xl border flex items-center justify-between transition-all duration-150 ${
                        isSelected
                          ? 'border-indigo-500 bg-slate-900 shadow-md ring-1 ring-indigo-500/40'
                          : 'border-slate-800/80 bg-slate-900/30 hover:border-slate-700/80 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-5 h-5 rounded-full border shadow-sm flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: t.bgHex,
                            borderColor: t.cardBorderHex,
                          }}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.accentHex }} />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-bold text-slate-200 block leading-tight">{t.name}</span>
                          <span className="text-[9px] text-slate-500">{t.category || 'Theme'}</span>
                        </div>
                      </div>

                      {isSelected && <Check size={14} className="text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Slide Colors Override */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette size={14} className="text-rose-400" />
                  Custom Slide Overrides
                </label>
                {(slide.bgOverrideHex || slide.accentOverrideHex) && (
                  <button
                    onClick={handleResetSlideColors}
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                    title="Reset to theme defaults"
                  >
                    <RotateCcw size={10} />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Background Swatches & Picker */}
              <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl mb-2.5">
                <span className="text-[10px] font-bold text-slate-400 block mb-1.5">Slide Canvas Background</span>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="color"
                    value={slide.bgOverrideHex || theme.bgHex}
                    onChange={(e) => onUpdateSlide({ ...slide, bgOverrideHex: e.target.value })}
                    className="w-10 h-8 rounded-xl cursor-pointer bg-transparent border-none shrink-0"
                  />
                  <span className="text-xs font-mono text-slate-300">
                    {slide.bgOverrideHex || theme.bgHex}
                  </span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {CANVAS_BG_PALETTES.slice(0, 7).map((swatch, idx) => (
                    <button
                      key={idx}
                      onClick={() => onUpdateSlide({ ...slide, bgOverrideHex: swatch.hex })}
                      className="w-5 h-5 rounded-full border border-slate-700 hover:scale-110 transition-transform shadow-sm"
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.name}
                    />
                  ))}
                </div>
              </div>

              {/* Accent Color Swatches & Picker */}
              <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 block mb-1.5">Accent Highlight Color</span>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="color"
                    value={slide.accentOverrideHex || theme.accentHex}
                    onChange={(e) => onUpdateSlide({ ...slide, accentOverrideHex: e.target.value })}
                    className="w-10 h-8 rounded-xl cursor-pointer bg-transparent border-none shrink-0"
                  />
                  <span className="text-xs font-mono text-slate-300">
                    {slide.accentOverrideHex || theme.accentHex}
                  </span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {ACCENT_COLOR_PALETTES.slice(0, 8).map((swatch, idx) => (
                    <button
                      key={idx}
                      onClick={() => onUpdateSlide({ ...slide, accentOverrideHex: swatch.hex })}
                      className="w-5 h-5 rounded-full hover:scale-110 transition-transform shadow-sm"
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Card Border Radius & Glassmorphism */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Sliders size={14} className="text-emerald-400" />
                Card Shape & Styling
              </label>
              <div className="grid grid-cols-5 gap-1 mb-2">
                {[
                  { id: 'none', label: 'Sharp' },
                  { id: 'sm', label: '8px' },
                  { id: 'md', label: '12px' },
                  { id: 'lg', label: '16px' },
                  { id: 'full', label: 'Pill' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onChangeTheme({ ...theme, borderRadius: r.id as any })}
                    className={`py-1.5 text-[10px] font-bold rounded-xl border text-center transition-all ${
                      (theme.borderRadius || 'lg') === r.id
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Toggle */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Monitor size={14} className="text-amber-400" />
                Deck Aspect Ratio
              </label>
              <div className="flex items-center gap-1.5 p-1 bg-slate-900/60 rounded-full border border-slate-800/80">
                <button
                  onClick={() => onChangeAspectRatio('16:9')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
                    aspectRatio === '16:9' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  16:9 Widescreen
                </button>
                <button
                  onClick={() => onChangeAspectRatio('4:3')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
                    aspectRatio === '4:3' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  4:3 Standard
                </button>
              </div>
            </div>
          </>
        )}

        {/* TYPOGRAPHY TAB */}
        {activeTab === 'typography' && (
          <div className="space-y-5">
            {/* Heading Font Selector */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Type size={14} className="text-indigo-400" />
                Heading Typography ({HEADING_FONTS.length})
              </label>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {HEADING_FONTS.map((font) => {
                  const isSelected = theme.fontHead === font.id;
                  return (
                    <button
                      key={font.id}
                      onClick={() => onChangeTheme({ ...theme, fontHead: font.id as any })}
                      className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-slate-900 ring-1 ring-indigo-500/40 text-white'
                          : 'border-slate-800/80 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className={`font-bold text-sm leading-tight ${font.className}`}>
                          {font.name}
                        </div>
                        <div className="text-[10px] text-slate-500">{font.previewText} • {font.category}</div>
                      </div>
                      {isSelected && <Check size={14} className="text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Body Font Selector */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Type size={14} className="text-cyan-400" />
                Body Typography ({BODY_FONTS.length})
              </label>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {BODY_FONTS.map((font) => {
                  const isSelected = theme.fontBody === font.id;
                  return (
                    <button
                      key={font.id}
                      onClick={() => onChangeTheme({ ...theme, fontBody: font.id as any })}
                      className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-slate-900 ring-1 ring-indigo-500/40 text-white'
                          : 'border-slate-800/80 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className={`font-bold text-xs leading-tight ${font.className}`}>
                          {font.name}
                        </div>
                        <div className="text-[10px] text-slate-500">{font.previewText} • {font.category}</div>
                      </div>
                      {isSelected && <Check size={14} className="text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title Font Size Scale */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Maximize2 size={14} className="text-emerald-400" />
                Title Size Scale
              </label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/60 rounded-2xl border border-slate-800/80">
                {[
                  { id: 'compact', label: 'Compact' },
                  { id: 'normal', label: 'Normal' },
                  { id: 'large', label: 'Large' },
                  { id: 'hero', label: 'Hero' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onChangeTheme({ ...theme, fontSizeScale: s.id as any })}
                    className={`py-1.5 text-[10px] font-bold rounded-xl transition-all ${
                      (theme.fontSizeScale || 'normal') === s.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={14} className="text-indigo-400" />
                Speaker Notes
              </label>

              <button
                onClick={handleGenerateSpeakerNotes}
                disabled={isGeneratingNotes}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
              >
                {isGeneratingNotes ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                <span>Auto-Generate</span>
              </button>
            </div>

            <textarea
              value={slide.speakerNotes || ''}
              onChange={(e) => onUpdateSlide({ ...slide, speakerNotes: e.target.value })}
              placeholder="Type presenter notes here..."
              className="w-full h-64 bg-slate-900/80 text-xs text-slate-200 p-3.5 rounded-2xl border border-slate-800/80 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none shadow-inner"
            />
            <p className="text-[10px] text-slate-500 leading-tight">
              Speaker notes are visible during Presenter Mode and exported into PowerPoint (.pptx) notes field.
            </p>
          </div>
        )}

        {/* AI TAB */}
        {activeTab === 'ai' && (
          <div className="space-y-3.5">
            {/* Copilot Launch Card */}
            {onOpenChatHelper && (
              <button
                onClick={onOpenChatHelper}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-900/60 to-purple-950/60 border border-indigo-500/40 hover:border-indigo-500 text-left transition-all duration-200 group shadow-lg"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Bot size={16} className="text-indigo-400" />
                    <span>Open AI Copilot</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500 text-white font-bold">
                    Interactive
                  </span>
                </div>
                <p className="text-[11px] text-indigo-200/80 leading-relaxed">
                  Chat with DeckCraft Copilot to rewrite copy, add metrics, adjust layout, or generate new slides.
                </p>
              </button>
            )}

            <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
              <h4 className="font-bold text-xs text-indigo-300 mb-1 flex items-center gap-1.5">
                <Zap size={14} />
                Quick 1-Click Magic
              </h4>
              <p className="text-[11px] text-slate-400">Instant AI transforms for the active slide.</p>
            </div>

            <button
              onClick={async () => {
                const rewritten = await onAiTransform('rewrite', slide.title);
                onUpdateSlide({ ...slide, title: rewritten });
              }}
              className="w-full p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 text-left text-xs font-medium text-slate-200 flex items-center gap-3 transition-all duration-200 hover:scale-[1.01]"
            >
              <Wand2 size={15} className="text-indigo-400 shrink-0" />
              <div>
                <div className="font-bold">Polish Slide Title</div>
                <div className="text-[10px] text-slate-400">Make title punchier and executive-ready</div>
              </div>
            </button>

            <button
              onClick={async () => {
                const expanded = await onAiTransform('expand', slide.title, slide.subtitle);
                const bullets = expanded.split('\n').filter((l) => l.trim().length > 0);
                onUpdateSlide({
                  ...slide,
                  content: { ...slide.content, bullets },
                });
              }}
              className="w-full p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 text-left text-xs font-medium text-slate-200 flex items-center gap-3 transition-all duration-200 hover:scale-[1.01]"
            >
              <Sparkles size={15} className="text-cyan-400 shrink-0" />
              <div>
                <div className="font-bold">Generate Bullet Points</div>
                <div className="text-[10px] text-slate-400">Create key takeaways automatically</div>
              </div>
            </button>

            <button
              onClick={async () => {
                const notes = await onAiTransform('speaker_notes', `${slide.title} - ${slide.subtitle}`);
                onUpdateSlide({ ...slide, speakerNotes: notes });
              }}
              className="w-full p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 text-left text-xs font-medium text-slate-200 flex items-center gap-3 transition-all duration-200 hover:scale-[1.01]"
            >
              <MessageSquare size={15} className="text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold">Generate Speaker Notes</div>
                <div className="text-[10px] text-slate-400">Creates presenter talking points</div>
              </div>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
