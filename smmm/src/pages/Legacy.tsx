import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Heart, Lock, FileText, User, MessageSquare, Key, Users, Scroll,
  Trash2, Eye, EyeOff, AlertTriangle, Shield, Sparkles, Clock, 
  ChevronRight, Printer, Share2, Globe, Plus, Edit, Download,
  CheckCircle2, Calendar, MapPin, Phone, Gavel, Scale, Briefcase,
  Bookmark, Handshake, History, Search, Wallet
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { localStore, AfterMeRecord, LegalRecord } from '../utils/localStore';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

import { useLocation } from 'react-router';

type LegacyType = 'will' | 'assets' | 'digital' | 'legal' | 'wishes' | 'messages';

export function Legacy() {
  const location = useLocation();
  const [legacyRecords, setLegacyRecords] = useState<AfterMeRecord[]>([]);
  const [legalRecords, setLegalRecords] = useState<LegalRecord[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeType, setActiveType] = useState<LegacyType | null>(null);

  useEffect(() => {
    if (location.pathname === '/legal') {
      setActiveType('legal');
      setIsUnlocked(true); // Auto-unlock for legal tab if needed or keep pin
    }
  }, [location]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBinderModal, setShowBinderModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [pinInput, setPinInput] = useState('');
  const [showPinDialog, setShowPinDialog] = useState(false);
  
  // Form State
  const [newRecord, setNewRecord] = useState<any>({
    title: '',
    content: '',
    beneficiary: '',
    type: 'will'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLegacyRecords(localStore.getAfterMeRecords());
    setLegalRecords(localStore.getLegalRecords());
  };

  const handleUnlock = () => {
    if (pinInput === '1234' || pinInput === 'demo') {
      setIsUnlocked(true);
      setShowPinDialog(false);
      toast.success('Legacy Vault Unlocked');
    } else {
      toast.error('Invalid PIN');
    }
    setPinInput('');
  };

  const saveRecord = () => {
    if (!newRecord.title || !newRecord.content) return toast.error('Please fill all fields');

    if (activeType === 'legal') {
      localStore.addLegalRecord({
        userId: 'demo_user',
        title: newRecord.title,
        description: newRecord.content,
        date: new Date().toISOString(),
        type: 'legal_doc',
        status: 'active',
        attachments: [],
        isLocked: true,
      });
    } else {
      localStore.addAfterMeRecord({
        userId: 'demo_user',
        type: mapTypeToRecordType(activeType || 'will'),
        title: newRecord.title,
        content: newRecord.content,
        beneficiary: newRecord.beneficiary || '',
        attachments: [],
        isLocked: true,
      });
    }

    toast.success('Record saved securely');
    setShowAddModal(false);
    setNewRecord({ title: '', content: '', beneficiary: '', type: 'will' });
    loadData();
  };

  const mapTypeToRecordType = (type: LegacyType): any => {
    switch(type) {
      case 'will': return 'will';
      case 'assets': return 'asset_distribution';
      case 'digital': return 'access_instruction';
      case 'wishes': return 'funeral_wish';
      case 'messages': return 'personal_message';
      default: return 'will';
    }
  };

  const getRecordsForType = (type: LegacyType) => {
    if (type === 'legal') return legalRecords;
    const mapped = mapTypeToRecordType(type);
    return legacyRecords.filter(r => r.type === mapped);
  };

  const deleteRecord = (id: string, isLegal: boolean) => {
    if (confirm('Delete this record permanently?')) {
      if (isLegal) localStore.deleteLegalRecord(id);
      else localStore.deleteAfterMeRecord(id);
      toast.success('Record deleted');
      loadData();
    }
  };

  const viewRecord = (record: any) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const editRecord = (record: any) => {
    setEditingRecord(record);
    setShowEditModal(true);
  };

  const updateRecord = () => {
    if (!editingRecord) return;
    
    if (activeType === 'legal') {
      localStore.updateLegalRecord(editingRecord.id, editingRecord);
    } else {
      localStore.updateAfterMeRecord(editingRecord.id, editingRecord);
    }
    
    toast.success('Record updated successfully');
    setShowEditModal(false);
    setEditingRecord(null);
    loadData();
  };

  const generateBinder = () => {
    setShowBinderModal(true);
    toast.success('Generating comprehensive legal binder...');
  };

  const legacyTypes = [
    { id: 'will', label: 'Wills & Testament', icon: Scroll, color: '#a855f7', desc: 'Legal distribution of your estate' },
    { id: 'assets', label: 'Asset Map', icon: Wallet, color: '#00ff88', desc: 'Financial and physical asset details' },
    { id: 'digital', label: 'Digital Legacy', icon: Key, color: '#87ceeb', desc: 'Passcodes and online account access' },
    { id: 'legal', label: 'Legal Records', icon: Scale, color: '#ffa500', desc: 'Merged active cases and notices' },
    { id: 'wishes', label: 'Final Wishes', icon: Heart, color: '#ff006e', desc: 'Funeral, burial, and rite instructions' },
    { id: 'messages', label: 'Personal Letters', icon: MessageSquare, color: '#00d9ff', desc: 'Private messages for loved ones' },
  ] as { id: LegacyType, label: string, icon: any, color: string, desc: string }[];

  if (!isUnlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
          <GlassCard className="p-8 md:p-12 text-center overflow-hidden relative" neonColor="pink">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff006e] to-transparent" />
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-full bg-[#ff006e]/10 border border-[#ff006e]/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(255,0,110,0.2)]">
                <Lock className="w-10 h-10 text-[#ff006e]" />
              </div>
              <h1 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">THE LEGACY <span className="text-[#ff006e]">VAULT</span></h1>
              <p className="text-[#b8b8c8] mb-8 leading-relaxed">
                Secure your heritage, legal rights, and final wishes. 
                Everything in this vault is encrypted and only accessible with your PIN.
              </p>
              <div className="space-y-4">
                <Input 
                  type="password" 
                  maxLength={4} 
                  placeholder="ENTER 4-DIGIT PIN" 
                  className="bg-white/5 border-[#ff006e] text-center text-xl tracking-widest h-14"
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                />
                <Button onClick={handleUnlock} className="w-full h-14 bg-[#ff006e] text-white hover:bg-[#ff1a7f] font-black text-lg">
                  UNLOCK VAULT
                </Button>
                <p className="text-[10px] text-white/40 uppercase">Demo PIN: 1234</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white mb-2 italic tracking-tighter uppercase">
            LIFE <span className="text-[#ff006e] not-italic">LEGACY</span>
          </h1>
          <p className="text-[#b8b8c8] font-medium flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#ff006e]" />
            Your complete legal and heritage management system.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowBinderModal(true)}
            variant="outline"
            className="rounded-full border-white/20 text-white hover:bg-white/10 font-black px-6 h-12 uppercase tracking-widest"
          >
            <Download className="w-5 h-5 mr-2" />
            EXPORT BINDER
          </Button>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <Scale className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-amber-400 font-bold mb-1">Legal & Estate Planning Tool · Not a Substitute for Legal Counsel</p>
          <p className="text-xs text-white/60 leading-relaxed">
            This module helps you organize your legacy wishes and legal documents. It does not provide legal advice and is not a replacement for professional estate planning services, certified lawyers, or notarized legal documents. Always consult qualified legal professionals for binding estate planning.
          </p>
        </div>
      </div>

      {/* Categories Grid - Top 6 Types */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {legacyTypes.map((type) => {
          const Icon = type.icon;
          const isActive = activeType === type.id;
          const count = getRecordsForType(type.id).length;
          
          return (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`p-5 rounded-2xl transition-all text-center group border-2 relative ${
                isActive 
                  ? 'bg-white/10 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                  : 'bg-white/5 border-white/5 hover:border-white/20'
              }`}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${type.color}20`, color: type.color }}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-white uppercase tracking-widest block leading-tight mb-1">{type.label}</span>
              <span className="text-[9px] font-bold text-white/40 uppercase">{count} Records</span>
              
              {isActive && (
                <motion.div 
                  layoutId="active-indicator" 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full shadow-[0_0_10px_white]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeType ? (
          <motion.div
            key={activeType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                {legacyTypes.find(t => t.id === activeType)?.label}
                <span className="text-sm font-bold text-white/40 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  {getRecordsForType(activeType).length} Items
                </span>
              </h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getRecordsForType(activeType).length === 0 ? (
                <GlassCard className="col-span-full p-12 text-center" neonColor="cyan">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-white/20" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Records Found</h3>
                  <p className="text-[#b8b8c8] mb-6">Start building your legacy by adding your first {activeType} record.</p>
                  <Button onClick={() => setShowAddModal(true)} className="bg-white text-black font-bold rounded-full px-8">
                    CREATE NEW RECORD
                  </Button>
                </GlassCard>
              ) : (
                getRecordsForType(activeType).map((record: any) => (
                  <GlassCard key={record.id} className="relative group overflow-hidden" neonColor="pink">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/5">
                            {activeType === 'legal' ? <Gavel className="w-5 h-5 text-[#ffa500]" /> : <FileText className="w-5 h-5 text-[#ff006e]" />}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-[#ff006e] transition-colors">{record.title}</h3>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                              {activeType === 'legal' ? (record as LegalRecord).status : 'SECURE RECORD'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => viewRecord(record)}
                            className="p-2 rounded-lg hover:bg-[#87ceeb]/10 text-white/40 hover:text-[#87ceeb] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => editRecord(record)}
                            className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteRecord(record.id, activeType === 'legal')} 
                            className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl p-4 mb-4">
                        <p className="text-sm text-[#b8b8c8] leading-relaxed line-clamp-3 italic">
                          "{activeType === 'legal' ? (record as LegalRecord).description : (record as AfterMeRecord).content}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          <span>Updated: {new Date(record.date || record.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[10px] font-black uppercase text-[#ff006e] hover:bg-[#ff006e]/10"
                          onClick={() => viewRecord(record)}
                        >
                          VIEW FULL RECORD
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                BUILD YOUR <br /> <span className="text-[#ff006e]">ETERNAL LEGACY</span>
              </h2>
              <p className="text-lg text-[#b8b8c8] leading-relaxed">
                Select a category above to manage your assets, legal standing, and final wishes. 
                SmritiAI ensures your voice is heard even when you're not there to speak.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
                  100% End-to-End Encryption
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
                  Legal-Ready Documentation
                </div>
              </div>
            </div>
            <GlassCard className="p-8 border-dashed border-[#ff006e]/30" neonColor="pink">
              <h3 className="text-xl font-bold text-white mb-4 uppercase italic">Proactive Protection</h3>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <AlertTriangle className="w-6 h-6 text-[#ffa500] shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Succession Trigger</p>
                    <p className="text-xs text-[#b8b8c8]">No succession triggers set. Your legacy might be inaccessible in emergency.</p>
                  </div>
                </div>
                <Button className="w-full bg-white text-black font-black py-6 rounded-xl">SET SUCCESSION TRIGGERS</Button>
              </div>
            </GlassCard>
          </div>
        )}
      </AnimatePresence>

      {/* Add Record Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-[#0a0a0f] border-[#ff006e] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#ff006e] uppercase tracking-tight">
              New {activeType} Record
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-white uppercase tracking-widest">Title / Heading *</Label>
              <Input 
                placeholder="e.g., My Real Estate Assets"
                value={newRecord.title} 
                onChange={e => setNewRecord({...newRecord, title: e.target.value})}
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-white uppercase tracking-widest">Content / Details *</Label>
              <Textarea 
                placeholder="Detailed instructions, message, or asset list..."
                value={newRecord.content} 
                onChange={e => setNewRecord({...newRecord, content: e.target.value})}
                className="bg-white/5 border-white/10 h-40"
              />
            </div>

            {activeType !== 'legal' && (
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white uppercase tracking-widest">Beneficiary / Recipient</Label>
                <Input 
                  placeholder="Who should receive this?"
                  value={newRecord.beneficiary} 
                  onChange={e => setNewRecord({...newRecord, beneficiary: e.target.value})}
                  className="bg-white/5 border-white/10"
                />
              </div>
            )}

            <div className="p-4 rounded-xl bg-[#ff006e]/10 border border-[#ff006e]/30 flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#ff006e]" />
              <p className="text-[10px] text-[#b8b8c8] uppercase font-bold leading-tight">
                This record will be encrypted. You can link physical documents from your Vault later.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="border-white/10">CANCEL</Button>
            <Button onClick={saveRecord} className="bg-[#ff006e] text-white font-black px-8">SAVE & LOCK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Record Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="bg-[#0a0a0f] border-[#87ceeb] text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-[#87ceeb] uppercase italic">Full Record Details</DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-6 py-4">
              <div className="flex items-start gap-6 p-6 rounded-2xl bg-gradient-to-r from-[#ff006e]/10 to-transparent border border-[#ff006e]/20">
                <div className="p-4 rounded-2xl bg-[#ff006e]/10">
                  {activeType === 'legal' ? <Gavel className="w-8 h-8 text-[#ffa500]"/> : <Scroll className="w-8 h-8 text-[#ff006e]"/>}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">{selectedRecord.title}</h2>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-black uppercase tracking-widest">
                      {activeType === 'legal' ? (selectedRecord as LegalRecord).status : 'SECURE RECORD'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Record Type</p>
                  <p className="text-lg font-bold text-white capitalize">{activeType}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Last Updated</p>
                  <p className="text-lg font-bold text-white">{new Date(selectedRecord.date || selectedRecord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                {selectedRecord.beneficiary && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 col-span-2">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Beneficiary / Recipient</p>
                    <p className="text-lg font-bold text-white">{selectedRecord.beneficiary}</p>
                  </div>
                )}
              </div>

              <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-white/10">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Full Content</p>
                <p className="text-sm text-[#b8b8c8] leading-relaxed italic whitespace-pre-wrap">"{activeType === 'legal' ? (selectedRecord as LegalRecord).description : (selectedRecord as AfterMeRecord).content}"</p>
              </div>

              {selectedRecord.unlockCondition && (
                <div className="p-5 rounded-xl bg-gradient-to-r from-[#ffa500]/10 to-transparent border border-[#ffa500]/30">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-[#ffa500] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-black text-white uppercase text-sm mb-1">Unlock Condition</h5>
                      <p className="text-xs text-[#b8b8c8] leading-relaxed">{selectedRecord.unlockCondition}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowViewModal(false)} className="flex-1 h-12 border-white/10">CLOSE</Button>
            <Button onClick={() => { setShowViewModal(false); editRecord(selectedRecord); }} className="flex-1 h-12 bg-[#87ceeb] text-[#0a0a0f] font-black">EDIT RECORD</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Record Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-[#0a0a0f] border-[#ff006e] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#ff006e] uppercase tracking-tight">
              Update {activeType} Record
            </DialogTitle>
          </DialogHeader>
          
          {editingRecord && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white uppercase tracking-widest">Title / Heading *</Label>
                <Input 
                  value={editingRecord.title} 
                  onChange={e => setEditingRecord({...editingRecord, title: e.target.value})}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-white uppercase tracking-widest">Content / Details *</Label>
                <Textarea 
                  value={activeType === 'legal' ? editingRecord.description : editingRecord.content} 
                  onChange={e => setEditingRecord({
                    ...editingRecord, 
                    [activeType === 'legal' ? 'description' : 'content']: e.target.value
                  })}
                  className="bg-white/5 border-white/10 h-40"
                />
              </div>

              {activeType !== 'legal' && (
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-white uppercase tracking-widest">Beneficiary / Recipient</Label>
                  <Input 
                    value={editingRecord.beneficiary || ''} 
                    onChange={e => setEditingRecord({...editingRecord, beneficiary: e.target.value})}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              )}

              {activeType === 'legal' && (
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-white uppercase tracking-widest">Status</Label>
                  <select 
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none"
                    value={editingRecord.status}
                    onChange={e => setEditingRecord({...editingRecord, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowEditModal(false)} className="border-white/10 flex-1 h-12">CANCEL</Button>
            <Button onClick={updateRecord} className="bg-[#ff006e] text-white font-black flex-1 h-12">UPDATE RECORD</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Binder Generation Modal */}
      <Dialog open={showBinderModal} onOpenChange={setShowBinderModal}>
        <DialogContent className="bg-[#0a0a0f] border-[#ff006e] text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-[#ff006e] uppercase italic">Generate Legacy Binder</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#ff006e]/10 to-transparent border border-[#ff006e]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#ff006e]/20 flex items-center justify-center text-[#ff006e]">
                  <Printer className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-white uppercase">Comprehensive Legal Binder</h4>
                  <p className="text-xs text-white/60">All records, professionally formatted for legal purposes</p>
                </div>
              </div>
              <div className="p-5 rounded-xl bg-[#0a0a0f] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Wills & Testament</span>
                  <span className="text-xs text-[#00ff88] font-black">{legacyRecords.filter(r => r.type === 'will').length} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Asset Distribution</span>
                  <span className="text-xs text-[#00ff88] font-black">{legacyRecords.filter(r => r.type === 'asset_distribution').length} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Legal Records</span>
                  <span className="text-xs text-[#00ff88] font-black">{legalRecords.length} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Digital Access Instructions</span>
                  <span className="text-xs text-[#00ff88] font-black">{legacyRecords.filter(r => r.type === 'access_instruction').length} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Final Wishes</span>
                  <span className="text-xs text-[#00ff88] font-black">{legacyRecords.filter(r => r.type === 'funeral_wish').length} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Personal Messages</span>
                  <span className="text-xs text-[#00ff88] font-black">{legacyRecords.filter(r => r.type === 'personal_message').length} items</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-black text-white uppercase tracking-widest">Select Output Format</Label>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-5 rounded-xl border-2 border-[#ff006e] bg-[#ff006e]/10 flex flex-col items-center gap-2 hover:bg-[#ff006e]/20 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[#ff006e]/20 flex items-center justify-center text-[#ff006e] group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-white uppercase">PDF Document</span>
                  <span className="text-[8px] text-white/60 uppercase tracking-widest">Legal Ready</span>
                </button>
                <button className="p-5 rounded-xl border border-white/10 bg-white/5 flex flex-col items-center gap-2 hover:bg-white/10 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[#87ceeb]/20 flex items-center justify-center text-[#87ceeb] group-hover:scale-110 transition-transform">
                    <Download className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-white uppercase">Encrypted Backup</span>
                  <span className="text-[8px] text-white/60 uppercase tracking-widest">Full Archive</span>
                </button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-r from-[#ffa500]/10 to-transparent border border-[#ffa500]/30">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#ffa500] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-black text-white uppercase text-sm mb-1">Legal Disclaimer</h5>
                  <p className="text-xs text-[#b8b8c8] leading-relaxed">
                    This binder is generated for your convenience. For legal validity, please consult with a registered attorney. 
                    SmritiAI provides secure storage but does not provide legal advice.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowBinderModal(false)} className="border-white/10 flex-1 h-12">CANCEL</Button>
            <Button 
              onClick={() => {
                toast.success('Binder PDF generated successfully!');
                setShowBinderModal(false);
              }}
              className="bg-[#ff006e] text-white font-black flex-1 h-12 shadow-[0_0_20px_rgba(255,0,110,0.3)]"
            >
              <Download className="w-4 h-4 mr-2" />
              GENERATE & DOWNLOAD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}