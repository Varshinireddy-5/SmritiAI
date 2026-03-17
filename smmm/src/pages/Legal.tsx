import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Shield, Lock, FileText, AlertTriangle, Briefcase, Scale,
  Trash2, Search, Clock, Gavel, Handshake, Bookmark, Plus,
  Sparkles, CheckCircle2, History
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner@2.0.3';
import { localStore, LegalRecord } from '../utils/localStore';
import { motion } from 'motion/react';

export function Legal() {
  const [records, setRecords] = useState<LegalRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved' | 'pending'>('all');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    setRecords(localStore.getLegalRecords());
  };

  const filtered = records.filter(r => activeTab === 'all' || r.status === activeTab);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 italic tracking-tighter uppercase">LEGAL <span className="text-[#ffa500] not-italic">RECORDS</span></h1>
          <p className="text-[#b8b8c8] font-medium flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#ffa500]" />
            Your rights, your proof, your justice.
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="rounded-full bg-[#ffa500] text-[#0a0a0f] hover:bg-[#ffc24d] font-black px-8 shadow-[0_0_20px_rgba(255,165,0,0.3)] transition-all">
            <Plus className="w-5 h-5 mr-2" />
            NEW CASE
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto scrollbar-hide">
          {(['all', 'active', 'pending', 'resolved'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === t 
                  ? 'bg-[#ffa500] text-[#0a0a0f] shadow-[0_0_15px_rgba(255,165,0,0.4)]' 
                  : 'text-[#b8b8c8] hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
          <Search className="w-4 h-4 text-[#b8b8c8]" />
          <input type="text" placeholder="Search cases, parties, or case numbers..." className="bg-transparent border-none outline-none text-sm text-white flex-1" />
        </div>
      </div>

      {/* Legal Records List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center opacity-40">
            <Scale className="w-20 h-20 mx-auto mb-4" />
            <p>No legal records found.</p>
          </div>
        ) : (
          filtered.map((record) => (
            <GlassCard key={record.id} className="relative overflow-hidden group" neonColor={record.status === 'active' ? 'pink' : 'cyan'}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-white/5 ${
                      record.status === 'resolved' ? 'text-[#00ff88]' : 
                      record.status === 'active' ? 'text-[#ff006e]' : 'text-[#ffa500]'
                    }`}>
                      <Gavel className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#ffa500] transition-colors">{record.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{record.type.replace('_', ' ')}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          record.status === 'resolved' ? 'text-[#00ff88]' : 
                          record.status === 'active' ? 'text-[#ff006e]' : 'text-[#ffa500]'
                        }`}>{record.status}</span>
                      </div>
                    </div>
                  </div>
                  {record.isLocked && <Lock className="w-4 h-4 text-[#ffa500]" />}
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-[#b8b8c8] leading-relaxed line-clamp-2">
                    {record.description}
                  </p>

                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <Clock className="w-4 h-4 text-[#87ceeb]" />
                      <div>
                        <p className="text-[9px] font-black text-white/30 uppercase">Filed Date</p>
                        <p className="text-xs font-bold text-white">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {record.caseNumber && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <Bookmark className="w-4 h-4 text-[#ffa500]" />
                        <div>
                          <p className="text-[9px] font-black text-white/30 uppercase">Case Number</p>
                          <p className="text-xs font-bold text-white">{record.caseNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a0a0f]/50 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#87ceeb]" />
                      <span className="text-[10px] font-bold text-[#b8b8c8] uppercase">Proof Attachments</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold">3 FILES</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-6 pt-4 border-t border-white/5">
                  <Button variant="ghost" className="flex-1 bg-white/5 hover:bg-[#ffa500]/20 text-white text-xs font-bold uppercase py-5 rounded-xl">
                    VIEW LEGAL CASE
                  </Button>
                  <Button variant="ghost" className="shrink-0 bg-white/5 hover:bg-white/10 rounded-xl px-4">
                    <Handshake className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Rights Assistant */}
      <GlassCard className="p-8 border-dashed border-[#ffa500]/30" neonColor="cyan">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-black text-white italic">RIGHTS <span className="text-[#ffa500] not-italic">ADVISOR</span></h3>
            <p className="text-sm text-[#b8b8c8] leading-relaxed">
              SmritiAI analyzes your legal documents to highlight your rights in workplace, property, and government interactions. Automatically detects scheme eligibility from your records.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="border-white/10 text-white text-xs px-4 rounded-full bg-[#ffa500]/10 border-[#ffa500]/30 font-bold">CHECK SCHEME ELIGIBILITY</Button>
              <Button variant="outline" className="border-white/10 text-white text-xs px-4 rounded-full bg-white/5 font-bold">KNOW YOUR RIGHTS</Button>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-6 rounded-3xl bg-gradient-to-br from-[#ffa500]/10 to-transparent border border-[#ffa500]/20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#ffa500]/20 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-[#ffa500]" />
            </div>
            <p className="text-xs font-bold text-white uppercase tracking-widest mb-2">Legal AI Active</p>
            <p className="text-[10px] text-[#b8b8c8]">Analyzing property dispute trends in your region...</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}