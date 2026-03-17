import { Heart, Pill, AlertTriangle, Download, QrCode, Activity } from 'lucide-react';

export function Healthcare() {
  const healthProfile = {
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    emergencyContact: '+91 98765 43210',
  };

  const medications = [
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      nextDose: 'Today, 8:00 PM',
      color: '#ff006e',
    },
    {
      name: 'Amlodipine',
      dosage: '5mg',
      frequency: 'Once daily',
      nextDose: 'Tomorrow, 9:00 AM',
      color: '#b45aff',
    },
  ];

  const healthAlerts = [
    {
      type: 'warning',
      title: 'Chest Pain Pattern',
      description: 'You mentioned chest pain 3 times this month. Consider scheduling a cardiac checkup.',
      priority: 'High',
    },
    {
      type: 'info',
      title: 'Medication Refill',
      description: 'Metformin prescription expires in 5 days. Schedule a refill.',
      priority: 'Medium',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Emergency Health QR */}
      <div
        className="p-6 rounded-2xl backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.1) 0%, rgba(180, 90, 255, 0.1) 100%)',
          border: '1px solid rgba(255, 0, 110, 0.3)',
          boxShadow: '0 0 40px rgba(255, 0, 110, 0.2)',
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Heart size={28} style={{ filter: 'drop-shadow(0 0 10px #ff006e)' }} />
              Emergency Health Profile
            </h2>
            <p className="text-white/80 mb-4">
              Scan this QR code for offline access to critical health information
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-white/60">Blood Group</p>
                <p className="font-semibold text-white">{healthProfile.bloodGroup}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Emergency Contact</p>
                <p className="font-semibold text-white">{healthProfile.emergencyContact}</p>
              </div>
            </div>
          </div>
          <div
            className="p-6 rounded-2xl"
            style={{
              background: 'white',
              boxShadow: '0 0 40px rgba(255, 0, 110, 0.5)',
            }}
          >
            <QrCode size={120} className="text-[#0a0a0f]" />
          </div>
        </div>
      </div>

      {/* Health Alerts */}
      <div
        className="p-6 rounded-2xl backdrop-blur-xl"
        style={{
          background: 'rgba(30, 30, 45, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <AlertTriangle size={24} style={{ filter: 'drop-shadow(0 0 10px #ff006e)' }} />
          Health Alerts
        </h3>
        <div className="space-y-3">
          {healthAlerts.map((alert, i) => (
            <div
              key={i}
              className="p-4 rounded-xl transition-all hover:scale-[1.02]"
              style={{
                background: 'rgba(255, 0, 110, 0.1)',
                border: '1px solid rgba(255, 0, 110, 0.3)',
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white">{alert.title}</h4>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{
                    background: alert.priority === 'High' ? '#ff006e' : '#b45aff',
                    boxShadow: `0 0 15px ${alert.priority === 'High' ? '#ff006e' : '#b45aff'}`,
                  }}
                >
                  {alert.priority}
                </span>
              </div>
              <p className="text-sm text-white/80">{alert.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Current Medications */}
      <div
        className="p-6 rounded-2xl backdrop-blur-xl"
        style={{
          background: 'rgba(30, 30, 45, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Pill size={24} style={{ filter: 'drop-shadow(0 0 10px #b45aff)' }} />
          Current Medications
        </h3>
        <div className="grid gap-4">
          {medications.map((med, i) => (
            <div
              key={i}
              className="p-5 rounded-xl transition-all hover:scale-[1.02]"
              style={{
                background: `${med.color}10`,
                border: `1px solid ${med.color}30`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-white">{med.name}</h4>
                  <p className="text-sm text-white/60">
                    {med.dosage} • {med.frequency}
                  </p>
                </div>
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: `${med.color}20`,
                    boxShadow: `0 0 15px ${med.color}40`,
                  }}
                >
                  <Pill size={20} className="text-white" />
                </div>
              </div>
              <div
                className="px-3 py-2 rounded-lg inline-block"
                style={{
                  background: 'rgba(10, 10, 15, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <p className="text-sm text-white">
                  <span className="text-white/60">Next dose:</span> {med.nextDose}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Conditions */}
      <div
        className="p-6 rounded-2xl backdrop-blur-xl"
        style={{
          background: 'rgba(30, 30, 45, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity size={24} style={{ filter: 'drop-shadow(0 0 10px #00d4ff)' }} />
            Medical Profile
          </h3>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #00d4ff 0%, #b45aff 100%)',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
            }}
          >
            <Download size={18} className="text-white" />
            <span className="text-white">Export for Doctor</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div
            className="p-4 rounded-xl"
            style={{
              background: 'rgba(10, 10, 15, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <p className="text-sm text-white/60 mb-2">Chronic Conditions</p>
            <div className="flex flex-wrap gap-2">
              {healthProfile.conditions.map((condition, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{
                    background: 'rgba(255, 0, 110, 0.2)',
                    border: '1px solid rgba(255, 0, 110, 0.4)',
                  }}
                >
                  {condition}
                </span>
              ))}
            </div>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{
              background: 'rgba(10, 10, 15, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <p className="text-sm text-white/60 mb-2">Known Allergies</p>
            <div className="flex flex-wrap gap-2">
              {healthProfile.allergies.map((allergy, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{
                    background: 'rgba(255, 0, 110, 0.2)',
                    border: '1px solid rgba(255, 0, 110, 0.4)',
                  }}
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
