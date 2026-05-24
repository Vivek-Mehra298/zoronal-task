import React, { useState } from 'react';
import { X, Mail, Lock, User, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors = {};
    if (isSignUp && !formData.fullName.trim()) {
      tempErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setFormData({
      fullName: '',
      email: '',
      password: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Simulate server-side authentication delay
    setTimeout(() => {
      setSubmitting(false);
      const loggedUser = {
        name: isSignUp ? formData.fullName : formData.email.split('@')[0],
        email: formData.email,
      };
      onSuccess(loggedUser);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-slide-up border border-slate-100 flex flex-col">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex justify-center mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-white shadow-md border border-white/20">
              <ShieldCheck className="h-7 w-7" />
            </div>
          </div>
          <h2 className="font-display text-xl font-bold">
            {isSignUp ? 'Create an Account' : 'Sign In Required'}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            {isSignUp 
              ? 'Join Zoronal Reviews to register and rate companies.' 
              : 'Please log in to add new companies and share insights.'}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm outline-none transition-all ${
                    errors.fullName 
                      ? 'border-rose-300 bg-rose-50/25 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                      : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.fullName}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm outline-none transition-all ${
                  errors.email 
                    ? 'border-rose-300 bg-rose-50/25 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                    : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••"
                className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm outline-none transition-all ${
                  errors.password 
                    ? 'border-rose-300 bg-rose-50/25 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
                    : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce"></span>
              </span>
            ) : (
              isSignUp ? 'Create Account & Continue' : 'Sign In & Continue'
            )}
          </button>

          {/* Social login divider for rich aesthetics */}
          <div className="relative py-2 flex items-center justify-center">
            <span className="absolute w-full border-t border-slate-100"></span>
            <span className="relative bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Secure Auth
            </span>
          </div>

          {/* Toggle Switch */}
          <div className="text-center text-xs text-slate-500 mt-2">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-bold text-blue-600 hover:text-blue-800 focus:outline-none ml-1 transition-colors"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-bold text-blue-600 hover:text-blue-800 focus:outline-none ml-1 transition-colors"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
