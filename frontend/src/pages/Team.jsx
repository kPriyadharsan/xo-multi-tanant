import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/apiClient';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  ShieldAlert, 
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const TeamPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/users');
      if (data.success) {
        setMembers(data.data);
      }
    } catch (err) {
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      const { data } = await api.delete(`/users/${userId}`);
      if (data.success) {
        toast.success('User removed from team');
        fetchMembers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove user');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
          <p className="text-slate-500 text-sm">Manage your organization members and their roles</p>
        </div>
        {user?.role === 'admin' && (
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 font-semibold text-sm">
            <UserPlus size={18} />
            Invite Member
          </button>
        )}
      </div>

      {/* Stats/Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
             <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Members</p>
            <p className="text-2xl font-bold text-slate-900">{members.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
             <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Admins</p>
            <p className="text-2xl font-bold text-slate-900">{members.filter(m => m.role === 'admin').length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
             <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Managers</p>
            <p className="text-2xl font-bold text-slate-900">{members.filter(m => m.role === 'manager').length}</p>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined At</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                         <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                         <p className="text-sm font-medium">Loading team data...</p>
                      </div>
                   </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                   <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">No members found</td>
                </tr>
              ) : (
                members.map((member, index) => (
                  <motion.tr 
                    key={member._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm">
                          {member.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{member.name}</p>
                          <p className="text-[11px] text-slate-400">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        member.role === 'admin' 
                          ? 'bg-amber-100 text-amber-700' 
                          : member.role === 'manager'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(member.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user?.role === 'admin' && member._id !== user.id && (
                        <div className="flex justify-end gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <select 
                             className="text-[11px] border-slate-200 rounded-lg py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                             value={member.role}
                             onChange={(e) => handleUpdateRole(member._id, e.target.value)}
                           >
                             <option value="member">Member</option>
                             <option value="manager">Manager</option>
                             <option value="admin">Admin</option>
                           </select>
                           <button 
                             onClick={() => handleRemoveUser(member._id)}
                             className="p-1 px-2 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                           >
                             <UserMinus size={14} />
                             Remove
                           </button>
                        </div>
                      )}
                      {member._id === user.id && (
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">You</span>
                      )}
                      {user?.role !== 'admin' && member._id !== user.id && (
                         <span className="text-[10px] text-slate-300 italic">No access</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
