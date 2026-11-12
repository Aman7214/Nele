import React from 'react';

interface NeleLogoProps {
  variant?: 'header' | 'splash' | 'compact' | 'main';
  className?: string;
}

export const NeleLogo: React.FC<NeleLogoProps> = ({ variant = 'header', className = '' }) => {
  const homeLogoSrc = '/assets/aistudio/Logo_home_eb7d077c.svg';
  const mainLogoSrc = '/assets/aistudio/logo_main_f6ffdebb.svg';

  if (variant === 'header') {
    return (
      <div className={`flex items-center shrink-0 ${className}`}>
        <img
          src={homeLogoSrc}
          alt="NELE"
          className="h-9 w-auto max-h-9 object-contain block select-none pointer-events-none"
        />
      </div>
    );
  }

  if (variant === 'splash' || variant === 'main') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img
          src={mainLogoSrc}
          alt="NELE"
          className="w-[123px] h-[120px] object-contain block select-none pointer-events-none"
        />
      </div>
    );
  }

  // compact for inner headers
  return (
    <div className={`flex items-center shrink-0 ${className}`}>
      <img
        src={homeLogoSrc}
        alt="NELE"
        className="h-6.5 w-auto max-h-7 object-contain block select-none pointer-events-none"
      />
    </div>
  );
};
