import React, { useState, useEffect } from "react";
import "../styles/SalesPage.css";

const SalesPage = () => {
  const [plantCarouselIndex, setPlantCarouselIndex] = useState(0);
  const [dashboardCarouselIndex, setDashboardCarouselIndex] = useState(0);
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    preferredContractLength: "",
    inquiryType: "info",
    message: "",
  });
  const [terpeneRequest, setTerpeneRequest] = useState("");

  const plantImages = [
    { src: "/images/carousel/plant-flowering.png", alt: "P85 strain in flowering stage", caption: "P85 — Peak flowering excellence" },
    { src: "/images/carousel/facility-interior.png", alt: "R&D Facility 3 interior", caption: "R&D Facility 3 — Craft cultivation environment" },
    { src: "/images/carousel/redplant.jpg", alt: "Premium craft cannabis flower", caption: "Hand-selected premium flower" },
  ];

  const dashboardImages = [
    { src: "/images/mockups/admin-dashboard-mockup.png", alt: "Admin Dashboard", caption: "Admin Dashboard — Full control over your account", isExample: true },
    { src: "/images/mockups/analytics-dashboard-mockup.png", alt: "Analytics Dashboard", caption: "Analytics — Real-time cultivation data", isExample: true },
    { src: "/images/mockups/consumer-dashboard-mockup.png", alt: "Consumer Frontend", caption: "Custom Frontend — Built for your end users", isExample: true },
    { src: "/images/mockups/reporting-interface-mockup.png", alt: "Reporting Interface", caption: "Custom Reports — Filter by any metric", isExample: true },
  ];

  const inStockTerpenes = [
    { name: "OG Kush", profile: "Earthy, Pine, Woody", type: "Indica" },
    { name: "Gelato", profile: "Sweet, Citrus, Creamy", type: "Hybrid" },
    { name: "Sour Diesel", profile: "Diesel, Citrus, Herbal", type: "Sativa" },
    { name: "Blue Dream", profile: "Berry, Sweet, Herbal", type: "Hybrid" },
    { name: "Girl Scout Cookies", profile: "Sweet, Earthy, Mint", type: "Hybrid" },
    { name: "Granddaddy Purple", profile: "Grape, Berry, Sweet", type: "Indica" },
  ];

  useEffect(() => {
    const plantTimer = setInterval(() => {
      setPlantCarouselIndex((prev) => (prev + 1) % plantImages.length);
    }, 5000);
    const dashTimer = setInterval(() => {
      setDashboardCarouselIndex((prev) => (prev + 1) % dashboardImages.length);
    }, 6000);
    return () => {
      clearInterval(plantTimer);
      clearInterval(dashTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const inquiry = {
      id: Date.now().toString(),
      ...formData,
      status: "new",
      submittedAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("bt_inquiries") || "[]");
    existing.unshift(inquiry);
    localStorage.setItem("bt_inquiries", JSON.stringify(existing));
    const typeLabel = formData.inquiryType === "apply" ? "Contract Application" : "Information Request";
    alert(`Thank you for your ${typeLabel}! Our team will contact you within 24 hours.`);
    setFormData({
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
      licenseNumber: "",
      preferredContractLength: "",
      inquiryType: "info",
      message: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTerpeneRequest = (e) => {
    e.preventDefault();
    alert(`Thank you! We've received your request for: ${terpeneRequest}. We'll confirm availability shortly.`);
    setTerpeneRequest("");
  };

  return (
    <div className="sales-page">

      <header className="site-header">
        <a href="https://bellatoka.app" className="site-logo">Bella Toka</a>
        <nav className="site-nav">
          <a href="/dashboard">Dashboard</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="intro-component">
        <div className="intro-background-image" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/blackandwhite.jpg)` }}></div>
        <div className="intro-overlay">
          <div className="intro-content">
            <span className="intro-badge">R&D Facility 3 — Type 1A Licensed</span>
            <h1>Cannabis Crop Futures</h1>
            <p className="intro-subtitle">Small-Batch Craft Flower for Discerning Distributors</p>
            <p className="intro-tagline">
              Secure your exclusive weekly allocation of hand-crafted P85 flower.
              Payment at crop fulfillment, perpetual data access, and white-glove partnership support.
            </p>
            <div className="intro-cta-group">
              <a href="#contact" className="cta-button-primary" onClick={() => setFormData(prev => ({...prev, inquiryType: "info"}))}>Request More Info</a>
              <a href="#contact" className="cta-button-secondary" onClick={() => setFormData(prev => ({...prev, inquiryType: "apply"}))}>Apply for Contract</a>
            </div>
          </div>
        </div>
      </section>

      <section id="contracts" className="contracts-section">
        <div className="page-container">
          <h2 className="section-heading">Crop Futures Contracts</h2>
          <p className="section-description">
            We partner with one distributor per strain for guaranteed weekly supply.
            All contracts are cannabis crop futures — payment is made at the time of each crop fulfillment.
          </p>

          <div className="contracts-grid">
            <div className="contract-card">
              <div className="contract-card-icon">📜</div>
              <h3>12 Month Contract</h3>
              <div className="contract-card-details">
                <p className="contract-detail-item">Weekly Fulfillment</p>
                <p className="contract-detail-item">Pro-rated at $X / lb</p>
                <p className="contract-detail-item">Expected yield: ~6 lbs / week</p>
                <p className="contract-detail-item">Payment at crop fulfillment</p>
              </div>
              <ul className="contract-features-list">
                <li>100% Small Batch Allocation</li>
                <li>Custom Denomination Option</li>
                <li>Custom Terpene Option</li>
                <li>Commercial Admin Account</li>
                <li>Custom Branding</li>
                <li>Vesting API Rights</li>
              </ul>
              <span className="contract-id-label">ID: 3.1.26</span>
            </div>

            <div className="contract-card featured-contract">
              <div className="contract-card-icon">📜</div>
              <h3>24 Month Contract</h3>
              <div className="contract-card-details">
                <p className="contract-detail-item">Weekly Fulfillment</p>
                <p className="contract-detail-item">Pro-rated at $X / lb</p>
                <p className="contract-detail-item">Expected yield: ~6 lbs / week</p>
                <p className="contract-detail-item">Payment at crop fulfillment</p>
              </div>
              <ul className="contract-features-list">
                <li>100% Small Batch Allocation</li>
                <li>Custom Denomination Option</li>
                <li>Custom Terpene Option</li>
                <li>Commercial Admin Account</li>
                <li>Custom Branding</li>
                <li>Vesting API Rights</li>
              </ul>
              <span className="contract-id-label">ID: 3.2.26</span>
            </div>

            <div className="contract-card">
              <div className="contract-card-icon">📜</div>
              <h3>36 Month Contract</h3>
              <div className="contract-card-details">
                <p className="contract-detail-item">Weekly Fulfillment</p>
                <p className="contract-detail-item">Pro-rated at $X / lb</p>
                <p className="contract-detail-item">Expected yield: ~6 lbs / week</p>
                <p className="contract-detail-item">Payment at crop fulfillment</p>
              </div>
              <ul className="contract-features-list">
                <li>100% Small Batch Allocation</li>
                <li>Custom Denomination Option</li>
                <li>Custom Terpene Option</li>
                <li>Commercial Admin Account</li>
                <li>Custom Branding</li>
                <li>Fully Vested API Rights</li>
              </ul>
              <span className="contract-id-label">ID: 3.31.26</span>
            </div>
          </div>

          <div className="contract-highlights-row">
            <div className="contract-highlight-card">
              <div className="contract-highlight-icon">📦</div>
              <h3>Whole Crop Allocation</h3>
              <p>Receive 100% of each weekly harvest. Expected yield: ~6 lbs per week, pro-rated at set price per pound.</p>
            </div>
            <div className="contract-highlight-card">
              <div className="contract-highlight-icon">🔒</div>
              <h3>Exclusivity</h3>
              <p>One distributor per strain. Your allocation is guaranteed — no competing buyers on your contracted crop.</p>
            </div>
            <div className="contract-highlight-card">
              <div className="contract-highlight-icon">💰</div>
              <h3>Pricing Structure</h3>
              <p>Locked-in price per pound for the life of your contract. Payment is due at the time of each weekly crop fulfillment.</p>
            </div>
          </div>

          <div className="data-ownership-banner">
            <h4>Data Ownership & Vesting</h4>
            <p>
              All cultivation data generated during your partnership is yours to leverage. After 3 years,
              you gain full ownership with the option to sell or license this data.
            </p>
          </div>
        </div>
      </section>

      <section id="facility" className="facility-section">
        <div className="page-container">
          <h2 className="section-heading">R&D Facility 3</h2>
          <p className="section-description">
            A small-batch, Type 1A licensed craft cultivation facility in Sonoma County, California.
          </p>

          <div className="facility-highlights-grid">
            <div className="facility-highlight-card">
              <div className="facility-highlight-icon">🏭</div>
              <h3>Type 1A Licensed</h3>
              <p>Small craft cultivation license — focused on quality over quantity with hands-on attention to every plant.</p>
            </div>
            <div className="facility-highlight-card">
              <div className="facility-highlight-icon">🌱</div>
              <h3>Hand-Crafted Approach</h3>
              <p>Every plant is individually tended. Small batch sizes ensure consistent, premium-grade flower every harvest.</p>
            </div>
            <div className="facility-highlight-card">
              <div className="facility-highlight-icon">🔬</div>
              <h3>R&D Driven</h3>
              <p>Continuous strain development and optimization. Our facility doubles as a research environment for cultivation excellence.</p>
            </div>
            <div className="facility-highlight-card">
              <div className="facility-highlight-icon">📊</div>
              <h3>Full Transparency</h3>
              <p>Every data point from seed to sale is captured, stored, and accessible through your commercial dashboard.</p>
            </div>
          </div>

          <div className="facility-carousel-wrapper">
            <h3 className="carousel-title">Inside the Facility</h3>
            <div className="image-carousel">
              <div className="carousel-track" style={{ transform: `translateX(-${plantCarouselIndex * 100}%)` }}>
                {plantImages.map((img, idx) => (
                  <div key={idx} className="carousel-slide">
                    <img src={img.src} alt={img.alt} />
                    <p className="carousel-caption">{img.caption}</p>
                  </div>
                ))}
              </div>
              <div className="carousel-dot-nav">
                {plantImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`carousel-dot ${idx === plantCarouselIndex ? "carousel-dot-active" : ""}`}
                    onClick={() => setPlantCarouselIndex(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="product-section">
        <div className="page-container">
          <h2 className="section-heading">P85 — Our Signature Strain</h2>
          <p className="section-description">
            Custom tailored craft cannabis flower, grown exclusively for your contract.
          </p>

          <div className="product-details-grid">
            <div className="product-info-card">
              <h3>Strain Profile</h3>
              <div className="product-spec-list">
                <div className="product-spec-row">
                  <span className="product-spec-label">Strain</span>
                  <span className="product-spec-value">P85</span>
                </div>
                <div className="product-spec-row">
                  <span className="product-spec-label">Expected Yield</span>
                  <span className="product-spec-value">~6 lbs / week</span>
                </div>
                <div className="product-spec-row">
                  <span className="product-spec-label">Pricing</span>
                  <span className="product-spec-value">$X / lb (locked at contract signing)</span>
                </div>
                <div className="product-spec-row">
                  <span className="product-spec-label">Cultivation</span>
                  <span className="product-spec-value">Indoor, hand-crafted small batch</span>
                </div>
                <div className="product-spec-row">
                  <span className="product-spec-label">License</span>
                  <span className="product-spec-value">Type 1A — Craft</span>
                </div>
              </div>
            </div>

            <div className="product-features-card">
              <h3>What's Included</h3>
              <ul className="product-included-list">
                <li>Full image catalog via commercial dashboard</li>
                <li>Lab test results and COAs for every harvest</li>
                <li>Terpene profiles and cannabinoid analysis</li>
                <li>Custom terpene infusion (complimentary)</li>
                <li>Custom branding and denomination options</li>
                <li>Co-branding or 100% white-label packaging</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="terpene-section">
        <div className="page-container">
          <h2 className="section-heading">Custom Terpene Infusion</h2>
          <p className="section-description">
            Our Yofumo decontamination process ensures the highest safety standards. As part of
            this process, we offer complimentary terpene infusion from our Floraplex inventory.
          </p>

          <div className="terpene-process-card">
            <h3>How It Works</h3>
            <p>
              The Yofumo decontamination machine reduces natural terpene intensity. Over 4 days
              (±1 day), we can reintroduce terpenes of your choice at no additional cost.
              This optional service lets you customize the aromatic profile of your product.
            </p>
          </div>

          <h3 className="terpene-available-heading">Available Terpene Profiles</h3>
          <div className="terpene-options-grid">
            {inStockTerpenes.map((terpene, idx) => (
              <div key={idx} className="terpene-option-card">
                <span className={`terpene-type-badge terpene-type-${terpene.type.toLowerCase()}`}>{terpene.type}</span>
                <h4>{terpene.name}</h4>
                <p>{terpene.profile}</p>
              </div>
            ))}
          </div>

          <div className="terpene-request-form-wrapper">
            <h3>Request Specific Terpenes</h3>
            <p>Don't see what you need? Request any product from <a href="https://buyterpenesonline.com" target="_blank" rel="noopener noreferrer">Floraplex (buyterpenesonline.com)</a></p>
            <form onSubmit={handleTerpeneRequest} className="terpene-request-form">
              <input
                type="text"
                value={terpeneRequest}
                onChange={(e) => setTerpeneRequest(e.target.value)}
                placeholder="Enter Floraplex product name or URL..."
                required
              />
              <button type="submit">Request Availability</button>
            </form>
          </div>
        </div>
      </section>

      <section id="dashboard" className="dashboard-section">
        <div className="page-container">
          <h2 className="section-heading">Commercial User Dashboard</h2>
          <p className="section-description">
            Every contract includes a full-featured admin dashboard with data analytics,
            a custom frontend for your end users, and a complete image catalog.
          </p>

          <div className="dashboard-features-grid">
            <div className="dashboard-feature-card">
              <div className="dashboard-feature-icon">🖥️</div>
              <h3>Admin Dashboard</h3>
              <p>Full control over your account: manage orders, adjust quantities, schedule deliveries, and track every shipment.</p>
            </div>
            <div className="dashboard-feature-card">
              <div className="dashboard-feature-icon">📈</div>
              <h3>Data Analytics</h3>
              <p>Visualize cultivation metrics, sales trends, inventory turnover, and product performance with interactive charts.</p>
            </div>
            <div className="dashboard-feature-card">
              <div className="dashboard-feature-icon">🎨</div>
              <h3>Custom End-User Frontend</h3>
              <p>A one-page custom frontend experience built for your customers — branded to your specifications and powered by live data.</p>
            </div>
            <div className="dashboard-feature-card">
              <div className="dashboard-feature-icon">📷</div>
              <h3>Full Image Catalog</h3>
              <p>High-resolution strain images, facility photos, and product photography — all accessible and downloadable from your dashboard.</p>
            </div>
          </div>

          <div className="dashboard-carousel-wrapper">
            <h3 className="carousel-title">Dashboard Preview</h3>
            <div className="image-carousel">
              <div className="carousel-track" style={{ transform: `translateX(-${dashboardCarouselIndex * 100}%)` }}>
                {dashboardImages.map((img, idx) => (
                  <div key={idx} className="carousel-slide">
                    <div className="carousel-image-container">
                      <img src={img.src} alt={img.alt} />
                      {img.isExample && <div className="carousel-example-badge">EXAMPLE</div>}
                    </div>
                    <p className="carousel-caption">{img.caption}</p>
                  </div>
                ))}
              </div>
              <div className="carousel-dot-nav">
                {dashboardImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`carousel-dot ${idx === dashboardCarouselIndex ? "carousel-dot-active" : ""}`}
                    onClick={() => setDashboardCarouselIndex(idx)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-data-access-banner">
            <div className="data-access-content">
              <h3>Perpetual Data Access</h3>
              <p>
                Your data never expires, decays, or gets lost. We maintain secure, accessible archives
                of all cultivation data for as long as you need it. No additional storage fees. Ever.
              </p>
            </div>
          </div>

          <div className="dashboard-api-grid">
            <div className="dashboard-api-category">
              <h3>Real-Time Crop Metrics</h3>
              <ul>
                <li>Feed schedule and nutrient data</li>
                <li>Environmental conditions (temp, humidity, CO2)</li>
                <li>Growth stage tracking</li>
                <li>Harvest projections</li>
              </ul>
            </div>
            <div className="dashboard-api-category">
              <h3>Quality Documentation</h3>
              <ul>
                <li>High-resolution strain images</li>
                <li>Lab test results and COAs</li>
                <li>Terpene profiles</li>
                <li>Cannabinoid analysis</li>
              </ul>
            </div>
            <div className="dashboard-api-category">
              <h3>Customer Intelligence</h3>
              <ul>
                <li>User reviews and ratings</li>
                <li>Customer feedback reports</li>
                <li>Product performance analytics</li>
                <li>Market trend insights</li>
              </ul>
            </div>
            <div className="dashboard-api-category">
              <h3>Track & Trace</h3>
              <ul>
                <li>Full lifecycle tracking pre-sale</li>
                <li>Post-sale tracking (where available)</li>
                <li>METRC compliance integration</li>
                <li>Chain of custody documentation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="support-section">
        <div className="page-container">
          <h2 className="section-heading">White-Glove Partnership Support</h2>
          <div className="support-options-grid">
            <div className="support-option-card">
              <div className="support-option-icon">👤</div>
              <h3>Dedicated Account Manager</h3>
              <p>Your single point of contact for everything — from order questions to strategic planning.</p>
            </div>
            <div className="support-option-card">
              <div className="support-option-icon">📧</div>
              <h3>Priority Communication</h3>
              <p>Reach us anytime via email. Phone support available upon request for urgent matters.</p>
            </div>
            <div className="support-option-card">
              <div className="support-option-icon">📊</div>
              <h3>Quarterly Business Reviews</h3>
              <p>Data-driven insights on product performance, market trends, and growth opportunities.</p>
            </div>
            <div className="support-option-card">
              <div className="support-option-icon">🎨</div>
              <h3>Marketing Support</h3>
              <p>Social media assets, product photography, and promotional materials included with your partnership.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="page-container">
          <h2 className="section-heading">Get Started</h2>
          <p className="section-description">
            Ready to secure your exclusive weekly supply of premium craft cannabis?
            Choose your inquiry type and our team will contact you within 24 hours.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="inquiry-type-selector">
              <label
                className={`inquiry-type-option ${formData.inquiryType === "info" ? "inquiry-type-active" : ""}`}
              >
                <input
                  type="radio"
                  name="inquiryType"
                  value="info"
                  checked={formData.inquiryType === "info"}
                  onChange={handleChange}
                />
                <span className="inquiry-type-label">Request More Info</span>
                <span className="inquiry-type-desc">Learn about our crop futures and partnership model</span>
              </label>
              <label
                className={`inquiry-type-option ${formData.inquiryType === "apply" ? "inquiry-type-active" : ""}`}
              >
                <input
                  type="radio"
                  name="inquiryType"
                  value="apply"
                  checked={formData.inquiryType === "apply"}
                  onChange={handleChange}
                />
                <span className="inquiry-type-label">Apply for Contract</span>
                <span className="inquiry-type-desc">Begin the contract application process</span>
              </label>
            </div>

            <div className="form-field-row">
              <div className="form-field-group">
                <label htmlFor="businessName">Business Name *</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field-group">
                <label htmlFor="licenseNumber">License Number{formData.inquiryType === "apply" ? " *" : ""}</label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required={formData.inquiryType === "apply"}
                  placeholder=""
                />
              </div>
            </div>

            <div className="form-field-row">
              <div className="form-field-group">
                <label htmlFor="contactName">Contact Name *</label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-field-row">
              <div className="form-field-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field-group">
                <label htmlFor="preferredContractLength">Preferred Contract Length</label>
                <select
                  id="preferredContractLength"
                  name="preferredContractLength"
                  value={formData.preferredContractLength}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="12-month">12 Months</option>
                  <option value="24-month">24 Months</option>
                  <option value="36-month">36 Months</option>
                  <option value="discuss">Let's Discuss</option>
                </select>
              </div>
            </div>

            <div className="form-field-group form-field-full-width">
              <label htmlFor="message">Tell Us About Your Business</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="What interests you about our crop futures? Questions about P85, terpene customization, dashboard features, or data services?"
              ></textarea>
            </div>

            <button type="submit" className="form-submit-button">
              {formData.inquiryType === "apply" ? "Submit Contract Application" : "Request More Information"}
            </button>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-container">
          <p>Bella Toka R&D Facility 3 | Sonoma County, California</p>
          <p className="footer-contact-link">
            <a href="mailto:contact@bellatoka.com">contact@bellatoka.com</a>
          </p>
          <p className="footer-tagline">Craft Cannabis Crop Futures — First in Class</p>
        </div>
      </footer>
    </div>
  );
};

export default SalesPage;
