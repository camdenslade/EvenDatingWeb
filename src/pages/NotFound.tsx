import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GlobalBackground from '../components/GlobalBackground'
import './PageStyles.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
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
    </div>
  )
}
