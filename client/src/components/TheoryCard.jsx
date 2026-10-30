import React, { useState } from 'react';
import {
  Sparkles,
  ThumbsUp,
  ExternalLink,
  Tag,
  BookOpen,
  Calendar,
  User,
  FlaskConical,
  Atom,
} from 'lucide-react';

export const TheoryCard = ({
  theory,
  onOpenModal,
  onSummarize,
  onUpvote,
  isSummarizing,
}) => {
  const [upvoting, setUpvoting] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Peer Reviewed':
        return 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300';
      case 'Experimental Prototype':
        return 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300';
      case 'Lab Simulation':
        return 'bg-purple-950/70 border-purple-500/50 text-purple-300';
      case 'Mathematical Model':
        return 'bg-blue-950/70 border-blue-500/50 text-blue-300';
      default:
        return 'bg-amber-950/70 border-amber-500/50 text-amber-300';
    }
  };

  const handleUpvoteClick = async (e) => {
    e.stopPropagation();
    if (upvoting) return;
    setUpvoting(true);
    try {
      await onUpvote(theory.id);
    } finally {
      setUpvoting(false);
    }
  };

  const handleAiClick = (e) => {
    e.stopPropagation();
    onSummarize(theory);
  };

  return (
    <div
      onClick={() => onOpenModal(theory)}
      className="group relative glass-hud glass-hud-hover rounded-2xl p-6 border border-slate-800 hover:border-cyber-cyan/40 cursor-pointer flex flex-col justify-between transition-all duration-300"
    >
      <div>
        {/* Card Header: Status & Framework */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-display uppercase tracking-wider border ${getStatusColor(
              theory.experimental_status
            )}`}
          >
            {theory.experimental_status}
          </span>

          <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
            <Atom className="w-3 h-3 text-cyber-purple" />
            <span className="truncate max-w-[140px]">{theory.theoretical_framework}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-base font-bold text-white group-hover:text-cyber-cyan transition-colors line-clamp-2 mb-2 leading-snug">
          {theory.title}
        </h3>

        {/* Abstract Snippet */}
        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
          {theory.abstract}
        </p>

        {/* Mathematical Formula Display if available */}
        {theory.formula_latex && (
          <div className="p-2.5 rounded-lg bg-cyber-darker border border-slate-800 text-[11px] font-mono text-cyan-300 mb-4 overflow-x-auto truncate">
            <code>${theory.formula_latex}$</code>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {theory.tags?.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono"
            >
              #{tag}
            </span>
          ))}
          {theory.tags?.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 text-slate-500 font-mono">
              +{theory.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Telemetry & Actions */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
        {/* Author / Date */}
        <div className="flex items-center space-x-3 text-slate-400 text-[11px] font-mono">
          <span className="flex items-center space-x-1 truncate max-w-[100px]">
            <User className="w-3 h-3 text-slate-500" />
            <span>{theory.author_email?.split('@')[0] || 'Physicist'}</span>
          </span>

          <button
            onClick={handleUpvoteClick}
            disabled={upvoting}
            className="flex items-center space-x-1 text-slate-300 hover:text-cyber-neon transition-colors"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{theory.upvotes || 0}</span>
          </button>
        </div>

        {/* Action Button: AI Summarize */}
        <button
          onClick={handleAiClick}
          disabled={isSummarizing}
          className="btn-cyber-outline py-1 px-2.5 text-[10px] flex items-center space-x-1.5 shadow-none hover:shadow-cyan-glow"
        >
          {isSummarizing ? (
            <span className="inline-block w-3 h-3 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Sparkles className="w-3 h-3 text-cyber-cyan" />
          )}
          <span>{theory.ai_summary ? 'View AI Summary' : 'Gemini AI Analyze'}</span>
        </button>
      </div>
    </div>
  );
};
