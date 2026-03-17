import { Wallet, TrendingUp, TrendingDown, Calendar, AlertCircle, Plus } from 'lucide-react';
import { useState } from 'react';

export function Finance() {
  const [activeTab, setActiveTab] = useState('overview');

  const financialSummary = {
    income: 5000,
    expenses: 3200,
    loansGiven: 2000,
    loansReceived: 0,
  };

  const transactions = [
    {
      id: 1,
      type: 'income',
      title: 'Pension Payment',
      amount: 5000,
      date: 'Jan 28, 2026',
      status: 'completed',
    },
    {
      id: 2,
      type: 'expense',
      title: 'School Fee',
      amount: 3500,
      date: 'Jan 20, 2026',
      status: 'completed',
    },
    {
      id: 3,
      type: 'loan_given',
      title: 'Loan to Ramesh',
      amount: 2000,
      date: 'Jan 15, 2026',
      status: 'pending',
      dueDate: 'Feb 28, 2026',
    },
  ];

  const loans = [
    {
      id: 1,
      person: 'Ramesh Kumar',
      amount: 2000,
      date: 'Jan 15, 2026',
      dueDate: 'Feb 28, 2026',
      status: 'pending',
      installments: 0,
      note: 'For medical expenses',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div
        className="p-6 rounded-2xl backdrop-blur-xl"
        style={{
          background: 'rgba(30, 30, 45, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Wallet size={28} style={{ filter: 'drop-shadow(0 0 10px #39ff14)' }} />
          Financial Overview
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className="p-4 rounded-xl"
            style={{
              background: 'rgba(57, 255, 20, 0.1)',
              border: '1px solid rgba(57, 255, 20, 0.3)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-white" style={{ filter: 'drop-shadow(0 0 5px #39ff14)' }} />
              <p className="text-sm text-white/60">Income</p>
            </div>
            <p className="text-2xl font-bold text-white">₹{financialSummary.income.toLocaleString()}</p>
            <p className="text-xs text-white/60 mt-1">This month</p>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{
              background: 'rgba(255, 0, 110, 0.1)',
              border: '1px solid rgba(255, 0, 110, 0.3)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={20} className="text-white" style={{ filter: 'drop-shadow(0 0 5px #ff006e)' }} />
              <p className="text-sm text-white/60">Expenses</p>
            </div>
            <p className="text-2xl font-bold text-white">₹{financialSummary.expenses.toLocaleString()}</p>
            <p className="text-xs text-white/60 mt-1">This month</p>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-white" style={{ filter: 'drop-shadow(0 0 5px #00d4ff)' }} />
              <p className="text-sm text-white/60">Loans Given</p>
            </div>
            <p className="text-2xl font-bold text-white">₹{financialSummary.loansGiven.toLocaleString()}</p>
            <p className="text-xs text-white/60 mt-1">Outstanding</p>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{
              background: 'rgba(180, 90, 255, 0.1)',
              border: '1px solid rgba(180, 90, 255, 0.3)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={20} className="text-white" style={{ filter: 'drop-shadow(0 0 5px #b45aff)' }} />
              <p className="text-sm text-white/60">Net Balance</p>
            </div>
            <p className="text-2xl font-bold text-white">
              ₹{(financialSummary.income - financialSummary.expenses).toLocaleString()}
            </p>
            <p className="text-xs text-white/60 mt-1">This month</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['overview', 'loans', 'insights'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-medium transition-all capitalize ${
              activeTab === tab ? 'text-white' : 'text-white/70'
            }`}
            style={
              activeTab === tab
                ? {
                    background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.2) 0%, rgba(0, 212, 255, 0.2) 100%)',
                    border: '1px solid rgba(57, 255, 20, 0.5)',
                    boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)',
                  }
                : {
                    background: 'rgba(30, 30, 45, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loans Tab */}
      {activeTab === 'loans' && (
        <div
          className="p-6 rounded-2xl backdrop-blur-xl"
          style={{
            background: 'rgba(30, 30, 45, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Loan Tracking</h3>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #00d4ff 0%, #b45aff 100%)',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
              }}
            >
              <Plus size={18} className="text-white" />
              <span className="text-white">Add Loan</span>
            </button>
          </div>

          <div className="space-y-4">
            {loans.map((loan) => (
              <div
                key={loan.id}
                className="p-5 rounded-xl transition-all hover:scale-[1.02]"
                style={{
                  background: 'rgba(10, 10, 15, 0.5)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{loan.person}</h4>
                    <p className="text-sm text-white/60">Lent on {loan.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">₹{loan.amount.toLocaleString()}</p>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium text-white inline-block mt-1"
                      style={{
                        background: 'rgba(255, 165, 0, 0.2)',
                        border: '1px solid rgba(255, 165, 0, 0.4)',
                      }}
                    >
                      Pending
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={16} className="text-white/60" />
                  <p className="text-sm text-white/80">Due: {loan.dueDate}</p>
                </div>

                {loan.note && (
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      background: 'rgba(0, 212, 255, 0.05)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                    }}
                  >
                    <p className="text-sm text-white/80">
                      <span className="text-white/60">Note:</span> {loan.note}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div
          className="p-6 rounded-2xl backdrop-blur-xl"
          style={{
            background: 'rgba(30, 30, 45, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const isIncome = transaction.type === 'income';
              const isExpense = transaction.type === 'expense';
              const isLoan = transaction.type === 'loan_given';

              return (
                <div
                  key={transaction.id}
                  className="p-4 rounded-xl transition-all hover:scale-[1.02]"
                  style={{
                    background: 'rgba(10, 10, 15, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          background: isIncome
                            ? 'rgba(57, 255, 20, 0.2)'
                            : isExpense
                            ? 'rgba(255, 0, 110, 0.2)'
                            : 'rgba(0, 212, 255, 0.2)',
                          border: isIncome
                            ? '1px solid rgba(57, 255, 20, 0.4)'
                            : isExpense
                            ? '1px solid rgba(255, 0, 110, 0.4)'
                            : '1px solid rgba(0, 212, 255, 0.4)',
                        }}
                      >
                        {isIncome ? (
                          <TrendingUp size={20} className="text-white" />
                        ) : (
                          <TrendingDown size={20} className="text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{transaction.title}</h4>
                        <p className="text-sm text-white/60">{transaction.date}</p>
                        {transaction.dueDate && (
                          <p className="text-xs text-white/60">Due: {transaction.dueDate}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          isIncome ? 'text-white' : 'text-white'
                        }`}
                        style={{
                          filter: isIncome
                            ? 'drop-shadow(0 0 10px #39ff14)'
                            : isExpense
                            ? 'drop-shadow(0 0 10px #ff006e)'
                            : 'drop-shadow(0 0 10px #00d4ff)',
                        }}
                      >
                        {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div
          className="p-6 rounded-2xl backdrop-blur-xl"
          style={{
            background: 'rgba(30, 30, 45, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={24} style={{ filter: 'drop-shadow(0 0 10px #00d4ff)' }} />
            Financial Insights
          </h3>
          <div className="space-y-4">
            <div
              className="p-4 rounded-xl"
              style={{
                background: 'rgba(57, 255, 20, 0.1)',
                border: '1px solid rgba(57, 255, 20, 0.3)',
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: 'rgba(57, 255, 20, 0.2)',
                    boxShadow: '0 0 15px rgba(57, 255, 20, 0.4)',
                  }}
                >
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">Positive Savings Trend</h4>
                  <p className="text-sm text-white/80">
                    You've saved ₹1,800 this month, which is 36% of your income. Great work!
                  </p>
                </div>
              </div>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{
                background: 'rgba(255, 165, 0, 0.1)',
                border: '1px solid rgba(255, 165, 0, 0.3)',
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: 'rgba(255, 165, 0, 0.2)',
                    boxShadow: '0 0 15px rgba(255, 165, 0, 0.4)',
                  }}
                >
                  <AlertCircle size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">Loan Reminder</h4>
                  <p className="text-sm text-white/80">
                    Ramesh's loan of ₹2,000 is due in 26 days. Consider sending a reminder.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
