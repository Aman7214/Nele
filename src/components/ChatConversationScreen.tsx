import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Image as ImageIcon, 
  Tag, 
  MoreVertical, 
  ShieldAlert, 
  CheckCheck, 
  ExternalLink,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatIndianPrice } from '../utils/formatters';

export const ChatConversationScreen: React.FC = () => {
  const { 
    selectedConversation, 
    goBack, 
    openListing, 
    sendMessage, 
    respondToOffer, 
    showToast 
  } = useApp();

  const [messageInput, setMessageInput] = useState<string>('');
  const [showOfferModal, setShowOfferModal] = useState<boolean>(false);
  const [offerInputPrice, setOfferInputPrice] = useState<number>(
    selectedConversation ? Math.round(selectedConversation.listing_price * 0.95) : 1000000
  );
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  if (!selectedConversation) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-light text-[#061b31] mb-3">Conversation not found</p>
        <button onClick={goBack} className="stripe-btn-primary px-3.5 py-1.5 text-xs">
          Return to Messages
        </button>
      </div>
    );
  }

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;
    sendMessage(selectedConversation.id, messageInput.trim(), 'text');
    setMessageInput('');
  };

  const handleSendQuickReply = (text: string) => {
    sendMessage(selectedConversation.id, text, 'text');
  };

  const handleSubmitOffer = () => {
    if (!offerInputPrice || offerInputPrice <= 0) return;
    sendMessage(
      selectedConversation.id,
      `I am submitting an offer of ${formatIndianPrice(offerInputPrice, selectedConversation.listing_mode === 'rent')}. Prepared for swift registration.`,
      'offer',
      offerInputPrice
    );
    setShowOfferModal(false);
    showToast('Offer submitted to seller');
  };

  const handleSendSamplePhoto = () => {
    sendMessage(
      selectedConversation.id,
      'Sharing copy of document receipt for verification',
      'image',
      undefined,
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80'
    );
    showToast('Document scan shared');
  };

  const quickReplies = [
    'Is this property still available?',
    'What is your final price?',
    'Can I inspect the site today?',
    'Share exact location map'
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#ffffff] relative select-none">
      {/* Top Bar with Pinned Listing Mini Card */}
      <div className="bg-[#ffffff] border-b border-[#e5edf5] shrink-0 z-20">
        <div className="h-12 flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <button
              onClick={goBack}
              className="w-7 h-7 rounded-[4px] border border-[#e5edf5] bg-[#ffffff] flex items-center justify-center text-[#061b31] hover:bg-[#f8fafd] cursor-pointer"
            >
              <ArrowLeft size={14} />
            </button>
            <div>
              <h2 className="text-xs font-normal text-[#061b31]">
                {selectedConversation.other_user_name}
              </h2>
              <span className="text-[10px] text-[#64748d] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#533afd]"></span>
                Verified Deed Holder
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-7 h-7 rounded-[4px] border border-[#e5edf5] bg-[#ffffff] flex items-center justify-center text-[#64748d]"
            >
              <MoreVertical size={13} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-9 w-40 bg-[#ffffff] border border-[#e5edf5] rounded-[4px] py-1 z-30">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    showToast('Report submitted for review');
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs font-normal text-[#061b31] hover:bg-[#f8fafd]"
                >
                  Report User
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    showToast('User blocked');
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs font-normal text-[#e11d48] hover:bg-[#fff1f2]"
                >
                  Block User
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pinned Listing Mini Card */}
        <div
          onClick={() => openListing(selectedConversation.listing_id)}
          className="mx-3 mb-2 bg-[#f8fafd] hover:bg-[#e5edf5]/40 border border-[#e5edf5] rounded-[4px] p-2 flex items-center justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-[3px] border border-[#e5edf5] overflow-hidden bg-white shrink-0">
              <img
                src={selectedConversation.listing_thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-normal text-[#061b31] truncate">
                {selectedConversation.listing_title}
              </div>
              <div className="text-[11px] font-normal text-[#061b31] tabular-nums">
                {formatIndianPrice(selectedConversation.listing_price, selectedConversation.listing_mode === 'rent')}
              </div>
            </div>
          </div>
          <ExternalLink size={12} className="text-[#64748d] shrink-0 mr-1" />
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-[#ffffff]">
        {/* Safety Warning Card */}
        <div className="bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] p-3 flex items-start gap-2.5">
          <ShieldAlert size={15} className="text-[#533afd] shrink-0 mt-0.5" />
          <div className="text-xs font-normal text-[#50617a] leading-snug">
            Do not remit any token advance before verifying physical property boundaries and government Pahani records in person.
          </div>
        </div>

        {/* Date Separator */}
        <div className="flex items-center justify-center my-2">
          <span className="text-[10px] font-normal tracking-[0.5px] uppercase text-[#839bc8] bg-[#f8fafd] border border-[#e5edf5] px-2 py-0.5 rounded-[4px]">
            Today
          </span>
        </div>

        {/* Chat Bubbles */}
        {selectedConversation.messages.map(msg => {
          const isMe = msg.sender_id === 'me';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-[4px] p-3 text-xs font-normal ${
                  isMe
                    ? 'bg-[#533afd] text-[#ffffff]'
                    : 'bg-[#f8fafd] text-[#061b31] border border-[#e5edf5]'
                }`}
              >
                {/* Photo attachment if image */}
                {msg.image_url && (
                  <div className="mb-2 rounded-[2px] border border-white/20 overflow-hidden">
                    <img src={msg.image_url} alt="" className="w-full h-auto object-cover" />
                  </div>
                )}

                {/* Offer Card Bubble if offer */}
                {msg.type === 'offer' && msg.offer_amount ? (
                  <div className="bg-[#ffffff] text-[#061b31] p-2.5 rounded-[4px] border border-[#e5edf5] my-1">
                    <div className="flex items-center gap-1 text-[10px] font-normal text-[#64748d] uppercase tracking-[0.3px]">
                      <Tag size={11} className="text-[#533afd]" /> Formal Price Offer
                    </div>
                    <div className="text-base font-light tracking-[-0.02em] mt-0.5 tabular-nums">
                      {formatIndianPrice(msg.offer_amount, selectedConversation.listing_mode === 'rent')}
                    </div>

                    {!isMe && msg.offer_status === 'pending' && (
                      <div className="flex gap-1.5 mt-2 pt-2 border-t border-[#e5edf5]">
                        <button
                          onClick={() => respondToOffer(selectedConversation.id, msg.id, true)}
                          className="flex-1 py-1 bg-[#533afd] text-white font-normal text-[11px] rounded-[3px] hover:bg-[#7389ff]"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => respondToOffer(selectedConversation.id, msg.id, false)}
                          className="flex-1 py-1 bg-[#f8fafd] text-[#061b31] border border-[#e5edf5] font-normal text-[11px] rounded-[3px] hover:bg-[#e5edf5]"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {msg.offer_status === 'accepted' && (
                      <div className="mt-1 text-[10px] text-[#047857] bg-[#ecfdf5] border border-[#a7f3d0] px-1.5 py-0.5 rounded-[3px]">
                        ✓ Offer Accepted
                      </div>
                    )}
                    {msg.offer_status === 'declined' && (
                      <div className="mt-1 text-[10px] text-[#e11d48] bg-[#fff1f2] border border-[#fecdd3] px-1.5 py-0.5 rounded-[3px]">
                        ✕ Offer Declined
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="leading-relaxed">{msg.body}</p>
                )}

                {/* Timestamp & read tick */}
                <div
                  className={`flex items-center justify-end gap-1 text-[9px] mt-1 tabular-nums ${
                    isMe ? 'text-[#e8e9ff]' : 'text-[#839bc8]'
                  }`}
                >
                  <span>{msg.created_at}</span>
                  {isMe && <CheckCheck size={11} className="text-white" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Chips Carousel */}
      <div className="bg-[#ffffff] border-t border-[#e5edf5] px-3 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {quickReplies.map((qr, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuickReply(qr)}
            className="px-2.5 py-1 bg-[#f8fafd] hover:bg-[#e8e9ff] hover:text-[#533afd] hover:border-[#b9b9f9] border border-[#e5edf5] rounded-[4px] text-[10px] text-[#50617a] shrink-0 transition-colors cursor-pointer"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Bottom Message Input Bar */}
      <div className="p-3 bg-[#ffffff] border-t border-[#e5edf5] shrink-0">
        <form onSubmit={handleSendText} className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowOfferModal(true)}
            className="h-9 px-2.5 stripe-btn-ghost text-xs gap-1 font-normal shrink-0"
            title="Make an offer"
          >
            <Tag size={12} />
            <span>Offer</span>
          </button>

          <button
            type="button"
            onClick={handleSendSamplePhoto}
            className="w-9 h-9 stripe-btn-ghost flex items-center justify-center shrink-0"
            title="Attach document scan"
          >
            <ImageIcon size={14} />
          </button>

          <input
            type="text"
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 h-9 px-3 stripe-input text-xs font-normal"
          />

          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="w-9 h-9 stripe-btn-primary flex items-center justify-center shrink-0 disabled:opacity-40"
          >
            <Send size={14} />
          </button>
        </form>
      </div>

      {/* Make an Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-[#061b31]/40 z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border border-[#e5edf5] rounded-[4px] p-4 w-full max-w-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#e5edf5] pb-2">
              <h3 className="text-sm font-light text-[#061b31] tracking-[-0.02em] flex items-center gap-1.5">
                <Tag size={14} className="text-[#533afd]" /> Submit Formal Offer
              </h3>
              <button
                onClick={() => setShowOfferModal(false)}
                className="w-5 h-5 rounded-[2px] border border-[#e5edf5] flex items-center justify-center text-[#64748d]"
              >
                <X size={11} />
              </button>
            </div>

            <div className="bg-[#f8fafd] p-2.5 rounded-[4px] border border-[#e5edf5] text-xs text-[#50617a]">
              Listed Price: <span className="font-normal text-[#061b31] tabular-nums">{formatIndianPrice(selectedConversation.listing_price, selectedConversation.listing_mode === 'rent')}</span>
            </div>

            <div>
              <label className="block text-xs font-normal text-[#50617a] mb-1">
                Your Offer Price (₹)
              </label>
              <input
                type="number"
                value={offerInputPrice}
                onChange={e => setOfferInputPrice(Number(e.target.value))}
                className="w-full h-10 px-3 stripe-input text-sm font-normal tabular-nums"
              />
            </div>

            <div className="flex gap-2 pt-1 border-t border-[#e5edf5]">
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="flex-1 h-9 stripe-btn-ghost text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitOffer}
                className="flex-1 h-9 stripe-btn-primary text-xs"
              >
                Transmit Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
