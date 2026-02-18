import React, { useState } from "react";
import "../styles/Dashboard.css";

function DashboardLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const isDev = process.env.NODE_ENV === "development";
    if (isDev && password === "420") {
      localStorage.setItem("bt_dashboard_token", "dev-authenticated");
      onLogin();
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/.netlify/functions/dashboard-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("bt_dashboard_token", data.token);
        onLogin();
      } else {
        setError(data.error || "Invalid password");
      }
    } catch {
      if (isDev) {
        setError("Auth service unavailable. In development, use password: 420");
      } else {
        setError("Unable to connect to authentication service.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-login-page">
      <div className="dashboard-login-card">
        <div className="dashboard-login-header">
          <h1>Bella Toka</h1>
          <p>Commercial Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="dashboard-login-form">
          <label htmlFor="dashboard-password">Password</label>
          <div className="dashboard-password-field">
            <input
              type={showPassword ? "text" : "password"}
              id="dashboard-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your dashboard password"
              required
            />
            <button
              type="button"
              className="dashboard-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {error && <p className="dashboard-login-error">{error}</p>}
          <button type="submit" className="dashboard-login-button" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
        <a href="/" className="dashboard-back-link">← Back to Bella Toka</a>
      </div>
    </div>
  );
}

const mockData = {
  analytics: {
    title: "Data Analytics",
    content: (
      <div className="modal-mock-data">
        <div className="mock-stats-row">
          <div className="mock-stat-box">
            <span className="mock-stat-value">6.2 lbs</span>
            <span className="mock-stat-label">Avg Weekly Yield</span>
          </div>
          <div className="mock-stat-box">
            <span className="mock-stat-value">94.3%</span>
            <span className="mock-stat-label">Quality Score</span>
          </div>
          <div className="mock-stat-box">
            <span className="mock-stat-value">28.7%</span>
            <span className="mock-stat-label">Avg THC</span>
          </div>
          <div className="mock-stat-box">
            <span className="mock-stat-value">3.1%</span>
            <span className="mock-stat-label">Avg Terpenes</span>
          </div>
        </div>
        <h4>Monthly Yield (lbs)</h4>
        <div className="mock-chart">
          <div className="mock-bar-row"><span className="mock-bar-label">Jan</span><div className="mock-bar" style={{width: "78%"}}><span>23.4</span></div></div>
          <div className="mock-bar-row"><span className="mock-bar-label">Feb</span><div className="mock-bar" style={{width: "85%"}}><span>25.6</span></div></div>
          <div className="mock-bar-row"><span className="mock-bar-label">Mar</span><div className="mock-bar" style={{width: "92%"}}><span>27.1</span></div></div>
          <div className="mock-bar-row"><span className="mock-bar-label">Apr</span><div className="mock-bar" style={{width: "80%"}}><span>24.0</span></div></div>
          <div className="mock-bar-row"><span className="mock-bar-label">May</span><div className="mock-bar" style={{width: "88%"}}><span>26.3</span></div></div>
          <div className="mock-bar-row"><span className="mock-bar-label">Jun</span><div className="mock-bar" style={{width: "95%"}}><span>28.5</span></div></div>
        </div>
        <h4>Sales Breakdown</h4>
        <table className="mock-table">
          <thead><tr><th>Channel</th><th>Revenue</th><th>Units</th><th>Trend</th></tr></thead>
          <tbody>
            <tr><td>Direct Contract</td><td>$142,800</td><td>168 lbs</td><td>↑ 12%</td></tr>
            <tr><td>Wholesale</td><td>$67,200</td><td>96 lbs</td><td>↑ 5%</td></tr>
            <tr><td>Premium Reserve</td><td>$38,500</td><td>35 lbs</td><td>↑ 22%</td></tr>
          </tbody>
        </table>
        <h4>Current Grow Cycle — Week 7 of 10</h4>
        <div className="mock-progress-bar">
          <div className="mock-progress-fill" style={{width: "70%"}}></div>
        </div>
        <div className="mock-stats-row">
          <div className="mock-stat-box">
            <span className="mock-stat-value">78°F</span>
            <span className="mock-stat-label">Temperature</span>
          </div>
          <div className="mock-stat-box">
            <span className="mock-stat-value">52%</span>
            <span className="mock-stat-label">Humidity</span>
          </div>
          <div className="mock-stat-box">
            <span className="mock-stat-value">6.3</span>
            <span className="mock-stat-label">pH Level</span>
          </div>
          <div className="mock-stat-box">
            <span className="mock-stat-value">1,180</span>
            <span className="mock-stat-label">PPM (EC)</span>
          </div>
        </div>
        <h4>Feed Schedule — Current Week</h4>
        <table className="mock-table">
          <thead><tr><th>Day</th><th>Nutrients</th><th>Volume</th><th>pH</th></tr></thead>
          <tbody>
            <tr><td>Mon</td><td>Bloom A+B, PK Boost</td><td>4.2 gal</td><td>6.2</td></tr>
            <tr><td>Wed</td><td>Bloom A+B, Cal-Mag</td><td>4.0 gal</td><td>6.3</td></tr>
            <tr><td>Fri</td><td>Bloom A+B, PK Boost, Molasses</td><td>4.5 gal</td><td>6.1</td></tr>
          </tbody>
        </table>
        <h4>Growth Stage Log</h4>
        <div className="mock-timeline">
          <div className="mock-timeline-item mock-timeline-done"><span className="mock-timeline-dot"></span><div><strong>Clone</strong><span>Week 1-2 · Completed</span></div></div>
          <div className="mock-timeline-item mock-timeline-done"><span className="mock-timeline-dot"></span><div><strong>Veg</strong><span>Week 3-4 · Completed</span></div></div>
          <div className="mock-timeline-item mock-timeline-active"><span className="mock-timeline-dot"></span><div><strong>Flower</strong><span>Week 5-10 · In Progress</span></div></div>
          <div className="mock-timeline-item"><span className="mock-timeline-dot"></span><div><strong>Harvest</strong><span>Week 11 · Upcoming</span></div></div>
          <div className="mock-timeline-item"><span className="mock-timeline-dot"></span><div><strong>Cure & Package</strong><span>Week 12-13 · Upcoming</span></div></div>
        </div>
      </div>
    ),
  },
  images: {
    title: "Image Catalog",
    content: (
      <div className="modal-mock-data">
        <div className="mock-image-grid">
          <div className="mock-image-card">
            <div className="mock-image-placeholder" style={{background: "linear-gradient(135deg, #2d5a3f, #5cb85c)"}}>
              <span>P85 — Flower Close-up</span>
            </div>
            <div className="mock-image-info">
              <strong>P85_flower_macro_001.jpg</strong>
              <span>4032 × 3024 · 8.2 MB</span>
            </div>
          </div>
          <div className="mock-image-card">
            <div className="mock-image-placeholder" style={{background: "linear-gradient(135deg, #1a472a, #3d6b4f)"}}>
              <span>Facility — Grow Room A</span>
            </div>
            <div className="mock-image-info">
              <strong>facility_growroom_A.jpg</strong>
              <span>5472 × 3648 · 12.1 MB</span>
            </div>
          </div>
          <div className="mock-image-card">
            <div className="mock-image-placeholder" style={{background: "linear-gradient(135deg, #4a7c59, #8fbc8f)"}}>
              <span>P85 — Cured Nug</span>
            </div>
            <div className="mock-image-info">
              <strong>P85_cured_nug_007.jpg</strong>
              <span>4032 × 3024 · 7.4 MB</span>
            </div>
          </div>
          <div className="mock-image-card">
            <div className="mock-image-placeholder" style={{background: "linear-gradient(135deg, #2d5a3f, #1a472a)"}}>
              <span>Trim — Fresh Harvest</span>
            </div>
            <div className="mock-image-info">
              <strong>trim_fresh_batch_012.jpg</strong>
              <span>3840 × 2160 · 6.8 MB</span>
            </div>
          </div>
          <div className="mock-image-card">
            <div className="mock-image-placeholder" style={{background: "linear-gradient(135deg, #5cb85c, #3d6b4f)"}}>
              <span>Lab — Terpene Analysis</span>
            </div>
            <div className="mock-image-info">
              <strong>lab_terpene_analysis.jpg</strong>
              <span>4000 × 3000 · 5.9 MB</span>
            </div>
          </div>
          <div className="mock-image-card">
            <div className="mock-image-placeholder" style={{background: "linear-gradient(135deg, #1a472a, #4a7c59)"}}>
              <span>Packaging — 1oz Jar</span>
            </div>
            <div className="mock-image-info">
              <strong>packaging_1oz_jar.jpg</strong>
              <span>3024 × 4032 · 4.3 MB</span>
            </div>
          </div>
        </div>
        <p className="mock-note">24 images available · Last updated Jan 2026</p>
      </div>
    ),
  },
  frontend: {
    title: "Custom Frontend",
    content: (
      <div className="modal-mock-data">
        <div className="mock-frontend-preview">
          <div className="mock-browser-bar">
            <div className="mock-browser-dots">
              <span></span><span></span><span></span>
            </div>
            <div className="mock-browser-url">yourstore.bellatoka.com</div>
          </div>
          <div className="mock-browser-content">
            <div className="mock-storefront-header">
              <strong>YOUR BRAND</strong>
              <span>Powered by Bella Toka</span>
            </div>
            <div className="mock-storefront-body">
              <div className="mock-product-display">
                <div className="mock-product-img" style={{background: "linear-gradient(135deg, #2d5a3f, #5cb85c)"}}>P85</div>
                <div className="mock-product-details">
                  <h4>P85 Premium Flower</h4>
                  <p>Indoor hand-crafted · THC 28.7%</p>
                  <p>Terpenes: 3.1% total</p>
                  <span className="mock-product-badge">In Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h4>Customization Options</h4>
        <div className="mock-options-list">
          <div className="mock-option-item"><span className="mock-option-check">✓</span> Custom domain & branding</div>
          <div className="mock-option-item"><span className="mock-option-check">✓</span> Live inventory sync</div>
          <div className="mock-option-item"><span className="mock-option-check">✓</span> Embedded lab results</div>
          <div className="mock-option-item"><span className="mock-option-check">✓</span> Order request forms</div>
          <div className="mock-option-item"><span className="mock-option-check">✓</span> Mobile responsive</div>
        </div>
      </div>
    ),
  },
  contract: {
    title: "Contract Info & Progress",
    content: (
      <div className="modal-mock-data">
        <div className="mock-contract-header">
          <div>
            <h4>Contract #BT-CF-2025-0042</h4>
            <p>24-Month Crop Futures Agreement</p>
          </div>
          <span className="mock-contract-badge">Active</span>
        </div>
        <div className="mock-stats-row">
          <div className="mock-stat-box">
            <span className="mock-stat-value">24 mo</span>
            <span className="mock-stat-label">Term Length</span>
          </div>
          <div className="mock-stat-box">
            <span className="mock-stat-value">~6 lbs</span>
            <span className="mock-stat-label">Weekly Allocation</span>
          </div>
          <div className="mock-stat-box">
            <span className="mock-stat-value">$X/lb</span>
            <span className="mock-stat-label">Set Price</span>
          </div>
          <div className="mock-stat-box">
            <span className="mock-stat-value">P85</span>
            <span className="mock-stat-label">Strain</span>
          </div>
        </div>
        <h4>Fulfillment Progress</h4>
        <div className="mock-contract-progress">
          <div className="mock-contract-progress-info">
            <span>Month 8 of 24</span>
            <span>33% Complete</span>
          </div>
          <div className="mock-progress-bar">
            <div className="mock-progress-fill" style={{width: "33%"}}></div>
          </div>
        </div>
        <table className="mock-table">
          <thead><tr><th>Detail</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>Contract Start</td><td>Jun 15, 2025</td></tr>
            <tr><td>Contract End</td><td>Jun 14, 2027</td></tr>
            <tr><td>Total Delivered</td><td>192.4 lbs</td></tr>
            <tr><td>Remaining Estimate</td><td>~390 lbs</td></tr>
            <tr><td>Payment Terms</td><td>At Crop Fulfillment</td></tr>
            <tr><td>Data Vesting</td><td>3 Years — Full Ownership</td></tr>
            <tr><td>License</td><td>Type 1A — Craft</td></tr>
            <tr><td>Facility</td><td>R&D Facility 3, Sonoma County</td></tr>
          </tbody>
        </table>
        <h4>Delivery History</h4>
        <div className="mock-chart">
          <div className="mock-bar-row"><span className="mock-bar-label">Jul</span><div className="mock-bar" style={{width: "90%"}}><span>25.2</span></div></div>
          <div className="mock-bar-row"><span className="mock-bar-label">Aug</span><div className="mock-bar" style={{width: "85%"}}><span>24.0</span></div></div>
          <div className="mock-bar-row"><span className="mock-bar-label">Sep</span><div className="mock-bar" style={{width: "88%"}}><span>24.8</span></div></div>
          <div className="mock-bar-row"><span className="mock-bar-label">Oct</span><div className="mock-bar" style={{width: "82%"}}><span>23.1</span></div></div>
          <div className="mock-bar-row"><span className="mock-bar-label">Nov</span><div className="mock-bar" style={{width: "92%"}}><span>25.8</span></div></div>
          <div className="mock-bar-row"><span className="mock-bar-label">Dec</span><div className="mock-bar" style={{width: "78%"}}><span>22.0</span></div></div>
          <div className="mock-bar-row"><span className="mock-bar-label">Jan</span><div className="mock-bar" style={{width: "95%"}}><span>26.5</span></div></div>
          <div className="mock-bar-row"><span className="mock-bar-label">Feb</span><div className="mock-bar" style={{width: "75%"}}><span>21.0</span></div></div>
        </div>
        <p className="mock-note">All weights verified at delivery · COAs attached per batch</p>
      </div>
    ),
  },
  lab: {
    title: "Lab Results & COAs",
    content: (
      <div className="modal-mock-data">
        <div className="mock-lab-header">
          <div>
            <h4>P85 — Batch #BT-2026-0117</h4>
            <p>Harvest Date: Jan 17, 2026 · Lab: SC Labs, Santa Cruz</p>
          </div>
          <span className="mock-lab-badge">PASS</span>
        </div>
        <h4>Cannabinoid Profile</h4>
        <table className="mock-table">
          <thead><tr><th>Compound</th><th>Result</th><th>Unit</th></tr></thead>
          <tbody>
            <tr><td>THCa</td><td>31.2</td><td>%</td></tr>
            <tr><td>THC (Δ9)</td><td>0.8</td><td>%</td></tr>
            <tr><td>Total THC</td><td>28.7</td><td>%</td></tr>
            <tr><td>CBDa</td><td>0.05</td><td>%</td></tr>
            <tr><td>CBD</td><td>0.02</td><td>%</td></tr>
            <tr><td>CBG</td><td>0.9</td><td>%</td></tr>
          </tbody>
        </table>
        <h4>Terpene Profile — Top 5</h4>
        <div className="mock-terpene-bars">
          <div className="mock-terpene-row"><span className="mock-terpene-name">Myrcene</span><div className="mock-terpene-bar" style={{width: "85%"}}></div><span>1.12%</span></div>
          <div className="mock-terpene-row"><span className="mock-terpene-name">Limonene</span><div className="mock-terpene-bar" style={{width: "62%"}}></div><span>0.81%</span></div>
          <div className="mock-terpene-row"><span className="mock-terpene-name">Caryophyllene</span><div className="mock-terpene-bar" style={{width: "48%"}}></div><span>0.63%</span></div>
          <div className="mock-terpene-row"><span className="mock-terpene-name">Linalool</span><div className="mock-terpene-bar" style={{width: "28%"}}></div><span>0.37%</span></div>
          <div className="mock-terpene-row"><span className="mock-terpene-name">Pinene</span><div className="mock-terpene-bar" style={{width: "15%"}}></div><span>0.19%</span></div>
        </div>
        <p className="mock-note">Total Terpenes: 3.12% · Full COA available for download</p>
      </div>
    ),
  },
  api: {
    title: "API Access",
    content: (
      <div className="modal-mock-data">
        <div className="mock-api-key-box">
          <label>Your API Key</label>
          <div className="mock-api-key"><code>bt_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code></div>
        </div>
        <h4>Endpoints</h4>
        <div className="mock-api-endpoints">
          <div className="mock-api-endpoint">
            <span className="mock-api-method mock-get">GET</span>
            <code>/api/v1/harvests</code>
            <span className="mock-api-desc">List all harvests</span>
          </div>
          <div className="mock-api-endpoint">
            <span className="mock-api-method mock-get">GET</span>
            <code>/api/v1/harvests/:id/lab</code>
            <span className="mock-api-desc">Lab results for a harvest</span>
          </div>
          <div className="mock-api-endpoint">
            <span className="mock-api-method mock-get">GET</span>
            <code>/api/v1/metrics/current</code>
            <span className="mock-api-desc">Current grow cycle metrics</span>
          </div>
          <div className="mock-api-endpoint">
            <span className="mock-api-method mock-get">GET</span>
            <code>/api/v1/images</code>
            <span className="mock-api-desc">Image catalog listing</span>
          </div>
          <div className="mock-api-endpoint">
            <span className="mock-api-method mock-post">POST</span>
            <code>/api/v1/webhooks</code>
            <span className="mock-api-desc">Register a webhook</span>
          </div>
        </div>
        <h4>Example Response</h4>
        <pre className="mock-code-block">{`{
  "harvest_id": "BT-2026-0117",
  "strain": "P85",
  "yield_lbs": 6.2,
  "thc_total": 28.7,
  "terpenes_total": 3.12,
  "status": "cured",
  "harvest_date": "2026-01-17"
}`}</pre>
        <p className="mock-note">Rate limit: 1,000 requests/day · Perpetual access included with contract</p>
      </div>
    ),
  },
};

function DashboardModal({ data, onClose }) {
  return (
    <div className="dashboard-modal-overlay" onClick={onClose}>
      <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dashboard-modal-header">
          <h3>{data.title}</h3>
          <button className="dashboard-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="dashboard-modal-body">
          {data.content}
        </div>
      </div>
    </div>
  );
}

function DashboardMain({ onLogout }) {
  const [activeModal, setActiveModal] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("bt_dashboard_token");
    onLogout();
  };

  const cards = [
    { key: "analytics", icon: "📈", title: "Data Analytics", desc: "View real-time cultivation metrics, sales trends, inventory turnover, and product performance." },
    { key: "images", icon: "📷", title: "Image Catalog", desc: "Browse and download high-resolution strain images, facility photos, and product photography." },
    { key: "frontend", icon: "🎨", title: "Custom Frontend", desc: "Your one-page branded experience for end users — powered by live data from your contract." },
    { key: "contract", icon: "📑", title: "Contract Info & Progress", desc: "Your contract details, fulfillment progress, delivery history, and key dates." },
    { key: "lab", icon: "📋", title: "Lab Results & COAs", desc: "Access lab test results, terpene profiles, and cannabinoid analysis for every harvest." },
    { key: "api", icon: "🔗", title: "API Access", desc: "Perpetual API access to all your cultivation data. Documentation and endpoints available here." },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <a href="/" className="dashboard-logo">Bella Toka</a>
        <div className="dashboard-header-actions">
          <span className="dashboard-header-label">Commercial Dashboard</span>
          <button onClick={handleLogout} className="dashboard-logout-button">Sign Out</button>
        </div>
      </header>

      <main className="dashboard-main-content">
        <div className="dashboard-welcome-banner">
          <h2>Welcome to Your Dashboard</h2>
          <p>Access your crop data, analytics, image catalog, and custom frontend tools below.</p>
        </div>

        <div className="dashboard-cards-grid">
          {cards.map((card) => (
            <div
              key={card.key}
              className="dashboard-main-card dashboard-main-card-clickable"
              onClick={() => setActiveModal(card.key)}
            >
              <div className="dashboard-main-card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <span className="dashboard-card-status dashboard-card-status-preview">Preview</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>Bella Toka R&D Facility 3 | Sonoma County, California</p>
      </footer>

      {activeModal && (
        <DashboardModal
          data={mockData[activeModal]}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}

function Dashboard() {
  const [authenticated, setAuthenticated] = useState(
    () => !!localStorage.getItem("bt_dashboard_token")
  );

  if (!authenticated) {
    return <DashboardLogin onLogin={() => setAuthenticated(true)} />;
  }

  return <DashboardMain onLogout={() => setAuthenticated(false)} />;
}

export default Dashboard;
