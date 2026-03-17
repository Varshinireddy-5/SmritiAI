import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Clock, Filter, Heart, Wallet, FileText, Users, MapPin, Search, Volume2, 
  FolderLock, Calendar, Scale, TrendingUp, Image, Award, Shield,
  ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner@2.0.3';
import { localStore } from '../utils/localStore';
import { motion, AnimatePresence } from 'motion/react';
import { FloatingParticles } from '../components/FloatingParticles';
import { TextReveal } from '../components/TextReveal';
import { BounceIn } from '../components/BounceIn';

// Timeline Event Type
interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  category: 'vault' | 'memory' | 'health' | 'money' | 'people' | 'legacy' | 'legal';
  icon: any;
  color: string;
  metadata?: any;
}

export function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<TimelineEvent[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    thisYear: 0,
  });

  const categories = [
    { value: 'all', label: 'All Events', icon: Clock, color: '#87ceeb' },
    { value: 'vault', label: 'Documents', icon: FolderLock, color: '#a855f7' },
    { value: 'memory', label: 'Memories', icon: Image, color: '#ff006e' },
    { value: 'health', label: 'Health', icon: Heart, color: '#ff006e' },
    { value: 'money', label: 'Money', icon: Wallet, color: '#00ff88' },
    { value: 'people', label: 'People', icon: Users, color: '#00d9ff' },
    { value: 'legacy', label: 'Legacy', icon: Shield, color: '#ffaa00' },
    { value: 'legal', label: 'Legal', icon: Scale, color: '#a855f7' },
  ];

  useEffect(() => {
    loadTimelineData();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [filter, searchQuery, events]);

  const loadTimelineData = () => {
    setIsLoading(true);
    try {
      const allEvents: TimelineEvent[] = [];

      // Load Vault items
      const vaultItems = localStore.getVaultItems();
      vaultItems.forEach(item => {
        allEvents.push({
          id: `vault_${item.id}`,
          date: new Date(item.uploadDate),
          title: item.name,
          description: `${item.type.replace(/_/g, ' ')} document uploaded`,
          category: 'vault',
          icon: FolderLock,
          color: '#a855f7',
          metadata: { folder: item.folder, tags: item.tags },
        });
      });

      // Load Memories
      const memories = localStore.getMemories();
      memories.forEach(mem => {
        allEvents.push({
          id: `memory_${mem.id}`,
          date: new Date(mem.date),
          title: mem.title,
          description: mem.description || `${mem.type} memory captured`,
          category: 'memory',
          icon: Image,
          color: '#ff006e',
          metadata: { location: mem.location, people: mem.people, tags: mem.tags },
        });
      });

      // Load Health records
      const healthRecords = localStore.getHealthRecords();
      healthRecords.forEach(record => {
        allEvents.push({
          id: `health_${record.id}`,
          date: new Date(record.date),
          title: record.title,
          description: record.description || `${record.type} - ${record.doctor || 'Health record'}`,
          category: 'health',
          icon: Heart,
          color: '#ff006e',
          metadata: { doctor: record.doctor, hospital: record.hospital, type: record.type },
        });
      });

      // Load Money records
      const moneyRecords = localStore.getMoneyRecords();
      moneyRecords.forEach(record => {
        allEvents.push({
          id: `money_${record.id}`,
          date: new Date(record.date),
          title: `${record.type === 'income' ? 'Income' : record.type === 'expense' ? 'Expense' : 'Transaction'}: ₹${record.amount.toLocaleString()}`,
          description: record.description,
          category: 'money',
          icon: Wallet,
          color: '#00ff88',
          metadata: { amount: record.amount, type: record.type, category: record.category },
        });
      });

      // Load People
      const people = localStore.getPeople();
      people.forEach(person => {
        // Add birthday as event
        if (person.dateOfBirth) {
          allEvents.push({
            id: `person_birth_${person.id}`,
            date: new Date(person.dateOfBirth),
            title: `${person.name} - Birthday`,
            description: `${person.relation} - Born on this day`,
            category: 'people',
            icon: Users,
            color: '#00d9ff',
            metadata: { relation: person.relation, phone: person.phone },
          });
        }
        // Add important dates
        person.importantDates?.forEach((importantDate, idx) => {
          allEvents.push({
            id: `person_date_${person.id}_${idx}`,
            date: new Date(importantDate.date),
            title: `${person.name} - ${importantDate.event}`,
            description: `${person.relation} - ${importantDate.event}`,
            category: 'people',
            icon: Users,
            color: '#00d9ff',
            metadata: { relation: person.relation },
          });
        });
      });

      // Load Legacy/AfterMe records
      const legacyRecords = localStore.getAfterMeRecords();
      legacyRecords.forEach(record => {
        allEvents.push({
          id: `legacy_${record.id}`,
          date: new Date(record.createdAt),
          title: record.title,
          description: record.content.substring(0, 150) + '...',
          category: 'legacy',
          icon: Shield,
          color: '#ffaa00',
          metadata: { type: record.type, beneficiary: record.beneficiary },
        });
      });

      // Load Legal records
      const legalRecords = localStore.getLegalRecords();
      legalRecords.forEach(record => {
        allEvents.push({
          id: `legal_${record.id}`,
          date: new Date(record.date),
          title: record.title,
          description: record.description.substring(0, 150) + '...',
          category: 'legal',
          icon: Scale,
          color: '#a855f7',
          metadata: { type: record.type, status: record.status },
        });
      });

      // Sort by date (newest first)
      allEvents.sort((a, b) => b.date.getTime() - a.date.getTime());

      setEvents(allEvents);
      calculateStats(allEvents);
    } catch (error) {
      console.error('Error loading timeline:', error);
      toast.error('Failed to load timeline data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (allEvents: TimelineEvent[]) => {
    const now = new Date();
    const thisMonth = allEvents.filter(e => 
      e.date.getMonth() === now.getMonth() && 
      e.date.getFullYear() === now.getFullYear()
    ).length;
    const thisYear = allEvents.filter(e => 
      e.date.getFullYear() === now.getFullYear()
    ).length;

    setStats({
      total: allEvents.length,
      thisMonth,
      thisYear,
    });
  };

  const filterEvents = () => {
    let filtered = events;

    // Filter by category
    if (filter !== 'all') {
      filtered = filtered.filter(e => e.category === filter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(filtered);
  };

  const groupEventsByMonth = () => {
    const grouped: { [key: string]: TimelineEvent[] } = {};
    
    filteredEvents.forEach(event => {
      const monthYear = event.date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(event);
    });

    return grouped;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  const groupedEvents = groupEventsByMonth();

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      <FloatingParticles count={15} />

      {/* Hero Header */}
      <BounceIn delay={0}>
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block"
          >
            <Clock className="w-16 h-16 text-[#87ceeb] mx-auto mb-2" 
              style={{ filter: 'drop-shadow(0 0 20px #87ceeb)' }} 
            />
          </motion.div>
          <TextReveal text="Your Life Timeline" className="text-4xl font-black text-white" />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[#b8b8c8]"
          >
            A visual journey through your memories, documents, and life events
          </motion.p>
        </div>
      </BounceIn>

      {/* Stats */}
      <BounceIn delay={0.1}>
        <GlassCard className="p-6" neonColor="cyan">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-4xl font-black text-[#87ceeb] mb-1"
              >
                {stats.total}
              </motion.div>
              <div className="text-sm text-[#b8b8c8]">Total Events</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
                className="text-4xl font-black text-[#ff006e] mb-1"
              >
                {stats.thisMonth}
              </motion.div>
              <div className="text-sm text-[#b8b8c8]">This Month</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.4 }}
                className="text-4xl font-black text-[#00ff88] mb-1"
              >
                {stats.thisYear}
              </motion.div>
              <div className="text-sm text-[#b8b8c8]">This Year</div>
            </motion.div>
          </div>
        </GlassCard>
      </BounceIn>

      {/* Filters */}
      <BounceIn delay={0.2}>
        <GlassCard className="p-4" neonColor="purple">
          <div className="flex items-center gap-3 mb-3">
            <Filter className="w-5 h-5 text-[#a855f7]" />
            <h3 className="text-lg font-semibold text-white">Filter by Category</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    filter === cat.value
                      ? 'bg-[rgba(135,206,235,0.2)] border border-[#87ceeb]'
                      : 'bg-[rgba(40,40,60,0.5)] border border-transparent hover:border-[rgba(135,206,235,0.3)]'
                  }`}
                  style={
                    filter === cat.value
                      ? { boxShadow: `0 0 15px ${cat.color}40` }
                      : {}
                  }
                >
                  <Icon className="w-4 h-4 text-white" style={{ color: cat.color }} />
                  <span className="text-white text-sm">{cat.label}</span>
                </motion.button>
              );
            })}
          </div>
        </GlassCard>
      </BounceIn>

      {/* Search */}
      <BounceIn delay={0.3}>
        <GlassCard className="p-4" neonColor="cyan">
          <div className="flex items-center gap-3 mb-3">
            <Search className="w-5 h-5 text-[#87ceeb]" />
            <h3 className="text-lg font-semibold text-white">Search Timeline</h3>
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full"
          />
        </GlassCard>
      </BounceIn>

      {/* Timeline */}
      <div className="space-y-8">
        {isLoading ? (
          <GlassCard className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Sparkles className="w-12 h-12 text-[#87ceeb]" />
            </motion.div>
            <p className="text-[#b8b8c8] mt-4">Loading your timeline...</p>
          </GlassCard>
        ) : filteredEvents.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <Clock className="w-12 h-12 text-[#b8b8c8] mx-auto mb-3" />
            <p className="text-white mb-2">No events found</p>
            <p className="text-[#b8b8c8] text-sm">
              {searchQuery ? 'Try a different search term' : 'Start adding memories and documents'}
            </p>
          </GlassCard>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <motion.div 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute left-8 top-0 bottom-0 w-1 origin-top"
              style={{
                background: 'linear-gradient(180deg, #87ceeb 0%, #a855f7 25%, #ff006e 50%, #ffaa00 75%, #00ff88 100%)',
                boxShadow: '0 0 20px rgba(135,206,235,0.5)',
              }}
            />

            {/* Events grouped by month */}
            {Object.entries(groupedEvents).map(([monthYear, monthEvents], groupIndex) => (
              <motion.div
                key={monthYear}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: groupIndex * 0.1, duration: 0.5 }}
                className="mb-8"
              >
                {/* Month Header */}
                <div className="relative pl-20 mb-6">
                  <motion.div
                    className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#87ceeb] flex items-center justify-center"
                    style={{ boxShadow: '0 0 20px #87ceeb' }}
                    whileHover={{ scale: 1.2, rotate: 180 }}
                  >
                    <Calendar className="w-4 h-4 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white">{monthYear}</h3>
                  <p className="text-sm text-[#b8b8c8]">{monthEvents.length} events</p>
                </div>

                {/* Events in this month */}
                <div className="space-y-4">
                  {monthEvents.map((event, index) => {
                    const categoryInfo = getCategoryInfo(event.category);
                    const Icon = categoryInfo.icon;
                    const isExpanded = expandedEvent === event.id;

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="relative pl-20 pb-2"
                      >
                        {/* Timeline dot */}
                        <motion.div
                          className="absolute left-6 top-6 w-5 h-5 rounded-full"
                          style={{
                            backgroundColor: categoryInfo.color,
                            boxShadow: `0 0 15px ${categoryInfo.color}`,
                          }}
                          whileHover={{ scale: 1.3 }}
                          animate={{
                            boxShadow: [
                              `0 0 15px ${categoryInfo.color}`,
                              `0 0 25px ${categoryInfo.color}`,
                              `0 0 15px ${categoryInfo.color}`,
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />

                        <motion.div
                          whileHover={{ scale: 1.02, x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <GlassCard 
                            className="p-5 cursor-pointer" 
                            neonColor={
                              categoryInfo.color === '#87ceeb' ? 'cyan' :
                              categoryInfo.color === '#a855f7' ? 'purple' :
                              categoryInfo.color === '#ff006e' ? 'pink' :
                              categoryInfo.color === '#00ff88' ? 'green' :
                              categoryInfo.color === '#00d9ff' ? 'cyan' :
                              categoryInfo.color === '#ffaa00' ? 'green' :
                              'cyan'
                            }
                            onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Icon 
                                    className="w-5 h-5" 
                                    style={{ color: categoryInfo.color }}
                                  />
                                  <span
                                    className="px-3 py-1 rounded-full text-xs font-medium"
                                    style={{
                                      backgroundColor: `${categoryInfo.color}20`,
                                      color: categoryInfo.color,
                                    }}
                                  >
                                    {categoryInfo.label}
                                  </span>
                                  <span className="text-[#b8b8c8] text-sm">
                                    {formatDate(event.date)}
                                  </span>
                                </div>

                                <h4 className="text-lg font-semibold text-white mb-2">
                                  {event.title}
                                </h4>

                                <p className="text-[#b8b8c8] text-sm leading-relaxed">
                                  {isExpanded ? event.description : event.description.substring(0, 100) + (event.description.length > 100 ? '...' : '')}
                                </p>

                                <AnimatePresence>
                                  {isExpanded && event.metadata && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]"
                                    >
                                      <div className="flex flex-wrap gap-2">
                                        {Object.entries(event.metadata).map(([key, value]: [string, any]) => {
                                          if (Array.isArray(value) && value.length > 0) {
                                            return (
                                              <div key={key} className="flex flex-wrap gap-1">
                                                {value.map((item: string, idx: number) => (
                                                  <span
                                                    key={idx}
                                                    className="px-2 py-1 rounded text-xs bg-[rgba(255,255,255,0.05)] text-[#b8b8c8]"
                                                  >
                                                    {item}
                                                  </span>
                                                ))}
                                              </div>
                                            );
                                          } else if (value && typeof value === 'string') {
                                            return (
                                              <span
                                                key={key}
                                                className="px-2 py-1 rounded text-xs bg-[rgba(255,255,255,0.05)] text-[#b8b8c8]"
                                              >
                                                {key}: {value}
                                              </span>
                                            );
                                          }
                                          return null;
                                        })}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-[#87ceeb] hover:text-white transition-colors"
                              >
                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </motion.button>
                            </div>
                          </GlassCard>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}