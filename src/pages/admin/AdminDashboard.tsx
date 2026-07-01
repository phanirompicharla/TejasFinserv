import { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { Seo } from '../../components/Seo';

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
  const [loading, setLoading] = useState(false);

  // Insight form state
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [insightForm, setInsightForm] = useState({ title: '', slug: '', content: '', image_url: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
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
        setLoginError(data.error || 'Invalid credentials. Please verify your username and password.');
      }
    } catch (err) {
      setLoginError('Unable to connect to authentication server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  const fetchInsights = async () => {
    try {
      const res = await fetch('/api/insights');
      if (res.ok) {
        setInsights(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch insights:', err);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/admin/contacts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setContacts(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
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
    setLoading(true);
    const url = editingInsight ? `/api/admin/insights/${editingInsight.id}` : '/api/admin/insights';
    const method = editingInsight ? 'PUT' : 'POST';
    try {
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
    } catch (err) {
      console.error('Error saving insight:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteInsight = async (id: number) => {
    if (!confirm('Are you sure you want to delete this publication? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/insights/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchInsights();
    } catch (err) {
      console.error('Error deleting insight:', err);
    }
  };

  const deleteContact = async (id: number) => {
    if (!confirm('Delete this inquiry record?')) return;
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchContacts();
    } catch (err) {
      console.error('Error deleting contact:', err);
    }
  };

  // State of the art Login Portal
  if (!token) {
    return (
      <div className="min-h-screen bg-navy grain-overlay flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        <Seo title="Admin Portal Login — TejasFinserv" description="Secure advisor and administrative management portal." path="/admin" />
        
        {/* Decorative background lights */}
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[300px] rounded-full bg-brass/10 blur-[100px]" aria-hidden="true" />
        
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="inline-block p-4 rounded-3xl bg-ivory shadow-2xl mb-6 border border-line animate-fade-in">
            <Logo />
          </div>
          <h1 className="font-display text-3xl font-semibold text-ivory tracking-tight">
            Advisor Management Portal
          </h1>
          <p className="mt-2 text-sm text-ivory/70">
            AMFI-Registered Distributor Dashboard · ARN-251896
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-ivory rounded-3xl shadow-2xl border border-line py-8 px-6 sm:px-10 backdrop-blur-xl animate-fade-in">
            <div className="mb-6 pb-4 border-b border-line/60 text-center">
              <span className="text-xs font-semibold tracking-widest uppercase text-brass bg-navy/5 px-3 py-1 rounded-full">
                Secure Authentication Required
              </span>
            </div>

            {loginError && (
              <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-800 flex items-center gap-3 animate-fade-in">
                <span className="text-red-500 font-bold text-lg">⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-navy mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter administrator username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-navy placeholder-muted focus:border-brass focus:bg-ivory focus:outline-none focus:ring-1 focus:ring-brass transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-navy mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-navy placeholder-muted focus:border-brass focus:bg-ivory focus:outline-none focus:ring-1 focus:ring-brass transition-all"
                  required
                />
              </div>
              <div className="pt-2">
                <Button type="submit" className="w-full shadow-lg" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Access Portal →'}
                </Button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <a href="/" className="text-xs font-medium text-muted hover:text-navy transition-colors">
                ← Return to TejasFinserv Homepage
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in State of the Art Dashboard
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Seo title="Dashboard — TejasFinserv Admin" description="Manage insights and review client consultation inquiries." path="/admin" />

      {/* Branded Header with Logo (Addressing UX Report Request) */}
      <header className="sticky top-0 z-40 bg-navy text-ivory border-b border-ivory/10 shadow-lg backdrop-blur-md">
        <div className="container-main flex h-20 items-center justify-between py-4">
          <div className="flex items-center gap-6 sm:gap-10">
            <a href="/" className="bg-ivory py-2 px-3 rounded-xl shadow-sm hover:opacity-95 transition-opacity" title="Visit public site">
              <Logo />
            </a>
            <div className="hidden md:block h-8 w-px bg-ivory/15" />
            <div className="hidden md:block">
              <span className="text-xs font-semibold uppercase tracking-widest text-brass block">
                Executive Control
              </span>
              <h1 className="font-display text-lg font-semibold text-ivory">
                Phani Rompicharla · ARN-251896
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-ivory/80 bg-ivory/10 hover:bg-ivory/20 px-3.5 py-2 rounded-lg transition-colors border border-ivory/15"
            >
              <span>View Live Site</span>
              <span>↗</span>
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-500 hover:text-white transition-all active:scale-95"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Top Navigation & Stats Bar */}
      <div className="bg-ivory border-b border-line shadow-sm">
        <div className="container-main py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="flex gap-2 p-1 bg-cream rounded-2xl border border-line/60 w-fit">
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-display text-sm font-semibold transition-all duration-200 ${
                activeTab === 'insights'
                  ? 'bg-navy text-ivory shadow-md scale-[1.02]'
                  : 'text-ink hover:text-navy hover:bg-ivory/60'
              }`}
            >
              <span>📝</span>
              <span>Published Insights ({insights.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-display text-sm font-semibold transition-all duration-200 ${
                activeTab === 'contacts'
                  ? 'bg-navy text-ivory shadow-md scale-[1.02]'
                  : 'text-ink hover:text-navy hover:bg-ivory/60'
              }`}
            >
              <span>📬</span>
              <span>Client Inquiries ({contacts.length})</span>
              {contacts.length > 0 && (
                <span className="ml-1 bg-brass text-navy text-xs px-2 py-0.5 rounded-full font-bold">
                  New
                </span>
              )}
            </button>
          </nav>

          <div className="flex items-center gap-3 text-xs text-muted font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AMFI Server Sync: Active</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container-main py-10 flex-1">
        {activeTab === 'insights' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
              <div>
                <h2 className="font-display text-3xl font-semibold text-navy">
                  Knowledge Hub Management
                </h2>
                <p className="text-sm text-muted mt-1">
                  Create, update, and remove investment guides and market analysis articles.
                </p>
              </div>
              {!editingInsight && (
                <button
                  onClick={() => {
                    setEditingInsight({} as Insight);
                    setInsightForm({ title: '', slug: '', content: '', image_url: '' });
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-brass px-5 py-2.5 text-sm font-semibold text-navy shadow-lg hover:bg-brass-soft transition-all active:scale-95 w-fit"
                >
                  <span>+</span>
                  <span>Write New Insight</span>
                </button>
              )}
            </div>

            {/* Editor Card */}
            {editingInsight && (
              <div className="bg-ivory rounded-3xl border border-brass/40 shadow-2xl p-6 sm:p-8 animate-fade-in">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-line">
                  <h3 className="font-display text-xl font-semibold text-navy flex items-center gap-2">
                    <span>{editingInsight.id ? '✏️ Edit Article' : '✨ New Market Insight'}</span>
                  </h3>
                  <button
                    onClick={() => {
                      setEditingInsight(null);
                      setInsightForm({ title: '', slug: '', content: '', image_url: '' });
                    }}
                    className="text-xs font-semibold text-muted hover:text-navy px-3 py-1.5 rounded-lg bg-cream border border-line"
                  >
                    Cancel / Close Editor
                  </button>
                </div>

                <form onSubmit={saveInsight} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-navy mb-1.5">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Why SIP is the Best Option During Market Volatility"
                        value={insightForm.title}
                        onChange={e => setInsightForm({ ...insightForm, title: e.target.value })}
                        className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm focus:border-brass focus:bg-ivory focus:outline-none focus:ring-1 focus:ring-brass"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-navy mb-1.5">
                        URL Slug (Optional — auto-generated if left blank)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. sip-market-volatility-strategy"
                        value={insightForm.slug}
                        onChange={e => setInsightForm({ ...insightForm, slug: e.target.value })}
                        className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm font-mono text-xs focus:border-brass focus:bg-ivory focus:outline-none focus:ring-1 focus:ring-brass"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-navy mb-1.5">
                      Cover Banner Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={insightForm.image_url}
                      onChange={e => setInsightForm({ ...insightForm, image_url: e.target.value })}
                      className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm focus:border-brass focus:bg-ivory focus:outline-none focus:ring-1 focus:ring-brass"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-navy mb-1.5 flex justify-between">
                      <span>Article Content (Markdown Supported) *</span>
                      <span className="text-muted font-normal">Use headings, bullet lists, and paragraphs</span>
                    </label>
                    <textarea
                      rows={10}
                      placeholder="## Why Systematic Investment Plans Work..."
                      value={insightForm.content}
                      onChange={e => setInsightForm({ ...insightForm, content: e.target.value })}
                      className="w-full rounded-xl border border-line bg-cream p-4 text-sm font-mono focus:border-brass focus:bg-ivory focus:outline-none focus:ring-1 focus:ring-brass"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingInsight(null);
                        setInsightForm({ title: '', slug: '', content: '', image_url: '' });
                      }}
                      className="px-6 py-2.5 rounded-xl border border-line text-sm font-semibold text-muted hover:text-navy transition-colors"
                    >
                      Discard
                    </button>
                    <Button type="submit" disabled={loading} className="px-8 shadow-md">
                      {loading ? 'Saving...' : editingInsight.id ? 'Save Changes' : 'Publish Article Now'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Insights Table */}
            <div className="bg-ivory rounded-3xl border border-line shadow-card overflow-hidden">
              {insights.length === 0 ? (
                <div className="p-12 text-center text-muted">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="font-display font-semibold text-navy text-lg">No publications found</p>
                  <p className="text-sm">Click "Write New Insight" above to create your first advisor article.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-navy text-ivory text-xs uppercase tracking-wider font-semibold border-b border-ivory/10">
                      <tr>
                        <th className="py-4 px-6">Article Title & Slug</th>
                        <th className="py-4 px-6 w-48">Published Date</th>
                        <th className="py-4 px-6 w-44 text-right">Administrative Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {insights.map(item => (
                        <tr key={item.id} className="hover:bg-cream/70 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="font-display font-semibold text-navy text-base group-hover:text-brass transition-colors">
                              {item.title}
                            </div>
                            <div className="text-xs font-mono text-muted mt-0.5">
                              /insights/{item.slug || item.id}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-muted">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cream border border-line">
                              📅 {new Date(item.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-3">
                            <button
                              onClick={() => {
                                setEditingInsight(item);
                                setInsightForm(item as any);
                                window.scrollTo({ top: 100, behavior: 'smooth' });
                              }}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-navy bg-cream hover:bg-brass hover:text-navy px-3 py-1.5 rounded-lg border border-line transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteInsight(item.id)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg border border-red-200 transition-all"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-line pb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-3xl font-semibold text-navy">
                  Client Consultation Requests
                </h2>
                <p className="text-sm text-muted mt-1">
                  Inquiries submitted via public lead forms, goal calculators, and service inquiry modals.
                </p>
              </div>
              <button
                onClick={fetchContacts}
                className="text-xs font-semibold text-navy bg-ivory border border-line hover:border-brass px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>🔄</span>
                <span>Refresh List</span>
              </button>
            </div>

            <div className="bg-ivory rounded-3xl border border-line shadow-card overflow-hidden">
              {contacts.length === 0 ? (
                <div className="p-12 text-center text-muted">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="font-display font-semibold text-navy text-lg">No pending inquiries</p>
                  <p className="text-sm">When visitors request consultations, their messages will appear here instantly.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-navy text-ivory text-xs uppercase tracking-wider font-semibold border-b border-ivory/10">
                      <tr>
                        <th className="py-4 px-6 w-56">Investor Name & Contact</th>
                        <th className="py-4 px-6">Consultation Request / Message</th>
                        <th className="py-4 px-6 w-44">Submitted On</th>
                        <th className="py-4 px-6 w-32 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {contacts.map(item => (
                        <tr key={item.id} className="hover:bg-cream/70 transition-colors">
                          <td className="py-5 px-6">
                            <div className="font-display font-semibold text-navy text-base">
                              {item.name}
                            </div>
                            <div className="text-xs text-brass font-medium mt-1">
                              📞 {item.phone}
                            </div>
                            <div className="text-xs text-muted mt-0.5 truncate max-w-[200px]">
                              ✉️ {item.email}
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <div className="bg-cream rounded-xl p-3 border border-line/60 text-ink text-sm leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
                              {item.message || 'No additional notes provided.'}
                            </div>
                          </td>
                          <td className="py-5 px-6 text-muted whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cream border border-line">
                              ⏱️ {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="py-5 px-6 text-right">
                            <button
                              onClick={() => deleteContact(item.id)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg border border-red-200 transition-all"
                              title="Delete record"
                            >
                              Archive / Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-ivory border-t border-line py-6 mt-auto">
        <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-navy">TejasFinserv</span>
            <span>·</span>
            <span>AMFI Registered Distributor ARN-251896</span>
          </div>
          <div>
            System Version 2.4 · All transmission data encrypted with SSL/TLS
          </div>
        </div>
      </footer>
    </div>
  );
}
