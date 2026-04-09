import React from 'react';
import OverviewStats from '../components/dashboard/OverviewStats';
import TaskCharts from '../components/dashboard/TaskCharts';
import { Card, Button } from '../components/ui';
import { Plus, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';
import useTaskStore from '../store/useTaskStore';

const DashboardOverview = () => {
  const { tasks } = useTaskStore();
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-1">Here's what's happening in your organization today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="hidden sm:flex items-center gap-2">
            View Reports <ArrowUpRight size={16} />
          </Button>
          <Button className="flex items-center gap-2">
            <Plus size={20} /> New Project
          </Button>
        </div>
      </div>

      <OverviewStats />
      
      <TaskCharts />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Recent Tasks */}
        <Card className="lg:col-span-2 p-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Recent Tasks</h3>
            <Button variant="ghost" className="text-sm">See all</Button>
          </div>
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400 border border-slate-100'
                  }`}>
                    {task.status === 'completed' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 leading-none mb-1.5">{task.title}</h5>
                    <p className="text-xs text-slate-500 flex items-center gap-2 px-1">
                       <span className={`w-1.5 h-1.5 rounded-full ${
                          task.priority === 'high' ? 'bg-pink-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                       }`} />
                       {task.priority} Priority
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-slate-700">Deadline</p>
                      <p className="text-[10px] text-slate-400">2 days left</p>
                   </div>
                   <button className="p-2 text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight size={20} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Team Activity */}
        <Card className="p-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="text-lg font-bold text-slate-800 mb-8">Team Activity</h3>
          <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {[
              { user: 'Sarah Miller', action: 'completed', task: 'Design System', time: '2h ago' },
              { user: 'James Wilson', action: 'added', task: 'API Documentation', time: '4h ago' },
              { user: 'Emily Brown', action: 'started', task: 'Mobile UI Kit', time: 'Yesterday' }
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold z-10 border-4 border-white">
                  {activity.user[0]}
                </div>
                <div>
                   <p className="text-xs text-slate-500 leading-tight">
                      <span className="font-bold text-slate-900">{activity.user}</span> {activity.action} 
                      <span className="font-bold text-indigo-600"> {activity.task}</span>
                   </p>
                   <p className="text-[10px] text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="w-full mt-10">View Log</Button>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
