import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, DollarSign, Calendar } from 'lucide-react';

export default function PropertyCard({ listing }) {
  const formatPrice = (price) => {
    if (!price) return 'Pending';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const photoSrc = listing.photos?.length > 0 ? listing.photos[0] : (listing.image || '/placeholder-property.png');

  const totalBaths = (listing.baths_full || listing.baths_three_quarter || listing.baths_half)
    ? (listing.baths_full || 0) + (listing.baths_three_quarter || 0) * 0.75 + (listing.baths_half || 0) * 0.5
    : listing.baths;

  const displayCity = listing.city || 'Pending';
  const displayState = listing.state || '';
  const displayZip = listing.zip || '';
  const locationParts = [displayCity, displayState, displayZip].filter(Boolean).join(', ').replace(/, $/, '');

  return (
    <Link 
      to={`/listings/${listing.id}`}
      className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative overflow-hidden">
        <img 
          src={photoSrc} 
          alt={listing.address || 'Property'}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            listing.status === 'Active' 
              ? 'bg-green-500 text-white' 
              : listing.status === 'Pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {listing.status || 'Active'}
          </span>
          {listing.is_new_listing && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
              New
            </span>
          )}
        </div>
        {listing.open_house_date && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500 text-white flex items-center gap-1">
              <Calendar size={14} />
              Open House
            </span>
          </div>
        )}
        <div className="absolute bottom-4 left-4">
          <span className="bg-primary-600 text-white px-4 py-2 rounded-lg text-xl font-bold">
            {formatPrice(listing.price)}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{listing.address || 'Pending'}</h3>
        <div className="flex items-center gap-1 text-gray-500 mb-2">
          <MapPin size={16} />
          <span>{locationParts}</span>
        </div>
        {(listing.property_sub_type || listing.propertySubType) && (
          <span className="inline-block text-xs font-medium text-primary-700 bg-primary-50 px-2 py-1 rounded mb-3">
            {listing.property_sub_type || listing.propertySubType}
          </span>
        )}
        
        <div className="flex items-center gap-6 text-gray-600 border-t pt-4">
          <div className="flex items-center gap-2">
            <Bed size={18} />
            <span>{listing.beds != null && listing.beds !== '' ? `${listing.beds} Beds` : 'Pending'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath size={18} />
            <span>{totalBaths != null && totalBaths !== 0 ? `${totalBaths} Baths` : 'Pending'}</span>
          </div>
          {listing.sqft ? (
            <div className="flex items-center gap-2">
              <Square size={18} />
              <span>{Number(listing.sqft).toLocaleString()} Sqft</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Square size={18} />
              <span>Pending</span>
            </div>
          )}
        </div>
        {listing.price_per_sqft && (
          <div className="flex items-center gap-1 text-sm text-gray-400 mt-2">
            <DollarSign size={14} />
            <span>{Math.round(listing.price_per_sqft)}/sqft</span>
          </div>
        )}
      </div>
    </Link>
  );
}
