import React, { useState, useEffect, useRef } from 'react';
import { PresentationDeck } from '../types/presentation';
import confetti from 'canvas-confetti';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  Pointer,
  PenTool,
  RotateCcw,
} from 'lucide-react';
import { DiagramRenderer } from './DiagramRenderer';

interface Props {
  deck: PresentationDeck;
  initialSlideIndex?: number;
  onClose: () => void;
}

export const SlideshowView: React.FC<Props> = ({
  deck,
  initialSlideIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);
  const [showNotes, setShowNotes] = useState(false);
  const [isLaserPointer, setIsLaserPointer] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [penActive, setPenActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentSlide = deck.slides[currentIndex] || deck.slides[0];
  const theme = deck.theme;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format timer
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentIndex < deck.slides.length - 1) {
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          if (nextIdx === deck.slides.length - 1) {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          }
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck.slides.length, onClose]);

  // Track Mouse for Laser Pointer
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });

    if (penActive && isDrawing && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#f43f5e';
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (penActive && canvasRef.current) {
      setIsDrawing(true);
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between overflow-hidden select-none cursor-default"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Laser Pointer Dot */}
      {isLaserPointer && (
        <div
          className="fixed w-5 h-5 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.9)] pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{ left: mousePos.x, top: mousePos.y }}
        />
      )}

      {/* Pen Canvas Overlay */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className={`fixed inset-0 z-40 ${penActive ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'}`}
      />

      {/* Slide Display Area */}
      <div
        className={`flex-1 flex flex-col justify-between p-12 lg:p-20 transition-all duration-300 relative ${
          theme.fontHead === 'playfair' ? 'font-playfair' :
          theme.fontHead === 'outfit' ? 'font-outfit' :
          theme.fontHead === 'garamond' ? 'font-garamond' :
          theme.fontHead === 'montserrat' ? 'font-montserrat' :
          theme.fontHead === 'grotesk' ? 'font-grotesk' :
          theme.fontHead === 'display' ? 'font-display' :
          theme.fontHead === 'editorial' ? 'font-editorial' : 'font-jakarta'
        }`}
        style={{
          backgroundColor: currentSlide.bgOverrideHex || theme.bgHex,
          color: theme.textHex,
        }}
      >
        {/* Slide Header */}
        <div className="max-w-6xl mx-auto w-full">
          <h1
            className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-3"
            style={{ color: theme.titleHex }}
          >
            {currentSlide.title}
          </h1>
          {currentSlide.subtitle && (
            <h2 className="text-xl lg:text-2xl font-semibold mb-8" style={{ color: theme.accentHex }}>
              {currentSlide.subtitle}
            </h2>
          )}
        </div>

        {/* Slide Main Body */}
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center my-6">
          {currentSlide.layout === 'title-body' && (
            <ul className="space-y-4 max-w-4xl">
              {(currentSlide.content.bullets || []).map((b, idx) => (
                <li key={idx} className="flex items-start gap-4 text-xl lg:text-2xl leading-relaxed">
                  <span className="w-3 h-3 rounded-full mt-3.5 shrink-0" style={{ backgroundColor: theme.accentHex }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {currentSlide.layout === 'split-2-col' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {(currentSlide.content.columns || []).map((col, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl border"
                  style={{ backgroundColor: theme.cardBgHex, borderColor: theme.cardBorderHex }}
                >
                  <h3 className="text-2xl font-bold mb-4" style={{ color: theme.titleHex }}>
                    {col.title}
                  </h3>
                  <ul className="space-y-3">
                    {col.items.map((item, iIdx) => (
                      <li key={iIdx} className="text-lg leading-relaxed flex items-start gap-2">
                        <span className="opacity-50">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

              {currentSlide.layout === 'metrics-spotlight' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {(currentSlide.content.metrics || []).map((m, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-2xl border text-center flex flex-col justify-center"
                  style={{ backgroundColor: theme.cardBgHex, borderColor: theme.cardBorderHex }}
                >
                  <div className="text-6xl lg:text-7xl font-extrabold mb-2" style={{ color: theme.accentHex }}>
                    {m.value}
                  </div>
                  <div className="text-xl font-bold mb-2" style={{ color: theme.titleHex }}>
                    {m.label}
                  </div>
                  {m.description && <div className="text-sm opacity-70">{m.description}</div>}
                </div>
              ))}
            </div>
          )}

          {currentSlide.layout === 'comparison' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {(currentSlide.content.columns?.length ? currentSlide.content.columns : [
                { id: 'c1', title: 'Traditional Approach', tag: 'Standard', items: ['Manual 2-4 day turnaround', 'High error frequency', 'Siloed tools'] },
                { id: 'c2', title: 'DeckCraft Engine', tag: 'Next-Gen', items: ['Instant sub-second generation', '100% style consistency', 'End-to-end cloud pipeline'] },
              ]).map((col, idx) => (
                <div
                  key={idx}
                  className={`p-8 rounded-2xl border ${idx === 1 ? 'ring-2 ring-indigo-500 shadow-2xl' : ''}`}
                  style={{ backgroundColor: theme.cardBgHex, borderColor: idx === 1 ? theme.accentHex : theme.cardBorderHex }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold" style={{ color: theme.titleHex }}>
                      {col.title}
                    </h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full uppercase" style={{ backgroundColor: `${theme.accentHex}25`, color: theme.accentHex }}>
                      {col.tag || (idx === 0 ? 'Before' : 'After')}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {col.items.map((item, iIdx) => (
                      <li key={iIdx} className="text-lg leading-relaxed flex items-start gap-3">
                        <span className="font-bold text-xl" style={{ color: idx === 1 ? theme.accentHex : theme.mutedHex }}>
                          {idx === 1 ? '✓' : '✕'}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {currentSlide.layout === 'timeline' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
              {(currentSlide.content.timelineMilestones?.length ? currentSlide.content.timelineMilestones : [
                { date: 'Phase 1', title: 'Discovery & Audit', desc: 'Comprehensive benchmarking and alignment.' },
                { date: 'Phase 2', title: 'Architecture & MVP', desc: 'Core platform deployment & beta.' },
                { date: 'Phase 3', title: 'Global Rollout', desc: 'Enterprise customer acquisition.' },
                { date: 'Phase 4', title: 'Ecosystem Scale', desc: 'Market expansion & integrations.' },
              ]).map((milestone, idx) => (
                <div key={idx} className="p-6 rounded-2xl border" style={{ backgroundColor: theme.cardBgHex, borderColor: theme.cardBorderHex }}>
                  <span className="text-xs font-bold px-3 py-1 rounded-full inline-block mb-3" style={{ backgroundColor: `${theme.accentHex}25`, color: theme.accentHex }}>
                    {milestone.date}
                  </span>
                  <h4 className="text-lg font-bold mb-2" style={{ color: theme.titleHex }}>{milestone.title}</h4>
                  <p className="text-sm opacity-80 leading-relaxed">{milestone.desc}</p>
                </div>
              ))}
            </div>
          )}

          {currentSlide.layout === 'pricing-table' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {(currentSlide.content.pricingTiers?.length ? currentSlide.content.pricingTiers : [
                { name: 'Starter', price: '$29', period: '/ mo', features: ['Up to 5 users', 'PDF export', 'Standard templates'] },
                { name: 'Pro', price: '$89', period: '/ mo', features: ['Unlimited decks', 'AI deck generator', 'Full PPTX export', 'Custom brand kit'], highlight: true },
                { name: 'Enterprise', price: '$249', period: '/ mo', features: ['Custom AI fine-tuning', 'Dedicated manager', 'SSO Security'] },
              ]).map((tier, idx) => (
                <div key={idx} className={`p-8 rounded-2xl border ${tier.highlight ? 'ring-2 ring-indigo-500 shadow-2xl' : ''}`} style={{ backgroundColor: theme.cardBgHex, borderColor: tier.highlight ? theme.accentHex : theme.cardBorderHex }}>
                  <div className="font-bold text-sm mb-1" style={{ color: theme.accentHex }}>{tier.name}</div>
                  <div className="text-4xl font-extrabold mb-4" style={{ color: theme.titleHex }}>{tier.price} <span className="text-base font-normal opacity-60">{tier.period}</span></div>
                  <ul className="space-y-2 text-sm">
                    {tier.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2">✓ <span>{f}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {currentSlide.layout === 'team-bio' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
              {(currentSlide.content.teamMembers?.length ? currentSlide.content.teamMembers : [
                { name: 'Elena Vance', role: 'Chief Executive Officer', bio: 'Former VP of Strategy with 15+ years leading enterprise cloud transformations.' },
                { name: 'Dr. Marcus Thorne', role: 'Head of AI & Research', bio: 'PhD in Machine Learning from Stanford; published author with 12 AI patents.' },
                { name: 'Aria Chen', role: 'VP of Product Design', bio: 'Award-winning design lead passionate about frictionless developer tools.' },
              ]).map((member, idx) => (
                <div key={idx} className="p-6 rounded-2xl border text-center flex flex-col items-center" style={{ backgroundColor: theme.cardBgHex, borderColor: theme.cardBorderHex }}>
                  <div className="w-16 h-16 rounded-full mb-3 flex items-center justify-center font-bold text-lg" style={{ backgroundColor: `${theme.accentHex}20`, color: theme.accentHex }}>
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <h4 className="font-bold text-lg mb-1" style={{ color: theme.titleHex }}>{member.name}</h4>
                  <div className="text-xs font-semibold mb-2" style={{ color: theme.accentHex }}>{member.role}</div>
                  <p className="text-sm opacity-80 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          )}

          {currentSlide.layout === 'faq-accordion' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {(currentSlide.content.faqItems?.length ? currentSlide.content.faqItems : [
                { question: 'How fast can our team deploy this?', answer: 'Deploy in under 48 hours with turnkey cloud orchestration.' },
                { question: 'What security standards are supported?', answer: 'SOC2 Type II, ISO 27001, and HIPAA compliance built-in.' },
                { question: 'Is custom branding available?', answer: 'Full brand kit integration with custom fonts, palettes, and vector export.' },
                { question: 'Does PowerPoint export support animations?', answer: 'Native PPTX export retains vector shapes, layouts, and speaker notes.' },
              ]).map((faq, idx) => (
                <div key={idx} className="p-6 rounded-2xl border" style={{ backgroundColor: theme.cardBgHex, borderColor: theme.cardBorderHex }}>
                  <h4 className="font-bold text-base mb-2" style={{ color: theme.titleHex }}>Q: {faq.question}</h4>
                  <p className="text-sm opacity-80 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          )}

          {currentSlide.layout === 'code-snippet' && (
            <div className="p-6 rounded-2xl border w-full max-w-4xl mx-auto font-mono text-left shadow-2xl" style={{ backgroundColor: '#05070f', borderColor: theme.cardBorderHex }}>
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs text-slate-400">sdk-example.ts</span>
              </div>
              <pre className="text-sm text-slate-300 leading-relaxed overflow-x-auto">
                <code>{currentSlide.content.codeSnippet?.code || `// Initialize DeckCraft Client\nimport { DeckCraft } from '@deckcraft/sdk';\n\nconst deck = await DeckCraft.generate({\n  topic: 'Series A Pitch Deck',\n  slides: 8\n});`}</code>
              </pre>
            </div>
          )}

          {currentSlide.layout === 'diagram' && (
            <DiagramRenderer diagram={currentSlide.content.diagram} theme={theme} isEditable={false} />
          )}

          {currentSlide.layout === 'quote' && currentSlide.content.quote && (
            <div className="max-w-4xl p-10 rounded-2xl border my-auto" style={{ backgroundColor: theme.cardBgHex, borderColor: theme.cardBorderHex }}>
              <p className="text-2xl lg:text-3xl italic leading-relaxed mb-6 font-editorial" style={{ color: theme.titleHex }}>
                "{currentSlide.content.quote.text}"
              </p>
              <div className="text-lg font-bold" style={{ color: theme.accentHex }}>
                — {currentSlide.content.quote.author} {currentSlide.content.quote.role && `(${currentSlide.content.quote.role})`}
              </div>
            </div>
          )}
        </div>

        {/* Footer Brand */}
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between text-xs opacity-50">
          <span>{deck.title}</span>
          <span>
            {currentIndex + 1} / {deck.slides.length}
          </span>
        </div>
      </div>

      {/* Floating Presenter Controls Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-4">
        {/* Previous Slide */}
        <button
          onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30"
          title="Previous Slide (Left Arrow)"
        >
          <ChevronLeft size={20} />
        </button>

        <span className="text-xs font-bold text-slate-300 tracking-wider">
          {currentIndex + 1} of {deck.slides.length}
        </span>

        {/* Next Slide */}
        <button
          onClick={() => {
            if (currentIndex < deck.slides.length - 1) {
              const nextIdx = currentIndex + 1;
              setCurrentIndex(nextIdx);
              if (nextIdx === deck.slides.length - 1) {
                confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
              }
            }
          }}
          disabled={currentIndex === deck.slides.length - 1}
          className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30"
          title="Next Slide (Right Arrow / Space)"
        >
          <ChevronRight size={20} />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Timer */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
          <Clock size={14} />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>

        {/* Laser Pointer Toggle */}
        <button
          onClick={() => setIsLaserPointer(!isLaserPointer)}
          className={`p-2 rounded-lg transition-colors ${
            isLaserPointer ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'text-slate-400 hover:text-white'
          }`}
          title="Laser Pointer"
        >
          <Pointer size={16} />
        </button>

        {/* Pen Draw Tool Toggle */}
        <button
          onClick={() => setPenActive(!penActive)}
          className={`p-2 rounded-lg transition-colors ${
            penActive ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' : 'text-slate-400 hover:text-white'
          }`}
          title="Pen Annotation Tool"
        >
          <PenTool size={16} />
        </button>

        {penActive && (
          <button onClick={clearCanvas} className="p-1.5 text-slate-400 hover:text-rose-400" title="Clear Drawings">
            <RotateCcw size={16} />
          </button>
        )}

        {/* Speaker Notes Toggle */}
        <button
          onClick={() => setShowNotes(!showNotes)}
          className={`p-2 rounded-lg transition-colors ${
            showNotes ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Presenter Notes"
        >
          <MessageSquare size={16} />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Exit Presentation */}
        <button
          onClick={onClose}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
          title="Exit Presentation (Esc)"
        >
          <X size={18} />
        </button>
      </div>

      {/* Speaker Notes Overlay Panel */}
      {showNotes && (
        <div className="fixed top-6 right-6 w-80 bg-slate-900/95 border border-slate-800 p-4 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare size={14} />
              Speaker Talking Points
            </span>
            <button onClick={() => setShowNotes(false)} className="text-slate-400 hover:text-white">
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {currentSlide.speakerNotes || 'No notes for this slide.'}
          </p>
        </div>
      )}
    </div>
  );
};
