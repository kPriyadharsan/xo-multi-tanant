import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input } from '../components/ui';
import api from '../api/apiClient';
import toast from 'react-hot-toast';
import { 
  User, 
  Building, 
  Globe, 
  Camera, 
  LogOut,
  Lock,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState(user?.name || '');
  const [previewImage, setPreviewImage] = useState(user?.profileImage || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit (Base64 can be large)
        toast.error("Image size too large. Please use an image under 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsUpdating(true);
    try {
      const { data } = await api.put('/auth/profile', {
        name,
        profileImage: previewImage
      });

      if (data.success) {
        updateUser(data.data);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 px-4"
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
              <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold shadow-2xl mb-6 overflow-hidden border-4 border-white">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0] || 'U'
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-6 right-0 w-10 h-10 bg-white border border-slate-100 rounded-2xl shadow-lg flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
                title="Change Photo"
              >
                <Camera size={18} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange} 
              />
            </div>
            
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{user?.email}</p>
            
            <div className="mt-6 flex flex-wrap justify-center gap-2">
               <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                 user?.role === 'admin' ? 'bg-amber-100 text-amber-700' : 
                 user?.role === 'manager' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-600'
               }`}>
                 {user?.role || 'Member'}
               </span>
            </div>

            <hr className="w-full border-slate-100 my-8" />
            
            <div className="w-full space-y-4 text-left">
               <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-2 font-medium">
                    <Building size={16} /> Organization
                  </span>
                  <span className="font-bold text-slate-700">{user?.organization?.name || 'Private'}</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-2 font-medium">
                    <Globe size={16} /> Timezone
                  </span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <Input 
                      label="Full Name" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                    />
                    <Input label="Email Address" value={user?.email} disabled className="bg-slate-50 opacity-100 cursor-not-allowed" />
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-50 text-left">
                    <Button 
                      className="px-8 min-w-[140px]" 
                      onClick={handleSave}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                      Save Changes
                    </Button>
                </div>
            </Card>

            <Card className="p-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Lock size={20} className="text-pink-600" /> Security
                </h3>
                <div className="space-y-6 text-left">
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div>
                         <p className="text-sm font-bold text-slate-900">Two-factor Authentication</p>
                         <p className="text-xs text-slate-500 mt-1">Add an extra layer of security to your account.</p>
                      </div>
                      <div className="w-12 h-6 bg-slate-200 rounded-full cursor-not-allowed relative">
                         <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                   </div>
                   <Button variant="secondary" onClick={() => toast.error("Password change functionality coming soon!")}>Change Password</Button>
                </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
