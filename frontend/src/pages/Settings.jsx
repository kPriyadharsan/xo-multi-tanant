import React from 'react';
import { Card, Button, Input } from '../components/ui';
import { 
  Bell, 
  Shield, 
  Building, 
  Palette, 
  Smartphone, 
  CreditCard,
  Key,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="max-w-5xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your application preferences and configurations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1 space-y-2">
             {['General', 'Notifications', 'Security', 'Billing', 'Appearance'].map((item, idx) => (
               <button 
                  key={item}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-semibold ${
                     idx === 0 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
               >
                  {item}
               </button>
             ))}
          </div>

          {/* Settings Form */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Building size={20} className="text-indigo-600" /> Organization Settings
                </h3>
                <div className="space-y-6">
                    <Input label="Workspace Name" defaultValue={user?.organization?.name || 'My Workspace'} />
                    <Input label="Subdomain" defaultValue={user?.tenantId || 'my-workspace'} disabled />
                    
                    <div>
                        <p className="text-sm font-bold text-slate-700 mb-2">Timezone</p>
                        <select className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium text-slate-600">
                            <option>UTC (Coordinated Universal Time)</option>
                            <option>EST (Eastern Standard Time)</option>
                            <option>PST (Pacific Standard Time)</option>
                        </select>
                    </div>
                </div>
            </Card>

            <Card className="p-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Bell size={20} className="text-pink-600" /> Notifications
                </h3>
                <div className="space-y-6">
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div>
                         <p className="text-sm font-bold text-slate-900">Email Notifications</p>
                         <p className="text-xs text-slate-500 mt-1">Receive daily summaries and activity updates.</p>
                      </div>
                      <div className="w-12 h-6 bg-indigo-600 rounded-full cursor-pointer relative shadow-inner">
                         <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                   </div>
                   
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100">
                      <div>
                         <p className="text-sm font-bold text-slate-900">Push Notifications</p>
                         <p className="text-xs text-slate-500 mt-1">Real-time alerts for mentions and assignments.</p>
                      </div>
                      <div className="w-12 h-6 bg-indigo-600 rounded-full cursor-pointer relative shadow-inner">
                         <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                   </div>
                </div>
            </Card>

            <Card className="p-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Palette size={20} className="text-amber-500" /> Interface & Theme
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="cursor-pointer group flex flex-col gap-3">
                        <div className="h-24 rounded-2xl bg-white border-2 border-indigo-600 shadow-md p-2 flex flex-col gap-2">
                            <div className="w-full h-3 bg-slate-100 rounded" />
                            <div className="w-2/3 h-3 bg-slate-100 rounded" />
                        </div>
                        <p className="text-center text-xs font-bold text-indigo-600">Light</p>
                    </div>
                    <div className="cursor-pointer group flex flex-col gap-3">
                        <div className="h-24 rounded-2xl bg-slate-900 border-2 border-transparent group-hover:border-slate-300 transition-colors shadow-sm p-2 flex flex-col gap-2">
                            <div className="w-full h-3 bg-slate-800 rounded" />
                            <div className="w-2/3 h-3 bg-slate-800 rounded" />
                        </div>
                        <p className="text-center text-xs font-bold text-slate-500">Dark</p>
                    </div>
                    <div className="cursor-pointer group flex flex-col gap-3">
                        <div className="h-24 rounded-2xl bg-gradient-to-br from-indigo-50 to-pink-50 border-2 border-transparent group-hover:border-slate-300 transition-colors shadow-sm p-2 flex flex-col gap-2">
                            <div className="w-full h-3 bg-white/50 rounded" />
                            <div className="w-2/3 h-3 bg-white/50 rounded" />
                        </div>
                        <p className="text-center text-xs font-bold text-slate-500">System</p>
                    </div>
                </div>
            </Card>
            
            <div className="flex justify-end pt-4">
                <Button className="px-8 shadow-lg shadow-indigo-600/20">Save Changes</Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
