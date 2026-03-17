import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Users, User, Heart, Phone, Mail, MapPin, 
  Trash2, Plus, Search, Filter, Calendar, 
  Shield, AlertCircle, Share2, MoreVertical,
  ChevronRight, Sparkles, Edit, X, FileText,
  LifeBuoy, Activity, Eye
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner@2.0.3';
import { localStore, PersonProfile } from '../utils/localStore';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

export function People() {
  const [people, setPeople] = useState<PersonProfile[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'emergency' | 'dependent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonProfile | null>(null);
  const [editingPerson, setEditingPerson] = useState<PersonProfile | null>(null);

  const [newPerson, setNewPerson] = useState<Partial<PersonProfile>>({
    name: '',
    relation: '',
    phone: '',
    email: '',
    address: '',
    isDependent: false,
    isEmergencyContact: false,
    notes: '',
    medicalInfo: '',
  });

  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = () => {
    setPeople(localStore.getPeople());
  };

  const filtered = people.filter(p => {
    const matchesFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'emergency' && p.isEmergencyContact) || 
      (activeFilter === 'dependent' && p.isDependent);
    
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.relation.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesFilter && matchesSearch;
  });

  const saveNewPerson = () => {
    if (!newPerson.name || !newPerson.relation) return toast.error('Name and relation are required');
    
    localStore.addPerson({
      userId: 'demo_user',
      name: newPerson.name,
      relation: newPerson.relation,
      phone: newPerson.phone || '',
      email: newPerson.email || '',
      address: newPerson.address || '',
      isDependent: newPerson.isDependent || false,
      isEmergencyContact: newPerson.isEmergencyContact || false,
      photo: '', // In a real app, this would be a file upload URL
      documents: [],
      importantDates: [],
      medicalInfo: newPerson.medicalInfo || '',
      notes: newPerson.notes || '',
    });

    toast.success('New person added to your inner circle');
    setShowAddModal(false);
    setNewPerson({ name: '', relation: '', phone: '', email: '', address: '', isDependent: false, isEmergencyContact: false });
    loadPeople();
  };

  const updatePerson = () => {
    if (!editingPerson) return;
    localStore.updatePerson(editingPerson.id, editingPerson);
    toast.success('Profile updated');
    setEditingPerson(null);
    loadPeople();
  };

  const deletePerson = (id: string) => {
    if (confirm('Remove this person from your network?')) {
      localStore.deletePerson(id);
      toast.success('Contact removed');
      loadPeople();
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white mb-2 italic tracking-tighter uppercase">
            TRUST <span className="text-[#a855f7] not-italic">NETWORK</span>
          </h1>
          <p className="text-[#b8b8c8] font-medium flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-[#a855f7]" />
            Manage family, caregivers, and emergency contacts.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAddModal(true)}
            className="rounded-full bg-[#a855f7] text-white hover:bg-[#c28dff] font-black px-8 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all h-12"
          >
            <Plus className="w-5 h-5 mr-2" />
            ADD PERSON
          </Button>
        </div>
      </div>

      {/* Trust Network Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto scrollbar-hide shrink-0">
          {(['all', 'emergency', 'dependent'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeFilter === f 
                  ? 'bg-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                  : 'text-[#b8b8c8] hover:text-white'
              }`}
            >
              {f === 'emergency' ? 'SOS Contacts' : f === 'all' ? 'Inner Circle' : 'Dependents'}
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 focus-within:border-[#a855f7]/50 transition-all">
          <Search className="w-5 h-5 text-[#b8b8c8]" />
          <input 
            type="text" 
            placeholder="Search by name, relation, or role..." 
            className="bg-transparent border-none outline-none text-sm text-white flex-1"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-white/20" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Your network is empty</h3>
            <p className="text-[#b8b8c8] mt-2 mb-8">Start by adding your family members or emergency guardians.</p>
            <Button onClick={() => setShowAddModal(true)} className="bg-[#a855f7] text-white font-black rounded-full px-10">ADD FIRST PERSON</Button>
          </div>
        ) : (
          filtered.map((person) => (
            <GlassCard key={person.id} className="relative overflow-hidden group flex flex-col" neonColor={person.isEmergencyContact ? 'pink' : 'cyan'}>
              <div className="p-6 flex-1">
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                      {person.photo ? (
                        <ImageWithFallback src={person.photo} alt={person.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <User className="w-10 h-10 text-white/10" />
                        </div>
                      )}
                    </div>
                    {person.isEmergencyContact && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#ff006e] flex items-center justify-center shadow-[0_0_15px_rgba(255,0,110,0.5)] border-2 border-[#0a0a0f] animate-pulse">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-black text-white leading-none mb-1 truncate group-hover:text-[#a855f7] transition-colors uppercase tracking-tight">
                      {person.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{person.relation}</span>
                      {person.isDependent && (
                        <span className="px-2 py-0.5 rounded-full bg-[#87ceeb]/10 border border-[#87ceeb]/30 text-[#87ceeb] text-[8px] font-black uppercase">Dependent</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {person.phone && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group/item hover:border-white/20 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/item:text-[#00ff88] transition-colors">
                          <Phone className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-white/90">{person.phone}</span>
                      </div>
                    )}
                    {person.address && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group/item hover:border-white/20 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/item:text-[#ffa500] transition-colors">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-xs text-white/70 line-clamp-1">{person.address}</span>
                      </div>
                    )}
                  </div>
                  
                  {person.medicalInfo && (
                    <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                      <div className="flex items-center gap-2 mb-1 text-red-400">
                        <Activity className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Medical Note</span>
                      </div>
                      <p className="text-[11px] text-[#b8b8c8] leading-tight italic line-clamp-2">"{person.medicalInfo}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-black/20 border-t border-white/5 flex gap-2">
                <Button 
                  variant="ghost" 
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest h-10"
                  onClick={() => setSelectedPerson(person)}
                >
                  <Eye className="w-3.5 h-3.5 mr-2" />
                  VIEW DETAILS
                </Button>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 bg-white/5 hover:bg-[#a855f7]/10 text-[#a855f7]"
                    onClick={() => setEditingPerson(person)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 bg-white/5 hover:bg-red-500/10 text-red-400"
                    onClick={() => deletePerson(person.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Trust & Access Summary */}
      <GlassCard className="p-8 border-dashed border-[#a855f7]/30" neonColor="purple">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="p-5 rounded-2xl bg-[#a855f7]/10 border border-[#a855f7]/30 shrink-0">
            <LifeBuoy className="w-10 h-10 text-[#a855f7]" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-2">Network <span className="text-[#a855f7] not-italic">Integrity</span></h3>
            <p className="text-sm text-[#b8b8c8] leading-relaxed mb-6">
              Your network health is <span className="text-[#00ff88] font-bold">EXCELLENT</span>. You have 2 verified emergency contacts and 1 legal executor. 
              Suresh Kumar has been granted access to your medical vault in case of SOS activation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 text-xs text-white/50">
                <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
                <span>Identity Verified</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/50">
                <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
                <span>Legal Documents Linked</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/50">
                <div className="w-2 h-2 rounded-full bg-[#ffa500]" />
                <span>1 Access Pending Review</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto shrink-0 flex flex-col gap-2">
            <Button className="bg-[#a855f7] text-white font-black px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)]">AUDIT ACCESS</Button>
            <Button variant="ghost" className="text-[#b8b8c8] font-bold">VIEW HISTORY</Button>
          </div>
        </div>
      </GlassCard>

      {/* Add Person Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-[#0a0a0f] border-[#a855f7] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#a855f7] uppercase tracking-tight">Add New Inner Circle Contact</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Full Name *</Label>
              <Input 
                placeholder="e.g., Suresh Kumar" 
                value={newPerson.name} 
                onChange={e => setNewPerson({...newPerson, name: e.target.value})}
                className="bg-white/5 border-white/10 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Relation *</Label>
              <Input 
                placeholder="e.g., Son, Doctor, Spouse" 
                value={newPerson.relation} 
                onChange={e => setNewPerson({...newPerson, relation: e.target.value})}
                className="bg-white/5 border-white/10 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Phone Number</Label>
              <Input 
                placeholder="+91 XXXXX XXXXX" 
                value={newPerson.phone} 
                onChange={e => setNewPerson({...newPerson, phone: e.target.value})}
                className="bg-white/5 border-white/10 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Email Address</Label>
              <Input 
                placeholder="email@example.com" 
                value={newPerson.email} 
                onChange={e => setNewPerson({...newPerson, email: e.target.value})}
                className="bg-white/5 border-white/10 h-12"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Residential Address</Label>
              <Input 
                placeholder="Street, City, State, ZIP" 
                value={newPerson.address} 
                onChange={e => setNewPerson({...newPerson, address: e.target.value})}
                className="bg-white/5 border-white/10 h-12"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Medical Info / Allergies / Notes</Label>
              <Textarea 
                placeholder="e.g., Blood group, Chronic conditions, etc." 
                value={newPerson.medicalInfo} 
                onChange={e => setNewPerson({...newPerson, medicalInfo: e.target.value})}
                className="bg-white/5 border-white/10 h-24"
              />
            </div>
            
            <div className="flex gap-6 md:col-span-2 bg-white/5 p-4 rounded-xl border border-white/10 mt-2">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="new-emergency" 
                  checked={newPerson.isEmergencyContact} 
                  onChange={e => setNewPerson({...newPerson, isEmergencyContact: e.target.checked})}
                  className="w-5 h-5 rounded border-white/20"
                />
                <Label htmlFor="new-emergency" className="text-sm font-bold text-white uppercase tracking-tight">SOS Contact</Label>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="new-dependent" 
                  checked={newPerson.isDependent} 
                  onChange={e => setNewPerson({...newPerson, isDependent: e.target.checked})}
                  className="w-5 h-5 rounded border-white/20"
                />
                <Label htmlFor="new-dependent" className="text-sm font-bold text-white uppercase tracking-tight">Dependent</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="border-white/10 flex-1">CANCEL</Button>
            <Button onClick={saveNewPerson} className="bg-[#a855f7] text-white font-black px-10 flex-1">SAVE PROFILE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Person Modal */}
      <Dialog open={!!editingPerson} onOpenChange={() => setEditingPerson(null)}>
        <DialogContent className="bg-[#0a0a0f] border-[#a855f7] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Full Name</Label>
              <Input 
                value={editingPerson?.name || ''} 
                onChange={e => setEditingPerson(editingPerson ? {...editingPerson, name: e.target.value} : null)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Relation</Label>
              <Input 
                value={editingPerson?.relation || ''} 
                onChange={e => setEditingPerson(editingPerson ? {...editingPerson, relation: e.target.value} : null)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Phone</Label>
              <Input 
                value={editingPerson?.phone || ''} 
                onChange={e => setEditingPerson(editingPerson ? {...editingPerson, phone: e.target.value} : null)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-white/60">Medical Note</Label>
              <Input 
                value={editingPerson?.medicalInfo || ''} 
                onChange={e => setEditingPerson(editingPerson ? {...editingPerson, medicalInfo: e.target.value} : null)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="flex gap-6 md:col-span-2 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="edit-emergency" 
                  checked={editingPerson?.isEmergencyContact} 
                  onChange={e => setEditingPerson(editingPerson ? {...editingPerson, isEmergencyContact: e.target.checked} : null)}
                />
                <Label htmlFor="edit-emergency" className="text-sm font-bold">SOS Contact</Label>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="edit-dependent" 
                  checked={editingPerson?.isDependent} 
                  onChange={e => setEditingPerson(editingPerson ? {...editingPerson, isDependent: e.target.checked} : null)}
                />
                <Label htmlFor="edit-dependent" className="text-sm font-bold">Dependent</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingPerson(null)} className="border-white/10">CANCEL</Button>
            <Button onClick={updatePerson} className="bg-[#a855f7] text-white font-black px-10">SAVE CHANGES</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Person Detail View Dialog */}
      <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
        <DialogContent className="bg-[#0a0a0f] border-[#a855f7] text-white max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase">{selectedPerson?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-16 h-16 rounded-xl bg-[#a855f7]/20 flex items-center justify-center text-[#a855f7]">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Trust Profile: {selectedPerson?.relation}</p>
                <p className="text-xs text-[#b8b8c8]">{selectedPerson?.isEmergencyContact ? 'Verified Emergency Guardian' : 'Inner Circle Member'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Contact Information</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm"><Phone className="w-4 h-4 text-[#00ff88]" /> {selectedPerson?.phone}</div>
                  <div className="flex items-center gap-3 text-sm"><Mail className="w-4 h-4 text-[#87ceeb]" /> {selectedPerson?.email || 'No email provided'}</div>
                  <div className="flex items-center gap-3 text-sm"><MapPin className="w-4 h-4 text-[#ffa500]" /> {selectedPerson?.address || 'No address provided'}</div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Medical & Critical Info</p>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-[#b8b8c8] italic">
                  {selectedPerson?.medicalInfo || "No critical medical information shared for this contact."}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSelectedPerson(null)} className="w-full bg-[#a855f7] text-white font-black py-6 rounded-xl">CLOSE PROFILE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}