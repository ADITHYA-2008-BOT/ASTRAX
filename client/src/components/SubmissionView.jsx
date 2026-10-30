import React, { useState } from 'react';
import {
  FilePlus,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Tag,
  BookOpen,
  Atom,
  HelpCircle,
  Eye,
  Lock,
  Plus,
  X,
  Layers,
} from 'lucide-react';
import { api } from '../lib/api';
import {
  validateTheoryForm,
  EXPERIMENTAL_STATUSES,
  THEORETICAL_FRAMEWORKS,
} from '../lib/validation';

// Pre-configured Physics Templates for quick testing
const PRESET_TEMPLATES = [
  {
    name: 'Casimir Negative Energy Cavity',
    title: 'High-Frequency Dynamic Casimir Cavities for Spacetime Contraction',
    abstract:
      'We examine high-Q optical micro-cavities driven by femtosecond ultraviolet lasers to perturb boundary vacuum modes. The resulting expectation value <T_00> exhibits negative energy densities in localized corridors, satisfying Ford-Roman quantum inequality thresholds and producing metric stress deviations.',
    theoretical_framework: 'Alcubierre Metric & Spacetime Warping',
    formula_latex: 'E_{\\text{Casimir}} = -\\frac{\\pi^2 \\hbar c}{720 d^3} A',
    experimental_status: 'Mathematical Model',
    tags: ['casimir-effect', 'negative-energy', 'quantum-vacuum', 'warp-cavity'],
    citations: ['Casimir, H. B. G. (1948)', 'Ford, L. H. & Roman, T. A. (1995)'],
  },
  {
    name: 'Gravito-Magnetic Induction',
    title: 'Coupled London Moment & Frame-Dragging in Cryogenic Helium-4 Vortices',
    abstract:
      'Rotating superfluid Helium-4 generates quantized macroscopic vortex lines. Under high-speed rotation in a cryogenic Dewar, the coupled circulation of angular momentum creates an axial gravito-magnetic field Bg, attenuating local gravitational acceleration through Heaviside-Maxwell Maxwellian induction.',
    theoretical_framework: 'Gravito-Electromagnetism (GEM)',
    formula_latex: '\\mathbf{B}_g = -2\\boldsymbol{\\omega} + \\nabla \\times \\mathbf{A}_g',
    experimental_status: 'Lab Simulation',
    tags: ['gravito-electromagnetism', 'superfluid', 'frame-dragging', 'london-moment'],
    citations: ['Heaviside, O. (1893)', 'Tajmar, M. & de Matos, C. J. (2006)'],
  },
];

