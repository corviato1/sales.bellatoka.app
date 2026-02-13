import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import HomeValue from './pages/HomeValue';
import About from './pages/About';
import Contact from './pages/Contact';
import Neighborhood from './pages/Neighborhood';
import Resources from './pages/Resources';
import Admin from './pages/Admin';
import SEOPage from './pages/SEOPage';
import GEOPage from './pages/GEOPage';
import Test from './pages/Test';
import { usePageTracking } from './utils/analytics';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  usePageTracking();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/home-value" element={<HomeValue />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/neighborhoods/:id" element={<Neighborhood />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/seo" element={<SEOPage />} />
          <Route path="/geo" element={<GEOPage />} />
          <Route path="/mls-data" element={<Test />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;
