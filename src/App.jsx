import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import TrustSection from './components/TrustSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import TestimonialsSection from './components/TestimonialsSection';
import AboutContactSection from './components/AboutContactSection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Modal from './components/Modal';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('register');

  const handleOpenDonateModal = (type = 'register') => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleOpenAuthModal = (type = 'login') => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#334155] font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar 
        onOpenDonateModal={handleOpenDonateModal} 
        onOpenAuthModal={handleOpenAuthModal} 
      />

      {/* Main Page Content */}
      <main>
        {/* Hero Section */}
        <Hero onOpenDonateModal={handleOpenDonateModal} />

        {/* Statistics Counter */}
        <StatsBar />

        {/* Trust Section */}
        <TrustSection />

        {/* Features Section */}
        <FeaturesSection onOpenDonateModal={handleOpenDonateModal} />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* About & Contact Section */}
        <AboutContactSection />

        {/* Final CTA Banner */}
        <FinalCTA onOpenDonateModal={handleOpenDonateModal} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Quick Action Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        initialType={modalType} 
      />
    </div>
  );
}

export default App;
