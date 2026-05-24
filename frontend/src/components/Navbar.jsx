import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function Navbar({ onBackToHome, showBackButton, user, onSignOut, onSignInClick }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={onBackToHome}
              className="mr-2 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div 
            onClick={onBackToHome} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200 transition-all duration-300 group-hover:rotate-6">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Zoronal
              </span>
              <span className="font-display text-sm font-semibold tracking-wide text-blue-600 ml-1 uppercase">
                Reviews
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-xs font-semibold text-slate-500 md:inline">
                Hi, <span className="text-slate-800 font-bold">{user.name}</span>
              </span>
              <button
                onClick={onSignOut}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors uppercase tracking-wider cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onSignInClick}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Sign In
            </button>
          )}
          <span className="hidden h-4 w-px bg-slate-200 sm:block"></span>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Verified
          </div>
        </div>
      </div>
    </header>
  );
}
