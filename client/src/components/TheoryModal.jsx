import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Atom,
  ThumbsUp,
  Share2,
  Copy,
  Check,
  BookOpen,
  Calendar,
  User,
  FlaskConical,
  RefreshCw,
  Cpu,
} from 'lucide-react';

export const TheoryModal = ({
  theory,
  isOpen,
  onClose,
  onSummarize,
  onUpvote,
  isSummarizing,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !theory) return null;

  const handleCopySummary = () => {
    if (!theory.ai_summary) return;
    navigator.clipboard.writeText(theory.ai_summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 glass-hud rounded-2xl p-6 sm:p-10 border border-cyber-cyan/30 shadow-cyan-glow-lg overflow-hidden">
        {/* Futuristic glowing corner brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-purple"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-purple"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-1 rounded-lg bg-cyber-darker border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Metadata */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-display uppercase tracking-wider bg-cyber-cyan/15 border border-cyber-cyan text-cyber-cyan">
            {theory.experimental_status}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyber-surface border border-slate-800 text-purple-300">
            {theory.theoretical_framework}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight">
          {theory.title}
        </h2>

        {/* Author / Timestamp / Endorsements Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-4 rounded-xl bg-cyber-darker border border-slate-800 text-xs font-mono text-slate-400 mb-6">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-slate-300">
              <User className="w-4 h-4 text-cyber-cyan" />
              <span>{theory.author_email || 'Verified Researcher'}</span>
            </span>

            <span className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>{new Date(theory.created_at).toLocaleDateString()}</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onUpvote(theory.id)}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyber-surface border border-slate-700 hover:border-cyber-neon text-white transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-cyber-neon" />
              <span>{theory.upvotes || 0} Peer Endorsements</span>
            </button>
          </div>
        </div>

        {/* Mathematical Formulation (LaTeX) */}
        {theory.formula_latex && (
          <div className="mb-6">
            <h4 className="text-xs font-display uppercase tracking-wider text-slate-400 mb-2">
              Mathematical Formulation (LaTeX)
            </h4>
            <div className="p-4 rounded-xl bg-cyber-darker border border-cyber-cyan/30 text-sm font-mono text-cyan-300 overflow-x-auto shadow-hud">
              <code>{theory.formula_latex}</code>
            </div>
          </div>
        )}

        {/* Abstract */}
        <div className="mb-8">
          <h4 className="text-xs font-display uppercase tracking-wider text-slate-400 mb-2">
            Theoretical Abstract & Physics Methodology
          </h4>
          <p className="text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-line p-5 rounded-xl bg-cyber-surface/40 border border-slate-800">
            {theory.abstract}
          </p>
        </div>

        {/* Gemini AI Summarization Section */}
        <div className="mb-8 p-6 rounded-2xl bg-cyber-darker/90 border border-cyber-purple/40 shadow-purple-glow">
          <div className="flex items-center justify-between pb-4 border-b border-purple-900/40 mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyber-purple/20 border border-cyber-purple flex items-center justify-center text-cyber-purple shadow-purple-glow">
                <Sparkles className="w-4 h-4 text-purple-300" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                  <span>Google Gemini AI Physics Analysis</span>
                </h4>
                <p className="text-[11px] text-purple-300/80 font-mono">
                  Synthesizing core mechanism, mathematical feasibility, and experimental roadmap
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {theory.ai_summary && (
                <button
                  onClick={handleCopySummary}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyber-purple text-slate-300 hover:text-white transition-colors"
                  title="Copy AI Summary"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              )}

              <button
                onClick={() => onSummarize(theory)}
                disabled={isSummarizing}
                className="btn-cyber-purple text-xs py-1.5 px-3 flex items-center space-x-1.5"
              >
                {isSummarizing ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>{theory.ai_summary ? 'Regenerate Analysis' : 'Generate Summary'}</span>
              </button>
            </div>
          </div>

          {isSummarizing && (
            <div className="py-8 text-center">
              <div className="inline-block w-8 h-8 border-3 border-cyber-purple border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="font-display text-xs text-purple-300 uppercase tracking-wider animate-pulse">
                Querying Google Gemini Neural Core...
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Evaluating stress-energy tensor eigenvalues and experimental protocols
              </p>
            </div>
          )}

          {!isSummarizing && theory.ai_summary && (
            <div className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-line space-y-3">
              {theory.ai_summary}
            </div>
          )}

          {!isSummarizing && !theory.ai_summary && (
            <div className="py-6 text-center text-xs text-slate-400 font-mono">
              No AI summary generated yet for this paper. Click &quot;Generate Summary&quot; to prompt Google Gemini.
            </div>
          )}
        </div>

        {/* Citations and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800 text-xs">
          {/* Citations */}
          <div>
            <h5 className="font-display uppercase tracking-wider text-slate-400 mb-2">
              Academic Citations & Literature
            </h5>
            {theory.citations && theory.citations.length > 0 ? (
              <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                {theory.citations.map((cite, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-cyber-cyan">•</span>
                    <span>{cite}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 font-mono text-[11px]">No external citations logged.</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <h5 className="font-display uppercase tracking-wider text-slate-400 mb-2">
              Physics Taxonomy Classification
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {theory.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-cyber-darker border border-slate-800 text-cyber-cyan font-mono text-[11px]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
