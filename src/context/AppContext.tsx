import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  PropertyListing, 
  Conversation, 
  UserProfile, 
  AppView, 
  AreaLocation, 
  FilterState, 
  ListingStatus 
} from '../types';
import { DEMO_USER, INITIAL_LISTINGS, INITIAL_CONVERSATIONS } from '../data/mockData';

interface AppContextType {
  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  navigate: (view: AppView) => void;
  goBack: () => void;
  activeTab: 'home' | 'search' | 'add' | 'chats' | 'profile';
  setActiveTab: (tab: 'home' | 'search' | 'add' | 'chats' | 'profile') => void;
  
  // Selection
  selectedListingId: string | null;
  selectedListing: PropertyListing | null;
  openListing: (id: string) => void;
  
  selectedConversationId: string | null;
  selectedConversation: Conversation | null;
  openConversation: (id: string) => void;
  startChatWithListing: (listing: PropertyListing, initialMessage?: string) => void;
  
  // User & Auth
  user: UserProfile | null;
  loginDemoUser: () => void;
  loginWithPhone: (phone: string, name?: string) => boolean;
  loginWithGoogle: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  isFirstLaunch: boolean;
  completeOnboarding: () => void;
  
  // Listings
  listings: PropertyListing[];
  toggleSave: (listingId: string) => void;
  isSaved: (listingId: string) => boolean;
  addListing: (newListing: Omit<PropertyListing, 'id' | 'views_count' | 'chats_count' | 'created_at'>) => string;
  updateListingStatus: (id: string, status: ListingStatus) => void;
  deleteListing: (id: string) => void;
  
  // Chats & Messaging
  conversations: Conversation[];
  totalUnreadCount: number;
  sendMessage: (
    conversationId: string, 
    text: string, 
    type?: 'text' | 'image' | 'offer', 
    offerAmount?: number,
    imageUrl?: string
  ) => void;
  respondToOffer: (conversationId: string, messageId: string, accept: boolean) => void;
  
  // WhatsApp Edge Function Simulation
  requestWhatsAppLink: (listing: PropertyListing) => { success: boolean; url?: string; error?: string };
  
  // Search & Filters
  selectedArea: AreaLocation;
  setSelectedArea: (area: AreaLocation) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;
  
  // UI Display & Toast
  isAndroidFrame: boolean;
  setIsAndroidFrame: (val: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const defaultFilters: FilterState = {
  mode: 'all',
  categories: [],
  area: 'All areas',
  docsAddedOnly: false,
  sortBy: 'newest'
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check localStorage for onboarding state & user session
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(() => {
    return localStorage.getItem('nele_intro_seen') !== 'true';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nele_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to null so user experiences the onboarding and account creation/login flow
    return null;
  });

  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [viewHistory, setViewHistory] = useState<AppView[]>(['splash']);
  const [activeTab, setActiveTabState] = useState<'home' | 'search' | 'add' | 'chats' | 'profile'>('home');

  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const [listings, setListings] = useState<PropertyListing[]>(() => {
    const saved = localStorage.getItem('nele_listings');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_LISTINGS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('nele_conversations');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_CONVERSATIONS;
  });

  const [selectedArea, setSelectedArea] = useState<AreaLocation>('All areas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Plot in Manvi Road',
    '3 BHK house Raichur',
    'Room for students',
    'Commercial shop Sindhanur'
  ]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const [isAndroidFrame, setIsAndroidFrame] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('nele_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('nele_user_session');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('nele_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('nele_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2800);
  };

  const navigate = (newView: AppView) => {
    setViewHistory(prev => [...prev, newView]);
    setCurrentView(newView);
    // Keep tab in sync when navigating to main views
    if (newView === 'home') setActiveTabState('home');
    if (newView === 'search') setActiveTabState('search');
    if (newView === 'add') setActiveTabState('add');
    if (newView === 'chats') setActiveTabState('chats');
    if (newView === 'profile') setActiveTabState('profile');
  };

  const setActiveTab = (tab: 'home' | 'search' | 'add' | 'chats' | 'profile') => {
    setActiveTabState(tab);
    if (tab === 'home') navigate('home');
    if (tab === 'search') navigate('search');
    if (tab === 'add') navigate('add');
    if (tab === 'chats') navigate('chats');
    if (tab === 'profile') navigate('profile');
  };

  const goBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); // remove current
      const previous = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setCurrentView(previous);
    } else {
      navigate('home');
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('nele_intro_seen', 'true');
    setIsFirstLaunch(false);
    navigate('auth');
  };

  const loginDemoUser = () => {
    setUser(DEMO_USER);
    showToast('Logged in as Ramesh Kulkarni (Demo)');
    navigate('home');
  };

  const loginWithPhone = (phone: string, name = 'Nele User') => {
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      full_name: name,
      phone: phone,
      masked_phone: `+91 ${phone.slice(0, 2)}••••••${phone.slice(-2)}`,
      avatar_url: '',
      area: 'Raichur',
      allow_whatsapp: true,
      member_since: 'October 2026',
      mobile_verified: true,
      google_linked: false,
      saved_listing_ids: [],
      blocked_user_ids: [],
      daily_whatsapp_count: 0
    };
    setUser(newUser);
    showToast(`Welcome, ${name}! Mobile verified.`);
    navigate('home');
    return true;
  };

