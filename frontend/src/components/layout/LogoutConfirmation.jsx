import React from 'react';
import { Modal, Button } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { LogOut, AlertCircle } from 'lucide-react';

const LogoutConfirmation = () => {
  const { showLogoutModal, logout, cancelLogout } = useAuth();

  return (
    <Modal
      isOpen={showLogoutModal}
      onClose={cancelLogout}
      title="Confirm Logout"
      footer={
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 p-4 rounded-xl border border-slate-100 w-full justify-center">
            <AlertCircle size={14} /> You can always log back in to access your organization&apos;s data.
        </div>
      }
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-4">
          <LogOut size={32} />
        </div>
        <p className="text-slate-600 mb-6">
          Are you sure you want to log out? <br />
          Any unsaved changes might be lost.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button 
            variant="ghost" 
            className="flex-1 border border-slate-200" 
            onClick={cancelLogout}
          >
            Stay Logged In
          </Button>
          <Button 
            variant="primary" 
            className="flex-1 bg-pink-600 hover:bg-pink-700" 
            onClick={logout}
          >
            Yes, Log Me Out
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutConfirmation;
