import React, { useEffect } from 'react';
import OverviewStats from '../components/dashboard/OverviewStats';
import TaskCharts from '../components/dashboard/TaskCharts';
import { Card, Button } from '../components/ui';
import { Plus, ArrowUpRight, Clock, CheckCircle2, TrendingUp, Sparkles, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import useTaskStore from '../store/useTaskStore';
import useLogStore from '../store/useLogStore';
import { useAuth } from '../context/AuthContext';

const DashboardOverview = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const { logs, fetchLogs } = useLogStore();
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
    fetchLogs();
  }, []);

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-10 pb-20">
      {/* Dynamic Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                <Layout size={18} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600/60">Global Overview</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-none"
          >
            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>.
          </motion.h1>
          <p className="text-slate-500 mt-4 font-medium max-w-xl leading-relaxed">
            Everything looks optimized in <span className="font-bold text-slate-900">{user?.organization?.name || 'your space'}</span>. 
            You have <span className="text-indigo-600 font-bold">{tasks.filter(t => t.status === 'in-progress').length} tasks</span> requiring your immediate attention.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button variant="secondary" className="glass px-6 py-4 text-sm font-bold border-slate-200">
            Export Intelligence <ArrowUpRight size={18} className="ml-1 opacity-50" />
          </Button>
          <Button className="px-8 py-4 text-sm font-bold shadow-xl shadow-indigo-600/20 group">
            <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform" /> New Objective
          </Button>
        </div>
      </div>

      <OverviewStats />
      
      <TaskCharts />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
        {/* Recent Intensity Feed */}
        <Card className="lg:col-span-2 p-10 border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-600/10 transition-colors" />
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Recent Projects</h3>
              <p className="text-xs font-bold text-slate-400 mt-1">High fidelity task monitoring</p>
            </div>
            <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white transition-all">Pulse Feed</Button>
          </div>

          <div className="space-y-4 relative z-10">
            {recentTasks.map((task, i) => (
              <motion.div 
                key={task._id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'
                  }`}>
                    {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 leading-none mb-2 tracking-tight">{task.title}</h5>
                    <div className="flex items-center gap-3">
                         <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            task.priority === 'high' ? 'bg-pink-100 text-pink-600' : task.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                         }`}>
                             {task.priority} Priority
                         </span>
                         <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock size={12} /> Updated 2h ago</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-right hidden sm:block">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Efficiency</p>
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                         <div className="w-2/3 h-full bg-indigo-600 rounded-full" />
                      </div>
                   </div>
                   <button className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
                      <ArrowUpRight size={20} />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Activity Intelligence */}
        <Card className="p-10 border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden bg-slate-50 border border-slate-100/50">
          <div className="flex items-center gap-2 mb-10">
             <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
             <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Intelligence Feed</h3>
          </div>
          
          <div className="space-y-10 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-indigo-100/50">
            {logs.length > 0 ? logs.slice(0, 6).map((activity, i) => (
              <motion.div 
                key={activity._id || i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="flex items-start gap-5 relative group"
              >
                <div className="w-10 h-10 rounded-2xl bg-white shadow-md text-indigo-600 flex items-center justify-center text-[10px] font-black z-10 border border-indigo-50 ring-4 ring-slate-50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  {(activity.user?.name?.[0] || 'U').toUpperCase()}
                </div>
                <div className="pt-1">
                   <p className="text-sm text-slate-500 leading-snug font-medium">
                      <span className="font-black text-slate-900">{activity.user?.name || 'Unknown'}</span> 
                      {' ' + activity.action.toLowerCase().replace('_', ' ') + ' '} 
                      <span className="font-black text-indigo-600 border-b border-indigo-200"> {activity.details.split(': ')[1] || activity.details}</span>
                   </p>
                   <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest flex items-center gap-2">
                       <TrendingUp size={12} className="text-emerald-500" />
                       {new Date(activity.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-20 opacity-30">
                 <Sparkles size={40} className="mx-auto mb-4" />
                 <p className="text-sm font-bold uppercase tracking-widest">No signals detected</p>
              </div>
            )}
          </div>
          
          <Button variant="ghost" className="w-full mt-12 py-4 rounded-2xl bg-white border border-slate-200 text-xs font-black uppercase tracking-[0.2em] shadow-sm hover:shadow-xl transition-all">Full Intelligence Logs</Button>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
