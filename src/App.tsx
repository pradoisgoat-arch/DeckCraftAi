import React, { useState, useEffect } from 'react';
import { PresentationDeck, Slide, SlideLayoutType, ThemeConfig, AiTone } from './types/presentation';
import { INITIAL_DECK, SAMPLE_DECKS } from './constants/templates';
import { DEFAULT_THEME } from './constants/themes';
import { Header } from './components/Header';
import { SlideThumbnails } from './components/SlideThumbnails';
import { SlideCanvas } from './components/SlideCanvas';
import { SlideInspector } from './components/SlideInspector';
import { AiDeckGeneratorModal } from './components/AiDeckGeneratorModal';
import { TemplateGalleryModal } from './components/TemplateGalleryModal';
import { SlideshowView } from './components/SlideshowView';
import { HomePage } from './components/HomePage';
import { ChatHelper } from './components/ChatHelper';
import { Bot, Sparkles } from 'lucide-react';

export default function App() {
  const [deck, setDeck] = useState<PresentationDeck>(() => {
    const saved = localStorage.getItem('deckcraft_active_deck');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved deck:', e);
      }
    }
    return INITIAL_DECK;
  });

  const [recentDecks, setRecentDecks] = useState<PresentationDeck[]>(() => {
    const saved = localStorage.getItem('deckcraft_recent_decks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse recent decks:', e);
      }
    }
    return SAMPLE_DECKS;
  });

  const [viewMode, setViewMode] = useState<'home' | 'studio'>('home');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isChatHelperOpen, setIsChatHelperOpen] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);

  // Save active deck to LocalStorage
  useEffect(() => {
    localStorage.setItem('deckcraft_active_deck', JSON.stringify(deck));

    // Update in recent decks list
    setRecentDecks((prev) => {
      const filtered = prev.filter((d) => d.id !== deck.id);
      const updated = [deck, ...filtered].slice(0, 12);
      localStorage.setItem('deckcraft_recent_decks', JSON.stringify(updated));
      return updated;
    });
  }, [deck]);

  const activeSlide = deck.slides[activeSlideIndex] || deck.slides[0];

  // Title Update
  const handleUpdateDeckTitle = (title: string) => {
    setDeck((prev) => ({ ...prev, title, updatedAt: new Date().toISOString() }));
  };

  // Theme Change
  const handleChangeTheme = (theme: ThemeConfig) => {
    setDeck((prev) => ({ ...prev, theme, updatedAt: new Date().toISOString() }));
  };

  // Aspect Ratio Change
  const handleChangeAspectRatio = (aspectRatio: '16:9' | '4:3') => {
    setDeck((prev) => ({ ...prev, aspectRatio, updatedAt: new Date().toISOString() }));
  };

  // Add Slide
  const handleAddSlide = (layout: SlideLayoutType, customSlide?: Slide) => {
    const newSlide: Slide = customSlide || {
      id: `slide-${Date.now()}`,
      title: 'New Slide Title',
      subtitle: 'Key takeaway or subtitle point',
      layout,
      speakerNotes: 'Add speaker notes here.',
      content: {
        headline: 'New Slide Title',
        bullets: ['First key insight or point', 'Second key supporting argument', 'Actionable takeaway'],
      },
    };

    const updatedSlides = [...deck.slides];
    updatedSlides.splice(activeSlideIndex + 1, 0, newSlide);

    setDeck((prev) => ({
      ...prev,
      slides: updatedSlides,
      updatedAt: new Date().toISOString(),
    }));
    setActiveSlideIndex(activeSlideIndex + 1);
  };

  // Duplicate Slide
  const handleDuplicateSlide = (index: number) => {
    const slideToDup = deck.slides[index];
    if (!slideToDup) return;

    const duplicated: Slide = {
      ...JSON.parse(JSON.stringify(slideToDup)),
      id: `slide-${Date.now()}`,
      title: `${slideToDup.title} (Copy)`,
    };

    const updatedSlides = [...deck.slides];
    updatedSlides.splice(index + 1, 0, duplicated);

    setDeck((prev) => ({
      ...prev,
      slides: updatedSlides,
      updatedAt: new Date().toISOString(),
    }));
    setActiveSlideIndex(index + 1);
  };

  // Delete Slide
  const handleDeleteSlide = (index: number) => {
    if (deck.slides.length <= 1) return;

    const updatedSlides = deck.slides.filter((_, i) => i !== index);
    setDeck((prev) => ({
      ...prev,
      slides: updatedSlides,
      updatedAt: new Date().toISOString(),
    }));

    if (activeSlideIndex >= updatedSlides.length) {
      setActiveSlideIndex(updatedSlides.length - 1);
    }
  };

  // Move / Reorder Slide
  const handleMoveSlide = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= deck.slides.length) return;

    const updatedSlides = [...deck.slides];
    const [moved] = updatedSlides.splice(fromIndex, 1);
    updatedSlides.splice(toIndex, 0, moved);

    setDeck((prev) => ({
      ...prev,
      slides: updatedSlides,
      updatedAt: new Date().toISOString(),
    }));
    setActiveSlideIndex(toIndex);
  };

  // Update Slide Content
  const handleUpdateSlide = (updatedSlide: Slide) => {
    const updatedSlides = [...deck.slides];
    updatedSlides[activeSlideIndex] = updatedSlide;

    setDeck((prev) => ({
      ...prev,
      slides: updatedSlides,
      updatedAt: new Date().toISOString(),
    }));
  };

  // New Blank Deck
  const handleNewEmptyDeck = () => {
    const emptyDeck: PresentationDeck = {
      id: `deck-${Date.now()}`,
      title: 'Untitled Presentation',
      subtitle: 'Created with DeckCraft AI',
      author: 'Author',
      aspectRatio: '16:9',
      theme: DEFAULT_THEME,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slides: [
        {
          id: `slide-${Date.now()}-1`,
          title: 'Untitled Presentation Title',
          subtitle: 'Click to edit subtitle or presenter details',
          layout: 'title-slide',
          speakerNotes: 'Welcome everyone to the presentation.',
          content: {
            headline: 'Untitled Presentation Title',
            subhead: 'Click to edit subtitle',
          },
        },
      ],
    };
    setDeck(emptyDeck);
    setActiveSlideIndex(0);
    setViewMode('studio');
  };

  // Open an existing Deck
  const handleOpenDeck = (selectedDeck: PresentationDeck) => {
    setDeck(selectedDeck);
    setActiveSlideIndex(0);
    setViewMode('studio');
  };

  // Delete a deck from recent
  const handleDeleteRecentDeck = (id: string) => {
    const updated = recentDecks.filter((d) => d.id !== id);
    setRecentDecks(updated);
    localStorage.setItem('deckcraft_recent_decks', JSON.stringify(updated));
  };

  // Duplicate a deck from recent
  const handleDuplicateRecentDeck = (d: PresentationDeck) => {
    const duplicated: PresentationDeck = {
      ...JSON.parse(JSON.stringify(d)),
      id: `deck-${Date.now()}`,
      title: `${d.title} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    const updated = [duplicated, ...recentDecks];
    setRecentDecks(updated);
    localStorage.setItem('deckcraft_recent_decks', JSON.stringify(updated));
  };

  // AI Generation Callback
  const handleDeckGenerated = (data: { title: string; subtitle: string; author: string; slides: any[] }) => {
    const newDeck: PresentationDeck = {
      id: `deck-${Date.now()}`,
      title: data.title || 'AI Generated Deck',
      subtitle: data.subtitle || '',
      author: data.author || 'DeckCraft AI',
      aspectRatio: '16:9',
      theme: deck.theme || DEFAULT_THEME,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slides: data.slides,
    };
    setDeck(newDeck);
    setActiveSlideIndex(0);
    setViewMode('studio');
  };

  // Quick AI Generate directly from Homepage prompt bar
  const handleQuickGenerate = async (topic: string, count: number, tone: AiTone) => {
    const res = await fetch('/api/generate-deck', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, slideCount: count, tone }),
    });

    if (!res.ok) throw new Error('Failed to generate deck');
    const data = await res.json();
    handleDeckGenerated(data);
  };

  // AI Transform Server Call
  const handleAiTransform = async (action: string, text: string, context?: string): Promise<string> => {
    const res = await fetch('/api/ai-transform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, text, context }),
    });
    if (!res.ok) throw new Error('AI transform failed');
    const data = await res.json();
    return data.result;
  };

  // AI Image Server Call
  const handleGenerateImage = async (prompt: string): Promise<string> => {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, aspectRatio: deck.aspectRatio }),
    });
    if (!res.ok) throw new Error('Image generation failed');
    const data = await res.json();
    return data.imageUrl;
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Top Bar Header */}
      <Header
        deck={deck}
        currentView={viewMode}
        isChatHelperOpen={isChatHelperOpen}
        onToggleView={(view) => setViewMode(view)}
        onToggleChatHelper={() => setIsChatHelperOpen(!isChatHelperOpen)}
        onUpdateTitle={handleUpdateDeckTitle}
        onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onStartPresenting={() => setIsPresenting(true)}
        onNewEmptyDeck={handleNewEmptyDeck}
      />

      {/* Main Workspace Area */}
      {viewMode === 'home' ? (
        <HomePage
          activeDeck={deck}
          recentDecks={recentDecks}
          onOpenDeck={handleOpenDeck}
          onOpenStudio={() => setViewMode('studio')}
          onNewEmptyDeck={handleNewEmptyDeck}
          onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
          onOpenTemplates={() => setIsTemplatesOpen(true)}
          onDeleteDeck={handleDeleteRecentDeck}
          onDuplicateDeck={handleDuplicateRecentDeck}
          onQuickGenerate={handleQuickGenerate}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Thumbnails Sidebar */}
          <SlideThumbnails
            slides={deck.slides}
            activeSlideIndex={activeSlideIndex}
            theme={deck.theme}
            onSelectSlide={setActiveSlideIndex}
            onAddSlide={(layout) => handleAddSlide(layout)}
            onDuplicateSlide={handleDuplicateSlide}
            onDeleteSlide={handleDeleteSlide}
            onMoveSlide={handleMoveSlide}
          />

          {/* Center Active Slide Canvas */}
          <SlideCanvas
            slide={activeSlide}
            theme={deck.theme}
            aspectRatio={deck.aspectRatio}
            onUpdateSlide={handleUpdateSlide}
            onAiTransform={handleAiTransform}
            onGenerateImage={handleGenerateImage}
          />

          {/* Right Inspector Sidebar */}
          <SlideInspector
            slide={activeSlide}
            theme={deck.theme}
            aspectRatio={deck.aspectRatio}
            onUpdateSlide={handleUpdateSlide}
            onChangeTheme={handleChangeTheme}
            onChangeAspectRatio={handleChangeAspectRatio}
            onAiTransform={handleAiTransform}
            onOpenChatHelper={() => setIsChatHelperOpen(true)}
          />
        </div>
      )}

      {/* Floating Copilot Trigger Button (visible in studio when helper is closed) */}
      {viewMode === 'studio' && !isChatHelperOpen && (
        <button
          onClick={() => setIsChatHelperOpen(true)}
          className="fixed bottom-6 right-8 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-indigo-400/40"
        >
          <Bot size={16} />
          <span>AI Copilot</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </button>
      )}

      {/* Chat Copilot Drawer */}
      <ChatHelper
        isOpen={isChatHelperOpen}
        onClose={() => setIsChatHelperOpen(false)}
        currentSlide={activeSlide}
        deck={deck}
        onUpdateSlide={handleUpdateSlide}
        onAddSlide={(newSlide) => handleAddSlide(newSlide.layout, newSlide)}
        onChangeTheme={handleChangeTheme}
      />

      {/* Modals & Fullscreen Views */}
      <AiDeckGeneratorModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        onDeckGenerated={handleDeckGenerated}
      />

      <TemplateGalleryModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectDeck={(selectedDeck) => {
          setDeck(selectedDeck);
          setActiveSlideIndex(0);
          setViewMode('studio');
        }}
        currentDeckId={deck.id}
      />

      {isPresenting && (
        <SlideshowView
          deck={deck}
          initialSlideIndex={activeSlideIndex}
          onClose={() => setIsPresenting(false)}
        />
      )}
    </div>
  );
}
