import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { IntroCanvas } from './IntroCanvas';

export const SplashAnimation: React.FC = () => {
  const { setCurrentView } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => setCurrentView('onboarding'), 2400);
    return () => clearTimeout(timer);
  }, [setCurrentView]);

  return (
    <IntroCanvas splash>
      <button className="nele-splash-logo" onClick={() => setCurrentView('onboarding')} aria-label="Continue to Nele introduction">
        <img src="/figma/nele/logo.svg" alt="NELE" />
      </button>
    </IntroCanvas>
  );
};
