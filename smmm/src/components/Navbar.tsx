import { Link, useLocation } from 'react-router';
import { useState } from 'react';
import { 
  Home, 
  FolderLock, 
  Image, 
  Heart, 
  Wallet, 
  Users,
  Scale,
  Archive,
  AlertTriangle,
  Settings as SettingsIcon,
  Menu,
  X,
  Brain,
  Clock,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import VoiceInterface from './VoiceInterface';

export function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/vault', icon: FolderLock, label: 'Vault' },
    { path: '/memories', icon: Image, label: 'Memories' },
    { path: '/timeline', icon: Clock, label: 'Timeline' },
    { path: '/health', icon: Heart, label: 'Health' },
    { path: '/money', icon: Wallet, label: 'Money' },
    { path: '/people', icon: Users, label: 'People' },
    { path: '/legacy', icon: Archive, label: 'Legacy' },
    { path: '/avatar-3d', icon: Bot, label: '3D Avatar' },
    { path: '/sos', icon: AlertTriangle, label: 'SOS' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3"
      style={{
        background: 'rgba(10, 10, 15, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(135, 206, 235, 0.2)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg bg-[rgba(135,206,235,0.2)] flex items-center justify-center relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#87ceeb] to-transparent opacity-0 group-hover:opacity-30"
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <Heart className="w-5 h-5 text-[#87ceeb] relative z-10" />
          </motion.div>
          <motion.span 
            className="text-xl font-bold text-white" 
            style={{ textShadow: '0 0 10px rgba(135,206,235,0.5)' }}
            whileHover={{ textShadow: '0 0 20px rgba(135,206,235,0.8)' }}
          >
            SmritiAI
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Link
                  to={item.path}
                  className="relative group"
                >
                  <motion.div
                    className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider whitespace-nowrap relative overflow-hidden ${
                      isActive 
                        ? 'bg-[rgba(135,206,235,0.2)] text-white border border-[#87ceeb]' 
                        : 'text-[#b8b8c8] hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Animated background on hover */}
                    {!isActive && (
                      <motion.div
                        className="absolute inset-0 bg-[rgba(135,206,235,0.1)] opacity-0 group-hover:opacity-100"
                        layoutId={`nav-hover-${item.path}`}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-[rgba(135,206,235,0.2)] border border-[#87ceeb] rounded-lg"
                        style={{ 
                          boxShadow: '0 0 10px rgba(135,206,235,0.3), inset 0 0 10px rgba(135,206,235,0.1)' 
                        }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    <motion.div
                      className="relative z-10"
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.div>
                    <span className="font-bold relative z-10">{item.label}</span>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Voice Interface */}
        <div className="hidden lg:block">
          <VoiceInterface />
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-white hover:bg-[rgba(135,206,235,0.1)] relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#87ceeb]/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 relative z-10" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6 relative z-10" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
          >
            <motion.div 
              className="mt-4 pb-4 max-h-[70vh] overflow-y-auto"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Mobile Voice Interface */}
              <div className="mb-4 p-4 rounded-lg bg-[rgba(135,206,235,0.1)] border border-[#87ceeb]/30">
                <VoiceInterface className="flex justify-center" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative overflow-hidden ${
                          isActive 
                            ? 'bg-[rgba(135,206,235,0.2)] text-white border border-[#87ceeb]' 
                            : 'text-[#b8b8c8] hover:text-white bg-[rgba(30,50,80,0.5)] border border-transparent'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-[#87ceeb]/20 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                        <Icon className="w-5 h-5 relative z-10" />
                        <span className="text-sm font-semibold relative z-10">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}