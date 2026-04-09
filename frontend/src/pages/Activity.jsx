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

const ActivityPage = () => {
  const activities = [
    { id: 1, type: 'create', user: 'Admin', action: 'created task', target: 'Project Kickoff', time: '10 mins ago', icon: Plus, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 2, type: 'status', user: 'Sarah M.', action: 'completed', target: 'UI Design Review', time: '1 hour ago', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 3, type: 'update', user: 'James W.', action: 'updated description of', target: 'API Specs', time: '4 hours ago', icon: RefreshCcw, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 4, type: 'join', user: 'Emily B.', action: 'joined the organization', target: '', time: 'Yesterday', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 5, type: 'delete', user: 'Admin', action: 'deleted task', target: 'Obsolete Feature', time: '2 days ago', icon: Trash2, color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

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
        {activities.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-6 relative"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm ${item.bg} ${item.color}`}>
              <item.icon size={20} />
            </div>
            
            <Card className="flex-1 p-6 border-none shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                   <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-900">{item.user}</span> {item.action}
                      {item.target && <span className="font-bold text-indigo-600"> {item.target}</span>}
                   </p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-wider">{item.time}</span>
              </div>
              
              {/* Optional Detail Preview */}
              <div className="mt-4 pt-4 border-t border-slate-50">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> IP: 192.168.1.1
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-2" /> Device: Chrome (MacOS)
                 </div>
              </div>
            </Card>
          </motion.div>
        ))}
        
        <div className="pt-8 text-center">
           <button className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Load older activity...</button>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
