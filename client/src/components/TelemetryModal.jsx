import React from 'react';
import { X, ShieldCheck, Cpu, HardDrive, Zap, CheckCircle2, RefreshCw } from 'lucide-react';

export const TelemetryModal = ({ isOpen, onClose, healthStatus, onRefresh }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl glass-hud rounded-2xl p-6 sm:p-8 border border-cyber-cyan/40 shadow-cyan-glow-lg">
        {/* Glowing Corner Accents */}
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

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyber-darker border border-cyber-neon/40 flex items-center justify-center text-cyber-neon shadow-cyan-glow">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">
              AeroNull Cyber Defense & Telemetry Node
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Live Express Backend Status & System Armor
            </p>
          </div>
        </div>

        {healthStatus ? (
          <div className="space-y-4">
            {/* Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-cyber-darker border border-slate-800 text-xs font-mono">
                <span className="text-slate-500 text-[10px] block">NODE STATUS</span>
                <span className="text-emerald-400 font-bold text-sm flex items-center space-x-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 inline" />
                  <span>{healthStatus.status}</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cyber-darker border border-slate-800 text-xs font-mono">
                <span className="text-slate-500 text-[10px] block">UPTIME</span>
                <span className="text-white font-bold text-sm mt-0.5 block">
                  {healthStatus.uptime}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cyber-darker border border-slate-800 text-xs font-mono">
                <span className="text-slate-500 text-[10px] block">RSS MEMORY</span>
                <span className="text-cyber-cyan font-bold text-sm mt-0.5 block">
                  {healthStatus.telemetry?.rssMemoryMb} MB
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cyber-darker border border-slate-800 text-xs font-mono">
                <span className="text-slate-500 text-[10px] block">HEAP ALLOC</span>
                <span className="text-purple-300 font-bold text-sm mt-0.5 block">
                  {healthStatus.telemetry?.heapUsedMb} MB
                </span>
              </div>
            </div>

            {/* Shield Details */}
            <div className="p-4 rounded-xl bg-cyber-darker border border-slate-800 space-y-2 text-xs font-mono">
              <div className="font-display font-semibold uppercase text-slate-300 text-[11px] mb-2">
                Active Cyber Defense Shields:
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Helmet Headers:</span>
                <span className="text-emerald-300">{healthStatus.securityShields?.helmetHeaders}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">CORS Lockdown:</span>
                <span className="text-cyber-cyan">{healthStatus.securityShields?.corsProtection}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Rate Limiting:</span>
                <span className="text-cyber-neon">{healthStatus.securityShields?.rateLimiting}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Zod Schema Armor:</span>
                <span className="text-purple-300">{healthStatus.securityShields?.zodValidation}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">PostgreSQL Database:</span>
                <span className="text-emerald-300">{healthStatus.integrations?.supabasePostgres}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gemini Physics AI:</span>
                <span className="text-purple-300">{healthStatus.integrations?.geminiPhysicsAI}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400 font-mono">
            Connecting to AeroNull API Gateway...
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="btn-cyber-cyan py-2 px-5 text-xs"
          >
            Close Telemetry HUD
          </button>
        </div>
      </div>
    </div>
  );
};
