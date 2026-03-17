import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  HardDrive, Download, Upload, Smartphone, FolderSync, Check,
  AlertCircle, Clock, Database
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { localStore, BackupRecord } from '../utils/localStore';

export function Backup() {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [stats, setStats] = useState({
    vault: 0,
    memories: 0,
    health: 0,
    money: 0,
    people: 0,
    legal: 0,
    lifeRecords: 0,
    afterMe: 0,
  });

  useEffect(() => {
    loadBackups();
    loadStats();
  }, []);

  const loadBackups = () => {
    const allBackups = localStore.getBackupRecords();
    setBackups(allBackups);
  };

  const loadStats = () => {
    setStats({
      vault: localStore.getVaultItems().length,
      memories: localStore.getMemories().length,
      health: localStore.getHealthRecords().length,
      money: localStore.getMoneyRecords().length,
      people: localStore.getPeople().length,
      legal: localStore.getLegalRecords().length,
      lifeRecords: localStore.getLifeRecords().length,
      afterMe: localStore.getAfterMeRecords().length,
    });
  };

  const createBackup = async (location: 'local' | 'sd_card' | 'export') => {
    setIsBackingUp(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const total = Object.values(stats).reduce((sum, val) => sum + val, 0);
      
      localStore.addBackupRecord({
        userId: 'demo_user',
        backupDate: new Date().toISOString(),
        backupLocation: location,
        itemsCount: total,
        size: `${(total * 0.05).toFixed(1)} MB`,
      });

      if (location === 'export') {
        const data = localStore.exportAllData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SmritiAI_Backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
      }

      loadBackups();
      toast.success('Backup created successfully');
    } catch (error) {
      toast.error('Backup failed');
    } finally {
      setIsBackingUp(false);
    }
  };

  const totalItems = Object.values(stats).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Backup & Transfer</h1>
        <p className="text-[#b8b8c8]">Never lose your data - Backup & restore anytime</p>
      </div>

      {/* Stats Overview */}
      <GlassCard className="p-6" neonColor="cyan">
        <h3 className="text-lg font-semibold text-white mb-4">Data Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-[#87ceeb]">{totalItems}</p>
            <p className="text-sm text-[#b8b8c8] mt-1">Total Items</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#a855f7]">{stats.vault}</p>
            <p className="text-sm text-[#b8b8c8] mt-1">Vault</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#ff006e]">{stats.memories}</p>
            <p className="text-sm text-[#b8b8c8] mt-1">Memories</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#00ff88]">{stats.health}</p>
            <p className="text-sm text-[#b8b8c8] mt-1">Health</p>
          </div>
        </div>
      </GlassCard>

      {/* Backup Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-6" neonColor="purple">
          <HardDrive className="w-12 h-12 text-[#a855f7] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2 text-center">Local Backup</h3>
          <p className="text-sm text-[#b8b8c8] text-center mb-4">
            Save to device storage
          </p>
          <Button
            onClick={() => createBackup('local')}
            disabled={isBackingUp}
            className="w-full bg-[#a855f7] text-white hover:bg-[#b066ff]"
          >
            {isBackingUp ? 'Backing up...' : 'Create Local Backup'}
          </Button>
        </GlassCard>

        <GlassCard className="p-6" neonColor="green">
          <Database className="w-12 h-12 text-[#00ff88] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2 text-center">SD Card Backup</h3>
          <p className="text-sm text-[#b8b8c8] text-center mb-4">
            Save to external SD card
          </p>
          <Button
            onClick={() => createBackup('sd_card')}
            disabled={isBackingUp}
            className="w-full bg-[#00ff88] text-[#0a1628] hover:bg-[#00ff99] font-semibold"
          >
            {isBackingUp ? 'Backing up...' : 'Backup to SD Card'}
          </Button>
        </GlassCard>

        <GlassCard className="p-6" neonColor="cyan">
          <Download className="w-12 h-12 text-[#87ceeb] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2 text-center">Export Data</h3>
          <p className="text-sm text-[#b8b8c8] text-center mb-4">
            Download as JSON file
          </p>
          <Button
            onClick={() => createBackup('export')}
            disabled={isBackingUp}
            className="w-full bg-[#87ceeb] text-[#0a1628] hover:bg-[#a0d8f5] font-semibold"
          >
            {isBackingUp ? 'Exporting...' : 'Export All Data'}
          </Button>
        </GlassCard>
      </div>

      {/* Phone to Phone Transfer */}
      <GlassCard className="p-6" neonColor="pink">
        <div className="flex items-center gap-4 mb-4">
          <Smartphone className="w-8 h-8 text-[#ff006e]" />
          <div>
            <h3 className="text-lg font-semibold text-white">Phone-to-Phone Transfer</h3>
            <p className="text-sm text-[#b8b8c8]">Transfer all data to a new device</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="border-[#ff006e] text-[#ff006e] hover:bg-[rgba(255,0,110,0.1)]"
          >
            <Upload className="w-4 h-4 mr-2" />
            Send to New Phone
          </Button>
          <Button
            variant="outline"
            className="border-[#87ceeb] text-[#87ceeb] hover:bg-[rgba(135,206,235,0.1)]"
          >
            <Download className="w-4 h-4 mr-2" />
            Receive from Old Phone
          </Button>
        </div>
      </GlassCard>

      {/* Backup History */}
      <GlassCard className="p-6" neonColor="purple">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-[#a855f7]" />
          <h3 className="text-lg font-semibold text-white">Backup History</h3>
        </div>
        <div className="space-y-3">
          {backups.length === 0 ? (
            <p className="text-center text-[#b8b8c8] py-4">No backups yet</p>
          ) : (
            backups.slice(0, 5).map((backup) => (
              <div
                key={backup.id}
                className="p-4 rounded-lg bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.3)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Check className="w-4 h-4 text-[#00ff88]" />
                      <p className="text-white font-medium">
                        {backup.backupLocation === 'local' ? 'Local Backup' :
                         backup.backupLocation === 'sd_card' ? 'SD Card Backup' :
                         'Exported Data'}
                      </p>
                    </div>
                    <p className="text-sm text-[#b8b8c8]">
                      {new Date(backup.backupDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{backup.itemsCount} items</p>
                    <p className="text-sm text-[#b8b8c8]">{backup.size}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>

      {/* Important Notice */}
      <GlassCard className="p-4" neonColor="pink">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#ff006e] mt-0.5" />
          <div>
            <p className="text-white font-medium mb-2">No Forced Cloud</p>
            <p className="text-sm text-[#b8b8c8]">
              Your data stays on your device. We never force cloud storage. Backup to SD card or local storage anytime.
              You have full control over your data.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
