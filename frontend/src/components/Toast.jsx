import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-2xl animate-slide-in-right md:bottom-8 md:right-8 max-w-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
        isSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
      }`}>
        {isSuccess ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900">
          {isSuccess ? 'Success' : 'Error'}
        </p>
        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
          {message}
        </p>
      </div>
      <button 
        onClick={onClose}
        className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
