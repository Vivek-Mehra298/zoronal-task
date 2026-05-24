import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CompanyDetail from './pages/CompanyDetail';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'detail'
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  // User Authentication State
  const [user, setUser] = useState(null); // { name, email }
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authSuccessCallback, setAuthSuccessCallback] = useState(null);

  // Data State
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast Notification State
  const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' }

  const API_BASE = 'http://localhost:5000/api';

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/companies`);
      setCompanies(res.data);
    } catch (err) {
      console.error('Error fetching companies list:', err);
      showToast('Failed to load companies directory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Auth Operations
  const handleOpenAuthModal = (callback = null) => {
    setAuthSuccessCallback(() => callback);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    showToast(`Welcome back, ${authenticatedUser.name}!`, 'success');
    
    // Execute cached callback (e.g. open company modal)
    if (authSuccessCallback) {
      authSuccessCallback();
      setAuthSuccessCallback(null);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setAuthSuccessCallback(null);
    showToast('Signed out successfully.');
  };

  const handleAddCompany = async (formData) => {
    try {
      const res = await axios.post(`${API_BASE}/companies`, formData);
      // Update local company list with the newly created company
      setCompanies((prev) => [res.data, ...prev]);
      showToast('Company successfully registered!');
    } catch (err) {
      console.error('Error creating company:', err);
      showToast(err.response?.data?.message || 'Failed to create company.', 'error');
      throw err;
    }
  };

  const handleNavigateToCompany = (id) => {
    setSelectedCompanyId(id);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedCompanyId(null);
    fetchCompanies(); // Refetch to sync average ratings & count updates
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-blue-600/10 selection:text-blue-600">
      {/* Sleek Header Navigation */}
      <Navbar 
        onBackToHome={handleBackToHome} 
        showBackButton={currentPage === 'detail'}
        user={user}
        onSignOut={handleSignOut}
        onSignInClick={() => handleOpenAuthModal()}
      />

      {/* Main Pages Content Area */}
      <main className="flex-1">
        {currentPage === 'home' ? (
          <Home
            companies={companies}
            loading={loading}
            onSelectCompany={handleNavigateToCompany}
            onAddCompany={handleAddCompany}
            user={user}
            onOpenAuthModal={handleOpenAuthModal}
          />
        ) : (
          <CompanyDetail
            companyId={selectedCompanyId}
            onBack={handleBackToHome}
            onAddReviewSuccess={(msg) => showToast(msg, 'success')}
          />
        )}
      </main>

      {/* Modern Professional Footer */}
      <footer className="w-full border-t border-slate-100 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 flex flex-col items-center justify-between gap-4 md:flex-row sm:px-6 lg:px-8 text-xs font-semibold text-slate-400">
          <p>© {new Date().getFullYear()} Zoronal Review Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            <a href="#contact" className="hover:text-slate-600 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Global Non-blocking Toast Alerts */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
