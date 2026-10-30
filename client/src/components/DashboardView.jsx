import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Layers,
  Sparkles,
  FlaskConical,
  BookOpen,
  ThumbsUp,
  AlertCircle,
  FilePlus,
  Atom,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../lib/api';
import { TheoryCard } from './TheoryCard';
import { TheoryModal } from './TheoryModal';
import { EXPERIMENTAL_STATUSES, THEORETICAL_FRAMEWORKS } from '../lib/validation';

export const DashboardView = ({ onNavigate, onShowToast }) => {
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSandbox, setIsSandbox] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedFramework, setSelectedFramework] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');

  // Modal & AI State
  const [activeModalTheory, setActiveModalTheory] = useState(null);
  const [summarizingId, setSummarizingId] = useState(null);

  // Fetch Theories from Express Backend API
  const loadTheories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getTheories({
        search: search.trim() || undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        framework: selectedFramework !== 'All' ? selectedFramework : undefined,
        tag: selectedTag !== 'All' ? selectedTag : undefined,
      });

      if (response.success) {
        setTheories(response.data || []);
        setIsSandbox(response.meta?.isSandbox || false);
      } else {
        throw new Error(response.error?.message || 'Failed to load theories.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Unable to connect to AeroNull API gateway.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTheories();
    }, 250); // Debounce search
    return () => clearTimeout(timer);
  }, [search, selectedStatus, selectedFramework, selectedTag]);

  // Handle AI Summarization
  const handleSummarize = async (theory) => {
    setSummarizingId(theory.id);
    try {
      const response = await api.summarizeTheory({
        theoryId: theory.id,
        title: theory.title,
        abstract: theory.abstract,
        theoretical_framework: theory.theoretical_framework,
        formula_latex: theory.formula_latex,
      });

      if (response.success) {
        const updatedSummary = response.data.summary;
        // Update local theories list
        setTheories((prev) =>
          prev.map((t) => (t.id === theory.id ? { ...t, ai_summary: updatedSummary } : t))
        );

        // If modal is open for this theory, update modal state
        if (activeModalTheory && activeModalTheory.id === theory.id) {
          setActiveModalTheory((prev) => ({ ...prev, ai_summary: updatedSummary }));
        }

        onShowToast({
          type: 'success',
          title: response.data.isLiveAi ? 'Gemini AI Analysis Complete' : 'Neural Core Synthesis Ready',
          message: `Generated 3-section physics breakdown for "${theory.title.slice(0, 32)}..."`,
        });
      }
    } catch (err) {
      onShowToast({
        type: 'error',
        title: 'AI Analysis Error',
        message: err.message || 'Rate limit reached or failed to connect to Gemini API.',
      });
    } finally {
      setSummarizingId(null);
    }
  };

  // Handle Peer Upvote
  const handleUpvote = async (theoryId) => {
    try {
      // Optimistic update
      setTheories((prev) =>
        prev.map((t) => (t.id === theoryId ? { ...t, upvotes: (t.upvotes || 0) + 1 } : t))
      );
      if (activeModalTheory && activeModalTheory.id === theoryId) {
        setActiveModalTheory((prev) => ({ ...prev, upvotes: (prev.upvotes || 0) + 1 }));
      }

      await api.upvoteTheory(theoryId);
      onShowToast({
        type: 'info',
        title: 'Peer Endorsement Registered',
        message: 'Your cryptographic review signature has been appended.',
      });
    } catch (err) {
      console.warn('Upvote sync issue:', err.message);
    }
  };

  // Available unique tags across theories
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    theories.forEach((t) => t.tags?.forEach((tag) => tagsSet.add(tag)));
    return Array.from(tagsSet);
  }, [theories]);

  // Aggregate stats
  const stats = useMemo(() => {
    const total = theories.length;
    const verified = theories.filter((t) =>
      ['Experimental Prototype', 'Peer Reviewed'].includes(t.experimental_status)
    ).length;
    const endorsements = theories.reduce((acc, t) => acc + (t.upvotes || 0), 0);
    const withAi = theories.filter((t) => Boolean(t.ai_summary)).length;
    return { total, verified, endorsements, withAi };
  }, [theories]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Top Banner & Telemetry */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-display text-cyber-cyan telemetry-badge uppercase mb-1.5">
            <Layers className="w-4 h-4 text-cyber-neon" />
            <span>Research Repository // Node Cluster v1.0</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Quantum Physics & Metric Warping Archive
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Live database of experimental anti-gravitational hypotheses, Casimir stress tensors, and superconducting Meissner anomalies.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadTheories}
            disabled={loading}
            className="p-2.5 rounded-xl glass-hud border border-slate-700 hover:border-cyber-cyan text-slate-300 hover:text-white transition-colors"
            title="Refresh Research Feed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyber-cyan' : ''}`} />
          </button>

          <button
            onClick={() => onNavigate('submit')}
            className="btn-cyber-cyan text-xs flex items-center space-x-2 py-2.5 px-4"
          >
            <FilePlus className="w-4 h-4" />
            <span>Submit Theory</span>
          </button>
        </div>
      </div>

      {/* Aggregate Stats HUD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl glass-hud border border-slate-800">
          <div className="text-[11px] font-display uppercase tracking-wider text-slate-400">
            Archived Hypotheses
          </div>
          <div className="text-2xl font-display font-bold text-white mt-1">
            {stats.total} Papers
          </div>
          <div className="text-[10px] text-cyber-cyan font-mono mt-1">PostgreSQL RLS Protected</div>
        </div>

        <div className="p-4 rounded-xl glass-hud border border-slate-800">
          <div className="text-[11px] font-display uppercase tracking-wider text-slate-400">
            Prototypes & Peer-Reviewed
          </div>
          <div className="text-2xl font-display font-bold text-emerald-400 mt-1">
            {stats.verified} Verified
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Cryogenic / Lab Status</div>
        </div>

        <div className="p-4 rounded-xl glass-hud border border-slate-800">
          <div className="text-[11px] font-display uppercase tracking-wider text-slate-400">
            Peer Endorsements
          </div>
          <div className="text-2xl font-display font-bold text-cyber-neon mt-1">
            {stats.endorsements} Citations
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Quorum Attestations</div>
        </div>

        <div className="p-4 rounded-xl glass-hud border border-slate-800">
          <div className="text-[11px] font-display uppercase tracking-wider text-slate-400">
            Gemini AI Summaries
          </div>
          <div className="text-2xl font-display font-bold text-cyber-purple mt-1">
            {stats.withAi} Synthesized
          </div>
          <div className="text-[10px] text-purple-300 font-mono mt-1">Google GenAI Active</div>
        </div>
      </div>

      {/* Search & Filter Controls HUD */}
      <div className="glass-hud rounded-2xl p-5 border border-slate-800 mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search theories by keyword, phenomenon (e.g. 'YBCO', 'Alcubierre', 'Meissner', 'Casimir')..."
            className="w-full bg-cyber-darker border border-slate-800 focus:border-cyber-cyan rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3 text-xs text-slate-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-display uppercase tracking-wider text-slate-400 mr-2 flex items-center space-x-1">
            <Filter className="w-3 h-3 text-cyber-cyan" />
            <span>Status:</span>
          </span>
          {['All', ...EXPERIMENTAL_STATUSES].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-display tracking-wider transition-all ${
                selectedStatus === st
                  ? 'bg-cyber-cyan text-cyber-black font-bold shadow-cyan-glow'
                  : 'bg-cyber-surface/60 text-slate-400 hover:text-white hover:bg-cyber-surface'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Secondary Filters: Framework and Physics Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-[11px] font-display uppercase tracking-wider text-slate-400 mb-1">
              Theoretical Framework
            </label>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="w-full bg-cyber-darker border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyber-cyan"
            >
              <option value="All">All Frameworks</option>
              {THEORETICAL_FRAMEWORKS.map((fw) => (
                <option key={fw} value={fw}>
                  {fw}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-display uppercase tracking-wider text-slate-400 mb-1">
              Physics Tag Focus
            </label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full bg-cyber-darker border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyber-cyan"
            >
              <option value="All">All Physics Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="glass-hud rounded-2xl p-6 border border-slate-800 animate-pulse space-y-4"
            >
              <div className="flex justify-between">
                <div className="w-24 h-4 bg-slate-800 rounded"></div>
                <div className="w-16 h-4 bg-slate-800 rounded"></div>
              </div>
              <div className="w-3/4 h-5 bg-slate-700 rounded"></div>
              <div className="space-y-2">
                <div className="w-full h-3 bg-slate-800 rounded"></div>
                <div className="w-5/6 h-3 bg-slate-800 rounded"></div>
              </div>
              <div className="w-full h-8 bg-slate-800/60 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error Banner */}
      {!loading && error && (
        <div className="p-8 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-center max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h3 className="font-display text-base font-bold text-white mb-2">
            Research Gateway Connection Exception
          </h3>
          <p className="text-xs text-slate-300 mb-4">{error}</p>
          <button onClick={loadTheories} className="btn-cyber-cyan text-xs">
            Retry Gateway Query
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && theories.length === 0 && (
        <div className="text-center py-16 px-4 glass-hud rounded-2xl border border-slate-800 max-w-md mx-auto">
          <Atom className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="font-display text-base font-bold text-white mb-1">
            No Matching Theories Found
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Try adjusting your search criteria or register a new physics hypothesis.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedStatus('All');
              setSelectedFramework('All');
              setSelectedTag('All');
            }}
            className="btn-cyber-outline text-xs"
          >
            Reset Search Filters
          </button>
        </div>
      )}

      {/* Theories Grid */}
      {!loading && !error && theories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {theories.map((theory) => (
            <TheoryCard
              key={theory.id}
              theory={theory}
              onOpenModal={setActiveModalTheory}
              onSummarize={handleSummarize}
              onUpvote={handleUpvote}
              isSummarizing={summarizingId === theory.id}
            />
          ))}
        </div>
      )}

      {/* Detailed Modal with Gemini AI Panel */}
      <TheoryModal
        theory={activeModalTheory}
        isOpen={Boolean(activeModalTheory)}
        onClose={() => setActiveModalTheory(null)}
        onSummarize={handleSummarize}
        onUpvote={handleUpvote}
        isSummarizing={summarizingId === activeModalTheory?.id}
      />
    </div>
  );
};
