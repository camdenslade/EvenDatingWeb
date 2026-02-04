import { useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import Header from '../components/Header'
import Footer from '../components/Footer'
import GlobalBackground from '../components/GlobalBackground'
import './PageStyles.css'
=======
import './Home.css'
>>>>>>> b6dd2eb5ae2a58309fd147bc863486e4f02fdf38

export default function NotFound() {
  const navigate = useNavigate()

  return (
<<<<<<< HEAD
    <div className="page-container">
      <GlobalBackground mode="teal" />
      <Header />

      <div className="page-content" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <h1 className="page-title" style={{ fontSize: 'clamp(4rem, 15vw, 8rem)', marginBottom: '1rem' }}>
          404
        </h1>
        <h2 className="page-subtitle" style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '1rem' }}>
          Page Not Found
        </h2>
        <p className="card-text" style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="primary-button" onClick={() => navigate('/')}>
            Go Home
          </button>
          <button className="secondary-button" onClick={() => navigate('/support')}>
            Contact Support
          </button>
        </div>
      </div>

      <Footer />
=======
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
>>>>>>> b6dd2eb5ae2a58309fd147bc863486e4f02fdf38
    </div>
  )
}
