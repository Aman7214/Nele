import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Maximize2, Minimize2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const { 
    isAndroidFrame, 
    setIsAndroidFrame, 
    toastMessage, 
    currentView, 
    setCurrentView 
  } = useApp();
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const isIntro = currentView === 'splash' || currentView === 'onboarding';

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col items-center justify-center p-0 sm:p-3 select-none relative font-sans">
      {/* Desktop Quick Flow Bar */}
      <div className="hidden sm:flex flex-col gap-1.5 w-full max-w-[430px] mb-2 px-3 py-2 bg-[#ffffff] border border-[#e5edf5] rounded-[4px] text-xs font-normal">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Smartphone size={13} className="text-[#061b31]" />
            <span className="font-medium text-[#061b31]">NELE App Flow</span>
          </div>
          <button
            onClick={() => setIsAndroidFrame(!isAndroidFrame)}
            className="flex items-center gap-1 text-[11px] text-[#533afd] hover:text-[#7389ff] cursor-pointer"
          >
            {isAndroidFrame ? (
              <>
                <Minimize2 size={11} />
                <span>Flat Frame</span>
              </>
            ) : (
              <>
                <Maximize2 size={11} />
                <span>Android Shell</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Screen Jump Buttons */}
        <div className="flex items-center gap-1 pt-1 border-t border-[#e5edf5] overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setCurrentView('splash')}
            className={`px-2 py-0.5 rounded-[3px] text-[11px] transition-colors cursor-pointer shrink-0 ${
              currentView === 'splash'
                ? 'bg-[#533afd] text-white'
                : 'bg-[#f8fafd] text-[#50617a] border border-[#e5edf5] hover:bg-[#e5edf5]'
            }`}
          >
            01 Splash
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('onboarding')}
            className={`px-2 py-0.5 rounded-[3px] text-[11px] transition-colors cursor-pointer shrink-0 ${
              currentView === 'onboarding'
                ? 'bg-[#533afd] text-white'
                : 'bg-[#f8fafd] text-[#50617a] border border-[#e5edf5] hover:bg-[#e5edf5]'
            }`}
          >
            02 Onboarding (3)
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('auth')}
            className={`px-2 py-0.5 rounded-[3px] text-[11px] transition-colors cursor-pointer shrink-0 ${
              currentView === 'auth'
                ? 'bg-[#533afd] text-white'
                : 'bg-[#f8fafd] text-[#50617a] border border-[#e5edf5] hover:bg-[#e5edf5]'
            }`}
          >
            03 Register & Login
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className={`px-2 py-0.5 rounded-[3px] text-[11px] transition-colors cursor-pointer shrink-0 ${
              currentView === 'home' || currentView === 'detail' || currentView === 'search'
                ? 'bg-[#533afd] text-white'
                : 'bg-[#f8fafd] text-[#50617a] border border-[#e5edf5] hover:bg-[#e5edf5]'
            }`}
          >
            04 Marketplace
          </button>
        </div>
      </div>

      {/* Main Container: Android Phone Mockup matching Figma specs (402px x 874px, 32px border radius) */}
      <div
        style={isIntro ? { maxWidth: 412, height: 'min(917px, calc(100dvh - 100px))', background: '#fff' } : undefined}
        className={`${isIntro ? 'nele-intro-shell' : ''} w-full sm:max-w-[402px] h-[100dvh] sm:h-[874px] sm:max-h-[95vh] ${
          currentView === 'splash' ? 'bg-[#CAC7FF]' : 'bg-[#ffffff]'
        } flex flex-col overflow-hidden relative ${
          isAndroidFrame
            ? 'sm:border-[6px] sm:border-[#061b31] sm:rounded-[36px] sm:ring-1 sm:ring-[#e5edf5]'
            : 'sm:border sm:border-[#e5edf5] sm:rounded-[32px]'
        }`}
      >
        {/* Android Punch-hole Camera & Status Bar */}
        {!isIntro && <div className="h-9 w-full bg-white border-b border-[#e5edf5] text-[#061b31] flex items-center justify-between px-5 text-xs font-normal shrink-0 relative z-50">
          <span className="text-[11px] font-medium tracking-tight tabular-nums">{currentTime}</span>
          <div className="w-3 h-3 bg-[#061b31] rounded-full absolute left-1/2 -translate-x-1/2 top-2.5 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#182659]"></div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#50617a]">
            <span className="text-[10px] font-medium px-1 rounded-[4px] bg-[#e8e9ff] text-[#533afd]">5G</span>
            <Wifi size={12} strokeWidth={1.5} />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] tabular-nums">98%</span>
              <Battery size={13} strokeWidth={1.5} />
            </div>
          </div>
        </div>}

        {/* Dynamic Toast Notification Banner */}
        {toastMessage && (
          <div className="absolute top-11 left-3 right-3 z-50 bg-[#061b31] text-[#ffffff] px-3.5 py-2.5 rounded-[4px] border border-[#182659] text-xs font-normal flex items-center justify-between animate-in fade-in duration-150">
            <span>{toastMessage}</span>
            <span className="text-[#839bc8] text-[10px] hover:text-white cursor-pointer ml-2">✕</span>
          </div>
        )}

        {/* App Content Canvas */}
        <div className={`flex-1 w-full min-h-0 overflow-hidden flex flex-col ${currentView === 'splash' ? 'bg-transparent' : 'bg-[#ffffff]'} relative`}>
          {children}
        </div>

        {/* Android Bottom Gesture Bar */}
        {!isIntro && <div className="h-3.5 bg-[#ffffff] border-t border-[#e5edf5] w-full flex items-center justify-center shrink-0">
          <div className="w-28 h-1 bg-[#061b31]/40 rounded-[2px]"></div>
        </div>}
      </div>
    </div>
  );
};
