import React, { useState } from 'react';
import { X, ShieldCheck, Key, Lock, Mail, User, Sparkles, AlertCircle } from 'lucide-react';
import { authService, isSupabaseConfigured } from '../lib/supabase';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess, onShowToast }) => {
  const [tab, setTab] = useState('guest'); // 'signin', 'signup', 'guest'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (tab === 'guest') {
        user = await authService.signInGuest();
        onShowToast({
          type: 'success',
          title: 'Guest Pass Granted',
          message: 'Authenticated as Dr. Aurelius Vance (Guest Physicist).',
        });
      } else if (tab === 'signin') {
        user = await authService.signIn(email, password);
        onShowToast({
          type: 'success',
          title: 'Identity Verified',
          message: `Welcome back, ${user.email}.`,
        });
      } else if (tab === 'signup') {
        user = await authService.signUp(email, password, fullName);
        onShowToast({
          type: 'success',
          title: 'Physicist Account Registered',
          message: isSupabaseConfigured
            ? 'Confirmation sent. Please check your inbox or sign in.'
            : 'Sandbox physicist account activated.',
        });
      }

      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-hud rounded-2xl p-6 sm:p-8 border border-cyber-cyan/30 shadow-cyan-glow-lg overflow-hidden">
        {/* Futuristic glowing corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-purple"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-purple"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyber-surface border border-cyber-cyan/40 mb-3 shadow-cyan-glow">
            <Lock className="w-6 h-6 text-cyber-cyan" />
          </div>
          <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">
            Physicist Authentication
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Access Row-Level Security (RLS) encrypted research pipeline
          </p>

          <div className="mt-3 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyber-surface/90 border border-slate-700 text-[10px] text-slate-300 telemetry-badge">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-cyber-cyan'
              }`}
            />
            <span>
              {isSupabaseConfigured
                ? 'SUPABASE CLUSTER: CONNECTED'
                : 'LOCAL SANDBOX AUTH: ACTIVE'}
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-cyber-darker p-1 rounded-lg border border-slate-800 mb-6 text-xs font-display">
          <button
            type="button"
            onClick={() => { setTab('guest'); setError(''); }}
            className={`py-2 rounded-md transition-all ${
              tab === 'guest'
                ? 'bg-cyber-cyan text-cyber-black font-semibold shadow-cyan-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1-Click Pass
          </button>
          <button
            type="button"
            onClick={() => { setTab('signin'); setError(''); }}
            className={`py-2 rounded-md transition-all ${
              tab === 'signin'
                ? 'bg-cyber-cyan text-cyber-black font-semibold shadow-cyan-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setError(''); }}
            className={`py-2 rounded-md transition-all ${
              tab === 'signup'
                ? 'bg-cyber-cyan text-cyber-black font-semibold shadow-cyan-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 flex items-start space-x-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'guest' && (
            <div className="p-4 rounded-xl bg-cyber-surface/60 border border-cyber-cyan/30 text-left">
              <div className="flex items-center space-x-2 text-cyber-cyan text-xs font-semibold uppercase font-display mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Instant Sandbox Access</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enter immediately as an authorized Senior Quantum Physicist (<span className="text-cyber-cyan">Dr. Aurelius Vance</span>). This grants instant permission to submit theories and generate Gemini AI summaries without configuring Supabase credentials right now.
              </p>
            </div>
          )}

          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 font-display">
                Full Name / Designation
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Prof. Elena Rostova"
                  className="w-full bg-cyber-darker border border-slate-700 focus:border-cyber-cyan rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {tab !== 'guest' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 font-display">
                  Physicist Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="researcher@aeronull.org"
                    className="w-full bg-cyber-darker border border-slate-700 focus:border-cyber-cyan rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 font-display">
                  Cryptographic Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-cyber-darker border border-slate-700 focus:border-cyber-cyan rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-cyber-cyan py-3 mt-2 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-cyber-black border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {tab === 'guest'
                    ? 'Authenticate as Guest Physicist'
                    : tab === 'signin'
                    ? 'Verify & Sign In'
                    : 'Register Quantum Researcher'}
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
