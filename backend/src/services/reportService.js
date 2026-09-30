const WorkflowModel = require('../models/workflowModel');
const TaskModel = require('../models/taskModel');
const ApprovalModel = require('../models/approvalModel');
const { supabase } = require('../config/supabase');

class ReportService {
  static async getDashboardStats() {
    // Note: In a real production app with massive data, we'd write custom SQL RPC functions in Supabase
    // to aggregate this efficiently. For now, we will fetch counts using Supabase count feature.

    const [
      { count: totalWorkflows },
      { count: activeWorkflows },
      { count: totalTasks },
      { count: completedTasks },
      { count: pendingApprovals }
    ] = await Promise.all([
      supabase.from('workflows').select('*', { count: 'exact', head: true }),
      supabase.from('workflows').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('tasks').select('*', { count: 'exact', head: true }),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('approvals').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    ]);

    // Calculate basic metrics
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Get recent activity (last 5 completed tasks)
    const { data: recentActivity } = await supabase
      .from('tasks')
      .select('id, title, status, updated_at, workflows(name)')
      .in('status', ['completed', 'rejected'])
      .order('updated_at', { ascending: false })
      .limit(5);

    return {
      metrics: {
        totalWorkflows: totalWorkflows || 0,
        activeWorkflows: activeWorkflows || 0,
        totalTasks: totalTasks || 0,
        completedTasks: completedTasks || 0,
        pendingApprovals: pendingApprovals || 0,
        taskCompletionRate
      },
      recentActivity: recentActivity || []
    };
  }
}

module.exports = ReportService;
