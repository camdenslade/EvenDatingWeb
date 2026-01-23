import { useNavigate } from 'react-router-dom'
import './Home.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="home-page not-found-page">
      <div className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Oops</p>
          <h1 className="hero-title">Page not found</h1>
          <p className="hero-subtitle">
            The link you followed doesn&apos;t exist anymore. Let&apos;s get you back to Even.
          </p>
          <div className="hero-actions">
            <button className="cta-button" onClick={() => navigate('/')}>
              Go Home
            </button>
            <button className="cta-button secondary" onClick={() => navigate('/support')}>
              Visit Support
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="/assets/illustrations/404.png"
            alt="Lost illustration"
            className="hero-image"
            onError={(e) => {
              // hide image if missing from assets
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </div>
      </div>
    </div>
  )
}
