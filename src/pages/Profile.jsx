import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input } from '../components/ui';
import { 
  User, 
  Shield, 
  Building, 
  Mail, 
  Globe, 
  Camera, 
  LogOut,
  MapPin,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-5xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
            <Button variant="ghost" className="text-pink-600 flex items-center gap-2" onClick={logout}>
                <LogOut size={18} /> Logout
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="p-8 text-center flex flex-col items-center border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold shadow-2xl mb-6">
                {user?.name?.[0] || 'U'}
              </div>
              <button className="absolute bottom-6 right-0 w-10 h-10 bg-white border border-slate-100 rounded-2xl shadow-lg flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
                <Camera size={18} />
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{user?.email}</p>
            
            <div className="mt-6 flex flex-wrap justify-center gap-2">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Admin</span>
               <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider">Product Team</span>
            </div>

            <hr className="w-full border-slate-100 my-8" />
            
            <div className="w-full space-y-4">
               <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-2"><Building size={16} /> Organization</span>
                  <span className="font-bold text-slate-700">{user?.tenantId}</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-2"><Globe size={16} /> Timezone</span>
                  <span className="font-bold text-slate-700">UTC-05:00</span>
               </div>
            </div>
          </Card>

          {/* Form Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <User size={20} className="text-indigo-600" /> General Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Full Name" defaultValue={user?.name} />
                    <Input label="Email Address" defaultValue={user?.email} disabled />
                    <Input label="Phone Number" placeholder="+1 (555) 000-0000" />
                    <Input label="Location" placeholder="San Francisco, CA" prefix={<MapPin size={16} />} />
                </div>
                <div className="mt-8 pt-8 border-t border-slate-50">
                    <Button className="px-8">Save Changes</Button>
                </div>
            </Card>

            <Card className="p-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Lock size={20} className="text-pink-600" /> Security
                </h3>
                <div className="space-y-6">
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div>
                         <p className="text-sm font-bold text-slate-900">Two-factor Authentication</p>
                         <p className="text-xs text-slate-500 mt-1">Add an extra layer of security to your account.</p>
                      </div>
                      <div className="w-12 h-6 bg-slate-200 rounded-full cursor-pointer relative transition-colors hover:bg-slate-300">
                         <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                   </div>
                   <Button variant="secondary">Change Password</Button>
                </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
