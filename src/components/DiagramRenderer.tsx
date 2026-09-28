import React from 'react';
import { DiagramData, ThemeConfig } from '../types/presentation';
import { ArrowRight, CheckCircle2, ChevronRight, Layers, Lightbulb, Shield, Sparkles, Zap } from 'lucide-react';

interface Props {
  diagram?: DiagramData;
  theme: ThemeConfig;
  onUpdateStep?: (index: number, field: 'title' | 'desc', value: string) => void;
  isEditable?: boolean;
}

export const DiagramRenderer: React.FC<Props> = ({
  diagram,
  theme,
  onUpdateStep,
  isEditable = false,
}) => {
  if (!diagram || !diagram.steps || diagram.steps.length === 0) {
    return (
      <div className="p-8 border border-dashed border-slate-700/60 rounded-xl text-center text-slate-400">
        No diagram data available
      </div>
    );
  }

  const { type = 'process', steps } = diagram;

  // Process Flow Diagram (Horizontal Pipeline)
  if (type === 'process' || type === 'timeline') {
    return (
      <div className="w-full my-4">
        {diagram.title && (
          <h4 className="text-xs uppercase tracking-wider font-semibold mb-4 text-slate-400">
            {diagram.title}
          </h4>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
          {steps.map((step, idx) => (
            <div
              key={step.id || idx}
              className="relative flex flex-col p-4.5 rounded-2xl transition-all duration-300 border smooth-card-hover"
              style={{
                backgroundColor: theme.cardBgHex,
                borderColor: theme.cardBorderHex,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                  style={{
                    backgroundColor: `${theme.accentHex}20`,
                    color: theme.accentHex,
                  }}
                >
                  0{idx + 1}
                </span>
                {step.badge && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded text-slate-400 bg-slate-800/60">
                    {step.badge}
                  </span>
                )}
              </div>

              {isEditable ? (
                <>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => onUpdateStep && onUpdateStep(idx, 'title', e.target.value)}
                    className="font-bold text-sm bg-transparent border-b border-slate-700/50 pb-1 mb-2 focus:outline-none focus:border-indigo-500"
                    style={{ color: theme.titleHex }}
                  />
                  <textarea
                    value={step.desc}
                    onChange={(e) => onUpdateStep && onUpdateStep(idx, 'desc', e.target.value)}
                    className="text-xs bg-transparent border border-slate-800 rounded p-1 focus:outline-none focus:border-indigo-500 resize-none h-16"
                    style={{ color: theme.textHex }}
                  />
                </>
              ) : (
                <>
                  <h5 className="font-bold text-sm mb-1" style={{ color: theme.titleHex }}>
                    {step.title}
                  </h5>
                  <p className="text-xs leading-relaxed" style={{ color: theme.mutedHex }}>
                    {step.desc}
                  </p>
                </>
              )}

              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 items-center justify-center text-slate-400 shadow-sm">
                  <ChevronRight size={12} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Grid / Matrix Diagram
  return (
    <div className="w-full my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, idx) => (
          <div
            key={step.id || idx}
            className="p-4 rounded-xl border flex gap-3 items-start"
            style={{
              backgroundColor: theme.cardBgHex,
              borderColor: theme.cardBorderHex,
            }}
          >
            <div
              className="p-2.5 rounded-lg shrink-0"
              style={{
                backgroundColor: `${theme.accentHex}15`,
                color: theme.accentHex,
              }}
            >
              <Zap size={18} />
            </div>

            <div className="flex-1">
              {isEditable ? (
                <>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => onUpdateStep && onUpdateStep(idx, 'title', e.target.value)}
                    className="font-bold text-sm bg-transparent border-b border-slate-700 pb-1 mb-1 w-full focus:outline-none"
                    style={{ color: theme.titleHex }}
                  />
                  <input
                    type="text"
                    value={step.desc}
                    onChange={(e) => onUpdateStep && onUpdateStep(idx, 'desc', e.target.value)}
                    className="text-xs bg-transparent border-none w-full focus:outline-none"
                    style={{ color: theme.textHex }}
                  />
                </>
              ) : (
                <>
                  <h5 className="font-bold text-sm mb-1" style={{ color: theme.titleHex }}>
                    {step.title}
                  </h5>
                  <p className="text-xs leading-relaxed" style={{ color: theme.textHex }}>
                    {step.desc}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
