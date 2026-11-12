import { PropertyListing, Conversation, UserProfile } from '../types';

// Helper to create crisp, refined Stripe ledger-style architectural line-art SVGs
function createPropertySvg(type: string, title: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
    <rect width="600" height="450" fill="#f8fafd"/>
    
    <!-- Architectural Grid Lines (Stripe Frost tint) -->
    <defs>
      <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5edf5" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="600" height="450" fill="url(#grid)" />

    <!-- Outer hairline frame -->
    <rect x="0" y="0" width="600" height="450" fill="none" stroke="#e5edf5" stroke-width="2"/>

    <!-- Architectural Line-Art Graphic with Indigo Accent -->
    ${type === 'Plot' ? `
      <!-- Land / Plot Graphic -->
      <g transform="translate(60, 60)">
        <polygon points="50,260 430,260 380,100 120,100" fill="#e8e9ff" stroke="#533afd" stroke-width="2"/>
        <!-- Boundary markers -->
        <circle cx="50" cy="260" r="4" fill="#533afd"/>
        <circle cx="430" cy="260" r="4" fill="#533afd"/>
        <circle cx="380" cy="100" r="4" fill="#533afd"/>
        <circle cx="120" cy="100" r="4" fill="#533afd"/>
        <line x1="50" y1="260" x2="380" y2="100" stroke="#b9b9f9" stroke-dasharray="6 4" stroke-width="1.5"/>
        <!-- Ledger Dimension Tag -->
        <rect x="180" y="165" width="140" height="36" rx="4" fill="#ffffff" stroke="#e5edf5" stroke-width="1"/>
        <text x="250" y="188" font-family="'Inter Tight', sans-serif" font-weight="400" font-size="12" fill="#061b31" text-anchor="middle" letter-spacing="-0.2px">CORNER PLOT • 1,200 SQ FT</text>
        <path d="M 40,295 L 440,295" stroke="#64748d" stroke-width="1.5"/>
        <text x="240" y="318" font-family="'Inter Tight', sans-serif" font-weight="400" font-size="11" fill="#64748d" text-anchor="middle">30 FT TAR ROAD APPROACH</text>
      </g>
    ` : type === 'House' ? `
      <!-- Independent House Graphic -->
      <g transform="translate(110, 65)">
        <rect x="40" y="130" width="300" height="190" fill="#ffffff" stroke="#e5edf5" stroke-width="1.5"/>
        <!-- Gable Roof with soft periwinkle wash -->
        <polygon points="190,35 25,130 355,130" fill="#e8e9ff" stroke="#533afd" stroke-width="2"/>
        <!-- Modern Doorway -->
        <rect x="155" y="210" width="70" height="110" fill="#061b31" rx="2"/>
        <circle cx="170" cy="265" r="3" fill="#ffffff"/>
        <!-- Windows with hairline dividers -->
        <rect x="65" y="160" width="55" height="55" fill="#f8fafd" stroke="#e5edf5" stroke-width="1.5" rx="2"/>
        <line x1="92" y1="160" x2="92" y2="215" stroke="#e5edf5" stroke-width="1"/>
        <line x1="65" y1="187" x2="120" y2="187" stroke="#e5edf5" stroke-width="1"/>
        
        <rect x="260" y="160" width="55" height="55" fill="#f8fafd" stroke="#e5edf5" stroke-width="1.5" rx="2"/>
        <line x1="287" y1="160" x2="287" y2="215" stroke="#e5edf5" stroke-width="1"/>
        <line x1="260" y1="187" x2="315" y2="187" stroke="#e5edf5" stroke-width="1"/>
        <!-- Minimalist chimney -->
        <rect x="270" y="55" width="32" height="45" fill="#f8fafd" stroke="#b9b9f9" stroke-width="1" rx="2"/>
      </g>
    ` : type === 'Shop' ? `
      <!-- Commercial Shop Graphic -->
      <g transform="translate(100, 60)">
        <rect x="40" y="90" width="320" height="230" fill="#ffffff" stroke="#e5edf5" stroke-width="1.5" rx="4"/>
        <rect x="25" y="45" width="350" height="48" fill="#533afd" rx="4"/>
        <text x="200" y="75" font-family="'Inter Tight', sans-serif" font-weight="400" font-size="13" fill="#ffffff" text-anchor="middle" letter-spacing="-0.2px">PRIME COMMERCIAL FRONTAGE</text>
        <!-- Clean shutter horizontal rules -->
        <rect x="80" y="125" width="240" height="195" fill="#f8fafd" stroke="#e5edf5" stroke-width="1.5" rx="2"/>
        <line x1="80" y1="155" x2="320" y2="155" stroke="#e5edf5" stroke-width="1"/>
        <line x1="80" y1="185" x2="320" y2="185" stroke="#e5edf5" stroke-width="1"/>
        <line x1="80" y1="215" x2="320" y2="215" stroke="#e5edf5" stroke-width="1"/>
        <line x1="80" y1="245" x2="320" y2="245" stroke="#e5edf5" stroke-width="1"/>
        <line x1="80" y1="275" x2="320" y2="275" stroke="#e5edf5" stroke-width="1"/>
      </g>
    ` : type === 'Room' ? `
      <!-- Room / Studio Graphic -->
      <g transform="translate(100, 60)">
        <rect x="40" y="60" width="320" height="260" fill="#ffffff" stroke="#e5edf5" stroke-width="1.5" rx="4"/>
        <!-- Studio bed layout -->
        <rect x="70" y="170" width="160" height="130" fill="#e8e9ff" stroke="#b9b9f9" stroke-width="1.5" rx="4"/>
        <rect x="70" y="170" width="45" height="40" fill="#ffffff" stroke="#e5edf5" stroke-width="1" rx="2"/>
        <!-- Study desk -->
        <rect x="255" y="190" width="85" height="90" fill="#f8fafd" stroke="#e5edf5" stroke-width="1.5" rx="4"/>
        <circle cx="295" cy="160" r="14" fill="#533afd" opacity="0.15"/>
        <circle cx="295" cy="160" r="4" fill="#533afd"/>
        <!-- Window -->
        <rect x="140" y="80" width="100" height="70" fill="#f8fafd" stroke="#e5edf5" stroke-width="1.5" rx="2"/>
        <line x1="190" y1="80" x2="190" y2="150" stroke="#e5edf5" stroke-width="1"/>
      </g>
    ` : `
      <!-- Apartment / Flat Graphic -->
      <g transform="translate(120, 50)">
        <rect x="40" y="40" width="280" height="290" fill="#ffffff" stroke="#e5edf5" stroke-width="1.5" rx="4"/>
        <!-- Roofline in indigo -->
        <rect x="25" y="25" width="310" height="20" fill="#533afd" rx="2"/>
        <!-- Architectural Grid Matrix -->
        <rect x="70" y="75" width="55" height="55" fill="#f8fafd" stroke="#e5edf5" stroke-width="1" rx="2"/>
        <rect x="150" y="75" width="55" height="55" fill="#e8e9ff" stroke="#b9b9f9" stroke-width="1" rx="2"/>
        <rect x="230" y="75" width="55" height="55" fill="#f8fafd" stroke="#e5edf5" stroke-width="1" rx="2"/>
        
        <rect x="70" y="155" width="55" height="55" fill="#e8e9ff" stroke="#b9b9f9" stroke-width="1" rx="2"/>
        <rect x="150" y="155" width="55" height="55" fill="#f8fafd" stroke="#e5edf5" stroke-width="1" rx="2"/>
        <rect x="230" y="155" width="55" height="55" fill="#e8e9ff" stroke="#b9b9f9" stroke-width="1" rx="2"/>

        <!-- Main Foyer -->
        <rect x="140" y="245" width="80" height="85" fill="#061b31" rx="2"/>
      </g>
    `}

    <!-- Ledger Watermark Stamp -->
    <rect x="20" y="400" width="180" height="28" rx="4" fill="#ffffff" stroke="#e5edf5" stroke-width="1"/>
    <circle cx="34" cy="414" r="3" fill="#533afd"/>
    <text x="46" y="418" font-family="'Inter Tight', sans-serif" font-weight="400" font-size="11" fill="#50617a" letter-spacing="-0.1px">VERIFIED DIRECT LISTING</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const DEMO_USER: UserProfile = {
  id: 'user_ramesh',
  full_name: 'Ramesh Kulkarni',
  phone: '9876543210',
  masked_phone: '+91 98••••••10',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  area: 'Raichur',
  allow_whatsapp: true,
  member_since: 'October 2026',
  mobile_verified: true,
  google_linked: true,
  saved_listing_ids: ['listing_1', 'listing_4'],
  blocked_user_ids: [],
  daily_whatsapp_count: 3
};

export const INITIAL_LISTINGS: PropertyListing[] = [
  // 6 SALE LISTINGS
  {
    id: 'listing_1',
    owner_id: 'user_ramesh',
    owner_name: 'Ramesh Kulkarni',
    owner_phone_masked: '+91 98••••••10',
    owner_member_since: 'Member since 2026',
    owner_avatar: '',
    mode: 'sale',
    category: 'Plot',
    title: 'Residential Plot, Manvi Road',
    description: 'Direct owner corner plot with 30 ft asphalt road connectivity. Clear titles, RTC updated, suitable for immediate duplex or commercial construction. Fully gated boundary.',
    price: 1850000,
    size_value: 1200,
    size_unit: 'sq ft',
    road_width: '30 ft',
    facing: 'East',
    area: 'Manvi',
    address: 'Near New Bus Stand, Manvi Road',
    landmark: 'Opposite APMC Yard Gate 2',
    lat: 16.0024,
    lng: 77.0512,
    exact_location: true,
    allow_whatsapp: true,
    status: 'live',
    docs_added: true,
    verified: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [
      createPropertySvg('Plot', 'Corner Plot Manvi'),
      createPropertySvg('Plot', 'Road Approach'),
      createPropertySvg('Plot', 'Boundary Pillar')
    ],
    documents: [
      { id: 'doc1', doc_type: 'RTC / Pahani', title: 'Form 16 Pahani Record', uploadDate: '2026-10-25' },
      { id: 'doc2', doc_type: 'Khata', title: 'E-Khata Extract', uploadDate: '2026-10-25' }
    ],
    views_count: 142,
    chats_count: 9,
    is_demo: true
  },
  {
    id: 'listing_2',
    owner_id: 'owner_2',
    owner_name: 'Basavaraj Patil',
    owner_phone_masked: '+91 94••••••88',
    owner_member_since: 'Member since 2025',
    owner_avatar: '',
    mode: 'sale',
    category: 'House',
    title: '3 BHK Independent Duplex House',
    description: 'Newly constructed North-facing duplex house with dedicated car parking, borewell with sweet water, solar water heater installed. Vitrified tile flooring, modular kitchen cabinets.',
    price: 4200000,
    size_value: 1800,
    size_unit: 'sq ft',
    bedrooms: 3,
    bathrooms: 3,
    floor: 'G + 1',
    facing: 'North',
    furnishing: 'Semi-furnished',
    area: 'Raichur',
    address: 'NGO Colony, Near Station Road',
    landmark: 'Behind Raghavendra Swami Matha',
    lat: 16.2076,
    lng: 77.3463,
    exact_location: true,
    allow_whatsapp: true,
    status: 'live',
    docs_added: true,
    verified: true,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [
      createPropertySvg('House', 'Duplex Elevation'),
      createPropertySvg('House', 'Living Room'),
      createPropertySvg('House', 'Modular Kitchen')
    ],
    documents: [
      { id: 'doc3', doc_type: 'Sale Deed', title: 'Registered Sale Deed 2024', uploadDate: '2026-10-18' }
    ],
    views_count: 310,
    chats_count: 18,
    is_demo: true
  },
  {
    id: 'listing_3',
    owner_id: 'owner_3',
    owner_name: 'Vijay Kumar Sindhanur',
    owner_phone_masked: '+91 97••••••45',
    owner_member_since: 'Member since 2026',
    owner_avatar: '',
    mode: 'sale',
    category: 'Shop',
    title: 'Prime Commercial Shop, Main Road',
    description: 'High footfall roadside commercial shop on Sindhanur Bellary Highway. Ideal for pharmacy, optical showroom, electronics or consultation clinic. 18 ft wide frontage.',
    price: 3500000,
    size_value: 450,
    size_unit: 'sq ft',
    floor: 'Ground Floor',
    facing: 'West',
    road_width: '60 ft Highway',
    area: 'Sindhanur',
    address: 'Kushtagi Road Junction, Sindhanur',
    landmark: 'Next to Canara Bank Main Branch',
    lat: 15.7667,
    lng: 76.7583,
    exact_location: true,
    allow_whatsapp: true,
    status: 'live',
    docs_added: false,
    verified: false,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [
      createPropertySvg('Shop', 'Highway Frontage'),
      createPropertySvg('Shop', 'Interior Shutter View')
    ],
    views_count: 89,
    chats_count: 5,
    is_demo: true
  },
  {
    id: 'listing_4',
    owner_id: 'owner_4',
    owner_name: 'Sharanappa Gouda',
    owner_phone_masked: '+91 99••••••12',
    owner_member_since: 'Member since 2026',
    owner_avatar: '',
    mode: 'sale',
    category: 'Plot',
    title: '4 Guntas NA Layout Plot with CC Roads',
    description: 'Government approved layout with underground drainage, electricity poles, and tree plantations. Peaceful residential locality ready for building.',
    price: 2400000,
    size_value: 4,
    size_unit: 'guntas',
    road_width: '40 ft',
    facing: 'North-East',
    area: 'Lingasugur',
    address: 'Ilkal Road Layout, Lingasugur',
    landmark: 'Near Mini Vidhana Soudha',
    lat: 16.1557,
    lng: 76.5167,
    exact_location: false,
    allow_whatsapp: false,
    status: 'live',
    docs_added: true,
    verified: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [
      createPropertySvg('Plot', 'Guntas Layout Lingasugur'),
      createPropertySvg('Plot', 'CC Road View')
    ],
    documents: [
      { id: 'doc4', doc_type: 'Encumbrance Certificate', title: '15-Year EC Clean', uploadDate: '2026-10-10' }
    ],
    views_count: 178,
    chats_count: 11,
    is_demo: true
  },
  {
    id: 'listing_5',
    owner_id: 'owner_5',
    owner_name: 'Mohammed Mansoor',
    owner_phone_masked: '+91 88••••••77',
    owner_member_since: 'Member since 2026',
    owner_avatar: '',
    mode: 'sale',
    category: 'Flat',
    title: '2 BHK Ready to Move Apartment Flat',
    description: 'Spacious 2BHK on 2nd floor with lift, power backup, covered two-wheeler parking. Water connection 24/7. Ready for registration.',
    price: 2850000,
    size_value: 1050,
    size_unit: 'sq ft',
    bedrooms: 2,
    bathrooms: 2,
    floor: '2nd of 4 floors',
    facing: 'East',
    furnishing: 'Unfurnished',
    area: 'Raichur',
    address: 'Ashok Nagar, Near Ring Road',
    landmark: 'Close to RIMS Hospital',
    lat: 16.2130,
    lng: 77.3550,
    exact_location: true,
    allow_whatsapp: true,
    status: 'live',
    docs_added: true,
    verified: false,
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [
      createPropertySvg('Flat', 'Flat Exterior'),
      createPropertySvg('Flat', 'Hall & Balcony')
    ],
    views_count: 94,
    chats_count: 4,
    is_demo: true
  },
  {
    id: 'listing_6',
    owner_id: 'owner_6',
    owner_name: 'Chandrashekhar Mudgal',
    owner_phone_masked: '+91 91••••••33',
    owner_member_since: 'Member since 2026',
    owner_avatar: '',
    mode: 'sale',
    category: 'House',
    title: 'Traditional Independent House with Courtyard',
    description: 'Solid stone foundation house in Mudgal historical town area. Large front verandah, sweet well water source, independent compound wall.',
    price: 1950000,
    size_value: 1400,
    size_unit: 'sq ft',
    bedrooms: 2,
    bathrooms: 2,
    floor: 'Ground floor only',
    facing: 'South',
    furnishing: 'Unfurnished',
    area: 'Mudgal',
    address: 'Fort Road, Mudgal',
    landmark: 'Near Old Jamia Masjid & Fort Gate',
    lat: 15.9986,
    lng: 76.4342,
    exact_location: false,
    allow_whatsapp: true,
    status: 'live',
    docs_added: false,
    verified: false,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [
      createPropertySvg('House', 'Mudgal Traditional House')
    ],
    views_count: 62,
    chats_count: 2,
    is_demo: true
  },

  // 6 RENT LISTINGS
  {
    id: 'listing_7',
    owner_id: 'owner_7',
    owner_name: 'Mallikarjun Swamy',
    owner_phone_masked: '+91 93••••••60',
    owner_member_since: 'Member since 2026',
    owner_avatar: '',
    mode: 'rent',
    category: 'Room',
    title: 'Furnished Single Room for Students',
    description: 'Attached bathroom, ceiling fan, study table, single cot and wardrobe provided. Very quiet environment, 5 minutes walking distance to engineering and medical colleges.',
    price: 4500,
    deposit: 10000,
    size_value: 180,
    size_unit: 'sq ft',
    furnishing: 'Fully-furnished',
    suitable_for: ['Students', 'Working people'],
    area: 'Raichur',
    address: 'Vidya Nagar, 2nd Cross',
    landmark: 'Behind SLN Engineering College',
    lat: 16.2050,
    lng: 77.3380,
    exact_location: false,
    allow_whatsapp: true,
    status: 'live',
    docs_added: true,
    verified: true,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    photos: [
      createPropertySvg('Room', 'Student Single Room'),
      createPropertySvg('Room', 'Study Corner')
    ],
    views_count: 245,
    chats_count: 14,
    is_demo: true
  },
  {
    id: 'listing_8',
    owner_id: 'owner_8',
    owner_name: 'Sunil Rao',
    owner_phone_masked: '+91 96••••••19',
    owner_member_since: 'Member since 2025',
    owner_avatar: '',
    mode: 'rent',
    category: 'Shop',
    title: 'Retail Shop on Main Commercial Road',
    description: 'Ground floor corner retail shop with high visibility, rolling shutter, tiled flooring and independent sub-meter. Ideal for medical store, boutique or office.',
    price: 9000,
    deposit: 50000,
    size_value: 300,
    size_unit: 'sq ft',
    furnishing: 'Unfurnished',
    suitable_for: ['Anyone', 'Working people'],
    area: 'Sindhanur',
    address: 'Karatagi Road, Near Clock Tower',
    landmark: 'Opposite Government General Hospital',
    lat: 15.7720,
    lng: 76.7610,
    exact_location: true,
    allow_whatsapp: true,
    status: 'live',
    docs_added: false,
    verified: false,
    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    photos: [
      createPropertySvg('Shop', 'Sindhanur Commercial Shop')
    ],
    views_count: 112,
    chats_count: 8,
    is_demo: true
  },
  {
    id: 'listing_9',
    owner_id: 'owner_9',
    owner_name: 'Anand Kumar',
    owner_phone_masked: '+91 94••••••51',
    owner_member_since: 'Member since 2026',
    owner_avatar: '',
    mode: 'rent',
    category: 'House',
    title: '2 BHK Independent Ground Floor for Family',
    description: 'Dedicated parking for bike and car. Kaveri/municipality water daily morning. Big utility area for washing machine. Vegetarian family preferred.',
    price: 11000,
    deposit: 40000,
    size_value: 1100,
    size_unit: 'sq ft',
    bedrooms: 2,
    bathrooms: 2,
    facing: 'East',
    furnishing: 'Semi-furnished',
    suitable_for: ['Family'],
    area: 'Manvi',
    address: 'Basaveshwara Nagar, Manvi',
    landmark: 'Near Govt Junior College Ground',
    lat: 15.9910,
    lng: 77.0540,
    exact_location: false,
    allow_whatsapp: true,
    status: 'live',
    docs_added: true,
    verified: false,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [
      createPropertySvg('House', 'Ground Floor Family House')
    ],
    views_count: 180,
    chats_count: 7,
    is_demo: true
  },
  {
    id: 'listing_10',
    owner_id: 'owner_10',
    owner_name: 'Dr. Praveen Biradar',
    owner_phone_masked: '+91 98••••••34',
    owner_member_since: 'Member since 2025',
    owner_avatar: '',
    mode: 'rent',
    category: 'Apartment',
    title: '3 BHK Luxury Gated Apartment Flat',
    description: 'Gated society with CCTV, generator backup, children play area, clubhouse. Geysers in all 3 bathrooms, kitchen chimneys, master bedroom with balcony.',
    price: 16500,
    deposit: 60000,
    size_value: 1550,
    size_unit: 'sq ft',
    bedrooms: 3,
    bathrooms: 3,
    floor: '3rd of 5 floors',
    facing: 'North',
    furnishing: 'Semi-furnished',
    suitable_for: ['Family', 'Working people'],
    area: 'Raichur',
    address: 'Hyderabad Road, Near Agricultural University',
    landmark: 'Near UAS Raichur Main Gate',
    lat: 16.2210,
    lng: 77.3610,
    exact_location: true,
    allow_whatsapp: true,
    status: 'live',
    docs_added: true,
    verified: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [
      createPropertySvg('Flat', 'Luxury Apartment Flat'),
      createPropertySvg('Flat', 'Living Hall with Balcony')
    ],
    views_count: 290,
    chats_count: 16,
    is_demo: true
  },
  {
    id: 'listing_11',
    owner_id: 'owner_11',
    owner_name: 'Prabhu Linga',
    owner_phone_masked: '+91 95••••••72',
    owner_member_since: 'Member since 2026',
    owner_avatar: '',
    mode: 'rent',
    category: 'Room',
    title: '1 RK Room with Kitchen Slab for Working Men',
    description: 'Separate entrance on 1st floor, quiet location, 24 hr water supply, space for two-wheeler parking. Electricity as per separate sub-meter reading.',
    price: 3800,
    deposit: 8000,
    size_value: 220,
    size_unit: 'sq ft',
    furnishing: 'Unfurnished',
    suitable_for: ['Working people', 'Students'],
    area: 'Lingasugur',
    address: 'Kalyan Nagar, Lingasugur',
    landmark: 'Near Taluk Panchayat Office',
    lat: 16.1510,
    lng: 76.5120,
    exact_location: false,
    allow_whatsapp: false,
    status: 'live',
    docs_added: false,
    verified: false,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [
      createPropertySvg('Room', '1 RK Room Lingasugur')
    ],
    views_count: 75,
    chats_count: 3,
    is_demo: true
  },
  {
    id: 'listing_12',
    owner_id: 'owner_12',
    owner_name: 'Shrikanth K',
    owner_phone_masked: '+91 92••••••90',
    owner_member_since: 'Member since 2026',
    owner_avatar: '',
    mode: 'rent',
    category: 'Shop',
    title: 'Double Shutter Godown / Warehouse Space',
    description: 'Spacious 900 sq ft concrete roof storage space or commercial warehouse with heavy vehicle access, 15 ft ceiling height, 3-phase power sanction.',
    price: 15000,
    deposit: 50000,
    size_value: 900,
    size_unit: 'sq ft',
    furnishing: 'Unfurnished',
    suitable_for: ['Anyone', 'Working people'],
    area: 'Mudgal',
    address: 'Kushtagi Bypass Road, Mudgal',
    landmark: 'Near Indian Oil Petrol Pump',
    lat: 15.9920,
    lng: 76.4380,
    exact_location: true,
    allow_whatsapp: true,
    status: 'live',
    docs_added: true,
    verified: false,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [
      createPropertySvg('Shop', 'Mudgal Godown Space')
    ],
    views_count: 53,
    chats_count: 2,
    is_demo: true
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    listing_id: 'listing_1',
    listing_title: 'Residential Plot, Manvi Road',
    listing_price: 1850000,
    listing_mode: 'sale',
    listing_thumbnail: createPropertySvg('Plot', 'Corner Plot'),
    other_user_id: 'buyer_deepak',
    other_user_name: 'Deepak Hiremath',
    other_user_avatar: '',
    other_user_verified: true,
    last_message: 'Offer: ₹17,50,000',
    last_message_at: '10:45 AM',
    unread_count: 1,
    buyer_id: 'buyer_deepak',
    seller_id: 'user_ramesh',
    messages: [
      {
        id: 'm1',
        conversation_id: 'conv_1',
        sender_id: 'other',
        sender_name: 'Deepak Hiremath',
        body: 'Is this property still available for direct inspection?',
        type: 'text',
        created_at: '10:30 AM',
        read: true
      },
      {
        id: 'm2',
        conversation_id: 'conv_1',
        sender_id: 'me',
        sender_name: 'Ramesh Kulkarni',
        body: 'Yes, it is available. Clean titles with RTC updated.',
        type: 'text',
        created_at: '10:35 AM',
        read: true
      },
      {
        id: 'm3',
        conversation_id: 'conv_1',
        sender_id: 'other',
        sender_name: 'Deepak Hiremath',
        body: 'What is the final negotiable price?',
        type: 'text',
        created_at: '10:40 AM',
        read: true
      },
      {
        id: 'm4',
        conversation_id: 'conv_1',
        sender_id: 'other',
        sender_name: 'Deepak Hiremath',
        body: 'I am prepared for immediate registration if price matches.',
        type: 'offer',
        offer_amount: 1750000,
        offer_status: 'pending',
        created_at: '10:45 AM',
        read: false
      }
    ]
  },
  {
    id: 'conv_2',
    listing_id: 'listing_2',
    listing_title: '3 BHK Independent Duplex House',
    listing_price: 4200000,
    listing_mode: 'sale',
    listing_thumbnail: createPropertySvg('House', 'Duplex House'),
    other_user_id: 'owner_2',
    other_user_name: 'Basavaraj Patil',
    other_user_avatar: '',
    other_user_verified: true,
    last_message: 'You can come tomorrow around 4 PM to inspect the house.',
    last_message_at: 'Yesterday',
    unread_count: 0,
    buyer_id: 'user_ramesh',
    seller_id: 'owner_2',
    messages: [
      {
        id: 'm2_1',
        conversation_id: 'conv_2',
        sender_id: 'me',
        sender_name: 'Ramesh Kulkarni',
        body: 'Can I visit today to see the duplex?',
        type: 'text',
        created_at: 'Yesterday 3:15 PM',
        read: true
      },
      {
        id: 'm2_2',
        conversation_id: 'conv_2',
        sender_id: 'other',
        sender_name: 'Basavaraj Patil',
        body: 'You can come tomorrow around 4 PM to inspect the house.',
        type: 'text',
        created_at: 'Yesterday 3:45 PM',
        read: true
      }
    ]
  }
];

export const AREA_LIST: { id: string; name: string }[] = [
  { id: 'All areas', name: 'All Raichur District' },
  { id: 'Raichur', name: 'Raichur City' },
  { id: 'Manvi', name: 'Manvi' },
  { id: 'Sindhanur', name: 'Sindhanur' },
  { id: 'Lingasugur', name: 'Lingasugur' },
  { id: 'Mudgal', name: 'Mudgal' },
  { id: 'Other', name: 'Other Villages' }
];
