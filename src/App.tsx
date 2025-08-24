import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Sandbox from './components/Sandbox';
import Learn from './components/Learn';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Sandbox />
      <Learn />
    </div>
  );
}

export default App;