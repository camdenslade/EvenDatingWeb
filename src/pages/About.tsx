import Header from '../components/Header'
import Footer from '../components/Footer'
import GlobalBackground from '../components/GlobalBackground'
import './PageStyles.css'

function About() {
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
          <h1 className="page-title">About Even</h1>
          <p className="page-subtitle">Dating made fair for everyone</p>
        </div>

        <div className="content-card">
          <h2 className="card-title">Our Mission</h2>
          <p className="card-text">
            Even Dating was created with a simple but powerful idea: dating should be fair.
            We believe that everyone deserves a genuine chance at connection, regardless of
            how they look in their first photo or how clever their opening line is.
          </p>
          <p className="card-text">
            Our accountability-based system encourages authentic behavior from day one.
            When your actions have consequences, people tend to be more respectful,
            honest, and genuine in their interactions.
          </p>
        </div>

        <div className="content-card">
          <h2 className="card-title">Why Even?</h2>
          <p className="card-text">
            Traditional dating apps often reward superficial qualities and game-playing.
            Even takes a different approach by introducing accountability through our
            review system. After meaningful conversations, users can rate their
            experience—creating a community where respect and authenticity are valued.
          </p>
          <ul className="content-list">
            <li>Reviews only unlock after real conversation</li>
            <li>Your score reflects how you treat others</li>
            <li>Fair algorithms that balance the playing field</li>
            <li>Safety features that protect our community</li>
          </ul>
        </div>

        <div className="content-card">
          <h2 className="card-title">Built for College Students</h2>
          <p className="card-text">
            Even Dating is designed specifically for college students and young adults
            who are tired of the typical dating app experience. We understand the unique
            social dynamics of campus life and have built features that make sense for
            how students actually connect.
          </p>
          <p className="card-text">
            From school email verification to local discovery, Even is optimized for
            building real connections in your community.
          </p>
        </div>

        <div className="content-card">
          <h2 className="card-title">Our Values</h2>
          <div className="card-grid" style={{ marginTop: '1rem' }}>
            <div>
              <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Fairness</h3>
              <p className="card-text">
                Everyone gets a fair chance. Our systems actively work to prevent bias
                and give all users genuine opportunities to connect.
              </p>
            </div>
            <div>
              <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Accountability</h3>
              <p className="card-text">
                Actions have consequences. Our review system encourages users to be
                their best selves in every interaction.
              </p>
            </div>
            <div>
              <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Safety</h3>
              <p className="card-text">
                Your wellbeing comes first. We provide tools to report, block, and
                protect yourself from harmful behavior.
              </p>
            </div>
            <div>
              <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Authenticity</h3>
              <p className="card-text">
                Be yourself. Our platform rewards genuine connections over games
                and manipulation.
              </p>
            </div>
          </div>
        </div>

        <div className="content-card" style={{ textAlign: 'center' }}>
          <h2 className="card-title">Contact Us</h2>
          <p className="card-text">
            Have questions or feedback? We'd love to hear from you.
          </p>
          <p className="card-text" style={{ marginTop: '1rem' }}>
            <a
              href="mailto:support@evendating.us"
              style={{ color: '#ffffff', textDecoration: 'underline' }}
            >
              support@evendating.us
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default About
