import { Brain, Lightbulb, TrendingUp, AlertTriangle, Heart, Calendar } from 'lucide-react';

export function AIInsights() {
  const insights = [
    {
      category: 'Health Pattern',
      icon: Heart,
      color: '#ff006e',
      title: 'Recurring Health Concern',
      description: 'You\'ve mentioned chest pain 3 times in the last 30 days, particularly after physical activity.',
      recommendation: 'Consider scheduling a cardiac evaluation with your doctor.',
      confidence: 87,
      connections: ['Health checkup on Jan 28', 'Medication: Amlodipine', 'Dr. Sharma contact'],
    },
    {
      category: 'Financial Pattern',
      icon: TrendingUp,
      color: '#39ff14',
      title: 'Seasonal Income Variation',
      description: 'Your income shows a consistent pattern: higher during festival months (Oct-Dec) for the past 2 years.',
      recommendation: 'Plan major expenses during peak income months. Consider saving extra during this period.',
      confidence: 92,
      connections: ['Diwali bonus 2024', 'Festival season income 2025'],
    },
    {
      category: 'Life Pattern',
      icon: Calendar,
      color: '#00d4ff',
      title: 'Medication Adherence',
      description: 'You\'ve been consistent with diabetes medication for 6 months. Excellent adherence!',
      recommendation: 'Continue this routine. Your next HbA1c test is recommended in 2 months.',
      confidence: 95,
      connections: ['Metformin dosage', 'Last HbA1c: 6.8%', 'Dr. Sharma prescription'],
    },
    {
      category: 'Risk Detection',
      icon: AlertTriangle,
      color: '#ff9500',
      title: 'Missed Medical Appointment',
      description: 'You mentioned scheduling a follow-up with Dr. Sharma 3 weeks ago, but no visit record found.',
      recommendation: 'Consider calling Dr. Sharma\'s clinic to confirm or reschedule your appointment.',
      confidence: 78,
      connections: ['Dr. Sharma contact: +91 98765 12345'],
    },
  ];

  const connections = [
    {
      title: 'Health & Finance Link',
      description: 'Medical expenses have accounted for 18% of total expenses over the last year.',
      nodes: ['Healthcare', 'Financial Tracking'],
    },
    {
      title: 'Timeline Gap Detected',
      description: 'No memories recorded between Jan 10-14. Was this a travel period or illness?',
      nodes: ['Life Timeline', 'Memory Capture'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="p-6 rounded-2xl backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(180, 90, 255, 0.1) 100%)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          boxShadow: '0 0 40px rgba(0, 212, 255, 0.2)',
        }}
      >
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Brain size={36} style={{ filter: 'drop-shadow(0 0 15px #00d4ff)' }} />
          AI Insights
        </h1>
        <p className="text-white/80">
          Discover hidden patterns, connections, and personalized recommendations from your memories.
        </p>
      </div>

      {/* Main Insights */}
      <div className="grid gap-6">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl backdrop-blur-xl transition-all hover:scale-[1.02]"
              style={{
                background: 'rgba(30, 30, 45, 0.6)',
                border: `1px solid ${insight.color}30`,
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{
                    background: `${insight.color}20`,
                    boxShadow: `0 0 20px ${insight.color}40`,
                  }}
                >
                  <Icon size={28} className="text-white" style={{ filter: `drop-shadow(0 0 5px ${insight.color})` }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{
                        background: `${insight.color}30`,
                        border: `1px solid ${insight.color}50`,
                      }}
                    >
                      {insight.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-20 h-1.5 rounded-full bg-white/20 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${insight.confidence}%`,
                            background: insight.color,
                            boxShadow: `0 0 10px ${insight.color}`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-white/60">{insight.confidence}%</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{insight.title}</h3>
                  <p className="text-white/80 mb-3">{insight.description}</p>
                  
                  {/* Recommendation */}
                  <div
                    className="p-4 rounded-xl mb-4"
                    style={{
                      background: `${insight.color}10`,
                      border: `1px solid ${insight.color}20`,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb size={18} className="text-white mt-0.5" style={{ filter: `drop-shadow(0 0 5px ${insight.color})` }} />
                      <div>
                        <p className="text-sm font-medium text-white mb-1">Recommendation</p>
                        <p className="text-sm text-white/80">{insight.recommendation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Connected Memories */}
                  <div>
                    <p className="text-xs text-white/60 mb-2">Connected to:</p>
                    <div className="flex flex-wrap gap-2">
                      {insight.connections.map((connection, j) => (
                        <span
                          key={j}
                          className="px-3 py-1 rounded-lg text-xs text-white cursor-pointer transition-all hover:scale-105"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          {connection}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Memory Connections */}
      <div
        className="p-6 rounded-2xl backdrop-blur-xl"
        style={{
          background: 'rgba(30, 30, 45, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Brain size={24} style={{ filter: 'drop-shadow(0 0 10px #b45aff)' }} />
          Cross-Memory Connections
        </h2>
        <div className="space-y-4">
          {connections.map((connection, i) => (
            <div
              key={i}
              className="p-4 rounded-xl transition-all hover:scale-[1.02]"
              style={{
                background: 'rgba(180, 90, 255, 0.1)',
                border: '1px solid rgba(180, 90, 255, 0.3)',
              }}
            >
              <h3 className="font-semibold text-white mb-2">{connection.title}</h3>
              <p className="text-sm text-white/80 mb-3">{connection.description}</p>
              <div className="flex gap-2">
                {connection.nodes.map((node, j) => (
                  <span
                    key={j}
                    className="px-3 py-1 rounded-lg text-xs font-medium text-white"
                    style={{
                      background: 'rgba(180, 90, 255, 0.2)',
                      border: '1px solid rgba(180, 90, 255, 0.4)',
                    }}
                  >
                    {node}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
