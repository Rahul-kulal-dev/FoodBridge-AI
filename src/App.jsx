import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Landing Page Components
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

// Donor Module Components
import DonorLayout from './donor/layout';
import DonorDashboardPage from './donor/page';
import DonorVerificationPage from './donor/verification/page';
import CreateDonationPage from './donor/create-donation/page';
import MyDonationsPage from './donor/donations/page';
import AIPredictionsPage from './donor/ai-predictions/page';
import DonorNotificationsPage from './donor/notifications/page';
import DonorFeedbackPage from './donor/feedback/page';
import DonorProfilePage from './donor/profile/page';

/**
 * Landing Page Component
 */
function LandingPage() {
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
    <div className="min-h-screen bg-white text-[#334155] font-sans antialiased selection:bg-[#ff6b35] selection:text-white">
      <Navbar 
        onOpenDonateModal={handleOpenDonateModal} 
        onOpenAuthModal={handleOpenAuthModal} 
      />

      <main>
        <Hero onOpenDonateModal={handleOpenDonateModal} />
        <StatsBar />
        <TrustSection />
        <FeaturesSection onOpenDonateModal={handleOpenDonateModal} />
        <HowItWorks />
        <TestimonialsSection />
        <AboutContactSection />
        <FinalCTA onOpenDonateModal={handleOpenDonateModal} />
      </main>

      <Footer />

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        initialType={modalType} 
      />
    </div>
  );
}

/**
 * Main App Router Component
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Donor Portal Routes */}
        <Route path="/donor" element={<DonorLayout />}>
          <Route index element={<DonorDashboardPage />} />
          <Route path="verification" element={<DonorVerificationPage />} />
          <Route path="create-donation" element={<CreateDonationPage />} />
          <Route path="donations" element={<MyDonationsPage />} />
          <Route path="ai-predictions" element={<AIPredictionsPage />} />
          <Route path="notifications" element={<DonorNotificationsPage />} />
          <Route path="feedback" element={<DonorFeedbackPage />} />
          <Route path="profile" element={<DonorProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
