import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Rocket, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  FileText,
  Plane,
  Settings,
  Zap,
  X
} from 'lucide-react';

const TEMPLATES = [
  {
    id: 'expense',
    title: 'Expense Approval',
    description: 'Automate receipt submissions and manager approvals.',
    icon: FileText,
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-500/10'
  },
  {
    id: 'timeoff',
    title: 'Time Off Request',
    description: 'Streamline vacation and sick leave requests.',
    icon: Plane,
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-500/10'
  },
  {
    id: 'custom',
    title: 'Custom Workflow',
    description: 'Build a process from scratch for your specific needs.',
    icon: Settings,
    color: 'from-purple-500 to-pink-600',
    bgLight: 'bg-purple-500/10'
  }
];

const OnboardingWizard = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [workflowName, setWorkflowName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedTemplate(null);
      setWorkflowName('');
    }
  }, [isOpen]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#3b82f6', '#10b981']
    });

    setTimeout(() => {
      onComplete({
        template: selectedTemplate,
        name: workflowName
      });
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 transition-opacity bg-slate-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="inline-block w-full max-w-2xl overflow-hidden text-left align-bottom transition-all transform bg-slate-900 border border-slate-700/60 shadow-2xl rounded-2xl sm:my-8 sm:align-middle"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Zap size={18} />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Getting Started
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-1">
              <motion.div 
                className="bg-indigo-500 h-1"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Content Area */}
            <div className="px-6 py-8 sm:p-10 min-h-[400px] flex flex-col">
              <AnimatePresence mode="wait">
                {/* STEP 1: Welcome */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                      <Rocket className="h-10 w-10 text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Welcome to Smart Automation!</h2>
                    <p className="text-slate-300 max-w-md text-lg">
                      You're just a few clicks away from automating your first workflow. Let's set it up together.
                    </p>
                  </motion.div>
                )}

                {/* STEP 2: Choose Template */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1"
                  >
                    <h2 className="text-2xl font-bold text-white mb-2">Choose a Template</h2>
                    <p className="text-slate-400 mb-6">Select a pre-built workflow or start from scratch.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {TEMPLATES.map((template) => {
                        const Icon = template.icon;
                        const isSelected = selectedTemplate === template.id;
                        return (
                          <div
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col h-full ${
                              isSelected 
                                ? 'border-indigo-500 bg-slate-800' 
                                : 'border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/50'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-3 right-3 text-indigo-400">
                                <CheckCircle size={18} className="fill-indigo-500/20" />
                              </div>
                            )}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${template.bgLight}`}>
                              <Icon className={`h-5 w-5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                            </div>
                            <h4 className={`font-semibold mb-2 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                              {template.title}
                            </h4>
                            <p className="text-xs text-slate-400 flex-1">
                              {template.description}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Configure */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
                  >
                    <h2 className="text-2xl font-bold text-white mb-2">Name your workflow</h2>
                    <p className="text-slate-400 mb-8">Give it a recognizable name so your team knows what it is.</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="workflowName" className="block text-sm font-medium text-slate-300 mb-2">
                          Workflow Name
                        </label>
                        <input
                          type="text"
                          id="workflowName"
                          value={workflowName}
                          onChange={(e) => setWorkflowName(e.target.value)}
                          placeholder={
                            selectedTemplate === 'expense' ? 'e.g. Q3 Travel Expenses' :
                            selectedTemplate === 'timeoff' ? 'e.g. PTO Requests' :
                            'e.g. IT Equipment Request'
                          }
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          autoFocus
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Creating / Success */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center text-center"
                  >
                    {isSubmitting ? (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
                        <h2 className="text-2xl font-bold text-white mb-2">Creating Workflow...</h2>
                        <p className="text-slate-400">Setting up the required tables and logic.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", bounce: 0.5 }}
                          className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6"
                        >
                          <CheckCircle className="h-10 w-10 text-emerald-500" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white mb-2">Workflow Ready!</h2>
                        <p className="text-slate-400 max-w-sm">
                          "{workflowName}" has been created successfully. You can now start assigning tasks.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer / Controls */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center">
              {step > 1 && step < 4 ? (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <ArrowLeft size={16} /> Back
                  </span>
                </button>
              ) : (
                <div></div> // Empty div to maintain flex spacing
              )}

              {step === 1 && (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/25 flex items-center gap-2 ml-auto"
                >
                  Get Started <ArrowRight size={16} />
                </button>
              )}

              {step === 2 && (
                <button
                  onClick={handleNext}
                  disabled={!selectedTemplate}
                  className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                    selectedTemplate 
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Continue <ArrowRight size={16} />
                </button>
              )}

              {step === 3 && (
                <button
                  onClick={() => {
                    handleNext();
                    handleFinish();
                  }}
                  disabled={workflowName.trim().length < 3}
                  className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                    workflowName.trim().length >= 3
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Create Workflow <CheckCircle size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingWizard;
