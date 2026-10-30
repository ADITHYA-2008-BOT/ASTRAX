import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroView } from './components/HeroView';
import { DashboardView } from './components/DashboardView';
import { SubmissionView } from './components/SubmissionView';
import { AuthModal } from './components/AuthModal';
import { TelemetryModal } from './components/TelemetryModal';
import { Toast } from './components/Toast';
import { authService } from './lib/supabase';
import { api } from './lib/api';
import { Atom, Shield, ShieldCheck, Cpu } from 'lucide-react';

export function App() {
  const [activeView, setActiveView] = useState('hero'); // 'hero' | 'dashboard' | 'submit'
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);

  // Add toast helper
  const showToast = ({ type = 'info', title, message }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshHealth = () => {
    api.getHealth()
      .then((res) => {
        setHealthStatus(res);
      })
      .catch((err) => {
        console.warn('Backend telemetry check:', err.message);
      });
  };

  // Check initial user and health
  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      if (user) setCurrentUser(user);
    });

    const unsubscribe = authService.onAuthStateChange((user) => {
      setCurrentUser(user);
    });

    refreshHealth();

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await authService.signOut();
    setCurrentUser(null);
    showToast({
      type: 'info',
      title: 'Session Closed',
      message: 'Physicist identity signed out cleanly.',
    });
  };

  return (
    <div className="min-h-screen bg-cyber-black text-slate-100 flex flex-col font-sans selection:bg-cyber-cyan selection:text-cyber-black">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        onNavigate={setActiveView}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
        securityStatus={healthStatus}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'hero' && <HeroView onNavigate={setActiveView} />}
        {activeView === 'dashboard' && (
          <DashboardView onNavigate={setActiveView} onShowToast={showToast} />
        )}
        {activeView === 'submit' && (
          <SubmissionView
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onNavigate={setActiveView}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Global Futuristic Cyber Footer */}
      <footer className="glass-hud border-t border-slate-800/80 py-8 px-4 sm:px-8 mt-12 text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Atom className="w-4 h-4 text-cyber-cyan" />
            <span className="font-display font-bold text-white tracking-wider">
              AERO<span className="text-cyber-cyan">NULL</span>
            </span>
            <span>// Quantum Levitation & Spacetime Metric Repository</span>
          </div>

          <div
            onClick={() => setIsTelemetryOpen(true)}
            title="Open Live Telemetry HUD"
            className="flex flex-wrap items-center gap-4 text-[11px] cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="text-slate-500">Security Armor (Click to inspect):</span>
            <span className="text-cyber-cyan">Helmet CSP</span>
            <span className="text-cyber-neon">Rate-Limited</span>
            <span className="text-purple-400">Zod Validated</span>
            <span className="text-emerald-400">PostgreSQL RLS</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
        onShowToast={showToast}
      />

      {/* Backend Security & Telemetry Modal */}
      <TelemetryModal
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
        healthStatus={healthStatus}
        onRefresh={refreshHealth}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
