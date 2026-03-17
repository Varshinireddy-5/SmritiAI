import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import { 
  Mic, 
  Clock, 
  FileText, 
  Heart, 
  Wallet, 
  AlertTriangle,
  Award,
  Brain,
  Zap,
  TrendingUp,
  Settings,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { localStore } from '../utils/localStore';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalMemories: 0,
    healthRecords: 0,
    documents: 0,
    financialRecords: 0,
  });
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  useEffect(() => {
    // Initialize sample data on first load
    localStore.initializeSampleData();
    loadStats();
  }, []);

  const loadStats = () => {
    const memories = localStore.getMemories();
    const documents = localStore.getDocuments();
    const healthRecords = localStore.getHealthRecords();
    const financeRecords = localStore.getFinanceRecords();

    setStats({
      totalMemories: memories.length,
      healthRecords: healthRecords.length,
      documents: documents.length,
      financialRecords: financeRecords.length,
    });
  };

  const quickActions = [
    {
      icon: Mic,
      label: 'Voice Memory',
      description: 'Capture a new memory by speaking',
      path: '/voice',
      color: 'cyan' as const,
    },
    {
      icon: Clock,
      label: 'Timeline',
      description: 'View your life chronologically',
      path: '/timeline',
      color: 'purple' as const,
    },
    {
      icon: FileText,
      label: 'Documents',
      description: 'Scan and organize documents',
      path: '/documents',
      color: 'pink' as const,
    },
    {
      icon: Heart,
      label: 'Health',
      description: 'Medical records & reminders',
      path: '/health',
      color: 'cyan' as const,
    },
    {
      icon: Wallet,
      label: 'Finance',
      description: 'Track income & expenses',
      path: '/finance',
      color: 'green' as const,
    },
    {
      icon: AlertTriangle,
      label: 'Crisis Mode',
      description: 'Emergency information access',
      path: '/crisis',
      color: 'pink' as const,
    },
  ];

  const insights = [
    {
      icon: Zap,
      title: 'Pattern Detected',
      description: 'You visit the hospital every 3 months for checkups',
      type: 'health',
    },
    {
      icon: TrendingUp,
      title: 'Financial Insight',
      description: 'Your income increased by 15% this season',
      type: 'finance',
    },
    {
      icon: Award,
      title: 'New Scheme Available',
      description: 'You may be eligible for Ayushman Bharat',
      type: 'scheme',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Brain className="w-12 h-12 text-[#87ceeb]" />
          <h1 
            className="text-5xl font-bold text-white"
            style={{ textShadow: '0 0 20px rgba(135, 206, 235, 0.5)' }}
          >
            SmritiAI
          </h1>
        </div>
        <p className="text-xl text-white max-w-2xl mx-auto">
          A Second Brain for People Who Can't Afford to Forget
        </p>
        <p className="text-[#b8b8c8]">
          Your personal AI memory assistant for health, finance, documents, and life events
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-6" neonColor="cyan">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#b8b8c8] text-sm">Total Memories</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalMemories}</p>
            </div>
            <Brain className="w-10 h-10 text-[#00d9ff]" />
          </div>
        </GlassCard>

        <GlassCard className="p-6" neonColor="pink">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#b8b8c8] text-sm">Health Records</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.healthRecords}</p>
            </div>
            <Heart className="w-10 h-10 text-[#ff006e]" />
          </div>
        </GlassCard>

        <GlassCard className="p-6" neonColor="purple">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#b8b8c8] text-sm">Documents</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.documents}</p>
            </div>
            <FileText className="w-10 h-10 text-[#a855f7]" />
          </div>
        </GlassCard>

        <GlassCard className="p-6" neonColor="green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#b8b8c8] text-sm">Financial Records</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.financialRecords}</p>
            </div>
            <Wallet className="w-10 h-10 text-[#00ff88]" />
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.path} to={action.path}>
                <GlassCard className="p-6 h-full" neonColor={action.color}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      action.color === 'cyan' ? 'bg-[rgba(0,217,255,0.1)]' :
                      action.color === 'purple' ? 'bg-[rgba(168,85,247,0.1)]' :
                      action.color === 'pink' ? 'bg-[rgba(255,0,110,0.1)]' :
                      'bg-[rgba(0,255,136,0.1)]'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        action.color === 'cyan' ? 'text-[#00d9ff]' :
                        action.color === 'purple' ? 'text-[#a855f7]' :
                        action.color === 'pink' ? 'text-[#ff006e]' :
                        'text-[#00ff88]'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{action.label}</h3>
                      <p className="text-sm text-[#b8b8c8]">{action.description}</p>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">AI Insights</h2>
        <div className="space-y-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <GlassCard key={index} className="p-5" neonColor="cyan">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-[rgba(0,217,255,0.1)]">
                    <Icon className="w-5 h-5 text-[#00d9ff]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{insight.title}</h4>
                    <p className="text-sm text-[#b8b8c8] mt-1">{insight.description}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]"
                  >
                    View
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}