import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Upload, 
  MapPin, 
  FileText, 
  Camera, 
  Trash2, 
  Sparkles, 
  Share2, 
  Eye,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  PropertyMode, 
  PropertyCategory, 
  SizeUnit, 
  FacingDirection, 
  FurnishingStatus, 
  SuitableFor, 
  AreaLocation
} from '../types';
import { formatIndianPrice } from '../utils/formatters';

export const AddPropertyWizard: React.FC = () => {
  const { 
    user, 
    addListing, 
    openListing, 
    setActiveTab, 
    showToast 
  } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [mode, setMode] = useState<PropertyMode>('sale');
  const [category, setCategory] = useState<PropertyCategory>('Plot');
  const [suitableFor, setSuitableFor] = useState<SuitableFor[]>(['Family']);

  // Details
  const [title, setTitle] = useState<string>('30x40 Corner Plot on Manvi Main Road');
  const [description, setDescription] = useState<string>('Direct owner residential plot with 30 ft asphalt road, clean title and immediate registration available.');
  const [price, setPrice] = useState<number>(1950000);
  const [deposit, setDeposit] = useState<number>(0);
  const [sizeValue, setSizeValue] = useState<number>(1200);
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>('sq ft');
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [floor, setFloor] = useState<string>('Ground floor');
  const [facing, setFacing] = useState<FacingDirection>('East');
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('Semi-furnished');
  const [roadWidth, setRoadWidth] = useState<string>('30 ft tar road');

  // Location
  const [area, setArea] = useState<AreaLocation>('Raichur');
  const [address, setAddress] = useState<string>('Station Road, Near Basaveshwara Circle');
  const [landmark, setLandmark] = useState<string>('Opposite SBI Main Branch');
  const [exactLocation, setExactLocation] = useState<boolean>(true);

  // Photos
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
  ]);

  // Documents
  const [uploadedDocs, setUploadedDocs] = useState<{ id: string; doc_type: any; title: string; uploadDate: string }[]>([
    { id: 'doc_init', doc_type: 'RTC / Pahani', title: 'Pahani Extract 2026.pdf', uploadDate: '2026-10-29' }
  ]);

  // Contact
  const [allowWhatsApp, setAllowWhatsApp] = useState<boolean>(true);
  const [publishedListingId, setPublishedListingId] = useState<string | null>(null);

  const handleNext = () => {
    if (step === 2) {
      if (!title.trim()) {
        showToast('Please enter a listing title');
        return;
      }
      if (!price || price <= 0) {
        showToast('Please enter a valid price');
        return;
      }
    }
    if (step === 4) {
      if (photos.length < 3) {
        showToast('Please add at least 3 photos (up to 10)');
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      setActiveTab('home');
    }
  };

  const handleAddSamplePhoto = () => {
    if (photos.length >= 10) {
      showToast('Maximum 10 photos reached');
      return;
    }
    const samplePool = [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80'
    ];
    const nextImg = samplePool[photos.length % samplePool.length];
    setPhotos(prev => [...prev, nextImg]);
    showToast('Photo added (GPS EXIF removed)');
  };

  const handleRemovePhoto = (index: number) => {
    if (photos.length <= 1) {
      showToast('At least 1 photo required');
      return;
    }
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddDoc = (docType: any) => {
    if (uploadedDocs.length >= 5) {
      showToast('Maximum 5 documents');
      return;
    }
    const newDoc = {
      id: `doc_${Date.now()}`,
      doc_type: docType,
      title: `${docType.replace(/\s+/g, '_')}_Scan.pdf`,
      uploadDate: new Date().toISOString().slice(0, 10)
    };
    setUploadedDocs(prev => [...prev, newDoc]);
    showToast(`${docType} attached to private storage`);
  };

  const handlePublish = () => {
    if (!user) {
      showToast('Please sign in to publish your listing');
      return;
    }

    const newId = addListing({
      owner_id: user.id,
      owner_name: user.full_name,
      owner_phone_masked: user.masked_phone,
      owner_member_since: 'Member since 2026',
      owner_avatar: user.avatar_url,
      mode,
      category,
      title,
      description,
      price,
      deposit: mode === 'rent' ? deposit : undefined,
      size_value: sizeValue,
      size_unit: sizeUnit,
      bedrooms: (category === 'House' || category === 'Flat' || category === 'Apartment') ? bedrooms : undefined,
      bathrooms: (category === 'House' || category === 'Flat' || category === 'Apartment') ? bathrooms : undefined,
      floor,
      facing,
      furnishing: mode === 'rent' ? furnishing : undefined,
      road_width: roadWidth,
      suitable_for: mode === 'rent' ? suitableFor : undefined,
      area,
      address,
      landmark,
      lat: 16.2076,
      lng: 77.3463,
      exact_location: exactLocation,
      allow_whatsapp: allowWhatsApp,
      status: 'live',
      docs_added: uploadedDocs.length > 0,
      verified: false,
      photos,
      documents: uploadedDocs
    });

    setPublishedListingId(newId);
    showToast('Property published to NELE ledger');
  };

  if (publishedListingId) {
    return (
      <div className="w-full h-full bg-[#ffffff] flex flex-col justify-between p-6 select-none">
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto space-y-3.5">
          <div className="w-12 h-12 bg-[#e8e9ff] border border-[#b9b9f9] rounded-[4px] flex items-center justify-center">
            <Check size={24} strokeWidth={2} className="text-[#533afd]" />
          </div>

          <h2 className="text-2xl font-light text-[#061b31] tracking-[-0.02em]">
            Your listing is live
          </h2>

          <p className="text-xs text-[#64748d] max-w-[280px]">
            Direct buyers in Raichur district can now view your listing and communicate with zero brokerage charges.
          </p>

          <div className="w-full bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] p-3 text-left">
            <div className="text-xs font-normal text-[#061b31]">
              {title}
            </div>
            <div className="text-sm font-normal text-[#061b31] mt-0.5 tabular-nums">
              {formatIndianPrice(price, mode === 'rent')}
            </div>
            <div className="text-[10px] text-[#64748d] mt-0.5">
              {area} • {sizeValue} {sizeUnit} • In-app Chat Active
            </div>
          </div>
        </div>

        <div className="space-y-2 pb-4">
          <button
            onClick={() => openListing(publishedListingId)}
            className="w-full h-10 stripe-btn-primary text-xs gap-1.5"
          >
            <Eye size={14} />
            <span>View listing</span>
          </button>
          <button
            onClick={() => {
              showToast('Listing link copied to clipboard');
              setActiveTab('home');
            }}
            className="w-full h-10 stripe-btn-ghost text-xs gap-1.5"
          >
            <Share2 size={14} />
            <span>Share listing</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#ffffff] overflow-y-auto no-scrollbar select-none">
      {/* Top Step Header */}
      <div className="p-4 bg-[#ffffff] border-b border-[#e5edf5] shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handleBack}
            className="w-7 h-7 rounded-[4px] border border-[#e5edf5] flex items-center justify-center bg-[#ffffff] text-[#061b31] hover:bg-[#f8fafd]"
          >
            <ArrowLeft size={14} />
          </button>
          <span className="text-xs font-normal text-[#061b31]">
            Step {step} of 6: {
              step === 1 ? 'Property Mode' :
              step === 2 ? 'Details & Pricing' :
              step === 3 ? 'Location' :
              step === 4 ? 'Photos (3 to 10)' :
              step === 5 ? 'Legal Documents' : 'Preview & Publish'
            }
          </span>
          <span className="text-[10px] text-[#839bc8]">Auto-saved</span>
        </div>

        {/* Step Progress Line */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-[2px] transition-all ${
                i <= step ? 'bg-[#533afd]' : 'bg-[#e5edf5]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Wizard Content Body */}
      <div className="p-4 space-y-4 flex-1 pb-24">
        {/* STEP 1: TYPE & CATEGORY */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-normal text-[#64748d] uppercase tracking-[0.5px] mb-1.5">
                Transaction Mode
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('sale')}
                  className={`flex-1 py-2.5 text-xs font-normal rounded-[4px] border transition-colors cursor-pointer ${
                    mode === 'sale'
                      ? 'bg-[#e8e9ff] text-[#533afd] border-[#b9b9f9]'
                      : 'bg-[#ffffff] text-[#50617a] border-[#e5edf5]'
                  }`}
                >
                  SELL
                </button>
                <button
                  type="button"
                  onClick={() => setMode('rent')}
                  className={`flex-1 py-2.5 text-xs font-normal rounded-[4px] border transition-colors cursor-pointer ${
                    mode === 'rent'
                      ? 'bg-[#e8e9ff] text-[#533afd] border-[#b9b9f9]'
                      : 'bg-[#ffffff] text-[#50617a] border-[#e5edf5]'
                  }`}
                >
                  RENT
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-normal text-[#64748d] uppercase tracking-[0.5px] mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(mode === 'sale'
                  ? ['Plot', 'House', 'Flat', 'Apartment', 'Shop']
                  : ['Room', 'Shop', 'House', 'Flat', 'Apartment']
                ).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat as PropertyCategory)}
                    className={`py-2 px-3 rounded-[4px] border text-left text-xs font-normal transition-colors cursor-pointer ${
                      category === cat
                        ? 'bg-[#061b31] text-[#ffffff] border-[#061b31]'
                        : 'bg-[#ffffff] text-[#50617a] border-[#e5edf5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {mode === 'rent' && (
              <div>
                <label className="block text-[11px] font-normal text-[#64748d] uppercase tracking-[0.5px] mb-1.5">
                  Suitable For
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Family', 'Students', 'Working people', 'Anyone'] as SuitableFor[]).map(s => {
                    const active = suitableFor.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSuitableFor(prev =>
                            prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                          );
                        }}
                        className={`py-1.5 px-2 rounded-[4px] border text-xs font-normal text-center cursor-pointer ${
                          active
                            ? 'bg-[#e8e9ff] text-[#533afd] border-[#b9b9f9]'
                            : 'bg-[#f8fafd] text-[#50617a] border-[#e5edf5]'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: DETAILS & PRICE */}
        {step === 2 && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-normal text-[#50617a] mb-1">
                Listing Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. 1200 sq ft plot near Bus Stand"
                className="w-full h-10 px-3 stripe-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-normal text-[#50617a] mb-1">
                  {mode === 'sale' ? 'Sale Price (₹)' : 'Monthly Rent (₹)'}
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full h-10 px-3 stripe-input tabular-nums"
                />
              </div>

              {mode === 'rent' ? (
                <div>
                  <label className="block text-xs font-normal text-[#50617a] mb-1">
                    Deposit (₹)
                  </label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={e => setDeposit(Number(e.target.value))}
                    className="w-full h-10 px-3 stripe-input tabular-nums"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-normal text-[#50617a] mb-1">
                    Facing
                  </label>
                  <select
                    value={facing}
                    onChange={e => setFacing(e.target.value as FacingDirection)}
                    className="w-full h-10 px-3 stripe-input text-xs"
                  >
                    <option value="East">East</option>
                    <option value="North">North</option>
                    <option value="West">West</option>
                    <option value="South">South</option>
                    <option value="North-East">North-East</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-normal text-[#50617a] mb-1">
                  Size
                </label>
                <input
                  type="number"
                  value={sizeValue}
                  onChange={e => setSizeValue(Number(e.target.value))}
                  className="w-full h-10 px-3 stripe-input tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-normal text-[#50617a] mb-1">
                  Unit
                </label>
                <select
                  value={sizeUnit}
                  onChange={e => setSizeUnit(e.target.value as SizeUnit)}
                  className="w-full h-10 px-3 stripe-input text-xs"
                >
                  <option value="sq ft">sq ft</option>
                  <option value="sq yd">sq yd</option>
                  <option value="guntas">guntas</option>
                  <option value="cents">cents</option>
                  <option value="acres">acres</option>
                </select>
              </div>
            </div>

            {category === 'Plot' && (
              <div>
                <label className="block text-xs font-normal text-[#50617a] mb-1">
                  Road Width
                </label>
                <input
                  type="text"
                  value={roadWidth}
                  onChange={e => setRoadWidth(e.target.value)}
                  placeholder="e.g. 30 ft asphalt road"
                  className="w-full h-10 px-3 stripe-input"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-normal text-[#50617a] mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Details on water source, electricity, boundaries..."
                className="w-full p-2.5 stripe-input text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION */}
        {step === 3 && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-normal text-[#50617a] mb-1">
                Taluk / Area
              </label>
              <select
                value={area}
                onChange={e => setArea(e.target.value as AreaLocation)}
                className="w-full h-10 px-3 stripe-input text-xs"
              >
                <option value="Raichur">Raichur City</option>
                <option value="Manvi">Manvi</option>
                <option value="Sindhanur">Sindhanur</option>
                <option value="Lingasugur">Lingasugur</option>
                <option value="Mudgal">Mudgal</option>
                <option value="Other">Other Village</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-normal text-[#50617a] mb-1">
                Locality / Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="e.g. NGO Colony, Station Road"
                className="w-full h-10 px-3 stripe-input"
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-[#50617a] mb-1">
                Landmark
              </label>
              <input
                type="text"
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
                placeholder="e.g. Opposite APMC Gate 2"
                className="w-full h-10 px-3 stripe-input"
              />
            </div>

            {/* Draggable Pin Map Simulation */}
            <div className="bg-[#f8fafd] p-3 rounded-[4px] border border-[#e5edf5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-normal text-[#061b31]">Map Pin Location</span>
                <button
                  type="button"
                  onClick={() => showToast('Coordinates calibrated to your GPS')}
                  className="text-[10px] text-[#533afd] hover:underline cursor-pointer"
                >
                  Use my GPS
                </button>
              </div>

              <div className="w-full h-28 bg-[#ffffff] border border-[#e5edf5] rounded-[4px] relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5edf5_1px,transparent_1px),linear-gradient(to_bottom,#e5edf5_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                <div className="flex flex-col items-center z-10">
                  <div className="w-7 h-7 rounded-[4px] bg-[#533afd] flex items-center justify-center text-white">
                    <MapPin size={15} />
                  </div>
                  <span className="text-[10px] text-[#50617a] mt-0.5">
                    Drag pin
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#e5edf5]">
                <div>
                  <span className="text-xs font-normal text-[#061b31]">Exact coordinates on map</span>
                  <p className="text-[10px] text-[#64748d]">Optional approximate radius for rentals</p>
                </div>
                <input
                  type="checkbox"
                  checked={exactLocation}
                  onChange={e => setExactLocation(e.target.checked)}
                  className="w-4 h-4 accent-[#533afd] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PHOTOS */}
        {step === 4 && (
          <div className="space-y-3">
            <div className="bg-[#f8fafd] p-3 rounded-[4px] border border-[#e5edf5]">
              <div className="text-xs font-normal text-[#061b31] flex items-center gap-1.5">
                <Camera size={13} className="text-[#533afd]" /> Upload 3 to 10 property photos
              </div>
              <p className="text-[11px] text-[#64748d] mt-0.5">
                First photo acts as thumbnail. EXIF GPS coordinates are automatically stripped.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {photos.map((url, idx) => (
                <div
                  key={idx}
                  className="aspect-[4/3] bg-neutral-100 border border-[#e5edf5] rounded-[4px] overflow-hidden relative group"
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-[#533afd] text-white text-[9px] font-normal px-1 rounded-[2px]">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 w-5 h-5 bg-white/90 border border-[#e5edf5] rounded-[2px] flex items-center justify-center text-[#e11d48]"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}

              {photos.length < 10 && (
                <button
                  type="button"
                  onClick={handleAddSamplePhoto}
                  className="aspect-[4/3] bg-[#ffffff] border border-dashed border-[#b9b9f9] rounded-[4px] flex flex-col items-center justify-center text-[#533afd] cursor-pointer hover:bg-[#f8fafd]"
                >
                  <Upload size={16} />
                  <span className="text-[10px] font-normal mt-1">Add Photo</span>
                </button>
              )}
            </div>

            <div className="text-xs text-[#64748d] text-center tabular-nums">
              {photos.length} of 10 photos ({photos.length >= 3 ? '✓ Requirement met' : 'Need at least 3'})
            </div>
          </div>
        )}

        {/* STEP 5: DOCUMENTS */}
        {step === 5 && (
          <div className="space-y-3">
            <div className="bg-[#ffffff] p-3.5 rounded-[4px] border border-[#e5edf5]">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={16} className="text-[#533afd]" />
                <h3 className="text-xs font-normal text-[#061b31]">
                  Private legal documents (optional)
                </h3>
              </div>
              <p className="text-xs text-[#64748d] leading-snug mb-3">
                Upload RTC / Pahani, Khata extract, or Sale deed to qualify for the <span className="text-[#533afd]">Docs added</span> badge.
              </p>

              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {['RTC / Pahani', 'Khata', 'Sale Deed', 'Encumbrance Cert', 'Tax Receipt'].map(docType => (
                  <button
                    key={docType}
                    type="button"
                    onClick={() => handleAddDoc(docType)}
                    className="py-1.5 px-2 bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] text-xs font-normal text-left text-[#061b31] hover:bg-[#e8e9ff] transition-colors"
                  >
                    + {docType}
                  </button>
                ))}
              </div>

              {uploadedDocs.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-[#e5edf5]">
                  <span className="text-[11px] font-normal text-[#061b31]">Attached ({uploadedDocs.length})</span>
                  {uploadedDocs.map(d => (
                    <div key={d.id} className="flex items-center justify-between p-2 bg-[#f8fafd] border border-[#e5edf5] rounded-[4px] text-xs">
                      <span className="truncate max-w-[190px] text-[#50617a]">{d.title}</span>
                      <span className="text-[9px] bg-[#e8e9ff] text-[#533afd] px-1.5 py-0.2 rounded-[2px]">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#839bc8] text-center">
              Stored in private encrypted bucket with 60-second expiring URLs.
            </p>
          </div>
        )}

        {/* STEP 6: PREVIEW & CONTACT */}
        {step === 6 && (
          <div className="space-y-3">
            <h3 className="text-[11px] font-normal text-[#64748d] tracking-[0.5px] uppercase">
              Listing Ledger Preview
            </h3>

            {/* Live Card Preview */}
            <div className="bg-[#ffffff] border border-[#e5edf5] rounded-[4px] overflow-hidden">
              <div className="aspect-[4/3] bg-neutral-100 relative border-b border-[#e5edf5]">
                <img src={photos[0]} alt="" className="w-full h-full object-cover" />
                {uploadedDocs.length > 0 && (
                  <div className="absolute top-2 left-2 bg-[#e8e9ff] text-[#533afd] border border-[#d6d9fc] text-[9px] px-1.5 py-0.2 rounded-[4px]">
                    Docs added
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="text-base font-light text-[#061b31] tracking-[-0.02em] tabular-nums">
                  {formatIndianPrice(price, mode === 'rent')}
                </div>
                <div className="text-xs font-normal text-[#061b31] line-clamp-1">{title}</div>
                <div className="text-[11px] text-[#64748d] tabular-nums">{area} • {sizeValue} {sizeUnit}</div>
              </div>
            </div>

            {/* Contact Settings */}
            <div className="bg-[#f8fafd] p-3 rounded-[4px] border border-[#e5edf5] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-normal text-[#061b31]">Allow WhatsApp inquiries</div>
                  <div className="text-[10px] text-[#64748d]">Relays to your verified phone number</div>
                </div>
                <input
                  type="checkbox"
                  checked={allowWhatsApp}
                  onChange={e => setAllowWhatsApp(e.target.checked)}
                  className="w-4 h-4 accent-[#533afd] rounded cursor-pointer"
                />
              </div>
              <div className="text-[11px] text-[#50617a] border-t border-[#e5edf5] pt-2 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[#533afd]" />
                <span>In-app messaging active with spam protection</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Wizard Controls */}
      <div className="h-14 bg-[#ffffff] border-t border-[#e5edf5] px-4 flex items-center gap-2 sticky bottom-0 z-30">
        {step < 6 ? (
          <>
            {step === 5 && (
              <button
                type="button"
                onClick={() => setStep(6)}
                className="flex-1 h-9 stripe-btn-ghost text-xs"
              >
                Skip Documents
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 h-9 stripe-btn-primary text-xs gap-1.5"
            >
              <span>Next</span>
              <ArrowRight size={14} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handlePublish}
            className="w-full h-10 stripe-btn-primary text-xs gap-1.5"
          >
            <Sparkles size={14} />
            <span>Publish Property (Free)</span>
          </button>
        )}
      </div>
    </div>
  );
};
