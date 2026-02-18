import React, { useState, useEffect } from "react";
import "../styles/SalesPage.css";

const SalesPage = () => {
  const [plantCarouselIndex, setPlantCarouselIndex] = useState(0);
  const [experienceCarouselIndex, setExperienceCarouselIndex] = useState(0);
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    preferredContractLength: "",
    message: "",
  });
  const [terpeneRequest, setTerpeneRequest] = useState("");

  const plantImages = [
    { src: "/images/carousel/strain-closeup-1.png", alt: "Premium craft cannabis flower", caption: "Hand-selected premium flower" },
    { src: "/images/carousel/plant-vegetative.png", alt: "Vegetative growth stage", caption: "Precision vegetative cultivation" },
    { src: "/images/carousel/plant-flowering.png", alt: "Flowering stage", caption: "Peak flowering excellence" },
  ];

  const experienceImages = [
    { src: "/images/carousel/facility-interior.png", alt: "R&D Facility 3 Interior", caption: "State-of-the-art indoor cultivation" },
    { src: "/images/mockups/admin-dashboard-mockup.png", alt: "Admin Dashboard Preview", caption: "Admin Dashboard - Full control over your orders", isExample: true },
    { src: "/images/mockups/consumer-dashboard-mockup.png", alt: "Consumer Dashboard Preview", caption: "Consumer Portal - Transparency for your customers", isExample: true },
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
    const expTimer = setInterval(() => {
      setExperienceCarouselIndex((prev) => (prev + 1) % experienceImages.length);
    }, 6000);
    return () => {
      clearInterval(plantTimer);
      clearInterval(expTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const inquiry = {
      id: Date.now().toString(),
      ...formData,
      status: 'new',
      submittedAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('bt_inquiries') || '[]');
    existing.unshift(inquiry);
    localStorage.setItem('bt_inquiries', JSON.stringify(existing));
    console.log('New partnership inquiry submitted:', formData.businessName);
    alert("Thank you for your inquiry! Our team will contact you within 24 hours to discuss your partnership.");
    setFormData({
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
      licenseNumber: "",
      preferredContractLength: "",
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
      <header className="sales-header">
        <a href="https://bellatoka.app" className="sales-logo">Bella Toka</a>
      </header>

      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-badge">R&D Facility 3</span>
            <h1>Premium Craft Cannabis</h1>
            <p className="hero-subtitle">Small-Batch Excellence for Discerning Distributors</p>
            <p className="hero-tagline">
              Secure your exclusive weekly supply of hand-crafted flower with unprecedented transparency, 
              perpetual data access, and white-glove partnership support.
            </p>
            <a href="#inquiry" className="cta-button">Become a Partner</a>
          </div>
        </div>
      </section>

      <section className="carousel-section">
        <div className="container">
          <div className="carousel-grid">
            <div className="carousel-wrapper">
              <h3>Our Facility</h3>
              <div className="carousel">
                <div className="carousel-track" style={{ transform: `translateX(-${plantCarouselIndex * 100}%)` }}>
                  {plantImages.map((img, idx) => (
                    <div key={idx} className="carousel-slide">
                      <img src={img.src} alt={img.alt} />
                      <p className="carousel-caption">{img.caption}</p>
                    </div>
                  ))}
                </div>
                <div className="carousel-dots">
                  {plantImages.map((_, idx) => (
                    <button
                      key={idx}
                      className={`dot ${idx === plantCarouselIndex ? "active" : ""}`}
                      onClick={() => setPlantCarouselIndex(idx)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="carousel-wrapper">
              <h3>Our Offerings</h3>
              <div className="carousel">
                <div className="carousel-track" style={{ transform: `translateX(-${experienceCarouselIndex * 100}%)` }}>
                  {experienceImages.map((img, idx) => (
                    <div key={idx} className="carousel-slide">
                      <div className="image-container">
                        <img src={img.src} alt={img.alt} />
                        {img.isExample && <div className="example-badge">EXAMPLE</div>}
                      </div>
                      <p className="carousel-caption">{img.caption}</p>
                    </div>
                  ))}
                </div>
                <div className="carousel-dots">
                  {experienceImages.map((_, idx) => (
                    <button
                      key={idx}
                      className={`dot ${idx === experienceCarouselIndex ? "active" : ""}`}
                      onClick={() => setExperienceCarouselIndex(idx)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

            <section className="partnership-section">
        <div className="container">
          <h2>Available Contracts</h2>
          <p className="section-intro">
            We don't sell to multiple distributors each week. We partner with one distributor per strain 
            for guaranteed weekly supply and unmatched consistency.
          </p>

          <div className="partnership-grid">
            <div className="partnership-card">
              <div className="card-icon">📜</div>
              <h3>12 Month Contract</h3>
              <p>⏳ Weekly Fulfilment</p>
              <p>🔒 Pro Rated at locked in price</p>
              <p> • 100% Small Batch Allocation</p>
              <p> • Custom Deconomation Option</p>
              <p> • Custom Terpene Option</p>
              <p> • Commercial Admin Account</p>
              <p> • Custom Branding</p>
              <p> • Vesting API rights</p>
              <p className="contract-id">ID: 3.1.26</p>
            </div>

            <div className="partnership-card">
              <div className="card-icon">📜</div>
              <h3>24 Month Contract</h3>
              <p>⏳ Weekly Fulfilment</p>
              <p>🔒 Pro Rated at locked in price</p>
              <p> • 100% Small Batch Allocation</p>
              <p> • Custom Deconomation Option</p>
              <p> • Custom Terpene Option</p>
              <p> • Commercial Admin Account</p>
              <p> • Custom Branding</p>
              <p> • Vesting API rights</p>
              <p className="contract-id">ID: 3.2.26</p>
            </div>

            <div className="partnership-card">
              <div className="card-icon">📜</div>
              <h3>36 Month Contract</h3>
              <p>⏳ Weekly Fulfilment</p>
              <p>🔒 Pro Rated at locked in price</p>
              <p> • 100% Small Batch Allocation</p>
              <p> • Custom Deconomation Option</p>
              <p> • Custom Terpene Option</p>
              <p> • Commercial Admin Account</p>
              <p> • Custom Branding</p>
              <p> • Fully Vested API rights</p>
              <p className="contract-id">ID: 3.31.26</p>
            </div>

          </div>

          <div className="data-vesting-note">
            <h4>Data Ownership & Vesting</h4>
            <p>
              All cultivation data generated during your partnership is yours to leverage. After 2 years, 
              you gain full ownership with the option to sell or license this data. If we help market the 
              data sale, we split proceeds 50/50.
            </p>
          </div>
        </div>
      </section>

      <section className="partnership-section">
        <div className="container">
          <h2>Exclusive Partnership Model</h2>
          <p className="section-intro">
            We don't sell to multiple distributors each week. We partner with one distributor per strain 
            for guaranteed weekly supply and unmatched consistency.
          </p>

          <div className="partnership-grid">
            <div className="partnership-card">
              <div className="card-icon">📦</div>
              <h3>Whole Crop Allocation</h3>
              <p>Receive 100% of each weekly harvest. Expected yield: ~10 lbs per week, prorated at your negotiated price per pound.</p>
            </div>

            <div className="partnership-card">
              <div className="card-icon">📋</div>
              <h3>Flexible Contracts</h3>
              <p>Minimum 1-year commitment with negotiable terms. After 2 years, your data fully vests with resale rights.</p>
            </div>

            <div className="partnership-card">
              <div className="card-icon">📅</div>
              <h3>Crop Futures</h3>
              <p>Reserve crops up to 3 years in advance with locked-in pricing. Secure your supply chain regardless of market conditions.</p>
            </div>

            <div className="partnership-card">
              <div className="card-icon">🏷️</div>
              <h3>Co-Branding Options</h3>
              <p>Default Bella Toka branding, or 100% custom branding with your labels, packaging, and identity.</p>
            </div>
          </div>

          <div className="data-vesting-note">
            <h4>Data Ownership & Vesting</h4>
            <p>
              All cultivation data generated during your partnership is yours to leverage. After 2 years, 
              you gain full ownership with the option to sell or license this data. If we help market the 
              data sale, we split proceeds 50/50.
            </p>
          </div>
        </div>
      </section>

      <section className="api-section">
        <div className="container">
          <h2>Free API Access - Forever</h2>
          <p className="section-intro">
            Unprecedented transparency with perpetual data hosting. Access everything you need to 
            make informed purchasing decisions and delight your customers.
          </p>

          <div className="api-grid">
            <div className="api-category">
              <h3>Real-Time Crop Metrics</h3>
              <ul>
                <li>Feed schedule and nutrient data</li>
                <li>Environmental conditions (temp, humidity, CO2)</li>
                <li>Growth stage tracking</li>
                <li>Harvest projections</li>
              </ul>
            </div>

            <div className="api-category">
              <h3>Quality Documentation</h3>
              <ul>
                <li>High-resolution strain images</li>
                <li>Lab test results and COAs</li>
                <li>Terpene profiles</li>
                <li>Cannabinoid analysis</li>
              </ul>
            </div>

            <div className="api-category">
              <h3>Customer Intelligence</h3>
              <ul>
                <li>User reviews and ratings</li>
                <li>Customer feedback reports</li>
                <li>Product performance analytics</li>
                <li>Market trend insights</li>
              </ul>
            </div>

            <div className="api-category">
              <h3>Track & Trace</h3>
              <ul>
                <li>Full lifecycle tracking pre-sale</li>
                <li>Post-sale tracking (where available)</li>
                <li>METRC compliance integration</li>
                <li>Chain of custody documentation</li>
              </ul>
            </div>
          </div>

          <div className="perpetual-hosting">
            <div className="hosting-content">
              <h3>Perpetual Data Hosting</h3>
              <p>
                Your data never expires, decays, or gets lost. We maintain secure, accessible archives 
                of all cultivation data for as long as you need it. No additional storage fees. Ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="terpene-section">
        <div className="container">
          <h2>Custom Terpene Infusion</h2>
          <p className="section-intro">
            Our Yofumo decontamination process ensures the highest safety standards. As part of 
            this process, we offer complimentary terpene infusion from our Floraplex inventory.
          </p>

          <div className="terpene-info">
            <div className="terpene-process">
              <h3>How It Works</h3>
              <p>
                The Yofumo decontamination machine reduces natural terpene intensity. Over 4 days 
                (±1 day), we can reintroduce terpenes of your choice at no additional cost. 
                This optional service lets you customize the aromatic profile of your product.
              </p>
            </div>
          </div>

          <h3>Available Terpene Profiles</h3>
          <div className="terpene-grid">
            {inStockTerpenes.map((terpene, idx) => (
              <div key={idx} className="terpene-card">
                <span className={`terpene-type ${terpene.type.toLowerCase()}`}>{terpene.type}</span>
                <h4>{terpene.name}</h4>
                <p>{terpene.profile}</p>
              </div>
            ))}
          </div>

          <div className="terpene-request">
            <h3>Request Specific Terpenes</h3>
            <p>Don't see what you need? Request any product from <a href="https://buyterpenesonline.com" target="_blank" rel="noopener noreferrer">Floraplex (buyterpenesonline.com)</a></p>
            <form onSubmit={handleTerpeneRequest} className="terpene-form">
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

      <section className="templates-section">
        <div className="container">
          <h2>Complimentary Marketing Tools</h2>
          <p className="section-intro">
            Elevate your retail presence with professional, customizable templates - all included 
            at no additional cost.
          </p>

          <div className="templates-grid">
            <div className="template-card">
              <div className="template-image">
                <img src="/images/mockups/whitelabel-website-mockup.png" alt="White-label website template" />
                <div className="example-badge">EXAMPLE</div>
              </div>
              <h3>White-Label Web Displays</h3>
              <p>Embed product information, strain details, and real-time inventory directly on your dispensary website. Fully customizable to match your brand.</p>
            </div>

            <div className="template-card">
              <div className="template-image">
                <img src="/images/mockups/kiosk-display-mockup.png" alt="Kiosk display template" />
                <div className="example-badge">EXAMPLE</div>
              </div>
              <h3>In-Store Kiosk Templates</h3>
              <p>Touch-friendly displays for your retail floor. Customers can browse strain information, view lab results, and read reviews independently.</p>
            </div>

            <div className="template-card">
              <div className="template-image">
                <img src="/images/mockups/marketing-materials-mockup.png" alt="Marketing materials template" />
                <div className="example-badge">EXAMPLE</div>
              </div>
              <h3>Print Marketing Materials</h3>
              <p>Professional brochures, flyers, and product cards ready for customization. Perfect for trade shows, in-store displays, and customer handouts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <div className="container">
          <h2>Free Admin Accounts</h2>
          <p className="section-intro">
            Complete control over your partnership with powerful, intuitive admin tools.
          </p>

          <div className="admin-grid">
            <div className="admin-card">
              <div className="admin-image">
                <img src="/images/mockups/ordering-portal-mockup.png" alt="Ordering portal" />
                <div className="example-badge">EXAMPLE</div>
              </div>
              <h3>Ordering Portal</h3>
              <p>Manage your weekly orders, adjust quantities, schedule deliveries, and track shipments all in one place.</p>
            </div>

            <div className="admin-card">
              <div className="admin-image">
                <img src="/images/mockups/analytics-dashboard-mockup.png" alt="Analytics dashboard" />
                <div className="example-badge">EXAMPLE</div>
              </div>
              <h3>Analytics Dashboard</h3>
              <p>Visualize sales trends, inventory turnover, customer preferences, and product performance with interactive charts.</p>
            </div>

            <div className="admin-card">
              <div className="admin-image">
                <img src="/images/mockups/reporting-interface-mockup.png" alt="Custom reporting" />
                <div className="example-badge">EXAMPLE</div>
              </div>
              <h3>Custom Reporting</h3>
              <p>Build and export custom reports. Filter by date, product, location, or any metric that matters to your business.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="support-section">
        <div className="container">
          <h2>White-Glove Partnership Support</h2>
          <div className="support-grid">
            <div className="support-card">
              <div className="support-icon">👤</div>
              <h3>Dedicated Account Manager</h3>
              <p>Your single point of contact for everything. From order questions to strategic planning, we're here for you.</p>
            </div>

            <div className="support-card">
              <div className="support-icon">📧</div>
              <h3>Priority Communication</h3>
              <p>Reach us anytime via email. Phone support available upon request for urgent matters.</p>
            </div>

            <div className="support-card">
              <div className="support-icon">📊</div>
              <h3>Quarterly Business Reviews</h3>
              <p>Data-driven insights on product performance, market trends, and opportunities for growth.</p>
            </div>

            <div className="support-card">
              <div className="support-icon">🎨</div>
              <h3>Marketing Support</h3>
              <p>Social media assets, product photography, and promotional materials included with your partnership.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="inquiry" className="inquiry-section">
        <div className="container">
          <h2>Start Your Partnership</h2>
          <p className="section-intro">
            Ready to secure your exclusive weekly supply of premium craft cannabis? 
            Fill out the form below and our team will contact you within 24 hours.
          </p>

          <form className="inquiry-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
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
              <div className="form-group">
                <label htmlFor="licenseNumber">License Number *</label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
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
              <div className="form-group">
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="preferredContractLength">Preferred Contract Length</label>
                <select
                  id="preferredContractLength"
                  name="preferredContractLength"
                  value={formData.preferredContractLength}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="1-year">1 Year</option>
                  <option value="2-year">2 Years (Data Vesting)</option>
                  <option value="3-year">3 Years</option>
                  <option value="discuss">Let's Discuss</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="message">Tell Us About Your Business</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="What strains interest you? Do you have questions about crop futures, terpene customization, or our data services?"
              ></textarea>
            </div>

            <button type="submit" className="submit-button">Submit Partnership Inquiry</button>
          </form>
        </div>
      </section>

      <footer className="sales-footer">
        <div className="container">
          <p>Bella Toka R&D Facility 3 | Sonoma County, California</p>
          <p className="footer-contact">
            <a href="mailto:contact@bellatoka.com">contact@bellatoka.com</a>
          </p>
          <p className="footer-note">Craft Cannabis for Discerning Partners</p>
        </div>
      </footer>
    </div>
  );
};

export default SalesPage;
