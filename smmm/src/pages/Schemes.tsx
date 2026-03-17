import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import {
  Award,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Heart,
  Home,
  Briefcase,
  GraduationCap,
  Users,
  ExternalLink,
  Filter,
  Search,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner@2.0.3';

interface Scheme {
  id: string;
  name: string;
  category: 'health' | 'finance' | 'education' | 'housing' | 'employment';
  description: string;
  eligibility: string[];
  benefits: string[];
  howToApply: string;
  status: 'eligible' | 'maybe' | 'applied';
  amount?: string;
  deadline?: string;
}

export function Schemes() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const schemes: Scheme[] = [
    {
      id: '1',
      name: 'Ayushman Bharat (PM-JAY)',
      category: 'health',
      description: 'Free health insurance coverage up to ₹5 lakh per family per year for hospitalization',
      eligibility: [
        'Annual family income less than ₹2.5 lakh',
        'No health insurance coverage',
        'BPL card holder',
      ],
      benefits: [
        'Coverage up to ₹5 lakh per year',
        'Covers pre and post hospitalization',
        'Cashless treatment at empaneled hospitals',
        'Coverage for pre-existing diseases',
      ],
      howToApply: 'Visit nearest Common Service Centre (CSC) or apply online at pmjay.gov.in',
      status: 'eligible',
      amount: '₹5 lakh coverage',
    },
    {
      id: '2',
      name: 'PM Kisan Samman Nidhi',
      category: 'finance',
      description: 'Direct income support of ₹6,000 per year to small and marginal farmers',
      eligibility: [
        'Own cultivable land',
        'Small and marginal farmer families',
        'Land holding up to 2 hectares',
      ],
      benefits: [
        '₹6,000 per year in three installments',
        'Direct bank transfer',
        'No need to apply if already registered',
      ],
      howToApply: 'Register at PM-KISAN portal or visit local agriculture office',
      status: 'maybe',
      amount: '₹6,000/year',
    },
    {
      id: '3',
      name: 'Pradhan Mantri Awas Yojana (PMAY)',
      category: 'housing',
      description: 'Financial assistance for building or purchasing a house',
      eligibility: [
        'Annual household income below ₹18 lakh',
        'No pucca house in family name',
        'First-time home buyer',
      ],
      benefits: [
        'Subsidy on home loan interest',
        'Up to ₹2.67 lakh subsidy',
        'Affordable housing for all',
      ],
      howToApply: 'Apply online at pmaymis.gov.in or through participating banks',
      status: 'eligible',
      amount: 'Up to ₹2.67 lakh subsidy',
    },
    {
      id: '4',
      name: 'PM Shram Yogi Maandhan',
      category: 'finance',
      description: 'Pension scheme for unorganized workers providing ₹3,000 monthly pension after 60',
      eligibility: [
        'Age between 18-40 years',
        'Unorganized worker',
        'Monthly income less than ₹15,000',
        'Not covered under EPF/NPS/ESIC',
      ],
      benefits: [
        'Guaranteed monthly pension of ₹3,000',
        'Contribution as low as ₹55/month',
        'Government matching contribution',
      ],
      howToApply: 'Visit Common Service Centre (CSC) with Aadhaar and bank details',
      status: 'eligible',
      amount: '₹3,000/month after 60',
    },
    {
      id: '5',
      name: 'Pradhan Mantri Mudra Yojana (PMMY)',
      category: 'employment',
      description: 'Loans up to ₹10 lakh for small businesses and startups',
      eligibility: [
        'Small business owner or startup founder',
        'Manufacturing, trading or service sector',
        'Non-corporate small business',
      ],
      benefits: [
        'Loans from ₹50,000 to ₹10 lakh',
        'No collateral required',
        'Lower interest rates',
      ],
      howToApply: 'Apply through any bank or NBFC offering MUDRA loans',
      status: 'maybe',
      amount: 'Up to ₹10 lakh loan',
    },
    {
      id: '6',
      name: 'Beti Bachao Beti Padhao',
      category: 'education',
      description: 'Scheme to ensure survival, protection, and education of the girl child',
      eligibility: [
        'Parents or guardian of girl child',
        'Account opened before girl turns 10',
      ],
      benefits: [
        'Higher interest rates on savings',
        'Tax benefits under Section 80C',
        'Maturity amount at age 21',
      ],
      howToApply: 'Open Sukanya Samriddhi Account at any post office or authorized bank',
      status: 'eligible',
      amount: 'Variable based on deposits',
    },
    {
      id: '7',
      name: 'National Pension System (NPS)',
      category: 'finance',
      description: 'Voluntary retirement savings scheme providing pension after retirement',
      eligibility: [
        'Indian citizen aged 18-70 years',
        'Compliant with KYC requirements',
      ],
      benefits: [
        'Tax benefits up to ₹2 lakh',
        'Flexible contribution amounts',
        'Market-linked returns',
        'Lifetime pension option',
      ],
      howToApply: 'Register online at npscra.nsdl.co.in or visit Points of Presence (PoP)',
      status: 'eligible',
      amount: 'Based on contributions',
    },
    {
      id: '8',
      name: 'Atal Pension Yojana (APY)',
      category: 'finance',
      description: 'Guaranteed pension scheme for unorganized sector workers',
      eligibility: [
        'Age between 18-40 years',
        'Indian citizen',
        'Have savings bank account',
      ],
      benefits: [
        'Guaranteed pension of ₹1,000 to ₹5,000',
        'Government co-contribution for eligible',
        'Pension to spouse after subscriber',
      ],
      howToApply: 'Contact your bank to enroll in APY scheme',
      status: 'eligible',
      amount: '₹1,000-₹5,000/month',
    },
  ];

  const categories = [
    { value: 'all', label: 'All Schemes', icon: Award },
    { value: 'health', label: 'Health', icon: Heart },
    { value: 'finance', label: 'Finance', icon: DollarSign },
    { value: 'education', label: 'Education', icon: GraduationCap },
    { value: 'housing', label: 'Housing', icon: Home },
    { value: 'employment', label: 'Employment', icon: Briefcase },
  ];

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesFilter = filter === 'all' || scheme.category === filter;
    const matchesSearch =
      searchQuery === '' ||
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const eligibleCount = schemes.filter((s) => s.status === 'eligible').length;
  const maybeCount = schemes.filter((s) => s.status === 'maybe').length;
  const appliedCount = schemes.filter((s) => s.status === 'applied').length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health':
        return Heart;
      case 'finance':
        return DollarSign;
      case 'education':
        return GraduationCap;
      case 'housing':
        return Home;
      case 'employment':
        return Briefcase;
      default:
        return Award;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health':
        return '#ffa6c1';
      case 'finance':
        return '#87ceeb';
      case 'education':
        return '#d4a5ff';
      case 'housing':
        return '#a0d8f5';
      case 'employment':
        return '#b8e0f6';
      default:
        return '#87ceeb';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Government Schemes</h1>
        <p className="text-[#b8b8c8]">Discover schemes and benefits you're eligible for</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-6" neonColor="cyan">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#b8b8c8] text-sm">Eligible For</p>
              <p className="text-3xl font-bold text-[#87ceeb] mt-1">{eligibleCount}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-[#87ceeb]" />
          </div>
        </GlassCard>

        <GlassCard className="p-6" neonColor="purple">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#b8b8c8] text-sm">Might Be Eligible</p>
              <p className="text-3xl font-bold text-[#d4a5ff] mt-1">{maybeCount}</p>
            </div>
            <Clock className="w-10 h-10 text-[#d4a5ff]" />
          </div>
        </GlassCard>

        <GlassCard className="p-6" neonColor="pink">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#b8b8c8] text-sm">Already Applied</p>
              <p className="text-3xl font-bold text-[#ffa6c1] mt-1">{appliedCount}</p>
            </div>
            <FileText className="w-10 h-10 text-[#ffa6c1]" />
          </div>
        </GlassCard>
      </div>

      {/* Search */}
      <GlassCard className="p-4" neonColor="purple">
        <div className="flex items-center gap-3 mb-3">
          <Search className="w-5 h-5 text-[#d4a5ff]" />
          <h3 className="text-lg font-semibold text-white">Search Schemes</h3>
        </div>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or description"
          className="w-full"
        />
      </GlassCard>

      {/* Filters */}
      <GlassCard className="p-4" neonColor="purple">
        <div className="flex items-center gap-3 mb-3">
          <Filter className="w-5 h-5 text-[#d4a5ff]" />
          <h3 className="text-lg font-semibold text-white">Filter by Category</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  filter === cat.value
                    ? 'bg-[rgba(135,206,235,0.2)] border border-[#87ceeb]'
                    : 'bg-[rgba(30,50,80,0.5)] border border-transparent hover:border-[rgba(135,206,235,0.3)]'
                }`}
                style={
                  filter === cat.value ? { boxShadow: '0 0 15px rgba(135,206,235,0.4)' } : {}
                }
              >
                <Icon className="w-4 h-4 text-white" />
                <span className="text-white text-sm">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Schemes List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Available Schemes ({filteredSchemes.length})</h2>
        {filteredSchemes.map((scheme) => {
          const Icon = getCategoryIcon(scheme.category);
          const color = getCategoryColor(scheme.category);
          return (
            <GlassCard key={scheme.id} className="p-6" neonColor="cyan">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{scheme.name}</h3>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                          style={{ backgroundColor: `${color}20`, color }}
                        >
                          {scheme.category}
                        </span>
                        {scheme.status === 'eligible' && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(135,206,235,0.1)] text-[#87ceeb]">
                            ✓ Eligible
                          </span>
                        )}
                        {scheme.amount && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[rgba(212,165,255,0.1)] text-[#d4a5ff]">
                            {scheme.amount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-white mb-4">{scheme.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Eligibility</h4>
                      <ul className="space-y-1">
                        {scheme.eligibility.map((item, idx) => (
                          <li key={idx} className="text-sm text-[#b8b8c8] flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-[#87ceeb] flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Benefits</h4>
                      <ul className="space-y-1">
                        {scheme.benefits.map((item, idx) => (
                          <li key={idx} className="text-sm text-[#b8b8c8] flex items-start gap-2">
                            <Award className="w-4 h-4 text-[#87ceeb] flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[rgba(135,206,235,0.05)] border border-[rgba(135,206,235,0.2)] mb-4">
                    <h4 className="text-sm font-semibold text-white mb-1">How to Apply</h4>
                    <p className="text-sm text-[#b8b8c8]">{scheme.howToApply}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => toast.success('Opening application form...')}
                      className="bg-[#87ceeb] text-[#0a1628] hover:bg-[#a0d8f5]"
                      style={{ boxShadow: '0 0 20px rgba(135,206,235,0.4)' }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toast.info('More details...')}
                      className="border-[#87ceeb] text-white hover:bg-[rgba(135,206,235,0.1)]"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      More Details
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
