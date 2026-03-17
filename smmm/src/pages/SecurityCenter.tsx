import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Lock, Globe, Server, Activity, FileText, 
  AlertTriangle, CheckCircle, Eye, EyeOff, Smartphone, 
  Database, UserCheck, HeartPulse, Scale, AlertOctagon,
  ChevronDown, ChevronUp, Search, X, Upload, Scan,
  AlertCircle, Check, Ban, ShieldAlert, FileWarning,
  Clock, Layers, Zap, Target, CheckCircle2, XCircle,
  Info, ExternalLink, Download, Filter, FileCheck
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';

// --- Types ---
type SecurityStatus = 'active' | 'scanning' | 'warning' | 'critical';
type ScanStage = 'validation' | 'scanning' | 'quarantine' | 'storage' | 'complete' | 'blocked';

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  result: 'allowed' | 'blocked' | 'reviewed';
  details: string;
}

interface IncidentData {
  detected: Date;
  filename: string;
  threatType: string;
  status: 'isolated' | 'scanning' | 'resolved';
}

// --- Sub-components ---

function StatusCard({ 
  icon: Icon, 
  title, 
  status, 
  description,
  details 
}: { 
  icon: any, 
  title: string, 
  status: SecurityStatus, 
  description: string,
  details: string
}) {
  const [expanded, setExpanded] = useState(false);

  const colors = {
    active: 'border-cyan-400/40 bg-cyan-400/5',
    scanning: 'border-blue-400/40 bg-blue-400/5',
    warning: 'border-amber-400/40 bg-amber-400/5',
    critical: 'border-red-500/40 bg-red-500/5',
  };

  const iconColors = {
    active: 'text-cyan-400',
    scanning: 'text-blue-400',
    warning: 'text-amber-400',
    critical: 'text-red-500',
  };

  return (
    <motion.div 
      layout
      onClick={() => setExpanded(!expanded)}
      className={`relative overflow-hidden rounded-2xl border-2 p-5 cursor-pointer transition-all ${colors[status]} hover:bg-white/5`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <motion.div 
            className={`p-3 rounded-xl bg-black/20 ${iconColors[status]}`}
            animate={status === 'active' ? { 
              boxShadow: [
                '0 0 0px rgba(6, 182, 212, 0)',
                '0 0 20px rgba(6, 182, 212, 0.3)',
                '0 0 0px rgba(6, 182, 212, 0)'
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
          <div className="flex-1">
            <h3 className="font-black text-white text-base uppercase tracking-wide mb-1">{title}</h3>
            <p className="text-xs text-white/60 flex items-center gap-2 mb-1">
              {status === 'active' && <CheckCircle className="w-3 h-3 text-cyan-400" />}
              {status === 'scanning' && <Activity className="w-3 h-3 animate-spin text-blue-400" />}
              {status === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
              <span className="uppercase font-bold tracking-widest">{status}</span>
            </p>
            <p className="text-sm text-white/70 leading-relaxed">{description}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            <p className="text-sm text-white/60 leading-relaxed italic">{details}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FirewallLayer({ 
  level, 
  title, 
  description, 
  delay,
  index 
}: { 
  level: number, 
  title: string, 
  description: string, 
  delay: number,
  index: number 
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.8, type: "spring", stiffness: 100 }}
      className="absolute rounded-full border-2 flex items-center justify-center group transition-all duration-500 cursor-pointer"
      style={{
        width: `${level * 18 + 40}%`,
        height: `${level * 18 + 40}%`,
        zIndex: 5 - index,
        borderColor: `rgba(6, 182, 212, ${0.4 - index * 0.08})`,
        boxShadow: `0 0 ${30 + index * 10}px rgba(6, 182, 212, ${0.15 - index * 0.03})`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className="absolute inset-0 rounded-full opacity-20 border-t-2 border-cyan-300" 
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 15 + index * 5, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute -top-20 bg-black/95 backdrop-blur-xl border-2 border-cyan-400/50 px-4 py-3 rounded-xl pointer-events-none z-50 min-w-[200px] shadow-[0_0_30px_rgba(6,182,212,0.3)]"
          >
            <p className="text-cyan-300 font-black text-xs uppercase tracking-wider mb-1">{title}</p>
            <p className="text-white/80 text-xs leading-relaxed">{description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DocumentScanFlow({ isOpen, onClose, filename }: { isOpen: boolean, onClose: () => void, filename: string }) {
  const [currentStage, setCurrentStage] = useState<ScanStage>('validation');
  const [progress, setProgress] = useState(0);
  const [threatDetected, setThreatDetected] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStage('validation');
      setProgress(0);
      setThreatDetected(false);
      return;
    }

    const stages: ScanStage[] = ['validation', 'scanning', 'quarantine', 'storage', 'complete'];
    let currentIndex = 0;
    let progressInterval: any;

    const stageInterval = setInterval(() => {
      if (currentIndex < stages.length) {
        setCurrentStage(stages[currentIndex]);
        setProgress((currentIndex + 1) * 20);
        
        // Simulate threat detection on scanning stage (20% chance)
        if (stages[currentIndex] === 'scanning' && Math.random() > 0.8) {
          setThreatDetected(true);
          setCurrentStage('blocked');
          setProgress(100);
          clearInterval(stageInterval);
          clearInterval(progressInterval);
          return;
        }
        
        currentIndex++;
      } else {
        clearInterval(stageInterval);
        clearInterval(progressInterval);
      }
    }, 1500);

    progressInterval = setInterval(() => {
      setProgress(prev => {
        const nextStageProgress = (currentIndex + 1) * 20;
        if (prev < nextStageProgress) {
          return Math.min(prev + 2, nextStageProgress);
        }
        return prev;
      });
    }, 100);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, [isOpen]);

  const stages = [
    { 
      id: 'validation', 
      label: 'Pre-Upload Validation', 
      description: 'Verifying file type and structure',
      icon: FileCheck
    },
    { 
      id: 'scanning', 
      label: 'Malware & Virus Scan', 
      description: 'Scanning for known and unknown threats',
      icon: Scan
    },
    { 
      id: 'quarantine', 
      label: 'Quarantine Sandbox', 
      description: 'Read-only rendering, macros stripped',
      icon: ShieldAlert
    },
    { 
      id: 'storage', 
      label: 'Secure Vault Storage', 
      description: 'Encrypted and indexed safely',
      icon: Lock
    },
    { 
      id: 'complete', 
      label: 'Upload Complete', 
      description: 'Document secured in vault',
      icon: CheckCircle2
    },
  ];

  const getCurrentStageIndex = () => {
    if (currentStage === 'blocked') return 1;
    return stages.findIndex(s => s.id === currentStage);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0a0a0f] border-2 border-cyan-400/30 rounded-2xl p-8 max-w-2xl w-full relative overflow-hidden"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Document Security Scan</h2>
                  <p className="text-sm text-white/60 mt-1">Processing: {filename}</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  disabled={currentStage !== 'complete' && currentStage !== 'blocked'}
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {!threatDetected ? (
                <>
                  {/* Progress bar */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Scan Progress</span>
                      <span className="text-xs font-bold text-cyan-400">{progress}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Stages */}
                  <div className="space-y-3">
                    {stages.map((stage, index) => {
                      const StageIcon = stage.icon;
                      const isActive = getCurrentStageIndex() === index;
                      const isComplete = getCurrentStageIndex() > index;

                      return (
                        <motion.div
                          key={stage.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                            isActive 
                              ? 'border-cyan-400/50 bg-cyan-400/5' 
                              : isComplete 
                              ? 'border-green-400/30 bg-green-400/5'
                              : 'border-white/10 bg-white/5'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            isActive 
                              ? 'bg-cyan-400/20 text-cyan-400' 
                              : isComplete
                              ? 'bg-green-400/20 text-green-400'
                              : 'bg-white/5 text-white/30'
                          }`}>
                            {isComplete ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <StageIcon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold text-sm uppercase tracking-wide ${
                              isActive ? 'text-cyan-400' : isComplete ? 'text-green-400' : 'text-white/40'
                            }`}>
                              {stage.label}
                            </h4>
                            <p className="text-xs text-white/60 mt-1">{stage.description}</p>
                          </div>
                          {isActive && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Activity className="w-4 h-4 text-cyan-400" />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                    className="inline-block p-6 rounded-full bg-red-500/10 border-2 border-red-500/50 mb-6"
                  >
                    <Ban className="w-16 h-16 text-red-500" />
                  </motion.div>
                  
                  <h3 className="text-xl font-black text-red-400 uppercase tracking-tight mb-2">Threat Detected & Blocked</h3>
                  <p className="text-white/80 mb-6 max-w-md mx-auto leading-relaxed">
                    This document contained unsafe elements and was safely blocked. Your data remains secure.
                  </p>
                  
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3 text-left">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-white/80"><strong>Detected:</strong> Suspicious macro detected</p>
                        <p className="text-sm text-white/80 mt-1"><strong>Action:</strong> File quarantined, not stored</p>
                        <p className="text-sm text-white/80 mt-1"><strong>Status:</strong> No data compromised</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => toast.info('Security log opened')}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    View Security Log
                  </Button>
                </motion.div>
              )}

              {currentStage === 'complete' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center"
                >
                  <p className="text-green-400 font-bold">✓ Document secured successfully</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IncidentResponseModal({ isOpen, onClose, incident }: { isOpen: boolean, onClose: () => void, incident: IncidentData | null }) {
  if (!incident) return null;

  const timeline = [
    { stage: 'Detection', status: 'complete', time: '00:00:01' },
    { stage: 'Isolation', status: incident.status === 'isolated' ? 'active' : 'complete', time: '00:00:03' },
    { stage: 'Integrity Scan', status: incident.status === 'scanning' ? 'active' : incident.status === 'resolved' ? 'complete' : 'pending', time: '00:00:15' },
    { stage: 'Resolution', status: incident.status === 'resolved' ? 'complete' : 'pending', time: '00:01:30' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0a0a0f] border-2 border-amber-400/30 rounded-2xl p-8 max-w-2xl w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-500/20">
                  <ShieldAlert className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Incident Response</h2>
                  <p className="text-sm text-white/60 mt-1">Automated security protocol activated</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
                  <Ban className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-red-400 uppercase">Auto-Isolated</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                  <Lock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-amber-400 uppercase">Vault Locked</p>
                </div>
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center">
                  <Activity className="w-6 h-6 text-cyan-400 mx-auto mb-2 animate-spin" />
                  <p className="text-xs font-bold text-cyan-400 uppercase">Scanning</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Response Timeline</h3>
                <div className="space-y-3">
                  {timeline.map((item, index) => (
                    <motion.div
                      key={item.stage}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        item.status === 'complete' 
                          ? 'bg-green-500/20 border-green-500/50' 
                          : item.status === 'active'
                          ? 'bg-cyan-500/20 border-cyan-500/50 animate-pulse'
                          : 'bg-white/5 border-white/20'
                      }`}>
                        {item.status === 'complete' ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : item.status === 'active' ? (
                          <Activity className="w-4 h-4 text-cyan-400 animate-spin" />
                        ) : (
                          <Clock className="w-4 h-4 text-white/30" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${
                          item.status === 'complete' ? 'text-green-400' : 
                          item.status === 'active' ? 'text-cyan-400' : 'text-white/40'
                        }`}>
                          {item.stage}
                        </p>
                      </div>
                      <span className="text-xs text-white/40 font-mono">{item.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Reassurance */}
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-green-400 mb-1">No personal data was accessed or leaked.</p>
                  <p className="text-xs text-white/60 leading-relaxed">
                    The threat was contained before any vault data could be accessed. All systems remain secure.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Main Component ---

export function SecurityCenter() {
  const [showScanFlow, setShowScanFlow] = useState(false);
  const [showIncident, setShowIncident] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'firewall' | 'ethics' | 'audit'>('overview');
  const [auditFilter, setAuditFilter] = useState<'all' | 'allowed' | 'blocked'>('all');

  const [auditLogs] = useState<AuditLogEntry[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 3600000),
      action: 'Document upload: Passport_Scan.pdf',
      result: 'allowed',
      details: 'Malware scan passed, stored in Vault'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 7200000),
      action: 'Health record access by user',
      result: 'allowed',
      details: 'Authenticated access to medical reports'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 10800000),
      action: 'Suspicious file: invoice_malware.doc',
      result: 'blocked',
      details: 'Macro virus detected, file quarantined'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 14400000),
      action: 'SOS activation from mobile device',
      result: 'allowed',
      details: 'Emergency contacts notified'
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 18000000),
      action: 'Guardian access request',
      result: 'reviewed',
      details: 'Temporary access granted with audit trail'
    },
  ]);

  const incident: IncidentData = {
    detected: new Date(),
    filename: 'suspicious_document.xlsx',
    threatType: 'Macro virus',
    status: 'scanning'
  };

  const filteredLogs = auditFilter === 'all' 
    ? auditLogs 
    : auditLogs.filter(log => log.result === auditFilter);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-block p-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/30 mb-4"
        >
          <Shield className="w-16 h-16 text-cyan-400" style={{ filter: 'drop-shadow(0 0 20px #06b6d4)' }} />
        </motion.div>
        
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
          Security & <span className="text-cyan-400">Ethics</span> Center
        </h1>
        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
          Your life data is protected by layered security and ethical AI governance.
        </p>

        <div className="flex items-center justify-center gap-2 pt-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 uppercase tracking-wider">All Systems Operational</Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="inline-flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'firewall', label: 'Firewall', icon: Layers },
            { id: 'ethics', label: 'Ethics', icon: HeartPulse },
            { id: 'audit', label: 'Audit Log', icon: FileText },
          ].map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                  selectedTab === tab.id
                    ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* System Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatusCard
              icon={Globe}
              title="Network Firewall"
              status="active"
              description="External network protection active"
              details="All incoming and outgoing connections are monitored and filtered. Malicious traffic is automatically blocked before reaching your device."
            />
            <StatusCard
              icon={Server}
              title="API Firewall"
              status="active"
              description="API layer secured"
              details="All API requests are validated and sanitized. Rate limiting and authentication prevent unauthorized access to your data."
            />
            <StatusCard
              icon={Scan}
              title="Malware Scanner"
              status="scanning"
              description="Real-time threat detection"
              details="Every file is scanned for viruses, malware, and suspicious code before storage. Known and unknown threats are identified using pattern recognition."
            />
            <StatusCard
              icon={Lock}
              title="Zero-Knowledge Processing"
              status="active"
              description="End-to-end encryption active"
              details="Your data is encrypted on your device before storage. Even the app itself cannot read your data without your authentication."
            />
            <StatusCard
              icon={HeartPulse}
              title="Ethics Guardrails"
              status="active"
              description="AI boundaries enforced"
              details="AI features respect medical and legal boundaries. The system refuses requests that could cause harm or provide professional advice."
            />
            <StatusCard
              icon={Shield}
              title="System Integrity"
              status="active"
              description="No tampering detected"
              details="Continuous monitoring ensures the app code hasn't been modified. Any unauthorized changes trigger immediate alerts."
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard className="p-6" neonColor="cyan">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-xl bg-cyan-400/20">
                  <Upload className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">Test Document Upload</h3>
                  <p className="text-sm text-white/60 mb-4 leading-relaxed">
                    See the security scan process in action. Upload a test document to view the multi-stage verification flow.
                  </p>
                  <Button 
                    onClick={() => setShowScanFlow(true)}
                    className="bg-cyan-400 text-black hover:bg-cyan-500 font-bold"
                  >
                    Simulate Upload
                  </Button>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" neonColor="amber">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-xl bg-amber-400/20">
                  <ShieldAlert className="w-8 h-8 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">Incident Response Demo</h3>
                  <p className="text-sm text-white/60 mb-4 leading-relaxed">
                    View how the system handles threats. See automated isolation, scanning, and resolution protocols.
                  </p>
                  <Button 
                    onClick={() => setShowIncident(true)}
                    variant="outline"
                    className="border-amber-400/50 text-amber-400 hover:bg-amber-400/10 font-bold"
                  >
                    View Response
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.div>
      )}

      {/* Firewall Visualization Tab */}
      {selectedTab === 'firewall' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Layered Defense Architecture</h2>
            <p className="text-white/60">Security by design, not patches. Hover over each layer to learn more.</p>
          </div>

          <GlassCard className="p-12" neonColor="cyan">
            <div className="relative w-full aspect-square max-w-2xl mx-auto flex items-center justify-center">
              <FirewallLayer 
                level={4} 
                title="External Network Firewall" 
                description="First line of defense. Blocks malicious traffic before it reaches your device."
                delay={0}
                index={0}
              />
              <FirewallLayer 
                level={3} 
                title="API Protection Layer" 
                description="Validates all data requests. Prevents unauthorized API access."
                delay={0.15}
                index={1}
              />
              <FirewallLayer 
                level={2} 
                title="Device Sandbox" 
                description="Isolates untrusted code. Prevents malware from accessing system resources."
                delay={0.3}
                index={2}
              />
              <FirewallLayer 
                level={1} 
                title="Encrypted Data Core" 
                description="Your data vault. Protected by end-to-end encryption and zero-knowledge architecture."
                delay={0.45}
                index={3}
              />

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.5)]"
              >
                <Database className="w-12 h-12 text-white" />
              </motion.div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-cyan-500/5 border-2 border-cyan-500/20">
              <h4 className="font-black text-cyan-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Real-Time Protection
              </h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Continuous network monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Automatic threat blocking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Zero-day exploit protection</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-purple-500/5 border-2 border-purple-500/20">
              <h4 className="font-black text-purple-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Defense Layers
              </h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>4 independent security layers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Redundant protection systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Fail-safe architecture</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Ethics & AI Governance Tab */}
      {selectedTab === 'ethics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-4 px-6 py-2 text-sm">
              ETHICS-FIRST AI SYSTEM
            </Badge>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Non-Configurable Guardrails</h2>
            <p className="text-white/60">These protections cannot be disabled. Ethics are permanent, not optional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard className="p-6" neonColor="purple">
              <div className="flex items-start gap-4">
                <motion.div 
                  className="p-3 rounded-xl bg-purple-500/20"
                  animate={{ 
                    boxShadow: [
                      '0 0 0px rgba(168, 85, 247, 0)',
                      '0 0 20px rgba(168, 85, 247, 0.4)',
                      '0 0 0px rgba(168, 85, 247, 0)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Lock className="w-6 h-6 text-purple-400" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">No Data Selling</h3>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">NON-CONFIGURABLE</Badge>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-3">
                    Your data will never be sold, shared, or monetized. This is a permanent architectural guarantee, not a policy.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-purple-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-bold">GUARANTEED</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" neonColor="cyan">
              <div className="flex items-start gap-4">
                <motion.div 
                  className="p-3 rounded-xl bg-cyan-500/20"
                  animate={{ 
                    boxShadow: [
                      '0 0 0px rgba(6, 182, 212, 0)',
                      '0 0 20px rgba(6, 182, 212, 0.4)',
                      '0 0 0px rgba(6, 182, 212, 0)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                >
                  <Users className="w-6 h-6 text-cyan-400" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">No Cross-User Learning</h3>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">NON-CONFIGURABLE</Badge>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-3">
                    AI insights are derived only from your data. Your information never trains models used by others.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-cyan-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-bold">ISOLATED PROCESSING</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" neonColor="green">
              <div className="flex items-start gap-4">
                <motion.div 
                  className="p-3 rounded-xl bg-green-500/20"
                  animate={{ 
                    boxShadow: [
                      '0 0 0px rgba(34, 197, 94, 0)',
                      '0 0 20px rgba(34, 197, 94, 0.4)',
                      '0 0 0px rgba(34, 197, 94, 0)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <UserCheck className="w-6 h-6 text-green-400" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Consent-Driven AI</h3>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">NON-CONFIGURABLE</Badge>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-3">
                    Every AI feature requires explicit user consent. No silent data processing or hidden analysis.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-bold">USER CONTROLLED</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" neonColor="amber">
              <div className="flex items-start gap-4">
                <motion.div 
                  className="p-3 rounded-xl bg-amber-500/20"
                  animate={{ 
                    boxShadow: [
                      '0 0 0px rgba(245, 158, 11, 0)',
                      '0 0 20px rgba(245, 158, 11, 0.4)',
                      '0 0 0px rgba(245, 158, 11, 0)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                >
                  <ShieldAlert className="w-6 h-6 text-amber-400" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Emergency-Only Access</h3>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">NON-CONFIGURABLE</Badge>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-3">
                    Third-party access is only possible during declared emergencies, with full audit trails.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-bold">PROTECTED ACCESS</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" neonColor="pink">
              <div className="flex items-start gap-4">
                <motion.div 
                  className="p-3 rounded-xl bg-pink-500/20"
                  animate={{ 
                    boxShadow: [
                      '0 0 0px rgba(236, 72, 153, 0)',
                      '0 0 20px rgba(236, 72, 153, 0.4)',
                      '0 0 0px rgba(236, 72, 153, 0)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                >
                  <Ban className="w-6 h-6 text-pink-400" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">AI Refusal System</h3>
                    <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 text-xs">NON-CONFIGURABLE</Badge>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-3">
                    AI refuses medical diagnoses, legal advice, or any request that requires professional licensing.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-pink-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-bold">BOUNDARY ENFORCED</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" neonColor="blue">
              <div className="flex items-start gap-4">
                <motion.div 
                  className="p-3 rounded-xl bg-blue-500/20"
                  animate={{ 
                    boxShadow: [
                      '0 0 0px rgba(59, 130, 246, 0)',
                      '0 0 20px rgba(59, 130, 246, 0.4)',
                      '0 0 0px rgba(59, 130, 246, 0)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2.5 }}
                >
                  <Database className="w-6 h-6 text-blue-400" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Offline-First Storage</h3>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">NON-CONFIGURABLE</Badge>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-3">
                    All data is stored locally on your device. No cloud dependency means no server-side vulnerabilities.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-blue-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-bold">LOCAL ONLY</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Refusal Examples */}
          <GlassCard className="p-8" neonColor="purple">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6 text-center">AI Refusal Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Ban className="w-5 h-5 text-red-400" />
                  <h4 className="font-bold text-red-400 text-sm uppercase">Medical Diagnosis</h4>
                </div>
                <p className="text-xs text-white/60 leading-relaxed italic">
                  "Based on your symptoms, you might have..."
                </p>
                <p className="text-xs text-red-400 mt-2 font-bold">❌ REFUSED</p>
              </div>

              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Ban className="w-5 h-5 text-red-400" />
                  <h4 className="font-bold text-red-400 text-sm uppercase">Legal Advice</h4>
                </div>
                <p className="text-xs text-white/60 leading-relaxed italic">
                  "You should sue them because..."
                </p>
                <p className="text-xs text-red-400 mt-2 font-bold">❌ REFUSED</p>
              </div>

              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Ban className="w-5 h-5 text-red-400" />
                  <h4 className="font-bold text-red-400 text-sm uppercase">Financial Guarantees</h4>
                </div>
                <p className="text-xs text-white/60 leading-relaxed italic">
                  "This investment will definitely..."
                </p>
                <p className="text-xs text-red-400 mt-2 font-bold">❌ REFUSED</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Audit Log Tab */}
      {selectedTab === 'audit' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Security Activity Log</h2>
              <p className="text-white/60">You can see everything. We hide nothing.</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value as any)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold focus:outline-none focus:border-cyan-400/50"
              >
                <option value="all">All Actions</option>
                <option value="allowed">Allowed Only</option>
                <option value="blocked">Blocked Only</option>
              </select>
              <Button variant="outline" className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10">
                <Download className="w-4 h-4 mr-2" />
                Export Log
              </Button>
            </div>
          </div>

          <GlassCard className="p-6" neonColor="cyan">
            <div className="space-y-3">
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border-2 ${
                    log.result === 'allowed'
                      ? 'bg-green-500/5 border-green-500/20'
                      : log.result === 'blocked'
                      ? 'bg-red-500/5 border-red-500/20'
                      : 'bg-amber-500/5 border-amber-500/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      log.result === 'allowed'
                        ? 'bg-green-500/20 text-green-400'
                        : log.result === 'blocked'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {log.result === 'allowed' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : log.result === 'blocked' ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-white text-sm">{log.action}</h4>
                        <span className="text-xs text-white/40 font-mono">
                          {log.timestamp.toLocaleTimeString()} • {log.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">{log.details}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge className={`text-xs ${
                          log.result === 'allowed'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : log.result === 'blocked'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}>
                          {log.result.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Transparency Statement */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-2 border-cyan-400/30 text-center">
            <Eye className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Complete Transparency</h3>
            <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
              Every security action is logged and visible to you. This audit trail is tamper-proof and can be exported at any time for verification.
            </p>
          </div>
        </motion.div>
      )}

      {/* Modals */}
      <DocumentScanFlow 
        isOpen={showScanFlow} 
        onClose={() => setShowScanFlow(false)} 
        filename="sample_document.pdf"
      />

      <IncidentResponseModal
        isOpen={showIncident}
        onClose={() => setShowIncident(false)}
        incident={incident}
      />
    </div>
  );
}
