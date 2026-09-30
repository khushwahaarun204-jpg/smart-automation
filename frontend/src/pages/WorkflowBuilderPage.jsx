import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import WorkflowService from '../services/workflowService';
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Settings, 
  Plus, 
  Trash2,
  Mail,
  UserCheck,
  ListTodo,
  Clock,
  Globe,
  Zap,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const nodeTypes = [
  { id: 'trigger_schedule', type: 'trigger', icon: Clock, title: 'Scheduled Time', color: 'bg-indigo-500' },
  { id: 'trigger_webhook', type: 'trigger', icon: Globe, title: 'Webhook Event', color: 'bg-indigo-500' },
  { id: 'action_task', type: 'action', icon: ListTodo, title: 'Create Task', color: 'bg-amber-500' },
  { id: 'action_approval', type: 'action', icon: UserCheck, title: 'Request Approval', color: 'bg-emerald-500' },
  { id: 'action_email', type: 'action', icon: Mail, title: 'Send Email', color: 'bg-blue-500' },
];

const WorkflowBuilderPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [nodes, setNodes] = useState([
    { id: 'node_1', typeId: 'trigger_schedule', ...nodeTypes[0] }
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const addNode = (typeId) => {
    const nodeTemplate = nodeTypes.find(n => n.id === typeId);
    setNodes([...nodes, { ...nodeTemplate, id: `node_${Date.now()}` }]);
  };

  const removeNode = (id) => {
    if (nodes.length <= 1) return; // Must have at least one node
    setNodes(nodes.filter(n => n.id !== id));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Construct a config representation of our visual nodes
      const config = {
        template: 'custom',
        steps: nodes.map((n, idx) => ({ step: idx + 1, type: n.id, action: n.title }))
      };

      await WorkflowService.createWorkflow({
        name: workflowName,
        description: `Custom workflow with ${nodes.length} steps`,
        templateConfig: config
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to save workflow:", error);
      alert("Failed to save workflow");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col h-screen overflow-hidden">
      
      {/* Top Navbar for Builder */}
      <nav className="border-b border-slate-800 bg-slate-900/80 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="h-6 w-px bg-slate-700"></div>
          <input 
            type="text" 
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent border-none text-lg font-bold text-white focus:outline-none focus:ring-0 w-64 px-2"
            placeholder="Workflow Name"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <Play className="h-4 w-4" /> Test
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-500/25 transition-all"
          >
            <Save className="h-4 w-4" /> 
            {isSaving ? 'Saving...' : 'Save & Enable'}
          </button>
        </div>
      </nav>

      {/* Main Builder Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Components) */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/30 flex flex-col hidden md:flex overflow-y-auto z-10">
          <div className="p-4 border-b border-slate-800/50">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Triggers</h2>
            <div className="space-y-2">
              {nodeTypes.filter(n => n.type === 'trigger').map(node => (
                <div 
                  key={node.id} 
                  onClick={() => addNode(node.id)}
                  className="p-3 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 rounded-xl cursor-pointer transition-all flex items-center gap-3 group"
                >
                  <div className={`p-2 rounded-lg ${node.color}/10 text-${node.color.replace('bg-', '')}-400 group-hover:scale-110 transition-transform`}>
                    <node.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">{node.title}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Actions</h2>
            <div className="space-y-2">
              {nodeTypes.filter(n => n.type === 'action').map(node => (
                <div 
                  key={node.id} 
                  onClick={() => addNode(node.id)}
                  className="p-3 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 rounded-xl cursor-pointer transition-all flex items-center gap-3 group"
                >
                  <div className={`p-2 rounded-lg ${node.color}/10 text-${node.color.replace('bg-', '')}-400 group-hover:scale-110 transition-transform`}>
                    <node.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">{node.title}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 bg-slate-950 relative overflow-y-auto">
          {/* Grid Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{ 
              backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', 
              backgroundSize: '24px 24px' 
            }}
          ></div>

          <div className="relative z-10 flex flex-col items-center py-16 px-4 min-h-full">
            <div className="w-full max-w-lg">
              
              <AnimatePresence>
                {nodes.map((node, index) => (
                  <motion.div 
                    key={node.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="relative flex flex-col items-center"
                  >
                    {/* The Node */}
                    <div className="w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-4 flex items-center gap-4 group">
                      <div className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 p-1">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      
                      <div className={`p-3 rounded-xl ${node.color} shadow-lg shadow-${node.color.replace('bg-', '')}-500/20`}>
                        <node.icon className="h-5 w-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                          Step {index + 1} • {node.type}
                        </div>
                        <h3 className="text-base font-bold text-white">{node.title}</h3>
                      </div>
                      
                      <button className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
                        <Settings className="h-5 w-5" />
                      </button>
                      
                      {index !== 0 && (
                        <button 
                          onClick={() => removeNode(node.id)}
                          className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {/* Connector Line (except for last item) */}
                    {index < nodes.length - 1 && (
                      <div className="w-0.5 h-12 bg-indigo-500/30 my-1 relative">
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-indigo-500/50"></div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add Button at the end */}
              <motion.div 
                layout
                className="flex justify-center mt-6"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <button 
                    onClick={() => addNode('action_task')}
                    className="relative h-12 w-12 bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-400 hover:text-indigo-400 rounded-full flex items-center justify-center transition-all shadow-xl"
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                </div>
              </motion.div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkflowBuilderPage;
