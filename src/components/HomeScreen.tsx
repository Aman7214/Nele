import React, { useState, useMemo } from 'react';
import { Search, RotateCw, Sparkles, ArrowRight } from 'lucide-react';
import { TopHeader } from './TopHeader';
import { PropertyCard } from './PropertyCard';
import { useApp } from '../context/AppContext';
import { PropertyMode, PropertyCategory } from '../types';

export const HomeScreen: React.FC = () => {
  const { 
    listings, 
    selectedArea, 
    setActiveTab, 
    showToast 
  } = useApp();

  const [activeMode, setActiveMode] = useState<PropertyMode | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory | 'All'>('All');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(8);

  const categories: { label: string; value: PropertyCategory | 'All' }[] = [
    { label: 'All', value: 'All' },
    { label: 'Plots', value: 'Plot' },
    { label: 'Houses', value: 'House' },
    { label: 'Flats', value: 'Flat' },
    { label: 'Apartments', value: 'Apartment' },
    { label: 'Shops', value: 'Shop' },
    { label: 'Rooms', value: 'Room' }
  ];

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      // Area match
      if (selectedArea !== 'All areas' && item.area !== selectedArea) {
        return false;
      }
      // Mode match
      if (activeMode !== 'all' && item.mode !== activeMode) {
        return false;
      }
      // Category match
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      return item.status === 'live';
    });
  }, [listings, selectedArea, activeMode, selectedCategory]);

  const displayedListings = filteredListings.slice(0, visibleCount);

  const handlePullToRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Ledger updated with latest listings');
    }, 600);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 6);
      setIsLoadingMore(false);
    }, 450);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#ffffff] overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <TopHeader />

      {/* Main Body */}
      <div className="p-4 space-y-3.5 pb-24">
        {/* Search Bar — Tapping opens Search View */}
        <div
          onClick={() => setActiveTab('search')}
          className="w-full h-10 bg-[#f8fafd] hover:bg-[#e5edf5]/40 border border-[#e5edf5] rounded-[4px] flex items-center px-3 gap-2.5 cursor-pointer transition-colors"
        >
          <Search size={15} className="text-[#64748d]" />
          <span className="text-xs font-normal text-[#839bc8] tracking-[-0.01em]">
            Search plots, houses, rooms in Raichur...
          </span>
        </div>

        {/* Buy | Rent Segmented Switch — Stripe subtle surface shift */}
        <div className="flex bg-[#f8fafd] p-0.5 rounded-[4px] border border-[#e5edf5]">
          <button
            onClick={() => setActiveMode('all')}
            className={`flex-1 py-1.5 text-xs font-normal rounded-[3px] transition-colors cursor-pointer ${
              activeMode === 'all'
                ? 'bg-[#ffffff] text-[#061b31] border border-[#e5edf5]'
                : 'text-[#64748d] hover:text-[#061b31]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveMode('sale')}
            className={`flex-1 py-1.5 text-xs font-normal rounded-[3px] transition-colors cursor-pointer ${
              activeMode === 'sale'
                ? 'bg-[#ffffff] text-[#061b31] border border-[#e5edf5]'
                : 'text-[#64748d] hover:text-[#061b31]'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveMode('rent')}
            className={`flex-1 py-1.5 text-xs font-normal rounded-[3px] transition-colors cursor-pointer ${
              activeMode === 'rent'
                ? 'bg-[#ffffff] text-[#061b31] border border-[#e5edf5]'
                : 'text-[#64748d] hover:text-[#061b31]'
            }`}
          >
            Rent
          </button>
        </div>

        {/* Category Chips Horizontal Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1 rounded-[4px] border text-xs font-normal shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#e8e9ff] text-[#533afd] border-[#b9b9f9]'
                    : 'bg-[#ffffff] text-[#50617a] border-[#e5edf5] hover:bg-[#f8fafd]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Market Status Row with Pull-to-refresh */}
        <div className="flex items-center justify-between pt-1 border-t border-[#e5edf5]">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-normal text-[#061b31]">
              {selectedArea}
            </span>
            <span className="text-[11px] font-normal text-[#64748d] tabular-nums">
              ({filteredListings.length} properties)
            </span>
          </div>

          <button
            onClick={handlePullToRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 text-[11px] font-normal text-[#50617a] bg-[#f8fafd] hover:bg-[#e5edf5] px-2 py-0.8 rounded-[4px] border border-[#e5edf5] cursor-pointer"
          >
            <RotateCw size={11} className={isRefreshing ? 'animate-spin text-[#533afd]' : ''} />
            <span>Sync</span>
          </button>
        </div>

        {/* 2-Column Property Grid — Flat, hairline borders */}
        {displayedListings.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 pt-0.5">
            {displayedListings.map(listing => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] p-6 text-center my-6">
            <div className="w-9 h-9 bg-[#ffffff] border border-[#e5edf5] rounded-[4px] flex items-center justify-center mx-auto mb-2 text-[#533afd]">
              <Sparkles size={16} />
            </div>
            <h3 className="text-sm font-light text-[#061b31] tracking-[-0.02em]">
              No matching listings
            </h3>
            <p className="text-xs text-[#64748d] mt-1 mb-3">
              Try switching your area or expanding category filters.
            </p>
            <button
              onClick={() => {
                setActiveMode('all');
                setSelectedCategory('All');
              }}
              className="px-3 py-1.5 stripe-btn-primary text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Infinite Scroll / Load More */}
        {visibleCount < filteredListings.length && (
          <div className="pt-1 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="w-full py-2 stripe-btn-ghost text-xs gap-1.5"
            >
              {isLoadingMore ? (
                <>
                  <div className="w-3 h-3 border-1.5 border-[#533afd] border-t-transparent rounded-full animate-spin"></div>
                  <span>Syncing more listings...</span>
                </>
              ) : (
                <span>Load {filteredListings.length - visibleCount} more listings</span>
              )}
            </button>
          </div>
        )}

        {/* Stripe Quiet Guarantee Card */}
        <div className="bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-[#e8e9ff] border border-[#d6d9fc] flex items-center justify-center text-[#533afd] text-xs font-normal">
              ₹0
            </div>
            <div>
              <div className="text-xs font-normal text-[#061b31]">
                Zero Commission Architecture
              </div>
              <div className="text-[11px] text-[#64748d]">
                100% direct contact with owners across Raichur.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
