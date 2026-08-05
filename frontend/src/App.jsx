import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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

// NGO Module Components
import NgoLayout from './ngo/layout';
import NgoDashboardPage from './ngo/page';
import NgoVerificationPage from './ngo/verification/page';
import BrowseFoodPage from './ngo/browse-food/page';
import NgoMapsPage from './ngo/maps/page';
import FoodDetailsPage from './ngo/food-details/page';
import AcceptedDonationsPage from './ngo/accepted-donations/page';
import TrackVolunteerPage from './ngo/track-volunteer/page';
import NgoNotificationsPage from './ngo/notifications/page';
import NgoFeedbackPage from './ngo/feedback/page';
import NgoProfilePage from './ngo/profile/page';

// Volunteer Module Components
import VolunteerLayout from './volunteer/layout';
import VolunteerDashboardPage from './volunteer/page';
import AssignedPickupsPage from './volunteer/assignments/page';
import NavigationPage from './volunteer/navigation/page';
import PickupVerificationPage from './volunteer/verification/page';
import UpdateDeliveryStatusPage from './volunteer/delivery-status/page';
import VolunteerNotificationsPage from './volunteer/notifications/page';
import DeliveryHistoryPage from './volunteer/history/page';
import VolunteerProfilePage from './volunteer/profile/page';

// Admin Module Components
import AdminLayout from './admin/layout';
import AdminDashboardPage from './admin/page';
import AdminVerificationsPage from './admin/verifications/page';
import AdminUsersPage from './admin/users/page';
import AdminDonationsPage from './admin/donations/page';
import AdminFeedbackPage from './admin/feedback/page';
import AdminLoginPage from './admin/login/page';

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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Login Page */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Portal Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="verifications" element={<AdminVerificationsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="donations" element={<AdminDonationsPage />} />
              <Route path="feedback" element={<AdminFeedbackPage />} />
            </Route>
          </Route>

          {/* Donor Portal Routes */}
          <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
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
          </Route>

          {/* NGO Portal Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ngo']} />}>
            <Route path="/ngo" element={<NgoLayout />}>
              <Route index element={<NgoDashboardPage />} />
              <Route path="verification" element={<NgoVerificationPage />} />
              <Route path="browse-food" element={<BrowseFoodPage />} />
              <Route path="accepted-donations" element={<AcceptedDonationsPage />} />
              <Route path="maps" element={<NgoMapsPage />} />
              <Route path="food-details" element={<FoodDetailsPage />} />
              <Route path="track-volunteer" element={<TrackVolunteerPage />} />
              <Route path="notifications" element={<NgoNotificationsPage />} />
              <Route path="feedback" element={<NgoFeedbackPage />} />
              <Route path="profile" element={<NgoProfilePage />} />
            </Route>
          </Route>

          {/* Volunteer Portal Routes */}
          <Route element={<ProtectedRoute allowedRoles={['volunteer']} />}>
            <Route path="/volunteer" element={<VolunteerLayout />}>
              <Route index element={<VolunteerDashboardPage />} />
              <Route path="assignments" element={<AssignedPickupsPage />} />
              <Route path="navigation" element={<NavigationPage />} />
              <Route path="verification" element={<PickupVerificationPage />} />
              <Route path="delivery-status" element={<UpdateDeliveryStatusPage />} />
              <Route path="notifications" element={<VolunteerNotificationsPage />} />
              <Route path="history" element={<DeliveryHistoryPage />} />
              <Route path="profile" element={<VolunteerProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
