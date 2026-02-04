import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Features from './pages/Features'
import Safety from './pages/Safety'
import Suggestions from './pages/Suggestions'
import Support from './pages/Support'
import FAQ from './pages/FAQ'
import DeleteAccount from './pages/DeleteAccount'
import NotFound from './pages/NotFound'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import CommunityGuidelinesPage from './pages/CommunityGuidelinesPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/support" element={<Support />} />
        <Route path="/contact" element={<Support />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/delete-account" element={<DeleteAccount />} />

        {/* Legal pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/terms" element={<Navigate to="/terms-of-service" replace />} />
        <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
        <Route path="/guidelines" element={<Navigate to="/community-guidelines" replace />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
