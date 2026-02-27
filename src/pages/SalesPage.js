import React, { useState, useEffect, useCallback } from "react";
import "../styles/SalesPage.css";

const SalesPage = () => {
  const [plantCarouselIndex, setPlantCarouselIndex] = useState(0);
  const [dashboardCarouselIndex, setDashboardCarouselIndex] = useState(0);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [terpeneRequest, setTerpeneRequest] = useState("");

  const plantImages = [
    { src: "/images/carousel/redplant.jpg", alt: "Premium craft cannabis flower", caption: "Hand-selected premium flower" },
    { src: "/images/carousel/redplant.jpg", alt: "P85 strain close-up", caption: "P85 — Craft cultivation excellence" },
    { src: "/images/carousel/redplant.jpg", alt: "Small-batch craft flower", caption: "R&D Facility 3 — Small-batch quality" },
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

  const handleScroll = useCallback(() => {
    setHeaderScrolled(window.scrollY > 80);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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

  const handleTerpeneRequest = (e) => {
    e.preventDefault();
    alert(`Thank you! We've received your request for: ${terpeneRequest}. We'll confirm availability shortly.`);
    setTerpeneRequest("");
  };

  return (
    <div className="sales-page">

      <header className={`site-header ${headerScrolled ? "site-header-scrolled" : "site-header-transparent"}`}>
        <a href="https://bellatoka.app" className="site-logo">Bella Toka</a>
        <nav className="site-nav">
          <a href="/dashboard">Dashboard</a>
          <a href="/contact">Contact</a>
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
              Secure your exclusive crop allocation of Bella Toka's P85 flower.
              Payment upon each fulfillment, perpetual access to data produced within contract period, and white-glove partnership support.
            </p>
            <div className="intro-cta-group">
              <a href="/contact" className="cta-button-primary">Request More Info</a>
              <a href="/contact" className="cta-button-secondary">Apply for Contract</a>
            </div>
          </div>
        </div>
      </section>

      <section id="contracts" className="contracts-section">
        <div className="page-container">
          <h2 className="section-heading">Crop Futures Contracts</h2>
          <p className="section-description">
            All contracts are cannabis crop futures — payment is made at the time of each crop fulfillment.
          </p>

          <div className="contract-highlights-row">
            <div className="contract-highlight-card contract-highlight-card-terms">
              <div className="contract-highlight-icon">📋</div>
              <h3>Available in 12, 24, or 36 Month Terms</h3>
              <p>Choose the contract length that fits your business.</p>
            </div>
            <div className="contract-highlight-card">
              <div className="contract-highlight-icon">📦</div>
              <h3>Whole Crop Allocation</h3>
              <p>Receive 100% of each harvest. Expected yield: ~6 lbs per week, pro-rated at set price per pound.</p>
            </div>
            <div className="contract-highlight-card">
              <div className="contract-highlight-icon">🔒</div>
              <h3>Exclusivity</h3>
              <p>Your allocation is guaranteed — no competing buyers on your contracted crop.</p>
            </div>
            <div className="contract-highlight-card">
              <div className="contract-highlight-icon">💰</div>
              <h3>Pricing Structure</h3>
              <p>Locked-in price per pound for the life of your contract. Payment is due at the time of each crop fulfillment.</p>
            </div>
            <div className="contract-highlight-card">
              <div className="contract-highlight-icon">📅</div>
              <h3>Fulfillment Schedule</h3>
              <p>Consistent harvest cycles with fulfillment at crop completion. Expected yield: ~6 lbs per week.</p>
            </div>
            <div className="contract-highlight-card">
              <div className="contract-highlight-icon">🔖</div>
              <h3>White Label</h3>
              <p>Default full white-label, or co-branded if desired. Your brand, your identity — we handle production.</p>
            </div>
            <div className="contract-highlight-card">
              <div className="contract-highlight-icon">🌿</div>
              <h3>Custom Terpene Infusion</h3>
              <p>Complimentary terpene infusion from our Floraplex inventory. Choose from dozens of profiles or request your own.</p>
            </div>
            <div className="contract-highlight-card">
              <div className="contract-highlight-icon">🖥️</div>
              <h3>Commercial Admin Account</h3>
              <p>Full-featured dashboard with data analytics, image catalog, and real-time crop metrics.</p>
            </div>
            <div className="contract-highlight-card">
              <div className="contract-highlight-icon">🎨</div>
              <h3>Custom Branding</h3>
              <p>White label is standard, but custom branding assistance is available upon request.</p>
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
              <p>Small craft cultivation licensed R&D facility focused on quality over quantity with hands-on attention to every plant.</p>
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

      <section id="inventory" className="inventory-section">
        <div className="page-container">
          <h2 className="section-heading">Current Inventory</h2>
          <p className="section-description">
            Available now — ready for immediate fulfillment.
          </p>

          <div className="inventory-strain-card">
            <div className="inventory-strain-header">
              <div>
                <h3>Blue Dream</h3>
                <span className="inventory-strain-type">Hybrid</span>
              </div>
              <div className="inventory-total">
                <span className="inventory-total-value">6.5 lbs</span>
                <span className="inventory-total-label">Total Available</span>
              </div>
            </div>
            <div className="inventory-breakdown">
              <div className="inventory-item">
                <div className="inventory-item-weight">3 lbs</div>
                <div className="inventory-item-label">100% Hand Trim</div>
                <div className="inventory-item-tag inventory-item-tag-premium">Premium</div>
              </div>
              <div className="inventory-item">
                <div className="inventory-item-weight">1 lb</div>
                <div className="inventory-item-label">Machine Trim</div>
                <div className="inventory-item-tag inventory-item-tag-standard">Standard</div>
              </div>
              <div className="inventory-item">
                <div className="inventory-item-weight">2.5 lbs</div>
                <div className="inventory-item-label">Trim</div>
                <div className="inventory-item-tag inventory-item-tag-bulk">Bulk</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pest-management" className="pest-management-section">
        <div className="page-container">
          <h2 className="section-heading">Pest Management</h2>
          <p className="section-description">
            We use only approved, compliant pest management products for indoor cannabis cultivation.
            Full transparency on every product applied to your crop.
          </p>

          <div className="pest-products-grid">
            <div className="pest-product-card">
              <div className="pest-product-icon">🌿</div>
              <h3>Neem Oil</h3>
              <p>Natural broad-spectrum insecticide and fungicide derived from the neem tree. Effective against mites, aphids, and whiteflies.</p>
              <a href="https://www.montereylawngarden.com/product/monterey-neem-oil-rtu/" target="_blank" rel="noopener noreferrer" className="pest-product-link">Learn More →</a>
            </div>
            <div className="pest-product-card">
              <div className="pest-product-icon">🛡️</div>
              <h3>Regalia CG Biofungicide</h3>
              <p>Plant-based biofungicide that activates the plant's natural defense mechanisms against powdery mildew and other fungal diseases.</p>
              <a href="https://profarmgroup.com/product/regalia-cg/" target="_blank" rel="noopener noreferrer" className="pest-product-link">Learn More →</a>
            </div>
            <div className="pest-product-card">
              <div className="pest-product-icon">🧪</div>
              <h3>The Amazing Doctor Zymes</h3>
              <p>All-natural citric acid-based solution for eliminating soft-bodied insects and mold. Safe to use up to the day of harvest.</p>
              <a href="https://www.doctorzymes.com/pesticide-free-insecticide.php" target="_blank" rel="noopener noreferrer" className="pest-product-link">Learn More →</a>
            </div>
            <div className="pest-product-card">
              <div className="pest-product-icon">🧪</div>
              <h3>Approved Pesticide List</h3>
              <p>While we use only Regalia and Dr. Zymes as our standard protocol for indoor cannabis cultivation, we maintain a list of all approved pesticides for full transparency.</p>
              <a href="<popup box that shows the pdf, and a download link>" target="_blank" rel="noopener noreferrer" className="pest-product-link">View Full Legal Pesticides List →</a>
            </div>
          </div>
        </div>
      </section>

      <section className="terpene-section">
        <div className="page-container">
          <h2 className="section-heading">Custom Terpene Infusion</h2>
          <p className="section-description">
            Every contract includes complimentary terpene infusion — customize the aromatic profile of your product at no additional cost.
          </p>

          <div className="terpene-overview-grid">
            <div className="terpene-overview-card">
              <div className="terpene-overview-icon">🔬</div>
              <h3>Yofumo Decontamination</h3>
              <p>Our decontamination process ensures the highest safety standards while preparing the flower for terpene reintroduction.</p>
            </div>
            <div className="terpene-overview-card">
              <div className="terpene-overview-icon">💧</div>
              <h3>Floraplex Terpenes</h3>
              <p>We source from Floraplex — a trusted supplier of strain-specific and custom terpene blends for the cannabis industry.</p>
            </div>
            <div className="terpene-overview-card">
              <div className="terpene-overview-icon">⏱️</div>
              <h3>4-Day Process</h3>
              <p>Terpene infusion takes approximately 4 days (±1 day). Choose your profile during contract setup or change it between harvests.</p>
            </div>
          </div>

          <h3 className="terpene-available-heading">Available Profiles</h3>
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
            <h3>Request a Custom Profile</h3>
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
          <h2 className="section-heading">Partnership Support</h2>
          <p className="section-description">
            Every contract includes a dedicated account manager, priority communication,
            quarterly business reviews, and marketing support.
          </p>
          <div className="support-cta">
            <a href="/contact" className="cta-button-primary">Get in Touch</a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-container">
          <p>Bella Toka | Sonoma County, California</p>
          <p className="footer-contact-link">
            <a href="mailto:contact@bellatoka.com">contact@bellatoka.com</a>
          </p>
          <p className="footer-tagline">Craft Cannabis Crop Futures</p>
        </div>
      </footer>
    </div>
  );
};

export default SalesPage;
