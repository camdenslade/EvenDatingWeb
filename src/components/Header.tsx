import { useNavigate } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const navigate = useNavigate()

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
          <button className="nav-item" onClick={() => navigate('/suggestions')}>
            Suggestions
          </button>
          <button className="nav-item" onClick={() => navigate('/support')}>
            Support
          </button>
          <button className="nav-item login-btn" onClick={() => console.log('Login')}>
            Log in
          </button>
        </nav>
      </div>
    </header>
  )
}