  const loginWithGoogle = () => {
    const googleUser: UserProfile = {
      id: 'user_google_demo',
      full_name: 'Ananya Sharma',
      phone: '9448123456',
      masked_phone: '+91 94••••••56',
      avatar_url: '',
      area: 'Raichur',
      allow_whatsapp: true,
      member_since: 'October 2026',
      mobile_verified: true,
      google_linked: true,
      saved_listing_ids: ['listing_2'],
      blocked_user_ids: [],
      daily_whatsapp_count: 0
    };
    setUser(googleUser);
    showToast('Signed in via Google');
    navigate('home');
  };

  const logout = () => {
    setUser(null);
    showToast('Logged out successfully');
    navigate('auth');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
    showToast('Profile updated');
  };

  const openListing = (id: string) => {
    setSelectedListingId(id);
    // increment views count
    setListings(prev =>
      prev.map(item => (item.id === id ? { ...item, views_count: item.views_count + 1 } : item))
    );
    navigate('detail');
  };

  const selectedListing = listings.find(l => l.id === selectedListingId) || null;

  const openConversation = (id: string) => {
    setSelectedConversationId(id);
    // Mark messages as read
    setConversations(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            unread_count: 0,
            messages: c.messages.map(m => ({ ...m, read: true }))
          };
        }
        return c;
      })
    );
    navigate('conversation');
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null;

  const startChatWithListing = (listing: PropertyListing, initialMessage?: string) => {
    if (!user) {
      showToast('Please sign in to chat with owner');
      navigate('auth');
      return;
    }

    // Check if conversation already exists for this listing and buyer
    const existing = conversations.find(
      c => c.listing_id === listing.id && (c.buyer_id === user.id || c.seller_id === listing.owner_id)
    );

    if (existing) {
      if (initialMessage) {
        sendMessage(existing.id, initialMessage);
      }
      openConversation(existing.id);
      return;
    }

    // Create new conversation
    const newConvId = `conv_${Date.now()}`;
    const firstMsgText = initialMessage || 'Hi, is this property still available?';
    const newConv: Conversation = {
      id: newConvId,
      listing_id: listing.id,
      listing_title: listing.title,
      listing_price: listing.price,
      listing_mode: listing.mode,
      listing_thumbnail: listing.photos[0] || '',
      other_user_id: listing.owner_id,
      other_user_name: listing.owner_name,
      other_user_avatar: listing.owner_avatar,
      other_user_verified: true,
      last_message: firstMsgText,
      last_message_at: 'Just now',
      unread_count: 0,
      buyer_id: user.id,
      seller_id: listing.owner_id,
      messages: [
        {
          id: `msg_${Date.now()}`,
          conversation_id: newConvId,
          sender_id: 'me',
          sender_name: user.full_name,
          body: firstMsgText,
          type: 'text',
          created_at: 'Just now',
          read: true
        }
      ]
    };

    setConversations(prev => [newConv, ...prev]);
    // increment chat count on listing
    setListings(prev =>
      prev.map(l => (l.id === listing.id ? { ...l, chats_count: l.chats_count + 1 } : l))
    );

    openConversation(newConvId);
  };

  const toggleSave = (listingId: string) => {
    if (!user) {
      showToast('Sign in to save properties');
      navigate('auth');
      return;
    }

    const currentSaved = user.saved_listing_ids || [];
    const exists = currentSaved.includes(listingId);
    const updated = exists
      ? currentSaved.filter(id => id !== listingId)
      : [...currentSaved, listingId];

    setUser({ ...user, saved_listing_ids: updated });
    showToast(exists ? 'Removed from saved' : 'Added to saved properties');
  };

  const isSaved = (listingId: string) => {
    return user ? user.saved_listing_ids.includes(listingId) : false;
  };

  const addListing = (
    newListingData: Omit<PropertyListing, 'id' | 'views_count' | 'chats_count' | 'created_at'>
  ): string => {
    const newId = `listing_${Date.now()}`;
    const fullListing: PropertyListing = {
      ...newListingData,
      id: newId,
      views_count: 1,
      chats_count: 0,
      created_at: new Date().toISOString()
    };
    setListings(prev => [fullListing, ...prev]);
    return newId;
  };

  const updateListingStatus = (id: string, status: ListingStatus) => {
    setListings(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
    showToast(`Listing status updated to ${status}`);
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
    showToast('Listing deleted');
  };

  const sendMessage = (
    conversationId: string,
    text: string,
    type: 'text' | 'image' | 'offer' = 'text',
    offerAmount?: number,
    imageUrl?: string
  ) => {
    const newMsg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      conversation_id: conversationId,
      sender_id: 'me' as const,
      sender_name: user?.full_name || 'Me',
      body: text,
      type,
      offer_amount: offerAmount,
      offer_status: type === 'offer' ? ('pending' as const) : undefined,
      image_url: imageUrl,
      created_at: 'Just now',
      read: true
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            last_message: type === 'offer' ? `Offer: ₹${offerAmount?.toLocaleString('en-IN')}` : text,
            last_message_at: 'Just now',
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );

    // Auto simulated reply from owner after 1.8 seconds if replying to first inquiry
    setTimeout(() => {
      setConversations(prev =>
        prev.map(c => {
          if (c.id === conversationId) {
            const replyMsg = {
              id: `msg_reply_${Date.now()}`,
              conversation_id: conversationId,
              sender_id: 'other' as const,
              sender_name: c.other_user_name,
              body:
                type === 'offer'
                  ? `I saw your offer of ₹${offerAmount?.toLocaleString('en-IN')}. Let me think or discuss with family.`
                  : `Thanks for contacting! Yes, the documents are available for inspection anytime.`,
              type: 'text' as const,
              created_at: 'Just now',
              read: true
            };
            return {
              ...c,
              last_message: replyMsg.body,
              last_message_at: 'Just now',
              messages: [...c.messages, replyMsg]
            };
          }
          return c;
        })
      );
    }, 1800);
  };

  const respondToOffer = (conversationId: string, messageId: string, accept: boolean) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          const updatedMsgs = c.messages.map(m => {
            if (m.id === messageId) {
              return { ...m, offer_status: accept ? ('accepted' as const) : ('declined' as const) };
            }
            return m;
          });
          return { ...c, messages: updatedMsgs };
        }
        return c;
      })
    );
    showToast(accept ? 'Offer accepted!' : 'Offer declined');
  };

  // WhatsApp Edge Function Simulation
  // Checks: user signed in, not blocked, listing allows WhatsApp, daily limit < 20
  const requestWhatsAppLink = (listing: PropertyListing) => {
    if (!user) {
      showToast('Please sign in to contact via WhatsApp');
      navigate('auth');
      return { success: false, error: 'Sign in required' };
    }

    if (user.blocked_user_ids.includes(listing.owner_id)) {
      return { success: false, error: 'User is blocked' };
    }

    if (!listing.allow_whatsapp) {
      return { success: false, error: 'Owner has disabled WhatsApp contact' };
    }

    if (user.daily_whatsapp_count >= 20) {
      return { success: false, error: 'Daily WhatsApp limit (20) reached' };
    }

    // Increment count
    setUser({ ...user, daily_whatsapp_count: user.daily_whatsapp_count + 1 });

    const message = encodeURIComponent(`Hi, I saw your listing "${listing.title}" on NELE.`);
    // In production this returns wa.me URL without exposing raw number in page DOM directly
    const url = `https://wa.me/919876543210?text=${message}`;
    return { success: true, url };
  };

  const totalUnreadCount = conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0);

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches(prev => [query, ...prev.filter(q => q.toLowerCase() !== query.toLowerCase())].slice(0, 6));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        navigate,
        goBack,
        activeTab,
        setActiveTab,
        selectedListingId,
        selectedListing,
        openListing,
        selectedConversationId,
        selectedConversation,
        openConversation,
        startChatWithListing,
        user,
        loginDemoUser,
        loginWithPhone,
        loginWithGoogle,
        logout,
        updateProfile,
        isFirstLaunch,
        completeOnboarding,
        listings,
        toggleSave,
        isSaved,
        addListing,
        updateListingStatus,
        deleteListing,
        conversations,
        totalUnreadCount,
        sendMessage,
        respondToOffer,
        requestWhatsAppLink,
        selectedArea,
        setSelectedArea,
        searchQuery,
        setSearchQuery,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        filters,
        setFilters,
        resetFilters,
        isAndroidFrame,
        setIsAndroidFrame,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
