import React, { useState } from 'react';
import { PresentationDeck } from '../types/presentation';
import {
  Sparkles,
  Play,
  Download,
  FileCode,
  FileText,
  Presentation,
  FolderOpen,
  ChevronDown,
  Wand2,
  Plus,
  Loader2,
  Home,
  Monitor,
  Bot,
  MessageSquare,
} from 'lucide-react';
import { exportToPptx, exportToPdf, exportToJson } from '../services/deckExport';

interface HeaderProps {
  deck: PresentationDeck;
  currentView: 'home' | 'studio';
  isChatHelperOpen: boolean;
  onToggleView: (view: 'home' | 'studio') => void;
  onToggleChatHelper: () => void;
  onUpdateTitle: (title: string) => void;
  onOpenAiGenerator: () => void;
  onOpenTemplates: () => void;
  onStartPresenting: () => void;
  onNewEmptyDeck: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  deck,
  currentView,
  isChatHelperOpen,
  onToggleView,
  onToggleChatHelper,
  onUpdateTitle,
  onOpenAiGenerator,
  onOpenTemplates,
  onStartPresenting,
  onNewEmptyDeck,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(deck.title);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim()) {
      onUpdateTitle(tempTitle.trim());
    } else {
      setTempTitle(deck.title);
    }
  };

  const handleExportPptx = async () => {
    try {
      setIsExporting('PowerPoint (.pptx)');
      setShowExportMenu(false);
      await exportToPptx(deck);
    } catch (err) {
      console.error('Failed to export PPTX:', err);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsExporting('PDF (.pdf)');
      setShowExportMenu(false);
      await exportToPdf(deck);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportJson = () => {
    setShowExportMenu(false);
    exportToJson(deck);
  };

  return (
    <header className="h-16 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between z-30 shrink-0">
      {/* Zone 1: Wordmark & View Switcher */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onToggleView(currentView === 'home' ? 'studio' : 'home')}
          className="flex items-center gap-2.5 group"
          title="Toggle Home / Studio"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <Sparkles size={18} />
          </div>
          <span className="font-display font-extrabold text-lg text-white tracking-tight">
            DeckCraft<span className="text-indigo-400">.ai</span>
          </span>
        </button>

        <div className="h-5 w-px bg-slate-800/80 mx-1 hidden sm:block" />

        {/* View Switcher Pills */}
        <div className="flex items-center p-0.5 bg-slate-900/80 border border-slate-800 rounded-full">
          <button
            onClick={() => onToggleView('home')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              currentView === 'home'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home size={12} />
            <span>Home</span>
          </button>
          <button
            onClick={() => onToggleView('studio')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              currentView === 'studio'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor size={12} />
            <span>Studio</span>
          </button>
        </div>

        {/* Deck Title Editor (visible when in Studio) */}
        {currentView === 'studio' && (
          <div className="hidden lg:flex items-center ml-1">
            {isEditingTitle ? (
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                autoFocus
                className="bg-slate-900/90 text-white font-medium text-xs px-3 py-1 rounded-full border border-indigo-500/50 focus:outline-none w-48 shadow-inner"
              />
            ) : (
              <button
                onClick={() => {
                  setTempTitle(deck.title);
                  setIsEditingTitle(true);
                }}
                className="text-slate-400 hover:text-white font-medium text-xs px-2.5 py-1 rounded-full hover:bg-slate-900/80 transition-all max-w-[180px] truncate text-left border border-transparent hover:border-slate-800/80"
                title="Click to edit title"
              >
                {deck.title || 'Untitled Presentation'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Zone 2: Main Controls & Generator */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAiGenerator}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
        >
          <Wand2 size={14} className="animate-pulse text-indigo-200" />
          <span className="hidden sm:inline">Generate Deck with AI</span>
          <span className="sm:hidden">AI Deck</span>
        </button>

        <button
          onClick={onOpenTemplates}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80 text-xs font-medium transition-all duration-200 whitespace-nowrap"
        >
          <FolderOpen size={13} className="text-slate-400" />
          <span>Templates</span>
        </button>

        <button
          onClick={onNewEmptyDeck}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80 text-xs font-medium transition-all duration-200 whitespace-nowrap"
          title="New blank deck"
        >
          <Plus size={13} className="text-slate-400" />
          <span>New</span>
        </button>
      </div>

      {/* Zone 3: Copilot, Export & Present */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Chat Copilot Toggle Button */}
        <button
          onClick={onToggleChatHelper}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
            isChatHelperOpen
              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-md ring-1 ring-indigo-500/40'
              : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
          }`}
          title="Toggle AI Copilot"
        >
          <Bot size={14} className="text-indigo-400" />
          <span className="hidden sm:inline">Copilot</span>
        </button>

        {/* Export Progress Badge */}
        {isExporting && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold animate-pulse shadow-md">
            <Loader2 size={12} className="animate-spin text-indigo-400" />
            <span>Exporting {isExporting}...</span>
          </div>
        )}

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={!!isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80 text-xs font-medium transition-all duration-200 disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={13} className="animate-spin text-indigo-400" /> : <Download size={13} className="text-slate-400" />}
            <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
            <ChevronDown size={11} className="text-slate-400" />
          </button>

          {showExportMenu && (
            <div
              className="absolute right-0 mt-2.5 w-60 bg-slate-900/95 border border-slate-800/90 rounded-2xl shadow-2xl backdrop-blur-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setShowExportMenu(false)}
            >
              <button
                onClick={handleExportPptx}
                className="w-full px-4 py-2.5 text-left text-xs text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-3 transition-colors"
              >
                <Presentation size={16} className="text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-slate-200">PowerPoint (.pptx)</div>
                  <div className="text-[10px] text-slate-400">Editable Microsoft PowerPoint file</div>
                </div>
              </button>

              <button
                onClick={handleExportPdf}
                className="w-full px-4 py-2.5 text-left text-xs text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-3 transition-colors"
              >
                <FileText size={16} className="text-rose-400 shrink-0" />
                <div>
                  <div className="font-bold text-slate-200">PDF Document (.pdf)</div>
                  <div className="text-[10px] text-slate-400">High-resolution print vector PDF</div>
                </div>
              </button>

              <div className="my-1 border-t border-slate-800/80" />

              <button
                onClick={handleExportJson}
                className="w-full px-4 py-2.5 text-left text-xs text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-3 transition-colors"
              >
                <FileCode size={16} className="text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-slate-200">Deck JSON (.json)</div>
                  <div className="text-[10px] text-slate-400">Backup deck data format</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Present Button */}
        <button
          onClick={onStartPresenting}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all duration-300 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/35 hover:scale-[1.02] active:scale-95"
        >
          <Play size={13} className="fill-current" />
          <span>Present</span>
        </button>
      </div>
    </header>
  );
};
