import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import OnboardingWizard from '../components/OnboardingWizard';
import WorkflowService from '../services/workflowService';
import TaskService from '../services/taskService';
import ApprovalService from '../services/approvalService';
import { 
  Zap, 
  LogOut, 
  Shield, 
  Clock, 
  Layers, 
  UserCheck, 
  Sparkles,
  Plus,
  ArrowRight,
  MoreVertical,
  PlayCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State for onboarding wizard
  const [showWizard, setShowWizard] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch workflows, tasks, and approvals
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [workflowsData, tasksData, approvalsData] = await Promise.all([
          WorkflowService.getWorkflows(),
          TaskService.getTasks({ assignedTo: user?.id }),
          ApprovalService.getApprovals({ approverId: user?.id, status: 'pending' })
        ]);
        setWorkflows(workflowsData.data || []);
        setTasks(tasksData.data || []);
        setApprovals(approvalsData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

  // Check if it's the user's first time
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(`onboarding_${user?.id}`);
    if (!hasSeenOnboarding) {
      // Small delay before showing wizard for visual effect
      const timer = setTimeout(() => {
        setShowWizard(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'manager':
        return { label: 'Manager', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'approver':
        return { label: 'Approver', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'employee':
      default:
        return { label: 'Employee', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    }
  };

  const roleBadge = getRoleBadge(user?.role);

  const handleWizardComplete = async (workflowData) => {
    try {
      const payload = {
        name: workflowData.name,
        description: workflowData.template === 'expense' ? 'Expense approval process' :
                     workflowData.template === 'timeoff' ? 'Time off request process' : 'Custom automated process',
        templateConfig: { template: workflowData.template }
      };
      
      const res = await WorkflowService.createWorkflow(payload);
      const newWorkflow = res.data;
      
      setWorkflows([newWorkflow, ...workflows]);
      localStorage.setItem(`onboarding_${user?.id}`, 'true');
    } catch (error) {
      console.error("Failed to create workflow", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-10 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]"></div>
      </div>

      <OnboardingWizard 
        isOpen={showWizard} 
        onClose={() => setShowWizard(false)} 
        onComplete={handleWizardComplete} 
      />

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2"
            >
              <Sparkles className="h-4 w-4" /> Welcome Back
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            >
              {getGreeting()}, {user?.name.split(' ')[0] || 'User'} 👋
            </motion.h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <button 
              onClick={() => setShowWizard(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-all border border-slate-700"
            >
              <Layers className="h-4 w-4" /> Templates
            </button>
            <Link 
              to="/workflow/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 ring-1 ring-white/10 hover:ring-white/20"
            >
              <Plus className="h-4 w-4" /> Custom Builder
            </Link>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Workflows</span>
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{workflows.length}</div>
            <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
              +1 this week
            </div>
          </div>

          <Link to="/tasks" className="block outline-none">
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all cursor-pointer h-full group">
              <div className="flex items-center justify-between text-slate-400 mb-4 group-hover:text-amber-400 transition-colors">
                <span className="text-xs font-semibold uppercase tracking-wider">My Tasks</span>
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 group-hover:scale-110 transition-transform">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white group-hover:text-amber-300 transition-colors">{tasks.length}</div>
              <div className="text-xs text-slate-500 mt-2">
                {tasks.length > 0 ? `${tasks.filter(t => t.status === 'pending').length} pending` : "You're all caught up!"}
              </div>
            </div>
          </Link>

          <Link to="/approvals" className="block outline-none">
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all cursor-pointer h-full group">
              <div className="flex items-center justify-between text-slate-400 mb-4 group-hover:text-emerald-400 transition-colors">
                <span className="text-xs font-semibold uppercase tracking-wider">Pending Approvals</span>
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                  <UserCheck className="h-4 w-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white group-hover:text-emerald-300 transition-colors">{approvals.length}</div>
              <div className="text-xs text-slate-500 mt-2">
                {approvals.length > 0 ? "Awaiting your review" : "No approvals needed"}
              </div>
            </div>
          </Link>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider">Role Access</span>
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <Shield className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-white uppercase">{user?.role}</div>
            <div className="text-xs text-slate-500 mt-2">
              Secure Session Active
            </div>
          </div>
        </motion.div>

        {/* Workflows Area */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Recent Workflows</h2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors">
              View all <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {workflows.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-center justify-center py-16 px-4 rounded-3xl border border-dashed border-slate-700 bg-slate-900/20 text-center"
            >
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                <Layers className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No workflows yet</h3>
              <p className="text-slate-400 max-w-sm mb-6">
                You haven't created any automated workflows yet. Get started by creating your first one.
              </p>
              <button 
                onClick={() => setShowWizard(true)}
                className="px-6 py-2.5 bg-white text-slate-900 hover:bg-slate-200 text-sm font-bold rounded-xl transition-all"
              >
                Create your first workflow
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflows.map((wf, idx) => (
                <motion.div
                  key={wf.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * idx }}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                      {wf.template_config?.template === 'expense' ? <Layers className="h-5 w-5" /> : 
                       wf.template_config?.template === 'timeoff' ? <Clock className="h-5 w-5" /> : 
                       <Zap className="h-5 w-5" />}
                    </div>
                    <button className="text-slate-500 hover:text-white transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1">{wf.name}</h3>
                  <p className="text-sm text-slate-400 mb-6 flex-1">
                    {wf.description || 'Automated process workflow'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-medium text-slate-300 capitalize">{wf.status || 'Active'}</span>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                      <PlayCircle className="h-4 w-4" /> Run
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default DashboardPage;
