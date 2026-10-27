'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none no-print">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100'
                : isError
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-100'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-100'
                : 'bg-slate-900/95 border-sky-500/50 text-sky-100'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <XCircle className="w-5 h-5 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-sky-400" />}
            </div>

            <div className="flex-1 pr-2">
              <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>
              <p className="text-xs mt-1 text-slate-300 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
