import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  Heart, 
  ListOrdered, 
  LogOut, 
  CheckCircle2, 
  Trash2, 
  ExternalLink,
  Edit3,
  X,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from './PropertyCard';
import { formatIndianPrice } from '../utils/formatters';
import { ListingStatus } from '../types';

export const ProfileScreen: React.FC = () => {
  const { 
    user, 
    logout, 
    setCurrentView, 
    listings, 
    updateListingStatus, 
    deleteListing, 
    openListing,
    updateProfile,
    showToast 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'saved'>('listings');
  const [listingFilterStatus, setListingFilterStatus] = useState<ListingStatus>('live');
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(user?.full_name || 'Ramesh Kulkarni');

  if (!user) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-11 h-11 bg-[#e8e9ff] border border-[#d6d9fc] rounded-[4px] flex items-center justify-center mb-3 text-[#533afd]">
          <User size={22} />
        </div>
        <h3 className="text-base font-light text-[#061b31] tracking-[-0.02em]">
          Profile & Account Ledger
        </h3>
        <p className="text-xs text-[#64748d] max-w-[240px] mt-1 mb-4">
          Sign in to manage your posted properties, view inquiry chats, and access saved homes.
        </p>
        <button
          onClick={() => setCurrentView('auth')}
          className="stripe-btn-primary px-4 py-2 text-xs"
        >
          Sign in or Register
        </button>
      </div>
    );
  }

  const myListings = listings.filter(
    l => l.owner_id === user.id || l.id === 'listing_1'
  );

  const filteredMyListings = myListings.filter(l => {
    if (listingFilterStatus === 'live') return l.status === 'live';
    if (listingFilterStatus === 'paused') return l.status === 'paused';
    if (listingFilterStatus === 'sold') return l.status === 'sold' || l.status === 'rented';
    return true;
  });

  const savedListings = listings.filter(l => user.saved_listing_ids.includes(l.id));

  const handleSaveProfile = () => {
    updateProfile({ full_name: editName });
    setShowEditModal(false);
  };

  const handleLegalWhatsApp = () => {
    const legalNumber = '919876543210';
    const msg = encodeURIComponent(
      'Hi NELE Legal Team, I need registration, RTC verification, or sale deed assistance in Raichur.'
    );
    window.open(`https://wa.me/${legalNumber}?text=${msg}`, '_blank');
    showToast('Opening WhatsApp with NELE Legal Advisory');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#ffffff] overflow-y-auto no-scrollbar select-none">
      {/* Profile Header */}
      <div className="p-4 bg-[#ffffff] border-b border-[#e5edf5] shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[4px] border border-[#d6d9fc] bg-[#e8e9ff] flex items-center justify-center text-lg font-light text-[#533afd]">
              {user.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-normal text-[#061b31]">
                  {user.full_name}
                </h2>
                <ShieldCheck size={14} className="text-[#533afd]" />
              </div>
              <p className="text-xs font-normal text-[#64748d] tabular-nums">
                {user.masked_phone}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] bg-[#f8fafd] text-[#50617a] px-1.5 py-0.2 rounded-[4px] border border-[#e5edf5]">
                  {user.member_since}
                </span>
                <span className="text-[10px] bg-[#e8e9ff] text-[#533afd] px-1.5 py-0.2 rounded-[4px] border border-[#d6d9fc]">
                  {user.area}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="w-7 h-7 rounded-[4px] border border-[#e5edf5] bg-[#ffffff] flex items-center justify-center text-[#64748d] hover:text-[#061b31] transition-colors"
            title="Edit Profile"
          >
            <Edit3 size={13} />
          </button>
        </div>

        {/* Verification Status Pills */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#e5edf5]">
          <div className="flex items-center gap-1 text-[11px] font-normal text-[#50617a]">
            <CheckCircle2 size={12} className="text-[#047857]" />
            <span>Mobile OTP Verified</span>
          </div>
          <span className="text-[#e5edf5]">•</span>
          <div className="flex items-center gap-1 text-[11px] font-normal text-[#50617a]">
            <CheckCircle2 size={12} className="text-[#047857]" />
            <span>Google Linked</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 pb-28">
        {/* Legal Assistance WhatsApp Banner Card */}
        <div
          onClick={handleLegalWhatsApp}
          className="bg-[#f8fafd] hover:bg-[#e8e9ff]/50 border border-[#e5edf5] rounded-[4px] p-3 flex items-center justify-between cursor-pointer transition-colors"
        >
          <div>
            <h4 className="text-xs font-normal text-[#061b31]">
              Need legal or registration assistance?
            </h4>
            <p className="text-[11px] text-[#64748d] mt-0.5">
              Talk directly with NELE legal advisory team on WhatsApp.
            </p>
          </div>
          <ChevronRight size={14} className="text-[#533afd] shrink-0 ml-2" />
        </div>

        {/* Tab Switcher: My Listings vs Saved */}
        <div className="flex bg-[#f8fafd] p-0.5 rounded-[4px] border border-[#e5edf5]">
          <button
            onClick={() => setActiveSubTab('listings')}
            className={`flex-1 py-1.5 text-xs font-normal rounded-[3px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === 'listings'
                ? 'bg-[#ffffff] text-[#061b31] border border-[#e5edf5]'
                : 'text-[#64748d] hover:text-[#061b31]'
            }`}
          >
            <ListOrdered size={13} />
            <span>My Listings ({myListings.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('saved')}
            className={`flex-1 py-1.5 text-xs font-normal rounded-[3px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === 'saved'
                ? 'bg-[#ffffff] text-[#061b31] border border-[#e5edf5]'
                : 'text-[#64748d] hover:text-[#061b31]'
            }`}
          >
            <Heart size={13} />
            <span>Saved ({savedListings.length})</span>
          </button>
        </div>

        {/* Tab 1: My Listings View */}
        {activeSubTab === 'listings' && (
          <div className="space-y-2.5">
            {/* Status Filter Sub-Pills */}
            <div className="flex gap-1.5">
              {[
                { id: 'live', label: 'Active' },
                { id: 'paused', label: 'Paused' },
                { id: 'sold', label: 'Sold / Rented' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setListingFilterStatus(tab.id as ListingStatus)}
                  className={`px-2.5 py-1 text-xs font-normal rounded-[4px] border cursor-pointer transition-colors ${
                    listingFilterStatus === tab.id
                      ? 'bg-[#e8e9ff] text-[#533afd] border-[#b9b9f9]'
                      : 'bg-[#ffffff] text-[#50617a] border-[#e5edf5]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* List of my properties */}
            {filteredMyListings.length > 0 ? (
              filteredMyListings.map(item => (
                <div
                  key={item.id}
                  className="bg-[#ffffff] border border-[#e5edf5] rounded-[4px] p-3 space-y-2"
                >
                  <div className="flex gap-2.5">
                    <div className="w-14 h-14 rounded-[3px] border border-[#e5edf5] overflow-hidden bg-neutral-100 shrink-0">
                      <img src={item.photos[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-normal text-[#061b31] truncate">
                        {item.title}
                      </h4>
                      <div className="text-xs font-normal text-[#061b31] mt-0.5 tabular-nums">
                        {formatIndianPrice(item.price, item.mode === 'rent')}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-[#64748d] mt-1 tabular-nums">
                        <span>{item.views_count} Views</span>
                        <span>•</span>
                        <span>{item.chats_count} Inquiries</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-[#e5edf5] text-xs">
                    <button
                      onClick={() => openListing(item.id)}
                      className="flex-1 py-1 bg-[#f8fafd] hover:bg-[#e5edf5] border border-[#e5edf5] rounded-[3px] text-[11px] font-normal text-[#061b31]"
                    >
                      View
                    </button>
                    {item.status === 'live' ? (
                      <button
                        onClick={() => updateListingStatus(item.id, 'paused')}
                        className="flex-1 py-1 bg-[#f8fafd] hover:bg-[#e5edf5] border border-[#e5edf5] rounded-[3px] text-[11px] font-normal text-[#b45309]"
                      >
                        Pause
                      </button>
                    ) : (
                      <button
                        onClick={() => updateListingStatus(item.id, 'live')}
                        className="flex-1 py-1 bg-[#e8e9ff] text-[#533afd] border border-[#b9b9f9] rounded-[3px] text-[11px] font-normal"
                      >
                        Resume
                      </button>
                    )}
                    {item.status !== 'sold' && (
                      <button
                        onClick={() => updateListingStatus(item.id, item.mode === 'sale' ? 'sold' : 'rented')}
                        className="flex-1 py-1 bg-[#f8fafd] hover:bg-[#e5edf5] border border-[#e5edf5] rounded-[3px] text-[11px] font-normal text-[#047857]"
                      >
                        Mark Sold
                      </button>
                    )}
                    <button
                      onClick={() => deleteListing(item.id)}
                      className="w-6 h-6 flex items-center justify-center text-[#e11d48] hover:bg-[#fff1f2] border border-[#e5edf5] rounded-[3px]"
                      title="Delete listing"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] p-6 text-center">
                <p className="text-xs font-normal text-[#64748d]">
                  No properties under this status.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Properties */}
        {activeSubTab === 'saved' && (
          <div>
            {savedListings.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {savedListings.map(listing => (
                  <PropertyCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] p-6 text-center">
                <Heart size={20} className="mx-auto mb-2 text-[#839bc8]" />
                <h4 className="text-xs font-normal text-[#061b31]">No saved properties</h4>
                <p className="text-xs text-[#64748d] mt-1">
                  Tap the heart icon on any listing to store it in your ledger.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Settings & Privacy Shortcuts */}
        <div className="space-y-1.5 pt-2">
          <h3 className="text-[11px] font-normal text-[#64748d] tracking-[0.5px] uppercase">
            Account Preferences
          </h3>

          <div className="bg-[#ffffff] border border-[#e5edf5] rounded-[4px] overflow-hidden">
            <button
              onClick={() => setCurrentView('settings')}
              className="w-full p-3 flex items-center justify-between text-left text-xs font-normal border-b border-[#e5edf5] hover:bg-[#f8fafd] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Settings size={14} className="text-[#50617a]" />
                <span className="text-[#061b31]">Settings & Preferences</span>
              </div>
              <ChevronRight size={13} className="text-[#839bc8]" />
            </button>

            <button
              onClick={() => setCurrentView('onboarding')}
              className="w-full p-3 flex items-center justify-between text-left text-xs font-normal border-b border-[#e5edf5] hover:bg-[#f8fafd] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-[2px] bg-[#e8e9ff] flex items-center justify-center text-[#533afd] text-[10px] font-medium">3</div>
                <span className="text-[#061b31]">App Tour & Feature Guide</span>
              </div>
              <ChevronRight size={13} className="text-[#839bc8]" />
            </button>

            <button
              onClick={() => setCurrentView('splash')}
              className="w-full p-3 flex items-center justify-between text-left text-xs font-normal border-b border-[#e5edf5] hover:bg-[#f8fafd] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#533afd]">✦</span>
                <span className="text-[#061b31]">Replay Logo Splash Animation</span>
              </div>
              <ChevronRight size={13} className="text-[#839bc8]" />
            </button>

            <button
              onClick={() => setCurrentView('onboarding')}
              className="w-full p-3 flex items-center justify-between text-left text-xs font-normal border-b border-[#e5edf5] hover:bg-[#f8fafd] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#533afd]">❖</span>
                <span className="text-[#061b31]">Replay Onboarding Tour (3 Slides)</span>
              </div>
              <ChevronRight size={13} className="text-[#839bc8]" />
            </button>

            <button
              onClick={() => setCurrentView('auth')}
              className="w-full p-3 flex items-center justify-between text-left text-xs font-normal border-b border-[#e5edf5] hover:bg-[#f8fafd] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#533afd]">👤</span>
                <span className="text-[#061b31]">Account Creation & Sign In</span>
              </div>
              <ChevronRight size={13} className="text-[#839bc8]" />
            </button>

            <button
              onClick={() => setCurrentView('privacy_security')}
              className="w-full p-3 flex items-center justify-between text-left text-xs font-normal border-b border-[#e5edf5] hover:bg-[#f8fafd] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#50617a]" />
                <span className="text-[#061b31]">Privacy & Security</span>
              </div>
              <ChevronRight size={13} className="text-[#839bc8]" />
            </button>

            <button
              onClick={logout}
              className="w-full p-3 flex items-center justify-between text-left text-xs font-normal text-[#e11d48] hover:bg-[#fff1f2] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <LogOut size={14} />
                <span>Sign out</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-[#061b31]/40 z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border border-[#e5edf5] rounded-[4px] p-4 w-full max-w-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#e5edf5] pb-2">
              <h3 className="text-sm font-light text-[#061b31] tracking-[-0.02em]">
                Edit Profile
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-5 h-5 rounded-[2px] border border-[#e5edf5] flex items-center justify-center text-[#64748d]"
              >
                <X size={11} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-normal text-[#50617a] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full h-10 px-3 stripe-input"
              />
            </div>

            <div className="flex gap-2 pt-1 border-t border-[#e5edf5]">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 h-9 stripe-btn-ghost text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="flex-1 h-9 stripe-btn-primary text-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
