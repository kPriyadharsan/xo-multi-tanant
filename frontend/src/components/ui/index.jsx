import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg',
    secondary: 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    glass: 'glass text-indigo-600 hover:bg-white/90',
  };

  return (
    <button
      className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', glass = false }) => {
  return (
    <div className={`${glass ? 'glass' : 'bg-white border border-slate-200'} rounded-2xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const Input = ({ label, error, prefix, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</label>}
      <div className="relative group">
        {prefix && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          className={`w-full ${prefix ? 'pl-11' : 'px-4'} py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 bg-white/50`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-pink-600 ml-1">{error}</p>}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-6 border-b border-slate-50">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        </div>
        <div className="px-6 py-8">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 bg-slate-50/50 flex flex-col md:flex-row gap-3 justify-end italic text-xs text-slate-400">
             {footer}
          </div>
        )}
      </div>
    </div>
  );
};
