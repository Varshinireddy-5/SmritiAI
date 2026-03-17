import { useEffect, useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  User,
  Filter,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner@2.0.3';
import { localStore, FinanceRecord } from '../utils/localStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Finance() {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [filter, setFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'expense' as const,
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    person: '',
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const allRecords = localStore.getFinanceRecords();
    setRecords(allRecords);
  };

  const addRecord = () => {
    if (!newRecord.amount || !newRecord.description) {
      toast.error('Please fill required fields');
      return;
    }

    localStore.addFinanceRecord({
      userId: 'demo_user',
      type: newRecord.type,
      amount: parseFloat(newRecord.amount),
      description: newRecord.description,
      category: newRecord.category,
      date: newRecord.date,
      person: newRecord.person,
      status: 'completed',
    });

    toast.success('Financial record added');
    setShowAddDialog(false);
    setNewRecord({
      type: 'expense',
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      person: '',
    });
    loadRecords();
  };

  const deleteRecord = (id: string) => {
    localStore.deleteFinanceRecord(id);
    toast.success('Record deleted');
    loadRecords();
  };

  const filteredRecords = filter === 'all' ? records : records.filter(r => r.type === filter);

  const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const totalLent = records.filter(r => r.type === 'lent').reduce((sum, r) => sum + r.amount, 0);
  const totalBorrowed = records.filter(r => r.type === 'borrowed').reduce((sum, r) => sum + r.amount, 0);

  const chartData = [
    { name: 'Income', amount: totalIncome },
    { name: 'Expense', amount: totalExpense },
    { name: 'Lent', amount: totalLent },
    { name: 'Borrowed', amount: totalBorrowed },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Financial Records</h1>
        <p className="text-[#b8b8c8]">Track income, expenses, and loans</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-6" neonColor="cyan">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#b8b8c8] text-sm">Total Income</p>
              <p className="text-2xl font-bold text-[#87ceeb] mt-1">₹{totalIncome.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#87ceeb]" />
          </div>
        </GlassCard>

        <GlassCard className="p-6" neonColor="pink">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#b8b8c8] text-sm">Total Expense</p>
              <p className="text-2xl font-bold text-[#ffa6c1] mt-1">₹{totalExpense.toLocaleString()}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-[#ffa6c1]" />
          </div>
        </GlassCard>

        <GlassCard className="p-6" neonColor="purple">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#b8b8c8] text-sm">Money Lent</p>
              <p className="text-2xl font-bold text-[#d4a5ff] mt-1">₹{totalLent.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-[#d4a5ff]" />
          </div>
        </GlassCard>

        <GlassCard className="p-6" neonColor="cyan">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#b8b8c8] text-sm">Money Borrowed</p>
              <p className="text-2xl font-bold text-[#87ceeb] mt-1">₹{totalBorrowed.toLocaleString()}</p>
            </div>
            <Wallet className="w-8 h-8 text-[#87ceeb]" />
          </div>
        </GlassCard>
      </div>

      {/* Chart */}
      <GlassCard className="p-6" neonColor="purple">
        <h3 className="text-lg font-semibold text-white mb-4">Financial Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(135,206,235,0.1)" />
            <XAxis dataKey="name" stroke="#b8b8c8" />
            <YAxis stroke="#b8b8c8" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15,30,50,0.95)',
                border: '1px solid rgba(135,206,235,0.3)',
                borderRadius: '8px',
                color: '#ffffff',
              }}
            />
            <Bar dataKey="amount" fill="#87ceeb" />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={() => setShowAddDialog(true)}
          className="flex-1 bg-[#87ceeb] text-[#0a1628] hover:bg-[#a0d8f5]"
          style={{ boxShadow: '0 0 20px rgba(135,206,235,0.4)' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <GlassCard className="p-4" neonColor="purple">
        <div className="flex items-center gap-3 mb-3">
          <Filter className="w-5 h-5 text-[#d4a5ff]" />
          <h3 className="text-lg font-semibold text-white">Filter</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'income', 'expense', 'lent', 'borrowed'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg transition-all capitalize ${
                filter === type
                  ? 'bg-[rgba(135,206,235,0.2)] border border-[#87ceeb]'
                  : 'bg-[rgba(30,50,80,0.5)] border border-transparent hover:border-[rgba(135,206,235,0.3)]'
              }`}
              style={
                filter === type ? { boxShadow: '0 0 15px rgba(135,206,235,0.4)' } : {}
              }
            >
              <span className="text-white text-sm">{type}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Records List */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
        {filteredRecords.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <Wallet className="w-12 h-12 text-[#b8b8c8] mx-auto mb-3" />
            <p className="text-white mb-2">No transactions yet</p>
            <p className="text-[#b8b8c8] text-sm">Start by adding your first transaction</p>
          </GlassCard>
        ) : (
          filteredRecords.map((record) => (
            <GlassCard key={record.id} className="p-5" neonColor="cyan">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`p-3 rounded-lg ${
                      record.type === 'income'
                        ? 'bg-[rgba(135,206,235,0.1)]'
                        : record.type === 'expense'
                        ? 'bg-[rgba(255,166,193,0.1)]'
                        : 'bg-[rgba(212,165,255,0.1)]'
                    }`}
                  >
                    {record.type === 'income' ? (
                      <TrendingUp className="w-5 h-5 text-[#87ceeb]" />
                    ) : record.type === 'expense' ? (
                      <TrendingDown className="w-5 h-5 text-[#ffa6c1]" />
                    ) : (
                      <Wallet className="w-5 h-5 text-[#d4a5ff]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-medium">{record.description}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          record.type === 'income'
                            ? 'bg-[rgba(135,206,235,0.1)] text-[#87ceeb]'
                            : record.type === 'expense'
                            ? 'bg-[rgba(255,166,193,0.1)] text-[#ffa6c1]'
                            : 'bg-[rgba(212,165,255,0.1)] text-[#d4a5ff]'
                        }`}
                      >
                        {record.type}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-[#b8b8c8]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                      {record.category && <span>• {record.category}</span>}
                      {record.person && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {record.person}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xl font-bold ${
                        record.type === 'income'
                          ? 'text-[#87ceeb]'
                          : record.type === 'expense'
                          ? 'text-[#ffa6c1]'
                          : 'text-[#d4a5ff]'
                      }`}
                    >
                      {record.type === 'income' || record.type === 'lent' ? '+' : '-'}₹
                      {record.amount.toLocaleString()}
                    </p>
                    {record.status && (
                      <span
                        className={`text-xs ${
                          record.status === 'completed' ? 'text-[#87ceeb]' : 'text-[#ffa6c1]'
                        }`}
                      >
                        {record.status}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteRecord(record.id)}
                  className="text-[#ff6b9d] hover:bg-[rgba(255,107,157,0.1)] ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Add Record Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[rgba(15,30,50,0.95)] border border-[rgba(135,206,235,0.3)] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white mb-2 block">Type</label>
              <select
                value={newRecord.type}
                onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg bg-[rgba(30,50,80,0.8)] border border-[rgba(135,206,235,0.3)] text-white"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="lent">Lent</option>
                <option value="borrowed">Borrowed</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-white mb-2 block">Amount (₹)</label>
              <Input
                type="number"
                value={newRecord.amount}
                onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })}
                placeholder="e.g., 5000"
                className="bg-[rgba(30,50,80,0.8)] border-[rgba(135,206,235,0.3)] text-white"
              />
            </div>
            <div>
              <label className="text-sm text-white mb-2 block">Description</label>
              <Input
                value={newRecord.description}
                onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                placeholder="e.g., Monthly groceries"
                className="bg-[rgba(30,50,80,0.8)] border-[rgba(135,206,235,0.3)] text-white"
              />
            </div>
            <div>
              <label className="text-sm text-white mb-2 block">Category</label>
              <Input
                value={newRecord.category}
                onChange={(e) => setNewRecord({ ...newRecord, category: e.target.value })}
                placeholder="e.g., Groceries, Utilities"
                className="bg-[rgba(30,50,80,0.8)] border-[rgba(135,206,235,0.3)] text-white"
              />
            </div>
            <div>
              <label className="text-sm text-white mb-2 block">Date</label>
              <Input
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                className="bg-[rgba(30,50,80,0.8)] border-[rgba(135,206,235,0.3)] text-white"
              />
            </div>
            <div>
              <label className="text-sm text-white mb-2 block">Person (Optional)</label>
              <Input
                value={newRecord.person}
                onChange={(e) => setNewRecord({ ...newRecord, person: e.target.value })}
                placeholder="e.g., Ramesh Kumar"
                className="bg-[rgba(30,50,80,0.8)] border-[rgba(135,206,235,0.3)] text-white"
              />
            </div>
            <Button
              onClick={addRecord}
              className="w-full bg-[#87ceeb] text-[#0a1628] hover:bg-[#a0d8f5]"
              style={{ boxShadow: '0 0 20px rgba(135,206,235,0.4)' }}
            >
              Add Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
