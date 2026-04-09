import React from 'react';
import { Card } from '../ui';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  BarChart2,
  Calendar
} from 'lucide-react';
import useTaskStore from '../../store/useTaskStore';

const OverviewStats = () => {
  const { tasks } = useTaskStore();
  
  const stats = [
    { 
      label: 'Total Tasks', 
      value: tasks.length, 
      icon: BarChart2, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      trend: '+12% from last week'
    },
    { 
      label: 'In Progress', 
      value: tasks.filter(t => t.status === 'in-progress').length, 
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      trend: '2 urgent'
    },
    { 
      label: 'Completed', 
      value: tasks.filter(t => t.status === 'completed').length, 
      icon: CheckCircle2, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      trend: '85% success rate'
    },
    { 
      label: 'Pending', 
      value: tasks.filter(t => t.status === 'todo').length, 
      icon: AlertCircle, 
      color: 'text-pink-600', 
      bg: 'bg-pink-50',
      trend: 'Needs attention'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <Card key={i} className="p-6 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-500" />
              {stat.trend}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 mb-1">{stat.label}</p>
            <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default OverviewStats;
