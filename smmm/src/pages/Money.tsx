import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Wallet, TrendingUp, TrendingDown, DollarSign, Receipt, FileText,
  Trash2, Mic, Search, Filter, Calendar, CreditCard, ArrowUpRight,
  Plus, Sparkles, AlertCircle, Clock, ChevronRight, Edit, X, User, MapPin, Phone
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { localStore, MoneyRecord } from '../utils/localStore';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

export function Money() {
  const [records, setRecords] = useState<MoneyRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense' | 'loan' | 'informal'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MoneyRecord | null>(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderData, setReminderData] = useState<{person: string, amount: number, date: string, method: 'sms' | 'whatsapp' | 'call' | 'email'} | null>(null);

  const [newEntry, setNewEntry] = useState<Partial<MoneyRecord>>({
    type: 'expense',
    amount: 0,
    description: '',
    category: 'General',
    date: new Date().toISOString().split('T')[0],
    person: '',
    voiceNote: '',
    hasReceipt: false,
    status: 'completed',
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    setRecords(localStore.getMoneyRecords());
  };

  const saveEntry = () => {
    if (!newEntry.description || !newEntry.amount) return toast.error('Description and amount are required');

    localStore.addMoneyRecord({
      userId: 'demo_user',
      type: newEntry.type as any,
      amount: Number(newEntry.amount),
      description: newEntry.description,
      category: newEntry.category || 'General',
      date: newEntry.date || new Date().toISOString(),
      person: newEntry.person,
      voiceNote: newEntry.voiceNote,
      hasReceipt: newEntry.hasReceipt || false,
      status: newEntry.status as any || 'completed',
    });

    toast.success('Financial entry saved');
    setShowAddModal(false);
    resetForm();
    loadRecords();
  };

  const updateEntry = () => {
    if (!editingRecord) return;
    localStore.updateMoneyRecord(editingRecord.id, editingRecord);
    toast.success('Transaction updated');
    setEditingRecord(null);
    loadRecords();
  };

  const deleteRecord = (id: string) => {
    if (confirm('Delete this financial record?')) {
      localStore.deleteMoneyRecord(id);
      toast.success('Transaction deleted');
      loadRecords();
    }
  };

  const resetForm = () => {
    setNewEntry({
      type: 'expense',
      amount: 0,
      description: '',
      category: 'General',
      date: new Date().toISOString().split('T')[0],
      person: '',
      voiceNote: '',
      hasReceipt: false,
      status: 'completed',
    });
  };

  const filtered = records.filter(r => {
    const matchesTab = activeTab === 'all' || r.type === activeTab || (activeTab === 'informal' && r.category === 'Informal');
    const matchesSearch = !searchQuery || 
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });
  
  const income = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const expense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white mb-2 italic tracking-tighter uppercase">
            MONEY <span className="text-[#00ff88] not-italic">TRACKER</span>
          </h1>
          <p className="text-[#b8b8c8] font-medium flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4 text-[#00ff88]" />
            Simplified financial tracking for informal loans and formal expenses.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAddModal(true)}
            className="rounded-full bg-[#00ff88] text-[#0a0a0f] hover:bg-[#b8f6e0] font-black px-10 shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all h-12"
          >
            <Plus className="w-5 h-5 mr-2" />
            NEW ENTRY
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6" neonColor="green">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#00ff88]/10 text-[#00ff88]">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Inflow</p>
              <p className="text-3xl font-black text-[#00ff88] italic">₹{income.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-6" neonColor="pink">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#ff006e]/10 text-[#ff006e]">
              <TrendingDown className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Outflow</p>
              <p className="text-3xl font-black text-[#ff006e] italic">₹{expense.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-6" neonColor="cyan">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#87ceeb]/10 text-[#87ceeb]">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Net Balance</p>
              <p className="text-3xl font-black text-white italic">₹{(income - expense).toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto scrollbar-hide shrink-0">
          {(['all', 'income', 'expense', 'loan', 'informal'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === t 
                  ? 'bg-[#00ff88] text-[#0a0a0f] shadow-[0_0_15px_rgba(0,255,136,0.4)]' 
                  : 'text-[#b8b8c8] hover:text-white'
              }`}
            >
              {t === 'all' ? 'Transactions' : t}
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 focus-within:border-[#00ff88]/50 transition-all">
          <Search className="w-5 h-5 text-[#b8b8c8]" />
          <input 
            type="text" 
            placeholder="Search by description, person, or category..." 
            className="bg-transparent border-none outline-none text-sm text-white flex-1"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Receipt className="w-12 h-12 text-white/20" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">No transactions found</h3>
            <p className="text-[#b8b8c8] mt-2 mb-8">Tap "New Entry" to start tracking your finances.</p>
            <Button onClick={() => setShowAddModal(true)} className="bg-[#00ff88] text-[#0a0a0f] font-black rounded-full px-10">ADD FIRST ENTRY</Button>
          </div>
        ) : (
          filtered.map((record) => (
            <GlassCard key={record.id} className="group overflow-hidden" neonColor={record.type === 'income' ? 'green' : record.type === 'expense' ? 'pink' : 'cyan'}>
              <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-transform group-hover:scale-110 ${
                    record.type === 'income' ? 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]' :
                    record.type === 'expense' ? 'bg-[#ff006e]/10 border-[#ff006e]/30 text-[#ff006e]' :
                    'bg-[#87ceeb]/10 border-[#87ceeb]/30 text-[#87ceeb]'
                  }`}>
                    {record.type === 'income' ? <TrendingUp className="w-7 h-7" /> : <TrendingDown className="w-7 h-7" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white leading-none mb-1 group-hover:text-[#00ff88] transition-colors uppercase tracking-tight truncate max-w-xs md:max-w-md">
                      {record.description}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{record.category}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20"></span>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{new Date(record.date).toLocaleDateString()}</span>
                      {record.person && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-white/20"></span>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-[#87ceeb]" />
                            <span className="text-[10px] font-black text-[#87ceeb] uppercase">{record.person}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                  <div className="text-right">
                    <p className={`text-3xl font-black italic leading-none mb-1 ${
                      record.type === 'income' ? 'text-[#00ff88]' : 'text-white'
                    }`}>
                      {record.type === 'income' ? '+' : '-'} ₹{record.amount.toLocaleString()}
                    </p>
                    {record.status === 'pending' && (
                      <span className="text-[9px] font-black uppercase text-[#ffa500] flex items-center gap-1 justify-end animate-pulse">
                        <Clock className="w-3 h-3" /> PENDING
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-11 w-11 rounded-xl bg-white/5 hover:bg-[#87ceeb]/10 text-[#87ceeb]"
                      onClick={() => setEditingRecord(record)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-11 w-11 rounded-xl bg-white/5 hover:bg-red-500/10 text-red-400"
                      onClick={() => deleteRecord(record.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {record.voiceNote && (
                <div className="mx-6 mb-6 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4">
                  <div className="p-2 rounded-full bg-[#87ceeb]/10">
                    <Mic className="w-4 h-4 text-[#87ceeb] shrink-0" />
                  </div>
                  <p className="text-xs text-[#b8b8c8] italic leading-relaxed">"AI Transcript: {record.voiceNote}"</p>
                </div>
              )}
            </GlassCard>
          ))
        )}
      </div>

      {/* AI Financial Auditor Advice */}
      <GlassCard className="p-8 border-dashed border-[#00ff88]/30" neonColor="green">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/3 p-8 rounded-3xl bg-gradient-to-br from-[#00ff88]/15 to-transparent border border-[#00ff88]/20 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00ff88]/20 flex items-center justify-center text-[#00ff88]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">AI Auditor</h4>
            </div>
            <p className="text-xs text-[#b8b8c8] leading-relaxed">
              "I've detected 3 pending informal loans totaling ₹15,000. Ramesh Kumar's payment is overdue by 12 days. Would you like to generate a polite voice-note reminder based on your original agreement?"
            </p>
            <Button 
              onClick={() => setShowReminderModal(true)}
              className="w-full bg-[#00ff88] text-[#0a0a0f] font-black h-12 rounded-xl text-xs shadow-[0_0_15px_rgba(0,255,136,0.2)]"
            >
              GENERATE REMINDER
            </Button>
          </div>
          <div className="flex-1 space-y-6">
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
              PROOF OF <span className="text-[#00ff88] not-italic">TRANSACTION</span>
            </h3>
            <p className="text-[#b8b8c8] text-sm leading-relaxed max-w-xl">
              Informal lending often leads to disputes. SmritiAI helps you secure every transaction with multi-modal proof. Link voice recordings, photos of receipts, or location tags to every entry.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
                <Mic className="w-3.5 h-3.5 text-[#87ceeb]" /> Voice Signature
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
                <FileText className="w-3.5 h-3.5 text-[#00ff88]" /> Handwritten Proof
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
                <MapPin className="w-3.5 h-3.5 text-[#ffa500]" /> Geotagged Receipt
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-[#0a0a0f] border-[#00ff88] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-[#00ff88] uppercase italic">Add Financial Entry</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Entry Type</Label>
                <select 
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#00ff88]/50"
                  value={newEntry.type}
                  onChange={e => setNewEntry({...newEntry, type: e.target.value as any})}
                >
                  <option value="expense">Expense (-)</option>
                  <option value="income">Income (+)</option>
                  <option value="loan">Loan (Lent)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Amount (₹)</Label>
                <Input 
                  type="number"
                  placeholder="0.00"
                  value={newEntry.amount}
                  onChange={e => setNewEntry({...newEntry, amount: Number(e.target.value)})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl font-black text-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Description *</Label>
              <Input 
                placeholder="e.g., Electricity Bill, Pension, Loan to neighbor"
                value={newEntry.description}
                onChange={e => setNewEntry({...newEntry, description: e.target.value})}
                className="bg-white/5 border-white/10 h-12 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Category</Label>
                <Input 
                  placeholder="e.g., Utilities, Food, Informal"
                  value={newEntry.category}
                  onChange={e => setNewEntry({...newEntry, category: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Date</Label>
                <Input 
                  type="date"
                  value={newEntry.date}
                  onChange={e => setNewEntry({...newEntry, date: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Related Person (Optional)</Label>
              <Input 
                placeholder="e.g., Ramesh Kumar"
                value={newEntry.person}
                onChange={e => setNewEntry({...newEntry, person: e.target.value})}
                className="bg-white/5 border-white/10 h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Voice Memo / Notes</Label>
              <Textarea 
                placeholder="Record or write details of this transaction..."
                value={newEntry.voiceNote}
                onChange={e => setNewEntry({...newEntry, voiceNote: e.target.value})}
                className="bg-white/5 border-white/10 h-24 rounded-xl"
              />
            </div>

            <div className="flex gap-6 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="hasReceipt" 
                  checked={newEntry.hasReceipt} 
                  onChange={e => setNewEntry({...newEntry, hasReceipt: e.target.checked})}
                  className="w-5 h-5 rounded"
                />
                <Label htmlFor="hasReceipt" className="text-sm font-bold uppercase tracking-tight">Receipt Attached</Label>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="isPending" 
                  checked={newEntry.status === 'pending'} 
                  onChange={e => setNewEntry({...newEntry, status: e.target.checked ? 'pending' : 'completed'})}
                  className="w-5 h-5 rounded"
                />
                <Label htmlFor="isPending" className="text-sm font-bold uppercase tracking-tight text-[#ffa500]">Payment Pending</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="border-white/10 flex-1 h-12">CANCEL</Button>
            <Button onClick={saveEntry} className="bg-[#00ff88] text-[#0a0a0f] font-black flex-1 h-12 text-lg">SAVE ENTRY</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
        <DialogContent className="bg-[#0a0a0f] border-[#00ff88] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-[#00ff88] uppercase italic">Update Transaction</DialogTitle>
          </DialogHeader>
          
          {editingRecord && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Entry Type</Label>
                  <select 
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none"
                    value={editingRecord.type}
                    onChange={e => setEditingRecord({...editingRecord, type: e.target.value as any})}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                    <option value="loan">Loan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Amount (₹)</Label>
                  <Input 
                    type="number"
                    value={editingRecord.amount}
                    onChange={e => setEditingRecord({...editingRecord, amount: Number(e.target.value)})}
                    className="bg-white/5 border-white/10 h-12 rounded-xl font-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Description</Label>
                <Input 
                  value={editingRecord.description}
                  onChange={e => setEditingRecord({...editingRecord, description: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Notes</Label>
                <Textarea 
                  value={editingRecord.voiceNote}
                  onChange={e => setEditingRecord({...editingRecord, voiceNote: e.target.value})}
                  className="bg-white/5 border-white/10 h-24 rounded-xl"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="edit-pending" 
                  checked={editingRecord.status === 'pending'} 
                  onChange={e => setEditingRecord({...editingRecord, status: e.target.checked ? 'pending' : 'completed'})}
                />
                <Label htmlFor="edit-pending">Payment Pending</Label>
              </div>
            </div>
          )}

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setEditingRecord(null)} className="border-white/10 flex-1 h-12">CANCEL</Button>
            <Button onClick={updateEntry} className="bg-[#00ff88] text-[#0a0a0f] font-black flex-1 h-12 text-lg">UPDATE ENTRY</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reminder Generation Modal */}
      <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
        <DialogContent className="bg-[#0a0a0f] border-[#00ff88] text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-[#00ff88] uppercase italic">Generate Payment Reminder</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#00ff88]/10 to-transparent border border-[#00ff88]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#00ff88]/20 flex items-center justify-center text-[#00ff88]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-white uppercase">AI-Generated Reminder</h4>
                  <p className="text-xs text-white/60">Polite & culturally appropriate</p>
                </div>
              </div>
              <div className="p-5 rounded-xl bg-[#0a0a0f] border border-white/10">
                <p className="text-sm text-white leading-relaxed italic mb-4">
                  "Namaste Ramesh ji, I hope you and your family are doing well. This is a gentle reminder regarding the ₹5,000 that you had borrowed on January 15th, 2026. As per our conversation, the repayment was due by February 1st. It has now been 12 days since the due date. 
                  <br/><br/>
                  I understand that circumstances can be challenging, and I'm here to work with you. Could you please share an updated timeline for the repayment? Your cooperation would be greatly appreciated.
                  <br/><br/>
                  Thank you for your understanding.
                  <br/>— Suresh Kumar"
                </p>
                <div className="flex items-center gap-2 text-xs text-[#00ff88]">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-bold uppercase tracking-wide">AI verified for politeness & clarity</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-black text-white uppercase tracking-widest">Select Delivery Method</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button className="p-5 rounded-xl border-2 border-[#00ff88] bg-[#00ff88]/10 flex flex-col items-center gap-2 hover:bg-[#00ff88]/20 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[#00ff88]/20 flex items-center justify-center text-[#00ff88] group-hover:scale-110 transition-transform">
                    <Mic className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-white uppercase">WhatsApp</span>
                  <span className="text-[8px] text-white/60 uppercase tracking-widest">Voice Note</span>
                </button>
                <button className="p-5 rounded-xl border border-white/10 bg-white/5 flex flex-col items-center gap-2 hover:bg-white/10 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[#87ceeb]/20 flex items-center justify-center text-[#87ceeb] group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-white uppercase">SMS</span>
                  <span className="text-[8px] text-white/60 uppercase tracking-widest">Text Message</span>
                </button>
                <button className="p-5 rounded-xl border border-white/10 bg-white/5 flex flex-col items-center gap-2 hover:bg-white/10 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[#ff006e]/20 flex items-center justify-center text-[#ff006e] group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-white uppercase">Call</span>
                  <span className="text-[8px] text-white/60 uppercase tracking-widest">Voice Call</span>
                </button>
                <button className="p-5 rounded-xl border border-white/10 bg-white/5 flex flex-col items-center gap-2 hover:bg-white/10 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[#ffa500]/20 flex items-center justify-center text-[#ffa500] group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-white uppercase">Email</span>
                  <span className="text-[8px] text-white/60 uppercase tracking-widest">Formal Mail</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-2">Debtor Details</p>
                <p className="text-xl font-black text-white">Ramesh Kumar</p>
                <p className="text-xs text-white/60 mt-1">+91 98765 43210</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-2">Outstanding Amount</p>
                <p className="text-xl font-black text-[#ff006e]">₹5,000</p>
                <p className="text-xs text-white/60 mt-1">12 days overdue</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-r from-[#ffa500]/10 to-transparent border border-[#ffa500]/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#ffa500] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-black text-white uppercase text-sm mb-1">Legal Safeguard Note</h5>
                  <p className="text-xs text-[#b8b8c8] leading-relaxed">
                    SmritiAI logs this reminder with timestamp, GPS coordinates, and message hash for legal verification if needed. This creates an audit trail that can serve as proof of communication in case of disputes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowReminderModal(false)} className="border-white/10 flex-1 h-12">CANCEL</Button>
            <Button 
              onClick={() => {
                toast.success('Reminder sent successfully via WhatsApp!');
                setShowReminderModal(false);
              }}
              className="bg-[#00ff88] text-[#0a0a0f] font-black flex-1 h-12 text-lg shadow-[0_0_20px_rgba(0,255,136,0.3)]"
            >
              SEND REMINDER
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}