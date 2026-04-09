import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 rounded-lg" />
          <div className="h-4 w-64 bg-slate-100 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <div className="h-12 w-32 bg-slate-200 rounded-xl" />
          <div className="h-12 w-32 bg-slate-200 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-slate-100 rounded-2xl p-6" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80 bg-slate-100 rounded-2xl" />
        <div className="h-80 bg-slate-100 rounded-2xl" />
      </div>
    </div>
  );
};

export const TaskBoardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 min-h-[500px] space-y-4">
          <div className="h-6 w-32 bg-slate-200 rounded-lg mb-6" />
          {[1, 2].map(j => (
            <div key={j} className="h-48 bg-white rounded-2xl border border-slate-100 p-5" />
          ))}
        </div>
      ))}
    </div>
  );
};
