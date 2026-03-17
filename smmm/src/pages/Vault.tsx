import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  FileText, Lock, EyeOff, Folder, Tag, Upload, Download, Search,
  Trash2, Edit, Shield, FileCheck, Calendar, Filter, Plus,
  Heart, Wallet, Scale, Users, BookOpen, AlertCircle, X,
  Camera, Mic, Loader2, Sparkles, CheckCircle2, FolderLock,
  Key, Eye, Copy, Globe
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner@2.0.3';
import { localStore, VaultItem, PasswordVaultItem } from '../utils/localStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { motion, AnimatePresence } from 'motion/react';
import { FloatingParticles } from '../components/FloatingParticles';
import { PulseBeam } from '../components/PulseBeam';
import { TextReveal } from '../components/TextReveal';
import { BounceIn } from '../components/BounceIn';

export function Vault() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [passwordItems, setPasswordItems] = useState<PasswordVaultItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<VaultItem[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<PasswordVaultItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [showHidden, setShowHidden] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0); 
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  
  // PIN Protection State
  const [pinAction, setPinAction] = useState<{ type: string; id: string; itemType: 'doc' | 'pwd'; data?: any } | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [viewingItem, setViewingItem] = useState<VaultItem | null>(null);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [editingPassword, setEditingPassword] = useState<PasswordVaultItem | null>(null);

  const [newDoc, setNewDoc] = useState<Partial<VaultItem>>({
    name: '',
    type: 'other',
    tags: [],
    isLocked: false,
    isHidden: false,
  });
  const [newPassword, setNewPassword] = useState<Partial<PasswordVaultItem>>({
    name: '',
    category: 'other',
    username: '',
    email: '',
    password: '',
    url: '',
    notes: '',
    tags: [],
    isLocked: false,
  });

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedFolder, showHidden, items, passwordItems]);

  const loadItems = () => {
    const allItems = localStore.getVaultItems();
    const allPasswords = localStore.getPasswordVaultItems();
    setItems(allItems);
    setPasswordItems(allPasswords);
  };

  const filterItems = () => {
    let filtered = items;
    let filteredPwd = passwordItems;

    if (selectedFolder !== 'all') {
      if (selectedFolder === 'Passwords') {
        filtered = [];
      } else {
        if (selectedFolder === 'Health') filtered = filtered.filter(item => item.type === 'medical' || item.folder === 'Health');
        if (selectedFolder === 'Money') filtered = filtered.filter(item => item.type === 'financial' || item.type === 'bill' || item.folder === 'Money');
        if (selectedFolder === 'Legal') filtered = filtered.filter(item => item.type === 'legal' || item.type === 'agreement' || item.folder === 'Legal');
        if (selectedFolder === 'Identity') filtered = filtered.filter(item => ['aadhaar', 'pan', 'passport', 'voter_id', 'driving_license'].includes(item.type) || item.folder === 'Identity');
        filteredPwd = [];
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        item.extractedText?.toLowerCase().includes(query)
      );
      filteredPwd = filteredPwd.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.username?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (!showHidden) {
      filtered = filtered.filter(item => !item.isHidden);
    }

    setFilteredItems(filtered);
    setFilteredPasswords(selectedFolder === 'Passwords' || selectedFolder === 'all' ? filteredPwd : []);
  };

  const requestAction = (type: string, id: string, itemType: 'doc' | 'pwd', data?: any) => {
    const item = itemType === 'doc' ? items.find(i => i.id === id) : passwordItems.find(i => i.id === id);
    if (!item) return;

    // PIN is required for view, download, delete, edit if it's locked OR if user requested it for all actions
    // For this app, we'll require PIN for ALL sensitive actions as requested
    setPinAction({ type, id, itemType, data });
    setPinInput('');
    setShowPinDialog(true);
  };

  const verifyPinAndExecute = () => {
    if (pinInput === '1234' || pinInput === 'demo') {
      setShowPinDialog(false);
      executeAction();
    } else {
      toast.error('Invalid PIN. Please try again.');
    }
  };

  const executeAction = () => {
    if (!pinAction) return;
    const { type, id, itemType } = pinAction;

    if (itemType === 'doc') {
      const item = items.find(i => i.id === id);
      if (!item) return;

      switch (type) {
        case 'view':
          setViewingItem(item);
          break;
        case 'download':
          toast.success(`Downloading ${item.name}...`);
          break;
        case 'edit':
          setEditingItem(item);
          break;
        case 'delete':
          localStore.deleteVaultItem(id);
          toast.success('Document deleted');
          loadItems();
          break;
      }
    } else {
      const item = passwordItems.find(i => i.id === id);
      if (!item) return;

      switch (type) {
        case 'edit':
          setEditingPassword(item);
          break;
        case 'delete':
          localStore.deletePasswordVaultItem(id);
          toast.success('Password deleted');
          loadItems();
          break;
      }
    }
    setPinAction(null);
  };

  const handleUpload = () => {
    setIsUploading(true);
    setUploadStep(1);
    
    setTimeout(() => {
      setUploadStep(2);
      setNewDoc({
        ...newDoc,
        name: 'New Document (Scanned)',
        extractedText: 'Extracted text from document... [Simulated OCR Result]',
        type: 'receipt',
        tags: ['scanned', 'auto-detected']
      });
    }, 2000);
  };

  const saveDocument = () => {
    if (!newDoc.name) return toast.error('Please enter a name');
    
    localStore.addVaultItem({
      userId: 'demo_user',
      name: newDoc.name,
      type: newDoc.type as any,
      folder: newDoc.folder || 'Uploaded',
      tags: newDoc.tags || [],
      extractedText: newDoc.extractedText,
      isLocked: newDoc.isLocked || false,
      isHidden: newDoc.isHidden || false,
    });

    toast.success('Document saved to vault');
    setIsUploading(false);
    setUploadStep(0);
    setNewDoc({
      name: '',
      type: 'other',
      tags: [],
      isLocked: false,
      isHidden: false,
    });
    loadItems();
  };

  const updateDocument = () => {
    if (!editingItem) return;
    localStore.updateVaultItem(editingItem.id, editingItem);
    toast.success('Document updated');
    setEditingItem(null);
    loadItems();
  };

  const savePassword = () => {
    if (!newPassword.name || !newPassword.password) {
      return toast.error('Please enter name and password');
    }
    
    localStore.addPasswordVaultItem({
      userId: 'demo_user',
      name: newPassword.name,
      category: newPassword.category as any,
      username: newPassword.username,
      email: newPassword.email,
      password: newPassword.password!,
      url: newPassword.url,
      notes: newPassword.notes,
      tags: newPassword.tags || [],
      isLocked: newPassword.isLocked || false,
    });

    toast.success('Password saved securely');
    setShowAddPassword(false);
    setNewPassword({
      name: '',
      category: 'other',
      username: '',
      email: '',
      password: '',
      url: '',
      notes: '',
      tags: [],
      isLocked: false,
    });
    loadItems();
  };

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisiblePasswords(newVisible);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const categories = [
    { id: 'all', label: 'All Files', icon: Folder, color: '#87ceeb' },
    { id: 'Identity', label: 'Identity', icon: Users, color: '#00d9ff' },
    { id: 'Health', label: 'Health', icon: Heart, color: '#ff006e' },
    { id: 'Money', label: 'Finance', icon: Wallet, color: '#00ff88' },
    { id: 'Legal', label: 'Legal', icon: Scale, color: '#ffa500' },
    { id: 'Passwords', label: 'Passwords', icon: Key, color: '#a855f7' },
  ];

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      aadhaar: '#00d9ff',
      pan: '#a855f7',
      passport: '#ff006e',
      medical: '#ff006e',
      financial: '#00ff88',
      legal: '#ffa500',
      property: '#00ff88',
      bill: '#87ceeb',
    };
    return colors[type] || '#87ceeb';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      bank: '#00ff88',
      subscription: '#a855f7',
      social_media: '#ff006e',
      email: '#87ceeb',
      government: '#00d9ff',
      insurance: '#ffa500',
    };
    return colors[category] || '#87ceeb';
  };

  return (
    <div className="space-y-6 pb-20">
      {/* PIN Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="bg-[#0a0a0f] border-[#87ceeb] text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#87ceeb]" />
              Secure Authentication
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center gap-4">
            <p className="text-sm text-[#b8b8c8] text-center">Please enter your 4-digit PIN to perform this action.</p>
            <Input 
              type="password" 
              maxLength={4} 
              value={pinInput} 
              onChange={e => setPinInput(e.target.value)}
              className="w-32 h-14 text-center text-2xl font-black tracking-[0.5em] bg-white/5 border-[#87ceeb]"
              placeholder="••••"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && verifyPinAndExecute()}
            />
            <p className="text-[10px] text-white/40 uppercase">Demo PIN: 1234</p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPinDialog(false)} className="flex-1 border-white/10">Cancel</Button>
            <Button onClick={verifyPinAndExecute} className="flex-1 bg-[#87ceeb] text-[#0a0a0f] font-bold">Verify PIN</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Item Dialog */}
      <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
        <DialogContent className="bg-[#0a0a0f] border-[#87ceeb] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: viewingItem ? getTypeColor(viewingItem.type) + '20' : '' }}>
                <FileText className="w-6 h-6" style={{ color: viewingItem ? getTypeColor(viewingItem.type) : '' }} />
              </div>
              {viewingItem?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4 overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Upload Date</p>
                <p className="text-sm font-bold">{viewingItem && new Date(viewingItem.uploadDate).toLocaleDateString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Category</p>
                <p className="text-sm font-bold capitalize">{viewingItem?.type}</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Extracted Information</p>
              <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap italic">
                {viewingItem?.extractedText || "No text extracted from this document."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {viewingItem?.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-[#87ceeb]/10 border border-[#87ceeb]/30 text-[#87ceeb] text-[10px] font-bold uppercase">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewingItem(null)} className="bg-[#87ceeb] text-[#0a0a0f] font-bold px-8">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="bg-[#0a0a0f] border-[#87ceeb] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Document Name</Label>
              <Input 
                value={editingItem?.name || ''} 
                onChange={e => setEditingItem(editingItem ? {...editingItem, name: e.target.value} : null)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <select 
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white outline-none"
                  value={editingItem?.type}
                  onChange={e => setEditingItem(editingItem ? {...editingItem, type: e.target.value as any} : null)}
                >
                  <option value="aadhaar">Aadhaar</option>
                  <option value="pan">PAN</option>
                  <option value="medical">Medical</option>
                  <option value="financial">Financial</option>
                  <option value="legal">Legal</option>
                  <option value="bill">Bill/Receipt</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Folder</Label>
                <Input 
                  value={editingItem?.folder || ''}
                  onChange={e => setEditingItem(editingItem ? {...editingItem, folder: e.target.value} : null)}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Information</Label>
              <Textarea 
                value={editingItem?.extractedText || ''} 
                onChange={e => setEditingItem(editingItem ? {...editingItem, extractedText: e.target.value} : null)}
                className="bg-white/5 border-white/10 h-32"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={editingItem?.isLocked} 
                  onChange={e => setEditingItem(editingItem ? {...editingItem, isLocked: e.target.checked} : null)}
                  id="edit-locked"
                />
                <Label htmlFor="edit-locked">Locked</Label>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={editingItem?.isHidden} 
                  onChange={e => setEditingItem(editingItem ? {...editingItem, isHidden: e.target.checked} : null)}
                  id="edit-hidden"
                />
                <Label htmlFor="edit-hidden">Hidden</Label>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingItem(null)} className="border-white/10">Cancel</Button>
            <Button onClick={updateDocument} className="bg-[#87ceeb] text-[#0a0a0f] font-bold">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tighter" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.05em' }}>
            THE <span className="text-[#87ceeb] italic">VAULT</span>
          </h1>
          <p className="text-[#b8b8c8] text-base font-medium">Everything important, structured and safe.</p>
        </div>
        
        <div className="flex gap-3">
          <Dialog open={showAddPassword} onOpenChange={setShowAddPassword}>
            <DialogTrigger asChild>
              <Button className="bg-[#a855f7] text-white hover:bg-[#9333ea] font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-full px-6">
                <Key className="w-5 h-5 mr-2" />
                Add Password
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a0a0f] border-[#a855f7] text-white max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#a855f7] tracking-tight">Save Password</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-white">Service/App Name *</Label>
                  <Input 
                    placeholder="e.g., State Bank Online Banking"
                    value={newPassword.name} 
                    onChange={e => setNewPassword({...newPassword, name: e.target.value})}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-white">Category</Label>
                    <select 
                      className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white outline-none"
                      value={newPassword.category}
                      onChange={e => setNewPassword({...newPassword, category: e.target.value as any})}
                    >
                      <option value="bank">Bank Account</option>
                      <option value="subscription">Subscription</option>
                      <option value="social_media">Social Media</option>
                      <option value="email">Email</option>
                      <option value="government">Government Portal</option>
                      <option value="insurance">Insurance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-white">Website URL</Label>
                    <Input 
                      placeholder="https://..."
                      value={newPassword.url} 
                      onChange={e => setNewPassword({...newPassword, url: e.target.value})}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-white">Username</Label>
                  <Input 
                    placeholder="Username or Customer ID"
                    value={newPassword.username} 
                    onChange={e => setNewPassword({...newPassword, username: e.target.value})}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-white">Email</Label>
                  <Input 
                    placeholder="email@example.com"
                    type="email"
                    value={newPassword.email} 
                    onChange={e => setNewPassword({...newPassword, email: e.target.value})}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-white">Password *</Label>
                  <Input 
                    placeholder="••••••••"
                    type="password"
                    value={newPassword.password} 
                    onChange={e => setNewPassword({...newPassword, password: e.target.value})}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-white">Notes</Label>
                  <Textarea 
                    placeholder="Security questions, recovery info, etc."
                    value={newPassword.notes} 
                    onChange={e => setNewPassword({...newPassword, notes: e.target.value})}
                    className="bg-white/5 border-white/10 h-20"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-[#a855f7] text-white font-bold" onClick={savePassword}>
                    <Shield className="w-4 h-4 mr-2" />
                    Save Securely
                  </Button>
                  <Button variant="outline" className="border-white/20" onClick={() => setShowAddPassword(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isUploading} onOpenChange={setIsUploading}>
            <DialogTrigger asChild>
              <Button className="bg-[#87ceeb] text-[#0a0a0f] hover:bg-[#b8e0f6] font-bold shadow-[0_0_15px_rgba(135,206,235,0.4)] rounded-full px-6">
                <Plus className="w-5 h-5 mr-2" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a0a0f] border-[#87ceeb] text-white max-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#87ceeb] tracking-tight">Vault Deposit</DialogTitle>
              </DialogHeader>
              
              {uploadStep === 0 && (
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 flex flex-col gap-2 border-dashed border-[#87ceeb]/50 hover:bg-[#87ceeb]/10" onClick={handleUpload}>
                      <Camera className="w-8 h-8 text-[#87ceeb]" />
                      <span>Scan Doc</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col gap-2 border-dashed border-[#a855f7]/50 hover:bg-[#a855f7]/10" onClick={handleUpload}>
                      <Upload className="w-8 h-8 text-[#a855f7]" />
                      <span>Upload File</span>
                    </Button>
                  </div>
                  <div className="p-4 rounded-lg bg-[#87ceeb]/10 border border-[#87ceeb]/30">
                    <div className="flex items-center gap-2 mb-2 text-[#87ceeb]">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-bold">AI OCR Active</span>
                    </div>
                    <p className="text-xs text-[#b8b8c8]">
                      Our AI will automatically extract text, dates, and amounts from your documents.
                    </p>
                  </div>
                </div>
              )}

              {uploadStep === 1 && (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-12 h-12 text-[#87ceeb] animate-spin" />
                  <p className="text-lg font-medium text-white animate-pulse">Analyzing document...</p>
                  <p className="text-sm text-[#b8b8c8]">Running OCR and classification</p>
                </div>
              )}

              {uploadStep === 2 && (
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-2 text-[#00ff88] mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold">Scan Complete</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Document Name</Label>
                    <Input 
                      value={newDoc.name} 
                      onChange={e => setNewDoc({...newDoc, name: e.target.value})}
                      className="bg-white/5 border-white/10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <select 
                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white outline-none"
                        value={newDoc.type}
                        onChange={e => setNewDoc({...newDoc, type: e.target.value as any})}
                      >
                        <option value="aadhaar">Aadhaar</option>
                        <option value="pan">PAN</option>
                        <option value="medical">Medical</option>
                        <option value="financial">Financial</option>
                        <option value="legal">Legal</option>
                        <option value="bill">Bill/Receipt</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Folder</Label>
                      <Input 
                        placeholder="e.g. Health" 
                        value={newDoc.folder}
                        onChange={e => setNewDoc({...newDoc, folder: e.target.value})}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Extracted Text Preview</Label>
                    <Textarea 
                      value={newDoc.extractedText} 
                      onChange={e => setNewDoc({...newDoc, extractedText: e.target.value})}
                      className="bg-white/5 border-white/10 text-xs h-20"
                    />
                  </div>

                  <Button className="w-full bg-[#87ceeb] text-[#0a0a0f] font-bold" onClick={saveDocument}>
                    Save to Vault
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = selectedFolder === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedFolder(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all whitespace-nowrap border-2 ${ isActive 
                  ? 'bg-[rgba(135,206,235,0.15)] border-[#87ceeb] text-white shadow-[0_0_15px_rgba(135,206,235,0.2)]' 
                  : 'bg-[#0a0a0f] border-white/5 text-[#b8b8c8] hover:border-white/20'
              }`}
            >
              <Icon className="w-5 h-5" style={{ color: isActive ? '#87ceeb' : cat.color }} />
              <span className="font-bold text-sm tracking-wide">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <GlassCard className="flex-1 p-2 flex items-center gap-3" neonColor="cyan">
          <Search className="w-5 h-5 text-[#87ceeb] ml-3" />
          <input 
            type="text" 
            placeholder="Search by name, tags, or document content..." 
            className="flex-1 bg-transparent border-none text-white outline-none py-2"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </GlassCard>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowHidden(!showHidden)}
            className={`border-[#a855f7] ${showHidden ? 'bg-[#a855f7]/20' : ''}`}
          >
            <EyeOff className={`w-5 h-5 ${showHidden ? 'text-white' : 'text-[#a855f7]'}`} />
          </Button>
          <Button variant="outline" size="icon" className="border-[#87ceeb]">
            <Filter className="w-5 h-5 text-[#87ceeb]" />
          </Button>
        </div>
      </div>

      {/* Password Manager Section */}
      {(selectedFolder === 'Passwords' || selectedFolder === 'all') && filteredPasswords.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-[#a855f7]" />
            <h2 className="text-2xl font-black text-white tracking-tight">Password Manager</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPasswords.map(pwd => {
              const isVisible = visiblePasswords.has(pwd.id);
              return (
                <GlassCard key={pwd.id} className="group overflow-hidden flex flex-col" neonColor="purple">
                  <div className="relative p-5 pb-3 border-b border-white/5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div 
                          className="inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-white border mb-3"
                          style={{ backgroundColor: `${getCategoryColor(pwd.category)}40`, borderColor: getCategoryColor(pwd.category) }}
                        >
                          {pwd.category.replace('_', ' ')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Key className="w-5 h-5 text-[#a855f7]" />
                          <h3 className="text-lg font-bold text-white leading-tight">{pwd.name}</h3>
                        </div>
                      </div>
                      {pwd.isLocked && <div className="p-1.5 rounded-full bg-black/50 backdrop-blur-md border border-[#ffa500]/50"><Lock className="w-3.5 h-3.5 text-[#ffa500]" /></div>}
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1">
                    {pwd.username && (
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#b8b8c8] uppercase font-bold tracking-wider mb-0.5">Username</p>
                          <p className="text-sm text-white truncate">{pwd.username}</p>
                        </div>
                        <button onClick={() => copyToClipboard(pwd.username!, 'Username')} className="p-1.5 rounded hover:bg-white/10 text-[#87ceeb]">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-[#b8b8c8] uppercase font-bold tracking-wider mb-0.5">Password</p>
                        <p className="text-sm text-white font-mono">{isVisible ? pwd.password : '••••••••••'}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => togglePasswordVisibility(pwd.id)} className="p-1.5 rounded hover:bg-white/10 text-[#a855f7]">
                          {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => copyToClipboard(pwd.password, 'Password')} className="p-1.5 rounded hover:bg-white/10 text-[#87ceeb]">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-[10px] text-[#b8b8c8]">
                      Updated: {new Date(pwd.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="p-3 border-t border-white/5 flex gap-2">
                    <Button 
                      variant="ghost" 
                      className="flex-1 text-[#a855f7] hover:bg-[#a855f7]/10 text-xs font-bold"
                      onClick={() => requestAction('edit', pwd.id, 'pwd')}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      EDIT
                    </Button>
                    <button 
                      onClick={() => requestAction('delete', pwd.id, 'pwd')} 
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Documents Grid */}
      {selectedFolder !== 'Passwords' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#87ceeb]" />
            <h2 className="text-2xl font-black text-white tracking-tight">Documents</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <GlassCard key={item.id} className="group overflow-hidden flex flex-col" neonColor="cyan">
                <div className="relative p-5 pb-3 border-b border-white/5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div 
                        className="inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-white border mb-3"
                        style={{ backgroundColor: `${getTypeColor(item.type)}40`, borderColor: getTypeColor(item.type) }}
                      >
                        {item.type.replace('_', ' ')}
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight">{item.name}</h3>
                    </div>
                    {item.isLocked && <div className="p-1.5 rounded-full bg-black/50 backdrop-blur-md border border-[#ffa500]/50"><Lock className="w-3.5 h-3.5 text-[#ffa500]" /></div>}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-[#b8b8c8]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20"></span>
                      <span>{item.folder || 'Default'}</span>
                    </div>
                    
                    {item.extractedText && (
                      <p className="text-xs text-white/50 line-clamp-3 italic">
                        "{item.extractedText}"
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-bold text-white/40 uppercase tracking-widest border border-white/10 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Button 
                      variant="ghost" 
                      className="flex-1 bg-white/5 hover:bg-[#87ceeb]/10 text-white text-[10px] font-black uppercase tracking-widest h-10"
                      onClick={() => requestAction('view', item.id, 'doc')}
                    >
                      <Eye className="w-3.5 h-3.5 mr-2" />
                      VIEW
                    </Button>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 bg-white/5 hover:bg-[#00ff88]/10 text-[#00ff88]"
                        onClick={() => requestAction('download', item.id, 'doc')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 bg-white/5 hover:bg-[#a855f7]/10 text-[#a855f7]"
                        onClick={() => requestAction('edit', item.id, 'doc')}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 bg-white/5 hover:bg-red-500/10 text-red-400"
                        onClick={() => requestAction('delete', item.id, 'doc')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-[#b8b8c8] font-medium">No documents found in this category.</p>
                <Button variant="link" onClick={() => setSelectedFolder('all')} className="text-[#87ceeb] text-xs font-bold mt-2">SHOW ALL FILES</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Security Tip */}
      <GlassCard className="p-6 border-dashed border-[#ffa500]/30" neonColor="purple">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-[#ffa500]/10 border border-[#ffa500]/30 shrink-0">
            <Shield className="w-6 h-6 text-[#ffa500]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Security Recommendation</h3>
            <p className="text-sm text-[#b8b8c8] leading-relaxed">
              You have 3 sensitive documents (Property, PAN, Aadhaar) that are not currently locked. 
              We recommend enabling <strong>Bio-Lock</strong> for these items to ensure maximum protection.
            </p>
            <Button variant="link" className="p-0 h-auto text-[#ffa500] text-xs font-bold mt-2 uppercase tracking-widest">
              Lock All Sensitive Docs →
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}