import React from 'react';
import { MessageSquare, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatIndianPrice } from '../utils/formatters';

export const ChatsScreen: React.FC = () => {
  const { conversations, openConversation, user, setCurrentView } = useApp();

  if (!user) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-11 h-11 bg-[#e8e9ff] border border-[#d6d9fc] rounded-[4px] flex items-center justify-center mb-3 text-[#533afd]">
          <MessageSquare size={20} />
        </div>
        <h3 className="text-base font-light text-[#061b31] tracking-[-0.02em]">
          Direct Owner Messages
        </h3>
        <p className="text-xs text-[#64748d] max-w-[240px] mt-1 mb-4">
          Sign in to access your direct conversations and manage negotiations.
        </p>
        <button
          onClick={() => setCurrentView('auth')}
          className="stripe-btn-primary px-4 py-2 text-xs"
        >
          Sign in to account
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#ffffff] overflow-y-auto no-scrollbar select-none">
      {/* Header */}
      <div className="h-13 bg-[#ffffff] border-b border-[#e5edf5] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-[#533afd]" />
          <h1 className="text-sm font-normal text-[#061b31]">
            Direct Messages
          </h1>
        </div>
        <span className="text-[11px] font-normal bg-[#e8e9ff] text-[#533afd] border border-[#d6d9fc] px-2 py-0.5 rounded-[4px] tabular-nums">
          {conversations.length} Active Threads
        </span>
      </div>

      {/* Safety Notice */}
      <div className="px-4 pt-3">
        <div className="bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] p-2.5 flex items-center gap-2 text-xs text-[#50617a]">
          <ShieldCheck size={14} className="text-[#533afd] shrink-0" />
          <span className="text-[11px] leading-tight">
            Security notice: Inspect original revenue titles prior to any advance payments.
          </span>
        </div>
      </div>

      {/* Conversation Thread List */}
      <div className="p-4 space-y-2 pb-24">
        {conversations.length > 0 ? (
          conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => openConversation(conv.id)}
              className="bg-[#ffffff] hover:bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] p-3 flex items-center gap-3 cursor-pointer transition-colors"
            >
              {/* Listing Thumbnail */}
              <div className="w-12 h-12 rounded-[4px] border border-[#e5edf5] bg-[#f8fafd] overflow-hidden shrink-0">
                <img
                  src={conv.listing_thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-xs font-normal text-[#061b31] truncate">
                    {conv.other_user_name}
                  </h4>
                  <span className="text-[10px] text-[#839bc8] tabular-nums shrink-0">
                    {conv.last_message_at}
                  </span>
                </div>

                <div className="text-[11px] text-[#64748d] truncate mb-0.5 tabular-nums">
                  {conv.listing_title} ({formatIndianPrice(conv.listing_price, conv.listing_mode === 'rent', true)})
                </div>

                <p className="text-xs text-[#061b31] truncate">
                  {conv.last_message}
                </p>
              </div>

              {/* Unread Pill */}
              {conv.unread_count > 0 && (
                <div className="w-4 h-4 rounded-full bg-[#533afd] text-white flex items-center justify-center text-[9px] font-normal shrink-0 tabular-nums">
                  {conv.unread_count}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] p-8 text-center my-6">
            <MessageSquare size={20} className="mx-auto mb-2 text-[#839bc8]" />
            <h4 className="text-xs font-normal text-[#061b31]">No conversations yet</h4>
            <p className="text-xs text-[#64748d] mt-1">
              Select "Chat with owner" on any listing to initiate negotiations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
