// Local storage utilities for offline-first functionality

// ===== PASSWORD VAULT =====
export interface PasswordVaultItem {
  id: string;
  userId: string;
  name: string;
  category: 'bank' | 'subscription' | 'social_media' | 'email' | 'government' | 'insurance' | 'other';
  username?: string;
  email?: string;
  password: string; // In production, this would be encrypted
  url?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  lastUpdated: string;
  isLocked: boolean;
}

// ===== VAULT =====
export interface VaultItem {
  id: string;
  userId: string;
  name: string;
  type: 'aadhaar' | 'pan' | 'passport' | 'ration' | 'driving_license' | 'voter_id' | 
        'birth_certificate' | 'education' | 'caste_certificate' | 'property' | 'legal' | 
        'bill' | 'receipt' | 'agreement' | 'proof' | 'medical' | 'financial' | 'other';
  folder?: string;
  tags: string[];
  uploadDate: string;
  extractedText?: string;
  imageUrl?: string;
  isLocked: boolean;
  isHidden: boolean;
  expiryDate?: string;
  metadata?: any;
}

// ===== MEMORIES =====
export interface MemoryItem {
  id: string;
  userId: string;
  type: 'photo' | 'video' | 'voice' | 'note';
  title: string;
  description?: string;
  voiceExplanation?: string;
  date: string;
  location?: string;
  tags: string[];
  people: string[];
  isLocked: boolean;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  createdAt: string;
}

// ===== HEALTH =====
export interface HealthRecord {
  id: string;
  userId: string;
  type: 'prescription' | 'report' | 'scan' | 'bill' | 'allergy' | 'condition' | 'appointment' | 'vaccination';
  title: string;
  description?: string;
  date: string;
  doctor?: string;
  hospital?: string;
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
  }[];
  attachments?: string[];
  isEmergency: boolean;
  shareCode?: string;
}

// ===== MONEY =====
export interface MoneyRecord {
  id: string;
  userId: string;
  type: 'bill' | 'receipt' | 'loan' | 'rent' | 'salary' | 'expense' | 'income' | 'informal';
  amount: number;
  description: string;
  category: string;
  date: string;
  person?: string;
  voiceNote?: string;
  hasReceipt: boolean;
  imageUrl?: string;
  status?: 'pending' | 'completed' | 'overdue';
}

// ===== PEOPLE =====
export interface PersonProfile {
  id: string;
  userId: string;
  name: string;
  relation: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  isDependent: boolean;
  isEmergencyContact: boolean;
  photo?: string;
  documents: string[]; // IDs of vault items
  importantDates: { date: string; event: string; }[];
  medicalInfo?: string;
  notes?: string;
}

// ===== LEGAL & RIGHTS =====
export interface LegalRecord {
  id: string;
  userId: string;
  type: 'legal_doc' | 'complaint' | 'notice' | 'workplace' | 'harassment' | 'property_dispute' | 'police' | 'court';
  title: string;
  description: string;
  date: string;
  caseNumber?: string;
  relatedParty?: string;
  status: 'active' | 'resolved' | 'pending';
  attachments: string[]; // IDs of vault items
  isLocked: boolean;
  timestamp: string;
}

// ===== LIFE RECORDS =====
export interface LifeRecord {
  id: string;
  userId: string;
  category: 'education' | 'job' | 'address' | 'migration' | 'travel' | 'government_scheme';
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  documents: string[];
  notes?: string;
}

// ===== AFTER ME (WILL & LEGACY) =====
export interface AfterMeRecord {
  id: string;
  userId: string;
  type: 'will' | 'asset_distribution' | 'access_instruction' | 'guardian_info' | 
        'funeral_wish' | 'personal_message' | 'password_hint' | 'trusted_contact';
  title: string;
  content: string;
  beneficiary?: string;
  unlockCondition?: string;
  attachments: string[];
  isLocked: boolean;
  createdAt: string;
  lastUpdated: string;
}

// ===== EMERGENCY =====
export interface EmergencyInfo {
  id: string;
  userId: string;
  type: 'identity' | 'health' | 'contact' | 'document';
  title: string;
  data: any;
  qrCode?: string;
  isQuickAccess: boolean;
}

// ===== BACKUP & TRANSFER =====
export interface BackupRecord {
  id: string;
  userId: string;
  backupDate: string;
  backupLocation: 'local' | 'sd_card' | 'export';
  itemsCount: number;
  size?: string;
}

// ===== SETTINGS =====
export interface AppSettings {
  userId: string;
  appLock: boolean;
  appLockPin?: string;
  guestMode: boolean;
  elderMode: boolean;
  language: string;
  theme: 'dark' | 'light';
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  lastBackup?: string;
}

