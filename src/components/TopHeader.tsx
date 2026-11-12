import React, { useState } from 'react';
import { Bell, MapPin, ChevronDown, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AreaLocation } from '../types';
import { AREA_LIST } from '../data/mockData';

import { NeleLogo } from './NeleLogo';

export const TopHeader: React.FC = () => {
  const { selectedArea, setSelectedArea, showToast, setCurrentView } = useApp();
  const [showAreaPicker, setShowAreaPicker] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const notifications = [
    { id: 1, title: 'New Plot listed in Manvi Road', time: '10m ago', unread: true },
    { id: 2, title: 'Deepak offered ₹17,50,000 on your plot', time: '45m ago', unread: true },
    { id: 3, title: 'Basavaraj replied to your inquiry', time: '2h ago', unread: false }
  ];

  return (
    <>
      <header className="h-13 bg-[#ffffff] border-b border-[#e5edf5] flex items-center justify-between px-3 z-30 shrink-0">
        {/* Left: Brand Logo with Background Removed & Proper Sizing */}
        <button
          type="button"
          onClick={() => setCurrentView('splash')}
          title="Click to replay opening animation"
          className="flex items-center cursor-pointer hover:opacity-85 transition-opacity"
        >
          <NeleLogo variant="header" />
        </button>

        {/* Right: Area Chip & Bell */}
        <div className="flex items-center gap-1.5">
          {/* Area Selector Chip */}
          <button
            onClick={() => setShowAreaPicker(true)}
            className="flex items-center gap-1.5 bg-[#f8fafd] hover:bg-[#e5edf5]/50 px-2.5 py-1 rounded-[4px] border border-[#e5edf5] text-xs font-normal text-[#061b31] cursor-pointer transition-colors"
          >
            <MapPin size={11} className="text-[#533afd]" />
            <span className="max-w-[85px] truncate">{selectedArea}</span>
            <ChevronDown size={11} className="text-[#64748d]" />
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setShowNotifications(true)}
            className="w-7 h-7 bg-[#f8fafd] hover:bg-[#e5edf5]/50 rounded-[4px] border border-[#e5edf5] flex items-center justify-center relative cursor-pointer transition-colors"
            title="Notifications"
          >
            <Bell size={13} className="text-[#061b31]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#533afd] absolute top-1.5 right-1.5"></span>
          </button>
        </div>
      </header>

      {/* Area Picker Modal */}
      {showAreaPicker && (
        <div className="fixed inset-0 bg-[#061b31]/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-100">
          <div className="bg-[#ffffff] border border-[#e5edf5] rounded-t-[8px] sm:rounded-[4px] p-4 w-full max-w-sm">
            <div className="flex items-center justify-between mb-3 border-b border-[#e5edf5] pb-2">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#533afd]" />
                <h3 className="text-sm font-light text-[#061b31] tracking-[-0.02em]">
                  Select Area
                </h3>
              </div>
              <button
                onClick={() => setShowAreaPicker(false)}
                className="w-6 h-6 rounded-[4px] border border-[#e5edf5] flex items-center justify-center text-[#64748d] hover:text-[#061b31]"
              >
                <X size={12} />
              </button>
            </div>
            <p className="text-xs text-[#64748d] mb-3">
              Filter listings across Raichur district:
            </p>

            <div className="space-y-1 max-h-60 overflow-y-auto no-scrollbar mb-3">
              {AREA_LIST.map(areaItem => {
                const isSelected = selectedArea === areaItem.id;
                return (
                  <button
                    key={areaItem.id}
                    onClick={() => {
                      setSelectedArea(areaItem.id as AreaLocation);
                      setShowAreaPicker(false);
                      showToast(`Area switched to ${areaItem.name}`);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-[4px] border text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#e8e9ff] border-[#b9b9f9] text-[#533afd] font-medium'
                        : 'bg-[#ffffff] border-[#e5edf5] text-[#061b31] hover:bg-[#f8fafd]'
                    }`}
                  >
                    <span>{areaItem.name}</span>
                    {isSelected && <Check size={14} className="text-[#533afd]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 bg-[#061b31]/40 z-50 flex items-start justify-center p-4 pt-12 animate-in fade-in duration-100">
          <div className="bg-[#ffffff] border border-[#e5edf5] rounded-[4px] p-4 w-full max-w-sm">
            <div className="flex items-center justify-between mb-3 border-b border-[#e5edf5] pb-2">
              <h3 className="text-xs font-normal text-[#061b31] flex items-center gap-1.5">
                <Bell size={13} className="text-[#533afd]" /> Activity Notifications
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="w-5 h-5 rounded-[4px] border border-[#e5edf5] flex items-center justify-center text-[#64748d]"
              >
                <X size={11} />
              </button>
            </div>

            <div className="space-y-1.5 mb-2">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`p-2.5 rounded-[4px] border text-xs ${
                    n.unread
                      ? 'bg-[#e8e9ff]/50 border-[#d6d9fc] text-[#061b31]'
                      : 'bg-[#f8fafd] border-[#e5edf5] text-[#50617a]'
                  }`}
                >
                  <div className="font-normal text-[#061b31]">{n.title}</div>
                  <div className="text-[10px] text-[#64748d] mt-0.5 tabular-nums">
                    {n.time}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowNotifications(false);
                showToast('All notifications marked as read');
              }}
              className="w-full py-1.5 bg-[#f8fafd] hover:bg-[#e5edf5] border border-[#e5edf5] rounded-[4px] text-xs font-normal text-[#50617a]"
            >
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </>
  );
};
