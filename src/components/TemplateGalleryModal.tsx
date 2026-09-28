import React from 'react';
import { PresentationDeck } from '../types/presentation';
import { SAMPLE_DECKS } from '../constants/templates';
import { FolderOpen, X, Sparkles, Layout, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectDeck: (deck: PresentationDeck) => void;
  currentDeckId: string;
}

export const TemplateGalleryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectDeck,
  currentDeckId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <FolderOpen size={18} />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-white">Sample Presentation Decks</h3>
              <p className="text-xs text-slate-400">Load pre-designed pitch decks, product roadmaps, or technical architecture frameworks</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_DECKS.map((d) => {
            const isCurrent = d.id === currentDeckId;

            return (
              <div
                key={d.id}
                onClick={() => {
                  onSelectDeck(d);
                  onClose();
                }}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500/50'
                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                      {d.slides.length} Slides
                    </span>
                    {isCurrent && (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <Check size={14} /> Active
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-base text-white group-hover:text-indigo-300 transition-colors mb-1">
                    {d.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{d.subtitle}</p>
                </div>

                {/* Preview Mini Strip */}
                <div className="flex items-center gap-1.5 pt-3 border-t border-slate-800/80">
                  {d.slides.slice(0, 4).map((s, idx) => (
                    <div
                      key={idx}
                      className="h-8 flex-1 rounded bg-slate-900 border border-slate-800 p-1 flex items-center justify-center text-[9px] font-bold text-slate-400 truncate"
                    >
                      {idx + 1}
                    </div>
                  ))}
                  {d.slides.length > 4 && (
                    <span className="text-[10px] text-slate-500 font-medium">+{d.slides.length - 4}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