// Helper functions for local storage
class LocalStore {
  private getKey(type: string): string {
    return `smritiai_${type}`;
  }

  private get<T>(key: string): T[] {
    const data = localStorage.getItem(this.getKey(key));
    return data ? JSON.parse(data) : [];
  }

  private getSingle<T>(key: string): T | null {
    const data = localStorage.getItem(this.getKey(key));
    return data ? JSON.parse(data) : null;
  }

  private set<T>(key: string, data: T[] | T): void {
    localStorage.setItem(this.getKey(key), JSON.stringify(data));
  }

  // ===== PASSWORD VAULT =====
  getPasswordVaultItems(): PasswordVaultItem[] {
    return this.get<PasswordVaultItem>('password_vault');
  }

  addPasswordVaultItem(item: Omit<PasswordVaultItem, 'id' | 'createdAt' | 'lastUpdated'>): PasswordVaultItem {
    const items = this.getPasswordVaultItems();
    const newItem: PasswordVaultItem = {
      ...item,
      id: `password_vault_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    items.unshift(newItem);
    this.set('password_vault', items);
    return newItem;
  }

  deletePasswordVaultItem(id: string): void {
    const items = this.getPasswordVaultItems().filter(i => i.id !== id);
    this.set('password_vault', items);
  }

  // ===== VAULT =====
  getVaultItems(): VaultItem[] {
    return this.get<VaultItem>('vault');
  }

  addVaultItem(item: Omit<VaultItem, 'id' | 'uploadDate'>): VaultItem {
    const items = this.getVaultItems();
    const newItem: VaultItem = {
      ...item,
      id: `vault_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadDate: new Date().toISOString(),
    };
    items.unshift(newItem);
    this.set('vault', items);
    return newItem;
  }

  deleteVaultItem(id: string): void {
    const items = this.getVaultItems().filter(i => i.id !== id);
    this.set('vault', items);
  }

