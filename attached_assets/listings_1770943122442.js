export const templateListings = [
  {
    id: 'template-1',
    address: "123 Ocean View Dr",
    city: "Laguna Beach",
    state: "CA",
    zip: "92651",
    price: 2450000,
    beds: 4,
    baths: 3,
    sqft: 3200,
    image: "/images/listing-laguna-beach.jpg",
    status: "Active",
    mlsNumber: "OC20250001",
    description: "Stunning oceanfront property with breathtaking views of the Pacific. This beautifully designed home features an open floor plan, chef's kitchen, and expansive outdoor living space.",
    propertyType: "Single Family",
    yearBuilt: 2019,
    lotSize: "0.28 acres",
    features: ["Ocean View", "Pool", "Smart Home", "Gourmet Kitchen"]
  },
  {
    id: 'template-2',
    address: "456 Harbor Blvd",
    city: "Costa Mesa",
    state: "CA",
    zip: "92627",
    price: 1185000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    image: "/images/listing-costa-mesa.jpg",
    status: "Active",
    mlsNumber: "OC20250002",
    description: "Charming updated home in the heart of Costa Mesa. Close to shopping, dining, and beaches. Features modern finishes, a private backyard, and attached 2-car garage.",
    propertyType: "Single Family",
    yearBuilt: 2015,
    lotSize: "0.12 acres",
    features: ["Updated Kitchen", "Private Yard", "2 Car Garage", "Near Beach"]
  },
  {
    id: 'template-3',
    address: "789 Sunset Ridge",
    city: "Irvine",
    state: "CA",
    zip: "92614",
    price: 1675000,
    beds: 5,
    baths: 4,
    sqft: 3800,
    image: "/images/listing-irvine.jpg",
    status: "Active",
    mlsNumber: "OC20250003",
    description: "Spacious family home in Irvine's premier neighborhood. Award-winning schools, resort-style community amenities, and a thoughtfully designed layout for modern living.",
    propertyType: "Single Family",
    yearBuilt: 2021,
    lotSize: "0.22 acres",
    features: ["Top Schools", "Community Pool", "Open Floor Plan", "3 Car Garage"]
  }
];

