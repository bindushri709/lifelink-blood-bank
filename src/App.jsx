import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/common/Navbar'
import EmergencyAlertBanner from './components/common/EmergencyAlertBanner'
import Footer from './components/common/Footer'

// Pages
import LandingPage from './pages/LandingPage'
import FindBloodPage from './pages/FindBloodPage'
import DonorRegisterPage from './pages/DonorRegisterPage'
import DonorDashboardPage from './pages/DonorDashboardPage'
import EmergencyRequestPage from './pages/EmergencyRequestPage'
import LocationMatchingPage from './pages/LocationMatchingPage'
import HospitalDashboardPage from './pages/HospitalDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import BloodInventoryPage from './pages/BloodInventoryPage'
import NotificationsPage from './pages/NotificationsPage'
import LoginPage from './pages/LoginPage'
import AboutPage from './pages/AboutPage'

// Automatically scroll to top on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-red-500 selection:text-white">
          <Navbar />
          <EmergencyAlertBanner />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/find-blood" element={<FindBloodPage />} />
              <Route path="/register" element={<DonorRegisterPage />} />
              <Route path="/donor-dashboard" element={<DonorDashboardPage />} />
              <Route path="/emergency-request" element={<EmergencyRequestPage />} />
              <Route path="/match" element={<LocationMatchingPage />} />
              <Route path="/hospital-dashboard" element={<HospitalDashboardPage />} />
              <Route path="/hospitals" element={<HospitalDashboardPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
              <Route path="/inventory" element={<BloodInventoryPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/about" element={<AboutPage />} />
              {/* Catch-all */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
