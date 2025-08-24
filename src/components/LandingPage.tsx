import React from 'react';
import LandingHero from './landing/LandingHero';
import LandingFeatures from './landing/LandingFeatures';
import LandingSandboxPreview from './landing/LandingSandboxPreview';
import LandingCTA from './landing/LandingCTA';
import LandingFooter from './landing/LandingFooter';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <LandingHero />
      <LandingFeatures />
      <LandingSandboxPreview />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;