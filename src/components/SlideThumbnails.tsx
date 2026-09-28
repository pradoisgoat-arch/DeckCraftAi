import React, { useState } from 'react';
import { Slide, SlideLayoutType, ThemeConfig } from '../types/presentation';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Layout,
  LayoutGrid,
  Columns,
  BarChart3,
  Quote as QuoteIcon,
  Sparkles,
  Layers,
  Calendar,
  Users,
  CreditCard,
  HelpCircle,
  Code,
  GitCompare,
  Grid3X3,
} from 'lucide-react';

interface Props {
  slides: Slide[];
  activeSlideIndex: number;
  theme: ThemeConfig;
  onSelectSlide: (index: number) => void;
  onAddSlide: (layout: SlideLayoutType) => void;
  onDuplicateSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
  onMoveSlide: (fromIndex: number, toIndex: number) => void;
}

const LAYOUT_OPTIONS: { type: SlideLayoutType; label: string; icon: any }[] = [
  { type: 'title-slide', label: 'Title Slide', icon: Layout },
  { type: 'title-body', label: 'Title + Content', icon: LayoutGrid },
  { type: 'split-2-col', label: '2 Columns', icon: Columns },
  { type: 'grid-3-cards', label: '3 Cards Grid', icon: LayoutGrid },
  { type: 'grid-4-cards', label: '4 Cards Grid', icon: Grid3X3 },
  { type: 'metrics-spotlight', label: 'Metrics Spotlight', icon: BarChart3 },
  { type: 'comparison', label: 'Comparison / VS', icon: GitCompare },
  { type: 'timeline', label: 'Timeline / Roadmap', icon: Calendar },
  { type: 'team-bio', label: 'Team / Speakers', icon: Users },
  { type: 'pricing-table', label: 'Pricing Plans', icon: CreditCard },
  { type: 'faq-accordion', label: 'FAQ / Q&A', icon: HelpCircle },
  { type: 'code-snippet', label: 'Code Snippet', icon: Code },
  { type: 'quadrant-matrix', label: 'Quadrant Matrix (2x2)', icon: LayoutGrid },
  { type: 'diagram', label: 'Diagram / Pipeline', icon: Layers },
  { type: 'quote', label: 'Quote / Testimonial', icon: QuoteIcon },
  { type: 'conclusion', label: 'Conclusion / CTA', icon: Sparkles },
];

export const SlideThumbnails: React.FC<Props> = ({
  slides,
  activeSlideIndex,
  theme,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlide,
}) => {
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);

  return (
    <aside className="w-56 bg-slate-950/70 backdrop-blur-md border-r border-slate-800/60 flex flex-col h-full shrink-0 select-none">
      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-800/60 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Slides ({slides.length})
        </span>

        {/* Add Slide Button */}
        <div className="relative">
          <button
            onClick={() => setShowLayoutMenu(!showLayoutMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all duration-200 shadow-md shadow-indigo-600/20 active:scale-95"
          >
            <Plus size={14} />
            <span>Add Slide</span>
          </button>

          {showLayoutMenu && (
            <div
              className="absolute left-0 top-full mt-2 w-52 bg-slate-900/95 border border-slate-800/80 rounded-2xl shadow-2xl backdrop-blur-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setShowLayoutMenu(false)}
            >
              <div className="px-3.5 py-1.5 text-[10px] uppercase tracking-wider font-extrabold text-slate-500 border-b border-slate-800/80">
                Choose Slide Layout
              </div>
              {LAYOUT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.type}
                    onClick={() => {
                      onAddSlide(opt.type);
                      setShowLayoutMenu(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-2.5 transition-colors font-medium"
                  >
                    <Icon size={14} className="text-indigo-400 shrink-0" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Slide Thumbnails List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlideIndex;

          return (
            <div
              key={slide.id || idx}
              onClick={() => onSelectSlide(idx)}
              className={`group relative rounded-2xl transition-all duration-250 cursor-pointer p-2.5 border ${
                isActive
                  ? 'border-indigo-500/80 bg-slate-900/90 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                  : 'border-slate-800/60 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {idx + 1}
                </span>

                <span className="text-[10px] text-slate-500 uppercase tracking-tight truncate max-w-[100px] font-semibold">
                  {slide.layout}
                </span>
              </div>

              {/* Thumbnail Mini Preview */}
              <div
                className="w-full aspect-video rounded-xl p-2 border overflow-hidden flex flex-col justify-between shadow-inner"
                style={{
                  backgroundColor: slide.bgOverrideHex || theme.bgHex,
                  borderColor: isActive ? theme.accentHex : theme.cardBorderHex,
                }}
              >
                <div>
                  <div
                    className="font-extrabold text-[10px] leading-tight truncate mb-0.5"
                    style={{ color: theme.titleHex }}
                  >
                    {slide.title || 'Untitled Slide'}
                  </div>
                  {slide.subtitle && (
                    <div
                      className="text-[8px] leading-tight truncate font-medium"
                      style={{ color: theme.mutedHex }}
                    >
                      {slide.subtitle}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-60">
                  <div className="h-1 rounded-full flex-1" style={{ backgroundColor: theme.cardBorderHex }} />
                  <div className="h-1 w-2 rounded-full" style={{ backgroundColor: theme.accentHex }} />
                </div>
              </div>

              {/* Hover Quick Actions */}
              <div className="absolute right-2.5 top-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-full border border-slate-800/80 shadow-md">
                {idx > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSlide(idx, idx - 1);
                    }}
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                    title="Move slide up"
                  >
                    <ChevronUp size={12} />
                  </button>
                )}

                {idx < slides.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveSlide(idx, idx + 1);
                    }}
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                    title="Move slide down"
                  >
                    <ChevronDown size={12} />
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateSlide(idx);
                  }}
                  className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-full transition-colors"
                  title="Duplicate slide"
                >
                  <Copy size={12} />
                </button>

                {slides.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSlide(idx);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-full transition-colors"
                    title="Delete slide"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
