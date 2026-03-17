import { Brain, Menu, Shield, Bell } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  showCrisisMode?: boolean;
  onCrisisModeToggle?: () => void;
}

export function Header({ onMenuClick, showCrisisMode = false, onCrisisModeToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ background: 'rgba(10, 10, 15, 0.8)' }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all"
            >
              <Menu size={24} className="text-white" />
            </button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Brain size={32} className="text-white" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.8))' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.5)' }}>
                  SmritiAI
                </h1>
                <p className="text-xs text-white/80">Your Second Brain</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-white/10 transition-all">
              <Bell size={20} className="text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#39ff14', boxShadow: '0 0 10px #39ff14' }}></span>
            </button>
            
            {showCrisisMode && (
              <button
                onClick={onCrisisModeToggle}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.2) 0%, rgba(180, 90, 255, 0.2) 100%)',
                  border: '2px solid #ff006e',
                  boxShadow: '0 0 20px rgba(255, 0, 110, 0.5)',
                }}
              >
                <Shield size={20} className="text-white" />
                <span className="hidden sm:inline text-white">Crisis Mode</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
