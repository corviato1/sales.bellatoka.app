import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock, LogOut, Home, MapPin, User, Settings, Save, Plus, Trash2, RefreshCw, BarChart2, ArrowLeft, Eye, EyeOff, Users, TrendingUp, Calendar, Globe, Edit2, Mail, Phone, Clock, CheckCircle, XCircle, FileText, Building2, Star, Bot } from 'lucide-react';

import { templateListings, testimonials as templateTestimonials } from '../data/listings';
import AddListingForm from '../components/AddListingForm';
import AddWebListingForm from '../components/AddWebListingForm';
import AddMLSListingForm from '../components/AddMLSListingForm';


function generateMockAnalytics() {
  const trafficByDay = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    trafficByDay.push({
      date: d.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 51) + 10
    });
  }

  return {
    summary: {
      totalPageViews: 1247,
      uniqueVisitors: 423,
      viewsToday: 34,
      viewsThisWeek: 187,
      viewsThisMonth: 892,
      topPages: [
        { page_path: '/', views: 342 },
        { page_path: '/listings', views: 198 },
        { page_path: '/about', views: 156 },
        { page_path: '/contact', views: 134 },
        { page_path: '/listings/1', views: 89 },
        { page_path: '/resources', views: 76 },
        { page_path: '/home-value', views: 64 },
        { page_path: '/listings/2', views: 52 },
        { page_path: '/neighborhoods/irvine', views: 41 },
        { page_path: '/listings/3', views: 35 }
      ],
      trafficByDay
    },
    users: [
      { visitor_ip: '192.168.1.1', total_views: 45, unique_pages: 8, first_visit: new Date(Date.now() - 7*86400000).toISOString(), last_visit: new Date().toISOString(), pages_visited: ['/', '/listings', '/about', '/contact', '/resources', '/home-value', '/neighborhoods/irvine', '/listings/1'], user_agents: ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'], city: 'Irvine', region: 'CA', country: 'US', is_bot: false, bot_name: null },
      { visitor_ip: '10.0.0.2', total_views: 120, unique_pages: 29, first_visit: new Date(Date.now() - 2*86400000).toISOString(), last_visit: new Date().toISOString(), pages_visited: ['/', '/listings', '/about', '/contact', '/resources', '/neighborhoods/irvine'], user_agents: ['GPTBot/1.0'], city: null, region: null, country: 'US', is_bot: true, bot_name: 'GPTBot (OpenAI)' },
      { visitor_ip: '172.16.0.5', total_views: 38, unique_pages: 6, first_visit: new Date(Date.now() - 14*86400000).toISOString(), last_visit: new Date(Date.now() - 1*86400000).toISOString(), pages_visited: ['/', '/listings', '/about', '/listings/2', '/listings/3', '/contact'], user_agents: ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'], city: 'Newport Beach', region: 'CA', country: 'US', is_bot: false, bot_name: null },
      { visitor_ip: '10.0.0.8', total_views: 95, unique_pages: 22, first_visit: new Date(Date.now() - 5*86400000).toISOString(), last_visit: new Date().toISOString(), pages_visited: ['/', '/listings', '/about', '/resources'], user_agents: ['Googlebot/2.1 (+http://www.google.com/bot.html)'], city: null, region: null, country: null, is_bot: true, bot_name: 'Googlebot' },
      { visitor_ip: '192.168.2.10', total_views: 27, unique_pages: 5, first_visit: new Date(Date.now() - 3*86400000).toISOString(), last_visit: new Date(Date.now() - 86400000).toISOString(), pages_visited: ['/', '/listings', '/home-value', '/about', '/contact'], user_agents: ['Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'], city: 'Costa Mesa', region: 'CA', country: 'US', is_bot: false, bot_name: null },
      { visitor_ip: '10.0.0.15', total_views: 67, unique_pages: 18, first_visit: new Date(Date.now() - 4*86400000).toISOString(), last_visit: new Date().toISOString(), pages_visited: ['/', '/listings', '/about'], user_agents: ['ClaudeBot/1.0'], city: null, region: null, country: null, is_bot: true, bot_name: 'ClaudeBot (Anthropic)' },
      { visitor_ip: '192.168.3.22', total_views: 19, unique_pages: 4, first_visit: new Date(Date.now() - 1*86400000).toISOString(), last_visit: new Date().toISOString(), pages_visited: ['/', '/listings', '/listings/1', '/contact'], user_agents: ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15'], city: 'Laguna Beach', region: 'CA', country: 'US', is_bot: false, bot_name: null },
      { visitor_ip: '10.0.0.20', total_views: 54, unique_pages: 15, first_visit: new Date(Date.now() - 6*86400000).toISOString(), last_visit: new Date().toISOString(), pages_visited: ['/', '/listings', '/about', '/resources'], user_agents: ['Bingbot/2.0'], city: null, region: null, country: 'US', is_bot: true, bot_name: 'Bingbot' },
      { visitor_ip: '192.168.4.33', total_views: 12, unique_pages: 3, first_visit: new Date(Date.now() - 10*86400000).toISOString(), last_visit: new Date(Date.now() - 8*86400000).toISOString(), pages_visited: ['/', '/about', '/contact'], user_agents: ['Mozilla/5.0 (Linux; Android 14)'], city: 'Huntington Beach', region: 'CA', country: 'US', is_bot: false, bot_name: null },
      { visitor_ip: '10.0.0.25', total_views: 43, unique_pages: 12, first_visit: new Date(Date.now() - 3*86400000).toISOString(), last_visit: new Date().toISOString(), pages_visited: ['/', '/listings', '/about'], user_agents: ['facebookexternalhit/1.1'], city: null, region: null, country: null, is_bot: true, bot_name: 'Facebook' },
    ],
    listings: [
      {
        listing_id: '1',
        listing_address: '24 Seaside Vista',
        listing_city: 'Newport Beach',
        total_views: 187,
        unique_viewers: 94,
        avg_time_spent: 145,
        top_viewer_locations: [
          { city: 'Irvine', region: 'CA', country: 'US', count: 34 },
          { city: 'Newport Beach', region: 'CA', country: 'US', count: 28 },
          { city: 'Los Angeles', region: 'CA', country: 'US', count: 15 }
        ]
      },
      {
        listing_id: '2',
        listing_address: '156 Harbor Blvd',
        listing_city: 'Costa Mesa',
        total_views: 142,
        unique_viewers: 78,
        avg_time_spent: 98,
        top_viewer_locations: [
          { city: 'Costa Mesa', region: 'CA', country: 'US', count: 22 },
          { city: 'Irvine', region: 'CA', country: 'US', count: 19 },
          { city: 'Huntington Beach', region: 'CA', country: 'US', count: 12 }
        ]
      },
      {
        listing_id: '3',
        listing_address: '8901 Pacific Coast Hwy',
        listing_city: 'Laguna Beach',
        total_views: 119,
        unique_viewers: 67,
        avg_time_spent: 203,
        top_viewer_locations: [
          { city: 'Los Angeles', region: 'CA', country: 'US', count: 25 },
          { city: 'San Diego', region: 'CA', country: 'US', count: 14 },
          { city: 'Irvine', region: 'CA', country: 'US', count: 11 }
        ]
      },
      {
        listing_id: '4',
        listing_address: '3200 Bayside Dr',
        listing_city: 'Corona del Mar',
        total_views: 95,
        unique_viewers: 52,
        avg_time_spent: 176,
        top_viewer_locations: [
          { city: 'Newport Beach', region: 'CA', country: 'US', count: 18 },
          { city: 'Irvine', region: 'CA', country: 'US', count: 13 },
          { city: 'Santa Ana', region: 'CA', country: 'US', count: 8 }
        ]
      },
      {
        listing_id: '5',
        listing_address: '445 University Ave',
        listing_city: 'Irvine',
        total_views: 78,
        unique_viewers: 41,
        avg_time_spent: 122,
        top_viewer_locations: [
          { city: 'Irvine', region: 'CA', country: 'US', count: 20 },
          { city: 'Tustin', region: 'CA', country: 'US', count: 9 },
          { city: 'Lake Forest', region: 'CA', country: 'US', count: 5 }
        ]
      },
      {
        listing_id: '6',
        listing_address: '7120 Edinger Ave',
        listing_city: 'Huntington Beach',
        total_views: 63,
        unique_viewers: 35,
        avg_time_spent: 87,
        top_viewer_locations: [
          { city: 'Huntington Beach', region: 'CA', country: 'US', count: 14 },
          { city: 'Fountain Valley', region: 'CA', country: 'US', count: 8 },
          { city: 'Westminster', region: 'CA', country: 'US', count: 5 }
        ]
      }
    ]
  };
}

function generateMockListingDetail(listingId) {
  const mockData = generateMockAnalytics();
  const listing = mockData.listings.find(l => l.listing_id === listingId) || mockData.listings[0];
  const viewsByDay = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    viewsByDay.push({
      date: d.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 15) + 1
    });
  }
  return {
    totalViews: listing.total_views,
    uniqueViewers: listing.unique_viewers,
    avgTimeSpent: listing.avg_time_spent,
    viewsByDay,
    viewerLocations: listing.top_viewer_locations
  };
}

