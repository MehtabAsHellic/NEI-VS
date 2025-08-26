import React from 'react';
import LandingNavigation from './landing/LandingNavigation';
import LandingHero from './landing/LandingHero';
import LandingFeatures from './landing/LandingFeatures';
import LandingCourses from './landing/LandingCourses';
import LandingSandboxPreview from './landing/LandingSandboxPreview';
import LandingTestimonials from './landing/LandingTestimonials';
import LandingIntegrations from './landing/LandingIntegrations';
import LandingCTA from './landing/LandingCTA';
import LandingFooter from './landing/LandingFooter';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <LandingNavigation />
      <LandingHero />
      <LandingFeatures />
      <LandingCourses />
      <LandingSandboxPreview />
      <LandingTestimonials />
      <LandingIntegrations />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;