export const SubmissionView = ({
  currentUser,
  onOpenAuth,
  onNavigate,
  onShowToast,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    theoretical_framework: 'Quantum Field Theory',
    formula_latex: '',
    experimental_status: 'Hypothesis',
    tags: ['quantum-gravity', 'metric-engineering'],
    citations: ['General Relativity & Quantum Mechanics Foundations (2025)'],
    author_email: currentUser?.email || '',
  });

  const [tagInput, setTagInput] = useState('');
  const [citationInput, setCitationInput] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Load a preset template
  const handleLoadPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      ...preset,
      author_email: currentUser?.email || prev.author_email,
    }));
    setErrors({});
    onShowToast({
      type: 'info',
      title: 'Template Loaded',
      message: `Applied "${preset.name}" preset parameters.`,
    });
  };

  // Add Tag
  const handleAddTag = (e) => {
    e?.preventDefault();
    const cleanTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9\-]/g, '');
    if (cleanTag && !formData.tags.includes(cleanTag) && formData.tags.length < 10) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, cleanTag] }));
      setTagInput('');
      setErrors((prev) => ({ ...prev, tags: undefined }));
    }
  };

  // Remove Tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // Add Citation
  const handleAddCitation = (e) => {
    e?.preventDefault();
    const cleanCite = citationInput.trim();
    if (cleanCite && !formData.citations.includes(cleanCite)) {
      setFormData((prev) => ({
        ...prev,
        citations: [...prev.citations, cleanCite],
      }));
      setCitationInput('');
    }
  };

  // Remove Citation
  const handleRemoveCitation = (index) => {
    setFormData((prev) => ({
      ...prev,
      citations: prev.citations.filter((_, i) => i !== index),
    }));
  };

  // Insert LaTeX Snippet
  const handleInsertLatex = (symbol) => {
    setFormData((prev) => ({
      ...prev,
      formula_latex: prev.formula_latex ? `${prev.formula_latex} ${symbol}` : symbol,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enforce Authentication Check
    if (!currentUser) {
      onShowToast({
        type: 'warning',
        title: 'Authentication Required',
        message: 'Please connect your identity or select 1-Click Guest Pass to submit research.',
      });
      onOpenAuth();
      return;
    }

    // Validate payload strictly via client-side Zod schema
    const validation = validateTheoryForm({
      ...formData,
      author_email: currentUser.email || formData.author_email || 'researcher@aeronull.org',
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      onShowToast({
        type: 'error',
        title: 'Validation Failed',
        message: 'Please resolve payload errors highlighted in the submission console.',
      });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const response = await api.createTheory(validation.data);

      if (response.success) {
        onShowToast({
          type: 'success',
          title: 'Research Enrolled',
          message: 'Your physics theory has been validated and recorded with Supabase RLS.',
        });

        // Reset form
        setFormData({
          title: '',
          abstract: '',
          theoretical_framework: 'Quantum Field Theory',
          formula_latex: '',
          experimental_status: 'Hypothesis',
          tags: ['quantum-gravity'],
          citations: [],
          author_email: currentUser.email || '',
        });

        // Redirect to dashboard to view newly added theory
        setTimeout(() => {
          onNavigate('dashboard');
        }, 1200);
      }
    } catch (err) {
      console.error('Submission error:', err);
      if (err.details && Array.isArray(err.details)) {
        const fieldErrors = {};
        err.details.forEach((d) => {
          fieldErrors[d.field] = d.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ _general: err.message || 'Submission failed. Server security alert triggered.' });
      }

      onShowToast({
        type: 'error',
        title: 'Submission Refused',
        message: err.message || 'The server rejected the payload.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="mb-8 pb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-display text-cyber-purple telemetry-badge uppercase mb-1.5">
            <Atom className="w-4 h-4 text-cyber-purple" />
            <span>Submission Protocol // Zod Schema + Supabase RLS</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Register Physics Hypothesis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Submit novel antigravity formulations, Casimir cavities, or superconducting models. Payloads undergo strict Zod schema validation before persistence.
          </p>
        </div>

        {/* Quick Load Presets */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-display uppercase tracking-wider text-slate-400 hidden sm:inline">
            Load Template:
          </span>
          {PRESET_TEMPLATES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadPreset(p)}
              className="px-2.5 py-1.5 rounded-lg bg-cyber-darker border border-slate-700 hover:border-cyber-cyan text-[11px] font-mono text-slate-300 hover:text-cyber-cyan transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Auth Banner if Guest or Disconnected */}
      {!currentUser && (
        <div className="mb-8 p-4 rounded-xl glass-hud border border-amber-500/40 bg-amber-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-xs text-amber-200">
            <Lock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>
              Authentication required for Row-Level Security insertion. You can authenticate via Supabase or enter instantly using the 1-Click Guest Pass.
            </span>
          </div>
          <button onClick={onOpenAuth} className="btn-cyber-cyan text-xs py-1.5 px-3 flex-shrink-0">
            Authenticate Identity
          </button>
        </div>
      )}

      {errors._general && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-500/50 flex items-start space-x-3 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{errors._general}</span>
        </div>
      )}

      {/* Main Grid: Form on Left, Live Telemetry Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Title */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-display uppercase tracking-wider text-slate-300">
                Theory Title <span className="text-cyber-cyan">*</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {formData.title.length} / 255 chars (min 5)
              </span>
            </div>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setErrors({ ...errors, title: undefined });
              }}
              placeholder="e.g. Macroscopic Flux Pinning in High-Tc Superconducting Metamaterials"
              className={`w-full bg-cyber-darker border rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
                errors.title ? 'border-rose-500' : 'border-slate-800 focus:border-cyber-cyan'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-rose-400">{errors.title}</p>}
          </div>

          {/* Framework & Experimental Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display uppercase tracking-wider text-slate-300 mb-1">
                Theoretical Framework <span className="text-cyber-cyan">*</span>
              </label>
              <select
                value={formData.theoretical_framework}
                onChange={(e) =>
                  setFormData({ ...formData, theoretical_framework: e.target.value })
                }
                className="w-full bg-cyber-darker border border-slate-800 focus:border-cyber-cyan rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
              >
                {THEORETICAL_FRAMEWORKS.map((fw) => (
                  <option key={fw} value={fw}>
                    {fw}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-display uppercase tracking-wider text-slate-300 mb-1">
                Experimental Status <span className="text-cyber-cyan">*</span>
              </label>
              <select
                value={formData.experimental_status}
                onChange={(e) =>
                  setFormData({ ...formData, experimental_status: e.target.value })
                }
                className="w-full bg-cyber-darker border border-slate-800 focus:border-cyber-cyan rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
              >
                {EXPERIMENTAL_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mathematical Formulation (LaTeX) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-display uppercase tracking-wider text-slate-300">
                Mathematical Formulation (LaTeX)
              </label>
              <div className="flex items-center space-x-1.5">
                {['\\nabla \\times', '\\partial', 'T_{\\mu\\nu}', '\\hbar', '\\oint', 'ds^2'].map(
                  (sym, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleInsertLatex(sym)}
                      className="px-1.5 py-0.5 rounded bg-cyber-surface border border-slate-800 text-[10px] text-cyan-300 hover:border-cyber-cyan font-mono"
                    >
                      {sym}
                    </button>
                  )
                )}
              </div>
            </div>
            <textarea
              rows={2}
              value={formData.formula_latex}
              onChange={(e) => setFormData({ ...formData, formula_latex: e.target.value })}
              placeholder="e.g. \nabla \times \mathbf{B}_g = -\frac{4\pi G}{c^2} \mathbf{J}_m + \frac{1}{c^2}\frac{\partial \mathbf{E}_g}{\partial t}"
              className="w-full bg-cyber-darker border border-slate-800 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none transition-colors"
            />
          </div>

          {/* Abstract */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-display uppercase tracking-wider text-slate-300">
                Theoretical Abstract & Physical Mechanism <span className="text-cyber-cyan">*</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {formData.abstract.length} / 5000 (min 30)
              </span>
            </div>
            <textarea
              rows={5}
              required
              value={formData.abstract}
              onChange={(e) => {
                setFormData({ ...formData, abstract: e.target.value });
                setErrors({ ...errors, abstract: undefined });
              }}
              placeholder="Detail the physical hypothesis, boundary conditions, metric perturbation tensor, and laboratory verification proposal..."
              className={`w-full bg-cyber-darker border rounded-xl p-4 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-colors leading-relaxed ${
                errors.abstract ? 'border-rose-500' : 'border-slate-800 focus:border-cyber-cyan'
              }`}
            />
            {errors.abstract && <p className="mt-1 text-xs text-rose-400">{errors.abstract}</p>}
          </div>

          {/* Physics Tags */}
          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-slate-300 mb-1">
              Physics Classification Tags (Max 10) <span className="text-cyber-cyan">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                placeholder="e.g. meissner-effect, flux-pinning"
                className="flex-1 bg-cyber-darker border border-slate-800 focus:border-cyber-cyan rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn-cyber-outline text-xs px-3 py-2 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cyber-surface border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-400 transition-colors ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            {errors.tags && <p className="mt-1 text-xs text-rose-400">{errors.tags}</p>}
          </div>

          {/* Citations */}
          <div>
            <label className="block text-xs font-display uppercase tracking-wider text-slate-300 mb-1">
              Academic Literature Citations (Optional)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={citationInput}
                onChange={(e) => setCitationInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCitation(e)}
                placeholder="e.g. Podkletnov, E. (1992) Physica C"
                className="flex-1 bg-cyber-darker border border-slate-800 focus:border-cyber-cyan rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCitation}
                className="btn-cyber-outline text-xs px-3 py-2 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {formData.citations.length > 0 && (
              <ul className="space-y-1 text-xs font-mono text-slate-300">
                {formData.citations.map((cite, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-cyber-darker border border-slate-800"
                  >
                    <span className="truncate pr-2">• {cite}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCitation(idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-cyber-cyan py-3.5 flex items-center justify-center space-x-2 text-xs tracking-wider"
          >
            {submitting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-cyber-black border-t-transparent rounded-full animate-spin"></span>
                <span>CRYPTOGRAPHIC VERIFICATION IN PROGRESS...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>DISPATCH & ENROLL QUANTUM THEORY</span>
              </>
            )}
          </button>
        </form>

        {/* Live Telemetry Preview Column */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between text-xs font-display uppercase tracking-wider text-slate-400">
              <span className="flex items-center space-x-1.5 text-cyber-cyan">
                <Eye className="w-4 h-4" />
                <span>Live Telemetry Preview</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Real-time Render</span>
            </div>

            <div className="glass-hud rounded-2xl p-6 border border-cyber-cyan/30 shadow-hud space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-display uppercase tracking-wider bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan">
                  {formData.experimental_status}
                </span>
                <span className="text-[10px] text-purple-300 font-mono">
                  {formData.theoretical_framework}
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-white leading-snug">
                {formData.title || 'Untitled Physics Theory'}
              </h3>

              {formData.formula_latex && (
                <div className="p-3 rounded-lg bg-cyber-darker border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                  <code>${formData.formula_latex}$</code>
                </div>
              )}

              <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed whitespace-pre-line">
                {formData.abstract ||
                  'Your abstract and physical mechanism description will be previewed here in real-time as you formulate your research...'}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Author: {currentUser?.email || 'Authenticated User'}</span>
                <span className="text-cyber-neon flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>RLS Ready</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
