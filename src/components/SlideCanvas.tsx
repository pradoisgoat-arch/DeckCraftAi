import React, { useState } from 'react';
import { Slide, ThemeConfig } from '../types/presentation';
import { DiagramRenderer } from './DiagramRenderer';
import {
  Sparkles,
  Wand2,
  Plus,
  Trash2,
  Image as ImageIcon,
  Quote as QuoteIcon,
  RefreshCw,
  Loader2,
  Type,
  Layout,
  MessageSquare,
} from 'lucide-react';

interface Props {
  slide: Slide;
  theme: ThemeConfig;
  aspectRatio: '16:9' | '4:3';
  onUpdateSlide: (updatedSlide: Slide) => void;
  onAiTransform: (action: string, text: string) => Promise<string>;
  onGenerateImage: (prompt: string) => Promise<string>;
}

export const SlideCanvas: React.FC<Props> = ({
  slide,
  theme,
  aspectRatio,
  onUpdateSlide,
  onAiTransform,
  onGenerateImage,
}) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [imagePrompt, setImagePrompt] = useState(slide.content.image?.prompt || slide.title);
  const [showImagePromptInput, setShowImagePromptInput] = useState(false);

  const bgHex = slide.bgOverrideHex || theme.bgHex;
  const accentHex = slide.accentOverrideHex || theme.accentHex;

  // Font family mappings based on theme config
  const getHeadFont = () => {
    switch (theme.fontHead) {
      case 'display': return 'font-display';
      case 'editorial': return 'font-editorial';
      case 'grotesk': return 'font-grotesk';
      case 'outfit': return 'font-outfit';
      case 'playfair': return 'font-playfair';
      case 'montserrat': return 'font-montserrat';
      case 'garamond': return 'font-garamond';
      case 'inter': return 'font-inter';
      default: return 'font-jakarta';
    }
  };

  const getBodyFont = () => {
    switch (theme.fontBody) {
      case 'editorial': return 'font-editorial';
      case 'mono': return 'font-code';
      case 'jetbrains': return 'font-jetbrains';
      case 'outfit': return 'font-outfit';
      case 'inter': return 'font-inter';
      case 'garamond': return 'font-garamond';
      default: return 'font-jakarta';
    }
  };

  const getCardRadius = () => {
    switch (theme.borderRadius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-lg';
      case 'md': return 'rounded-xl';
      case 'full': return 'rounded-3xl';
      case 'lg':
      default: return 'rounded-2xl';
    }
  };

  // Helper updates
  const updateTitle = (val: string) => {
    onUpdateSlide({ ...slide, title: val });
  };

  const updateSubtitle = (val: string) => {
    onUpdateSlide({ ...slide, subtitle: val });
  };

  const updateBullet = (idx: number, val: string) => {
    const bullets = [...(slide.content.bullets || [])];
    bullets[idx] = val;
    onUpdateSlide({ ...slide, content: { ...slide.content, bullets } });
  };

  const addBullet = () => {
    const bullets = [...(slide.content.bullets || []), 'New key point or takeaways'];
    onUpdateSlide({ ...slide, content: { ...slide.content, bullets } });
  };

  const removeBullet = (idx: number) => {
    const bullets = (slide.content.bullets || []).filter((_, i) => i !== idx);
    onUpdateSlide({ ...slide, content: { ...slide.content, bullets } });
  };

  const updateMetric = (mIdx: number, field: string, val: string) => {
    const metrics = [...(slide.content.metrics || [])];
    metrics[mIdx] = { ...metrics[mIdx], [field]: val };
    onUpdateSlide({ ...slide, content: { ...slide.content, metrics } });
  };

  const handleAiPolish = async (field: 'title' | 'subtitle' | 'notes') => {
    setIsAiProcessing(true);
    try {
      if (field === 'title') {
        const rewritten = await onAiTransform('rewrite', slide.title);
        onUpdateSlide({ ...slide, title: rewritten });
      } else if (field === 'subtitle') {
        const rewritten = await onAiTransform('rewrite', slide.subtitle || '');
        onUpdateSlide({ ...slide, subtitle: rewritten });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleCreateImage = async () => {
    if (!imagePrompt) return;
    setIsGeneratingImage(true);
    try {
      const url = await onGenerateImage(imagePrompt);
      onUpdateSlide({
        ...slide,
        content: {
          ...slide.content,
          image: { url, prompt: imagePrompt, caption: imagePrompt },
        },
      });
      setShowImagePromptInput(false);
    } catch (e) {
      console.error('Failed to generate slide image:', e);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 overflow-y-auto bg-slate-950/60 backdrop-blur-sm">
      {/* Aspect Ratio Container Card */}
      <div
        className={`w-full max-w-5xl rounded-3xl smooth-shadow relative border overflow-hidden transition-all duration-300 flex flex-col justify-between p-8 lg:p-12 ${
          aspectRatio === '4:3' ? 'aspect-[4/3]' : 'aspect-slide'
        } ${getHeadFont()}`}
        style={{
          backgroundColor: bgHex,
          borderColor: theme.cardBorderHex,
          color: theme.textHex,
        }}
      >
        {/* Decorative Top Accent Line */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 opacity-90"
          style={{
            background: `linear-gradient(to right, ${accentHex}, ${accentHex}33)`,
          }}
        />

        {/* Slide Canvas Content Header */}
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 mb-2">
            <input
              type="text"
              value={slide.title}
              onChange={(e) => updateTitle(e.target.value)}
              placeholder="Enter slide title..."
              className={`w-full bg-transparent font-extrabold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 rounded-xl px-2 py-1 transition-all ${
                slide.layout === 'title-slide'
                  ? 'text-3xl lg:text-5xl leading-tight'
                  : 'text-2xl lg:text-3xl'
              }`}
              style={{ color: theme.titleHex }}
            />

            {/* Quick AI Polish Button for Title */}
            <button
              onClick={() => handleAiPolish('title')}
              disabled={isAiProcessing}
              className="p-2 rounded-full bg-slate-900/60 hover:bg-indigo-600/20 hover:text-indigo-400 text-slate-400 border border-slate-800/80 transition-all duration-200 shrink-0 hover:scale-105"
              title="AI Polish Title"
            >
              {isAiProcessing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
            </button>
          </div>

          {(slide.subtitle !== undefined || slide.layout === 'title-slide') && (
            <input
              type="text"
              value={slide.subtitle || ''}
              onChange={(e) => updateSubtitle(e.target.value)}
              placeholder="Enter slide subtitle..."
              className="w-full bg-transparent font-medium text-sm lg:text-base mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 rounded-xl px-2 py-1"
              style={{ color: accentHex }}
            />
          )}
        </div>

        {/* Main Body Content based on Layout */}
        <div className={`relative z-10 flex-1 flex flex-col justify-center my-4 ${getBodyFont()}`}>
          {/* TITLE SLIDE LAYOUT */}
          {slide.layout === 'title-slide' && (
            <div className="my-auto space-y-6 max-w-3xl">
              <p className="text-base lg:text-lg leading-relaxed font-medium" style={{ color: theme.textHex }}>
                {slide.content.headline || slide.content.subhead}
              </p>

              {slide.content.calloutBox && (
                <div
                  className="p-5 rounded-2xl border flex items-center justify-between shadow-sm"
                  style={{
                    backgroundColor: theme.cardBgHex,
                    borderColor: theme.cardBorderHex,
                  }}
                >
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider block mb-1" style={{ color: accentHex }}>
                      {slide.content.calloutBox.title}
                    </span>
                    <span className="text-xs text-slate-300 font-medium">{slide.content.calloutBox.text}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TITLE BODY / BULLETS LAYOUT */}
          {slide.layout === 'title-body' && (
            <div className="space-y-3.5 max-w-4xl">
              {(slide.content.bullets || []).map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3.5 group">
                  <span
                    className="w-2.5 h-2.5 rounded-full mt-2 shrink-0 shadow-sm"
                    style={{ backgroundColor: accentHex }}
                  />
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => updateBullet(idx, e.target.value)}
                    className="flex-1 bg-transparent text-sm lg:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/30 rounded-xl px-2 py-1"
                    style={{ color: theme.textHex }}
                  />
                  <button
                    onClick={() => removeBullet(idx)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 transition-opacity rounded-lg hover:bg-slate-800/40"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <button
                onClick={addBullet}
                className="flex items-center gap-1.5 text-xs font-bold mt-3 px-3 py-1.5 rounded-full bg-slate-900/40 border border-slate-800/60 hover:bg-slate-800/60 transition-all"
                style={{ color: accentHex }}
              >
                <Plus size={14} />
                <span>Add Bullet Point</span>
              </button>
            </div>
          )}

          {/* 2 COLUMNS LAYOUT */}
          {slide.layout === 'split-2-col' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
              {(slide.content.columns || []).map((col, cIdx) => (
                <div
                  key={col.id || cIdx}
                  className="p-6 rounded-2xl border flex flex-col justify-between smooth-card-hover"
                  style={{
                    backgroundColor: theme.cardBgHex,
                    borderColor: theme.cardBorderHex,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-base" style={{ color: theme.titleHex }}>
                        {col.title}
                      </h4>
                      {col.tag && (
                        <span
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${accentHex}20`,
                            color: accentHex,
                          }}
                        >
                          {col.tag}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-2.5">
                      {col.items.map((item, iIdx) => (
                        <li key={iIdx} className="text-xs lg:text-sm flex items-start gap-2.5" style={{ color: theme.textHex }}>
                          <span className="text-slate-500 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3 CARDS GRID LAYOUT */}
          {slide.layout === 'grid-3-cards' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-2">
              {(slide.content.columns || []).map((col, cIdx) => (
                <div
                  key={col.id || cIdx}
                  className="p-5 rounded-2xl border flex flex-col justify-between smooth-card-hover"
                  style={{
                    backgroundColor: theme.cardBgHex,
                    borderColor: theme.cardBorderHex,
                  }}
                >
                  <div>
                    <h4 className="font-bold text-sm mb-2.5" style={{ color: theme.titleHex }}>
                      {col.title}
                    </h4>
                    <ul className="space-y-2">
                      {col.items.map((item, iIdx) => (
                        <li key={iIdx} className="text-xs leading-relaxed" style={{ color: theme.textHex }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4 CARDS GRID LAYOUT */}
          {slide.layout === 'grid-4-cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-2">
              {(slide.content.columns || []).map((col, cIdx) => (
                <div
                  key={col.id || cIdx}
                  className="p-4 rounded-2xl border flex flex-col justify-between smooth-card-hover"
                  style={{
                    backgroundColor: theme.cardBgHex,
                    borderColor: theme.cardBorderHex,
                  }}
                >
                  <div>
                    <h4 className="font-bold text-xs mb-2 truncate" style={{ color: theme.titleHex }}>
                      {col.title}
                    </h4>
                    <ul className="space-y-1.5">
                      {col.items.map((item, iIdx) => (
                        <li key={iIdx} className="text-[11px] leading-snug" style={{ color: theme.textHex }}>
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* METRICS SPOTLIGHT LAYOUT */}
          {slide.layout === 'metrics-spotlight' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
              {(slide.content.metrics || []).map((m, mIdx) => (
                <div
                  key={m.id || mIdx}
                  className="p-6 rounded-2xl border text-center flex flex-col items-center justify-center relative group smooth-card-hover"
                  style={{
                    backgroundColor: theme.cardBgHex,
                    borderColor: theme.cardBorderHex,
                  }}
                >
                  <input
                    type="text"
                    value={m.value}
                    onChange={(e) => updateMetric(mIdx, 'value', e.target.value)}
                    className="font-black text-4xl lg:text-5xl text-center bg-transparent mb-1 focus:outline-none w-full"
                    style={{ color: accentHex }}
                  />
                  <input
                    type="text"
                    value={m.label}
                    onChange={(e) => updateMetric(mIdx, 'label', e.target.value)}
                    className="font-bold text-sm text-center bg-transparent mb-1 focus:outline-none w-full"
                    style={{ color: theme.titleHex }}
                  />
                  {m.change && (
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-0.5 rounded-full mb-2 shadow-sm">
                      {m.change}
                    </span>
                  )}
                  <input
                    type="text"
                    value={m.description || ''}
                    onChange={(e) => updateMetric(mIdx, 'description', e.target.value)}
                    className="text-xs text-center bg-transparent focus:outline-none w-full"
                    style={{ color: theme.mutedHex }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* METRICS GRID 4 LAYOUT */}
          {slide.layout === 'metrics-grid-4' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-auto">
              {(slide.content.metrics || []).map((m, mIdx) => (
                <div
                  key={m.id || mIdx}
                  className="p-5 rounded-2xl border text-center flex flex-col items-center justify-center smooth-card-hover"
                  style={{
                    backgroundColor: theme.cardBgHex,
                    borderColor: theme.cardBorderHex,
                  }}
                >
                  <input
                    type="text"
                    value={m.value}
                    onChange={(e) => updateMetric(mIdx, 'value', e.target.value)}
                    className="font-black text-3xl lg:text-4xl text-center bg-transparent mb-1 focus:outline-none w-full"
                    style={{ color: accentHex }}
                  />
                  <input
                    type="text"
                    value={m.label}
                    onChange={(e) => updateMetric(mIdx, 'label', e.target.value)}
                    className="font-bold text-xs text-center bg-transparent focus:outline-none w-full"
                    style={{ color: theme.titleHex }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* QUADRANT MATRIX LAYOUT */}
          {slide.layout === 'quadrant-matrix' && (
            <div className="grid grid-cols-2 gap-5 my-2">
              {(slide.content.columns || []).map((col, cIdx) => (
                <div
                  key={col.id || cIdx}
                  className="p-5 rounded-2xl border flex flex-col justify-between smooth-card-hover"
                  style={{
                    backgroundColor: theme.cardBgHex,
                    borderColor: theme.cardBorderHex,
                  }}
                >
                  <h4 className="font-bold text-sm mb-1.5" style={{ color: theme.titleHex }}>
                    Q{cIdx + 1}: {col.title}
                  </h4>
                  <ul className="space-y-1.5 text-xs">
                    {col.items.map((item, iIdx) => (
                      <li key={iIdx} style={{ color: theme.textHex }}>
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* COMPARISON LAYOUT */}
          {slide.layout === 'comparison' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
              {(slide.content.columns?.length ? slide.content.columns : [
                { id: 'comp-1', title: 'Traditional Approach', tag: 'Standard', items: ['Manual processes', 'High human error rate', 'Days to turnaround', 'Disjointed communication'] },
                { id: 'comp-2', title: 'DeckCraft Platform', tag: 'Next-Gen', items: ['AI-automated workflows', 'Built-in visual consistency', 'Sub-second generation', 'One-click export to PPTX'] },
              ]).map((col, cIdx) => (
                <div
                  key={col.id || cIdx}
                  className={`p-6 border flex flex-col justify-between smooth-card-hover ${getCardRadius()} ${
                    cIdx === 1 ? 'ring-2 ring-indigo-500/50 shadow-xl' : ''
                  }`}
                  style={{
                    backgroundColor: theme.cardBgHex,
                    borderColor: cIdx === 1 ? accentHex : theme.cardBorderHex,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-extrabold text-base" style={{ color: theme.titleHex }}>
                        {col.title}
                      </h4>
                      <span
                        className="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider"
                        style={{
                          backgroundColor: `${cIdx === 1 ? accentHex : theme.mutedHex}25`,
                          color: cIdx === 1 ? accentHex : theme.textHex,
                        }}
                      >
                        {col.tag || (cIdx === 0 ? 'Before' : 'After')}
                      </span>
                    </div>

                    <ul className="space-y-3">
                      {col.items.map((item, iIdx) => (
                        <li key={iIdx} className="text-xs lg:text-sm flex items-start gap-2.5" style={{ color: theme.textHex }}>
                          <span className="font-bold text-sm shrink-0" style={{ color: cIdx === 1 ? accentHex : theme.mutedHex }}>
                            {cIdx === 1 ? '✓' : '✕'}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TIMELINE / ROADMAP LAYOUT */}
          {slide.layout === 'timeline' && (
            <div className="relative my-auto py-4">
              <div className="hidden md:block absolute top-1/2 left-4 right-4 h-0.5 -translate-y-1/2 z-0" style={{ backgroundColor: `${accentHex}40` }} />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                {(slide.content.timelineMilestones?.length ? slide.content.timelineMilestones : [
                  { date: 'Phase 1', title: 'Discovery & Audit', desc: 'Comprehensive ecosystem benchmarking and goal alignment.' },
                  { date: 'Phase 2', title: 'Architecture & MVP', desc: 'Core platform build and initial closed beta deployment.' },
                  { date: 'Phase 3', title: 'Commercial Launch', desc: 'Global rollout and multi-channel customer acquisition.' },
                  { date: 'Phase 4', title: 'Scale & Ecosystem', desc: 'Enterprise integrations and ecosystem expansion.' },
                ]).map((milestone, mIdx) => (
                  <div
                    key={mIdx}
                    className={`p-4 border flex flex-col justify-between smooth-card-hover ${getCardRadius()}`}
                    style={{
                      backgroundColor: theme.cardBgHex,
                      borderColor: theme.cardBorderHex,
                    }}
                  >
                    <div>
                      <span
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mb-2 shadow-sm"
                        style={{ backgroundColor: `${accentHex}20`, color: accentHex }}
                      >
                        {milestone.date}
                      </span>
                      <h5 className="font-bold text-xs mb-1.5" style={{ color: theme.titleHex }}>
                        {milestone.title}
                      </h5>
                      <p className="text-[11px] leading-relaxed" style={{ color: theme.mutedHex }}>
                        {milestone.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRICING TABLE LAYOUT */}
          {slide.layout === 'pricing-table' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-auto">
              {(slide.content.pricingTiers?.length ? slide.content.pricingTiers : [
                { name: 'Starter', price: '$29', period: '/ month', features: ['Up to 5 team members', 'Standard templates', 'Export to PDF', 'Community support'], highlight: false },
                { name: 'Professional', price: '$89', period: '/ month', features: ['Unlimited presentations', 'AI deck generator', 'Full PowerPoint export', 'Custom brand kit', 'Priority support'], highlight: true },
                { name: 'Enterprise', price: '$249', period: '/ month', features: ['Custom AI fine-tuning', 'Dedicated account manager', 'SSO & Enterprise security', 'Audit logging & SLA'], highlight: false },
              ]).map((tier, tIdx) => (
                <div
                  key={tIdx}
                  className={`p-5 border flex flex-col justify-between smooth-card-hover ${getCardRadius()} ${
                    tier.highlight ? 'ring-2 ring-indigo-500 shadow-xl scale-[1.02]' : ''
                  }`}
                  style={{
                    backgroundColor: theme.cardBgHex,
                    borderColor: tier.highlight ? accentHex : theme.cardBorderHex,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs" style={{ color: tier.highlight ? accentHex : theme.mutedHex }}>
                        {tier.name}
                      </span>
                      {tier.highlight && (
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                          Most Popular
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="font-extrabold text-3xl" style={{ color: theme.titleHex }}>
                        {tier.price}
                      </span>
                      <span className="text-xs" style={{ color: theme.mutedHex }}>
                        {tier.period}
                      </span>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {tier.features.map((feat, fIdx) => (
                        <li key={fIdx} className="text-xs flex items-center gap-2" style={{ color: theme.textHex }}>
                          <span className="text-emerald-400 font-bold text-xs">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className={`w-full py-2 rounded-xl text-xs font-bold text-center transition-all ${
                      tier.highlight ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800/80 text-slate-200'
                    }`}
                  >
                    Select Plan
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TEAM BIO LAYOUT */}
          {slide.layout === 'team-bio' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 my-auto">
              {(slide.content.teamMembers?.length ? slide.content.teamMembers : [
                { name: 'Elena Vance', role: 'Chief Executive Officer', bio: 'Former VP of Strategy with 15+ years leading enterprise cloud transformations.' },
                { name: 'Dr. Marcus Thorne', role: 'Head of AI & Research', bio: 'PhD in Machine Learning from Stanford; published author with 12 AI patents.' },
                { name: 'Aria Chen', role: 'VP of Product Design', bio: 'Award-winning design lead passionate about frictionless developer tools.' },
              ]).map((member, mIdx) => (
                <div
                  key={mIdx}
                  className={`p-5 border flex flex-col items-center text-center smooth-card-hover ${getCardRadius()}`}
                  style={{
                    backgroundColor: theme.cardBgHex,
                    borderColor: theme.cardBorderHex,
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full mb-3 flex items-center justify-center font-bold text-base shadow-inner border"
                    style={{
                      backgroundColor: `${accentHex}20`,
                      borderColor: `${accentHex}50`,
                      color: accentHex,
                    }}
                  >
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <h4 className="font-bold text-sm mb-0.5" style={{ color: theme.titleHex }}>
                    {member.name}
                  </h4>
                  <span className="text-[11px] font-medium mb-2.5" style={{ color: accentHex }}>
                    {member.role}
                  </span>
                  <p className="text-xs leading-relaxed" style={{ color: theme.mutedHex }}>
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* FAQ ACCORDION LAYOUT */}
          {slide.layout === 'faq-accordion' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              {(slide.content.faqItems?.length ? slide.content.faqItems : [
                { question: 'How quickly can our team deploy this?', answer: 'Initial rollout requires less than 48 hours with zero disruption to legacy databases.' },
                { question: 'What security standards are supported?', answer: 'Enterprise-grade SOC2 Type II, HIPAA, and GDPR compliance out-of-the-box.' },
                { question: 'Can we customize typography and styling?', answer: 'Yes! Full theme customizer with 10+ Google Fonts, custom color palettes, and brand guidelines.' },
                { question: 'Can presentations be exported to PowerPoint?', answer: 'Native PPTX export produces 100% editable Microsoft PowerPoint vector slides.' },
              ]).map((faq, fIdx) => (
                <div
                  key={fIdx}
                  className={`p-4 border flex flex-col justify-between smooth-card-hover ${getCardRadius()}`}
                  style={{
                    backgroundColor: theme.cardBgHex,
                    borderColor: theme.cardBorderHex,
                  }}
                >
                  <h5 className="font-bold text-xs mb-1.5 flex items-start gap-2" style={{ color: theme.titleHex }}>
                    <span className="font-black text-xs" style={{ color: accentHex }}>Q:</span>
                    <span>{faq.question}</span>
                  </h5>
                  <p className="text-xs leading-relaxed pl-5" style={{ color: theme.textHex }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* CODE SNIPPET / DEVELOPER LAYOUT */}
          {slide.layout === 'code-snippet' && (
            <div className={`p-5 border my-2 font-mono flex flex-col shadow-2xl ${getCardRadius()}`} style={{ backgroundColor: '#05070f', borderColor: theme.cardBorderHex }}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-slate-300 font-bold">deckcraft.config.ts</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">TypeScript</span>
              </div>
              <pre className="text-xs leading-relaxed text-slate-300 overflow-x-auto p-2">
                <code>{slide.content.codeSnippet?.code || `// Initialize DeckCraft Client
import { DeckCraft } from '@deckcraft/sdk';

const deck = await DeckCraft.generate({
  topic: 'Series A Pitch Deck',
  theme: 'midnight-gold',
  slides: 8,
  exportFormat: ['pptx', 'pdf'],
});

console.log('Deck created successfully in 1.4s!');`}</code>
              </pre>
              <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{slide.content.codeSnippet?.notes || '⚡ Zero-configuration SDK with TypeScript autocompletion.'}</span>
                <span style={{ color: accentHex }} className="font-bold">v2.4.0</span>
              </div>
            </div>
          )}

          {/* CALLOUT HERO / CONCLUSION LAYOUT */}
          {(slide.layout === 'conclusion' || slide.layout === 'callout-hero') && (
            <div className="space-y-6 max-w-3xl my-auto">
              <p className="text-lg lg:text-xl font-medium leading-relaxed" style={{ color: theme.titleHex }}>
                {slide.content.headline || (slide.content.bodyParagraphs && slide.content.bodyParagraphs[0])}
              </p>

              {slide.content.calloutBox && (
                <div
                  className="p-6 rounded-2xl border flex flex-col gap-1.5 shadow-lg"
                  style={{
                    backgroundColor: theme.cardBgHex,
                    borderColor: accentHex,
                  }}
                >
                  <span className="font-extrabold text-sm uppercase tracking-wider" style={{ color: accentHex }}>
                    {slide.content.calloutBox.title}
                  </span>
                  <span className="text-sm font-bold" style={{ color: theme.titleHex }}>
                    {slide.content.calloutBox.text}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* DIAGRAM LAYOUT */}
          {slide.layout === 'diagram' && (
            <DiagramRenderer
              diagram={slide.content.diagram}
              theme={theme}
              isEditable={true}
              onUpdateStep={(idx, field, val) => {
                if (!slide.content.diagram) return;
                const steps = [...slide.content.diagram.steps];
                steps[idx] = { ...steps[idx], [field]: val };
                onUpdateSlide({
                  ...slide,
                  content: {
                    ...slide.content,
                    diagram: { ...slide.content.diagram, steps },
                  },
                });
              }}
            />
          )}

          {/* QUOTE LAYOUT */}
          {slide.layout === 'quote' && slide.content.quote && (
            <div className="max-w-3xl my-auto p-8 rounded-2xl border relative shadow-lg" style={{ backgroundColor: theme.cardBgHex, borderColor: theme.cardBorderHex }}>
              <QuoteIcon size={32} className="opacity-20 mb-3" style={{ color: accentHex }} />
              <textarea
                value={slide.content.quote.text}
                onChange={(e) =>
                  onUpdateSlide({
                    ...slide,
                    content: {
                      ...slide.content,
                      quote: { ...slide.content.quote!, text: e.target.value },
                    },
                  })
                }
                className="w-full bg-transparent text-lg lg:text-xl font-editorial italic leading-relaxed focus:outline-none resize-none"
                style={{ color: theme.titleHex }}
              />
              <div className="mt-4 flex items-center gap-3 border-t pt-3" style={{ borderColor: theme.cardBorderHex }}>
                <div>
                  <input
                    type="text"
                    value={slide.content.quote.author}
                    onChange={(e) =>
                      onUpdateSlide({
                        ...slide,
                        content: {
                          ...slide.content,
                          quote: { ...slide.content.quote!, author: e.target.value },
                        },
                      })
                    }
                    className="font-bold text-sm bg-transparent focus:outline-none"
                    style={{ color: accentHex }}
                  />
                  <input
                    type="text"
                    value={slide.content.quote.role || ''}
                    onChange={(e) =>
                      onUpdateSlide({
                        ...slide,
                        content: {
                          ...slide.content,
                          quote: { ...slide.content.quote!, role: e.target.value },
                        },
                      })
                    }
                    className="text-xs bg-transparent focus:outline-none block"
                    style={{ color: theme.mutedHex }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* IMAGE FEATURE LAYOUT */}
          {slide.content.image?.url && (
            <div className="my-3 rounded-2xl overflow-hidden border max-h-64 flex justify-center shadow-lg" style={{ borderColor: theme.cardBorderHex }}>
              <img src={slide.content.image.url} alt="Slide Visual" className="object-cover h-full w-full max-h-60" />
            </div>
          )}
        </div>

        {/* Footer / Brand Footer */}
        <div className="relative z-10 flex items-center justify-between text-[11px] pt-4 border-t mt-auto" style={{ borderColor: theme.cardBorderHex }}>
          <span className="font-bold tracking-wider opacity-60" style={{ color: theme.mutedHex }}>
            DeckCraft.ai
          </span>

          {/* Quick Image Generator Toggle */}
          <div className="flex items-center gap-2">
            {!slide.content.image?.url && (
              <button
                onClick={() => setShowImagePromptInput(!showImagePromptInput)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800/80 shadow-sm"
              >
                <ImageIcon size={12} className="text-cyan-400" />
                <span>+ AI Image</span>
              </button>
            )}

            <span className="opacity-60 font-semibold" style={{ color: theme.mutedHex }}>
              Slide {slide.id.split('-').pop()}
            </span>
          </div>
        </div>

        {/* AI Image Generation Overlay Input */}
        {showImagePromptInput && (
          <div className="absolute bottom-16 left-8 right-8 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-400" />
                Generate Visual Graphic with Gemini
              </span>
              <button onClick={() => setShowImagePromptInput(false)} className="text-xs text-slate-400 hover:text-white">
                Cancel
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe image visual..."
                className="flex-1 bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleCreateImage}
                disabled={isGeneratingImage}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 shadow-md"
              >
                {isGeneratingImage ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                <span>Generate</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
