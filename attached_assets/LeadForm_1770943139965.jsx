import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';


export default function LeadForm({ formType = 'contact', title, subtitle, defaultMessageTitle = '', neighborhoodCity = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    messageTitle: defaultMessageTitle || 'General Message',
    message: '',
    propertyAddress: '',
    buyingTimeline: '',
    priceRange: '',
    honeypot: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.honeypot) {
      setIsSubmitted(true);
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const messagePrefix = formData.messageTitle && formData.messageTitle !== 'General Message' 
        ? `[${formData.messageTitle}] ` : '';
      const fullMessage = messagePrefix + (formData.message || '');
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: fullMessage,
        formType: neighborhoodCity ? 'neighborhood_interest' : formType,
        propertyAddress: formData.propertyAddress,
        buyingTimeline: formData.buyingTimeline,
        priceRange: formData.priceRange,
        timestamp: new Date().toISOString(),
        source: neighborhoodCity ? `/neighborhoods/${neighborhoodCity}` : window.location.pathname
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
      } else if (response.status === 429) {
        setError('Too many requests. Please try again in an hour.');
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Unable to submit form. Please call (949) 463-2121 instead.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600">I'll be in touch within 24 hours to discuss your real estate needs.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {title && <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>}
      {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="your@email.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="(949) 555-0123"
            autoComplete="tel"
          />
        </div>

        {formType === 'valuation' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Address *</label>
            <input
              type="text"
              name="propertyAddress"
              required
              value={formData.propertyAddress}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="123 Main St, Irvine, CA 92614"
              autoComplete="street-address"
            />
          </div>
        )}

        {formType === 'buyer' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buying Timeline</label>
              <select
                name="buyingTimeline"
                value={formData.buyingTimeline}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select timeline</option>
                <option value="asap">As soon as possible</option>
                <option value="1-3months">1-3 months</option>
                <option value="3-6months">3-6 months</option>
                <option value="6-12months">6-12 months</option>
                <option value="exploring">Just exploring</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select price range</option>
                <option value="under500k">Under $500,000</option>
                <option value="500k-750k">$500,000 - $750,000</option>
                <option value="750k-1m">$750,000 - $1,000,000</option>
                <option value="1m-1.5m">$1,000,000 - $1,500,000</option>
                <option value="1.5m-2m">$1,500,000 - $2,000,000</option>
                <option value="2m-3m">$2,000,000 - $3,000,000</option>
                <option value="3m+">$3,000,000+</option>
              </select>
            </div>
          </>
        )}

        {formType === 'contact' && !neighborhoodCity && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message Title</label>
            <select
              name="messageTitle"
              value={formData.messageTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="General Message">General Message</option>
              <option value="Buyer's Guide Request">Buyer's Guide Request</option>
              <option value="Seller's Guide Request">Seller's Guide Request</option>
              <option value="Home Buying Checklist">Home Buying Checklist</option>
              <option value="Other">Other</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Tell me about your real estate goals..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span>Sending...</span>
          ) : (
            <>
              <Send size={18} />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
