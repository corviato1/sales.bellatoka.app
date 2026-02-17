import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock, LogOut, Home, User, Settings, Save, RefreshCw, BarChart2,
  Eye, EyeOff, TrendingUp, Globe, Mail,
  CheckCircle, FileText, Trash2, Terminal, ArrowLeft
} from 'lucide-react';
import { getLogEntries, clearLogEntries, subscribeToLogs } from '../utils/consoleCapture';
import '../styles/Admin.css';

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
    totalPageViews: 1247,
    uniqueVisitors: 423,
    viewsToday: 34,
    viewsThisWeek: 187,
    viewsThisMonth: 892,
    topPages: [
      { page_path: '/', views: 342 },
      { page_path: '/admin', views: 198 },
      { page_path: '/#inquiry', views: 156 },
      { page_path: '/#terpenes', views: 134 },
      { page_path: '/#partnership', views: 89 },
    ],
    trafficByDay
  };
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

    const isDev = process.env.NODE_ENV === 'development';
    if (isDev && password === 'password') {
      localStorage.setItem('bt_admin_token', 'dev-authenticated');
      onLogin();
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/.netlify/functions/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('bt_admin_token', data.token);
        onLogin();
      } else {
        setError(data.error || 'Invalid password. Please try again.');
      }
    } catch {
      if (isDev) {
        setError('Auth server not available. In local dev, use "password" to log in.');
      } else {
        setError('Connection error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-card">
        <div className="login-icon">
          <Lock size={32} />
        </div>
        <h1>Admin Login</h1>
        <p className="login-subtitle">Enter your password to access the Bella Toka admin panel</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="login-field">
            <label>Password</label>
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function ProfileTab({ profile, setProfile, onSave, saving }) {
  return (
    <>
      <div className="admin-header">
        <h1>Brand Profile</h1>
        <p>Manage Bella Toka brand information displayed on the sales page</p>
      </div>
      <div className="admin-card">
        <h2><User size={18} /> Brand Details</h2>
        <div className="profile-form">
          <div className="form-field">
            <label>Brand Name</label>
            <input
              value={profile.brandName}
              onChange={(e) => setProfile({ ...profile, brandName: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Facility Name</label>
            <input
              value={profile.facilityName}
              onChange={(e) => setProfile({ ...profile, facilityName: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Contact Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Phone</label>
            <input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Location</label>
            <input
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>License Number</label>
            <input
              value={profile.licenseNumber}
              onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
            />
          </div>
          <div className="form-field full-width">
            <label>Brand Description</label>
            <textarea
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              rows={4}
            />
          </div>
        </div>
        <div className="btn-row">
          <button className="btn-primary" onClick={onSave} disabled={saving}>
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </>
  );
}

function InquiriesTab() {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const loadInquiries = useCallback(() => {
    const stored = JSON.parse(localStorage.getItem('bt_inquiries') || '[]');
    setInquiries(stored);
  }, []);

  useEffect(() => {
    loadInquiries();
    const handleStorage = (e) => {
      if (e.key === 'bt_inquiries') loadInquiries();
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(loadInquiries, 5000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [loadInquiries]);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    const updated = inquiries.filter(inq => inq.id !== id);
    setInquiries(updated);
    localStorage.setItem('bt_inquiries', JSON.stringify(updated));
    if (selectedInquiry && selectedInquiry.id === id) setSelectedInquiry(null);
  };

  const markAsRead = (id) => {
    const updated = inquiries.map(inq =>
      inq.id === id ? { ...inq, status: 'read', readAt: new Date().toISOString() } : inq
    );
    setInquiries(updated);
    localStorage.setItem('bt_inquiries', JSON.stringify(updated));
  };

  if (selectedInquiry) {
    return (
      <>
        <button className="back-link" onClick={() => setSelectedInquiry(null)}>
          <ArrowLeft size={16} /> Back to Inquiries
        </button>
        <div className="admin-card">
          <h2><FileText size={18} /> Inquiry Details</h2>
          <div className="inquiry-detail-row">
            <span className="detail-label">Business Name</span>
            <span className="detail-value">{selectedInquiry.businessName}</span>
          </div>
          <div className="inquiry-detail-row">
            <span className="detail-label">Contact Name</span>
            <span className="detail-value">{selectedInquiry.contactName}</span>
          </div>
          <div className="inquiry-detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{selectedInquiry.email}</span>
          </div>
          <div className="inquiry-detail-row">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{selectedInquiry.phone || 'N/A'}</span>
          </div>
          <div className="inquiry-detail-row">
            <span className="detail-label">License Number</span>
            <span className="detail-value">{selectedInquiry.licenseNumber}</span>
          </div>
          <div className="inquiry-detail-row">
            <span className="detail-label">Contract Length</span>
            <span className="detail-value">{selectedInquiry.preferredContractLength || 'Not specified'}</span>
          </div>
          <div className="inquiry-detail-row">
            <span className="detail-label">Message</span>
            <span className="detail-value">{selectedInquiry.message || 'No message'}</span>
          </div>
          <div className="inquiry-detail-row">
            <span className="detail-label">Submitted</span>
            <span className="detail-value">{new Date(selectedInquiry.submittedAt).toLocaleString()}</span>
          </div>
          <div className="inquiry-detail-row">
            <span className="detail-label">Status</span>
            <span className="detail-value">
              <span className={`status-badge ${selectedInquiry.status}`}>{selectedInquiry.status}</span>
            </span>
          </div>
          <div className="btn-row">
            {selectedInquiry.status === 'new' && (
              <button className="btn-primary" onClick={() => {
                markAsRead(selectedInquiry.id);
                setSelectedInquiry({ ...selectedInquiry, status: 'read' });
              }}>
                <CheckCircle size={16} /> Mark as Read
              </button>
            )}
            <button className="btn-danger" onClick={() => handleDelete(selectedInquiry.id)}>
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="admin-header">
        <h1>Partner Inquiries</h1>
        <p>View and manage partnership inquiry submissions from the sales page</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Inquiries</div>
          <div className="stat-value">{inquiries.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">New</div>
          <div className="stat-value">{inquiries.filter(i => i.status === 'new').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Read</div>
          <div className="stat-value">{inquiries.filter(i => i.status === 'read').length}</div>
        </div>
      </div>

      <div className="admin-card">
        <h2><Mail size={18} /> All Inquiries</h2>
        {inquiries.length === 0 ? (
          <div className="empty-state">
            <Mail size={48} />
            <h3>No inquiries yet</h3>
            <p>Partnership inquiries from the sales page form will appear here</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="inquiries-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Business</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map(inq => (
                  <tr key={inq.id} onClick={() => {
                    setSelectedInquiry(inq);
                    if (inq.status === 'new') markAsRead(inq.id);
                  }} style={{ cursor: 'pointer' }}>
                    <td><span className={`status-badge ${inq.status}`}>{inq.status}</span></td>
                    <td>{inq.businessName}</td>
                    <td>{inq.contactName}</td>
                    <td>{inq.email}</td>
                    <td>{new Date(inq.submittedAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-danger"
                        onClick={(e) => { e.stopPropagation(); handleDelete(inq.id); }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function AnalyticsTab() {
  const isDev = process.env.NODE_ENV === 'development';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDev) {
      setTimeout(() => {
        setData(generateMockAnalytics());
        setLoading(false);
      }, 600);
    } else {
      setLoading(false);
    }
  }, [isDev]);

  if (loading) {
    return (
      <div className="empty-state">
        <RefreshCw size={32} className="spinning" />
        <h3>Loading analytics...</h3>
      </div>
    );
  }

  if (!isDev && !data) {
    return (
      <>
        <div className="admin-header">
          <h1>Analytics</h1>
          <p>Site traffic and visitor insights</p>
        </div>
        <div className="admin-card">
          <div className="empty-state">
            <BarChart2 size={48} />
            <h3>Analytics Not Connected</h3>
            <p>Connect a live analytics provider to see real visitor data here. No mock data is shown in production.</p>
          </div>
        </div>
      </>
    );
  }

  const maxViews = Math.max(...data.trafficByDay.map(d => d.views), 1);

  return (
    <>
      <div className="admin-header">
        <h1>Analytics</h1>
        <p>Site traffic and visitor insights {isDev && '(demo data — local only)'}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Page Views</div>
          <div className="stat-value">{data.totalPageViews.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Unique Visitors</div>
          <div className="stat-value">{data.uniqueVisitors.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Views Today</div>
          <div className="stat-value">{data.viewsToday}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Views This Week</div>
          <div className="stat-value">{data.viewsThisWeek}</div>
        </div>
      </div>

      <div className="admin-card">
        <h2><TrendingUp size={18} /> Traffic (Last 30 Days)</h2>
        <div className="chart-bar-container">
          {data.trafficByDay.map((day, i) => (
            <div
              key={i}
              className="chart-bar"
              style={{ height: `${(day.views / maxViews) * 100}%` }}
            >
              <div className="chart-tooltip">{day.date}: {day.views} views</div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2><Globe size={18} /> Top Pages</h2>
        <ul className="analytics-top-pages">
          {data.topPages.map((page, i) => (
            <li key={i}>
              <span className="page-path">{page.page_path}</span>
              <span className="page-views">{page.views} views</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function ConsoleLogsTab() {
  const [logs, setLogs] = useState(getLogEntries());
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToLogs((entries) => {
      setLogs(entries);
    });
    return unsubscribe;
  }, []);

  const filteredLogs = logs.filter(entry => {
    if (filter !== 'all' && entry.type !== filter) return false;
    if (search && !entry.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <>
      <div className="admin-header">
        <h1>Console Logs</h1>
        <p>
          Live console output for troubleshooting{' '}
          <span className="console-live-dot" title="Live"></span>
        </p>
      </div>

      <div className="admin-card">
        <div className="console-controls">
          <button
            className={`console-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({logs.length})
          </button>
          <button
            className={`console-filter-btn ${filter === 'log' ? 'active' : ''}`}
            onClick={() => setFilter('log')}
          >
            Log ({logs.filter(l => l.type === 'log').length})
          </button>
          <button
            className={`console-filter-btn ${filter === 'info' ? 'active' : ''}`}
            onClick={() => setFilter('info')}
          >
            Info ({logs.filter(l => l.type === 'info').length})
          </button>
          <button
            className={`console-filter-btn ${filter === 'warn' ? 'active-warn' : ''}`}
            onClick={() => setFilter('warn')}
          >
            Warn ({logs.filter(l => l.type === 'warn').length})
          </button>
          <button
            className={`console-filter-btn ${filter === 'error' ? 'active-error' : ''}`}
            onClick={() => setFilter('error')}
          >
            Error ({logs.filter(l => l.type === 'error').length})
          </button>
          <input
            type="text"
            className="console-search"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-danger" onClick={clearLogEntries} title="Clear all logs">
            <Trash2 size={14} /> Clear
          </button>
        </div>

        <div className="console-log-list">
          {filteredLogs.length === 0 ? (
            <div className="console-empty">
              {logs.length === 0
                ? 'No console output captured yet. Navigate the sales page to generate logs.'
                : 'No logs match your filter criteria.'}
            </div>
          ) : (
            filteredLogs.map(entry => (
              <div key={entry.id} className="console-entry">
                <span className="console-time">{formatTime(entry.timestamp)}</span>
                <span className={`console-type ${entry.type}`}>{entry.type}</span>
                <span className={`console-msg ${entry.type}`}>{entry.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('bt_settings') || '{}');
    return {
      emailNotifications: saved.emailNotifications !== false,
      autoResponseEnabled: saved.autoResponseEnabled || false,
      maintenanceMode: saved.maintenanceMode || false,
      darkMode: saved.darkMode || false,
    };
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('bt_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <div className="admin-header">
        <h1>Settings</h1>
        <p>Configure admin panel behavior and preferences</p>
      </div>

      <div className="admin-card">
        <div className="settings-section">
          <h3>Notifications</h3>
          <div className="settings-row">
            <div className="settings-label">
              Email Notifications
              <small>Receive email when new inquiry is submitted</small>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => toggleSetting('emailNotifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="settings-row">
            <div className="settings-label">
              Auto-Response
              <small>Automatically send confirmation email to inquiries</small>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.autoResponseEnabled}
                onChange={() => toggleSetting('autoResponseEnabled')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Site</h3>
          <div className="settings-row">
            <div className="settings-label">
              Maintenance Mode
              <small>Show maintenance page instead of sales page</small>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={() => toggleSetting('maintenanceMode')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Danger Zone</h3>
          <div className="settings-row">
            <div className="settings-label">
              Clear All Inquiries
              <small>Permanently delete all stored inquiry data</small>
            </div>
            <button className="btn-danger" onClick={() => {
              if (window.confirm('Are you sure? This will delete ALL inquiry data.')) {
                localStorage.removeItem('bt_inquiries');
                window.location.reload();
              }
            }}>
              <Trash2 size={14} /> Clear Data
            </button>
          </div>
          <div className="settings-row">
            <div className="settings-label">
              Clear Console Logs
              <small>Clear all captured console log entries</small>
            </div>
            <button className="btn-danger" onClick={() => {
              clearLogEntries();
            }}>
              <Trash2 size={14} /> Clear Logs
            </button>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn-primary" onClick={handleSave}>
            <Save size={16} /> Save Settings
          </button>
          {saved && <span style={{ color: '#166534', fontSize: '0.875rem', alignSelf: 'center' }}>Settings saved!</span>}
        </div>
      </div>
    </>
  );
}

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('bt_profile') || '{}');
    return {
      brandName: saved.brandName || 'Bella Toka',
      facilityName: saved.facilityName || 'R&D Facility 3',
      email: saved.email || 'sales@bellatoka.com',
      phone: saved.phone || '',
      location: saved.location || 'Sonoma County, California',
      licenseNumber: saved.licenseNumber || '',
      description: saved.description || 'Premium craft cannabis cultivated with precision and care. Small-batch excellence for discerning distributors.',
    };
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [inquiryCount, setInquiryCount] = useState(0);

  useEffect(() => {
    const inquiries = JSON.parse(localStorage.getItem('bt_inquiries') || '[]');
    setInquiryCount(inquiries.filter(i => i.status === 'new').length);
  }, [activeTab]);

  const handleSaveProfile = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('bt_profile', JSON.stringify(profile));
      setSaving(false);
      setMessage('Profile saved successfully!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    }, 500);
  };

  const navigate = useNavigate();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'inquiries', label: 'Inquiries', icon: <Mail size={18} />, badge: inquiryCount },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
    { id: 'console', label: 'Console Logs', icon: <Terminal size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">Bella Toka</div>
          <div className="sidebar-tagline">Admin Dashboard</div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate('/')}>
            <Home size={18} /> <span>View Sales Page</span>
          </button>

          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} <span>{tab.label}</span>
              {tab.badge > 0 && <span className="nav-badge">{tab.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => {
            localStorage.removeItem('bt_admin_token');
            onLogout();
          }}>
            <LogOut size={18} /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {message && (
          <div className={`toast-message ${messageType}`}>{message}</div>
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            profile={profile}
            setProfile={setProfile}
            onSave={handleSaveProfile}
            saving={saving}
          />
        )}
        {activeTab === 'inquiries' && <InquiriesTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'console' && <ConsoleLogsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('bt_admin_token');
    if (token === 'authenticated') {
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setAuthenticated(false)} />;
}
