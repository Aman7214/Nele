import React from 'react';
import { Home, Search, Plus, MessageSquare, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNavbar: React.FC = () => {
  const { currentView, activeTab, setActiveTab, totalUnreadCount } = useApp();

  const hiddenViews = [
    'splash',
    'onboarding',
    'auth',
    'add',
    'detail',
    'conversation',
    'settings',
    'privacy_security',
    'terms',
    'privacy_policy'
  ];

  if (hiddenViews.includes(currentView)) {
    return null;
  }

  const items = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'search' as const, label: 'Search', icon: Search },
    { id: 'add' as const, label: 'Add', icon: Plus, isAdd: true },
    { id: 'chats' as const, label: 'Chats', icon: MessageSquare, badge: totalUnreadCount },
    { id: 'profile' as const, label: 'Profile', icon: User }
  ];

  return (
    <div className="h-[64px] w-full bg-[#ffffff] border-t border-[#e5edf5] flex items-center justify-around px-2 z-40 shrink-0 relative select-none">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        if (item.isAdd) {
          // Center action: 4px radius Indigo button with white plus, no shadow
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab('add')}
              className="w-10 h-10 bg-[#533afd] hover:bg-[#7389ff] text-[#ffffff] rounded-[4px] flex items-center justify-center transition-colors cursor-pointer"
              title="Post property"
            >
              <Plus size={20} strokeWidth={2} />
            </button>
          );
        }

        // Active state: Periwinkle wash with Indigo text/icon
        if (isActive) {
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="bg-[#e8e9ff] text-[#533afd] flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#d6d9fc] transition-colors cursor-pointer"
            >
              <Icon size={15} strokeWidth={2} />
              <span className="text-xs font-normal tracking-[-0.01em]">
                {item.label}
              </span>
            </button>
          );
        }

        // Inactive state: Slate #64748d
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 text-[#64748d] hover:text-[#061b31] transition-colors relative cursor-pointer"
          >
            <div className="relative">
              <Icon size={18} strokeWidth={1.5} />
              {item.badge != null && item.badge > 0 ? (
                <span className="absolute -top-1 -right-2 bg-[#533afd] text-[#ffffff] text-[9px] font-normal w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[11px] font-normal tracking-[-0.01em]">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
