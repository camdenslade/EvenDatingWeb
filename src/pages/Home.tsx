import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  const handleCreateAccount = () => {
    console.log('Create Account clicked')
  }

  const handleSignIn = () => {
    console.log('Sign In clicked')
  }

  const handleSearchNearby = () => {
    console.log('Search Nearby clicked')
  }

  const handleTroubleSigningIn = () => {
    console.log('Trouble signing in clicked')
  }

  return (
    <div className="home-page">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <nav className="top-nav">
        <button className="nav-link" onClick={() => navigate('/contact')}>
          Contact
        </button>
        <button className="nav-link" onClick={() => navigate('/roadmap')}>
          Roadmap
        </button>
        <button className="nav-link" onClick={() => navigate('/support')}>
          Support
        </button>
      </nav>

      <div className="content">
        <div className="logo-section">
          <div className="logo">王</div>
          <h1 className="app-name">Even Dating</h1>
        </div>

        <div className="legal-text">
          By tapping 'Create account' or 'Sign in', you agree to our{' '}
          <a href="#" className="link">Terms</a>. Learn how we process your data in our{' '}
          <a href="#" className="link">Privacy Policy</a> and{' '}
          <a href="#" className="link">Cookies Policy</a>.
        </div>

        <div className="buttons">
          <button className="btn btn-primary" onClick={handleCreateAccount}>
            Create Account
          </button>
          <button className="btn btn-primary" onClick={handleSignIn}>
            Sign In
          </button>
          <button className="btn btn-primary" onClick={handleSearchNearby}>
            Search Nearby
          </button>
        </div>

        <a href="#" className="trouble-link" onClick={handleTroubleSigningIn}>
          Trouble signing in?
        </a>
      </div>
    </div>
  )
}

export default Home

