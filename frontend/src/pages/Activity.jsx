import React from 'react';
import { Card } from '../components/ui';
import { 
  History, 
  Plus, 
  CheckCircle2, 
  RefreshCcw, 
  Trash2, 
  UserPlus, 
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

import useLogStore from '../store/useLogStore';

const ActivityPage = () => {
  const { logs, fetchLogs } = useLogStore();

  React.useEffect(() => {
    fetchLogs();
  }, []);

  const getIcon = (action) => {
    if (action.includes('CREATED')) return Plus;
    if (action.includes('UPDATED')) return RefreshCcw;
    if (action.includes('DELETED')) return Trash2;
    return FileText;
  };

  const getColor = (action) => {
    if (action.includes('CREATED')) return 'text-indigo-600 bg-indigo-50';
    if (action.includes('UPDATED')) return 'text-amber-600 bg-amber-50';
    if (action.includes('DELETED')) return 'text-pink-600 bg-pink-50';
    return 'text-slate-600 bg-slate-50';
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
             <History size={32} className="text-indigo-600" /> Activity Logs
          </h1>
          <p className="text-slate-500 mt-2">Track all actions performed within your workspace.</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-xl transition-all">Export JSON</button>
            <button className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl transition-all hover:bg-slate-800 flex items-center gap-2">
                <FileText size={14} /> Download PDF
            </button>
        </div>
      </div>

      <div className="relative space-y-8 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
        {logs.length > 0 ? logs.map((item, i) => {
          const Icon = getIcon(item.action);
          const colorClass = getColor(item.action);
          return (
            <motion.div
              key={item._id || i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-6 relative"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm ${colorClass}`}>
                <Icon size={20} />
              </div>
              
              <Card className="flex-1 p-6 border-none shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        <span className="font-bold text-slate-900">{item.user?.name || 'User'}</span> {item.action.toLowerCase().replace('_', ' ')}
                        <span className="font-bold text-indigo-600"> {item.details.split(': ')[1] || item.details}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Optional Detail Preview */}
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-100" /> Action: {item.action}
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-100 ml-2" /> Target: {item.targetType}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        }) : (
          <p className="text-center py-10 text-slate-400">No activity logs found</p>
        )}
        
        <div className="pt-8 text-center">
           <button className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Load older activity...</button>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