function formatTimeSpent(seconds) {
  if (!seconds || seconds === 0) return '0s';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

async function verifyToken(token) {
  if (!token) return false;

  if (!import.meta.env.PROD && token === 'dev-token') return true;

  try {
    const res = await fetch(`/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', token })
    });
    const data = await res.json();
    return data.valid === true;
  } catch {
    return false;
  }
}

function LoginForm({ onLogin }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!import.meta.env.PROD && password === 'password') {
      localStorage.setItem('admin_token', 'dev-token');
      onLogin();
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password })
      });
      
      const data = await res.json();
      
      if (data.success && data.token) {
        localStorage.setItem('admin_token', data.token);
        onLogin();
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-primary-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 text-sm mt-2">Enter your password to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter admin password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'Cheryl Newton',
    title: 'Broker Associate',
    phone: '(949) 463-2121',
    email: 'cheryl@newton4.homes',
    bio: 'With over 20 years of experience in Orange County real estate...',
    dreNumber: '00576950'
  });
  const [listings, setListings] = useState([]);
  const [showTemplates, setShowTemplates] = useState(true);
  const [showTemplateTestimonials, setShowTemplateTestimonials] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [listingAnalytics, setListingAnalytics] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [usersData, setUsersData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [analyticsView, setAnalyticsView] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormType, setAddFormType] = useState(null);
  const [editingListing, setEditingListing] = useState(null);
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', location: '', text: '', rating: 5, date: new Date().getFullYear().toString() });
  const [badgeCounts, setBadgeCounts] = useState({ messages: 0, homeValue: 0, neighborhood: 0 });
  const [readLeads, setReadLeads] = useState({});

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/contact/${leadId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const remaining = leads.filter(l => l.id !== leadId);
        setLeads(remaining);
        const updated = { ...readLeads };
        delete updated[leadId];
        setReadLeads(updated);
        const newMessages = remaining.filter(l => l.status === 'new' && l.form_type !== 'valuation' && l.form_type !== 'neighborhood_interest' && !l.read_at).length;
        const newHomeValue = remaining.filter(l => l.status === 'new' && l.form_type === 'valuation' && !l.read_at).length;
        const newNeighborhood = remaining.filter(l => l.status === 'new' && l.form_type === 'neighborhood_interest' && !l.read_at).length;
        setBadgeCounts({ messages: newMessages, homeValue: newHomeValue, neighborhood: newNeighborhood });
        setMessage('Lead deleted successfully');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
      setMessage('Failed to delete lead');
      setMessageType('error');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const markLeadRead = async (e, leadId, leadType) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/contact/${leadId}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const dateStr = new Date(data.lead.read_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        setReadLeads(prev => ({ ...prev, [leadId]: dateStr }));
        if (leadType === 'messages') setBadgeCounts(prev => ({ ...prev, messages: Math.max(0, prev.messages - 1) }));
        if (leadType === 'homeValue') setBadgeCounts(prev => ({ ...prev, homeValue: Math.max(0, prev.homeValue - 1) }));
        if (leadType === 'neighborhood') setBadgeCounts(prev => ({ ...prev, neighborhood: Math.max(0, prev.neighborhood - 1) }));
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error('Mark read failed:', res.status, errData);
      }
    } catch (err) {
      console.error('Failed to mark lead as read:', err);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        const s = data.settings || {};
        setShowTemplates(s.hideTemplateListings !== 'true');
        setShowTemplateTestimonials(s.hideTemplateTestimonials !== 'true');
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const loadListings = async () => {
    try {
      const res = await fetch('/api/listings');
      const data = await res.json().catch(() => ({ error: 'Server returned invalid response' }));

      if (!res.ok || data.error) {
        const errMsg = data.error || 'Failed to load listings';
        setMessage(errMsg);
        setMessageType('error');
        setTimeout(() => setMessage(''), 10000);
        return;
      }

      setListings(data.listings || []);
    } catch (err) {
      console.error('Failed to load listings:', err);
      setMessage('Failed to connect to server. Check your internet connection.');
      setMessageType('error');
    }
  };

  useEffect(() => {
    loadListings();
    loadSettings();
  }, []);

  const loadLeads = async () => {
    setLeadsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/contact`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const allLeads = data.leads || [];
        setLeads(allLeads);
        const readMap = {};
        allLeads.forEach(l => {
          if (l.read_at) {
            readMap[l.id] = new Date(l.read_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
        });
        setReadLeads(readMap);
        const newMessages = allLeads.filter(l => l.status === 'new' && l.form_type !== 'valuation' && l.form_type !== 'neighborhood_interest' && !l.read_at).length;
        const newHomeValue = allLeads.filter(l => l.status === 'new' && l.form_type === 'valuation' && !l.read_at).length;
        const newNeighborhood = allLeads.filter(l => l.status === 'new' && l.form_type === 'neighborhood_interest' && !l.read_at).length;
        setBadgeCounts(prev => ({ ...prev, messages: newMessages, homeValue: newHomeValue, neighborhood: newNeighborhood }));
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLeadsLoading(false);
    }
  };

  const loadTestimonials = async () => {
    setTestimonialsLoading(true);
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const handleAddTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.text) {
      setMessage('Name and testimonial text are required');
      setMessageType('error');
      setTimeout(() => setMessage(''), 4000);
      return;
    }
    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newTestimonial)
      });
      if (res.ok) {
        setNewTestimonial({ name: '', location: '', text: '', rating: 5, date: new Date().getFullYear().toString() });
        await loadTestimonials();
        setMessage('Testimonial added successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 4000);
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessage(errData.error || 'Failed to add testimonial');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error adding testimonial: ' + err.message);
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await loadTestimonials();
        setMessage('Testimonial deleted');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error deleting testimonial: ' + err.message);
      setMessageType('error');
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    if (activeTab === 'messages' || activeTab === 'home-value-leads' || activeTab === 'neighborhood-leads') {
      loadLeads();
    }
    if (activeTab === 'testimonials') {
      loadTestimonials();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'analytics') return;
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        if (!import.meta.env.PROD) {
          await new Promise(r => setTimeout(r, 500));
          const mock = generateMockAnalytics();
          setAnalyticsData(mock.summary);
          setListingAnalytics(mock.listings);
          setUsersData(mock.users);
        } else {
          const token = localStorage.getItem('admin_token');
          const headers = { 'Authorization': `Bearer ${token}` };
          const [summaryRes, listingsRes, usersRes] = await Promise.all([
            fetch(`/api/analytics?action=summary`, { headers }),
            fetch(`/api/analytics?action=listings`, { headers }),
            fetch(`/api/analytics?action=users`, { headers })
          ]);
          const summaryData = await summaryRes.json();
          const listingsData = await listingsRes.json();
          const usersDataRes = await usersRes.json();
          setAnalyticsData(summaryData);
          setListingAnalytics(listingsData.listings || []);
          setUsersData(usersDataRes.users || []);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, [activeTab]);

  const handleSelectListing = async (listing) => {
    setAnalyticsLoading(true);
    try {
      if (!import.meta.env.PROD) {
        await new Promise(r => setTimeout(r, 300));
        const detail = generateMockListingDetail(listing.listing_id);
        setSelectedListing({ ...listing, detail });
      } else {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`/api/analytics?action=listing_detail&listingId=${listing.listing_id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const detail = await res.json();
        setSelectedListing({ ...listing, detail });
      }
    } catch (err) {
      console.error('Failed to fetch listing detail:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage('Profile saved successfully!');
    setMessageType('success');
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSyncMLS = async () => {
    if (!import.meta.env.PROD) {
      setMessage('MLS sync is available in production only. Add SPARK_API_KEY (Bridge API token) in Netlify environment variables.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    setSaving(true);
    setMessage('Syncing listings from MLS...');
    setMessageType('success');
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'sync' })
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Successfully synced ${data.count} listings from MLS!`);
        setMessageType('success');
        if (data.listings) {
          setListings(data.listings);
        }
      } else {
        setMessage(data.error || 'MLS sync failed. Check SPARK_API_KEY in Netlify environment variables.');
        setMessageType('error');
      }
    } catch {
      setMessage('MLS sync failed. Check your network connection and API credentials.');
      setMessageType('error');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 8000);
    }
  };

  const handleSaveListing = async (listingData) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      const url = editingListing ? `/api/listings/${editingListing.id}` : `/api/listings`;
      const method = editingListing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(listingData)
      });
      if (res.ok) {
        setShowAddForm(false);
        setEditingListing(null);
        await loadListings();
        setMessage(editingListing ? 'Listing updated successfully!' : 'Listing added successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 4000);
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessage(errData.error || 'Failed to save listing');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error saving listing: ' + err.message);
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await loadListings();
        setMessage('Listing deleted');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error deleting listing: ' + err.message);
      setMessageType('error');
    }
  };

  const neighborhoodLeads = leads.filter(l => l.form_type === 'neighborhood_interest');
  const contactLeads = leads.filter(l => l.form_type !== 'valuation' && l.form_type !== 'neighborhood_interest');
  const homeValueLeads = leads.filter(l => l.form_type === 'valuation');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'listings', label: 'Listings', icon: Home },
    { id: 'add-listing', label: 'Add Listing', icon: Plus },
    { id: 'messages', label: 'Messages', icon: Mail, badge: badgeCounts.messages },
    { id: 'home-value-leads', label: 'Home Value', icon: TrendingUp, badge: badgeCounts.homeValue },
    { id: 'neighborhood-leads', label: 'Neighborhood', icon: MapPin, badge: badgeCounts.neighborhood },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {message && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
            <div className={`px-6 py-4 rounded-xl shadow-2xl text-white font-medium flex items-center gap-3 min-w-[300px] max-w-[500px] ${
              messageType === 'error' ? 'bg-red-600' : 'bg-green-600'
            }`}>
              <span className="text-lg">{messageType === 'error' ? '✕' : '✓'}</span>
              <span>{message}</span>
              <button onClick={() => setMessage('')} className="ml-auto text-white/80 hover:text-white">
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          <aside className="w-64 bg-white rounded-xl shadow-lg p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="flex-1">{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => setProfile({...profile, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">DRE License Number</label>
                      <input
                        type="text"
                        value={profile.dreNumber}
                        onChange={(e) => setProfile({...profile, dreNumber: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div>
                {editingListing && (
                  <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <AddListingForm
                      listing={editingListing}
                      onSave={handleSaveListing}
                      onCancel={() => { setEditingListing(null); }}
                    />
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Manage Listings</h2>
                    <div className="flex gap-3">
                      <button
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem('admin_token');
                            setMessage('Repairing database...');
                            setMessageType('success');
                            const res = await fetch('/api/listings?action=cleanup', {
                              headers: { 'Authorization': `Bearer ${token}` }
                            });
                            const data = await res.json();
                            if (data.success) {
                              setMessage(`Database repaired. ${data.totalListings} listing(s) found.`);
                              setMessageType('success');
                              await loadListings();
                            } else {
                              setMessage(data.error || 'Repair failed');
                              setMessageType('error');
                            }
                          } catch (err) {
                            setMessage('Repair failed: ' + err.message);
                            setMessageType('error');
                          }
                          setTimeout(() => setMessage(''), 6000);
                        }}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <RefreshCw size={18} />
                        Repair DB
                      </button>
                      <button
                        onClick={handleSyncMLS}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <RefreshCw size={18} />
                        Sync from MLS
                      </button>
                    </div>
                  </div>

                  {listings.length > 0 && (
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b text-sm text-gray-500">
                            <th className="pb-3 pr-4">Address</th>
                            <th className="pb-3 pr-4">City</th>
                            <th className="pb-3 pr-4">Price</th>
                            <th className="pb-3 pr-4">Type</th>
                            <th className="pb-3 pr-4">Beds</th>
                            <th className="pb-3 pr-4">Baths</th>
                            <th className="pb-3 pr-4">Sq Ft</th>
                            <th className="pb-3 pr-4">Status</th>
                            <th className="pb-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listings.map((listing, i) => (
                            <tr key={listing.id || i} className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-primary-50 transition-colors`}>
                              <td className="py-3 pr-4 font-medium text-gray-900">{listing.address}</td>
                              <td className="py-3 pr-4 text-gray-600">{listing.city}</td>
                              <td className="py-3 pr-4 text-gray-900 font-medium">${(listing.price || 0).toLocaleString()}</td>
                              <td className="py-3 pr-4 text-gray-600">{listing.property_type}</td>
                              <td className="py-3 pr-4 text-gray-600">{listing.beds}</td>
                              <td className="py-3 pr-4 text-gray-600">{(listing.baths_full || 0) + (listing.baths_three_quarter || 0) + (listing.baths_half || 0)}</td>
                              <td className="py-3 pr-4 text-gray-600">{(listing.sqft || 0).toLocaleString()}</td>
                              <td className="py-3 pr-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${listing.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {listing.status}
                                </span>
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setEditingListing(listing)}
                                    className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteListing(listing.id)}
                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="text-sm text-gray-400 mt-4">{listings.length} listings</p>
                    </div>
                  )}

                  {listings.length === 0 && (
                    <div className="bg-gray-50 rounded-lg p-6 text-center mb-6">
                      <Home className="mx-auto text-gray-400 mb-3" size={40} />
                      <p className="text-gray-500 text-sm">
                        No listings yet. Click '+ Add Listing' to create your first property listing.
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                  <button
                    onClick={async () => {
                      const newVal = !showTemplates;
                      setShowTemplates(newVal);
                      try {
                        const token = localStorage.getItem('admin_token');
                        await fetch('/api/settings', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                          body: JSON.stringify({ key: 'hideTemplateListings', value: newVal ? 'false' : 'true' })
                        });
                      } catch (err) { console.error('Failed to save setting:', err); }
                    }}
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-2 transition-colors"
                  >
                    {showTemplates ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showTemplates ? 'Hide Template Listings' : 'Show Template Listings'}
                  </button>

                  {showTemplates && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-400 mb-3">These are sample listings to show what the table looks like. They are not published on the site.</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b text-sm text-gray-500">
                              <th className="pb-3 pr-4">Address</th>
                              <th className="pb-3 pr-4">City</th>
                              <th className="pb-3 pr-4">Price</th>
                              <th className="pb-3 pr-4">Beds</th>
                              <th className="pb-3 pr-4">Baths</th>
                              <th className="pb-3 pr-4">Sq Ft</th>
                              <th className="pb-3">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {templateListings.map((listing, i) => (
                              <tr key={listing.id} className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} opacity-75`}>
                                <td className="py-3 pr-4 font-medium text-gray-900">{listing.address}</td>
                                <td className="py-3 pr-4 text-gray-600">{listing.city}</td>
                                <td className="py-3 pr-4 text-gray-900 font-medium">${listing.price.toLocaleString()}</td>
                                <td className="py-3 pr-4 text-gray-600">{listing.beds}</td>
                                <td className="py-3 pr-4 text-gray-600">{listing.baths}</td>
                                <td className="py-3 pr-4 text-gray-600">{listing.sqft.toLocaleString()}</td>
                                <td className="py-3">
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Template</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'add-listing' && (
              <div>
                {!addFormType && (
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Add New Listing</h2>
                    <p className="text-gray-500 mb-8">Choose a listing type to get started.</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <button
                        onClick={() => setAddFormType('web')}
                        className="group border-2 border-gray-200 rounded-xl p-8 text-left hover:border-primary-500 hover:shadow-lg transition-all"
                      >
                        <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                          <FileText size={28} className="text-primary-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Add Web Listing</h3>
                        <p className="text-sm text-gray-500">
                          Simplified form for website display. Quick entry with just the essential property details, description, and photos.
                        </p>
                        <span className="inline-block mt-4 text-primary-600 font-medium text-sm group-hover:underline">Get Started &rarr;</span>
                      </button>

                      <button
                        onClick={() => setAddFormType('mls')}
                        className="group border-2 border-gray-200 rounded-xl p-8 text-left hover:border-primary-500 hover:shadow-lg transition-all"
                      >
                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                          <Building2 size={28} className="text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Add MLS Listing</h3>
                        <p className="text-sm text-gray-500">
                          Full CRMLS-style form with all MLS fields. Includes Status, Basics, Features, Land/Terms, Green, ADU, Open House, and more.
                        </p>
                        <span className="inline-block mt-4 text-blue-600 font-medium text-sm group-hover:underline">Get Started &rarr;</span>
                      </button>
                    </div>
                  </div>
                )}

                {addFormType === 'web' && (
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <AddWebListingForm
                      onSave={async (data) => {
                        await handleSaveListing(data);
                        setAddFormType(null);
                      }}
                      onCancel={() => setAddFormType(null)}
                    />
                  </div>
                )}

                {addFormType === 'mls' && (
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <AddMLSListingForm
                      onSave={async (data) => {
                        await handleSaveListing(data);
                        setAddFormType(null);
                      }}
                      onCancel={() => setAddFormType(null)}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Messages & Leads</h2>
                  <button
                    onClick={loadLeads}
                    disabled={leadsLoading}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <RefreshCw size={18} className={leadsLoading ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>

                {leadsLoading && contactLeads.length === 0 && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                )}

                {!leadsLoading && contactLeads.length === 0 && (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Mail className="mx-auto text-gray-400 mb-3" size={40} />
                    <p className="text-gray-500">No messages yet. When visitors submit the contact form, their messages will appear here.</p>
                  </div>
                )}

                {contactLeads.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">{contactLeads.length} message{contactLeads.length !== 1 ? 's' : ''}</p>
                    {contactLeads.map((lead, i) => (
                      <div key={lead.id || i} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{lead.name}</h3>
                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                              <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-primary-600">
                                <Mail size={14} />
                                {lead.email}
                              </a>
                              {lead.phone && (
                                <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-primary-600">
                                  <Phone size={14} />
                                  {lead.phone}
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {lead.status === 'new' && !readLeads[lead.id] ? (
                              <button
                                type="button"
                                onClick={(e) => markLeadRead(e, lead.id, 'messages')}
                                className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors border-none"
                                title="Click to mark as read"
                              >
                                new
                              </button>
                            ) : readLeads[lead.id] ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {readLeads[lead.id]}
                              </span>
                            ) : (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                lead.status === 'contacted' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {lead.status}
                              </span>
                            )}
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        {lead.message && (() => {
                          const titleMatch = lead.message.match(/^\[(.+?)\]\s*([\s\S]*)$/);
                          const msgTitle = titleMatch ? titleMatch[1] : null;
                          const msgBody = titleMatch ? titleMatch[2] : lead.message;
                          return (
                            <div className="bg-gray-50 rounded-lg p-3 text-sm mb-3">
                              {msgTitle && <p className="font-semibold text-gray-900 mb-1">{msgTitle}</p>}
                              {msgBody && <p className="text-gray-700">{msgBody}</p>}
                            </div>
                          );
                        })()}
                        <div className="flex justify-between items-center">
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded">Source: {lead.source || '/'}</span>
                            {lead.property_address && <span className="bg-gray-100 px-2 py-1 rounded">Property: {lead.property_address}</span>}
                            {lead.buying_timeline && <span className="bg-gray-100 px-2 py-1 rounded">Timeline: {lead.buying_timeline}</span>}
                            {lead.price_range && <span className="bg-gray-100 px-2 py-1 rounded">Budget: {lead.price_range}</span>}
                          </div>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                            title="Delete message"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'home-value-leads' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Home Value Requests</h2>
                  <button
                    onClick={loadLeads}
                    disabled={leadsLoading}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <RefreshCw size={18} className={leadsLoading ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>

                {leadsLoading && homeValueLeads.length === 0 && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                )}

                {!leadsLoading && homeValueLeads.length === 0 && (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <TrendingUp className="mx-auto text-gray-400 mb-3" size={40} />
                    <p className="text-gray-500">No home value requests yet. When visitors submit the "What's My Home Worth?" form, their requests will appear here.</p>
                  </div>
                )}

                {homeValueLeads.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">{homeValueLeads.length} request{homeValueLeads.length !== 1 ? 's' : ''}</p>
                    {homeValueLeads.map((lead, i) => (
                      <div key={lead.id || i} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{lead.name}</h3>
                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                              <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-primary-600">
                                <Mail size={14} />
                                {lead.email}
                              </a>
                              {lead.phone && (
                                <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-primary-600">
                                  <Phone size={14} />
                                  {lead.phone}
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {lead.status === 'new' && !readLeads[lead.id] ? (
                              <button
                                type="button"
                                onClick={(e) => markLeadRead(e, lead.id, 'homeValue')}
                                className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors border-none"
                                title="Click to mark as read"
                              >
                                new
                              </button>
                            ) : readLeads[lead.id] ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {readLeads[lead.id]}
                              </span>
                            ) : (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                lead.status === 'contacted' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {lead.status}
                              </span>
                            )}
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        {lead.property_address && (
                          <div className="bg-blue-50 rounded-lg p-3 mb-3">
                            <p className="text-sm font-medium text-blue-900">Property Address</p>
                            <p className="text-blue-700">{lead.property_address}</p>
                          </div>
                        )}
                        {lead.message && (
                          <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm mb-3">{lead.message}</p>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded">Source: {lead.source || '/'}</span>
                            {lead.price_range && <span className="bg-gray-100 px-2 py-1 rounded">Est. Value: {lead.price_range}</span>}
                          </div>
                          <div className="flex items-center gap-3">
                            {lead.property_address && (
                              <button
                                onClick={() => {
                                  const query = encodeURIComponent(lead.property_address + ' comparable sales');
                                  window.open(`https://www.google.com/search?q=${query}`, '_blank');
                                }}
                                className="text-xs font-medium px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                              >
                                Run Comp
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="text-red-400 hover:text-red-600 transition-colors p-1"
                              title="Delete request"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'neighborhood-leads' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Neighborhood Interest</h2>
                  <button
                    onClick={loadLeads}
                    disabled={leadsLoading}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <RefreshCw size={18} className={leadsLoading ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>

                {leadsLoading && neighborhoodLeads.length === 0 && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                )}

                {!leadsLoading && neighborhoodLeads.length === 0 && (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <MapPin className="mx-auto text-gray-400 mb-3" size={40} />
                    <p className="text-gray-500">No neighborhood inquiries yet. When visitors submit the "Interested in [City]?" forms on neighborhood pages, their inquiries will appear here.</p>
                  </div>
                )}

                {neighborhoodLeads.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">{neighborhoodLeads.length} inquir{neighborhoodLeads.length !== 1 ? 'ies' : 'y'}</p>
                    {neighborhoodLeads.map((lead, i) => (
                      <div key={lead.id || i} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{lead.name}</h3>
                            {lead.source && (
                              <p className="text-sm font-medium text-purple-700 flex items-center gap-1 mt-0.5">
                                <MapPin size={14} />
                                {lead.source.replace('/neighborhoods/', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                              <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-primary-600">
                                <Mail size={14} />
                                {lead.email}
                              </a>
                              {lead.phone && (
                                <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-primary-600">
                                  <Phone size={14} />
                                  {lead.phone}
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {lead.status === 'new' && !readLeads[lead.id] ? (
                              <button
                                type="button"
                                onClick={(e) => markLeadRead(e, lead.id, 'neighborhood')}
                                className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors border-none"
                                title="Click to mark as read"
                              >
                                new
                              </button>
                            ) : readLeads[lead.id] ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {readLeads[lead.id]}
                              </span>
                            ) : (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                lead.status === 'contacted' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {lead.status}
                              </span>
                            )}
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        {lead.message && (
                          <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm mb-3">{lead.message}</p>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            {lead.buying_timeline && <span className="bg-gray-100 px-2 py-1 rounded">Timeline: {lead.buying_timeline}</span>}
                            {lead.price_range && <span className="bg-gray-100 px-2 py-1 rounded">Budget: {lead.price_range}</span>}
                          </div>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                            title="Delete inquiry"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Testimonial</h2>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                        <input
                          type="text"
                          value={newTestimonial.name}
                          onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="e.g., John & Jane Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={newTestimonial.location}
                          onChange={(e) => setNewTestimonial({...newTestimonial, location: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="e.g., Irvine"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial *</label>
                      <textarea
                        rows={4}
                        value={newTestimonial.text}
                        onChange={(e) => setNewTestimonial({...newTestimonial, text: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="What did the client say about working with you?"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewTestimonial({...newTestimonial, rating: star})}
                              className="p-1"
                            >
                              <Star
                                size={24}
                                className={star <= newTestimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <input
                          type="text"
                          value={newTestimonial.date}
                          onChange={(e) => setNewTestimonial({...newTestimonial, date: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          placeholder="e.g., 2025"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleAddTestimonial}
                      disabled={saving}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Plus size={18} />
                      {saving ? 'Adding...' : 'Add Testimonial'}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Existing Testimonials</h2>
                    <button
                      onClick={loadTestimonials}
                      disabled={testimonialsLoading}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <RefreshCw size={18} className={testimonialsLoading ? 'animate-spin' : ''} />
                      Refresh
                    </button>
                  </div>

                  {testimonialsLoading && testimonials.length === 0 && (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  )}

                  {!testimonialsLoading && testimonials.length === 0 && (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <Star className="mx-auto text-gray-400 mb-3" size={40} />
                      <p className="text-gray-500">No testimonials yet. Add your first client testimonial above.</p>
                    </div>
                  )}

                  {testimonials.length > 0 && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">{testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}</p>
                      {testimonials.map((t) => (
                        <div key={t.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{t.name}</h3>
                                {t.location && <span className="text-sm text-gray-500">{t.location}</span>}
                                {t.date && <span className="text-xs text-gray-400">{t.date}</span>}
                              </div>
                              <div className="flex gap-0.5 mb-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    size={16}
                                    className={star <= (t.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                                  />
                                ))}
                              </div>
                              <p className="text-gray-700 text-sm">{t.text}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteTestimonial(t.id)}
                              className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete testimonial"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <button
                      onClick={async () => {
                        const newVal = !showTemplateTestimonials;
                        setShowTemplateTestimonials(newVal);
                        try {
                          const token = localStorage.getItem('admin_token');
                          await fetch('/api/settings', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({ key: 'hideTemplateTestimonials', value: newVal ? 'false' : 'true' })
                          });
                        } catch (err) { console.error('Failed to save setting:', err); }
                      }}
                      className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-2 transition-colors"
                    >
                      {showTemplateTestimonials ? <EyeOff size={16} /> : <Eye size={16} />}
                      {showTemplateTestimonials ? 'Hide Template Testimonials' : 'Show Template Testimonials'}
                    </button>

                    {showTemplateTestimonials && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-400 mb-3">These are sample testimonials shown on the website when no database testimonials exist.</p>
                        <div className="space-y-3">
                          {templateTestimonials.map((t) => (
                            <div key={t.id} className="border border-gray-200 rounded-lg p-4 opacity-75">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900 text-sm">{t.name}</h3>
                                {t.location && <span className="text-xs text-gray-500">{t.location}</span>}
                                {t.date && <span className="text-xs text-gray-400">{t.date}</span>}
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Template</span>
                              </div>
                              <div className="flex gap-0.5 mb-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    size={14}
                                    className={star <= (t.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                                  />
                                ))}
                              </div>
                              <p className="text-gray-600 text-sm">{t.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">MLS Integration</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Add your SPARK API credentials in Netlify environment variables:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li><code className="bg-gray-200 px-2 py-0.5 rounded">SPARK_API_KEY</code></li>
                      <li><code className="bg-gray-200 px-2 py-0.5 rounded">SPARK_API_SECRET</code></li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Security Settings</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Configure these in Netlify environment variables:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li><code className="bg-gray-200 px-2 py-0.5 rounded">ADMIN_PASSWORD_HASH</code> - SHA256 hash of admin password</li>
                      <li><code className="bg-gray-200 px-2 py-0.5 rounded">SESSION_SECRET</code> - Random secret for token signing</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {analyticsLoading && !analyticsData && (
                  <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  </div>
                )}

                {selectedListing ? (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <button
                        onClick={() => setSelectedListing(null)}
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium"
                      >
                        <ArrowLeft size={18} />
                        Back to Analytics
                      </button>

                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedListing.listing_address}
                      </h2>
                      <p className="text-gray-500 mb-6">{selectedListing.listing_city}</p>

                      {analyticsLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                        </div>
                      ) : selectedListing.detail && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-primary-50 rounded-lg p-4 text-center">
                              <Eye className="mx-auto text-primary-600 mb-2" size={24} />
                              <p className="text-2xl font-bold text-gray-900">{selectedListing.detail.totalViews.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">Total Views</p>
                            </div>
                            <div className="bg-primary-50 rounded-lg p-4 text-center">
                              <Users className="mx-auto text-primary-600 mb-2" size={24} />
                              <p className="text-2xl font-bold text-gray-900">{selectedListing.detail.uniqueViewers.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">Unique Viewers</p>
                            </div>
                            <div className="bg-primary-50 rounded-lg p-4 text-center">
                              <Calendar className="mx-auto text-primary-600 mb-2" size={24} />
                              <p className="text-2xl font-bold text-gray-900">{formatTimeSpent(selectedListing.detail.avgTimeSpent)}</p>
                              <p className="text-sm text-gray-600">Avg Time Spent</p>
                            </div>
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Views by Day (Last 30 Days)</h3>
                          <div className="bg-gray-50 rounded-lg p-4 mb-8">
                            <div className="flex items-end gap-1" style={{ height: '200px' }}>
                              {selectedListing.detail.viewsByDay.map((day, i) => {
                                const maxViews = Math.max(...selectedListing.detail.viewsByDay.map(d => d.views));
                                const heightPct = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
                                return (
                                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                                    <div className="absolute bottom-full mb-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                      {day.date}: {day.views} views
                                    </div>
                                    <div
                                      className="w-full bg-primary-400 hover:bg-primary-500 rounded-t transition-colors min-h-[2px]"
                                      style={{ height: `${heightPct}%` }}
                                    ></div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-400">
                              <span>{selectedListing.detail.viewsByDay[0]?.date}</span>
                              <span>{selectedListing.detail.viewsByDay[selectedListing.detail.viewsByDay.length - 1]?.date}</span>
                            </div>
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Viewer Locations</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="text-left py-3 px-4 font-semibold text-gray-700">City</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Region</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Count</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedListing.detail.viewerLocations.map((loc, i) => (
                                  <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <td className="py-3 px-4">{loc.city || 'Unknown'}</td>
                                    <td className="py-3 px-4">{loc.region || 'Unknown'}</td>
                                    <td className="py-3 px-4">{loc.country || 'Unknown'}</td>
                                    <td className="py-3 px-4 text-right font-medium">{Number(loc.count).toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : analyticsData && (
                  <>
                    <div className="flex gap-2 mb-6">
                      <button onClick={() => { setAnalyticsView('overview'); setSelectedUser(null); }} className={`px-4 py-2 rounded-lg font-medium ${analyticsView === 'overview' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        Overview
                      </button>
                      <button onClick={() => { setAnalyticsView('users'); setSelectedUser(null); }} className={`px-4 py-2 rounded-lg font-medium ${analyticsView === 'users' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        Users
                      </button>
                    </div>

                    {analyticsView === 'users' && usersData && (
                      <>
                        {selectedUser ? (
                          <div className="bg-white rounded-xl shadow-lg p-8">
                            <button
                              onClick={() => setSelectedUser(null)}
                              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium"
                            >
                              <ArrowLeft size={18} />
                              Back to Users
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                              <h2 className="text-xl font-bold text-gray-900">User {selectedUser.index}</h2>
                              {selectedUser.is_bot ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                  <Bot size={14} />
                                  Bot: {selectedUser.bot_name}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                  <User size={14} />
                                  Human
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                              <div className="bg-primary-50 rounded-lg p-4 text-center">
                                <Eye className="mx-auto text-primary-600 mb-2" size={20} />
                                <p className="text-2xl font-bold text-gray-900">{selectedUser.total_views.toLocaleString()}</p>
                                <p className="text-sm text-gray-600">Total Views</p>
                              </div>
                              <div className="bg-primary-50 rounded-lg p-4 text-center">
                                <FileText className="mx-auto text-primary-600 mb-2" size={20} />
                                <p className="text-2xl font-bold text-gray-900">{selectedUser.unique_pages}</p>
                                <p className="text-sm text-gray-600">Unique Pages</p>
                              </div>
                              <div className="bg-primary-50 rounded-lg p-4 text-center">
                                <Calendar className="mx-auto text-primary-600 mb-2" size={20} />
                                <p className="text-sm font-bold text-gray-900">{new Date(selectedUser.first_visit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                <p className="text-sm text-gray-600">First Visit</p>
                              </div>
                              <div className="bg-primary-50 rounded-lg p-4 text-center">
                                <Clock className="mx-auto text-primary-600 mb-2" size={20} />
                                <p className="text-sm font-bold text-gray-900">{new Date(selectedUser.last_visit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                <p className="text-sm text-gray-600">Last Visit</p>
                              </div>
                            </div>

                            {(selectedUser.city || selectedUser.region || selectedUser.country) && (
                              <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                                <div className="flex items-center gap-2 text-gray-700">
                                  <Globe size={16} className="text-gray-500" />
                                  <span>{[selectedUser.city, selectedUser.region, selectedUser.country].filter(Boolean).join(', ')}</span>
                                </div>
                              </div>
                            )}

                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pages Visited</h3>
                            <div className="overflow-x-auto mb-8">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Page</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedUser.pages_visited.map((page, i) => (
                                    <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                      <td className="py-2 px-4 text-gray-500">{i + 1}</td>
                                      <td className="py-2 px-4 font-medium text-gray-900">{page}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-3">User Agent</h3>
                            <div className="space-y-2">
                              {selectedUser.user_agents.map((ua, i) => (
                                <div key={i} className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 font-mono break-all">
                                  {ua}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                                <Users className="mx-auto text-green-600 mb-2" size={24} />
                                <p className="text-2xl font-bold text-gray-900">{usersData.filter(u => !u.is_bot).length}</p>
                                <p className="text-sm text-gray-600">Human Visitors</p>
                              </div>
                              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                                <Bot className="mx-auto text-orange-600 mb-2" size={24} />
                                <p className="text-2xl font-bold text-gray-900">{usersData.filter(u => u.is_bot).length}</p>
                                <p className="text-sm text-gray-600">Bots / AI Crawlers</p>
                              </div>
                              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                                <BarChart2 className="mx-auto text-primary-600 mb-2" size={24} />
                                <p className="text-2xl font-bold text-gray-900">
                                  {usersData.filter(u => !u.is_bot).length > 0
                                    ? `${Math.round((usersData.filter(u => !u.is_bot).length / usersData.length) * 100)}%`
                                    : '0%'}
                                </p>
                                <p className="text-sm text-gray-600">Human Ratio</p>
                              </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-8">
                              <h2 className="text-xl font-bold text-gray-900 mb-6">All Visitors</h2>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-gray-200">
                                      <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Views</th>
                                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Pages Visited</th>
                                      <th className="text-left py-3 px-4 font-semibold text-gray-700">First Visit</th>
                                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Visit</th>
                                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {usersData.map((user, i) => (
                                      <tr
                                        key={user.visitor_ip}
                                        onClick={() => setSelectedUser({ ...user, index: i + 1 })}
                                        className={`border-b border-gray-100 cursor-pointer hover:bg-primary-50 transition-colors ${
                                          user.is_bot
                                            ? 'bg-orange-50'
                                            : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                        }`}
                                      >
                                        <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                                        <td className="py-3 px-4 font-medium text-gray-900">User {i + 1}</td>
                                        <td className="py-3 px-4">
                                          {user.is_bot ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                              <Bot size={12} />
                                              {user.bot_name}
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                              <User size={12} />
                                              Human
                                            </span>
                                          )}
                                        </td>
                                        <td className="py-3 px-4 text-right font-medium text-primary-600">{user.total_views.toLocaleString()}</td>
                                        <td className="py-3 px-4 text-right text-gray-600">{user.unique_pages}</td>
                                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{new Date(user.first_visit).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{new Date(user.last_visit).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                                        <td className="py-3 px-4 text-gray-600">
                                          {[user.city, user.region, user.country].filter(Boolean).join(', ') || '-'}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {analyticsView === 'overview' && (
                      <>
                        <div className="bg-white rounded-xl shadow-lg p-8">
                          <h2 className="text-xl font-bold text-gray-900 mb-6">Overview</h2>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-primary-50 rounded-lg p-5">
                              <div className="flex items-center gap-3 mb-2">
                                <Eye className="text-primary-600" size={20} />
                                <span className="text-sm font-medium text-gray-600">Total Page Views</span>
                              </div>
                              <p className="text-3xl font-bold text-gray-900">{analyticsData.totalPageViews.toLocaleString()}</p>
                            </div>
                            <div className="bg-primary-50 rounded-lg p-5">
                              <div className="flex items-center gap-3 mb-2">
                                <Users className="text-primary-600" size={20} />
                                <span className="text-sm font-medium text-gray-600">Unique Visitors</span>
                              </div>
                              <p className="text-3xl font-bold text-gray-900">{analyticsData.uniqueVisitors.toLocaleString()}</p>
                            </div>
                            <div className="bg-primary-50 rounded-lg p-5">
                              <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="text-primary-600" size={20} />
                                <span className="text-sm font-medium text-gray-600">Views Today</span>
                              </div>
                              <p className="text-3xl font-bold text-gray-900">{analyticsData.viewsToday.toLocaleString()}</p>
                            </div>
                            <div className="bg-primary-50 rounded-lg p-5">
                              <div className="flex items-center gap-3 mb-2">
                                <Calendar className="text-primary-600" size={20} />
                                <span className="text-sm font-medium text-gray-600">Views This Week</span>
                              </div>
                              <p className="text-3xl font-bold text-gray-900">{analyticsData.viewsThisWeek.toLocaleString()}</p>
                            </div>
                            <div className="bg-primary-50 rounded-lg p-5 lg:col-span-4">
                              <div className="flex items-center gap-3 mb-2">
                                <BarChart2 className="text-primary-600" size={20} />
                                <span className="text-sm font-medium text-gray-600">Views This Month</span>
                              </div>
                              <p className="text-3xl font-bold text-gray-900">{analyticsData.viewsThisMonth.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                          <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Pages</h2>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Page</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Views</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {analyticsData.topPages.map((page, i) => (
                                    <tr key={i} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                      <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                                      <td className="py-3 px-4 font-medium text-gray-900">{page.page_path}</td>
                                      <td className="py-3 px-4 text-right font-medium text-primary-600">{Number(page.views).toLocaleString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Traffic (Last 30 Days)</h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-end gap-1" style={{ height: '250px' }}>
                                {analyticsData.trafficByDay.map((day, i) => {
                                  const maxViews = Math.max(...analyticsData.trafficByDay.map(d => d.views));
                                  const heightPct = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
                                  return (
                                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                                      <div className="absolute bottom-full mb-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {day.date}: {day.views} views
                                      </div>
                                      <div
                                        className="w-full bg-primary-500 hover:bg-primary-600 rounded-t transition-colors min-h-[2px]"
                                        style={{ height: `${heightPct}%` }}
                                      ></div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="flex justify-between mt-2 text-xs text-gray-400">
                                <span>{analyticsData.trafficByDay[0]?.date}</span>
                                <span>{analyticsData.trafficByDay[analyticsData.trafficByDay.length - 1]?.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {listingAnalytics && listingAnalytics.length > 0 && (
                          <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Listing Analytics</h2>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Address</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">City</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Views</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Unique Viewers</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Time Spent</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Top Locations</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {listingAnalytics.map((listing, i) => (
                                    <tr
                                      key={listing.listing_id}
                                      onClick={() => handleSelectListing(listing)}
                                      className={`border-b border-gray-100 cursor-pointer hover:bg-primary-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                    >
                                      <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                                      <td className="py-3 px-4 font-medium text-gray-900">{listing.listing_address}</td>
                                      <td className="py-3 px-4 text-gray-600">{listing.listing_city}</td>
                                      <td className="py-3 px-4 text-right font-medium text-primary-600">{listing.total_views.toLocaleString()}</td>
                                      <td className="py-3 px-4 text-right text-gray-600">{listing.unique_viewers.toLocaleString()}</td>
                                      <td className="py-3 px-4 text-right text-gray-600">{formatTimeSpent(listing.avg_time_spent)}</td>
                                      <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1">
                                          {listing.top_viewer_locations.slice(0, 3).map((loc, j) => (
                                            <span key={j} className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                              <Globe size={10} />
                                              {loc.city}, {loc.region}
                                            </span>
                                          ))}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {!import.meta.env.PROD && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-700">
                        <strong>Dev Mode:</strong> Showing demo data. In production, this will display real analytics from your website visitors.
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        const isValid = await verifyToken(token);
        if (isValid) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('admin_token');
        }
      }
      setChecking(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
