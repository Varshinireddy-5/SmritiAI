import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  BookOpen, GraduationCap, Briefcase, Home, Plane, Award,
  Trash2, Search, MapPin, Calendar
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner@2.0.3';
import { localStore, LifeRecord } from '../utils/localStore';

export function LifeRecords() {
  const [records, setRecords] = useState<LifeRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<LifeRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [searchQuery, categoryFilter, records]);

  const loadRecords = () => {
    const allRecords = localStore.getLifeRecords();
    // Sort by start date
    const sorted = allRecords.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    setRecords(sorted);
  };

  const filterRecords = () => {
    let filtered = records;
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(r => r.category === categoryFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.location?.toLowerCase().includes(query)
      );
    }
    setFilteredRecords(filtered);
  };

  const deleteRecord = (id: string) => {
    if (confirm('Delete this life record?')) {
      localStore.deleteLifeRecord(id);
      toast.success('Record deleted');
      loadRecords();
    }
  };

  const categories = [
    { value: 'all', label: 'All', icon: BookOpen, color: '#87ceeb' },
    { value: 'education', label: 'Education', icon: GraduationCap, color: '#a855f7' },
    { value: 'job', label: 'Jobs', icon: Briefcase, color: '#00ff88' },
    { value: 'address', label: 'Addresses', icon: Home, color: '#ff006e' },
    { value: 'migration', label: 'Migration', icon: Plane, color: '#ffa500' },
    { value: 'government_scheme', label: 'Gov. Schemes', icon: Award, color: '#87ceeb' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Life Records</h1>
        <p className="text-[#b8b8c8]">Your complete life history - From start to present</p>
      </div>

      {/* Search */}
      <GlassCard className="p-4" neonColor="cyan">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-[#87ceeb]" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search life records..."
            className="flex-1"
          />
        </div>
      </GlassCard>

      {/* Category Filters */}
      <GlassCard className="p-4" neonColor="purple">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const Icon = cat.icon;
            const count = cat.value === 'all' ? records.length : records.filter(r => r.category === cat.value).length;
            return (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  categoryFilter === cat.value
                    ? 'bg-[rgba(168,85,247,0.2)] border border-[#a855f7]'
                    : 'bg-[rgba(30,50,80,0.5)] border border-transparent hover:border-[rgba(168,85,247,0.3)]'
                }`}
              >
                <Icon className="w-4 h-4" style={{ color: cat.color }} />
                <span className="text-white text-sm">{cat.label} ({count})</span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-[#b8b8c8] mx-auto mb-4" />
            <p className="text-white text-lg mb-2">No life records</p>
          </GlassCard>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00d9ff] via-[#a855f7] to-[#ff006e]" />
            
            {filteredRecords.map((record) => {
              const category = categories.find(c => c.category === record.category);
              const Icon = category?.icon || BookOpen;
              const color = category?.color || '#87ceeb';

              return (
                <div key={record.id} className="relative pl-20 pb-8">
                  <div
                    className="absolute left-6 top-6 w-5 h-5 rounded-full"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}`,
                    }}
                  />
                  
                  <GlassCard className="p-6" neonColor="cyan">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Icon className="w-5 h-5" style={{ color }} />
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                            style={{
                              backgroundColor: `${color}20`,
                              color: color,
                            }}
                          >
                            {record.category.replace('_', ' ')}
                          </span>
                          <span className="text-[#b8b8c8] text-sm">
                            {new Date(record.startDate).getFullYear()}
                            {record.endDate && ` - ${new Date(record.endDate).getFullYear()}`}
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-2">{record.title}</h3>
                        <p className="text-[#b8b8c8] mb-3">{record.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-[#b8b8c8] mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(record.startDate).toLocaleDateString()}
                              {record.endDate && ` - ${new Date(record.endDate).toLocaleDateString()}`}
                            </span>
                          </div>
                          {record.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{record.location}</span>
                            </div>
                          )}
                        </div>

                        {record.notes && (
                          <div className="p-3 rounded-lg bg-[rgba(135,206,235,0.05)] border border-[rgba(135,206,235,0.2)]">
                            <p className="text-sm text-white">{record.notes}</p>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRecord(record.id)}
                        className="text-[#ff006e] hover:bg-[rgba(255,0,110,0.1)]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <GlassCard className="p-6" neonColor="purple">
        <h3 className="text-lg font-semibold text-white mb-4">Life Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.slice(1).map(cat => {
            const Icon = cat.icon;
            const count = records.filter(r => r.category === cat.value).length;
            return (
              <div key={cat.value} className="text-center">
                <Icon className="w-8 h-8 mx-auto mb-2" style={{ color: cat.color }} />
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-sm text-[#b8b8c8] mt-1">{cat.label}</p>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
