import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  FileText, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  MoreVertical, 
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatIndianPrice, formatTimeAgo } from '../utils/formatters';

export const PropertyDetailScreen: React.FC = () => {
  const { 
    selectedListing, 
    goBack, 
    toggleSave, 
    isSaved, 
    startChatWithListing, 
    requestWhatsAppLink,
    listings,
    openListing,
    showToast 
  } = useApp();

  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [showLightbox, setShowLightbox] = useState<boolean>(false);
  const [isDescExpanded, setIsDescExpanded] = useState<boolean>(false);
  const [showOverflowMenu, setShowOverflowMenu] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('Fake listing or wrong photos');

  if (!selectedListing) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-light text-[#061b31] mb-3">Listing not found</p>
        <button onClick={goBack} className="stripe-btn-primary px-3.5 py-1.5 text-xs">
          Return to Ledger
        </button>
      </div>
    );
  }

  const saved = isSaved(selectedListing.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedListing.title,
        text: `Check out this direct owner property on NELE: ${selectedListing.title} (${formatIndianPrice(selectedListing.price, selectedListing.mode === 'rent')})`,
        url: window.location.href
      }).catch(() => {
        showToast('Link copied to clipboard');
      });
    } else {
      showToast('Listing link copied to clipboard');
    }
  };

  const handleWhatsAppClick = () => {
    const res = requestWhatsAppLink(selectedListing);
    if (res.success && res.url) {
      window.open(res.url, '_blank');
      showToast('Opening WhatsApp with verified owner prefilled message');
    } else if (res.error) {
      showToast(res.error);
    }
  };

  const handleAskDocuments = () => {
    startChatWithListing(
      selectedListing,
      'Hi, I saw you have uploaded verified property documents (RTC / Pahani / Khata). Could you please share the preview with me?'
    );
  };

  const handleReportSubmit = () => {
    setShowReportModal(false);
    showToast('Listing reported to NELE review team.');
  };

  const similarListings = listings.filter(
    l => l.id !== selectedListing.id && (l.area === selectedListing.area || l.category === selectedListing.category)
  ).slice(0, 4);

  return (
    <div className="w-full h-full flex flex-col bg-[#ffffff] overflow-y-auto no-scrollbar relative select-none">
      {/* Top Floating App Bar */}
      <div className="h-12 bg-[#ffffff] border-b border-[#e5edf5] flex items-center justify-between px-3.5 sticky top-0 z-30 shrink-0">
        <button
          onClick={goBack}
          className="w-7 h-7 rounded-[4px] border border-[#e5edf5] bg-[#ffffff] flex items-center justify-center text-[#061b31] hover:bg-[#f8fafd] transition-colors"
          title="Back"
        >
          <ArrowLeft size={15} />
        </button>

        <div className="text-xs font-normal text-[#061b31] tracking-[-0.01em] truncate max-w-[170px]">
          {selectedListing.category} • {selectedListing.area}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Heart Save */}
          <button
            onClick={() => toggleSave(selectedListing.id)}
            className={`w-7 h-7 rounded-[4px] border border-[#e5edf5] flex items-center justify-center transition-colors ${
              saved ? 'bg-[#e8e9ff] text-[#533afd] border-[#b9b9f9]' : 'bg-[#ffffff] text-[#64748d]'
            }`}
          >
            <Heart size={13} className={saved ? 'fill-[#533afd]' : ''} strokeWidth={1.5} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="w-7 h-7 rounded-[4px] border border-[#e5edf5] bg-[#ffffff] flex items-center justify-center text-[#64748d] hover:text-[#061b31] transition-colors"
          >
            <Share2 size={13} />
          </button>

          {/* Overflow Menu */}
          <div className="relative">
            <button
              onClick={() => setShowOverflowMenu(!showOverflowMenu)}
              className="w-7 h-7 rounded-[4px] border border-[#e5edf5] bg-[#ffffff] flex items-center justify-center text-[#64748d]"
            >
              <MoreVertical size={13} />
            </button>

            {showOverflowMenu && (
              <div className="absolute right-0 top-9 w-40 bg-[#ffffff] border border-[#e5edf5] rounded-[4px] py-1 z-40">
                <button
                  onClick={() => {
                    setShowOverflowMenu(false);
                    setShowReportModal(true);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs font-normal text-[#e11d48] hover:bg-[#fff1f2] flex items-center gap-2"
                >
                  Report this listing
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Scrollable Body */}
      <div className="space-y-4 pb-24">
        {/* Photo Carousel Container with Counter */}
        <div className="relative aspect-[4/3] w-full bg-[#f8fafd] border-b border-[#e5edf5]">
          <img
            src={selectedListing.photos[activePhotoIndex] || selectedListing.photos[0]}
            alt={selectedListing.title}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setShowLightbox(true)}
          />

          {/* Badges on Photo */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {selectedListing.verified ? (
              <div className="bg-[#061b31] text-[#ffffff] text-[9px] font-normal px-2 py-0.5 rounded-[4px]">
                NELE verified
              </div>
            ) : selectedListing.docs_added ? (
              <div className="bg-[#e8e9ff] text-[#533afd] border border-[#d6d9fc] text-[9px] font-normal px-2 py-0.5 rounded-[4px]">
                Docs added
              </div>
            ) : null}
          </div>

          {/* Photo Counter */}
          <div className="absolute bottom-2.5 right-2.5 bg-[#061b31]/80 text-white text-[10px] font-normal px-2 py-0.5 rounded-[4px] tabular-nums">
            {activePhotoIndex + 1} / {selectedListing.photos.length}
          </div>

          {/* Thumbnail Strip */}
          {selectedListing.photos.length > 1 && (
            <div className="absolute bottom-2.5 left-2.5 flex gap-1">
              {selectedListing.photos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-6 h-6 rounded-[2px] border overflow-hidden transition-all ${
                    activePhotoIndex === idx
                      ? 'border-[#533afd] scale-105'
                      : 'border-[#ffffff] opacity-75'
                  }`}
                >
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="px-4 space-y-3.5">
          {/* Price & Title Block — Stripe Statement Pattern */}
          <div className="bg-[#ffffff] border border-[#e5edf5] rounded-[4px] p-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-light text-[#061b31] tracking-[-0.03em] tabular-nums">
                {formatIndianPrice(selectedListing.price, selectedListing.mode === 'rent')}
              </span>
              <span className="text-[11px] font-normal text-[#839bc8] tabular-nums">
                {formatTimeAgo(selectedListing.created_at)}
              </span>
            </div>

            {selectedListing.deposit && (
              <p className="text-xs font-normal text-[#64748d] tabular-nums">
                Security deposit: {formatIndianPrice(selectedListing.deposit)}
              </p>
            )}

            <h1 className="text-sm font-normal text-[#061b31] leading-snug">
              {selectedListing.title}
            </h1>

            <div className="flex items-center gap-1.5 text-xs text-[#50617a] font-normal">
              <MapPin size={12} className="text-[#533afd]" />
              <span>{selectedListing.address || selectedListing.area}</span>
            </div>

            {/* Tags Row */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#e5edf5]">
              <span className="text-[10px] font-normal bg-[#e8e9ff] text-[#533afd] border border-[#d6d9fc] px-1.5 py-0.5 rounded-[4px]">
                {selectedListing.mode === 'sale' ? 'For Sale' : 'For Rent'}
              </span>
              <span className="text-[10px] font-normal bg-[#f8fafd] text-[#50617a] border border-[#e5edf5] px-1.5 py-0.5 rounded-[4px] tabular-nums">
                {selectedListing.size_value} {selectedListing.size_unit}
              </span>
              {selectedListing.facing && (
                <span className="text-[10px] font-normal bg-[#f8fafd] text-[#50617a] border border-[#e5edf5] px-1.5 py-0.5 rounded-[4px]">
                  {selectedListing.facing} Facing
                </span>
              )}
              {selectedListing.furnishing && (
                <span className="text-[10px] font-normal bg-[#f8fafd] text-[#50617a] border border-[#e5edf5] px-1.5 py-0.5 rounded-[4px]">
                  {selectedListing.furnishing}
                </span>
              )}
            </div>
          </div>

          {/* Key Facts Grid */}
          <div className="bg-[#ffffff] border border-[#e5edf5] rounded-[4px] p-4">
            <h3 className="text-[11px] font-normal text-[#64748d] tracking-[0.5px] uppercase mb-2.5">
              Property Specs
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#f8fafd] p-2 rounded-[4px] border border-[#e5edf5]">
                <span className="text-[10px] text-[#839bc8] block">Type</span>
                <span className="font-normal text-[#061b31]">{selectedListing.category}</span>
              </div>
              <div className="bg-[#f8fafd] p-2 rounded-[4px] border border-[#e5edf5]">
                <span className="text-[10px] text-[#839bc8] block">Total Area</span>
                <span className="font-normal text-[#061b31] tabular-nums">{selectedListing.size_value} {selectedListing.size_unit}</span>
              </div>
              {selectedListing.bedrooms != null && (
                <div className="bg-[#f8fafd] p-2 rounded-[4px] border border-[#e5edf5]">
                  <span className="text-[10px] text-[#839bc8] block">Bedrooms</span>
                  <span className="font-normal text-[#061b31]">{selectedListing.bedrooms} BHK</span>
                </div>
              )}
              {selectedListing.road_width && (
                <div className="bg-[#f8fafd] p-2 rounded-[4px] border border-[#e5edf5]">
                  <span className="text-[10px] text-[#839bc8] block">Approach Road</span>
                  <span className="font-normal text-[#061b31]">{selectedListing.road_width}</span>
                </div>
              )}
              {selectedListing.floor && (
                <div className="bg-[#f8fafd] p-2 rounded-[4px] border border-[#e5edf5]">
                  <span className="text-[10px] text-[#839bc8] block">Level</span>
                  <span className="font-normal text-[#061b31]">{selectedListing.floor}</span>
                </div>
              )}
              {selectedListing.suitable_for && selectedListing.suitable_for.length > 0 && (
                <div className="bg-[#f8fafd] p-2 rounded-[4px] border border-[#e5edf5] col-span-2">
                  <span className="text-[10px] text-[#839bc8] block">Suitable For</span>
                  <span className="font-normal text-[#061b31]">{selectedListing.suitable_for.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#ffffff] border border-[#e5edf5] rounded-[4px] p-4">
            <h3 className="text-[11px] font-normal text-[#64748d] tracking-[0.5px] uppercase mb-1.5">
              Description
            </h3>
            <p className={`text-xs text-[#50617a] leading-relaxed ${isDescExpanded ? '' : 'line-clamp-3'}`}>
              {selectedListing.description}
            </p>
            {selectedListing.description.length > 120 && (
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="text-xs font-normal text-[#533afd] hover:underline mt-1.5 cursor-pointer"
              >
                {isDescExpanded ? 'Read less' : 'Read more ›'}
              </button>
            )}
          </div>

          {/* Verified Documents (Stripe Lavender Surface Card) */}
          {selectedListing.docs_added && (
            <div className="bg-[#e8e9ff] border border-[#b9b9f9] rounded-[4px] p-3.5">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-[4px] bg-[#ffffff] border border-[#b9b9f9] flex items-center justify-center shrink-0">
                  <FileText size={15} className="text-[#533afd]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-normal text-[#061b31]">
                      Owner has uploaded legal records
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#50617a] mt-0.5 leading-snug">
                    Encumbrance certificate & RTC stored securely. Request preview permission in chat.
                  </p>
                  <button
                    onClick={handleAskDocuments}
                    className="mt-2.5 px-3 py-1.5 stripe-btn-primary text-xs gap-1.5 w-full"
                  >
                    <MessageSquare size={13} />
                    <span>Ask owner to share in chat</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Location Map Container */}
          <div className="bg-[#ffffff] border border-[#e5edf5] rounded-[4px] p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[11px] font-normal text-[#64748d] tracking-[0.5px] uppercase">
                Location & Coordinates
              </h3>
              <span className="text-[10px] font-normal bg-[#f8fafd] text-[#50617a] px-2 py-0.5 rounded-[4px] border border-[#e5edf5]">
                {selectedListing.exact_location ? 'Exact Pin' : 'Approximate'}
              </span>
            </div>

            <div className="w-full h-36 bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5edf5_1px,transparent_1px),linear-gradient(to_bottom,#e5edf5_1px,transparent_1px)] bg-[size:20px_20px]"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-7 h-7 bg-[#533afd] rounded-[4px] flex items-center justify-center text-white">
                  <MapPin size={15} />
                </div>
                <span className="bg-[#061b31] text-white text-[9px] font-normal px-2 py-0.5 rounded-[4px] mt-1">
                  {selectedListing.area}
                </span>
              </div>

              {selectedListing.landmark && (
                <div className="absolute bottom-2 left-2 right-2 bg-white/95 px-2 py-1 rounded-[4px] border border-[#e5edf5] text-[10px] text-[#50617a] truncate">
                  Landmark: {selectedListing.landmark}
                </div>
              )}
            </div>
          </div>

          {/* Owner Card */}
          <div className="bg-[#ffffff] border border-[#e5edf5] rounded-[4px] p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[4px] border border-[#e5edf5] bg-[#f8fafd] flex items-center justify-center text-sm font-normal text-[#061b31]">
                {selectedListing.owner_name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-normal text-[#061b31]">
                    {selectedListing.owner_name}
                  </h4>
                  <ShieldCheck size={14} className="text-[#533afd]" />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#64748d] mt-0.5">
                  <span className="bg-[#f8fafd] border border-[#e5edf5] px-1.5 py-0.2 rounded-[4px]">
                    Verified
                  </span>
                  <span>{selectedListing.owner_member_since}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {similarListings.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-[11px] font-normal text-[#64748d] tracking-[0.5px] uppercase">
                Similar in {selectedListing.area}
              </h3>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {similarListings.map(item => (
                  <div
                    key={item.id}
                    onClick={() => openListing(item.id)}
                    className="w-32 shrink-0 bg-[#ffffff] border border-[#e5edf5] rounded-[4px] p-2 cursor-pointer hover:bg-[#f8fafd]"
                  >
                    <div className="aspect-[4/3] bg-neutral-100 rounded-[2px] border border-[#e5edf5] overflow-hidden mb-1.5">
                      <img src={item.photos[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs font-normal text-[#061b31] truncate tabular-nums">
                      {formatIndianPrice(item.price, item.mode === 'rent', true)}
                    </div>
                    <div className="text-[10px] text-[#64748d] truncate">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Contact Bar — Stripe Hero Action Pair Pattern */}
      <div className="h-15 bg-[#ffffff] border-t border-[#e5edf5] px-4 flex items-center gap-2 sticky bottom-0 z-30">
        {selectedListing.allow_whatsapp && (
          <button
            onClick={handleWhatsAppClick}
            className="flex-1 h-10 stripe-btn-ghost text-xs gap-1.5"
            title="Chat via WhatsApp"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#533afd]">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
            <span>WhatsApp</span>
          </button>
        )}

        <button
          onClick={() => startChatWithListing(selectedListing)}
          className="flex-1 h-10 stripe-btn-primary text-xs gap-1.5"
        >
          <MessageSquare size={14} />
          <span>Chat with owner</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 bg-[#061b31]/95 z-50 flex flex-col justify-between p-4">
          <div className="flex justify-between items-center text-white">
            <span className="text-xs font-normal tabular-nums">
              {activePhotoIndex + 1} of {selectedListing.photos.length}
            </span>
            <button
              onClick={() => setShowLightbox(false)}
              className="w-7 h-7 rounded-[4px] bg-white/10 flex items-center justify-center text-white"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img
              src={selectedListing.photos[activePhotoIndex]}
              alt=""
              className="max-h-[70vh] max-w-full rounded-[4px] border border-white/20 object-contain"
            />
          </div>
          <div className="flex justify-center gap-1.5 pb-3">
            {selectedListing.photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActivePhotoIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activePhotoIndex === i ? 'bg-[#533afd]' : 'bg-neutral-600'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Report Listing Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-[#061b31]/40 z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border border-[#e5edf5] rounded-[4px] p-4 w-full max-w-sm space-y-3">
            <h3 className="text-sm font-light text-[#061b31] tracking-[-0.02em]">
              Report Listing
            </h3>
            <p className="text-xs text-[#64748d]">
              Select reason for reporting this property:
            </p>
            <div className="space-y-1.5">
              {[
                'Fake listing or wrong photos',
                'Wrong price or brokerage requested',
                'Property already sold or rented',
                'Spam or fraudulent behavior',
                'Other issue'
              ].map(reason => (
                <label
                  key={reason}
                  className="flex items-center gap-2 p-2 rounded-[4px] border border-[#e5edf5] text-xs font-normal cursor-pointer hover:bg-[#f8fafd]"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    checked={reportReason === reason}
                    onChange={() => setReportReason(reason)}
                    className="accent-[#533afd]"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t border-[#e5edf5]">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="flex-1 h-9 stripe-btn-ghost text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReportSubmit}
                className="flex-1 h-9 stripe-btn-danger text-xs"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
