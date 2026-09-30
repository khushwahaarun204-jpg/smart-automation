import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Key, 
  Smartphone,
  LogOut,
  Save,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form states (mock data for now since we don't have a PUT /me endpoint)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || 'Engineering',
    theme: 'dark',
    emailNotifications: true,
    pushNotifications: false,
    twoFactor: false
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate network delay
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 right-20 w-96 h-96 bg-slate-600/10 rounded-full blur-[128px]"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Account Settings
          </h1>
          <p className="text-slate-400 mt-2">Manage your profile, security, and preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === tab.id 
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-slate-800">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent rounded-xl transition-all"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-sm min-h-[500px]">
            
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/25 ring-4 ring-slate-900">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700">
                        Change Avatar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6 max-w-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Full Name</label>
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Department</label>
                        <input 
                          type="text" 
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        disabled
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500">Email addresses cannot be changed directly. Contact an administrator.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">System Role</label>
                      <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5">
                        <Shield className="h-4 w-4 text-indigo-400" />
                        <span className="text-white font-medium capitalize">{user?.role}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-xl font-bold text-white mb-6">Security & Access</h2>
                  
                  <div className="space-y-8 max-w-xl">
                    <div className="p-5 border border-slate-800 bg-slate-950/50 rounded-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Key className="h-5 w-5 text-slate-400" />
                        <h3 className="font-semibold text-white">Change Password</h3>
                      </div>
                      <div className="space-y-4">
                        <input type="password" placeholder="Current Password" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-all" />
                        <input type="password" placeholder="New Password" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-all" />
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="p-5 border border-slate-800 bg-slate-950/50 rounded-2xl flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <Smartphone className="h-6 w-6 text-indigo-400 mt-1" />
                        <div>
                          <h3 className="font-semibold text-white">Two-Factor Authentication</h3>
                          <p className="text-sm text-slate-400 mt-1 max-w-sm">Add an extra layer of security to your account by requiring a code from your mobile device.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setFormData({...formData, twoFactor: !formData.twoFactor})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.twoFactor ? 'bg-indigo-600' : 'bg-slate-700'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4 max-w-xl">
                    <div className="p-5 border border-slate-800 bg-slate-950/50 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-colors cursor-pointer"
                         onClick={() => setFormData({...formData, emailNotifications: !formData.emailNotifications})}>
                      <div>
                        <h3 className="font-semibold text-white">Email Notifications</h3>
                        <p className="text-sm text-slate-400 mt-1">Receive daily digests and urgent alerts via email.</p>
                      </div>
                      <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.emailNotifications ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    <div className="p-5 border border-slate-800 bg-slate-950/50 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-colors cursor-pointer"
                         onClick={() => setFormData({...formData, pushNotifications: !formData.pushNotifications})}>
                      <div>
                        <h3 className="font-semibold text-white">In-App Push Notifications</h3>
                        <p className="text-sm text-slate-400 mt-1">Show browser popups when you receive a new task or approval.</p>
                      </div>
                      <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.pushNotifications ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-xl font-bold text-white mb-6">App Preferences</h2>
                  
                  <div className="space-y-6 max-w-xl">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-400">Theme</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div 
                          onClick={() => setFormData({...formData, theme: 'dark'})}
                          className={`p-4 border rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all ${formData.theme === 'dark' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'}`}
                        >
                          <div className="w-8 h-8 bg-slate-900 rounded-full border border-slate-800"></div>
                          <span className="text-sm font-medium">Dark Mode</span>
                        </div>
                        <div 
                          onClick={() => setFormData({...formData, theme: 'light'})}
                          className={`p-4 border rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all ${formData.theme === 'light' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'}`}
                        >
                          <div className="w-8 h-8 bg-slate-100 rounded-full border border-slate-300"></div>
                          <span className="text-sm font-medium">Light Mode</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 pt-6 border-t border-slate-800 flex items-center justify-end gap-4">
              {saved && (
                <motion.span 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-medium text-emerald-400 flex items-center gap-1.5"
                >
                  <CheckCircle className="h-4 w-4" /> Settings saved successfully
                </motion.span>
              )}
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
