import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Image as ImageIcon, Video, Mic, FileText, Search, 
  Filter, Calendar, MapPin, Users, Lock, Trash2, 
  Play, Volume2, Plus, Sparkles, Wand2, ArrowRight,
  Edit, X, Clock, Shield, Download, CheckCircle2,
  ImagePlus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner@2.0.3';
import { localStore, MemoryItem } from '../utils/localStore';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

export function Memories() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<MemoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'video' | 'voice' | 'note'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const [newMemory, setNewMemory] = useState<Partial<MemoryItem>>({
    type: 'photo',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    tags: [],
    people: [],
    isLocked: false,
    imageUrl: '',
    voiceExplanation: '',
  });

  useEffect(() => {
    loadMemories();
  }, []);

  useEffect(() => {
    let filtered = memories;
    if (activeTab !== 'all') {
      filtered = filtered.filter(m => m.type === activeTab);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(q) || 
        m.description?.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q)) ||
        m.people.some(p => p.toLowerCase().includes(q))
      );
    }
    setFilteredMemories(filtered);
  }, [searchQuery, activeTab, memories]);

  const loadMemories = () => {
    setMemories(localStore.getMemories());
  };

  const saveMemory = () => {
    if (!newMemory.title) return toast.error('Please enter a title');

    localStore.addMemory({
      userId: 'demo_user',
      type: newMemory.type as any,
      title: newMemory.title,
      description: newMemory.description,
      date: newMemory.date || new Date().toISOString(),
      location: newMemory.location,
      tags: newMemory.tags || [],
      people: newMemory.people || [],
      isLocked: newMemory.isLocked || false,
      imageUrl: newMemory.imageUrl,
      voiceExplanation: newMemory.voiceExplanation,
    });

    toast.success('Memory preserved');
    setShowAddModal(false);
    resetForm();
    loadMemories();
  };

  const updateMemory = () => {
    if (!editingMemory) return;
    localStore.updateMemory(editingMemory.id, editingMemory);
    toast.success('Memory updated');
    setEditingMemory(null);
    loadMemories();
  };

  const deleteMemory = (id: string) => {
    if (confirm('Delete this precious memory?')) {
      localStore.deleteMemory(id);
      toast.success('Memory archived');
      loadMemories();
    }
  };

  const resetForm = () => {
    setNewMemory({
      type: 'photo',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      tags: [],
      people: [],
      isLocked: false,
      imageUrl: '',
      voiceExplanation: '',
    });
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.info('Recording started... Speak your memory.');
    } else {
      setIsRecording(false);
      setNewMemory({ 
        ...newMemory, 
        type: 'voice', 
        voiceExplanation: 'This is a simulated transcript of your precious family story about the 1995 Jaipur house puja.',
        title: 'New Voice Story'
      });
      setShowAddModal(true);
      toast.success('Recording saved and transcribed');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white mb-2 italic tracking-tighter uppercase">
            SMRITI <span className="text-[#87ceeb] not-italic">ARCHIVE</span>
          </h1>
          <p className="text-[#b8b8c8] font-medium flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-[#87ceeb]" />
            Preserve your legacy, one story at a time.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={toggleRecording}
            className={`rounded-full font-black px-8 h-12 shadow-[0_0_20px_rgba(135,206,235,0.3)] transition-all ${
              isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-[#87ceeb] text-[#0a0a0f] hover:bg-[#b8e0f6]'
            }`}
          >
            <Mic className="w-5 h-5 mr-2" />
            {isRecording ? 'STOP RECORDING' : 'RECORD STORY'}
          </Button>
          <Button 
            variant="outline" 
            className="rounded-full border-[#87ceeb] text-[#87ceeb] px-8 h-12 font-black uppercase tracking-widest"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            UPLOAD
          </Button>
        </div>
      </div>

      {/* Feature Story Card */}
      <GlassCard className="p-1 overflow-hidden" neonColor="cyan">
        <div className="bg-gradient-to-r from-[#87ceeb]/10 to-transparent p-6 md:p-10 rounded-2xl flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-2/5 aspect-[4/3] rounded-3xl overflow-hidden relative group shadow-[0_0_30px_rgba(255,255,255,0.05)] border-2 border-white/10">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=1080" 
              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" 
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-full bg-[#87ceeb] flex items-center justify-center shadow-[0_0_30px_rgba(135,206,235,0.6)] cursor-pointer"
              >
                <Play className="w-10 h-10 text-[#0a0a0f] fill-current ml-1" />
              </motion.div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/20">
              <p className="text-[10px] font-black text-[#87ceeb] uppercase tracking-widest mb-1">Story of the Week</p>
              <h4 className="text-white font-bold text-sm">The Banyan Tree Legacy • 1995</h4>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3 text-[#87ceeb]">
              <div className="p-2 rounded-lg bg-[#87ceeb]/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em]">Featured Archive</span>
            </div>
            <h2 className="text-4xl font-black text-white italic leading-none uppercase tracking-tighter">THE SUNDAY <br /> GARDEN STORY</h2>
            <p className="text-[#b8b8c8] leading-relaxed text-lg italic">
              "I remember planting this neem tree when we first moved here. It was barely a sapling, and now it shades our entire lives..."
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white/60">
                <Users className="w-5 h-5 text-[#87ceeb]" />
                <span>Rameshwar & Savitri</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-white/60">
                <MapPin className="w-5 h-5 text-[#ff006e]" />
                <span>Jaipur Home</span>
              </div>
            </div>
            <Button variant="link" className="text-[#87ceeb] p-0 h-auto font-black text-sm uppercase tracking-[0.2em] flex items-center gap-3 group">
              LISTEN TO FULL ARCHIVE <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 sticky top-16 z-30 py-4 bg-transparent backdrop-blur-sm">
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto scrollbar-hide shrink-0">
          {(['all', 'photo', 'video', 'voice', 'note'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-[#87ceeb] text-[#0a0a0f] shadow-[0_0_15px_rgba(135,206,235,0.4)]' 
                  : 'text-[#b8b8c8] hover:text-white'
              }`}
            >
              {tab}s
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 focus-within:border-[#87ceeb]/50 transition-all">
          <Search className="w-5 h-5 text-[#b8b8c8]" />
          <input 
            type="text" 
            placeholder="Search by title, people, or location..." 
            className="w-full bg-transparent border-none outline-none text-sm text-white"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredMemories.length === 0 ? (
          <div className="col-span-full py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-12 h-12 text-white/20" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Archive is quiet</h3>
            <p className="text-[#b8b8c8] mt-2 mb-8">No memories found. Start recording your life's journey.</p>
            <Button onClick={() => setShowAddModal(true)} className="bg-[#87ceeb] text-[#0a0a0f] font-black rounded-full px-10">UPLOAD MEMORY</Button>
          </div>
        ) : (
          filteredMemories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="break-inside-avoid mb-6"
            >
              <GlassCard className="overflow-hidden group" neonColor={memory.type === 'voice' ? 'purple' : 'cyan'}>
                {/* Media */}
                {memory.type === 'photo' && memory.imageUrl && (
                  <div className="relative overflow-hidden group/img">
                    <ImageWithFallback src={memory.imageUrl} className="w-full h-auto object-cover group-hover/img:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon className="w-3 h-3 text-[#87ceeb]" />
                        PHOTO
                      </div>
                    </div>
                  </div>
                )}

                {memory.type === 'voice' && (
                  <div className="p-8 bg-gradient-to-br from-[#1e1e2d] to-[#0a0a0f] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <div className="flex h-full items-center justify-around gap-1 p-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                          <div key={i} className="w-2 bg-[#a855f7] rounded-full" style={{ height: `${Math.random() * 80 + 20}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#a855f7]/20 border-2 border-[#a855f7]/40 flex items-center justify-center text-[#a855f7]">
                        <Mic className="w-8 h-8" />
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#a855f7] w-1/2 shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
                      </div>
                      <div className="flex justify-between w-full text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        <span>01:12</span>
                        <span>02:45</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-[#87ceeb] transition-colors">
                      {memory.title}
                    </h3>
                    {memory.isLocked && <Lock className="w-4 h-4 text-[#ffa500]" />}
                  </div>

                  {memory.description && (
                    <p className="text-sm text-[#b8b8c8] italic leading-relaxed line-clamp-2">"{memory.description}"</p>
                  )}

                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-white/40 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5 text-[#87ceeb]" />
                        <span>{new Date(memory.date).toLocaleDateString()}</span>
                      </div>
                      {memory.location && (
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-white/40 uppercase tracking-widest">
                          <MapPin className="w-3.5 h-3.5 text-[#ff006e]" />
                          <span className="truncate max-w-[100px]">{memory.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {memory.people.map(p => (
                        <span key={p} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                          @{p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <Button variant="ghost" className="flex-1 bg-white/5 hover:bg-[#87ceeb]/10 text-white text-[10px] font-black uppercase tracking-widest h-10">VIEW FULL</Button>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/5 hover:bg-[#87ceeb]/10 text-[#87ceeb]" onClick={() => setEditingMemory(memory)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/5 hover:bg-red-500/10 text-red-400" onClick={() => deleteMemory(memory.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Memory Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-[#0a0a0f] border-[#87ceeb] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-[#87ceeb] uppercase italic tracking-tight">Preserve New Memory</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black text-white/60 tracking-widest">Memory Type</Label>
                <select 
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#87ceeb]/50"
                  value={newMemory.type}
                  onChange={e => setNewMemory({...newMemory, type: e.target.value as any})}
                >
                  <option value="photo">Photo Archive</option>
                  <option value="video">Video Archive</option>
                  <option value="voice">Voice Story</option>
                  <option value="note">Written Note</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black text-white/60 tracking-widest">Moment Date</Label>
                <Input 
                  type="date"
                  value={newMemory.date}
                  onChange={e => setNewMemory({...newMemory, date: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black text-white/60 tracking-widest">Memory Title *</Label>
              <Input 
                placeholder="e.g., Anjali's First Steps"
                value={newMemory.title}
                onChange={e => setNewMemory({...newMemory, title: e.target.value})}
                className="bg-white/5 border-white/10 h-12 rounded-xl font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black text-white/60 tracking-widest">Story / Description</Label>
              <Textarea 
                placeholder="Tell the story behind this moment..."
                value={newMemory.description}
                onChange={e => setNewMemory({...newMemory, description: e.target.value})}
                className="bg-white/5 border-white/10 h-32 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black text-white/60 tracking-widest">Location</Label>
                <Input 
                  placeholder="e.g., Jaipur House"
                  value={newMemory.location}
                  onChange={e => setNewMemory({...newMemory, location: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black text-white/60 tracking-widest">People (comma separated)</Label>
                <Input 
                  placeholder="e.g., Savitri, Ramesh"
                  onChange={e => setNewMemory({...newMemory, people: e.target.value.split(',').map(s => s.trim())})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black text-white/60 tracking-widest">Image URL / Upload Link</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://images.unsplash.com/..."
                  value={newMemory.imageUrl}
                  onChange={e => setNewMemory({...newMemory, imageUrl: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                />
                <Button variant="outline" className="h-12 border-white/10 bg-white/5">
                  <ImagePlus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#87ceeb]/10 p-4 rounded-xl border border-[#87ceeb]/20">
              <input 
                type="checkbox"
                id="isLocked-new"
                checked={newMemory.isLocked}
                onChange={e => setNewMemory({...newMemory, isLocked: e.target.checked})}
                className="w-5 h-5 rounded"
              />
              <Label htmlFor="isLocked-new" className="text-sm font-bold text-[#87ceeb] uppercase tracking-tight">Lock this memory in private vault</Label>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="border-white/10 flex-1 h-12">CANCEL</Button>
            <Button onClick={saveMemory} className="bg-[#87ceeb] text-[#0a0a0f] font-black flex-1 h-12 text-lg">PRESERVE MEMORY</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Memory Modal */}
      <Dialog open={!!editingMemory} onOpenChange={() => setEditingMemory(null)}>
        <DialogContent className="bg-[#0a0a0f] border-[#87ceeb] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-[#87ceeb] uppercase italic">Update Memory Archive</DialogTitle>
          </DialogHeader>
          
          {editingMemory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black text-white/60 tracking-widest">Memory Title</Label>
                <Input 
                  value={editingMemory.title}
                  onChange={e => setEditingMemory({...editingMemory, title: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black text-white/60 tracking-widest">Story</Label>
                <Textarea 
                  value={editingMemory.description}
                  onChange={e => setEditingMemory({...editingMemory, description: e.target.value})}
                  className="bg-white/5 border-white/10 h-40 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] font-black text-white/60 tracking-widest">Location</Label>
                  <Input 
                    value={editingMemory.location}
                    onChange={e => setEditingMemory({...editingRecord, location: e.target.value} as any)}
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] font-black text-white/60 tracking-widest">Date</Label>
                  <Input 
                    type="date"
                    value={editingMemory.date}
                    onChange={e => setEditingMemory({...editingMemory, date: e.target.value})}
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setEditingMemory(null)} className="border-white/10 flex-1 h-12">CANCEL</Button>
            <Button onClick={updateMemory} className="bg-[#87ceeb] text-[#0a0a0f] font-black flex-1 h-12 text-lg">UPDATE ARCHIVE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
