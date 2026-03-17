import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import {
  AlertTriangle,
  Phone,
  Heart,
  MapPin,
  User,
  QrCode,
  Plus,
  Trash2,
  Download,
  Shield,
  Info,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner@2.0.3';
import { localStore, CrisisInfo } from '../utils/localStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

export function Crisis() {
  const [crisisInfo, setCrisisInfo] = useState<CrisisInfo[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [newInfo, setNewInfo] = useState({
    type: 'emergency_contact' as const,
    title: '',
    data: {} as any,
  });

  useEffect(() => {
    loadCrisisInfo();
  }, []);

  const loadCrisisInfo = () => {
    const info = localStore.getCrisisInfo();
    setCrisisInfo(info);
  };

  const addCrisisInfo = () => {
    if (!newInfo.title) {
      toast.error('Please enter a title');
      return;
    }

    localStore.addCrisisInfo({
      userId: 'demo_user',
      type: newInfo.type,
      title: newInfo.title,
      data: newInfo.data,
    });

    toast.success('Crisis information added');
    setShowAddDialog(false);
    setNewInfo({
      type: 'emergency_contact',
      title: '',
      data: {},
    });
    loadCrisisInfo();
  };

  const deleteCrisisInfo = (id: string) => {
    localStore.deleteCrisisInfo(id);
    toast.success('Crisis information deleted');
    loadCrisisInfo();
  };

  const emergencyContacts = crisisInfo.filter((i) => i.type === 'emergency_contact');
  const medicalInfo = crisisInfo.filter((i) => i.type === 'medical_info');
  const importantLocations = crisisInfo.filter((i) => i.type === 'important_location');

  const quickEmergencyNumbers = [
    { name: 'Police', number: '100', icon: Shield },
    { name: 'Ambulance', number: '108', icon: Heart },
    { name: 'Fire', number: '101', icon: AlertTriangle },
    { name: 'Women Helpline', number: '1091', icon: Phone },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[rgba(255,166,193,0.2)] mb-4">
          <AlertTriangle className="w-10 h-10 text-[#ffa6c1]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Crisis Mode</h1>
        <p className="text-[#b8b8c8]">Emergency information and critical contacts</p>
      </div>

      {/* Emergency Alert Banner */}
      <GlassCard className="p-6 border-2 border-[#ffa6c1]" neonColor="pink">
        <div className="flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-[#ffa6c1] animate-pulse" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Emergency Mode Active</h3>
            <p className="text-sm text-[#b8b8c8]">
              Quick access to all critical information. Keep calm and follow your plan.
            </p>
          </div>
          <Button
            onClick={() => setShowQRDialog(true)}
            className="bg-[#ffa6c1] text-[#0a1628] hover:bg-[#ffb8cc]"
            style={{ boxShadow: '0 0 20px rgba(255,166,193,0.5)' }}
          >
            <QrCode className="w-4 h-4 mr-2" />
            Emergency QR
          </Button>
        </div>
      </GlassCard>

      {/* Quick Emergency Numbers */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Emergency Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickEmergencyNumbers.map((service) => {
            const Icon = service.icon;
            return (
              <GlassCard key={service.number} className="p-6 text-center" neonColor="pink">
                <Icon className="w-8 h-8 text-[#ffa6c1] mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-1">{service.name}</h3>
                <a
                  href={`tel:${service.number}`}
                  className="text-2xl font-bold text-[#87ceeb] block mb-2"
                >
                  {service.number}
                </a>
                <Button
                  size="sm"
                  onClick={() => {
                    toast.success(`Calling ${service.name}...`);
                  }}
                  className="w-full bg-[#ffa6c1] text-[#0a1628] hover:bg-[#ffb8cc]"
                  style={{ boxShadow: '0 0 15px rgba(255,166,193,0.4)' }}
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call Now
                </Button>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Personal Emergency Contacts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Emergency Contacts</h2>
          <Button
            onClick={() => {
              setNewInfo({ type: 'emergency_contact', title: '', data: {} });
              setShowAddDialog(true);
            }}
            className="bg-[#87ceeb] text-[#0a1628] hover:bg-[#a0d8f5]"
            style={{ boxShadow: '0 0 20px rgba(135,206,235,0.4)' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map((contact) => (
            <GlassCard key={contact.id} className="p-6" neonColor="cyan">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-[rgba(135,206,235,0.1)]">
                    <User className="w-6 h-6 text-[#87ceeb]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{contact.title}</h3>
                    <div className="space-y-1 text-sm text-[#b8b8c8]">
                      {contact.data.name && <p>Name: {contact.data.name}</p>}
                      {contact.data.relation && <p>Relation: {contact.data.relation}</p>}
                      {contact.data.phone && (
                        <p>
                          <a href={`tel:${contact.data.phone}`} className="text-[#87ceeb]">
                            {contact.data.phone}
                          </a>
                        </p>
                      )}
                      {contact.data.address && <p>Address: {contact.data.address}</p>}
                    </div>
                    {contact.data.phone && (
                      <Button
                        size="sm"
                        onClick={() => toast.success(`Calling ${contact.title}...`)}
                        className="mt-3 bg-[#87ceeb] text-[#0a1628] hover:bg-[#a0d8f5]"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCrisisInfo(contact.id)}
                  className="text-[#ff6b9d] hover:bg-[rgba(255,107,157,0.1)]"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Medical Information */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Medical Information</h2>
          <Button
            onClick={() => {
              setNewInfo({ type: 'medical_info', title: '', data: {} });
              setShowAddDialog(true);
            }}
            className="bg-[#87ceeb] text-[#0a1628] hover:bg-[#a0d8f5]"
            style={{ boxShadow: '0 0 20px rgba(135,206,235,0.4)' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Info
          </Button>
        </div>
        <div className="space-y-4">
          {medicalInfo.map((info) => (
            <GlassCard key={info.id} className="p-6" neonColor="pink">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-[rgba(255,166,193,0.1)]">
                    <Heart className="w-6 h-6 text-[#ffa6c1]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-3">{info.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {info.data.bloodGroup && (
                        <div>
                          <p className="text-sm text-[#b8b8c8]">Blood Group</p>
                          <p className="text-white font-medium">{info.data.bloodGroup}</p>
                        </div>
                      )}
                      {info.data.conditions && info.data.conditions.length > 0 && (
                        <div>
                          <p className="text-sm text-[#b8b8c8] mb-1">Medical Conditions</p>
                          {info.data.conditions.map((condition: string, idx: number) => (
                            <p key={idx} className="text-white text-sm">
                              • {condition}
                            </p>
                          ))}
                        </div>
                      )}
                      {info.data.medications && info.data.medications.length > 0 && (
                        <div>
                          <p className="text-sm text-[#b8b8c8] mb-1">Current Medications</p>
                          {info.data.medications.map((med: string, idx: number) => (
                            <p key={idx} className="text-white text-sm">
                              • {med}
                            </p>
                          ))}
                        </div>
                      )}
                      {info.data.allergies && info.data.allergies.length > 0 && (
                        <div>
                          <p className="text-sm text-[#b8b8c8] mb-1">Allergies</p>
                          {info.data.allergies.map((allergy: string, idx: number) => (
                            <p key={idx} className="text-white text-sm">
                              • {allergy}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCrisisInfo(info.id)}
                  className="text-[#ff6b9d] hover:bg-[rgba(255,107,157,0.1)]"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Important Locations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Important Locations</h2>
          <Button
            onClick={() => {
              setNewInfo({ type: 'important_location', title: '', data: {} });
              setShowAddDialog(true);
            }}
            className="bg-[#87ceeb] text-[#0a1628] hover:bg-[#a0d8f5]"
            style={{ boxShadow: '0 0 20px rgba(135,206,235,0.4)' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {importantLocations.map((location) => (
            <GlassCard key={location.id} className="p-6" neonColor="purple">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-[rgba(212,165,255,0.1)]">
                    <MapPin className="w-6 h-6 text-[#d4a5ff]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{location.title}</h3>
                    <div className="space-y-1 text-sm text-[#b8b8c8]">
                      {location.data.name && <p>{location.data.name}</p>}
                      {location.data.address && <p>{location.data.address}</p>}
                      {location.data.phone && (
                        <p>
                          Phone:{' '}
                          <a href={`tel:${location.data.phone}`} className="text-[#87ceeb]">
                            {location.data.phone}
                          </a>
                        </p>
                      )}
                      {location.data.distance && <p>Distance: {location.data.distance}</p>}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => toast.info('Opening maps...')}
                      className="mt-3 bg-[#d4a5ff] text-[#0a1628] hover:bg-[#e0b8ff]"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Navigate
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCrisisInfo(location.id)}
                  className="text-[#ff6b9d] hover:bg-[rgba(255,107,157,0.1)]"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Add Info Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[rgba(15,30,50,0.95)] border border-[rgba(135,206,235,0.3)] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add Crisis Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white mb-2 block">Title</label>
              <Input
                value={newInfo.title}
                onChange={(e) => setNewInfo({ ...newInfo, title: e.target.value })}
                placeholder="e.g., Dr. Sharma - Emergency Contact"
                className="bg-[rgba(30,50,80,0.8)] border-[rgba(135,206,235,0.3)] text-white"
              />
            </div>
            <p className="text-sm text-[#b8b8c8]">
              Note: You can add detailed information after creating the entry.
            </p>
            <Button
              onClick={addCrisisInfo}
              className="w-full bg-[#87ceeb] text-[#0a1628] hover:bg-[#a0d8f5]"
              style={{ boxShadow: '0 0 20px rgba(135,206,235,0.4)' }}
            >
              Add Information
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="bg-[rgba(15,30,50,0.95)] border border-[rgba(135,206,235,0.3)] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Emergency QR Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="p-8 bg-white rounded-lg inline-block">
              <div className="w-48 h-48 bg-gradient-to-br from-[#ffa6c1] to-[#87ceeb] rounded-lg flex items-center justify-center">
                <QrCode className="w-32 h-32 text-white" />
              </div>
            </div>
            <div className="space-y-2 text-left">
              <p className="text-white font-medium">This QR code contains:</p>
              <p className="text-[#b8b8c8] text-sm">• Emergency contacts ({emergencyContacts.length})</p>
              <p className="text-[#b8b8c8] text-sm">• Medical information</p>
              <p className="text-[#b8b8c8] text-sm">• Important locations</p>
              <p className="text-[#b8b8c8] text-sm">• Blood group and allergies</p>
            </div>
            <Button
              onClick={() => toast.success('Emergency QR code saved to phone')}
              className="w-full bg-[#ffa6c1] text-[#0a1628] hover:bg-[#ffb8cc]"
              style={{ boxShadow: '0 0 20px rgba(255,166,193,0.5)' }}
            >
              <Download className="w-4 h-4 mr-2" />
              Save to Phone
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
