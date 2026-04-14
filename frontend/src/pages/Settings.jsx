import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/ui';
import { 
  Bell, 
  Building, 
  Palette, 
  Shield,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('General');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isSaving, setIsSaving] = useState(false);
  
  // States for various settings
  const [workspaceName, setWorkspaceName] = useState(user?.organization?.name || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      // Logic for updating workspace (Admin only)
      if (user?.role !== 'admin') {
         toast.error("Only admins can change organization settings.");
         setIsSaving(false);
         return;
      }
      
      // Simulate API call
      setTimeout(() => {
        toast.success("Workspace settings updated!");
        setIsSaving(false);
      }, 1000);
      
    } catch (err) {
      toast.error("Failed to update settings");
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'General', icon: Building },
    { id: 'Notifications', icon: Bell },
    { id: 'Appearance', icon: Palette },
    { id: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 px-4"
      >
        <div>
          <h1 className="text-3xl font-bold themed-text">Settings</h1>
          <p className="text-sm font-medium opacity-60 mt-1">Manage your application preferences and configurations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1 space-y-2">
             {tabs.map((tab) => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                     activeTab === tab.id 
                     ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                     : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
               >
                  <tab.icon size={18} />
                  {tab.id}
               </button>
             ))}
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'General' && (
                <motion.div key="general" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Card className="p-8">
                      <h3 className="text-lg font-bold themed-text mb-6 flex items-center gap-2">
                          <Building size={20} className="text-indigo-600" /> Organization Settings
                      </h3>
                      <div className="space-y-6 text-left">
                          <Input 
                            label="Workspace Name" 
                            value={workspaceName} 
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            disabled={user?.role !== 'admin'}
                          />
                          <Input label="Organization ID" value={user?.organization?._id || ''} disabled className="opacity-70" />
                          
                          <div>
                              <label className="block text-sm font-medium themed-text mb-1.5 ml-1 opacity-80">Primary Timezone</label>
                              <select className="w-full px-4 py-3 rounded-xl themed-bg border themed-border outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium themed-text focus:bg-white dark:focus:bg-slate-800">
                                  <option>UTC (Coordinated Universal Time)</option>
                                  <option>EST (Eastern Standard Time)</option>
                                  <option>IST (Indian Standard Time)</option>
                                  <option>PST (Pacific Standard Time)</option>
                              </select>
                          </div>
                          
                          {user?.role === 'admin' && (
                            <div className="pt-4 border-t themed-border flex justify-end">
                                <Button onClick={handleSaveGeneral} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                                    Save Workspace
                                </Button>
                            </div>
                          )}
                      </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'Notifications' && (
                <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Card className="p-8">
                      <h3 className="text-lg font-bold themed-text mb-6 flex items-center gap-2">
                          <Bell size={20} className="text-pink-600" /> Notifications
                      </h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-5 rounded-2xl themed-bg border themed-border">
                            <div className="text-left">
                              <p className="text-sm font-bold themed-text">Email Notifications</p>
                              <p className="text-xs opacity-60 mt-1">Receive daily summaries and critical project updates.</p>
                            </div>
                            <button 
                              onClick={() => setEmailNotifications(!emailNotifications)}
                              className={`w-12 h-6 rounded-full relative transition-all ${emailNotifications ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                              <motion.div 
                                animate={{ x: emailNotifications ? 26 : 4 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                              />
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between p-5 rounded-2xl themed-bg border themed-border">
                            <div className="text-left">
                              <p className="text-sm font-bold themed-text">Push Notifications</p>
                              <p className="text-xs opacity-60 mt-1">Get real-time alerts for @mentions and task assignments.</p>
                            </div>
                            <button 
                              onClick={() => setPushNotifications(!pushNotifications)}
                              className={`w-12 h-6 rounded-full relative transition-all ${pushNotifications ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                              <motion.div 
                                animate={{ x: pushNotifications ? 26 : 4 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                              />
                            </button>
                        </div>
                      </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'Appearance' && (
                <motion.div key="appearance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Card className="p-8">
                      <h3 className="text-lg font-bold themed-text mb-6 flex items-center gap-2">
                          <Palette size={20} className="text-amber-500" /> Interface & Theme
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div 
                            onClick={() => setTheme('light')}
                            className={`cursor-pointer group flex flex-col gap-3 p-4 rounded-3xl border-2 transition-all ${theme === 'light' ? 'border-indigo-600 bg-white shadow-lg' : 'border-transparent bg-slate-50 opacity-100 hover:border-slate-200'}`}
                          >
                              <div className="h-32 rounded-2xl bg-white border border-slate-200 p-4 flex flex-col gap-3">
                                  <div className="w-full h-4 bg-slate-50 rounded-lg shadow-sm" />
                                  <div className="w-2/3 h-4 bg-slate-50 rounded-lg shadow-sm" />
                                  <div className="flex gap-2 mt-auto">
                                      <div className="w-6 h-6 rounded-full bg-indigo-600" />
                                      <div className="w-6 h-6 rounded-full bg-pink-500" />
                                  </div>
                              </div>
                              <p className={`text-center text-sm font-bold ${theme === 'light' ? 'text-indigo-600' : 'text-slate-400'}`}>
                                Light Mode
                              </p>
                          </div>

                          <div 
                            onClick={() => setTheme('dark')}
                            className={`cursor-pointer group flex flex-col gap-3 p-4 rounded-3xl border-2 transition-all ${theme === 'dark' ? 'border-indigo-600 bg-slate-900 shadow-lg' : 'border-transparent bg-slate-900 opacity-70 hover:opacity-100 hover:border-slate-700'}`}
                          >
                              <div className="h-32 rounded-2xl bg-slate-800 border border-slate-700 p-4 flex flex-col gap-3">
                                  <div className="w-full h-4 bg-slate-700 rounded-lg shadow-sm" />
                                  <div className="w-2/3 h-4 bg-slate-700 rounded-lg shadow-sm" />
                                  <div className="flex gap-2 mt-auto">
                                      <div className="w-6 h-6 rounded-full bg-indigo-500" />
                                      <div className="w-6 h-6 rounded-full bg-pink-400" />
                                  </div>
                              </div>
                              <p className={`text-center text-sm font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`}>
                                Dark Mode
                              </p>
                          </div>
                      </div>
                  </Card>
                </motion.div>
              )}
              
              {activeTab === 'Security' && (
                <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Card className="p-8">
                      <h3 className="text-lg font-bold themed-text mb-6 flex items-center gap-2">
                          <Shield size={20} className="text-emerald-500" /> Security
                      </h3>
                      <div className="space-y-6 text-left">
                        <Input label="Current Password" type="password" placeholder="••••••••" />
                        <Input label="New Password" type="password" placeholder="••••••••" />
                        <div className="pt-4 flex justify-end">
                           <Button variant="secondary" onClick={() => toast("Security settings are simulated for now.")}>Update Security</Button>
                        </div>
                      </div>

                      {user?.role === 'admin' && (
                        <div className="mt-10 pt-10 border-t themed-border text-left">
                           <h4 className="text-sm font-bold themed-text mb-4 uppercase tracking-widest text-slate-400">Request Rate Monitoring</h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card className="p-5 border-indigo-100 bg-indigo-50/20 shadow-none">
                                 <p className="text-xs font-bold text-indigo-600">Global API Quota</p>
                                 <p className="text-2xl font-black themed-text mt-2">200 <span className="text-sm font-medium text-slate-400">req / 15m</span></p>
                                 <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                                    <div className="w-1/4 h-full bg-indigo-600 rounded-full" />
                                 </div>
                              </Card>
                              <Card className="p-5 border-pink-100 bg-pink-50/20 shadow-none">
                                 <p className="text-xs font-bold text-pink-600">AI Tokens per User</p>
                                 <p className="text-2xl font-black themed-text mt-2">50 <span className="text-sm font-medium text-slate-400">tasks / hr</span></p>
                                 <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                                    <div className="w-3/4 h-full bg-pink-500 rounded-full" />
                                 </div>
                              </Card>
                           </div>
                           <p className="text-[10px] text-slate-400 mt-4 leading-relaxed font-medium">
                             * These limits are applied per individual IP and User ID combination to ensure fair usage across the organization.
                           </p>
                        </div>
                      )}
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
