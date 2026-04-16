import React from 'react';
import { Card, Button } from '../components/ui';
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
  }, [fetchLogs]);

  const getIcon = (action) => {
    if (action.includes('CREATED')) return Plus;
    if (action.includes('UPDATED')) return RefreshCcw;
    if (action.includes('DELETED')) return Trash2;
    return FileText;
  };

  const getColor = (action) => {
    if (action.includes('CREATED')) return 'text-emerald-600 bg-emerald-50';
    if (action.includes('UPDATED')) return 'text-amber-600 bg-amber-50';
    if (action.includes('DELETED')) return 'text-pink-600 bg-pink-50';
    return 'text-indigo-600 bg-indigo-50';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                <History size={18} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600/60">System Logs</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-black themed-text tracking-tight"
          >
            Intelligence <span className="text-gradient">Pulse</span>
          </motion.h1>
          <p className="text-slate-500 mt-2 font-medium">Track all signals and actions performed within your workspace.</p>
        </div>
        <div className="flex gap-4">
            <Button variant="secondary" className="px-6 py-3 text-xs font-black uppercase tracking-widest border-slate-200">Export Signals</Button>
            <Button className="px-6 py-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20">
                <FileText size={16} className="mr-2" /> Forensic Reports
            </Button>
        </div>
      </div>

      <div className="relative space-y-10 before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
        {logs.length > 0 ? logs.map((item, i) => {
          const Icon = getIcon(item.action);
          const colorClass = getColor(item.action);
          return (
            <motion.div
              key={item._id || i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group flex items-start gap-8 relative"
            >
              <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shrink-0 z-10 border-4 border-white dark:border-slate-900 shadow-xl group-hover:scale-110 transition-transform ${colorClass}`}>
                <Icon size={24} />
              </div>
              
              <Card className="flex-1 p-8 border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/[0.02] rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 text-xs font-black border border-indigo-50">
                        {(item.user?.name?.[0] || 'U').toUpperCase()}
                     </div>
                     <div>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed">
                            <span className="font-black text-slate-900">{item.user?.name || 'Unknown Intelligence'}</span> 
                            {' ' + item.action.toLowerCase().replace('_', ' ') + ' '}
                            <span className="font-black text-indigo-600 border-b-2 border-indigo-100 pb-0.5"> {item.details.split(': ')[1] || item.details}</span>
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                           <History size={12} className="text-indigo-600/40" />
                           {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                     </div>
                  </div>
                </div>
                
                {/* System Metadata Tags */}
                <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 relative z-10">
                  <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-800">
                        <FileText size={12} className="text-slate-300" />
                        <span>Protocol: {item.action}</span>
                      </div>
                      {item.ipAddress && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600/60 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100/50 dark:border-indigo-900/50">
                          <CheckCircle2 size={12} className="text-indigo-400" />
                          <span>Origin: {item.ipAddress === '::1' || item.ipAddress === '127.0.0.1' ? 'Local Terminal' : item.ipAddress}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/50 rounded-xl text-[10px] font-black text-emerald-600/60 uppercase tracking-widest border border-emerald-100/50 ml-auto">
                        <span>Status: Verified</span>
                      </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        }) : (
          <div className="text-center py-20 opacity-20">
             <History size={64} className="mx-auto mb-4" />
             <p className="text-xl font-black uppercase tracking-widest">Quiet in the terminal</p>
          </div>
        )}
        
        {logs.length > 5 && (
          <div className="pt-10 text-center">
             <Button variant="ghost" className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 py-6 w-full glass rounded-3xl">Infinite Stream Monitoring</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;
