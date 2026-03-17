import {
  Home,
  Mic,
  Clock,
  FileText,
  Heart,
  Wallet,
  Landmark,
  Shield,
  Users,
  TrendingUp,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'voice', icon: Mic, label: 'Voice Capture' },
  { id: 'timeline', icon: Clock, label: 'Life Timeline' },
  { id: 'documents', icon: FileText, label: 'Documents' },
  { id: 'health', icon: Heart, label: 'Healthcare' },
  { id: 'finance', icon: Wallet, label: 'Finance' },
  { id: 'schemes', icon: Landmark, label: 'Gov Schemes' },
  { id: 'legal', icon: Shield, label: 'Legal Protection' },
  { id: 'community', icon: Users, label: 'Community' },
  { id: 'insights', icon: TrendingUp, label: 'AI Insights' },
];

export function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-50
          w-72 backdrop-blur-xl border-r border-white/10
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ background: 'rgba(10, 10, 15, 0.9)' }}
      >
        <div className="flex flex-col h-full p-4">
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden self-end p-2 mb-4 rounded-lg hover:bg-white/10 transition-all"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-300 font-medium
                    ${isActive ? 'text-white' : 'text-white/70 hover:text-white'}
                  `}
                  style={
                    isActive
                      ? {
                          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(180, 90, 255, 0.2) 100%)',
                          border: '1px solid rgba(0, 212, 255, 0.5)',
                          boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
                        }
                      : { background: 'transparent' }
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div
            className="mt-4 p-4 rounded-xl backdrop-blur-sm"
            style={{
              background: 'rgba(30, 30, 45, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff 0%, #b45aff 100%)',
                  boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
                }}
              >
                U
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">User</p>
                <p className="text-sm text-white/60">Free Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
