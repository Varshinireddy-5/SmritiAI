import { useState } from 'react';
import { useNavigate } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Users,
  Download,
  Languages,
  Moon,
  Bell,
  Lock,
  Trash2,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner@2.0.3';
import { localStore } from '../utils/localStore';

export function Settings() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [settings, setSettings] = useState({
    encryption: true,
    ghostMode: false,
    healthReminders: true,
    financialAlerts: true,
    schemeUpdates: true,
    voiceReminders: true,
  });
  const [showHelperDialog, setShowHelperDialog] = useState(false);
  const [helpers, setHelpers] = useState<Array<{ name: string; relation: string; access: string }>>([]);
  const [newHelper, setNewHelper] = useState({ name: '', relation: '', access: 'view' });

  const handleExportData = (format: 'pdf' | 'json') => {
    const memories = localStore.getMemories();
    const documents = localStore.getDocuments();
    const health = localStore.getHealthRecords();
    const finance = localStore.getFinanceRecords();
    const crisis = localStore.getCrisisInfo();

    const data = { memories, documents, health, finance, crisis };
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smritiai-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      toast.success('Data exported as JSON');
    } else {
      toast.success('Preparing PDF export...');
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      toast.success('All data cleared');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you absolutely sure? This will delete everything permanently.')) {
      localStorage.clear();
      toast.error('Account deleted');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const addHelper = () => {
    if (!newHelper.name || !newHelper.relation) {
      toast.error('Please fill in all fields');
      return;
    }
    setHelpers([...helpers, newHelper]);
    setNewHelper({ name: '', relation: '', access: 'view' });
    setShowHelperDialog(false);
    toast.success('Trusted helper added');
  };

  const removeHelper = (index: number) => {
    setHelpers(helpers.filter((_, i) => i !== index));
    toast.success('Helper removed');
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
    toast.success(`${key} ${!settings[key] ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-[#b8b8c8]">Manage your privacy, security, and preferences</p>
      </div>

      {/* Profile */}
      <GlassCard className="p-6" neonColor="cyan">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-6 h-6 text-[#00d9ff]" />
          <h2 className="text-xl font-bold text-white">Profile</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-white">Name</Label>
            <p className="text-[#b8b8c8] mt-1">Demo User</p>
          </div>

          <div>
            <Label className="text-white">User ID</Label>
            <p className="text-[#b8b8c8] mt-1 font-mono text-sm">demo_user_001</p>
          </div>

          <Button variant="outline" className="border-[#00d9ff] text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]">
            Edit Profile
          </Button>
        </div>
      </GlassCard>

      {/* Privacy & Security */}
      <GlassCard className="p-6" neonColor="purple">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-[#a855f7]" />
          <h2 className="text-xl font-bold text-white">Privacy & Security</h2>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/30 flex items-center justify-between">
          <div>
             <h3 className="text-white font-bold mb-1">Security & Ethics Center</h3>
             <p className="text-xs text-cyan-200/70">View firewall status, malware logs, and AI ethics guardrails.</p>
          </div>
          <Button 
            onClick={() => navigate('/security')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold"
          >
             Open Center
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-[rgba(168,85,247,0.05)] border border-[rgba(168,85,247,0.2)]">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#a855f7]" />
              <div>
                <p className="text-white font-medium">Local Encryption</p>
                <p className="text-[#b8b8c8] text-sm">All data encrypted on device</p>
              </div>
            </div>
            <Switch defaultChecked={settings.encryption} onChange={() => toggleSetting('encryption')} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-[rgba(168,85,247,0.05)] border border-[rgba(168,85,247,0.2)]">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-[#a855f7]" />
              <div>
                <p className="text-white font-medium">Ghost Mode (Legacy)</p>
                <p className="text-[#b8b8c8] text-sm">Sensitive data auto-erasure after death</p>
              </div>
            </div>
            <Switch defaultChecked={settings.ghostMode} onChange={() => toggleSetting('ghostMode')} />
          </div>

          <div className="p-4 rounded-lg bg-[rgba(0,217,255,0.05)] border border-[rgba(0,217,255,0.2)]">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#00d9ff]" />
              <p className="text-white font-medium text-sm">Offline-First Architecture</p>
            </div>
            <p className="text-[#b8b8c8] text-sm">
              Your data is stored locally and works without internet. We do not use cloud storage, ensuring your privacy.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Trusted Helpers */}
      <GlassCard className="p-6" neonColor="pink">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-[#ff006e]" />
          <h2 className="text-xl font-bold text-white">Trusted Helpers</h2>
        </div>

        <p className="text-[#b8b8c8] mb-4">
          Give limited access to NGOs, ASHAs, or family members with full audit trails
        </p>

        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-[rgba(255,0,110,0.05)] border border-[rgba(255,0,110,0.2)]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-medium">No trusted helpers added</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-[#ff006e] text-[#ff006e] hover:bg-[rgba(255,0,110,0.1)]"
            onClick={() => setShowHelperDialog(true)}
          >
            Add Trusted Helper
          </Button>
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard className="p-6" neonColor="cyan">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-[#00d9ff]" />
          <h2 className="text-xl font-bold text-white">Notifications</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-white">Health Reminders</Label>
            <Switch defaultChecked={settings.healthReminders} onChange={() => toggleSetting('healthReminders')} />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-white">Financial Alerts</Label>
            <Switch defaultChecked={settings.financialAlerts} onChange={() => toggleSetting('financialAlerts')} />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-white">Government Scheme Updates</Label>
            <Switch defaultChecked={settings.schemeUpdates} onChange={() => toggleSetting('schemeUpdates')} />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-white">Voice Reminders</Label>
            <Switch defaultChecked={settings.voiceReminders} onChange={() => toggleSetting('voiceReminders')} />
          </div>
        </div>
      </GlassCard>

      {/* Language */}
      <GlassCard className="p-6" neonColor="purple">
        <div className="flex items-center gap-3 mb-4">
          <Languages className="w-6 h-6 text-[#a855f7]" />
          <h2 className="text-xl font-bold text-white">Language Preferences</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { code: 'en', name: 'English', flag: '🇬🇧' },
            { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
            { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
            { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
            { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
            { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
          ].map((lang) => (
            <button
              key={lang.code}
              className="p-3 rounded-lg bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.2)] hover:border-[#a855f7] transition-all"
              onClick={() => setSelectedLanguage(lang.code)}
            >
              <div className="text-2xl mb-1">{lang.flag}</div>
              <div className="text-sm text-white">{lang.name}</div>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Data Management */}
      <GlassCard className="p-6" neonColor="green">
        <div className="flex items-center gap-3 mb-4">
          <Download className="w-6 h-6 text-[#00ff88]" />
          <h2 className="text-xl font-bold text-white">Data Management</h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.2)]">
            <p className="text-white font-medium mb-2">Export Your Data</p>
            <p className="text-[#b8b8c8] text-sm mb-3">
              Download all your memories, documents, and health records
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleExportData('pdf')}
                size="sm"
                className="bg-[#00ff88] text-[#0a0a0f] hover:bg-[#00dd77]"
              >
                Export as PDF
              </Button>
              <Button
                onClick={() => handleExportData('json')}
                size="sm"
                variant="outline"
                className="border-[#00ff88] text-[#00ff88] hover:bg-[rgba(0,255,136,0.1)]"
              >
                Export as JSON
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[rgba(0,217,255,0.05)] border border-[rgba(0,217,255,0.2)]">
            <p className="text-white font-medium mb-2">User-Owned Data Model</p>
            <p className="text-[#b8b8c8] text-sm">
              ✓ No ads • ✓ No data selling • ✓ You own your data
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Danger Zone */}
      <GlassCard className="p-6" neonColor="pink">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="w-6 h-6 text-[#ff006e]" />
          <h2 className="text-xl font-bold text-white">Danger Zone</h2>
        </div>

        <div className="p-4 rounded-lg bg-[rgba(255,0,110,0.05)] border border-[rgba(255,0,110,0.2)]">
          <p className="text-white font-medium mb-2">Delete Account</p>
          <p className="text-[#b8b8c8] text-sm mb-3">
            This will permanently delete all your data. This action cannot be undone.
          </p>
          <Button
            onClick={handleDeleteAccount}
            variant="outline"
            className="border-[#ff006e] text-[#ff006e] hover:bg-[rgba(255,0,110,0.1)]"
          >
            Delete My Account
          </Button>
        </div>
        
        <div className="p-4 rounded-lg bg-[rgba(255,165,0,0.05)] border border-[rgba(255,165,0,0.2)] mt-4">
          <p className="text-white font-medium mb-2">Reset Demo Data</p>
          <p className="text-[#b8b8c8] text-sm mb-3">
            Clear current legacy records and reload with the new expanded dataset.
          </p>
          <Button
            onClick={() => {
              if (confirm('Reset Legacy & Legal data to defaults?')) {
                localStorage.removeItem('smritiai_afterme');
                localStorage.removeItem('smritiai_legal');
                window.location.reload();
              }
            }}
            variant="outline"
            className="border-[#ffa500] text-[#ffa500] hover:bg-[rgba(255,165,0,0.1)]"
          >
             Reset Legacy Data
          </Button>
        </div>
      </GlassCard>

      {/* About */}
      <GlassCard className="p-6" neonColor="cyan">
        <div className="text-center space-y-3">
          <h3 className="text-xl font-bold text-white">🧠❤️ SmritiAI</h3>
          <p className="text-[#b8b8c8]">A Second Brain for People Who Can't Afford to Forget</p>
          <p className="text-[#b8b8c8] text-sm">Version 1.0.0</p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button variant="ghost" size="sm" className="text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]">
              Privacy Policy
            </Button>
            <Button variant="ghost" size="sm" className="text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]">
              Terms of Service
            </Button>
            <Button variant="ghost" size="sm" className="text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]">
              About
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Add Helper Dialog */}
      <Dialog open={showHelperDialog} onOpenChange={setShowHelperDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Trusted Helper</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Name"
              value={newHelper.name}
              onChange={(e) => setNewHelper({ ...newHelper, name: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Relation"
              value={newHelper.relation}
              onChange={(e) => setNewHelper({ ...newHelper, relation: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <Label className="text-white">Access Level</Label>
              <select
                value={newHelper.access}
                onChange={(e) => setNewHelper({ ...newHelper, access: e.target.value })}
                className="bg-[#0a0a0f] text-[#b8b8c8] border-[#00d9ff] rounded-lg px-3 py-2"
              >
                <option value="view">View</option>
                <option value="edit">Edit</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              className="border-[#ff006e] text-[#ff006e] hover:bg-[rgba(255,0,110,0.1)]"
              onClick={() => setShowHelperDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="border-[#ff006e] text-[#ff006e] hover:bg-[rgba(255,0,110,0.1)] ml-2"
              onClick={addHelper}
            >
              Add Helper
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}