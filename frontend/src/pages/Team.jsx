import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/apiClient';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  ShieldAlert, 
  ShieldCheck,
  Search,
  Layout
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, Input } from '../components/ui';
import toast from 'react-hot-toast';

const TeamPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/users');
      if (data.success) {
        setMembers(data.data);
      }
    } catch (error) {
      console.error('Failed to load team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const { data } = await api.put(`/users/${userId}/role`, { role: newRole });
      if (data.success) {
        toast.success(`Role updated to ${newRole}`);
        fetchMembers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleRemoveUser = async (userId) => {
    // Custom premium confirmation could be here, but window.confirm is faster for now
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      const { data } = await api.delete(`/users/${userId}`);
      if (data.success) {
        toast.success('User removed from team');
        fetchMembers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove user');
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                <Users size={18} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600/60">Organization</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-black themed-text tracking-tight leading-none"
          >
            Team <span className="text-gradient">Intelligence</span>
          </motion.h1>
          <p className="text-slate-500 mt-4 font-medium max-w-xl leading-relaxed">
            Manage your organization members, coordinate roles, and monitor collective efficiency in <span className="font-bold text-slate-900">{user?.organization?.name}</span>.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search members..."
              className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[2rem] outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all shadow-sm w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {user?.role === 'admin' && (
            <Button className="px-8 py-4 text-sm font-bold shadow-xl shadow-indigo-600/20 group">
              <UserPlus size={18} className="mr-2 group-hover:scale-110 transition-transform" /> Invite Intelligence
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Users, label: 'Total Members', value: members.length, color: 'indigo' },
          { icon: ShieldAlert, label: 'Organization Admins', value: members.filter(m => m.role === 'admin').length, color: 'amber' },
          { icon: ShieldCheck, label: 'Strategic Managers', value: members.filter(m => m.role === 'manager').length, color: 'emerald' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-8 border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] bg-white group hover:shadow-[0_20px_50px_-15px_rgba(79,70,229,0.1)] transition-all">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                   <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black themed-text mt-1">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Members Grid/List */}
      <Card className="border-none shadow-[0_32px_128px_-16px_rgba(0,0,0,0.05)] bg-white overflow-hidden p-0 rounded-[2.5rem]">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Team Member</th>
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Security Tier</th>
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Integration Date</th>
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                       <td colSpan="4" className="px-10 py-8">
                         <div className="flex items-center gap-4 animate-pulse">
                            <div className="w-12 h-12 bg-slate-100 rounded-full" />
                            <div className="space-y-2">
                               <div className="w-48 h-4 bg-slate-100 rounded-full" />
                               <div className="w-32 h-3 bg-slate-50 rounded-full" />
                            </div>
                         </div>
                       </td>
                    </tr>
                  ))
                ) : filteredMembers.length === 0 ? (
                  <tr>
                     <td colSpan="4" className="px-10 py-20 text-center">
                        <div className="opacity-20 flex flex-col items-center gap-4">
                           <Users size={64} />
                           <p className="text-xl font-black uppercase tracking-widest">No signals detected</p>
                        </div>
                     </td>
                  </tr>
                ) : (
                  filteredMembers.map((member, index) => (
                    <motion.tr 
                      key={member._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-indigo-50/30 transition-all duration-300"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-[1.25rem] bg-indigo-600/5 flex items-center justify-center text-indigo-600 font-black border-2 border-white shadow-xl overflow-hidden group-hover:scale-110 transition-transform">
                              {member.profileImage ? (
                                <img src={member.profileImage} alt={member.name} className="w-full h-full object-cover" />
                              ) : (
                                member.name[0].toUpperCase()
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full" title="Active Now" />
                          </div>
                          <div>
                            <p className="font-black themed-text text-lg tracking-tight mb-0.5">{member.name}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] ${
                          member.role === 'admin' 
                            ? 'bg-amber-100 text-amber-700 shadow-sm shadow-amber-100' 
                            : member.role === 'manager'
                              ? 'bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-100'
                              : 'bg-slate-100 text-slate-600'
                        }`}>
                          {member.role} Tier
                        </span>
                      </td>
                      <td className="px-10 py-8 text-sm font-bold text-slate-500">
                        {new Date(member.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-10 py-8 text-right">
                        {user?.role === 'admin' && member._id !== (user.id || user._id) ? (
                          <div className="flex justify-end gap-3 items-center opacity-0 group-hover:opacity-100 transition-all">
                             <select 
                               className="text-xs font-bold bg-white border border-slate-200 rounded-xl py-2 px-4 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all shadow-sm"
                               value={member.role}
                               onChange={(e) => handleUpdateRole(member._id, e.target.value)}
                             >
                               <option value="member">Associate</option>
                               <option value="manager">Manager</option>
                               <option value="admin">System Admin</option>
                             </select>
                             <button 
                               onClick={() => handleRemoveUser(member._id)}
                               className="w-10 h-10 flex items-center justify-center bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-600 hover:text-white transition-all shadow-sm"
                               title="Revoke Access"
                             >
                               <UserMinus size={18} />
                             </button>
                          </div>
                        ) : member._id === (user.id || user._id) ? (
                          <span className="px-4 py-2 bg-indigo-600/10 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest">Self Access</span>
                        ) : (
                           <p className="text-xs font-bold text-slate-300 uppercase tracking-widest italic">Encrypted Connection</p>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
};

export default TeamPage;
