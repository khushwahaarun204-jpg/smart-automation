import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ReportService from '../services/reportService';
import { 
  BarChart3, 
  TrendingUp, 
  Layers, 
  Clock,
  CheckCircle,
  Activity,
  Download,
  FileText,
  FileDown
} from 'lucide-react';
import { motion } from 'framer-motion';

const ReportsPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportFeedback, setExportFeedback] = useState(null);

  const handleExport = async (type) => {
    try {
      if (type === 'csv') setIsExportingCsv(true);
      if (type === 'pdf') setIsExportingPdf(true);
      setExportFeedback(null);

      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/reports/export/${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report.${type}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      setExportFeedback({ type: 'success', message: `${type.toUpperCase()} exported successfully!` });
      setTimeout(() => setExportFeedback(null), 3000);
    } catch (err) {
      setExportFeedback({ type: 'error', message: `Failed to export ${type.toUpperCase()}` });
      setTimeout(() => setExportFeedback(null), 3000);
    } finally {
      if (type === 'csv') setIsExportingCsv(false);
      if (type === 'pdf') setIsExportingPdf(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const res = await ReportService.getDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.response?.data?.message || 'Failed to load report data');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if user is admin or manager
    if (user && ['admin', 'manager'].includes(user.role)) {
      fetchStats();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (!user || !['admin', 'manager'].includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <Activity className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Access Error</h2>
        <p className="text-slate-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white pb-20">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <BarChart3 className="h-4 w-4" /> Analytics
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                System Overview
              </h1>
              <p className="text-slate-400 mt-2">Executive dashboard for automation metrics and efficiency.</p>
            </div>
            
            <div className="flex items-center gap-3">
              {exportFeedback && (
                <span className={`text-sm font-medium ${exportFeedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {exportFeedback.message}
                </span>
              )}
              <button 
                onClick={() => handleExport('csv')}
                disabled={isExportingCsv}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700 shadow-sm"
              >
                {isExportingCsv ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FileText className="h-4 w-4" />}
                Export CSV
              </button>
              <button 
                onClick={() => handleExport('pdf')}
                disabled={isExportingPdf}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
              >
                {isExportingPdf ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FileDown className="h-4 w-4" />}
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-300">Total Workflows</h3>
              </div>
              <div className="text-4xl font-black text-white mb-1">
                {stats?.metrics.totalWorkflows}
              </div>
              <p className="text-sm text-slate-400">
                <span className="text-emerald-400 font-medium">{stats?.metrics.activeWorkflows}</span> currently active
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-300">Task Completion</h3>
              </div>
              <div className="flex items-end gap-2 mb-1">
                <div className="text-4xl font-black text-white">
                  {stats?.metrics.taskCompletionRate}%
                </div>
                <div className="text-sm text-slate-400 mb-1">efficiency</div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-4">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full" 
                  style={{ width: `${stats?.metrics.taskCompletionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-300">Bottlenecks</h3>
              </div>
              <div className="text-4xl font-black text-white mb-1">
                {stats?.metrics.pendingApprovals}
              </div>
              <p className="text-sm text-slate-400">
                Approvals currently waiting
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm"
        >
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Recent System Activity</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-4 font-medium">Task</th>
                  <th className="p-4 font-medium">Workflow</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats?.recentActivity?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500">
                      No recent activity recorded.
                    </td>
                  </tr>
                ) : (
                  stats?.recentActivity?.map((activity) => (
                    <tr key={activity.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 text-sm font-medium text-white">{activity.title}</td>
                      <td className="p-4 text-sm text-slate-400">{activity.workflows?.name || '-'}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                          activity.status === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {activity.status === 'completed' ? <CheckCircle className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
                          {activity.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-500">
                        {new Date(activity.updated_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default ReportsPage;
