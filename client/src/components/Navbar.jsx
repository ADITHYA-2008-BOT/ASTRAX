import React, { useState } from 'react';
import {
  Atom,
  Shield,
  Layers,
  FilePlus,
  Compass,
  UserCheck,
  LogIn,
  LogOut,
  Menu,
  X,
  Activity,
  Cpu,
} from 'lucide-react';

export const Navbar = ({
  activeView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onSignOut,
  securityStatus,
  onOpenTelemetry,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full glass-hud border-b border-cyber-cyan/20 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate('hero')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyber-darker border border-cyber-cyan/50 shadow-cyan-glow group-hover:border-cyber-cyan transition-colors">
            <Atom className="w-5 h-5 text-cyber-cyan group-hover:rotate-180 transition-transform duration-700" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyber-neon animate-pulse" />
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-extrabold text-base tracking-widest text-white">
                AERO<span className="text-cyber-cyan">NULL</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30 telemetry-badge">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 telemetry-badge tracking-wider hidden sm:block">
              QUANTUM LEVITATION & METRIC ARCHIVE
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            onClick={() => onNavigate('hero')}
            className={`px-3.5 py-2 rounded-lg font-display text-xs tracking-wider uppercase transition-all flex items-center space-x-2 ${
              activeView === 'hero'
                ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40 shadow-cyan-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>01 // Levitation Lab</span>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3.5 py-2 rounded-lg font-display text-xs tracking-wider uppercase transition-all flex items-center space-x-2 ${
              activeView === 'dashboard'
                ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40 shadow-cyan-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>02 // Research Repository</span>
          </button>

          <button
            onClick={() => onNavigate('submit')}
            className={`px-3.5 py-2 rounded-lg font-display text-xs tracking-wider uppercase transition-all flex items-center space-x-2 ${
              activeView === 'submit'
                ? 'bg-cyber-purple/20 text-purple-300 border border-cyber-purple/50 shadow-purple-glow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>03 // Submit Theory</span>
          </button>
        </div>

        {/* Security Telemetry & Physicist Identity */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={onOpenTelemetry}
            title="Inspect Backend Security Telemetry"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-cyber-darker/80 border border-slate-800 hover:border-cyber-cyan telemetry-badge text-[11px] text-slate-300 cursor-pointer transition-all shadow-none hover:shadow-cyan-glow"
          >
            <Shield className="w-3.5 h-3.5 text-cyber-neon" />
            <span>HELMET + RLS: ACTIVE</span>
          </button>

          {currentUser ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-cyan/30 text-xs">
                <UserCheck className="w-3.5 h-3.5 text-cyber-cyan" />
                <span className="text-slate-200 font-medium max-w-[140px] truncate">
                  {currentUser.user_metadata?.full_name || currentUser.email}
                </span>
              </div>
              <button
                onClick={onSignOut}
                title="Sign Out"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-cyber-outline text-xs flex items-center space-x-2"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connect Identity</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center space-x-2">
          {currentUser ? (
            <button
              onClick={onSignOut}
              className="p-2 text-slate-300 hover:text-rose-400"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-2.5 py-1 text-xs rounded bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-display"
            >
              Auth
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-800 flex flex-col space-y-2">
          <button
            onClick={() => { onNavigate('hero'); setMobileMenuOpen(false); }}
            className={`px-4 py-2.5 text-left rounded-lg text-xs font-display uppercase tracking-wider ${
              activeView === 'hero' ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'text-slate-400'
            }`}
          >
            01 // Levitation Lab
          </button>
          <button
            onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
            className={`px-4 py-2.5 text-left rounded-lg text-xs font-display uppercase tracking-wider ${
              activeView === 'dashboard' ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'text-slate-400'
            }`}
          >
            02 // Research Repository
          </button>
          <button
            onClick={() => { onNavigate('submit'); setMobileMenuOpen(false); }}
            className={`px-4 py-2.5 text-left rounded-lg text-xs font-display uppercase tracking-wider ${
              activeView === 'submit' ? 'bg-cyber-purple/20 text-purple-300' : 'text-slate-400'
            }`}
          >
            03 // Submit Theory
          </button>
        </div>
      )}
    </nav>
  );
};
