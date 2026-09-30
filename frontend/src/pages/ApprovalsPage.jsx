import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ApprovalService from '../services/approvalService';
import { 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ApprovalsPage = () => {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(null);
  const [filter, setFilter] = useState('pending');

  const fetchApprovals = async () => {
    try {
      setIsLoading(true);
      const res = await ApprovalService.getApprovals({ 
        approverId: user?.id,
        ...(filter !== 'all' ? { status: filter } : {})
      });
      setApprovals(res.data || []);
    } catch (error) {
      console.error("Error fetching approvals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApprovals();
    }
  }, [user, filter]);

  const handleProcess = async (id, status) => {
    try {
      setIsProcessing(id);
      await ApprovalService.processApproval(id, { 
        status, 
        comments: `Manually ${status} by ${user.name}` 
      });
      
      // Remove from list if we're viewing pending
      if (filter === 'pending') {
        setApprovals(approvals.filter(a => a.id !== id));
      } else {
        // Just refresh the data to show updated status
        await fetchApprovals();
      }
    } catch (error) {
      console.error("Error processing approval:", error);
      alert("Failed to process approval");
    } finally {
      setIsProcessing(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
      case 'auto_approved':
        return <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-medium flex items-center gap-1"><CheckCircle size={12} /> Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-xs font-medium flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-xs font-medium flex items-center gap-1"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px]"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <UserCheck className="h-4 w-4" /> Approval Queue
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              My Approvals
            </h1>
            <p className="text-slate-400 mt-2">Review and process requests that require your authorization.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 p-1 rounded-xl">
            {['pending', 'approved', 'rejected', 'all'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg capitalize transition-all ${
                  filter === f 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search approvals..." 
                className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-64 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
              <Filter className="h-4 w-4" /> Filter
            </button>
          </div>

          <div className="divide-y divide-slate-800/60">
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-500">
                <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                <p>Loading your approvals...</p>
              </div>
            ) : approvals.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700/50">
                  <CheckCircle className="h-8 w-8 text-emerald-500/50" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">All caught up!</h3>
                <p className="text-slate-400">You don't have any {filter !== 'all' ? filter : ''} approvals waiting in your queue.</p>
              </div>
            ) : (
              <AnimatePresence>
                {approvals.map((approval) => (
                  <motion.div 
                    key={approval.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-5 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                          {approval.workflows?.name || 'Workflow'}
                        </span>
                        {getStatusBadge(approval.status)}
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1">
                        {approval.tasks?.title || 'Untitled Task'}
                      </h4>
                      <p className="text-sm text-slate-400 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Requested on {new Date(approval.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {approval.status === 'pending' && (
                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleProcess(approval.id, 'rejected')}
                          disabled={isProcessing === approval.id}
                          className="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-red-500/50 hover:bg-red-500/10 text-slate-300 hover:text-red-400 text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" /> Reject
                        </button>
                        <button
                          onClick={() => handleProcess(approval.id, 'approved')}
                          disabled={isProcessing === approval.id}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          {isProcessing === approval.id ? 'Processing...' : 'Approve'}
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApprovalsPage;
