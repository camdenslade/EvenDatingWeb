import Header from '../components/Header'
import Footer from '../components/Footer'
import GlobalBackground from '../components/GlobalBackground'
import './PageStyles.css'

function Safety() {
  const hotlines = [
    { label: 'National Domestic Violence Hotline', phone: '1-800-799-7233' },
    { label: 'National Sexual Assault Hotline (RAINN)', phone: '1-800-656-4673' },
    { label: 'National Human Trafficking Hotline', phone: '1-888-373-7888' },
    { label: '988 Suicide & Crisis Lifeline', phone: '988' },
  ]

  const onlineSafetyTips = [
    'Never share your full address or workplace.',
    'Keep conversations inside the app until trust is built.',
    'Avoid sending money or financial info.',
    'Use video chat to verify identity.',
  ]

  const meetingTips = [
    'Meet in a public place.',
    'Tell a friend who & where.',
    'Arrange your own transport.',
    'Leave if it feels wrong.',
  ]

  const appPolicies = [
    'You can block or report anytime.',
    'Emergency reviews are preserved.',
    'Suspicious actions trigger safety checks.',
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
          <h1 className="page-title">Safety Center</h1>
          <p className="page-subtitle">Your safety is our priority</p>
        </div>

        {/* Emergency Section */}
        <div className="content-card" style={{ textAlign: 'center', background: 'rgba(215, 38, 61, 0.3)', borderColor: 'rgba(215, 38, 61, 0.5)' }}>
          <h2 className="card-title">If you're in immediate danger:</h2>
          <a
            href="tel:911"
            className="primary-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1rem',
              background: '#D7263D',
              color: '#ffffff',
            }}
          >
            Call 911
          </a>
        </div>

        {/* National Hotlines */}
        <section className="page-section">
          <h2 className="section-title">National Safety Hotlines</h2>
          <div className="card-grid">
            {hotlines.map((hotline, index) => (
              <a
                key={index}
                href={`tel:${hotline.phone}`}
                className="content-card"
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <h3 className="card-title" style={{ fontSize: '1.125rem' }}>{hotline.label}</h3>
                <p className="card-text" style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ffffff' }}>
                  {hotline.phone}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Online Dating Safety Tips */}
        <section className="page-section">
          <h2 className="section-title">Online Dating Safety Tips</h2>
          <div className="content-card">
            <ul className="content-list">
              {onlineSafetyTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Meeting in Person */}
        <section className="page-section">
          <h2 className="section-title">Meeting in Person</h2>
          <div className="content-card">
            <ul className="content-list">
              {meetingTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Even App Safety Policies */}
        <section className="page-section">
          <h2 className="section-title">Even App Safety Policies</h2>
          <div className="content-card">
            <ul className="content-list">
              {appPolicies.map((policy, index) => (
                <li key={index}>{policy}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="page-section">
          <h2 className="section-title">Additional Resources</h2>
          <div className="content-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a
                href="https://www.rainn.org/safety-tips"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ffffff', textDecoration: 'underline', fontSize: '1rem' }}
              >
                RAINN Safety Tips
              </a>
              <a
                href="https://www.thehotline.org/resources/safety-planning"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ffffff', textDecoration: 'underline', fontSize: '1rem' }}
              >
                Domestic Violence Safety Planning
              </a>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <div className="content-card" style={{ textAlign: 'center' }}>
          <h2 className="card-title">Need Help?</h2>
          <p className="card-text">
            If you need assistance or want to report a concern, our support team is here for you.
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

export default Safety
