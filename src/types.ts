export type PropertyMode = 'sale' | 'rent';

export type PropertyCategory = 'Plot' | 'House' | 'Flat' | 'Apartment' | 'Shop' | 'Room';

export type AreaLocation = 
  | 'All areas'
  | 'Raichur'
  | 'Manvi'
  | 'Sindhanur'
  | 'Lingasugur'
  | 'Mudgal'
  | 'Other';

export type SuitableFor = 'Family' | 'Students' | 'Working people' | 'Anyone';

export type FurnishingStatus = 'Unfurnished' | 'Semi-furnished' | 'Fully-furnished';

export type FacingDirection = 'East' | 'North' | 'West' | 'South' | 'North-East' | 'North-West';

export type ListingStatus = 'live' | 'draft' | 'paused' | 'sold' | 'rented' | 'removed';

export type SizeUnit = 'sq ft' | 'sq yd' | 'guntas' | 'cents' | 'acres';

export interface PropertyListing {
  id: string;
  owner_id: string;
  owner_name: string;
  owner_phone_masked: string;
  owner_member_since: string;
  owner_avatar: string;
  mode: PropertyMode;
  category: PropertyCategory;
  title: string;
  description: string;
  price: number;
  deposit?: number;
  size_value: number;
  size_unit: SizeUnit;
  bedrooms?: number;
  bathrooms?: number;
  floor?: string;
  facing?: FacingDirection;
  furnishing?: FurnishingStatus;
  road_width?: string;
  suitable_for?: SuitableFor[];
  area: AreaLocation;
  address: string;
  landmark?: string;
  lat: number;
  lng: number;
  exact_location: boolean;
  allow_whatsapp: boolean;
  status: ListingStatus;
  docs_added: boolean;
  verified: boolean;
  created_at: string;
  photos: string[];
  documents?: {
    id: string;
    doc_type: 'RTC / Pahani' | 'Khata' | 'Sale Deed' | 'Encumbrance Certificate' | 'Tax Receipt';
    title: string;
    uploadDate: string;
  }[];
  views_count: number;
  chats_count: number;
  is_demo?: boolean;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: 'me' | 'other';
  sender_name: string;
  body: string;
  type: 'text' | 'image' | 'offer';
  image_url?: string;
  offer_amount?: number;
  offer_status?: 'pending' | 'accepted' | 'declined';
  created_at: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_price: number;
  listing_mode: PropertyMode;
  listing_thumbnail: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar: string;
  other_user_verified: boolean;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  messages: ChatMessage[];
  buyer_id: string;
  seller_id: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  masked_phone: string;
  avatar_url: string;
  area: AreaLocation;
  allow_whatsapp: boolean;
  member_since: string;
  mobile_verified: boolean;
  google_linked: boolean;
  saved_listing_ids: string[];
  blocked_user_ids: string[];
  daily_whatsapp_count: number;
}

export interface FilterState {
  mode: PropertyMode | 'all';
  categories: PropertyCategory[];
  area: AreaLocation;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  furnishing?: FurnishingStatus;
  suitableFor?: SuitableFor[];
  docsAddedOnly: boolean;
  sortBy: 'newest' | 'price_low' | 'price_high';
}

export type AppView = 
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'home'
  | 'search'
  | 'detail'
  | 'add'
  | 'chats'
  | 'conversation'
  | 'profile'
  | 'profile_listings'
  | 'profile_saved'
  | 'settings'
  | 'privacy_security'
  | 'terms'
  | 'privacy_policy';
