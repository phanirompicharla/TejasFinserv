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
  description?: string;
  read_time?: string;
  tags?: string;
  author?: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

interface ClientReview {
  id: number;
  name: string;
  city: string;
  review_text: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// Clean, Modern Inline Icons for an Executive Dashboard
function IconDocument({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function IconMail({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function IconPlus({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function IconEdit({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  );
}

function IconTrash({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

function IconRefresh({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

function IconCheck({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function IconStar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function IconExternal({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}

function IconLogout({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  );
}

function IconUser({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function IconLock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function IconPhone({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function IconClock({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function AdminDashboard() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'insights' | 'contacts' | 'reviews'>('insights');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Insight form state
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [insightForm, setInsightForm] = useState({
    title: '',
    slug: '',
    content: '',
    image_url: '',
    description: '',
    read_time: '',
    tags: '',
    author: ''
  });

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

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setReviews(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchInsights();
      fetchContacts();
      fetchReviews();
    }
  }, [token, activeTab]);

  const saveInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editingInsight && editingInsight.id ? `/api/admin/insights/${editingInsight.id}` : '/api/admin/insights';
    const method = editingInsight && editingInsight.id ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(insightForm)
      });
      if (res.ok) {
        setEditingInsight(null);
        setInsightForm({
          title: '',
          slug: '',
          content: '',
          image_url: '',
          description: '',
          read_time: '',
          tags: '',
          author: ''
        });
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

  const approveReview = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error('Error approving review:', err);
    }
  };

  const rejectReview = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error('Error rejecting review:', err);
    }
  };

  const deleteReview = async (id: number) => {
    if (!confirm('Delete this review?\n\nThis action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (reviewFilter !== 'all' && r.status !== reviewFilter) return false;
    if (reviewSearchQuery) {
      const q = reviewSearchQuery.toLowerCase();
      return r.name.toLowerCase().includes(q) || 
             r.city.toLowerCase().includes(q) || 
             r.review_text.toLowerCase().includes(q);
    }
    return true;
  });

  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved').length;
  const rejectedCount = reviews.filter(r => r.status === 'rejected').length;

  // State of the Art Login Portal
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-deep via-navy to-[#0b1c2d] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-ivory">
        <Seo title="Admin Portal Login — TejasFinserv" description="Secure advisor and administrative management portal." path="/admin" />
        
        {/* Ambient background lighting */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 -z-10 w-[700px] h-[500px] rounded-full bg-brass/15 blur-[140px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-40 right-10 -z-10 w-[500px] h-[400px] rounded-full bg-emerald-500/10 blur-[130px]" aria-hidden="true" />
        
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
          <div className="inline-block p-4 rounded-3xl bg-ivory/10 backdrop-blur-md shadow-2xl mb-6 border border-white/15 animate-fade-in">
            <Logo imgClassName="h-12 sm:h-14 w-auto" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Advisor Management Portal
          </h1>
          <p className="mt-2 text-sm text-ivory/70 max-w-sm mx-auto">
            AMFI-Registered Distributor Dashboard · ARN-251896
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-ivory/95 text-navy rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5)] border border-white/20 py-8 px-6 sm:px-10 backdrop-blur-2xl animate-fade-in">
            <div className="mb-6 pb-4 border-b border-line/60 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest uppercase text-brass bg-navy/5 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <IconLock className="w-3.5 h-3.5 text-brass" />
                <span>Secure Authentication</span>
              </span>
              <span className="text-[11px] font-mono text-muted">SSL/TLS 256-bit</span>
            </div>

            {loginError && (
              <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-800 flex items-start gap-3 animate-fade-in shadow-sm">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span className="font-medium">{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2 flex items-center gap-1.5">
                  <IconUser className="w-3.5 h-3.5 text-brass" />
                  <span>Username</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter administrator username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-line bg-cream px-4 py-3.5 text-sm text-navy placeholder-muted/70 focus:border-brass focus:bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30 transition-all shadow-inner"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2 flex items-center gap-1.5">
                  <IconLock className="w-3.5 h-3.5 text-brass" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-line bg-cream px-4 py-3.5 text-sm text-navy placeholder-muted/70 focus:border-brass focus:bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30 transition-all shadow-inner"
                  required
                />
              </div>
              <div className="pt-3">
                <Button type="submit" className="w-full shadow-lg py-4 text-base font-bold flex items-center justify-center gap-2" disabled={loading}>
                  <span>{loading ? 'Authenticating...' : 'Access Portal'}</span>
                  {!loading && <span>→</span>}
                </Button>
              </div>
            </form>
            <div className="mt-8 pt-6 border-t border-line/60 text-center">
              <a href="/" className="text-xs font-semibold text-muted hover:text-navy transition-colors inline-flex items-center gap-1.5 group">
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span>Return to TejasFinserv Homepage</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in State of the Art Dashboard
  return (
    <div className="min-h-screen bg-cream flex flex-col font-body">
      <Seo title="Dashboard — TejasFinserv Admin" description="Manage insights and review client consultation inquiries." path="/admin" />

      {/* Premium Executive Header */}
      <header className="sticky top-0 z-40 bg-navy text-ivory border-b border-ivory/10 shadow-xl backdrop-blur-md">
        <div className="container-main flex h-20 items-center justify-between py-4">
          <div className="flex items-center gap-6 sm:gap-10">
            <a href="/" className="bg-ivory py-1.5 px-3 rounded-xl shadow-md hover:opacity-95 transition-opacity flex items-center" title="Visit public site">
              <Logo imgClassName="h-8 w-auto" />
            </a>
            <div className="hidden md:block h-8 w-px bg-ivory/15" />
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-brass block">
                  Executive Control Center
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="font-display text-base font-semibold text-ivory tracking-wide mt-0.5">
                Phani Rompicharla <span className="text-ivory/40 font-normal">|</span> <span className="text-brass">ARN-251896</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-ivory/90 bg-ivory/10 hover:bg-ivory/20 px-4 py-2 rounded-xl transition-all border border-ivory/15 active:scale-95 shadow-sm"
            >
              <span>View Live Site</span>
              <IconExternal className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-red-500/15 border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-sm"
            >
              <IconLogout className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* KPI Overview Ribbon */}
      <div className="bg-ivory border-b border-line/80 shadow-sm py-6">
        <div className="container-main grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-cream rounded-2xl border border-line p-4 sm:p-5 flex items-center justify-between shadow-xs hover:shadow-sm transition-shadow">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted block">Knowledge Hub</span>
              <div className="text-2xl font-display font-bold text-navy mt-1">{insights.length}</div>
              <span className="text-[11px] text-muted mt-0.5 block">Published Insights Live</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brass/15 border border-brass/30 flex items-center justify-center text-navy">
              <IconDocument className="w-6 h-6 text-brass" />
            </div>
          </div>

          <div className="bg-cream rounded-2xl border border-line p-4 sm:p-5 flex items-center justify-between shadow-xs hover:shadow-sm transition-shadow">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted block">Client Inquiries</span>
              <div className="text-2xl font-display font-bold text-navy mt-1 flex items-center gap-2">
                <span>{contacts.length}</span>
                {contacts.length > 0 && (
                  <span className="text-xs font-sans font-bold bg-brass text-navy px-2 py-0.5 rounded-full animate-bounce">
                    New Leads
                  </span>
                )}
              </div>
              <span className="text-[11px] text-muted mt-0.5 block">Consultation Requests</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-navy/10 border border-navy/20 flex items-center justify-center text-navy">
              <IconMail className="w-6 h-6 text-navy" />
            </div>
          </div>

          <div className="bg-cream rounded-2xl border border-line p-4 sm:p-5 flex items-center justify-between shadow-xs hover:shadow-sm transition-shadow">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted block">Client Reviews</span>
              <div className="text-2xl font-display font-bold text-navy mt-1 flex items-center gap-2">
                <span>{reviews.length}</span>
                {reviews.length > 0 && (
                  <span className="text-xs font-sans font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full animate-pulse">
                    Pending
                  </span>
                )}
              </div>
              <span className="text-[11px] text-muted mt-0.5 block">Awaiting Approval</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <IconStar className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pills & Quick Actions Bar */}
      <div className="bg-ivory/80 backdrop-blur-md border-b border-line sticky top-20 z-30">
        <div className="container-main py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="flex gap-1.5 p-1 bg-cream rounded-2xl border border-line/80 w-fit shadow-inner">
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-display text-sm font-semibold transition-all duration-200 ${
                activeTab === 'insights'
                  ? 'bg-navy text-ivory shadow-md'
                  : 'text-ink hover:text-navy hover:bg-ivory'
              }`}
            >
              <IconDocument className="w-4 h-4" />
              <span>Published Insights ({insights.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-display text-sm font-semibold transition-all duration-200 ${
                activeTab === 'contacts'
                  ? 'bg-navy text-ivory shadow-md'
                  : 'text-ink hover:text-navy hover:bg-ivory'
              }`}
            >
              <IconMail className="w-4 h-4" />
              <span>Client Consultation Requests ({contacts.length})</span>
              {contacts.length > 0 && (
                <span className="ml-0.5 bg-brass text-navy text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Active
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-display text-sm font-semibold transition-all duration-200 ${
                activeTab === 'reviews'
                  ? 'bg-navy text-ivory shadow-md'
                  : 'text-ink hover:text-navy hover:bg-ivory'
              }`}
            >
              <IconStar className="w-4 h-4" />
              <span>Client Reviews ({reviews.length})</span>
              {reviews.length > 0 && (
                <span className="ml-0.5 bg-amber-400 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Pending
                </span>
              )}
            </button>
          </nav>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs text-muted font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>AMFI Server: Connected</span>
            </span>
            <button
              onClick={() => {
                if (activeTab === 'insights') fetchInsights();
                if (activeTab === 'contacts') fetchContacts();
                if (activeTab === 'reviews') fetchReviews();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-ivory border border-line hover:border-brass text-xs font-semibold text-navy transition-all shadow-2xs active:scale-95 group"
              title="Refresh Data"
            >
              <IconRefresh className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Refresh</span>
            </button>
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
                  Publish investment guides, market outlooks, and tax planning advice for clients.
                </p>
              </div>
              {!editingInsight && (
                <button
                  onClick={() => {
                    setEditingInsight({} as Insight);
                    setInsightForm({
                      title: '',
                      slug: '',
                      content: '',
                      image_url: '',
                      description: '',
                      read_time: '',
                      tags: '',
                      author: ''
                    });
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-brass px-6 py-3 text-sm font-bold text-navy shadow-lg hover:bg-brass-soft hover:-translate-y-0.5 transition-all active:scale-95 w-fit"
                >
                  <IconPlus className="w-4 h-4" />
                  <span>Write New Insight</span>
                </button>
              )}
            </div>

            {/* Editor Studio Card */}
            {editingInsight && (
              <div className="bg-ivory rounded-3xl border-2 border-brass/50 shadow-2xl p-6 sm:p-10 animate-fade-in relative overflow-hidden">
                <div className="flex items-center justify-between pb-5 mb-6 border-b border-line">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brass/15 border border-brass/30 flex items-center justify-center text-navy font-bold text-lg">
                      {editingInsight.id ? '✏️' : '✨'}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-navy">
                        {editingInsight.id ? 'Edit Article' : 'Write New Market Insight'}
                      </h3>
                      <p className="text-xs text-muted">Format content with Markdown headers and bullet points</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingInsight(null);
                      setInsightForm({
                        title: '',
                        slug: '',
                        content: '',
                        image_url: '',
                        description: '',
                        read_time: '',
                        tags: '',
                        author: ''
                      });
                    }}
                    className="text-xs font-semibold text-muted hover:text-navy px-3.5 py-2 rounded-xl bg-cream border border-line transition-all"
                  >
                    Close Editor
                  </button>
                </div>

                <form onSubmit={saveInsight} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Why SIP is the Best Strategy During Market Volatility"
                        value={insightForm.title}
                        onChange={e => setInsightForm({ ...insightForm, title: e.target.value })}
                        className="w-full rounded-2xl border border-line bg-cream px-4 py-3.5 text-sm font-medium text-navy focus:border-brass focus:bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2">
                        URL Slug (Optional — auto-generated if blank)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. sip-market-volatility-strategy"
                        value={insightForm.slug}
                        onChange={e => setInsightForm({ ...insightForm, slug: e.target.value })}
                        className="w-full rounded-2xl border border-line bg-cream px-4 py-3.5 text-sm font-mono text-xs text-navy focus:border-brass focus:bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2">
                        Read Time (e.g. 5 min)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5 min"
                        value={insightForm.read_time}
                        onChange={e => setInsightForm({ ...insightForm, read_time: e.target.value })}
                        className="w-full rounded-2xl border border-line bg-cream px-4 py-3.5 text-sm font-medium text-navy focus:border-brass focus:bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2">
                        Hashtags / Topics (comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SIP, Mutual Funds, Beginners"
                        value={insightForm.tags}
                        onChange={e => setInsightForm({ ...insightForm, tags: e.target.value })}
                        className="w-full rounded-2xl border border-line bg-cream px-4 py-3.5 text-sm font-medium text-navy focus:border-brass focus:bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2">
                        Author Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Phani Rompicharla"
                        value={insightForm.author}
                        onChange={e => setInsightForm({ ...insightForm, author: e.target.value })}
                        className="w-full rounded-2xl border border-line bg-cream px-4 py-3.5 text-sm font-medium text-navy focus:border-brass focus:bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2">
                        Short Description / Excerpt
                      </label>
                      <input
                        type="text"
                        placeholder="Short summary of the article..."
                        value={insightForm.description}
                        onChange={e => setInsightForm({ ...insightForm, description: e.target.value })}
                        className="w-full rounded-2xl border border-line bg-cream px-4 py-3.5 text-sm font-medium text-navy focus:border-brass focus:bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2">
                      Cover Banner Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={insightForm.image_url}
                      onChange={e => setInsightForm({ ...insightForm, image_url: e.target.value })}
                      className="w-full rounded-2xl border border-line bg-cream px-4 py-3.5 text-sm font-mono text-xs text-navy focus:border-brass focus:bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2 flex justify-between items-center">
                      <span>Article Content (Markdown Supported) *</span>
                      <span className="text-muted font-normal text-[11px]">Supports ## Headings, - Bullet lists, and Paragraphs</span>
                    </label>
                    <textarea
                      rows={12}
                      placeholder="## Systematic Investment Plans (SIP) Overview&#10;&#10;When market volatility rises, many investors feel uncertain..."
                      value={insightForm.content}
                      onChange={e => setInsightForm({ ...insightForm, content: e.target.value })}
                      className="w-full rounded-2xl border border-line bg-cream p-4 text-sm font-mono text-navy focus:border-brass focus:bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30 transition-all leading-relaxed"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingInsight(null);
                        setInsightForm({
                          title: '',
                          slug: '',
                          content: '',
                          image_url: '',
                          description: '',
                          read_time: '',
                          tags: '',
                          author: ''
                        });
                      }}
                      className="px-6 py-3 rounded-2xl border border-line text-sm font-semibold text-muted hover:text-navy hover:bg-cream transition-all"
                    >
                      Discard
                    </button>
                    <Button type="submit" disabled={loading} className="px-8 shadow-lg py-3">
                      {loading ? 'Saving...' : editingInsight.id ? 'Update & Publish' : 'Publish Article Now'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Insights Table */}
            <div className="bg-ivory rounded-3xl border border-line shadow-card overflow-hidden">
              {insights.length === 0 ? (
                <div className="p-16 text-center text-muted">
                  <div className="w-16 h-16 rounded-full bg-cream border border-line flex items-center justify-center mx-auto mb-4 text-navy">
                    <IconDocument className="w-8 h-8 text-brass" />
                  </div>
                  <h3 className="font-display font-semibold text-navy text-xl">No published articles yet</h3>
                  <p className="text-sm mt-1 max-w-sm mx-auto">Click "+ Write New Insight" above to publish your first market advisory guide.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-navy text-ivory text-xs uppercase tracking-wider font-semibold border-b border-ivory/10">
                      <tr>
                        <th className="py-4 px-6">Article Title & Path</th>
                        <th className="py-4 px-6 w-52">Published Date</th>
                        <th className="py-4 px-6 w-48 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {insights.map(item => (
                        <tr key={item.id} className="hover:bg-cream/80 transition-colors group">
                          <td className="py-5 px-6">
                            <div className="font-display font-semibold text-navy text-base group-hover:text-brass transition-colors">
                              {item.title}
                            </div>
                            <div className="text-xs font-mono text-muted mt-1 flex items-center gap-1.5">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brass" />
                              <span>/insights/{item.slug || item.id}</span>
                            </div>
                          </td>
                          <td className="py-5 px-6 text-muted">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-cream border border-line text-navy/80">
                              <IconClock className="w-3.5 h-3.5 text-brass" />
                              <span>{new Date(item.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </span>
                          </td>
                          <td className="py-5 px-6 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingInsight(item);
                                setInsightForm({
                                  title: item.title || '',
                                  slug: item.slug || '',
                                  content: item.content || '',
                                  image_url: item.image_url || '',
                                  description: item.description || '',
                                  read_time: item.read_time || '',
                                  tags: item.tags || '',
                                  author: item.author || ''
                                });
                                window.scrollTo({ top: 100, behavior: 'smooth' });
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy bg-cream hover:bg-brass hover:text-navy px-3.5 py-2 rounded-xl border border-line transition-all shadow-2xs"
                            >
                              <IconEdit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => deleteInsight(item.id)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-3.5 py-2 rounded-xl border border-red-200 transition-all shadow-2xs"
                            >
                              <IconTrash className="w-3.5 h-3.5" />
                              <span>Delete</span>
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
            <div className="border-b border-line pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-semibold text-navy">
                  Client Consultation Requests
                </h2>
                <p className="text-sm text-muted mt-1">
                  Inquiries submitted from public lead forms, goal calculators, and service inquiry modals.
                </p>
              </div>
              <button
                onClick={fetchContacts}
                className="text-xs font-semibold text-navy bg-ivory border border-line hover:border-brass px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 w-fit"
              >
                <IconRefresh className="w-4 h-4 text-brass" />
                <span>Refresh Inquiries</span>
              </button>
            </div>

            {contacts.length === 0 ? (
              <div className="bg-ivory rounded-3xl border border-line shadow-card p-16 text-center text-muted">
                <div className="w-16 h-16 rounded-full bg-cream border border-line flex items-center justify-center mx-auto mb-4 text-navy">
                  <IconMail className="w-8 h-8 text-brass" />
                </div>
                <h3 className="font-display font-semibold text-navy text-xl">No pending client inquiries</h3>
                <p className="text-sm mt-1 max-w-sm mx-auto">When investors request consultations or submit lead forms, their messages will appear here instantly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contacts.map(item => (
                  <div key={item.id} className="bg-ivory rounded-3xl border border-line shadow-card hover:shadow-xl hover:border-brass/50 transition-all p-6 sm:p-7 flex flex-col justify-between group">
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-4 pb-4 border-b border-line/60">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-navy text-ivory font-display font-bold text-lg flex items-center justify-center shadow-md group-hover:bg-brass group-hover:text-navy transition-colors">
                            {item.name ? item.name.slice(0, 2).toUpperCase() : 'CL'}
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-navy text-lg leading-snug">{item.name}</h3>
                            <span className="text-xs text-muted font-medium flex items-center gap-1 mt-0.5">
                              <IconClock className="w-3 h-3 text-brass" />
                              <span>{new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Badges */}
                      <div className="flex flex-wrap gap-2.5 my-4">
                        <a
                          href={`tel:${item.phone}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cream border border-line hover:border-brass text-xs font-bold text-navy transition-all"
                        >
                          <IconPhone className="w-3.5 h-3.5 text-brass" />
                          <span>{item.phone}</span>
                        </a>
                        <a
                          href={`mailto:${item.email}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cream border border-line hover:border-brass text-xs font-medium text-muted hover:text-navy transition-all truncate max-w-[240px]"
                        >
                          <IconMail className="w-3.5 h-3.5 text-brass" />
                          <span className="truncate">{item.email}</span>
                        </a>
                      </div>

                      {/* Message Content */}
                      <div className="bg-cream/90 rounded-2xl p-4 border border-line/60 my-4 shadow-inner">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Consultation Message / Goals</span>
                        <p className="text-sm text-navy/90 leading-relaxed whitespace-pre-wrap font-sans">
                          {item.message || 'No additional message provided.'}
                        </p>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-line/60 flex items-center justify-end">
                      <button
                        onClick={() => deleteContact(item.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50/80 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl border border-red-200 transition-all shadow-2xs"
                        title="Archive or delete this record"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                        <span>Archive Inquiry</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-line pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-semibold text-navy">
                  Client Reviews
                </h2>
                <p className="text-sm text-muted mt-1">
                  Manage client testimonials before they appear on the public site.
                </p>
              </div>
              <button
                onClick={fetchReviews}
                className="text-xs font-semibold text-navy bg-ivory border border-line hover:border-brass px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 w-fit"
              >
                <IconRefresh className="w-4 h-4 text-brass" />
                <span>Refresh Reviews</span>
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-ivory border border-line rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Pending</p>
                <p className="text-2xl font-display font-bold text-navy">{pendingCount}</p>
              </div>
              <div className="bg-ivory border border-line rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Approved</p>
                <p className="text-2xl font-display font-bold text-emerald-700">{approvedCount}</p>
              </div>
              <div className="bg-ivory border border-line rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Rejected</p>
                <p className="text-2xl font-display font-bold text-red-700">{rejectedCount}</p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex bg-cream p-1 rounded-xl border border-line overflow-x-auto w-full sm:w-auto">
                {(['all', 'pending', 'approved', 'rejected'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setReviewFilter(filter)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-all ${
                      reviewFilter === filter 
                        ? 'bg-ivory text-navy shadow-sm border border-line' 
                        : 'text-muted hover:text-navy'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-72">
                <input 
                  type="text" 
                  placeholder="Search reviews..." 
                  value={reviewSearchQuery}
                  onChange={e => setReviewSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-brass focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-ivory rounded-3xl border border-line shadow-card overflow-hidden">
              {filteredReviews.length === 0 ? (
                <div className="p-16 text-center text-muted">
                  <div className="w-16 h-16 rounded-full bg-cream border border-line flex items-center justify-center mx-auto mb-4 text-navy">
                    <IconStar className="w-8 h-8 text-brass" />
                  </div>
                  <h3 className="font-display font-semibold text-navy text-xl">No reviews found</h3>
                  <p className="text-sm mt-1 max-w-sm mx-auto">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-navy text-ivory text-xs uppercase tracking-wider font-semibold border-b border-ivory/10">
                      <tr>
                        <th className="py-4 px-6 w-1/4">Name & City</th>
                        <th className="py-4 px-6 w-1/2">Review Text</th>
                        <th className="py-4 px-6 w-32">Status</th>
                        <th className="py-4 px-6 w-32 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {filteredReviews.map(item => (
                        <tr key={item.id} className="hover:bg-cream/80 transition-colors group">
                          <td className="py-5 px-6 align-top">
                            <div className="font-display font-semibold text-navy text-base">
                              {item.name}
                            </div>
                            <div className="text-xs text-muted mt-1 flex items-center gap-1.5">
                              <span>{item.city}</span>
                            </div>
                            <div className="text-[10px] text-muted/60 mt-2 font-mono flex items-center gap-1">
                              <IconClock className="w-3 h-3" />
                              <span>{new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </td>
                          <td className="py-5 px-6 align-top">
                            <p className="text-sm text-navy/90 whitespace-pre-wrap">"{item.review_text}"</p>
                          </td>
                          <td className="py-5 px-6 align-top">
                            {item.status === 'pending' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>}
                            {item.status === 'approved' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800">Approved</span>}
                            {item.status === 'rejected' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">Rejected</span>}
                          </td>
                          <td className="py-5 px-6 align-top text-right space-y-2">
                            {item.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => approveReview(item.id)}
                                  className="w-full justify-center inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white px-3 py-2 rounded-lg border border-emerald-200 transition-all shadow-2xs"
                                >
                                  <IconCheck className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => rejectReview(item.id)}
                                  className="w-full justify-center inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-3 py-2 rounded-lg border border-red-200 transition-all shadow-2xs"
                                >
                                  <IconTrash className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteReview(item.id)}
                              className="w-full justify-center inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-white bg-cream hover:bg-red-600 px-3 py-2 rounded-lg border border-line hover:border-red-600 transition-all shadow-2xs"
                            >
                              <IconTrash className="w-3.5 h-3.5" />
                              <span>Delete</span>
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
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              256-bit SSL Encrypted
            </span>
            <span>·</span>
            <span>Admin Control v3.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
