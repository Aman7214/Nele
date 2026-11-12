import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { useApp } from '../context/AppContext';
import { PropertyCategory, AreaLocation } from '../types';
import { AREA_LIST } from '../data/mockData';

export const SearchScreen: React.FC = () => {
  const { 
    listings, 
    searchQuery, 
    setSearchQuery, 
    recentSearches, 
    addRecentSearch, 
    clearRecentSearches,
    filters,
    setFilters,
    resetFilters
  } = useApp();

  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  const categoriesList: PropertyCategory[] = ['Plot', 'House', 'Flat', 'Apartment', 'Shop', 'Room'];

  // Filter listings based on current search & filters
  const searchResults = useMemo(() => {
    return listings.filter(item => {
      if (item.status !== 'live') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.area.toLowerCase().includes(q) ||
          (item.landmark && item.landmark.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (filters.mode !== 'all' && item.mode !== filters.mode) {
        return false;
      }

      if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
        return false;
      }

      if (filters.area !== 'All areas' && item.area !== filters.area) {
        return false;
      }

      if (filters.maxPrice != null && item.price > filters.maxPrice) {
        return false;
      }

      if (filters.bedrooms != null && item.bedrooms !== filters.bedrooms) {
        return false;
      }

      if (filters.furnishing && item.furnishing !== filters.furnishing) {
        return false;
      }

      if (filters.suitableFor && filters.suitableFor.length > 0) {
        const hasMatch = item.suitable_for?.some(s => filters.suitableFor?.includes(s));
        if (!hasMatch) return false;
      }

      if (filters.docsAddedOnly && !item.docs_added && !item.verified) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_low') return a.price - b.price;
      if (filters.sortBy === 'price_high') return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [listings, searchQuery, filters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
    }
  };

  const handleCategoryToggle = (cat: PropertyCategory) => {
    setFilters({
      ...filters,
      categories: filters.categories.includes(cat)
        ? filters.categories.filter(c => c !== cat)
        : [...filters.categories, cat]
    });
  };

  const activeFilterCount = 
    (filters.mode !== 'all' ? 1 : 0) +
    filters.categories.length +
    (filters.area !== 'All areas' ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.bedrooms ? 1 : 0) +
    (filters.docsAddedOnly ? 1 : 0);

  return (
    <div className="w-full h-full flex flex-col bg-[#ffffff] overflow-y-auto no-scrollbar select-none">
      {/* Top Search Bar & Filter Button Header */}
      <div className="p-4 bg-[#ffffff] border-b border-[#e5edf5] shrink-0 space-y-2">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1 h-10 bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] flex items-center px-3 gap-2">
            <Search size={15} className="text-[#64748d]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search plot, 3 BHK, room, area..."
              className="w-full bg-transparent text-xs font-normal text-[#061b31] outline-none placeholder:text-[#839bc8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="w-4 h-4 rounded-[2px] bg-[#e5edf5] text-[#50617a] flex items-center justify-center text-[9px]"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilterModal(true)}
            className={`h-10 px-3 border rounded-[4px] flex items-center gap-1.5 text-xs font-normal transition-colors cursor-pointer ${
              activeFilterCount > 0
                ? 'bg-[#e8e9ff] text-[#533afd] border-[#b9b9f9]'
                : 'bg-[#ffffff] text-[#50617a] border-[#e5edf5] hover:bg-[#f8fafd]'
            }`}
          >
            <SlidersHorizontal size={14} />
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 bg-[#533afd] text-white rounded-full text-[10px] flex items-center justify-center font-normal">
                {activeFilterCount}
              </span>
            )}
          </button>
        </form>

        {/* Removable Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <button
              onClick={resetFilters}
              className="text-[10px] text-[#e11d48] hover:underline shrink-0 mr-1"
            >
              Clear all
            </button>

            {filters.mode !== 'all' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-normal bg-[#e8e9ff] text-[#533afd] border border-[#d6d9fc] px-2 py-0.5 rounded-[4px] shrink-0">
                Mode: {filters.mode === 'sale' ? 'Buy' : 'Rent'}
                <button onClick={() => setFilters({ ...filters, mode: 'all' })}>
                  <X size={10} />
                </button>
              </span>
            )}

            {filters.categories.map(c => (
              <span
                key={c}
                className="inline-flex items-center gap-1 text-[10px] font-normal bg-[#f8fafd] text-[#061b31] border border-[#e5edf5] px-2 py-0.5 rounded-[4px] shrink-0"
              >
                {c}
                <button onClick={() => handleCategoryToggle(c)}>
                  <X size={10} />
                </button>
              </span>
            ))}

            {filters.area !== 'All areas' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-normal bg-[#f8fafd] text-[#061b31] border border-[#e5edf5] px-2 py-0.5 rounded-[4px] shrink-0"
              >
                {filters.area}
                <button onClick={() => setFilters({ ...filters, area: 'All areas' })}>
                  <X size={10} />
                </button>
              </span>
            )}

            {filters.docsAddedOnly && (
              <span className="inline-flex items-center gap-1 text-[10px] font-normal bg-[#e8e9ff] text-[#533afd] border border-[#d6d9fc] px-2 py-0.5 rounded-[4px] shrink-0">
                Verified docs only
                <button onClick={() => setFilters({ ...filters, docsAddedOnly: false })}>
                  <X size={10} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 pb-24">
        {/* Recent Searches Section */}
        {!searchQuery.trim() && recentSearches.length > 0 && activeFilterCount === 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-normal text-[#64748d] tracking-[0.5px] uppercase">
                Recent Queries
              </span>
              <button
                onClick={clearRecentSearches}
                className="text-[10px] font-normal text-[#839bc8] hover:text-[#533afd]"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recentSearches.map(term => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    addRecentSearch(term);
                  }}
                  className="px-2.5 py-1 bg-[#f8fafd] hover:bg-[#e8e9ff] hover:text-[#533afd] hover:border-[#b9b9f9] border border-[#e5edf5] rounded-[4px] text-xs font-normal text-[#50617a] transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sort & Count Header */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-normal text-[#061b31] tabular-nums">
            Showing {searchResults.length} properties
          </span>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown size={11} className="text-[#64748d]" />
            <select
              value={filters.sortBy}
              onChange={e =>
                setFilters({ ...filters, sortBy: e.target.value as 'newest' | 'price_low' | 'price_high' })
              }
              className="bg-[#ffffff] border border-[#e5edf5] rounded-[4px] px-1.5 py-0.5 text-[11px] font-normal text-[#061b31] outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* 2-Column Results Grid */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5">
            {searchResults.map(listing => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] p-6 text-center my-6">
            <div className="w-9 h-9 bg-[#ffffff] border border-[#e5edf5] rounded-[4px] flex items-center justify-center mx-auto mb-2 text-[#64748d]">
              <Search size={16} />
            </div>
            <h4 className="text-sm font-light text-[#061b31] tracking-[-0.02em]">
              No exact match found
            </h4>
            <p className="text-xs text-[#64748d] mt-1 mb-3">
              Try adjusting query keywords or broadening search filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                resetFilters();
              }}
              className="px-3.5 py-1.5 stripe-btn-primary text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-[#061b31]/40 z-50 flex items-end justify-center p-0 animate-in fade-in duration-100">
          <div className="bg-[#ffffff] border-t border-[#e5edf5] rounded-t-[8px] p-5 w-full max-w-sm max-h-[85vh] overflow-y-auto no-scrollbar space-y-4">
            <div className="flex items-center justify-between border-b border-[#e5edf5] pb-2.5">
              <h3 className="text-sm font-light text-[#061b31] tracking-[-0.02em] flex items-center gap-1.5">
                <SlidersHorizontal size={14} className="text-[#533afd]" /> Filter Ledger
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-6 h-6 rounded-[4px] border border-[#e5edf5] flex items-center justify-center text-[#64748d]"
              >
                <X size={12} />
              </button>
            </div>

            {/* Buy vs Rent */}
            <div>
              <label className="block text-[11px] font-normal text-[#64748d] uppercase tracking-[0.5px] mb-1.5">
                Mode
              </label>
              <div className="flex gap-1.5">
                {(['all', 'sale', 'rent'] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFilters({ ...filters, mode: m })}
                    className={`flex-1 py-1.5 text-xs font-normal rounded-[4px] border transition-colors cursor-pointer ${
                      filters.mode === m
                        ? 'bg-[#e8e9ff] text-[#533afd] border-[#b9b9f9]'
                        : 'bg-[#ffffff] text-[#50617a] border-[#e5edf5]'
                    }`}
                  >
                    {m === 'all' ? 'All' : m === 'sale' ? 'Buy' : 'Rent'}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Types */}
            <div>
              <label className="block text-[11px] font-normal text-[#64748d] uppercase tracking-[0.5px] mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {categoriesList.map(cat => {
                  const isChecked = filters.categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryToggle(cat)}
                      className={`py-1.5 px-2 text-xs font-normal rounded-[4px] border text-center transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-[#e8e9ff] text-[#533afd] border-[#b9b9f9]'
                          : 'bg-[#ffffff] text-[#50617a] border-[#e5edf5]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Area Dropdown */}
            <div>
              <label className="block text-[11px] font-normal text-[#64748d] uppercase tracking-[0.5px] mb-1.5">
                Area / Taluk
              </label>
              <select
                value={filters.area}
                onChange={e => setFilters({ ...filters, area: e.target.value as AreaLocation })}
                className="w-full h-9 px-3 stripe-input text-xs"
              >
                {AREA_LIST.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Verified Docs Only Switch */}
            <div className="flex items-center justify-between bg-[#f8fafd] p-2.5 rounded-[4px] border border-[#e5edf5]">
              <div>
                <div className="text-xs font-normal text-[#061b31]">
                  Documents Uploaded Only
                </div>
                <div className="text-[10px] text-[#64748d]">
                  Show only listings with private legal records
                </div>
              </div>
              <input
                type="checkbox"
                checked={filters.docsAddedOnly}
                onChange={e => setFilters({ ...filters, docsAddedOnly: e.target.checked })}
                className="w-4 h-4 accent-[#533afd] rounded cursor-pointer"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-2 pt-2 border-t border-[#e5edf5]">
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setShowFilterModal(false);
                }}
                className="flex-1 h-9 stripe-btn-ghost text-xs"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="flex-1 h-9 stripe-btn-primary text-xs"
              >
                Apply ({searchResults.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
