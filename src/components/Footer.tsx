import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
<<<<<<< HEAD
=======
import CommunityGuidelines from './legal/CommunityGuidelines'
>>>>>>> b6dd2eb5ae2a58309fd147bc863486e4f02fdf38
import CookiePolicy from './legal/CookiePolicy'
import './Footer.css'

export default function Footer() {
  const navigate = useNavigate()
<<<<<<< HEAD
  const [showCookieModal, setShowCookieModal] = useState(false)
=======
  const [openModal, setOpenModal] = useState<'cookies' | 'guidelines' | null>(null)
>>>>>>> b6dd2eb5ae2a58309fd147bc863486e4f02fdf38

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
          <h3 className="footer-heading">Company</h3>
          <nav className="footer-nav">
            <button className="footer-link" onClick={() => navigate('/about')}>
              About
            </button>
            <button className="footer-link" onClick={() => navigate('/features')}>
              Features
            </button>
            <button className="footer-link" onClick={() => navigate('/safety')}>
              Safety
            </button>
          </nav>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Support</h3>
          <nav className="footer-nav">
            <button className="footer-link" onClick={() => navigate('/support')}>
              Contact Us
            </button>
            <button className="footer-link" onClick={() => navigate('/suggestions')}>
              Suggestions
            </button>
            <button className="footer-link" onClick={() => navigate('/faq')}>
              FAQ
            </button>
            <button className="footer-link" onClick={() => navigate('/delete-account')}>
              Delete Account
            </button>
          </nav>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Legal</h3>
          <nav className="footer-nav">
            <button className="footer-link" onClick={() => navigate('/privacy-policy')}>
              Privacy Policy
            </button>
            <button className="footer-link" onClick={() => navigate('/terms-of-service')}>
              Terms of Service
            </button>
            <button className="footer-link" onClick={() => navigate('/community-guidelines')}>
              Community Guidelines
            </button>
            <button className="footer-link" onClick={() => setShowCookieModal(true)}>
              Cookie Policy
            </button>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-contact">
          <a href="mailto:support@evendating.us" className="footer-email">
            support@evendating.us
          </a>
        </p>
        <p className="footer-copyright">
          © {new Date().getFullYear()} Even Dating. All rights reserved.
        </p>
      </div>

<<<<<<< HEAD
      <CookiePolicy isOpen={showCookieModal} onClose={() => setShowCookieModal(false)} />
=======
      <CommunityGuidelines isOpen={openModal === 'guidelines'} onClose={() => setOpenModal(null)} />
      <CookiePolicy isOpen={openModal === 'cookies'} onClose={() => setOpenModal(null)} />
>>>>>>> b6dd2eb5ae2a58309fd147bc863486e4f02fdf38
    </footer>
  )
}