  updateVaultItem(id: string, updates: Partial<VaultItem>): void {
    const items = this.getVaultItems();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.set('vault', items);
    }
  }

  // ===== MEMORIES =====
  getMemories(): MemoryItem[] {
    return this.get<MemoryItem>('memories');
  }

  addMemory(item: Omit<MemoryItem, 'id' | 'createdAt'>): MemoryItem {
    const items = this.getMemories();
    const newItem: MemoryItem = {
      ...item,
      id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    this.set('memories', items);
    return newItem;
  }

  updateMemory(id: string, updates: Partial<MemoryItem>): void {
    const items = this.getMemories();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.set('memories', items);
    }
  }

  deleteMemory(id: string): void {
    const items = this.getMemories().filter(i => i.id !== id);
    this.set('memories', items);
  }

  // ===== HEALTH =====
  getHealthRecords(): HealthRecord[] {
    return this.get<HealthRecord>('health');
  }

  addHealthRecord(record: Omit<HealthRecord, 'id'>): HealthRecord {
    const records = this.getHealthRecords();
    const newRecord: HealthRecord = {
      ...record,
      id: `health_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    records.unshift(newRecord);
    this.set('health', records);
    return newRecord;
  }

  updateHealthRecord(id: string, updates: Partial<HealthRecord>): void {
    const records = this.getHealthRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      this.set('health', records);
    }
  }

  deleteHealthRecord(id: string): void {
    const records = this.getHealthRecords().filter(r => r.id !== id);
    this.set('health', records);
  }

  // ===== MONEY =====
  getMoneyRecords(): MoneyRecord[] {
    return this.get<MoneyRecord>('money');
  }

  addMoneyRecord(record: Omit<MoneyRecord, 'id'>): MoneyRecord {
    const records = this.getMoneyRecords();
    const newRecord: MoneyRecord = {
      ...record,
      id: `money_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    records.unshift(newRecord);
    this.set('money', records);
    return newRecord;
  }

  updateMoneyRecord(id: string, updates: Partial<MoneyRecord>): void {
    const records = this.getMoneyRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      this.set('money', records);
    }
  }

  deleteMoneyRecord(id: string): void {
    const records = this.getMoneyRecords().filter(r => r.id !== id);
    this.set('money', records);
  }

  // ===== PEOPLE =====
  getPeople(): PersonProfile[] {
    return this.get<PersonProfile>('people');
  }

  addPerson(person: Omit<PersonProfile, 'id'>): PersonProfile {
    const people = this.getPeople();
    const newPerson: PersonProfile = {
      ...person,
      id: `person_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    people.unshift(newPerson);
    this.set('people', people);
    return newPerson;
  }

  updatePerson(id: string, updates: Partial<PersonProfile>): void {
    const people = this.getPeople();
    const index = people.findIndex(p => p.id === id);
    if (index !== -1) {
      people[index] = { ...people[index], ...updates };
      this.set('people', people);
    }
  }

  deletePerson(id: string): void {
    const people = this.getPeople().filter(p => p.id !== id);
    this.set('people', people);
  }

  // ===== LEGAL & RIGHTS =====
  getLegalRecords(): LegalRecord[] {
    return this.get<LegalRecord>('legal');
  }

  addLegalRecord(record: Omit<LegalRecord, 'id' | 'timestamp'>): LegalRecord {
    const records = this.getLegalRecords();
    const newRecord: LegalRecord = {
      ...record,
      id: `legal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    records.unshift(newRecord);
    this.set('legal', records);
    return newRecord;
  }

  updateLegalRecord(id: string, updates: Partial<LegalRecord>): void {
    const records = this.getLegalRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      this.set('legal', records);
    }
  }

  deleteLegalRecord(id: string): void {
    const records = this.getLegalRecords().filter(r => r.id !== id);
    this.set('legal', records);
  }

  // ===== LIFE RECORDS =====
  getLifeRecords(): LifeRecord[] {
    return this.get<LifeRecord>('liferecords');
  }

  addLifeRecord(record: Omit<LifeRecord, 'id'>): LifeRecord {
    const records = this.getLifeRecords();
    const newRecord: LifeRecord = {
      ...record,
      id: `life_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    records.unshift(newRecord);
    this.set('liferecords', records);
    return newRecord;
  }

  updateLifeRecord(id: string, updates: Partial<LifeRecord>): void {
    const records = this.getLifeRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      this.set('liferecords', records);
    }
  }

  deleteLifeRecord(id: string): void {
    const records = this.getLifeRecords().filter(r => r.id !== id);
    this.set('liferecords', records);
  }

  // ===== AFTER ME =====
  getAfterMeRecords(): AfterMeRecord[] {
    return this.get<AfterMeRecord>('afterme');
  }

  addAfterMeRecord(record: Omit<AfterMeRecord, 'id' | 'createdAt' | 'lastUpdated'>): AfterMeRecord {
    const records = this.getAfterMeRecords();
    const now = new Date().toISOString();
    const newRecord: AfterMeRecord = {
      ...record,
      id: `afterme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      lastUpdated: now,
    };
    records.unshift(newRecord);
    this.set('afterme', records);
    return newRecord;
  }

  updateAfterMeRecord(id: string, updates: Partial<AfterMeRecord>): void {
    const records = this.getAfterMeRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates, lastUpdated: new Date().toISOString() };
      this.set('afterme', records);
    }
  }

  deleteAfterMeRecord(id: string): void {
    const records = this.getAfterMeRecords().filter(r => r.id !== id);
    this.set('afterme', records);
  }

  // ===== EMERGENCY =====
  getEmergencyInfo(): EmergencyInfo[] {
    return this.get<EmergencyInfo>('emergency');
  }

  addEmergencyInfo(info: Omit<EmergencyInfo, 'id'>): EmergencyInfo {
    const infos = this.getEmergencyInfo();
    const newInfo: EmergencyInfo = {
      ...info,
      id: `emergency_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    infos.unshift(newInfo);
    this.set('emergency', infos);
    return newInfo;
  }

  deleteEmergencyInfo(id: string): void {
    const infos = this.getEmergencyInfo().filter(i => i.id !== id);
    this.set('emergency', infos);
  }

  // ===== BACKUP & TRANSFER =====
  getBackupRecords(): BackupRecord[] {
    return this.get<BackupRecord>('backups');
  }

  addBackupRecord(record: Omit<BackupRecord, 'id'>): BackupRecord {
    const records = this.getBackupRecords();
    const newRecord: BackupRecord = {
      ...record,
      id: `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    records.unshift(newRecord);
    this.set('backups', records);
    return newRecord;
  }

  // ===== SETTINGS =====
  getSettings(): AppSettings {
    const settings = this.getSingle<AppSettings>('settings');
    return settings || {
      userId: 'demo_user',
      appLock: false,
      guestMode: false,
      elderMode: false,
      language: 'en',
      theme: 'dark',
      fontSize: 'medium',
    };
  }

  updateSettings(settings: Partial<AppSettings>): void {
    const current = this.getSettings();
    this.set('settings', { ...current, ...settings });
  }

  // ===== INITIALIZE SAMPLE DATA =====
  initializeSampleData(): void {
    // Images from Unsplash
    const imgWedding = "https://images.unsplash.com/photo-1765615197862-992e1284730e?q=80&w=1080";
    const imgPortrait = "https://images.unsplash.com/photo-1762885590704-cbe990f95ca5?q=80&w=1080";

    // PASSWORD VAULT
    if (this.getPasswordVaultItems().length === 0) {
      this.addPasswordVaultItem({
        userId: 'demo_user',
        name: 'State Bank of India - Net Banking',
        category: 'bank',
        username: 'RAMESHWARP1958',
        email: 'rameshwar.prasad@example.com',
        password: 'Demo@1234',
        url: 'https://onlinesbi.sbi',
        notes: 'Account number: 12345678901. Customer ID: 1234567',
        tags: ['banking', 'sbi', 'important'],
        isLocked: true,
      });

      this.addPasswordVaultItem({
        userId: 'demo_user',
        name: 'EPFO - Employee Portal',
        category: 'government',
        username: 'RPRASAD1958',
        email: '',
        password: 'Pension@2024',
        url: 'https://unifiedportal-mem.epfindia.gov.in',
        notes: 'UAN: 123456789012. For pension and PF claims.',
        tags: ['epfo', 'pension', 'government'],
        isLocked: true,
      });

      this.addPasswordVaultItem({
        userId: 'demo_user',
        name: 'Gmail Account',
        category: 'email',
        username: '',
        email: 'rameshwar.prasad@gmail.com',
        password: 'MyFamily@1958',
        url: 'https://gmail.com',
        notes: 'Recovery phone: +91 98290 12345. Backup codes in safe.',
        tags: ['email', 'google', 'personal'],
        isLocked: false,
      });

      this.addPasswordVaultItem({
        userId: 'demo_user',
        name: 'LIC Policy Portal',
        category: 'insurance',
        username: 'rameshwarp',
        email: 'rameshwar.prasad@example.com',
        password: 'LIC@Family123',
        url: 'https://licindia.in',
        notes: 'Policy Numbers: 123456789, 987654321. For policy updates and claims.',
        tags: ['insurance', 'lic', 'important'],
        isLocked: true,
      });

      this.addPasswordVaultItem({
        userId: 'demo_user',
        name: 'Amazon India',
        category: 'subscription',
        username: '',
        email: 'rameshwar.prasad@gmail.com',
        password: 'Shop@2024',
        url: 'https://amazon.in',
        notes: 'Prime subscription active. Payment method: SBI Credit Card.',
        tags: ['shopping', 'subscription'],
        isLocked: false,
      });
    }

    // VAULT
    if (this.getVaultItems().length === 0) {
      this.addVaultItem({
        userId: 'demo_user',
        name: 'Aadhaar Card',
        type: 'aadhaar',
        folder: 'Identity',
        tags: ['identity', 'government', 'important'],
        extractedText: 'Aadhaar Number: 4567 8901 1234\nName: Rameshwar Prasad\nDOB: 01/01/1958\nAddress: 123, Gandhi Nagar, Jaipur, Rajasthan',
        isLocked: false,
        isHidden: false,
      });

      this.addVaultItem({
        userId: 'demo_user',
        name: 'PAN Card',
        type: 'pan',
        folder: 'Identity',
        tags: ['tax', 'identity', 'government'],
        extractedText: 'PAN: BCPPR1234F\nName: RAMESHWAR PRASAD',
        isLocked: false,
        isHidden: false,
      });

      this.addVaultItem({
        userId: 'demo_user',
        name: 'Property Sale Deed - House 42',
        type: 'property',
        folder: 'Assets',
        tags: ['property', 'house', 'legal'],
        extractedText: 'SALE DEED: Registered on 15/06/1995\nPlot No: 42, Sector 10\nArea: 1500 sq ft',
        isLocked: true,
        isHidden: false,
      });

      this.addVaultItem({
        userId: 'demo_user',
        name: 'Heart Checkup Report - Jan 2026',
        type: 'medical',
        folder: 'Health',
        tags: ['health', 'report', 'cardiology'],
        extractedText: 'ECG: Normal Sinus Rhythm\nBlood Pressure: 135/85\nCholesterol: 190 mg/dL',
        isLocked: false,
        isHidden: false,
      });

      this.addVaultItem({
        userId: 'demo_user',
        name: 'Home Loan Agreement',
        type: 'financial',
        folder: 'Money',
        tags: ['loan', 'agreement', 'bank'],
        extractedText: 'Loan Amount: 1,500,000\nInterest Rate: 8.5%\nTenure: 15 Years',
        isLocked: true,
        isHidden: false,
      });
    }

    // MEMORIES
    if (this.getMemories().length === 0) {
      this.addMemory({
        userId: 'demo_user',
        type: 'photo',
        title: 'Anjali\'s Graduation',
        description: 'Granddaughter Anjali finishing her medical degree',
        date: '2025-11-20',
        location: 'Delhi University',
        tags: ['graduation', 'family', 'pride'],
        people: ['Anjali', 'Sonu', 'Savitri'],
        imageUrl: imgWedding,
        isLocked: false,
        voiceExplanation: 'She is the first doctor in our family. We were so happy.',
      });

      this.addMemory({
        userId: 'demo_user',
        type: 'video',
        title: 'First House Puja',
        description: 'The housewarming ceremony in 1995',
        date: '1995-07-15',
        location: 'Jaipur',
        tags: ['house', 'history', 'puja'],
        people: ['Family', 'Panditji'],
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        isLocked: false,
      });

      this.addMemory({
        userId: 'demo_user',
        type: 'voice',
        title: 'Story of the Old Tree',
        description: 'The story of how the banyan tree was planted',
        date: '1980-05-10',
        tags: ['story', 'legacy', 'nature'],
        people: ['Father'],
        audioUrl: 'https://www.w3schools.com/html/horse.mp3',
        isLocked: false,
      });
    }

    // PEOPLE
    if (this.getPeople().length === 0) {
      this.addPerson({
        userId: 'demo_user',
        name: 'Savitri Devi',
        relation: 'Spouse',
        dateOfBirth: '1962-03-12',
        phone: '+91 98290 12345',
        isDependent: false,
        isEmergencyContact: true,
        photo: imgPortrait,
        documents: [],
        importantDates: [{ date: '1962-03-12', event: 'Birthday' }],
        medicalInfo: 'Asthma, uses inhaler regularly',
      });

      this.addPerson({
        userId: 'demo_user',
        name: 'Suresh Kumar',
        relation: 'Son',
        dateOfBirth: '1988-08-25',
        phone: '+91 98290 54321',
        email: 'suresh@example.com',
        isDependent: false,
        isEmergencyContact: true,
        photo: imgPortrait,
        documents: [],
        importantDates: [{ date: '1988-08-25', event: 'Birthday' }],
      });
    }

    // HEALTH
    if (this.getHealthRecords().length === 0) {
      this.addHealthRecord({
        userId: 'demo_user',
        type: 'prescription',
        title: 'BP Medication - Telma 40',
        description: 'Prescribed by Dr. Mehta for Hypertension',
        date: '2026-01-15',
        doctor: 'Dr. Mehta',
        hospital: 'City Hospital',
        medications: [{ name: 'Telma 40', dosage: '40mg', frequency: 'Once daily (morning)', startDate: '2026-01-15' }],
        isEmergency: true,
      });

      this.addHealthRecord({
        userId: 'demo_user',
        type: 'report',
        title: 'Full Body Blood Test',
        description: 'Annual wellness checkup',
        date: '2026-01-05',
        doctor: 'Diagnostic Center',
        isEmergency: false,
      });
    }

    // MONEY
    if (this.getMoneyRecords().length === 0) {
      this.addMoneyRecord({
        userId: 'demo_user',
        type: 'income',
        amount: 45000,
        description: 'Pension Credit',
        category: 'Govt',
        date: '2026-02-01',
        hasReceipt: false,
      });

      this.addMoneyRecord({
        userId: 'demo_user',
        type: 'loan',
        amount: 5000,
        description: 'Loan to Ramesh (Neighbor)',
        category: 'Informal',
        date: '2026-01-20',
        person: 'Ramesh Kumar',
        voiceNote: 'Ramesh promised to pay back by March 1st.',
        hasReceipt: false,
        status: 'pending',
      });

      this.addMoneyRecord({
        userId: 'demo_user',
        type: 'expense',
        amount: 1200,
        description: 'Electricity Bill',
        category: 'Utilities',
        date: '2026-02-02',
        hasReceipt: true,
      });
    }

    // LEGAL
    if (this.getLegalRecords().length === 0) {
      this.addLegalRecord({
        userId: 'demo_user',
        type: 'legal_doc',
        title: 'Power of Attorney',
        description: 'Granted to Suresh Kumar for property matters, including sale, purchase, and all legal transactions related to Plot No. 42, Sector 10, Gandhi Nagar. Valid until December 2027 or until revoked.',
        date: '2025-10-10',
        status: 'active',
        relatedParty: 'Suresh Kumar',
        attachments: [],
        isLocked: true,
      });

      this.addLegalRecord({
        userId: 'demo_user',
        type: 'legal_doc',
        title: 'Property Ownership - Ancestral Land',
        description: 'Registered owner of 2.5 acres of agricultural land in Village Rampur, District Jaipur. Khata No. 125/456. Inherited from father Late Shri Mohan Prasad. No pending disputes. Latest tax payment receipt dated Jan 2026.',
        date: '2024-03-15',
        status: 'active',
        relatedParty: 'Revenue Department, Jaipur',
        attachments: [],
        isLocked: true,
      });

      this.addLegalRecord({
        userId: 'demo_user',
        type: 'legal_doc',
        title: 'Pension Documents - Central Government',
        description: 'PPO Number: RJ/2019/12345. Retired from Ministry of Education, Grade-IV officer. Monthly pension ₹32,000 credited to SBI Account XXX789. Family pension nominee: Savitri Devi (spouse).',
        date: '2019-11-30',
        status: 'active',
        relatedParty: 'Accounts Office, Jaipur',
        attachments: [],
        isLocked: true,
      });

      this.addLegalRecord({
        userId: 'demo_user',
        type: 'legal_doc',
        title: 'Court Case - Property Boundary Dispute',
        description: 'Civil Suit No. 456/2023 filed against neighbor Ram Singh regarding boundary wall dispute at Plot 42, Sector 10. Next hearing scheduled March 15, 2026. Lawyer: Adv. Ramesh Kumar, Ph: +91 98765 43210.',
        date: '2023-08-20',
        status: 'pending',
        relatedParty: 'District Court, Jaipur',
        attachments: [],
        isLocked: true,
      });

      this.addLegalRecord({
        userId: 'demo_user',
        type: 'legal_doc',
        title: 'Income Tax Returns & Documents',
        description: 'PAN: ABCDE1234F. All ITR filed up to AY 2025-26. Latest refund ₹8,500 received. Senior citizen tax exemption applied. CA: Sharma & Associates, Contact: +91 98123 45678.',
        date: '2025-07-31',
        status: 'active',
        relatedParty: 'Income Tax Department',
        attachments: [],
        isLocked: true,
      });

      this.addLegalRecord({
        userId: 'demo_user',
        type: 'legal_doc',
        title: 'Life Insurance Policies',
        description: 'LIC Policy 1: 500000 (Maturity 2028), Nominee: Savitri Devi. LIC Policy 2: 300000 (Term Insurance), Nominee: Suresh Kumar. Annual premium auto-debit from SBI. Agent: Rakesh Sharma, Ph: +91 98765 11111.',
        date: '2015-04-10',
        status: 'active',
        relatedParty: 'LIC of India',
        attachments: [],
        isLocked: true,
      });

      this.addLegalRecord({
        userId: 'demo_user',
        type: 'legal_doc',
        title: 'Registered Will - 2024',
        description: 'Last Will & Testament registered at Sub-Registrar Office, Gandhi Nagar on Feb 10, 2024. Registration No: WL/2024/789. Executor: Suresh Kumar. Witnesses: Ramesh Kumar & Mohan Lal. Original document in SBI Safe Deposit Box.',
        date: '2024-02-10',
        status: 'active',
        relatedParty: 'Sub-Registrar Office',
        attachments: [],
        isLocked: true,
      });

      this.addLegalRecord({
        userId: 'demo_user',
        type: 'legal_doc',
        title: 'Aadhaar & Essential IDs',
        description: 'Aadhaar: XXXX-XXXX-1234 (linked to mobile +91 98290 XXXXX). PAN: ABCDE1234F. Voter ID: RJ1234567890. Driving License: RJ-07-20190012345 (valid till 2029). Passport: Z1234567 (expired 2020, not renewed).',
        date: '2019-05-20',
        status: 'active',
        relatedParty: 'UIDAI & Govt. Agencies',
        attachments: [],
        isLocked: true,
      });
      
      this.addLegalRecord({
        userId: 'demo_user',
        type: 'notice',
        title: 'Municipal Corporation Tax Notice',
        description: 'Received notice regarding property tax revision for year 2025-2026. Payment completed on Jan 15, 2026. Receipt No: MCJ/2026/8899.',
        date: '2026-01-05',
        status: 'resolved',
        relatedParty: 'Municipal Corporation',
        attachments: [],
        isLocked: true,
      });

      this.addLegalRecord({
        userId: 'demo_user',
        type: 'agreement',
        title: 'House Rent Agreement - Ground Floor',
        description: 'Lease agreement with tenant Mr. Vijay Verma for 11 months starting Dec 2025. Monthly rent: ₹12,000. Security Deposit: ₹24,000.',
        date: '2025-12-01',
        status: 'active',
        relatedParty: 'Vijay Verma (Tenant)',
        attachments: [],
        isLocked: true,
      });

      this.addLegalRecord({
        userId: 'demo_user',
        type: 'vehicle',
        title: 'Vehicle Registration - Maruti Swift',
        description: 'RC Number: RJ-14-CD-1234. Owner: Rameshwar Prasad. Insurance valid till Aug 2026. PUCC valid till July 2026.',
        date: '2020-08-15',
        status: 'active',
        relatedParty: 'RTO Jaipur',
        attachments: [],
        isLocked: true,
      });

      this.addLegalRecord({
        userId: 'demo_user',
        type: 'legal_doc',
        title: 'Gas Connection Documents',
        description: 'Indane Gas Consumer No: 7654321. Agency: Sharma Gas Service. Transfer voucher and original connection papers stored.',
        date: '1998-05-20',
        status: 'active',
        relatedParty: 'Indane Gas',
        attachments: [],
        isLocked: true,
      });

      this.addLegalRecord({
        userId: 'demo_user',
        type: 'complaint',
        title: 'Complaint - Sewerage Blockage',
        description: 'Formal complaint lodged with Nagar Nigam regarding overflowing sewer line in front of house. Complaint No: 998877.',
        date: '2026-01-28',
        status: 'pending',
        relatedParty: 'Nagar Nigam',
        attachments: [],
        isLocked: true,
      });
    }

    // AFTER ME
    if (this.getAfterMeRecords().length === 0) {
      // WILLS
      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'will',
        title: 'Primary Will & Testament',
        content: 'This is my official will. I bequeath my house in Jaipur to my son Suresh, provided he takes care of his mother Savitri Devi for her lifetime. My agricultural land is to be divided equally between my son Suresh and daughter Meena.',
        beneficiary: 'Suresh & Meena',
        unlockCondition: 'Upon death certificate verification',
        attachments: [],
        isLocked: true,
      });

      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'will',
        title: 'Digital Asset Will',
        content: 'I want my digital photos, emails, and cloud storage to be managed by my granddaughter Anjali. She knows the value of our family history.',
        beneficiary: 'Anjali',
        attachments: [],
        isLocked: true,
      });

      // ASSETS
      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'asset_distribution',
        title: 'Real Estate - Jaipur House',
        content: 'Plot 42, Sector 10, Gandhi Nagar. Title Deed is in the Vault. No mortgage pending. Estimated value: ₹1.5 Cr.',
        beneficiary: 'Suresh Kumar',
        unlockCondition: 'Upon my passing',
        attachments: [],
        isLocked: true,
      });

      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'asset_distribution',
        title: 'Agricultural Land - Rampur',
        content: '2.5 Acres of ancestral land. Khata 125/456. Currently leased to Ram Lal for farming. Lease ends 2027.',
        beneficiary: 'Suresh & Meena',
        unlockCondition: 'Upon my passing',
        attachments: [],
        isLocked: true,
      });

      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'asset_distribution',
        title: 'Fixed Deposits (SBI)',
        content: 'FD #1: ₹5,00,000 (Maturing 2027). FD #2: ₹3,00,000 (Maturing 2028). Nominee for both is Savitri Devi.',
        beneficiary: 'Savitri Devi',
        attachments: [],
        isLocked: true,
      });

      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'asset_distribution',
        title: 'Gold Jewelry & Valuables',
        content: '1. Gold Necklace Set (150g) - In Bank Locker. 2. 4 Gold Bangles (60g) - With Savitri. 3. Silver Utensils - Kitchen Almirah.',
        beneficiary: 'Savitri Devi & Anjali (Granddaughter)',
        attachments: [],
        isLocked: true,
      });

      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'asset_distribution',
        title: 'Mutual Fund Investments',
        content: 'HDFC Top 100 Fund - Folio: 12345678. Approx Value: ₹2,50,000. Nominee: Suresh Kumar.',
        beneficiary: 'Suresh Kumar',
        attachments: [],
        isLocked: true,
      });

      // DIGITAL LEGACY
      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'access_instruction',
        title: 'Bank & Financial Access',
        content: 'SBI Net Banking User: RAMESHWARP1958. Password hint: "FamilyName@BirthYear". Transaction Password hint: "City@PinCode".',
        beneficiary: 'Suresh Kumar',
        unlockCondition: 'Emergency or Death',
        attachments: [],
        isLocked: true,
      });

      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'access_instruction',
        title: 'Email & Social Accounts',
        content: 'Gmail (rameshwar.p@gmail.com) - Used for all bank OTPs. Password in Password Vault. Facebook: Deactivate after posting a final message.',
        beneficiary: 'Anjali',
        attachments: [],
        isLocked: true,
      });

      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'access_instruction',
        title: 'Laptop & Phone Passcodes',
        content: 'Laptop PIN: 1958. Phone PIN: 2580. iPad Passcode: 123456.',
        beneficiary: 'Family',
        attachments: [],
        isLocked: true,
      });

      // MESSAGES
      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'personal_message',
        title: 'To My Beloved Wife, Savitri',
        content: 'Savitri, you have been my rock for 40 years. Thank you for every meal, every sacrifice, and every moment of love. I want you to live comfortably. Don\'t hesitate to spend the savings for your health and happiness.',
        beneficiary: 'Savitri Devi',
        attachments: [],
        isLocked: true,
      });

      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'personal_message',
        title: 'To My Son, Suresh',
        content: 'Suresh, I am proud of the man you have become. Take care of the family responsibilities with patience. Be kind to your sister. The house is yours, but it must always be a home for everyone.',
        beneficiary: 'Suresh Kumar',
        attachments: [],
        isLocked: true,
      });

      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'personal_message',
        title: 'To My Daughter, Meena',
        content: 'Meena, my darling daughter. Even though you are far away, you are always in my heart. Use your share of the inheritance for your children\'s education.',
        beneficiary: 'Meena Singh',
        attachments: [],
        isLocked: true,
      });

      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'personal_message',
        title: 'To Grandchildren (Anjali, Sonu)',
        content: 'My dear ones, education is the only wealth no one can steal. Stay curious, stay humble. Remember your grandfather loved you more than words can say.',
        beneficiary: 'Anjali & Sonu',
        attachments: [],
        isLocked: true,
      });

      // WISHES
      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'funeral_wish',
        title: 'Final Rites Preferences',
        content: 'I wish for a traditional Hindu cremation in Jaipur. Please do not spend money on lavish feasts. Instead, donate food to the poor at the Govind Dev Ji temple.',
        beneficiary: 'Suresh Kumar',
        attachments: [],
        isLocked: true,
      });

      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'funeral_wish',
        title: 'Organ Donation',
        content: 'I have registered for eye donation. Please contact the Eye Bank Society of Rajasthan immediately (within 6 hours). Registration card is in my wallet.',
        beneficiary: 'Medical Staff / Family',
        unlockCondition: 'Immediate upon death',
        attachments: [],
        isLocked: false,
      });

      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'funeral_wish',
        title: 'Memorial Service',
        content: 'I want a simple prayer meeting (Bhajan Sandhya) at home. Play my favorite songs by Lata Mangeshkar and Mukesh.',
        beneficiary: 'Family',
        attachments: [],
        isLocked: true,
      });

      // TRUSTED CONTACTS
      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'trusted_contact',
        title: 'Legal Advisor',
        content: 'Advocate Ramesh Kumar. He holds the original copy of my Will. Phone: +91 98765 43210.',
        beneficiary: 'Executor',
        attachments: [],
        isLocked: true,
      });

      this.addAfterMeRecord({
        userId: 'demo_user',
        type: 'trusted_contact',
        title: 'Financial Advisor / CA',
        content: 'Mr. Gupta (Gupta & Associates). He knows all my tax details and investment folios. Phone: +91 99887 76655.',
        beneficiary: 'Executor',
        attachments: [],
        isLocked: true,
      });
    }
  }

  // Export all data
  exportAllData(): string {
    const allData = {
      password_vault: this.getPasswordVaultItems(),
      vault: this.getVaultItems(),
      memories: this.getMemories(),
      health: this.getHealthRecords(),
      money: this.getMoneyRecords(),
      people: this.getPeople(),
      legal: this.getLegalRecords(),
      lifeRecords: this.getLifeRecords(),
      afterMe: this.getAfterMeRecords(),
      emergency: this.getEmergencyInfo(),
      backups: this.getBackupRecords(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(allData, null, 2);
  }

  // Clear all data
  clearAllData(): void {
    const keys = ['password_vault', 'vault', 'memories', 'health', 'money', 'people', 'legal', 'liferecords', 'afterme', 'emergency', 'backups', 'settings'];
    keys.forEach(key => localStorage.removeItem(this.getKey(key)));
  }
}

export const localStore = new LocalStore();