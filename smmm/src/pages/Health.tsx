import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Heart, Activity, Pill, Calendar, Plus, 
  Search, Shield, Phone, FileText, QrCode,
  ArrowRight, Sparkles, AlertCircle, Clock, User, MapPin,
  Download, Edit, Trash2, Users, Eye, X, ChevronRight, Hospital,
  Stethoscope, Building2, Navigation, UserPlus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { localStore, HealthRecord, PersonProfile } from '../utils/localStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
// Import QR Code component
import { QRCodeSVG } from 'qrcode.react';

export function Health() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [people, setPeople] = useState<PersonProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'prescription' | 'report' | 'appointment'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [showMedicalFacilities, setShowMedicalFacilities] = useState(false);
  const [showHelplines, setShowHelplines] = useState(false);

  // User profile data for QR code
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    age: 32,
    bloodGroup: 'O+',
    allergies: ['Penicillin'],
    emergencyContacts: [
      { name: 'Suresh Kumar', phone: '+91-9876543210', relation: 'Father' }
    ],
    medications: [
      { name: 'Telma 40', dosage: '40mg', frequency: 'Once daily (morning)', for: 'Hypertension' }
    ],
    medicalConditions: ['Hypertension'],
    organDonor: true,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  });

  // Sample health records data
  const [healthRecords] = useState([
    {
      id: '1',
      type: 'report',
      title: 'Full Body Blood Test',
      description: 'Annual wellness checkup',
      date: '2026-01-05',
      doctor: 'Diagnostic Center',
      hospital: 'Medical Provider',
      isEmergency: false
    },
    {
      id: '2',
      type: 'prescription',
      title: 'BP Medication - Telma 40',
      description: 'Prescribed by Dr. Mehta for Hypertension',
      date: '2026-01-15',
      doctor: 'Dr. Mehta',
      hospital: 'Medical Provider',
      medications: [
        { name: 'Telma 40', dosage: '40mg', frequency: 'Once daily (morning)' }
      ],
      isEmergency: true
    }
  ]);

  // Family members data
  const [familyMembers] = useState([
    {
      id: '1',
      name: 'Suresh Kumar',
      relation: 'Son',
      conditions: [],
      lastCheckup: '2025-12-15'
    },
    {
      id: '2',
      name: 'Savitri Devi',
      relation: 'Spouse',
      conditions: ['Asthma, uses inhaler regularly'],
      lastCheckup: '2025-11-20'
    }
  ]);

  // Medical facilities data
  const [medicalFacilities] = useState([
    { name: 'City General Hospital', distance: '2.5 km', type: 'Emergency', phone: '+91-11-2345-6789' },
    { name: 'Apollo Clinic', distance: '1.8 km', type: 'General', phone: '+91-11-2345-6790' },
    { name: 'Max Healthcare', distance: '3.2 km', type: 'Specialty', phone: '+91-11-2345-6791' }
  ]);

  // Emergency helplines data
  const [emergencyHelplines] = useState([
    { name: 'Ambulance', number: '108', type: 'Emergency' },
    { name: 'Police', number: '100', type: 'Emergency' },
    { name: 'Fire Brigade', number: '101', type: 'Emergency' },
    { name: 'Women Helpline', number: '1091', type: 'Support' },
    { name: 'Child Helpline', number: '1098', type: 'Support' }
  ]);

  useEffect(() => {
    loadData();
    // Load user profile from local storage if available
    const savedProfile = localStorage.getItem('userMedicalProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  const loadData = () => {
    setRecords(localStore.getHealthRecords());
    setPeople(localStore.getPeople());
  };

  // Function to generate QR code data
  const generateQRData = () => {
    // Create a structured object for QR code
    const qrData = {
      type: 'MEDICAL_EMERGENCY_CARD',
      version: '1.0',
      timestamp: new Date().toISOString(),
      patient: {
        name: userProfile.name,
        age: userProfile.age,
        bloodGroup: userProfile.bloodGroup,
        allergies: userProfile.allergies,
        medicalConditions: userProfile.medicalConditions,
        organDonor: userProfile.organDonor
      },
      currentMedications: userProfile.medications.map(med => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        purpose: med.for
      })),
      emergencyContacts: userProfile.emergencyContacts.map(contact => ({
        name: contact.name,
        phone: contact.phone,
        relation: contact.relation
      })),
      metadata: {
        createdAt: userProfile.createdAt,
        lastUpdated: userProfile.lastUpdated,
        source: 'HealthTrack Pro App'
      }
    };

    // Return as JSON string
    return JSON.stringify(qrData, null, 2);
  };

  // Function to download QR code as PNG
  const downloadQRCode = () => {
    const svg = document.getElementById('sos-qr-code') as SVGElement | null;
    if (svg) {
      // Convert SVG to PNG
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = 256;
      canvas.height = 256;
      
      img.onload = () => {
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          
          const pngUrl = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = `SOS_QR_${userProfile.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          toast.success('QR Code downloaded successfully');
        }
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  // Function to download PDF card
  const downloadPDFCard = () => {
    toast.info('PDF download feature coming soon');
    // You can implement PDF generation using libraries like jsPDF
  };

  // Function to edit user profile
  const editUserProfile = () => {
    // Create a dialog for editing user profile
    const newName = prompt('Enter your name:', userProfile.name);
    if (newName) {
      const newAge = prompt('Enter your age:', userProfile.age.toString());
      const newBloodGroup = prompt('Enter your blood group:', userProfile.bloodGroup);
      
      const newAllergies = prompt('Enter your allergies (comma-separated):', 
        userProfile.allergies.join(', '));
      
      if (newAge && newBloodGroup) {
        const updatedProfile = {
          ...userProfile,
          name: newName,
          age: parseInt(newAge),
          bloodGroup: newBloodGroup,
          allergies: newAllergies ? newAllergies.split(',').map(a => a.trim()) : userProfile.allergies,
          lastUpdated: new Date().toISOString()
        };
        
        setUserProfile(updatedProfile);
        localStorage.setItem('userMedicalProfile', JSON.stringify(updatedProfile));
        toast.success('Profile updated successfully');
      }
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white mb-2 italic tracking-tighter uppercase">
            HEALTH <span className="text-[#ff006e] not-italic">RECORDS</span>
          </h1>
          <p className="text-[#b8b8c8] font-medium flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-[#ff006e]" />
            Your medical history, fully private and offline-first.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="rounded-full bg-[#ff006e] text-white hover:bg-[#ff1a7f] font-black px-8 shadow-[0_0_20px_rgba(255,0,110,0.3)] transition-all h-12"
          >
            <Plus className="w-5 h-5 mr-2" />
            NEW RECORD
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-400 font-bold mb-1">Informational Only · Not Medical Advice</p>
          <p className="text-xs text-white/60 leading-relaxed">
            This health tracking tool is for personal record-keeping. It does not replace professional medical consultation, diagnosis, or treatment. Always consult qualified healthcare providers for medical decisions.
          </p>
        </div>
      </div>

      {/* Emergency Quick Access - Compact Size */}
      <GlassCard className="p-1 border-[#ff006e]/30 overflow-hidden" neonColor="pink">
        <div className="p-4 bg-gradient-to-r from-[#ff006e]/10 to-transparent">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Smaller QR Code Icon */}
            <div className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] shrink-0">
              <QrCode className="w-full h-full text-black" />
            </div>
            
            {/* Compact SOS Profile Information */}
            <div className="flex-1 text-center lg:text-left space-y-3">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Active SOS Profile</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={editUserProfile}
                  className="text-[#ff006e] border-[#ff006e]/30 text-xs h-6 px-2"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  EDIT
                </Button>
              </div>
              
              {/* Compact Data in Single Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {/* Personal Info */}
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <p className="text-[10px] text-white/40 uppercase font-black mb-1">Personal</p>
                  <p className="text-xs font-bold text-white">{userProfile.name}</p>
                  <p className="text-xs text-white/60">{userProfile.age}y, {userProfile.bloodGroup}</p>
                </div>

                {/* Allergies */}
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <p className="text-[10px] text-white/40 uppercase font-black mb-1">Allergies</p>
                  <p className="text-xs font-bold text-red-300">{userProfile.allergies.join(', ')}</p>
                </div>

                {/* Medication */}
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <p className="text-[10px] text-white/40 uppercase font-black mb-1">Medication</p>
                  <p className="text-xs font-bold text-white">{userProfile.medications[0]?.name}</p>
                  <p className="text-[10px] text-[#87ceeb]">{userProfile.medications[0]?.dosage}</p>
                </div>

                {/* Emergency Contact */}
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <p className="text-[10px] text-white/40 uppercase font-black mb-1">Emergency</p>
                  <p className="text-xs font-bold text-white">{userProfile.emergencyContacts[0]?.name}</p>
                  <Button 
                    size="sm" 
                    className="bg-green-500/20 border border-green-500/30 text-green-300 font-black text-[10px] h-5 px-2 mt-1"
                    onClick={() => window.location.href = `tel:${userProfile.emergencyContacts[0]?.phone}`}
                  >
                    <Phone className="w-2 h-2 mr-1" />
                    CALL
                  </Button>
                </div>
              </div>
              
              <p className="text-[#b8b8c8] leading-relaxed text-xs text-center lg:text-left">
                Emergency medical info ready for first responders. Keep updated.
              </p>
            </div>
            
            {/* Smaller View Button */}
            <div className="shrink-0">
              <Button 
                variant="outline" 
                className="border-[#ff006e] text-[#ff006e] hover:bg-[#ff006e]/10 px-4 h-10 rounded-xl font-black uppercase tracking-wide transition-all text-xs"
                onClick={() => setShowQRCode(true)}
              >
                VIEW SOS
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Health Records Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Tabs */}
        <div className="lg:col-span-1">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Filter Records</h3>
            <div className="space-y-2">
              {[
                { key: 'all', label: 'All Records', icon: FileText },
                { key: 'prescription', label: 'Prescriptions', icon: Pill },
                { key: 'report', label: 'Reports', icon: Activity },
                { key: 'appointment', label: 'Appointments', icon: Calendar }
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={activeTab === key ? "default" : "ghost"}
                  className={`w-full justify-start h-12 ${
                    activeTab === key 
                      ? 'bg-[#ff006e] text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setActiveTab(key as any)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Records List */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search records, doctors, medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff006e]/50"
            />
          </div>

          {/* Records Grid */}
          <div className="space-y-4">
            {healthRecords.map((record) => (
              <div key={record.id}>
                <GlassCard className="p-6 border-white/10" neonColor="cyan">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${
                        record.type === 'prescription' ? 'bg-[#ff006e]/20' : 'bg-blue-500/20'
                      }`}>
                        {record.type === 'prescription' ? (
                          <Pill className={`w-5 h-5 ${
                            record.type === 'prescription' ? 'text-[#ff006e]' : 'text-blue-400'
                          }`} />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white">{record.title}</h3>
                        <p className="text-sm text-white/60">{record.type}</p>
                      </div>
                      {record.isEmergency && (
                        <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-black uppercase">
                          CRITICAL
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-white/40 uppercase font-black mb-1">Medical Provider</p>
                        <p className="text-sm font-bold text-white">{record.hospital}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 uppercase font-black mb-1">{record.type === 'prescription' ? 'Doctor' : 'Facility'}</p>
                        <p className="text-sm font-bold text-white">{record.doctor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 uppercase font-black mb-1">Record Date</p>
                        <p className="text-sm font-bold text-white">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <p className="text-white/70 mb-4">"{record.description}"</p>

                    {record.medications && record.medications.length > 0 && (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-white/40 uppercase font-black mb-2">Medication Schedule</p>
                        {record.medications.map((med, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>
                              <p className="font-bold text-white">{med.name}</p>
                              <p className="text-sm text-[#87ceeb]">{med.dosage} • {med.frequency}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-[#ff006e] border-[#ff006e]/30 font-black"
                  >
                    EXPAND DETAILS
                  </Button>
                </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Family Health Hub */}
      <GlassCard className="p-6 border-white/10" neonColor="green">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tight mb-2">
              FAMILY <span className="text-green-400 not-italic">HEALTH HUB</span>
            </h2>
            <p className="text-white/60">
              Centralized medical management for your household. Securely link records of dependents and share emergency profiles with trusted guardians.
            </p>
          </div>
          <Button 
            onClick={() => setShowManageMembers(true)}
            className="bg-green-500/20 border border-green-500/30 text-green-300 font-black px-6 h-12 rounded-xl"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            MANAGE MEMBERS
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {familyMembers.map((member) => (
            <div key={member.id} className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-black text-white">{member.name}</h3>
                  <p className="text-sm text-white/60">{member.relation}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="text-green-400 font-black"
                >
                  View Timeline →
                </Button>
              </div>
              
              {member.conditions.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-white/40 uppercase font-black mb-1">Vitals Info</p>
                  <p className="text-sm text-white/70">"{member.conditions[0]}"</p>
                </div>
              )}
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40">Last Checkup:</span>
                <span className="text-white font-bold">{new Date(member.lastCheckup).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Medical Facilities & Emergency Helplines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nearby Medical Facilities */}
        <GlassCard className="p-6 border-white/10" neonColor="cyan">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">
                Nearby <span className="text-blue-400 not-italic">Medical Facilities</span>
              </h3>
            </div>
            <Button 
              onClick={() => setShowMedicalFacilities(true)}
              variant="ghost"
              size="sm"
              className="text-blue-400 font-black"
            >
              <MapPin className="w-4 h-4 mr-2" />
              VIEW ALL
            </Button>
          </div>

          <div className="space-y-3">
            {medicalFacilities.slice(0, 3).map((facility, index) => (
              <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Hospital className="w-4 h-4 text-blue-400" />
                      <h4 className="font-black text-white">{facility.name}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white/60">{facility.distance}</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
                        {facility.type}
                      </span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-blue-500/20 border border-blue-500/30 text-blue-300 font-black"
                    onClick={() => window.location.href = `tel:${facility.phone}`}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    CALL
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Emergency Helpline List */}
        <GlassCard className="p-6 border-white/10" neonColor="pink">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">
                Emergency <span className="text-red-400 not-italic">Helpline List</span>
              </h3>
            </div>
            <Button 
              onClick={() => setShowHelplines(true)}
              variant="ghost"
              size="sm"
              className="text-red-400 font-black"
            >
              <Phone className="w-4 h-4 mr-2" />
              VIEW ALL
            </Button>
          </div>

          <div className="space-y-3">
            {emergencyHelplines.slice(0, 5).map((helpline, index) => (
              <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-black text-white">{helpline.name}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold">
                      {helpline.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-red-400">{helpline.number}</span>
                    <Button 
                      size="sm" 
                      className="bg-red-500/20 border border-red-500/30 text-red-300 font-black"
                      onClick={() => window.location.href = `tel:${helpline.number}`}
                    >
                      <Phone className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Emergency SOS Identity Modal - Reorganized with Equal Layout */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="bg-[#0a0a0f] border-[#ff006e] text-white max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-white italic uppercase tracking-tighter text-center">
              Emergency <span className="text-[#ff006e] not-italic">SOS Identity</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6 space-y-8">
            {/* QR Code Section - Centered */}
            <div className="flex justify-center">
              <div className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)] max-w-md">
                <div className="mb-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Heart className="w-6 h-6 text-[#ff006e]" />
                    <span className="text-xl font-black text-black">MEDICAL EMERGENCY CARD</span>
                  </div>
                  <p className="text-sm text-gray-600">Scan this QR code in case of emergency</p>
                </div>
                
                <div className="bg-white p-4 rounded-2xl shadow-lg">
                  <QRCodeSVG 
                    id="sos-qr-code"
                    value={generateQRData()}
                    size={256}
                    level="H"
                    includeMargin={true}
                    fgColor="#000000"
                    bgColor="#ffffff"
                  />
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                    Last updated: {new Date(userProfile.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 max-w-md mx-auto">
              <Button 
                onClick={downloadQRCode}
                className="flex-1 bg-[#ff006e] text-white font-black h-12 rounded-xl shadow-[0_0_20px_rgba(255,0,110,0.3)]"
              >
                <Download className="w-5 h-5 mr-3" />
                DOWNLOAD QR CODE
              </Button>
              <Button 
                onClick={downloadPDFCard}
                className="flex-1 bg-white/10 border border-white/20 text-white font-black h-12 rounded-xl"
              >
                <FileText className="w-5 h-5 mr-3" />
                PDF CARD
              </Button>
            </div>
            
            {/* Medical Information Grid - Equal 2x2 Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Personal Information */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#ff006e]/10 to-transparent border border-[#ff006e]/30 h-fit">
                <h3 className="text-xl font-black text-white uppercase mb-6 tracking-tight flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 text-center">
                      <p className="text-xs text-white/40 uppercase font-black mb-2">Full Name</p>
                      <p className="text-lg font-bold text-white">{userProfile.name}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 text-center">
                      <p className="text-xs text-white/40 uppercase font-black mb-2">Age</p>
                      <p className="text-lg font-bold text-white">{userProfile.age} years</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 text-center">
                      <p className="text-xs text-white/40 uppercase font-black mb-2">Blood Group</p>
                      <p className="text-3xl font-black text-[#ff006e]">{userProfile.bloodGroup}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 text-center">
                      <p className="text-xs text-white/40 uppercase font-black mb-2">Organ Donor</p>
                      <p className={`text-xl font-black ${userProfile.organDonor ? 'text-green-400' : 'text-red-400'}`}>
                        {userProfile.organDonor ? 'YES' : 'NO'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Allergies & Reactions */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/30 h-fit">
                <h3 className="text-xl font-black text-white uppercase mb-6 tracking-tight flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Allergies & Reactions
                </h3>
                
                <div className="space-y-3">
                  {userProfile.allergies.map((allergy, index) => (
                    <div key={index} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                      <span className="font-black text-red-300 uppercase text-lg">{allergy}</span>
                      <span className="px-3 py-1.5 rounded-full bg-red-500/30 text-red-200 text-sm font-black">
                        AVOID
                      </span>
                    </div>
                  ))}
                  
                  {/* Fill empty space if only one allergy */}
                  {userProfile.allergies.length === 1 && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center opacity-50">
                      <span className="text-white/40 text-sm">No additional allergies recorded</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Current Medications */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/30 h-fit">
                <h3 className="text-xl font-black text-white uppercase mb-6 tracking-tight flex items-center gap-2">
                  <Pill className="w-5 h-5 text-[#87ceeb]" />
                  Current Medications
                </h3>
                
                <div className="space-y-4">
                  {userProfile.medications.map((med, index) => (
                    <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20">
                      <div className="text-center mb-3">
                        <p className="font-black text-white text-xl">{med.name}</p>
                        <p className="text-sm text-white/60">For: {med.for}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 rounded-lg bg-white/5">
                          <p className="text-xs text-white/40 uppercase font-black">Dosage</p>
                          <p className="text-lg font-black text-[#87ceeb]">{med.dosage}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white/5">
                          <p className="text-xs text-white/40 uppercase font-black">Frequency</p>
                          <p className="text-sm font-bold text-white">{med.frequency}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Emergency Contacts */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/30 h-fit">
                <h3 className="text-xl font-black text-white uppercase mb-6 tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  Emergency Contacts
                </h3>
                
                <div className="space-y-4">
                  {userProfile.emergencyContacts.map((contact, index) => (
                    <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20">
                      <div className="text-center mb-3">
                        <p className="font-black text-white text-xl">{contact.name}</p>
                        <p className="text-sm text-white/60 capitalize">{contact.relation}</p>
                      </div>
                      
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <Phone className="w-4 h-4 text-green-400" />
                        <p className="text-lg font-bold text-white">{contact.phone}</p>
                      </div>
                      
                      <Button 
                        className="w-full bg-green-500/20 border border-green-500/30 text-green-300 font-black h-12"
                        onClick={() => window.location.href = `tel:${contact.phone}`}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        CALL NOW
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Important Notice - Full Width */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-blue-400 shrink-0 mt-1" />
                <div className="text-center flex-1">
                  <h4 className="font-black text-white uppercase tracking-tight mb-3 text-xl">Important Notice</h4>
                  <p className="text-white/70 leading-relaxed max-w-4xl mx-auto">
                    This QR code contains your critical medical information for emergency situations. 
                    In case of emergency, first responders can scan this code to access your medical history, 
                    allergies, medications, and emergency contacts. Keep this code easily accessible 
                    (phone lock screen, wallet card, or printed copy).
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowQRCode(false)}
              className="w-full h-14 border-white/10 font-black text-lg"
            >
              CLOSE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Members Modal */}
      <Dialog open={showManageMembers} onOpenChange={setShowManageMembers}>
        <DialogContent className="bg-[#0a0a0f] border-green-500 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">
              Family <span className="text-green-400 not-italic">Health Management</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <p className="text-white/60">Manage family member health profiles and emergency access.</p>
            <div className="space-y-3">
              {familyMembers.map((member) => (
                <div key={member.id} className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-white">{member.name}</h4>
                      <p className="text-sm text-white/60">{member.relation}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-green-400">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-blue-400">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full bg-green-500/20 border border-green-500/30 text-green-300 font-black h-12">
              <Plus className="w-5 h-5 mr-2" />
              ADD FAMILY MEMBER
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Medical Facilities Modal */}
      <Dialog open={showMedicalFacilities} onOpenChange={setShowMedicalFacilities}>
        <DialogContent className="bg-[#0a0a0f] border-blue-500 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">
              Nearby <span className="text-blue-400 not-italic">Medical Facilities</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            {medicalFacilities.map((facility, index) => (
              <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Hospital className="w-5 h-5 text-blue-400" />
                      <h4 className="font-black text-white">{facility.name}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-2">
                      <span className="text-white/60 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {facility.distance}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
                        {facility.type}
                      </span>
                    </div>
                    <p className="text-sm text-white/60">{facility.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-blue-500/20 border border-blue-500/30 text-blue-300 font-black"
                      onClick={() => window.location.href = `tel:${facility.phone}`}
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      CALL
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-blue-400"
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      NAVIGATE
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Emergency Helplines Modal */}
      <Dialog open={showHelplines} onOpenChange={setShowHelplines}>
        <DialogContent className="bg-[#0a0a0f] border-red-500 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">
              Emergency <span className="text-red-400 not-italic">Helplines</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            {emergencyHelplines.map((helpline, index) => (
              <div key={index} className="p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-black text-white">{helpline.name}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold">
                      {helpline.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-red-400">{helpline.number}</span>
                    <Button 
                      size="sm" 
                      className="bg-red-500/20 border border-red-500/30 text-red-300 font-black"
                      onClick={() => window.location.href = `tel:${helpline.number}`}
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      CALL
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}