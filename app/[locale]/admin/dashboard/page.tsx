'use client';

import { useState, useEffect, use } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast';
import type { Role } from '@/lib/types';

type TabKey = 'users' | 'farmers' | 'animals' | 'investments';

interface UserRow {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  balance: number;
  created_at: string;
}

interface FarmerRow {
  id: string;
  farm_name: string;
  location: string;
  verified: boolean;
  profile: { full_name: string; email: string } | null;
}

interface AnimalRow {
  id: string;
  name: string;
  type: string;
  price: number;
  status: string;
  farmer: { farm_name: string } | null;
}

interface InvestmentRow {
  id: string;
  amount: number;
  status: string;
  invested_at: string;
  profile: { full_name: string; email: string } | null;
  animal: { name: string } | null;
}

const supabase = createClient();

export default function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('admin.dashboard');
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>('users');
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [users, setUsers] = useState<UserRow[]>([]);
  const [farmers, setFarmers] = useState<FarmerRow[]>([]);
  const [animals, setAnimals] = useState<AnimalRow[]>([]);
  const [investments, setInvestments] = useState<InvestmentRow[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [tabLoading, setTabLoading] = useState(false);
  const [topUpId, setTopUpId] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);

  useEffect(() => { document.title = 'Admin Panel — Tabyn'; }, []);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push(`/${locale}/login`); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') { router.push(`/${locale}/`); return; }

      setAuthorized(true);
      setLoading(false);
    })();
  }, [locale, router]);

  useEffect(() => {
    if (!authorized) return;
    fetchTab(activeTab);
  }, [authorized, activeTab]);

  const fetchTab = async (tab: TabKey) => {
    setFetchError(null);
    setTabLoading(true);
    try {
      if (tab === 'users') {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setUsers((data as UserRow[]) ?? []);
      } else if (tab === 'farmers') {
        const { data, error } = await supabase
          .from('farmers')
          .select('id, farm_name, location, verified, profile:profiles(full_name, email)')
          .order('farm_name');
        if (error) throw error;
        setFarmers((data as unknown as FarmerRow[]) ?? []);
      } else if (tab === 'animals') {
        const { data, error } = await supabase
          .from('animals')
          .select('id, name, type, price, status, farmer:farmers(farm_name)')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setAnimals((data as unknown as AnimalRow[]) ?? []);
      } else if (tab === 'investments') {
        const { data, error } = await supabase
          .from('investments')
          .select('id, amount, status, invested_at, profile:profiles(full_name, email), animal:animals(name)')
          .order('invested_at', { ascending: false });
        if (error) throw error;
        setInvestments((data as unknown as InvestmentRow[]) ?? []);
      }
    } catch (err) {
      setFetchError('Failed to load data. Please try again.');
      console.error('Admin fetchTab error:', err);
    } finally {
      setTabLoading(false);
    }
  };

  const changeRole = async (userId: string, newRole: Role) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (error) {
      toast({ message: 'Failed to update role. Please try again.', variant: 'error' });
      return;
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    toast({ message: 'Role updated successfully.', variant: 'success' });
  };

  const toggleVerified = async (farmerId: string, current: boolean) => {
    const { error } = await supabase.from('farmers').update({ verified: !current }).eq('id', farmerId);
    if (error) {
      toast({ message: 'Failed to update verification. Please try again.', variant: 'error' });
      return;
    }
    setFarmers(prev => prev.map(f => f.id === farmerId ? { ...f, verified: !current } : f));
    toast({ message: `Farmer ${!current ? 'verified' : 'unverified'}.`, variant: 'success' });
  };

  const deleteAnimal = async (animalId: string) => {
    if (!window.confirm(t('confirmDelete'))) return;
    const { error } = await supabase.from('animals').delete().eq('id', animalId);
    if (error) {
      toast({ message: 'Failed to delete animal. Please try again.', variant: 'error' });
      return;
    }
    setAnimals(prev => prev.filter(a => a.id !== animalId));
    toast({ message: 'Animal deleted.', variant: 'success' });
  };

  const handleTopUp = async (userId: string, currentBalance: number) => {
    const amount = Number(topUpAmount);
    if (!amount || amount <= 0) return;
    if (topUpLoading) return;
    setTopUpLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ balance: currentBalance + amount })
        .eq('id', userId);
      if (error) {
        toast({ message: 'Failed to add balance. Try again.', variant: 'error' });
        return;
      }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, balance: u.balance + amount } : u));
      setTopUpId(null);
      setTopUpAmount('');
      toast({ message: `Added ₸${amount.toLocaleString()} to balance.`, variant: 'success' });
    } finally {
      setTopUpLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  const tabs: TabKey[] = ['users', 'farmers', 'animals', 'investments'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
      </div>

      {fetchError && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {fetchError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {/* Users tab */}
      {activeTab === 'users' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted text-left">
                <th className="pb-3 pr-4 font-medium">{t('name')}</th>
                <th className="pb-3 pr-4 font-medium">{t('email')}</th>
                <th className="pb-3 pr-4 font-medium">{t('role')}</th>
                <th className="pb-3 pr-4 font-medium">{t('balance')}</th>
                <th className="pb-3 pr-4 font-medium">{t('joined')}</th>
                <th className="pb-3 font-medium">Top Up</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-surface transition-colors">
                  <td className="py-3 pr-4 font-medium">{user.full_name}</td>
                  <td className="py-3 pr-4 text-muted">{user.email}</td>
                  <td className="py-3 pr-4">
                    <select
                      value={user.role}
                      onChange={e => changeRole(user.id, e.target.value as Role)}
                      className="bg-surface border border-border rounded-lg px-2 py-1 text-sm text-foreground focus:outline-none focus:border-accent"
                    >
                      <option value="investor">investor</option>
                      <option value="farmer">farmer</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="py-3 pr-4 text-muted">₸{user.balance?.toLocaleString() ?? 0}</td>
                  <td className="py-3 pr-4 text-muted">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="py-3">
                    {topUpId === user.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={topUpAmount}
                          onChange={e => setTopUpAmount(e.target.value)}
                          placeholder="Amount"
                          className="w-24 bg-background border border-border rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent/50"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleTopUp(user.id, user.balance);
                            if (e.key === 'Escape') setTopUpId(null);
                          }}
                        />
                        <button onClick={() => handleTopUp(user.id, user.balance)} disabled={topUpLoading} className="text-xs px-2 py-1 bg-accent text-black rounded-lg font-medium disabled:opacity-50">{topUpLoading ? '…' : '✓'}</button>
                        <button onClick={() => setTopUpId(null)} className="text-xs px-2 py-1 bg-surface border border-border rounded-lg text-muted">✕</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setTopUpId(user.id); setTopUpAmount(''); }}
                        className="text-xs text-accent hover:underline"
                      >
                        + Top Up
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-muted text-sm mt-4">{t('noUsers')}</p>}
        </div>
      )}

      {/* Farmers tab */}
      {activeTab === 'farmers' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted text-left">
                <th className="pb-3 pr-4 font-medium">{t('farmName')}</th>
                <th className="pb-3 pr-4 font-medium">{t('name')}</th>
                <th className="pb-3 pr-4 font-medium">{t('location')}</th>
                <th className="pb-3 font-medium">{t('verified')}</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map(farmer => (
                <tr key={farmer.id} className="border-b border-border/50 hover:bg-surface transition-colors">
                  <td className="py-3 pr-4 font-medium">{farmer.farm_name}</td>
                  <td className="py-3 pr-4 text-muted">{farmer.profile?.full_name ?? '—'}</td>
                  <td className="py-3 pr-4 text-muted">{farmer.location}</td>
                  <td className="py-3">
                    <button
                      onClick={() => toggleVerified(farmer.id, farmer.verified)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        farmer.verified
                          ? 'bg-accent/20 text-accent hover:bg-accent/30'
                          : 'bg-surface border border-border text-muted hover:text-foreground'
                      }`}
                    >
                      {farmer.verified ? t('unverify') : t('verify')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {farmers.length === 0 && <p className="text-muted text-sm mt-4">{t('noFarmers')}</p>}
        </div>
      )}

      {/* Animals tab */}
      {activeTab === 'animals' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted text-left">
                <th className="pb-3 pr-4 font-medium">{t('name')}</th>
                <th className="pb-3 pr-4 font-medium">{t('type')}</th>
                <th className="pb-3 pr-4 font-medium">{t('price')}</th>
                <th className="pb-3 pr-4 font-medium">{t('status')}</th>
                <th className="pb-3 pr-4 font-medium">{t('farmerColumn')}</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {animals.map(animal => (
                <tr key={animal.id} className="border-b border-border/50 hover:bg-surface transition-colors">
                  <td className="py-3 pr-4 font-medium">{animal.name}</td>
                  <td className="py-3 pr-4 text-muted capitalize">{animal.type}</td>
                  <td className="py-3 pr-4 text-muted">₸{animal.price?.toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-surface border border-border text-muted capitalize">
                      {animal.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted">{animal.farmer?.farm_name ?? '—'}</td>
                  <td className="py-3">
                    <button
                      onClick={() => deleteAnimal(animal.id)}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {animals.length === 0 && <p className="text-muted text-sm mt-4">{t('noAnimals')}</p>}
        </div>
      )}

      {/* Investments tab */}
      {activeTab === 'investments' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted text-left">
                <th className="pb-3 pr-4 font-medium">{t('investor')}</th>
                <th className="pb-3 pr-4 font-medium">{t('animal')}</th>
                <th className="pb-3 pr-4 font-medium">{t('amount')}</th>
                <th className="pb-3 pr-4 font-medium">{t('status')}</th>
                <th className="pb-3 font-medium">{t('joined')}</th>
              </tr>
            </thead>
            <tbody>
              {investments.map(inv => (
                <tr key={inv.id} className="border-b border-border/50 hover:bg-surface transition-colors">
                  <td className="py-3 pr-4 font-medium">{inv.profile?.full_name ?? '—'}</td>
                  <td className="py-3 pr-4 text-muted">{inv.animal?.name ?? '—'}</td>
                  <td className="py-3 pr-4 text-muted">₸{inv.amount?.toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      inv.status === 'active'
                        ? 'bg-accent/20 text-accent'
                        : 'bg-surface border border-border text-muted'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted">{new Date(inv.invested_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {investments.length === 0 && <p className="text-muted text-sm mt-4">{t('noInvestments')}</p>}
        </div>
      )}
    </div>
  );
}
