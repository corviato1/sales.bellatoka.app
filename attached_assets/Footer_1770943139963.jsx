import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Linkedin } from 'lucide-react';

function FooterLink({ to, children, className }) {
  const handleClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  };
  return (
    <Link to={to} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Cheryl Newton</h3>
            <p className="text-gray-400 mb-4">
              Your trusted Orange County real estate expert. Helping buyers and sellers achieve their real estate dreams since 1976.
            </p>
            <p className="text-gray-400 text-sm">
              Berkshire Hathaway HomeServices<br />
              California Properties
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><FooterLink to="/listings" className="text-gray-400 hover:text-white transition-colors">Browse Properties</FooterLink></li>
              <li><FooterLink to="/home-value" className="text-gray-400 hover:text-white transition-colors">What's Your Home Worth?</FooterLink></li>
              <li><FooterLink to="/about" className="text-gray-400 hover:text-white transition-colors">About Cheryl</FooterLink></li>
              <li><FooterLink to="/resources" className="text-gray-400 hover:text-white transition-colors">Buyer Resources</FooterLink></li>
              <li><FooterLink to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Neighborhoods</h4>
            <ul className="space-y-2">
              <li><FooterLink to="/neighborhoods/irvine" className="text-gray-400 hover:text-white transition-colors">Irvine</FooterLink></li>
              <li><FooterLink to="/neighborhoods/newport-beach" className="text-gray-400 hover:text-white transition-colors">Newport Beach</FooterLink></li>
              <li><FooterLink to="/neighborhoods/laguna-niguel" className="text-gray-400 hover:text-white transition-colors">Laguna Niguel</FooterLink></li>
              <li><FooterLink to="/neighborhoods/mission-viejo" className="text-gray-400 hover:text-white transition-colors">Mission Viejo</FooterLink></li>
              <li><FooterLink to="/neighborhoods/dana-point" className="text-gray-400 hover:text-white transition-colors">Dana Point</FooterLink></li>
              <li><FooterLink to="/neighborhoods/laguna-beach" className="text-gray-400 hover:text-white transition-colors">Laguna Beach</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:9494632121" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Phone size={18} />
                  <span>(949) 463-2121</span>
                </a>
              </li>
              <li>
                <a href="mailto:cheryl@newton4.homes" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Mail size={18} />
                  <span>cheryl@newton4.homes</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>Orange County, California</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 py-6 px-4">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>&copy; {currentYear} Cheryl Newton Real Estate. All rights reserved.</p>
          <div className="flex gap-6">
            <FooterLink to="/privacy" className="hover:text-white transition-colors">Privacy Policy</FooterLink>
            <FooterLink to="/terms" className="hover:text-white transition-colors">Terms of Service</FooterLink>
          </div>
          <p>DRE# 00576950</p>
        </div>
      </div>
    </footer>
  );
}
