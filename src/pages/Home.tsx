import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GlobalBackground from '../components/GlobalBackground'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <GlobalBackground mode="teal" />
      <Header />

      {/* Main Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Dating Made Fair</h1>
          <p className="hero-subtitle">
            The dating app for college students where accountability meets connection. Rate, review, and build meaningful relationships 
            with a system designed for fairness and respect.
          </p>
        </div>
      </main>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-content">
          <h2 className="section-title">How It Works</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <h3 className="feature-title">Private Reviews, Public Accountability</h3>
              <p className="feature-description">
                Leave honest reviews (1-10) that only you and your match can see. Your total score 
                appears on your profile, encouraging genuine connections and respectful behavior 
                from day one.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">Fair for Everyone</h3>
              <p className="feature-description">
                Our intelligent system maintains balanced averages, automatically adjusting ratings 
                to prevent bias. Everyone gets a fair chance—no matter who you are.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">Real Connections, Real Reviews</h3>
              <p className="feature-description">
                You can only review someone after meaningful conversation. No snap judgments—just 
                honest feedback based on actual interactions and real connections.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">Thoughtful Feedback System</h3>
              <p className="feature-description">
                Three reviews per week with thoughtful ranges. Use one to unlock the next, 
                ensuring every review is meaningful and considered.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">Your Safety, Our Priority</h3>
              <p className="feature-description">
                Emergency reporting system for abuse cases. One lifetime review to protect yourself 
                and others. We take safety seriously—always.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">Find Who You're Looking For</h3>
              <p className="feature-description">
                Premium search by first name within 25 miles. Reconnect with someone special or 
                find that person you've been hoping to meet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Swiping Mechanics Section */}
      <section className="mechanics-section">
        <div className="mechanics-content">
          <h2 className="section-title">Smart Swiping</h2>
          <div className="mechanics-grid">
            <div className="mechanic-card">
              <h3 className="mechanic-title">For Straight Users</h3>
              <p className="mechanic-description">
                Swipe left or right to skip. Hold the button in the bottom middle 
                of the screen to send a like.
              </p>
            </div>
            <div className="mechanic-card">
              <h3 className="mechanic-title">For Everyone</h3>
              <p className="mechanic-description">
                Swipe right to shuffle through the male card stack. 
                Swipe left to shuffle through the female card stack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready for Dating That's Actually Even?</h2>
          <p className="cta-subtitle">
            Join thousands who are tired of games and ready for real connections. 
            Download Even Dating and experience the difference accountability makes.
          </p>
          <div className="cta-buttons">
            <button className="cta-button primary" onClick={() => console.log('Download')}>
              Download Now
            </button>
            <button className="cta-button secondary" onClick={() => navigate('/suggestions')}>
              Share Feedback
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home

