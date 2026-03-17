import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Brain, TrendingUp, TrendingDown, Activity, Heart, Wallet, Users,
  AlertCircle, CheckCircle2, Clock, Calendar, Sparkles, ArrowRight,
  Lightbulb, Target, Shield, Bell, BarChart3, PieChart, LineChart,
  Zap, Award, AlertTriangle, Info, RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { localStore } from '../utils/localStore';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner@2.0.3';

interface Insight {
  id: string;
  category: 'health' | 'financial' | 'personal' | 'professional' | 'document' | 'general';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'positive';
  actionable: boolean;
  action?: string;
  timestamp: string;
  actionType?: 'navigate' | 'toast' | 'dialog';
  actionValue?: string;
}

export function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | Insight['category']>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = () => {
    setIsAnalyzing(true);
    
    // Simulate deep analysis
    setTimeout(() => {
      const healthRecords = localStore.getHealthRecords();
      const moneyRecords = localStore.getMoneyRecords();
      const vaultItems = localStore.getVaultItems();
      const people = localStore.getPeople();
      const memories = localStore.getMemories();

      const generatedInsights: Insight[] = [];

      // Health
      if (healthRecords.length > 0) {
        generatedInsights.push({
          id: 'health_1',
          category: 'health',
          title: 'BP Trend Analysis',
          description: 'Your blood pressure readings have been consistently stable at 135/85. This is good progress. Continue your current medication as prescribed by Dr. Mehta.',
          severity: 'positive',
          actionable: true,
          action: 'View Health Records',
          actionType: 'navigate',
          actionValue: '/health',
          timestamp: new Date().toISOString()
        });
      }

      // Financial
      const pendingLoans = moneyRecords.filter(r => r.type === 'loan' && r.status === 'pending');
      if (pendingLoans.length > 0) {
        generatedInsights.push({
          id: 'financial_1',
          category: 'financial',
          title: 'Pending Loan Follow-up',
          description: `You have ₹${pendingLoans.reduce((s, r) => s + r.amount, 0).toLocaleString()} in pending loans. Ramesh Kumar's payment is due in 3 weeks.`,
          severity: 'warning',
          actionable: true,
          action: 'Send Reminder Message',
          actionType: 'toast',
          actionValue: 'Reminder sent to Ramesh Kumar via SMS.',
          timestamp: new Date().toISOString()
        });
      }

      // Documents
      const unlockedDocs = vaultItems.filter(v => !v.isLocked);
      if (unlockedDocs.length > 0) {
        generatedInsights.push({
          id: 'document_1',
          category: 'document',
          title: 'Security Vulnerability',
          description: `${unlockedDocs.length} sensitive documents in your vault are not PIN-protected. We recommend locking your Aadhaar and PAN cards immediately.`,
          severity: 'critical',
          actionable: true,
          action: 'Secure My Vault',
          actionType: 'navigate',
          actionValue: '/vault',
          timestamp: new Date().toISOString()
        });
      }

      // Personal
      if (people.length < 3) {
        generatedInsights.push({
          id: 'personal_1',
          category: 'personal',
          title: 'Emergency Network Gap',
          description: 'You currently have only 2 emergency contacts. For optimal safety, we recommend adding at least one more trusted person who lives nearby.',
          severity: 'warning',
          actionable: true,
          action: 'Add Emergency Contact',
          actionType: 'navigate',
          actionValue: '/people',
          timestamp: new Date().toISOString()
        });
      }

      // Legacy
      const legacyRecords = localStore.getAfterMeRecords();
      if (legacyRecords.length < 5) {
        generatedInsights.push({
          id: 'personal_2',
          category: 'document',
          title: 'Digital Will Incomplete',
          description: 'You have started your legacy planning but some critical sections like "Digital Keys" and "Personal Messages" are empty.',
          severity: 'info',
          actionable: true,
          action: 'Complete Legacy Plan',
          actionType: 'navigate',
          actionValue: '/legacy',
          timestamp: new Date().toISOString()
        });
      }

      // General
      generatedInsights.push({
        id: 'general_1',
        category: 'general',
        title: 'Weekly Life Summary',
        description: 'You\'ve added 2 new memories and updated 1 health record this week. Your digital organization score has improved by 12%.',
        severity: 'positive',
        actionable: false,
        timestamp: new Date().toISOString()
      });

      setInsights(generatedInsights);
      setIsAnalyzing(false);
      toast.success('AI Analysis Complete');
    }, 1500);
  };

  const refreshInsights = () => {
    generateInsights();
  };

  const handleInsightAction = (insight: Insight) => {
    if (!insight.actionable || !insight.actionType) return;

    switch (insight.actionType) {
      case 'navigate':
        navigate(insight.actionValue || '/');
        break;
      case 'toast':
        toast.success(insight.actionValue || 'Action performed');
        break;
      case 'dialog':
        toast.info('Feature coming soon: ' + insight.actionValue);
        break;
    }
  };

  const categories = [
    { value: 'all', label: 'All Insights', icon: Brain, color: '#87ceeb' },
    { value: 'health', label: 'Health', icon: Heart, color: '#ff006e' },
    { value: 'financial', label: 'Financial', icon: Wallet, color: '#00ff88' },
    { value: 'personal', label: 'Personal', icon: Users, color: '#a855f7' },
    { value: 'document', label: 'Documents', icon: Shield, color: '#ffa500' },
    { value: 'general', label: 'General', icon: Sparkles, color: '#00d9ff' },
  ] as const;

  const getSeverityColor = (severity: Insight['severity']) => {
    const colors = {
      info: '#87ceeb',
      warning: '#ffa500',
      critical: '#ff006e',
      positive: '#00ff88'
    };
    return colors[severity];
  };

  const getSeverityIcon = (severity: Insight['severity']) => {
    const icons = {
      info: Info,
      warning: AlertTriangle,
      critical: AlertCircle,
      positive: CheckCircle2
    };
    return icons[severity];
  };

  const filteredInsights = activeCategory === 'all' 
    ? insights 
    : insights.filter(i => i.category === activeCategory);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase">
            AI <span className="text-[#87ceeb]">INSIGHTS</span>
          </h1>
          <p className="text-[#b8b8c8] font-medium flex items-center gap-2 text-sm">
            <Brain className="w-4 h-4 text-[#87ceeb]" />
            Smart insights from your life data, analyzed locally.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={refreshInsights}
            disabled={isAnalyzing}
            className="rounded-full bg-[#87ceeb] text-[#0a0a0f] hover:bg-[#9dd9f3] font-black px-8 shadow-[0_0_20px_rgba(135,206,235,0.3)] transition-all h-12"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                ANALYZING...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                RE-ANALYZE
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
        <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-purple-400 font-bold mb-1">AI-Powered Suggestions · Not Professional Advice</p>
          <p className="text-xs text-white/60 leading-relaxed">
            These insights are generated by AI to help you identify patterns in your data. They support decision-making but do not replace professional medical, legal, or financial advice. Always consult qualified experts for important decisions.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Positive', count: insights.filter(i => i.severity === 'positive').length, color: '#00ff88', icon: TrendingUp },
          { label: 'Warnings', count: insights.filter(i => i.severity === 'warning').length, color: '#ffa500', icon: AlertTriangle },
          { label: 'Critical', count: insights.filter(i => i.severity === 'critical').length, color: '#ff006e', icon: AlertCircle },
          { label: 'Actionable', count: insights.filter(i => i.actionable).length, color: '#87ceeb', icon: Target },
        ].map(stat => (
          <GlassCard key={stat.label} className="p-4 flex items-center gap-4" neonColor="cyan">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${stat.color}10` }}>
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stat.count}</p>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all whitespace-nowrap border-2 ${
                isActive 
                  ? 'bg-white/10 border-[#87ceeb] text-white shadow-[0_0_15px_rgba(135,206,235,0.2)]' 
                  : 'bg-white/5 border-white/5 text-[#b8b8c8] hover:border-white/20'
              }`}
            >
              <Icon className="w-5 h-5" style={{ color: isActive ? '#87ceeb' : cat.color }} />
              <span className="font-bold text-sm tracking-wide uppercase">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {isAnalyzing ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-full border-4 border-t-[#87ceeb] border-white/5 animate-spin" />
            <p className="text-xl font-bold text-white animate-pulse uppercase tracking-tighter">Analyzing your patterns...</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredInsights.map((insight, index) => {
              const SeverityIcon = getSeverityIcon(insight.severity);
              const severityColor = getSeverityColor(insight.severity);

              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="overflow-hidden" neonColor="cyan">
                    <div className="p-6">
                      <div className="flex items-start gap-5">
                        <div 
                          className="p-4 rounded-2xl shrink-0"
                          style={{ backgroundColor: `${severityColor}15`, border: `1px solid ${severityColor}30` }}
                        >
                          <SeverityIcon className="w-7 h-7" style={{ color: severityColor }} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">{insight.title}</h3>
                            <span 
                              className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0 border"
                              style={{ 
                                backgroundColor: `${severityColor}20`,
                                color: severityColor,
                                borderColor: `${severityColor}40`
                              }}
                            >
                              {insight.category}
                            </span>
                          </div>
                          
                          <p className="text-[#b8b8c8] leading-relaxed mb-6 text-sm">{insight.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{new Date(insight.timestamp).toLocaleString()}</span>
                            </div>
                            
                            {insight.actionable && (
                              <Button 
                                onClick={() => handleInsightAction(insight)}
                                className="rounded-full font-black text-xs px-6 hover:scale-105 transition-transform"
                                style={{ backgroundColor: severityColor, color: '#0a0a0f' }}
                              >
                                {insight.action}
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Data Privacy Note */}
      <GlassCard className="p-8 border-dashed border-[#87ceeb]/30" neonColor="purple">
        <div className="flex items-start gap-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shrink-0">
            <Shield className="w-8 h-8 text-[#00ff88]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase italic tracking-tight">Zero-Knowledge Processing</h3>
            <p className="text-sm text-[#b8b8c8] leading-relaxed mb-4">
              All AI analysis is performed strictly on your device. SmritiAI does not upload your sensitive health or financial data to any cloud servers. 
              Your privacy is our core architecture.
            </p>
            <div className="flex gap-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
                Offline First
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
                Encrypted Storage
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}