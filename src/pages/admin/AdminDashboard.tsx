import { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';

interface Insight {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  published_at: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export function AdminDashboard() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'insights' | 'contacts'>('insights');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);

  // Insight form state
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [insightForm, setInsightForm] = useState({ title: '', slug: '', content: '', image_url: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setLoginError('');
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (err) {
      setLoginError('Server error');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  const fetchInsights = async () => {
    const res = await fetch('/api/insights');
    if (res.ok) {
      setInsights(await res.json());
    }
  };

  const fetchContacts = async () => {
    const res = await fetch('/api/admin/contacts', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setContacts(await res.json());
    }
  };

  useEffect(() => {
    if (token) {
      if (activeTab === 'insights') fetchInsights();
      if (activeTab === 'contacts') fetchContacts();
    }
  }, [token, activeTab]);

  const saveInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingInsight ? `/api/admin/insights/${editingInsight.id}` : '/api/admin/insights';
    const method = editingInsight ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(insightForm)
    });
    if (res.ok) {
      setEditingInsight(null);
      setInsightForm({ title: '', slug: '', content: '', image_url: '' });
      fetchInsights();
    }
  };

  const deleteInsight = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    const res = await fetch(`/api/admin/insights/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchInsights();
  };

  const deleteContact = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    const res = await fetch(`/api/admin/contacts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchContacts();
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-card text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h2 className="text-2xl font-display text-navy mb-6">Admin Login</h2>
          {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-3 border border-line rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border border-line rounded"
              required
            />
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-navy text-ivory p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-display">TejasFinserv Admin</h1>
          <nav className="flex gap-4 ml-8">
            <button 
              className={`pb-1 ${activeTab === 'insights' ? 'border-b-2 border-brass text-brass' : 'text-ivory/70 hover:text-ivory'}`}
              onClick={() => setActiveTab('insights')}
            >
              Insights
            </button>
            <button 
              className={`pb-1 ${activeTab === 'contacts' ? 'border-b-2 border-brass text-brass' : 'text-ivory/70 hover:text-ivory'}`}
              onClick={() => setActiveTab('contacts')}
            >
              Contacts
            </button>
          </nav>
        </div>
        <button onClick={handleLogout} className="text-sm font-semibold hover:text-brass transition">Logout</button>
      </header>

      <main className="container-main py-8">
        {activeTab === 'insights' && (
          <div>
            <h2 className="text-2xl font-display text-navy mb-6">Manage Insights</h2>
            <div className="bg-white p-6 rounded-lg shadow-soft mb-8">
              <h3 className="text-lg font-bold mb-4">{editingInsight ? 'Edit Insight' : 'Add New Insight'}</h3>
              <form onSubmit={saveInsight} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Title" value={insightForm.title} onChange={e => setInsightForm({...insightForm, title: e.target.value})} className="p-2 border rounded" required />
                  <input type="text" placeholder="Slug (optional)" value={insightForm.slug} onChange={e => setInsightForm({...insightForm, slug: e.target.value})} className="p-2 border rounded" />
                </div>
                <input type="text" placeholder="Image URL (optional)" value={insightForm.image_url} onChange={e => setInsightForm({...insightForm, image_url: e.target.value})} className="w-full p-2 border rounded" />
                <textarea placeholder="Markdown Content..." value={insightForm.content} onChange={e => setInsightForm({...insightForm, content: e.target.value})} className="w-full p-2 border rounded h-40 font-mono text-sm" required />
                <div className="flex gap-2">
                  <Button type="submit">{editingInsight ? 'Update Insight' : 'Publish Insight'}</Button>
                  {editingInsight && <button type="button" onClick={() => { setEditingInsight(null); setInsightForm({title:'', slug:'', content:'', image_url:''}) }} className="px-4 py-2 text-muted">Cancel</button>}
                </div>
              </form>
            </div>
            
            <div className="bg-white rounded-lg shadow-soft overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy text-ivory">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {insights.map(item => (
                    <tr key={item.id}>
                      <td className="p-4 font-medium">{item.title}</td>
                      <td className="p-4">{new Date(item.published_at).toLocaleDateString()}</td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => { setEditingInsight(item); setInsightForm(item as any); }} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => deleteInsight(item.id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <h2 className="text-2xl font-display text-navy mb-6">Contact Submissions</h2>
            <div className="bg-white rounded-lg shadow-soft overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy text-ivory">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {contacts.map(item => (
                    <tr key={item.id}>
                      <td className="p-4 font-medium">{item.name}</td>
                      <td className="p-4">
                        <div>{item.email}</div>
                        <div className="text-muted">{item.phone}</div>
                      </td>
                      <td className="p-4 max-w-xs truncate" title={item.message}>{item.message}</td>
                      <td className="p-4">{new Date(item.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button onClick={() => deleteContact(item.id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
