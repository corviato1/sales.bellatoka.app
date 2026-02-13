import { useEffect } from 'react';

export default function SEO({ 
  title = "Cheryl Newton Real Estate | Orange County Homes",
  description = "Your trusted Orange County real estate expert. Buy or sell your home with confidence in Irvine, Newport Beach, Laguna Niguel, Mission Viejo and surrounding areas.",
  keywords = "Orange County real estate, Cheryl Newton realtor, homes for sale Orange County",
  image = "https://newton4.homes/og-image.jpg",
  url = "https://newton4.homes",
  type = "website"
}) {
  useEffect(() => {
    document.title = title;
    
    const updateMeta = (name, content, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', image, true);
    updateMeta('og:url', url, true);
    updateMeta('og:type', type, true);
    updateMeta('og:site_name', 'Cheryl Newton Real Estate', true);
    updateMeta('og:locale', 'en_US', true);
    
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    updateMeta('author', 'Cheryl Newton');
    updateMeta('geo.region', 'US-CA');
    updateMeta('geo.placename', 'Orange County, California');
    updateMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large');

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }, [title, description, keywords, image, url, type]);

  return null;
}

export function RealEstateAgentSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Cheryl Newton",
    "image": "https://newton4.homes/cheryl-newton.jpg",
    "url": "https://newton4.homes",
    "telephone": "(949) 463-2121",
    "email": "cheryl@newton4.homes",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Orange County",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 33.6846,
      "longitude": -117.8265
    },
    "additionalType": "https://schema.org/RealEstateAgent",
    "areaServed": [
      "Irvine, CA",
      "Newport Beach, CA",
      "Laguna Niguel, CA",
      "Mission Viejo, CA",
      "Dana Point, CA",
      "Laguna Beach, CA",
      "Huntington Beach, CA",
      "Aliso Viejo, CA",
      "San Clemente, CA",
      "Lake Forest, CA",
      "Rancho Santa Margarita, CA",
      "Ladera Ranch, CA",
      "San Juan Capistrano, CA",
      "Tustin, CA",
      "Costa Mesa, CA",
      "Yorba Linda, CA",
      "Anaheim Hills, CA",
      "Fullerton, CA",
      "Brea, CA",
      "Placentia, CA",
      "Seal Beach, CA"
    ],
    "priceRange": "$$$",
    "openingHours": "Mo-Su 08:00-20:00",
    "sameAs": [],
    "description": "Cheryl Newton is a trusted, licensed real estate Broker Associate with Berkshire Hathaway HomeServices California Properties. With 49 years of experience and 500+ homes sold totaling over $300 million in Orange County, she maintains a 98% client satisfaction rate helping residential buyers and sellers across the LA-to-San Diego corridor including Irvine, Newport Beach, Laguna Niguel, Mission Viejo, Dana Point, Laguna Beach, Huntington Beach, Costa Mesa, Tustin, Yorba Linda, and more.",
    "knowsAbout": [
      "Orange County real estate",
      "Residential real estate",
      "Single-family homes",
      "Condominiums and townhomes",
      "Luxury residential properties",
      "Residential property sales",
      "Home buying process",
      "Home selling strategies",
      "Market analysis",
      "Property valuation",
      "Real estate negotiation"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Residential Real Estate Services",
      "itemListElement": [
        {
          "@type": "Service",
          "name": "Residential Home Buying",
          "description": "Expert guidance for purchasing single-family homes, condominiums, and townhomes in Orange County."
        },
        {
          "@type": "Service",
          "name": "Residential Home Selling",
          "description": "Full-service listing and marketing for residential property sellers in Orange County."
        },
        {
          "@type": "Service",
          "name": "Luxury Residential Sales",
          "description": "Specialized service for luxury home buyers and sellers in coastal Orange County communities."
        },
        {
          "@type": "Service",
          "name": "First-Time Home Buyer Assistance",
          "description": "Dedicated support for first-time residential buyers navigating the Orange County market."
        }
      ]
    },
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Real Estate Broker License",
      "recognizedBy": {
        "@type": "GovernmentOrganization",
        "name": "California Department of Real Estate",
        "url": "https://www.dre.ca.gov"
      }
    },
    "memberOf": [
      {
        "@type": "Organization",
        "name": "Berkshire Hathaway HomeServices California Properties",
        "url": "https://www.bhhscalifornia.com"
      },
      {
        "@type": "Organization",
        "name": "National Association of Realtors",
        "url": "https://www.nar.realtor"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function PropertySchema({ listing }) {
  if (!listing) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": listing.address,
    "description": listing.description,
    "url": `https://newton4.homes/listings/${listing.id}`,
    "image": listing.image,
    "price": listing.price,
    "priceCurrency": "USD",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": listing.address,
      "addressLocality": listing.city,
      "addressRegion": listing.state,
      "postalCode": listing.zip,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates"
    },
    "numberOfRooms": listing.beds,
    "numberOfBathroomsTotal": listing.baths,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": listing.sqft,
      "unitCode": "FTK"
    },
    "datePosted": new Date().toISOString().split('T')[0]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
