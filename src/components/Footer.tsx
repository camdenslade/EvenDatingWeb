import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PrivacyPolicy from './legal/PrivacyPolicy'
import CommunityGuidelines from './legal/CommunityGuidelines'
import TermsOfService from './legal/TermsOfService'
import CookiePolicy from './legal/CookiePolicy'
import './Footer.css'

export default function Footer() {
  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState<'privacy' | 'terms' | 'cookies' | 'guidelines' | null>(null)

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo-container" onClick={() => navigate('/')}>
            <img 
              src="/assets/Even-App-Logos/TransparentBG/EE-SolidWhite.png" 
              alt="Even Dating Logo" 
              className="footer-logo"
            />
            <span className="footer-logo-text">Even</span>
          </div>
          <p className="footer-tagline">Dating Made Even</p>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Navigation</h3>
          <nav className="footer-nav">
            <button className="footer-link" onClick={() => navigate('/suggestions')}>
              Suggestions
            </button>
            <button className="footer-link" onClick={() => navigate('/support')}>
              Support
            </button>
            <button className="footer-link" onClick={() => navigate('/contact')}>
              Contact
            </button>
          </nav>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Legal</h3>
          <nav className="footer-nav">
            <button className="footer-link" onClick={() => setOpenModal('privacy')}>
              Privacy Policy
            </button>
            <button className="footer-link" onClick={() => setOpenModal('terms')}>
              Terms of Service
            </button>
            <button className="footer-link" onClick={() => setOpenModal('cookies')}>
              Cookie Policy
            </button>
            <button className="footer-link" onClick={() => setOpenModal('guidelines')}>
              Community Guidelines
            </button>
          </nav>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Contact</h3>
          <p className="footer-contact">
            <a href="mailto:support@evendating.com" className="footer-email">
              support@evendating.com
            </a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} Even Dating. All rights reserved.
        </p>
      </div>

      <PrivacyPolicy isOpen={openModal === 'privacy'} onClose={() => setOpenModal(null)} />
      <CommunityGuidelines isOpen={openModal === 'guidelines'} onClose={() => setOpenModal(null)} />
      <TermsOfService isOpen={openModal === 'terms'} onClose={() => setOpenModal(null)} />
      <CookiePolicy isOpen={openModal === 'cookies'} onClose={() => setOpenModal(null)} />
    </footer>
  )
}

