import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IntroCanvas } from './IntroCanvas';

const slides = [
  {
    title: 'Direct properties listings',
    caption: 'Browse plots, houses and commercial spaces from verified owners across Raichur with zero brokerage.',
  },
  {
    title: 'Verified legal documents',
    caption: 'View authentic land and revenue records including RTC Pahani, E-khata and encumbrance certificate.',
  },
  {
    title: 'Direct Chat and offers',
    caption: 'Negotiate transparent in real time, submit formal price offers and connect with the property owners.',
  },
];

export const Onboarding: React.FC = () => {
  const { completeOnboarding } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
    else completeOnboarding();
  };

  return (
    <IntroCanvas>
      <div className="nele-intro-progress" role="group" aria-label="Introduction slides">
        {slides.map((slide, index) => (
          <button key={slide.title} onClick={() => setCurrentSlide(index)} aria-label={`Slide ${index + 1}: ${slide.title}`} aria-current={index === currentSlide ? 'step' : undefined} className={index <= currentSlide ? 'is-complete' : ''} />
        ))}
      </div>
      <div className={`nele-intro-copy ${currentSlide === 0 ? 'nele-intro-copy--first' : ''}`} aria-live="polite">
        <h1>{slides[currentSlide].title}</h1>
        <p>{slides[currentSlide].caption}</p>
      </div>
      <button onClick={handleNext} className="nele-intro-continue">Continue</button>
    </IntroCanvas>
  );
};
