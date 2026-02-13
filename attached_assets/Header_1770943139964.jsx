import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, Home, ChevronDown } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNeighborhoodsOpen, setIsNeighborhoodsOpen] = useState(false);
  const location = useLocation();

  const neighborhoods = [
    { name: 'Irvine', path: '/neighborhoods/irvine' },
    { name: 'Newport Beach', path: '/neighborhoods/newport-beach' },
    { name: 'Laguna Niguel', path: '/neighborhoods/laguna-niguel' },
    { name: 'Mission Viejo', path: '/neighborhoods/mission-viejo' },
    { name: 'Dana Point', path: '/neighborhoods/dana-point' },
    { name: 'Laguna Beach', path: '/neighborhoods/laguna-beach' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="bg-primary-600 text-white py-2 px-4">
        <div className="container-custom flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:9494632121" className="flex items-center gap-2 hover:text-primary-200">
              <Phone size={14} />
              <span>(949) 463-2121</span>
            </a>
            <a href="mailto:cheryl@newton4.homes" className="hidden sm:flex items-center gap-2 hover:text-primary-200">
              <Mail size={14} />
              <span>cheryl@newton4.homes</span>
            </a>
          </div>
          <div className="text-primary-200">
            Berkshire Hathaway HomeServices
          </div>
        </div>
      </div>
      
      <nav className="container-custom py-4 px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Home className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-gray-900">Cheryl Newton</h1>
              <p className="text-xs text-gray-500">Orange County, CA Real Estate</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${isActive('/') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`}
            >
              Home
            </Link>
            <Link 
              to="/listings" 
              className={`font-medium transition-colors ${isActive('/listings') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`}
            >
              Properties
            </Link>
            
            <div className="relative">
              <button
                onClick={() => setIsNeighborhoodsOpen(!isNeighborhoodsOpen)}
                onBlur={() => setTimeout(() => setIsNeighborhoodsOpen(false), 150)}
                className="flex items-center gap-1 font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Neighborhoods
                <ChevronDown size={16} className={`transition-transform ${isNeighborhoodsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isNeighborhoodsOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[200px] border">
                  {neighborhoods.map((n) => (
                    <Link
                      key={n.path}
                      to={n.path}
                      className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    >
                      {n.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              to="/home-value" 
              className={`font-medium transition-colors ${isActive('/home-value') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`}
            >
              Home Value
            </Link>
            <Link 
              to="/about" 
              className={`font-medium transition-colors ${isActive('/about') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="btn-primary"
            >
              Contact Me
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-4">
              <Link to="/" className="font-medium text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/listings" className="font-medium text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>Properties</Link>
              <div className="border-l-2 border-primary-200 pl-4 ml-2">
                {neighborhoods.map((n) => (
                  <Link key={n.path} to={n.path} className="block py-1 text-gray-600 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                    {n.name}
                  </Link>
                ))}
              </div>
              <Link to="/home-value" className="font-medium text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>Home Value</Link>
              <Link to="/about" className="font-medium text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}>Contact Me</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
