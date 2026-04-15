import React from 'react';
import { Card } from '../ui';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  BarChart2,
  Zap,
  Star,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import useTaskStore from '../../store/useTaskStore';

const OverviewStats = () => {
  const { tasks } = useTaskStore();
  
  const stats = [
    { 
      label: 'Overall Tasks', 
      value: tasks.length, 
      icon: BarChart2, 
      color: 'indigo', 
      trend: '+12%',
      detail: 'Last 7 days'
    },
    { 
      label: 'Active Development', 
      value: tasks.filter(t => t.status === 'in-progress').length, 
      icon: Activity, 
      color: 'accent', 
      trend: '+3',
      detail: 'In progress'
    },
    { 
      label: 'Completed Tasks', 
      value: tasks.filter(t => t.status === 'completed').length, 
      icon: CheckCircle2, 
      color: 'emerald', 
      trend: '94%',
      detail: 'Success rate'
    },
    { 
      label: 'Priority Urgent', 
      value: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length, 
      icon: Zap, 
      color: 'pink', 
      trend: 'High',
      detail: 'Needs attention'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
           key={i}
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: i * 0.1 }}
           whileHover={{ y: -5 }}
        >
          <Card className="relative p-6 border-none shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] hover:shadow-2xl transition-all duration-500 overflow-hidden group">
            {/* Background Decorative Element */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full blur-3xl group-hover:bg-${stat.color}-500/10 transition-colors`} />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className={`w-14 h-14 bg-${stat.color}-500/10 text-${stat.color}-600 rounded-[1.2rem] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={28} />
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 text-emerald-600 text-[10px] font-black uppercase tracking-widest`}>
                <TrendingUp size={12} />
                {stat.trend}
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-sm font-bold text-slate-400 mb-1.5 uppercase tracking-wide">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-display font-black text-slate-900 leading-none">{stat.value}</p>
                <span className="text-[10px] font-bold text-slate-400 mb-1">{stat.detail}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewStats;
