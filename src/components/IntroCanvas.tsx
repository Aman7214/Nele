import React from 'react';
import { BatteryFull, Signal, Wifi } from 'lucide-react';

export const IntroCanvas: React.FC<{ children: React.ReactNode; splash?: boolean }> = ({ children, splash = false }) => (
  <div className={`nele-intro ${splash ? 'nele-intro--splash' : ''}`}>
    <div className="nele-intro-background" aria-hidden="true">
      {splash ? <>
        <img className="nele-glow nele-glow--one" src="/figma/nele/glow.svg" alt="" />
        <img className="nele-glow nele-glow--two" src="/figma/nele/glow.svg" alt="" />
        <img className="nele-blue-glow" src="/figma/nele/blue-glow.svg" alt="" />
      </> : <img className="nele-onboarding-gradient" src="/figma/nele/onboarding-gradient.svg" alt="" />}
    </div>
    <div className="nele-intro-status" aria-hidden="true">
      <span>9:30</span>
      <span className="nele-intro-camera" />
      <span className="nele-intro-signals"><Wifi /><Signal /><BatteryFull /></span>
    </div>
    {children}
  </div>
);
