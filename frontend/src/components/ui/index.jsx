import React from 'react';
import { Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', loading = false, disabled, ...props }) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg',
    secondary: 'themed-bg themed-text border themed-border hover:bg-slate-50 dark:hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50',
    glass: 'glass text-indigo-600 hover:bg-white/90',
  };

  return (
    <button
      className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', glass = false }) => {
  return (
    <div className={`${glass ? 'glass' : 'themed-bg themed-border border'} rounded-2xl overflow-hidden shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export const Input = ({ label, error, prefix, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-bold themed-text mb-2 ml-1 opacity-60 uppercase tracking-widest">{label}</label>}
      <div className="relative group">
        {prefix && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          className={`w-full ${prefix ? 'pl-11' : 'px-4'} py-3.5 rounded-xl border themed-border focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300 themed-bg themed-text placeholder:text-slate-400`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-bold text-pink-600 ml-1">{error}</p>}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative glass rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] w-full max-w-xl overflow-hidden themed-border border"
          >
            {/* Modal Header */}
            <div className="px-8 pt-8 pb-6 flex items-center justify-between themed-bg">
              <h3 className="text-2xl font-black themed-text tracking-tight">{title}</h3>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-all"
              >
                 <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-8 py-4 themed-text themed-bg max-h-[70vh] overflow-y-auto no-scrollbar">
              {children}
            </div>

            {/* Modal Footer */}
            {footer && (
              <div className="px-8 py-8 themed-bg border-t themed-border flex flex-col sm:flex-row gap-4 justify-end">
                 {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
