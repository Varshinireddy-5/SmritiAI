import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  AlertTriangle, User, Heart, Phone, FileText, QrCode,
  Shield, MapPin, Activity, Pill, Siren, Zap,
  WifiOff, Battery, Volume2, LifeBuoy, ArrowRight, CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { localStore, EmergencyInfo } from '../utils/localStore';
import { motion, AnimatePresence } from 'motion/react';
import { PulseBeam } from '../components/PulseBeam';
import { BounceIn, SlideInLeft, SlideInRight } from '../components/BounceIn';

export function SOS() {
  const [emergencyData, setEmergencyData] = useState<EmergencyInfo[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [isCrisisMode, setIsCrisisMode] = useState(false);

  useEffect(() => {
    loadEmergencyData();
  }, []);

  const loadEmergencyData = () => {
    const data = localStore.getEmergencyInfo();
    setEmergencyData(data.filter(d => d.isQuickAccess));
  };

  const triggerSOS = () => {
    toast.error('SOS TRIGGERED', { 
      description: 'Sending location to emergency contacts...',
      duration: 5000 
    });
    // Simulate SMS sending
  };

  const identity = emergencyData.find(d => d.type === 'identity');
  const health = emergencyData.find(d => d.type === 'health');
  const contacts = emergencyData.find(d => d.type === 'contact');
  const documents = emergencyData.find(d => d.type === 'document');

  return (
    <div className="space-y-6 pb-20">
      {/* Crisis Banner */}
      <AnimatePresence>
        {isCrisisMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#ff006e] p-4 -mx-4 md:-mx-6 flex items-center justify-between shadow-[0_10px_30px_rgba(255,0,110,0.5)] z-50 sticky top-16"
          >
            <div className="flex items-center gap-3 text-white">
              <Siren className="w-6 h-6 animate-pulse" />
              <div>
                <p className="font-black uppercase tracking-tighter text-lg">CRISIS MODE ACTIVE</p>
                <p className="text-xs font-bold opacity-80">Device tracking enabled • Contacts notified</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="bg-white/20 border-white text-white font-bold text-xs"
              onClick={() => setIsCrisisMode(false)}
            >
              DEACTIVATE
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center text-center space-y-4 pt-4">
        <motion.div
          animate={isCrisisMode ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-[#ff006e]/20 blur-2xl animate-pulse" />
          <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-[#ff006e]/30 flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(255,0,110,0.2)]">
            <AlertTriangle className="w-12 h-12 text-[#ff006e]" />
          </div>
        </motion.div>
        <div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">SOS <span className="text-[#ff006e] not-italic">PORTAL</span></h1>
          <p className="text-[#b8b8c8] font-bold tracking-widest uppercase text-[10px] mt-2">Zero-Connectivity Survival Access</p>
        </div>
      </div>

      {/* Main SOS Trigger */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-6 relative overflow-hidden group border-2 border-[#ff006e]/30" neonColor="pink">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform">
            <Zap className="w-32 h-32 text-[#ff006e]" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white mb-2 uppercase italic">Extreme Emergency</h3>
            <p className="text-sm text-[#b8b8c8] mb-6">Triggers loud alarm, shares location via SMS (even with low signal), and broadcasts medical profile.</p>
            <Button 
              onClick={() => { triggerSOS(); setIsCrisisMode(true); }}
              className="w-full h-16 bg-[#ff006e] text-white font-black text-xl italic hover:bg-[#ff1a7f] shadow-[0_0_30px_rgba(255,0,110,0.4)] transition-all hover:scale-[1.02]"
            >
              SEND PANIC SIGNAL
            </Button>
          </div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden group border-2 border-[#87ceeb]/30" neonColor="cyan">
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform">
            <QrCode className="w-32 h-32 text-[#87ceeb]" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white mb-2 uppercase italic">Offline QR ID</h3>
            <p className="text-sm text-[#b8b8c8] mb-6">Essential for first responders. Displays your blood group, allergies, and family phone numbers instantly.</p>
            <Button 
              onClick={() => setShowQR(!showQR)}
              className="w-full h-16 bg-[#87ceeb] text-[#0a0a0f] font-black text-xl italic hover:bg-[#b8e0f6] shadow-[0_0_30px_rgba(135,206,235,0.4)] transition-all"
            >
              {showQR ? 'HIDE QR CODE' : 'SHOW RESCUE QR'}
            </Button>
          </div>
        </GlassCard>
      </div>

      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <GlassCard className="p-8 border-2 border-[#87ceeb]/30" neonColor="cyan">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* QR Code Section */}
                <div className="text-center">
                  <div className="bg-white p-8 rounded-3xl inline-block shadow-[0_0_50px_rgba(135,206,235,0.3)]">
                    <div className="w-64 h-64 bg-black/5 flex items-center justify-center relative">
                      <QrCode className="w-56 h-56 text-black" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white p-2 rounded-xl shadow-lg">
                          <Heart className="w-full h-full text-[#ff006e] fill-[#ff006e]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <p className="text-white font-black text-2xl uppercase italic tracking-widest">Medical Life-Link</p>
                    <p className="text-sm text-[#b8b8c8]">Scan with any smartphone camera to see emergency profile</p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <CheckCircle className="w-4 h-4 text-[#00ff88]" />
                      <span className="text-xs text-[#00ff88] font-bold uppercase tracking-widest">Works Offline</span>
                    </div>
                  </div>
                </div>

                {/* Medical Information Display */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                    <Activity className="w-7 h-7 text-[#ff006e]" />
                    QR Contains This Data
                  </h3>

                  {/* Identity Section */}
                  {identity && (
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-5 h-5 text-[#87ceeb]" />
                        <p className="text-xs font-black text-white/60 uppercase tracking-widest">Identity Information</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Full Name</p>
                          <p className="text-sm font-bold text-white">{identity.data.name}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Age</p>
                          <p className="text-sm font-bold text-white">67 years</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Blood Group</p>
                          <p className="text-lg font-black text-[#ff006e]">{identity.data.bloodGroup}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">ID Reference</p>
                          <p className="text-xs font-mono text-white/80">{identity.data.aadhaar}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Health Conditions & Medications */}
                  {health && (
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#ff006e]/10 to-transparent border border-[#ff006e]/30 space-y-4">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-[#ff006e]" />
                        <p className="text-xs font-black text-white/60 uppercase tracking-widest">Critical Medical Info</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-[9px] font-black text-[#ff006e] uppercase tracking-widest mb-2">Pre-existing Conditions</p>
                          <div className="flex flex-wrap gap-2">
                            {health.data.conditions?.map((c: string) => (
                              <span key={c} className="px-3 py-1.5 rounded-full bg-[#ff006e]/20 border border-[#ff006e]/40 text-xs font-bold text-white uppercase">{c}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-[9px] font-black text-[#87ceeb] uppercase tracking-widest mb-2">Current Medications</p>
                          <div className="space-y-2">
                            {health.data.medications?.map((m: string) => (
                              <div key={m} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                                <Pill className="w-4 h-4 text-[#87ceeb]" />
                                <span className="text-sm text-white font-bold">{m}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-[#ffa500]/10 border border-[#ffa500]/30">
                          <p className="text-[9px] font-black text-[#ffa500] uppercase tracking-widest mb-1">Known Allergies</p>
                          <p className="text-sm text-white font-bold">Penicillin • Sulfa Drugs</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Emergency Contacts */}
                  {contacts && (
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#00ff88]/10 to-transparent border border-[#00ff88]/30 space-y-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-[#00ff88]" />
                        <p className="text-xs font-black text-white/60 uppercase tracking-widest">Emergency Contacts</p>
                      </div>
                      <div className="space-y-2">
                        {contacts.data.contacts?.map((contact: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <div>
                              <p className="text-sm font-black text-white">{contact.name}</p>
                              <p className="text-xs text-white/60 font-bold">Primary Contact</p>
                            </div>
                            <a 
                              href={`tel:${contact.phone}`}
                              className="px-4 py-2 rounded-full bg-[#00ff88] text-[#0a0a0f] text-xs font-black uppercase hover:bg-[#b8f6e0] transition-all flex items-center gap-2"
                            >
                              <Phone className="w-3 h-3" />
                              CALL
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-6 p-4 rounded-xl bg-[#0a0a0f] border border-white/10">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#87ceeb] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-tight mb-1">For First Responders</p>
                    <p className="text-[10px] text-[#b8b8c8] leading-relaxed">
                      This QR code provides life-saving medical information instantly without requiring internet connectivity. 
                      All data is encrypted and accessible only via scan. Patient consent implied in emergency scenarios.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Identity & Health Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {identity && (
          <GlassCard className="p-5" neonColor="cyan">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-[#87ceeb]" />
              <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Survivor Identity</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] font-black text-white/40 uppercase">Full Name</span>
                <span className="text-sm font-bold text-white uppercase">{identity.data.name}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] font-black text-white/40 uppercase">Blood Type</span>
                <span className="text-sm font-black text-[#ff006e]">{identity.data.bloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-black text-white/40 uppercase">Aadhaar Ref</span>
                <span className="text-sm font-mono text-white/80">{identity.data.aadhaar}</span>
              </div>
            </div>
          </GlassCard>
        )}

        {health && (
          <GlassCard className="p-5" neonColor="pink">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-[#ff006e]" />
              <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Medical Profile</h2>
            </div>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {health.data.conditions?.map((c: string) => (
                  <span key={c} className="px-3 py-1 rounded-full bg-[#ff006e]/10 border border-[#ff006e]/30 text-[10px] font-bold text-white uppercase">{c}</span>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-white/5 space-y-2">
                <p className="text-[10px] font-black text-[#87ceeb] uppercase">Medication Alert</p>
                {health.data.medications?.map((m: string) => (
                  <p key={m} className="text-xs text-white/80 flex items-center gap-2">
                    <Pill className="w-3 h-3 text-[#87ceeb]" /> {m}
                  </p>
                ))}
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Emergency Contacts */}
      {contacts && (
        <GlassCard className="p-6" neonColor="green">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-[#00ff88]" />
              <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Guardian Contacts</h2>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#00ff88]/10 text-[#00ff88] text-[10px] font-black uppercase tracking-widest border border-[#00ff88]/20 flex items-center gap-2">
              <Zap className="w-3 h-3" /> Priority Dial
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.data.contacts?.map((contact: any, i: number) => (
              <a 
                key={i} 
                href={`tel:${contact.phone}`}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#00ff88]/5 hover:border-[#00ff88]/30 transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase mb-1">{contact.name.split(' ')[1] || 'Contact'}</p>
                  <p className="text-lg font-bold text-white group-hover:text-[#00ff88] transition-colors">{contact.name.split(' ')[0]}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00ff88] group-hover:text-[#0a0a0f] transition-all">
                  <Phone className="w-6 h-6" />
                </div>
              </a>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Utility Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: WifiOff, label: 'Offline Sync', value: 'Enabled', color: '#00ff88' },
          { icon: Battery, label: 'Energy Mode', value: 'Adaptive', color: '#ffa500' },
          { icon: Volume2, label: 'Audio Help', value: 'Ready', color: '#87ceeb' },
          { icon: LifeBuoy, label: 'Responders', value: 'Alerted', color: '#ff006e' },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-3 text-center">
            <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">{stat.label}</p>
            <p className="text-xs font-bold text-white mt-1">{stat.value}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}