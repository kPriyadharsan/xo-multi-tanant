import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/ui';
import { Layout, CheckSquare, Clock, Users, Plus } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-28 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
            <p className="text-slate-600 mt-1">Tenant ID: <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">{user?.tenantId}</code></p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={20} /> New Task
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Active Tasks', value: '12', icon: CheckSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'In Progress', value: '5', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Team Members', value: '24', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Projects', value: '6', icon: Layout, color: 'text-pink-600', bg: 'bg-pink-50' },
          ].map((stat, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tasks Preview */}
        <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Recent Tasks</h2>
                <Button variant="ghost" className="text-sm">View All</Button>
            </div>
            <div className="space-y-4">
                {[1, 2, 3].map((task) => (
                    <div key={task} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-5 h-5 rounded border border-slate-300" />
                            <div>
                                <p className="font-medium text-slate-900">Implement authentication flow #{task}</p>
                                <p className="text-xs text-slate-500">Due in 2 days • High Priority</p>
                            </div>
                        </div>
                        <div className="flex -space-x-2">
                            {[1, 2].map(u => (
                                <div key={u} className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">JD</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
