import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        const borderColor = isSuccess
          ? 'border-emerald-500/50 shadow-emerald-500/20'
          : isError
          ? 'border-rose-500/50 shadow-rose-500/20'
          : isWarning
          ? 'border-amber-500/50 shadow-amber-500/20'
          : 'border-cyber-cyan/50 shadow-cyber-cyan/20';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start p-4 rounded-xl glass-hud border ${borderColor} shadow-lg transition-all transform translate-y-0`}
          >
            <div className="flex-shrink-0 mt-0.5 mr-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-cyber-cyan" />}
            </div>

            <div className="flex-1 mr-2">
              {toast.title && (
                <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-white">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
