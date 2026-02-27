import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/SalesPage.css";

const Contact = () => {
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

  return (
    <div className="sales-page">
      <header className="site-header site-header-scrolled">
        <Link to="/" className="site-logo">Bella Toka</Link>
        <nav className="site-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      <section className="contact-section contact-page-section">
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
              <label htmlFor="message">Message</label>
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

export default Contact;
