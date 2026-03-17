import { Brain, FileText, Heart, Wallet, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export function Dashboard() {
  const stats = [
    {
      icon: Brain,
      label: 'Total Memories',
      value: '127',
      change: '+12 this week',
      color: '#00d4ff',
    },
    {
      icon: FileText,
      label: 'Documents',
      value: '23',
      change: '3 need review',
      color: '#b45aff',
    },
    {
      icon: Heart,
      label: 'Health Records',
      value: '8',
      change: 'All up to date',
      color: '#ff006e',
    },
    {
      icon: Wallet,
      label: 'Financial Entries',
      value: '45',
      change: '₹2,000 pending',
      color: '#39ff14',
    },
  ];

  const recentMemories = [
    {
      id: 1,
      text: 'Visited Dr. Sharma for blood pressure checkup',
      category: 'Health',
      date: '2 hours ago',
      confidence: 95,
      color: '#ff006e',
    },
    {
      id: 2,
      text: 'Received pension payment of ₹5,000',
      category: 'Finance',
      date: '1 day ago',
      confidence: 98,
      color: '#39ff14',
    },
    {
      id: 3,
      text: 'Renewed ration card at local office',
      category: 'Government',
      date: '3 days ago',
      confidence: 92,
      color: '#b45aff',
    },
  ];

  const insights = [
    {
      type: 'warning',
      title: 'Health Pattern Detected',
      description: 'You mentioned chest pain 3 times this month. Consider consulting a doctor.',
      icon: AlertCircle,
      color: '#ff006e',
    },
    {
      type: 'success',
      title: 'Financial Milestone',
      description: 'You\'ve successfully tracked all loan repayments this quarter.',
      icon: CheckCircle,
      color: '#39ff14',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div
        className="p-6 rounded-2xl backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(180, 90, 255, 0.1) 100%)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          boxShadow: '0 0 40px rgba(0, 212, 255, 0.2)',
        }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back! 🙏</h1>
        <p className="text-white/80">Your memories are safe. Let's see what's important today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl backdrop-blur-xl transition-all hover:scale-105 cursor-pointer"
              style={{
                background: 'rgba(30, 30, 45, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{
                    background: `${stat.color}20`,
                    boxShadow: `0 0 20px ${stat.color}40`,
                  }}
                >
                  <Icon size={24} className="text-white" style={{ filter: `drop-shadow(0 0 5px ${stat.color})` }} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-white/60 mb-1">{stat.label}</p>
              <p className="text-xs text-white/80">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* AI Insights */}
      <div
        className="p-6 rounded-2xl backdrop-blur-xl"
        style={{
          background: 'rgba(30, 30, 45, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={24} style={{ filter: 'drop-shadow(0 0 10px #00d4ff)' }} />
          AI Insights
        </h2>
        <div className="space-y-3">
          {insights.map((insight, i) => {
            const Icon = insight.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-xl transition-all hover:scale-[1.02]"
                style={{
                  background: `${insight.color}10`,
                  border: `1px solid ${insight.color}30`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background: `${insight.color}20`,
                      boxShadow: `0 0 15px ${insight.color}40`,
                    }}
                  >
                    <Icon size={20} className="text-white" style={{ filter: `drop-shadow(0 0 5px ${insight.color})` }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{insight.title}</h3>
                    <p className="text-sm text-white/80">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Memories */}
      <div
        className="p-6 rounded-2xl backdrop-blur-xl"
        style={{
          background: 'rgba(30, 30, 45, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h2 className="text-xl font-bold text-white mb-4">Recent Memories</h2>
        <div className="space-y-3">
          {recentMemories.map((memory) => (
            <div
              key={memory.id}
              className="p-4 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
              style={{
                background: 'rgba(10, 10, 15, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{
                      background: `${memory.color}30`,
                      border: `1px solid ${memory.color}50`,
                    }}
                  >
                    {memory.category}
                  </span>
                  <span className="text-xs text-white/60">{memory.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-16 h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${memory.confidence}%`,
                        background: memory.color,
                        boxShadow: `0 0 10px ${memory.color}`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-white/60">{memory.confidence}%</span>
                </div>
              </div>
              <p className="text-white">{memory.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