export const neighborhoods = [
  {
    id: "irvine",
    name: "Irvine",
    image: "/images/neighborhoods/irvine.jpg",
    description: "Master-planned community with top-rated schools and diverse housing options.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.cityofirvine.org",
    highlights: ["Top Schools", "Safe Communities", "Business Hub", "Parks & Trails"]
  },
  {
    id: "newport-beach",
    name: "Newport Beach",
    image: "/images/neighborhoods/newport-beach.jpg",
    description: "Prestigious coastal living with world-class beaches and harbor lifestyle.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.newportbeachca.gov",
    highlights: ["Beach Living", "Harbor Lifestyle", "Luxury Dining", "Shopping"]
  },
  {
    id: "laguna-niguel",
    name: "Laguna Niguel",
    image: "/images/neighborhoods/laguna-niguel.jpg",
    description: "Hillside community with ocean views, excellent schools, and family-friendly atmosphere.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.cityoflagunaniguel.org",
    highlights: ["Ocean Views", "Family-Friendly", "Golf Courses", "Nature Trails"]
  },
  {
    id: "mission-viejo",
    name: "Mission Viejo",
    image: "/images/neighborhoods/mission-viejo.jpg",
    description: "Lake community with recreation, strong schools, and affordable luxury.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.cityofmissionviejo.org",
    highlights: ["Lake Access", "Great Schools", "Recreation", "Community Events"]
  },
  {
    id: "dana-point",
    name: "Dana Point",
    image: "/images/neighborhoods/dana-point.jpg",
    description: "Harbor town with coastal charm, whale watching, and beach access.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.danapoint.org",
    highlights: ["Harbor Living", "Whale Watching", "Beach Access", "Boutique Shops"]
  },
  {
    id: "laguna-beach",
    name: "Laguna Beach",
    image: "/images/neighborhoods/laguna-beach.jpg",
    description: "Artistic enclave with stunning beaches, galleries, and unique coastal properties.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.lagunabeachcity.net",
    highlights: ["Art Scene", "Beach Coves", "Fine Dining", "Cultural Events"]
  },
  {
    id: "huntington-beach",
    name: "Huntington Beach",
    image: "/images/neighborhoods/huntington-beach.jpg",
    description: "Surf City USA offering laid-back coastal living with wide sandy beaches, vibrant downtown, and family-friendly residential neighborhoods.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.huntingtonbeachca.gov",
    highlights: ["Beach Lifestyle", "Surf Culture", "Great Schools", "Downtown Dining"]
  },
  {
    id: "aliso-viejo",
    name: "Aliso Viejo",
    image: "/images/neighborhoods/aliso-viejo.jpg",
    description: "Modern planned community with well-maintained neighborhoods, excellent parks, and convenient access to beaches and employment centers.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.cityofalisoviejo.com",
    highlights: ["Planned Community", "Town Center", "Parks & Recreation", "Young Families"]
  },
  {
    id: "san-clemente",
    name: "San Clemente",
    image: "/images/neighborhoods/san-clemente.jpg",
    description: "Spanish Village by the Sea with charming downtown, world-class surf breaks, and hillside homes offering panoramic ocean views.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.san-clemente.org",
    highlights: ["Ocean Views", "Spanish Architecture", "Surf Spots", "Pier & Downtown"]
  },
  {
    id: "lake-forest",
    name: "Lake Forest",
    image: "/images/neighborhoods/lake-forest.jpg",
    description: "Centrally located family community with tree-lined streets, top-rated schools, and a mix of affordable and upscale residential options.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.lakeforestca.gov",
    highlights: ["Top Schools", "Family-Oriented", "Central Location", "Sports Parks"]
  },
  {
    id: "rancho-santa-margarita",
    name: "Rancho Santa Margarita",
    image: "/images/neighborhoods/rancho-santa-margarita.jpg",
    description: "Scenic foothill community surrounded by wilderness parks, featuring a private lake, resort-style amenities, and well-planned neighborhoods.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.cityofrsm.org",
    highlights: ["Lake & Beach Club", "Wilderness Parks", "Safe Neighborhoods", "Community Events"]
  },
  {
    id: "ladera-ranch",
    name: "Ladera Ranch",
    image: "/images/neighborhoods/ladera-ranch.jpg",
    description: "Award-winning master-planned community with resort-style amenities, outstanding schools, and a strong sense of neighborhood connection.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.laderaranch.com",
    highlights: ["Master-Planned", "Resort Amenities", "Top Schools", "Water Parks"]
  },
  {
    id: "san-juan-capistrano",
    name: "San Juan Capistrano",
    image: "/images/neighborhoods/san-juan-capistrano.jpg",
    description: "Historic mission town blending old-world charm with equestrian estates, ranch properties, and newer residential developments.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.sanjuancapistrano.org",
    highlights: ["Historic Mission", "Equestrian Estates", "Los Rios District", "Ranch Living"]
  },
  {
    id: "tustin",
    name: "Tustin",
    image: "/images/neighborhoods/tustin.jpg",
    description: "Charming Old Town character meets modern living at Tustin Legacy, offering diverse housing from historic bungalows to new construction homes.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.tustinca.org",
    highlights: ["Old Town Charm", "Tustin Legacy", "Central Location", "Diverse Housing"]
  },
  {
    id: "costa-mesa",
    name: "Costa Mesa",
    image: "/images/neighborhoods/costa-mesa.jpg",
    description: "Vibrant arts and culture hub with diverse residential neighborhoods, close proximity to beaches, and a thriving food and shopping scene.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.costamesaca.gov",
    highlights: ["Arts & Culture", "Near Beach", "South Coast Plaza", "Dining Scene"]
  },
  {
    id: "yorba-linda",
    name: "Yorba Linda",
    image: "/images/neighborhoods/yorba-linda.jpg",
    description: "Land of Gracious Living featuring spacious homes on large lots, equestrian trails, top-rated schools, and a quiet suburban atmosphere.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.yorba-linda.org",
    highlights: ["Large Lots", "Equestrian Trails", "Top Schools", "Gracious Living"]
  },
  {
    id: "anaheim-hills",
    name: "Anaheim Hills",
    image: "/images/neighborhoods/anaheim-hills.jpg",
    description: "Upscale hillside community with panoramic views, gated neighborhoods, excellent schools, and convenient freeway access.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.anaheim.net",
    highlights: ["Hillside Views", "Gated Communities", "Great Schools", "Golf Courses"]
  },
  {
    id: "fullerton",
    name: "Fullerton",
    image: "/images/neighborhoods/fullerton.jpg",
    description: "College town with a vibrant downtown, tree-lined historic neighborhoods, diverse housing stock, and a strong sense of community.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.cityoffullerton.com",
    highlights: ["Downtown Scene", "Historic Homes", "University Town", "Parks & Museums"]
  },
  {
    id: "brea",
    name: "Brea",
    image: "/images/neighborhoods/brea.jpg",
    description: "North Orange County gem with a walkable downtown, well-kept residential streets, hillside estates, and family-friendly amenities.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.ci.brea.ca.us",
    highlights: ["Downtown Brea", "Hillside Homes", "Family-Friendly", "Shopping & Dining"]
  },
  {
    id: "placentia",
    name: "Placentia",
    image: "/images/neighborhoods/placentia.jpg",
    description: "A Pleasant Place to Live with affordable family homes, strong schools, quiet tree-lined streets, and growing new development.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.placentia.org",
    highlights: ["Affordable Living", "Good Schools", "Quiet Streets", "New Development"]
  },
  {
    id: "seal-beach",
    name: "Seal Beach",
    image: "/images/neighborhoods/seal-beach.jpg",
    description: "Small-town coastal charm with a classic Main Street, historic pier, beachfront homes, and the renowned Leisure World retirement community.",
    medianPrice: "Data Pending",
    avgDaysOnMarket: null,
    cityInfoUrl: "https://www.sealbeachca.gov",
    highlights: ["Beach Town Charm", "Main Street", "Pier & Beach", "Leisure World"]
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Michael & Sarah Johnson",
    location: "Irvine",
    text: "Cheryl made our first home buying experience seamless. Her knowledge of the Irvine market and negotiation skills saved us over $50,000. We couldn't be happier!",
    rating: 5,
    date: "2025"
  },
  {
    id: 2,
    name: "Robert Chen",
    location: "Newport Beach",
    text: "When it came time to sell our family home, Cheryl's marketing strategy brought multiple offers above asking price. She truly understands the luxury market.",
    rating: 5,
    date: "2025"
  },
  {
    id: 3,
    name: "Jennifer Martinez",
    location: "Laguna Niguel",
    text: "As an out-of-state buyer, I relied heavily on Cheryl's expertise. She handled everything professionally and found us the perfect home with stunning ocean views.",
    rating: 5,
    date: "2024"
  },
  {
    id: 4,
    name: "David & Lisa Thompson",
    location: "Mission Viejo",
    text: "Cheryl helped us both sell our condo and buy our dream home near the lake. Her patience and dedication to finding the right property was exceptional.",
    rating: 5,
    date: "2024"
  }
];
