import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Card } from '../ui';
import useTaskStore from '../../store/useTaskStore';

const TaskCharts = () => {
  const { tasks } = useTaskStore();

  // Calculate activity data from real tasks
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return { 
      day: days[d.getDay()], 
      date: d.toISOString().split('T')[0],
      count: 0 
    };
  }).reverse();

  tasks.forEach(task => {
    const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
    const dayData = last7Days.find(d => d.date === taskDate);
    if (dayData) dayData.count++;
  });

  const data = last7Days.map(d => ({ name: d.day, tasks: d.count }));

  const statusData = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#10b981' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#6366f1' },
    { name: 'Pending', value: tasks.filter(t => t.status === 'todo').length, color: '#f43f5e' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Activity Chart */}
      <Card className="p-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Task Activity</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'var(--card-bg)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)', color: 'var(--text-main)' }} 
              />
              <Area 
                type="monotone" 
                dataKey="tasks" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTasks)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Distribution Chart */}
      <Card className="p-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Task Distribution</h3>
        <div className="h-[300px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'var(--card-bg)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)', color: 'var(--text-main)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-3 ml-4">
            {statusData.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-xs font-bold text-slate-500">{s.name}</span>
                <span className="text-xs font-extrabold text-slate-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TaskCharts;
