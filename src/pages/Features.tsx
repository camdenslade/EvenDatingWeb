import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GlobalBackground from '../components/GlobalBackground'
import './PageStyles.css'

function Features() {
  const navigate = useNavigate()

  const features = [
    {
      title: 'Private Reviews, Public Accountability',
      description:
        'Leave honest reviews (1-10) that only you and your match can see. Your total score appears on your profile, encouraging genuine connections and respectful behavior from day one.',
    },
    {
      title: 'Fair for Everyone',
      description:
        'Our intelligent system maintains balanced averages, automatically adjusting ratings to prevent bias. Everyone gets a fair chance—no matter who you are.',
    },
    {
      title: 'Real Connections, Real Reviews',
      description:
        'You can only review someone after meaningful conversation. No snap judgments—just honest feedback based on actual interactions and real connections.',
    },
    {
      title: 'Thoughtful Feedback System',
      description:
        'Three reviews per week with thoughtful ranges. Use one to unlock the next, ensuring every review is meaningful and considered.',
    },
    {
      title: 'Your Safety, Our Priority',
      description:
        'Emergency reporting system for abuse cases. One lifetime review to protect yourself and others. We take safety seriously—always.',
    },
    {
      title: 'Find Who You\'re Looking For',
      description:
        'Premium search by first name within 25 miles. Reconnect with someone special or find that person you\'ve been hoping to meet.',
    },
  ]

  const swipingMechanics = [
    {
      title: 'For Straight Users',
      description:
        'Swipe left or right to skip. Hold the button in the bottom middle of the screen to send a like.',
    },
    {
      title: 'For Everyone',
      description:
        'Swipe right to shuffle through the male card stack. Swipe left to shuffle through the female card stack.',
    },
  ]

  return (
    <div className="page-container">
      <GlobalBackground mode="teal" />
      <Header />

      <div className="page-content">
        <div className="page-header">
          <img
            src="/assets/Even-App-Logos/TransparentBG/EE-SolidWhite.png"
            alt="Even Dating Logo"
            className="logo-small"
          />
          <h1 className="page-title">Features</h1>
          <p className="page-subtitle">Discover what makes Even different</p>
        </div>

        <section className="page-section">
          <h2 className="section-title">How It Works</h2>
          <div className="card-grid">
            {features.map((feature, index) => (
              <div key={index} className="content-card">
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-text">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="page-section">
          <h2 className="section-title">Smart Swiping</h2>
          <div className="card-grid">
            {swipingMechanics.map((mechanic, index) => (
              <div key={index} className="content-card" style={{ textAlign: 'center' }}>
                <h3 className="card-title">{mechanic.title}</h3>
                <p className="card-text">{mechanic.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="page-section">
          <div className="content-card" style={{ textAlign: 'center' }}>
            <h2 className="card-title">Ready to Try Even?</h2>
            <p className="card-text" style={{ marginBottom: '1.5rem' }}>
              Join thousands who are tired of games and ready for real connections.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="primary-button" onClick={() => console.log('Download')}>
                Download Now
              </button>
              <button className="secondary-button" onClick={() => navigate('/suggestions')}>
                Share Feedback
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default Features
