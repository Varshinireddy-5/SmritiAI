import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import { 
  Mic, Camera, Scan, Clock, AlertTriangle, Bell, Plus,
  FileText, Heart, Wallet, Users, Shield, BookOpen, Upload,
  ChevronRight, Siren, Sparkles, Activity, Zap, Brain, MapPin,
  Calendar, TrendingUp, Target
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { localStore } from '../utils/localStore';
import { VoiceChatModal } from '../components/VoiceChatModal';
import { motion, AnimatePresence } from 'motion/react';
import { FloatingParticles } from '../components/FloatingParticles';
import { PulseBeam } from '../components/PulseBeam';
import { MagneticButton } from '../components/MagneticButton';
import { TextReveal, CharacterReveal } from '../components/TextReveal';
import { GlowingOrb } from '../components/GlowingOrb';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

export function Home() {
  const navigate = useNavigate();
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [stats, setStats] = useState({
    vault: 0,
    memories: 0,
    health: 0,
    money: 0,
  });

  useEffect(() => {
    localStore.initializeSampleData();
    loadStats();
  }, []);

  const loadStats = () => {
    setStats({
      vault: localStore.getVaultItems().length,
      memories: localStore.getMemories().length,
      health: localStore.getHealthRecords().length,
      money: localStore.getMoneyRecords().length,
    });
  };

  return (
    <motion.div 
      className="space-y-8 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Header */}
      <motion.div 
        className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4"
        variants={itemVariants}
      >
        <div className="text-center md:text-left">
          <motion.h1 
            className="text-5xl font-black text-white italic tracking-tighter leading-none mb-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            SMRITI <motion.span 
              className="text-[#87ceeb] not-italic"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring", bounce: 0.5 }}
            >
              AI
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-[#b8b8c8] font-bold tracking-[0.2em] uppercase text-xs flex items-center justify-center md:justify-start gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Sparkles className="w-3 h-3 text-[#87ceeb]" />
            </motion.div>
            Your Second Brain is Online
          </motion.p>
        </div>
        
        <motion.div 
          className="flex gap-3"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              onClick={() => setShowVoiceChat(true)}
              className="w-14 h-14 rounded-full bg-[#87ceeb] text-[#0a0a0f] shadow-[0_0_20px_rgba(135,206,235,0.4)] hover:scale-110 transition-all p-0 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 1
                }}
              />
              <Mic className="w-6 h-6 relative z-10" />
            </Button>
          </motion.div>
          <div className="hidden md:flex flex-col justify-center">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Voice First</p>
            <p className="text-xs font-bold text-white">Tap to Speak</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Main SOS Shortcut */}
      <motion.div variants={itemVariants}>
        <motion.button
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/sos')}
          className="w-full group relative overflow-hidden rounded-3xl p-6 bg-gradient-to-r from-[#ff006e] to-[#ff4d94] shadow-[0_10px_40px_rgba(255,0,110,0.4)]"
        >
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255,255,255,0.3)',
                    '0 0 40px rgba(255,255,255,0.5)',
                    '0 0 20px rgba(255,255,255,0.3)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Siren className="w-8 h-8 text-white animate-pulse" />
              </motion.div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">Emergency Portal</h2>
                <p className="text-sm font-bold text-white/80 uppercase tracking-wider">Instant Access • SOS Signaling • Medical ID</p>
              </div>
            </div>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </motion.button>
      </motion.div>

      {/* Quick Access Modules */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {[
          { icon: FileText, label: 'Vault', path: '/vault', count: stats.vault, color: '#87ceeb' },
          { icon: Heart, label: 'Health', path: '/health', count: stats.health, color: '#ff006e' },
          { icon: Wallet, label: 'Money', path: '/money', count: stats.money, color: '#00ff88' },
          { icon: Clock, label: 'Timeline', path: '/timeline', color: '#a855f7' },
        ].map((module, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Link to={module.path} className="block h-full">
              <GlassCard className="p-6 h-full group" neonColor="cyan">
                <motion.div 
                  className="flex flex-col items-center text-center space-y-3"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors relative"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                      style={{ 
                        boxShadow: `0 0 20px ${module.color}60`
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <module.icon className="w-6 h-6 relative z-10" style={{ color: module.color }} />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-black text-white/60 uppercase tracking-widest">{module.label}</h3>
                    {module.count !== undefined && (
                      <motion.p 
                        className="text-3xl font-black text-white italic mt-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1, type: "spring", bounce: 0.5 }}
                      >
                        {module.count}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* AI Memory Structuring Engine */}
      <motion.div
        variants={itemVariants}
      >
        <GlassCard className="p-8 border-dashed border-[#87ceeb]/40 relative overflow-hidden" neonColor="cyan">
          {/* Animated Background Glow */}
          <motion.div 
            className="absolute top-0 right-0 w-96 h-96 bg-[#87ceeb]/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="relative z-10 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <motion.div 
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#87ceeb]/20 to-[#a855f7]/20 flex items-center justify-center border-2 border-[#87ceeb]/30 shadow-[0_0_30px_rgba(135,206,235,0.3)]"
                >
                  <Brain className="w-8 h-8 text-[#87ceeb]" />
                </motion.div>
                <div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
                    AI Memory <span className="text-[#87ceeb] not-italic">Structuring Engine</span>
                  </h3>
                  <p className="text-sm text-[#b8b8c8] mt-2 font-medium">
                    Automatically converts memories into structured, searchable data
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setShowVoiceChat(true)}
                className="bg-[#87ceeb] text-[#0a0a0f] font-black px-8 h-12 rounded-full shadow-[0_0_20px_rgba(135,206,235,0.4)] hover:scale-105 transition-all uppercase tracking-wider"
              >
                <Mic className="w-5 h-5 mr-2" />
                Try It Now
              </Button>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { 
                  icon: FileText, 
                  label: 'Category', 
                  detail: 'Medical / Legal / Financial / Govt / Family / Cultural',
                  color: '#87ceeb' 
                },
                { 
                  icon: Calendar, 
                  label: 'Date', 
                  detail: 'Explicit or AI-inferred',
                  color: '#00ff88' 
                },
                { 
                  icon: Users, 
                  label: 'People', 
                  detail: 'Auto-detected from context',
                  color: '#a855f7' 
                },
                { 
                  icon: MapPin, 
                  label: 'Location', 
                  detail: 'Place extraction',
                  color: '#ffa500' 
                },
                { 
                  icon: Target, 
                  label: 'Importance', 
                  detail: 'AI-scored 1-10',
                  color: '#ff006e' 
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + (i * 0.1) }}
                  className="group"
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:border-white/20 hover:bg-white/10 transition-all h-full">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform"
                        style={{ boxShadow: `0 0 20px ${feature.color}20` }}
                      >
                        <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">
                          {feature.label}
                        </h4>
                        <p className="text-[9px] text-[#b8b8c8] leading-tight font-medium">
                          {feature.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Example Flow */}
            <div className="bg-gradient-to-r from-white/5 to-white/0 border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#87ceeb]/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-[#87ceeb]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Example</p>
                    <p className="text-sm text-white font-medium italic">
                      "Father had a heart attack at Apollo Hospital on Dec 15, 2023. Dr. Sharma handled the surgery."
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ChevronRight className="w-5 h-5 text-[#87ceeb]" />
                  <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-xl px-4 py-2">
                    <p className="text-[9px] font-black text-[#00ff88] uppercase tracking-widest">
                      ✓ Auto-filed in Health Module
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Secondary Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-white italic tracking-widest uppercase flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#87ceeb]" />
              Rapid Capture
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('/vault')}
              className="h-24 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-2 hover:bg-white/10 text-white font-bold"
            >
              <Scan className="w-8 h-8 text-[#87ceeb]" />
              SCAN DOCUMENT
            </Button>
            <Button 
              onClick={() => navigate('/memories')}
              className="h-24 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-2 hover:bg-white/10 text-white font-bold"
            >
              <Camera className="w-8 h-8 text-[#a855f7]" />
              ADD MEMORY
            </Button>
          </div>
        </div>

        <GlassCard className="p-6" neonColor="purple">
          <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-4">Upcoming</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#ff006e] mt-1.5 shadow-[0_0_10px_#ff006e]" />
              <div>
                <p className="text-sm font-bold text-white leading-tight">Cardiology Appt.</p>
                <p className="text-[10px] text-[#b8b8c8] uppercase mt-1">Tomorrow, 10:00 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#00ff88] mt-1.5 shadow-[0_0_10px_#00ff88]" />
              <div>
                <p className="text-sm font-bold text-white leading-tight">Pension Deposit</p>
                <p className="text-[10px] text-[#b8b8c8] uppercase mt-1">In 3 Days</p>
              </div>
            </div>
            <Button variant="link" className="p-0 h-auto text-[#87ceeb] text-xs font-black uppercase tracking-widest mt-2">
              VIEW SCHEDULE
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Legacy Shortcut */}
      <GlassCard className="p-8 border-dashed border-[#ff006e]/30" neonColor="pink">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#ff006e]/10 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-[#ff006e]" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Legacy & Inheritance</h3>
              <p className="text-sm text-[#b8b8c8]">Digital will, succession plan, and family messages.</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/legacy')}
            className="bg-[#ff006e] text-white font-bold px-8 rounded-full shadow-[0_0_15px_rgba(255,0,110,0.3)]"
          >
            OPEN VAULT
          </Button>
        </div>
      </GlassCard>

      <VoiceChatModal isOpen={showVoiceChat} onClose={() => setShowVoiceChat(false)} />
    </motion.div>
  );
}