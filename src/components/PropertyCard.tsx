import React from 'react';
import { Heart } from 'lucide-react';
import { PropertyListing } from '../types';
import { formatIndianPrice, formatTimeAgo } from '../utils/formatters';
import { useApp } from '../context/AppContext';

interface PropertyCardProps {
  listing: PropertyListing;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ listing }) => {
  const { openListing, toggleSave, isSaved } = useApp();
  const saved = isSaved(listing.id);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(listing.id);
  };

  return (
    <div
      onClick={() => openListing(listing.id)}
      className="bg-[#ffffff] hover:bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] overflow-hidden flex flex-col justify-between cursor-pointer transition-colors relative select-none"
    >
      {/* Photo Container: 4:3 ratio with hairline divider */}
      <div className="relative aspect-[4/3] w-full bg-[#f8fafd] border-b border-[#e5edf5] overflow-hidden">
        <img
          src={listing.photos[0]}
          alt={listing.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Top-Left Badge */}
        {listing.verified ? (
          <div className="absolute top-2 left-2 bg-[#061b31] text-[#ffffff] text-[9px] font-normal px-1.5 py-0.5 rounded-[4px]">
            NELE verified
          </div>
        ) : listing.docs_added ? (
          <div className="absolute top-2 left-2 bg-[#e8e9ff] text-[#533afd] border border-[#d6d9fc] text-[9px] font-normal px-1.5 py-0.5 rounded-[4px]">
            Docs added
          </div>
        ) : null}

        {/* Top-Right Heart Button */}
        <button
          onClick={handleHeartClick}
          className={`absolute top-2 right-2 w-6 h-6 rounded-[4px] border border-[#e5edf5] flex items-center justify-center transition-colors ${
            saved ? 'bg-[#e8e9ff] text-[#533afd] border-[#b9b9f9]' : 'bg-[#ffffff]/90 text-[#64748d]'
          } cursor-pointer`}
          title={saved ? 'Remove from saved' : 'Save property'}
        >
          <Heart
            size={12}
            className={saved ? 'fill-[#533afd] text-[#533afd]' : 'text-[#64748d]'}
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* Card Info Details */}
      <div className="p-2.5 flex flex-col justify-between flex-1">
        <div>
          {/* Price in Indian format (tabular nums) */}
          <div className="text-[15px] font-normal text-[#061b31] tracking-[-0.02em] leading-tight mb-1 tabular-nums">
            {formatIndianPrice(listing.price, listing.mode === 'rent', true)}
          </div>

          {/* One-line title */}
          <h4 className="text-xs font-normal text-[#061b31] line-clamp-1 leading-snug">
            {listing.title}
          </h4>

          {/* Locality & Size */}
          <p className="text-[11px] text-[#64748d] font-normal truncate mt-0.5 tabular-nums">
            {listing.area} • {listing.size_value} {listing.size_unit}
          </p>
        </div>

        {/* Bottom Tags & Posted Time */}
        <div className="mt-2.5 pt-2 border-t border-[#e5edf5] flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 overflow-hidden">
            <span
              className={`text-[9px] font-normal px-1.5 py-0.2 rounded-[4px] border ${
                listing.mode === 'sale'
                  ? 'bg-[#f8fafd] border-[#e5edf5] text-[#50617a]'
                  : 'bg-[#e8e9ff] border-[#d6d9fc] text-[#533afd]'
              }`}
            >
              {listing.mode === 'sale' ? 'Sale' : 'Rent'}
            </span>

            {listing.suitable_for && listing.suitable_for[0] && (
              <span className="text-[9px] font-normal bg-[#f8fafd] text-[#64748d] px-1 py-0.2 rounded-[4px] border border-[#e5edf5] truncate max-w-[65px]">
                {listing.suitable_for[0]}
              </span>
            )}
          </div>

          <span className="text-[9px] font-normal text-[#839bc8] shrink-0 tabular-nums">
            {formatTimeAgo(listing.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};
