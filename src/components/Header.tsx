import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleNavigate = (path: string) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo-container" onClick={() => navigate('/')}>
          <img
            src="/assets/Even-App-Logos/TransparentBG/EE-SolidWhite.png"
            alt="Even Dating Logo"
            className="header-logo"
          />
          <span className="logo-text">Even</span>
        </div>

        <nav className="header-nav">
          <button className="nav-item" onClick={() => navigate('/features')}>
            Features
          </button>
          <button className="nav-item" onClick={() => navigate('/safety')}>
            Safety
          </button>
          <button className="nav-item" onClick={() => navigate('/support')}>
            Support
          </button>
<<<<<<< HEAD
=======
          <button className="nav-item login-btn" onClick={() => navigate('/admin/login')}>
            Log in
          </button>
>>>>>>> b6dd2eb5ae2a58309fd147bc863486e4f02fdf38
        </nav>

        <button
          ref={buttonRef}
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

<<<<<<< HEAD
      <div
=======
      <div 
>>>>>>> b6dd2eb5ae2a58309fd147bc863486e4f02fdf38
        ref={menuRef}
        className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}
      >
        <button
          className="mobile-nav-item"
<<<<<<< HEAD
          onClick={() => handleNavigate('/features')}
        >
          Features
        </button>

        <button
          className="mobile-nav-item"
          onClick={() => handleNavigate('/safety')}
        >
          Safety
=======
          onClick={() => handleNavigate('/suggestions')}
        >
          Suggestions
>>>>>>> b6dd2eb5ae2a58309fd147bc863486e4f02fdf38
        </button>

        <button
          className="mobile-nav-item"
          onClick={() => handleNavigate('/support')}
        >
          Support
        </button>

        <button
<<<<<<< HEAD
          className="mobile-nav-item"
          onClick={() => handleNavigate('/faq')}
        >
          FAQ
=======
          className="mobile-nav-item mobile-login-btn"
          onClick={() => handleNavigate('/admin/login')}
        >
          Log in
>>>>>>> b6dd2eb5ae2a58309fd147bc863486e4f02fdf38
        </button>
      </div>
    </header>
  )
}
