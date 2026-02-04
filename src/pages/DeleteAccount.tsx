import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import GlobalBackground from '../components/GlobalBackground'
import './PageStyles.css'

function DeleteAccount() {
  const navigate = useNavigate()

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
          <h1 className="page-title">Delete Account</h1>
          <p className="page-subtitle">How to delete your Even Dating account</p>
        </div>

        <div className="content-card">
          <h2 className="card-title">Before You Delete</h2>
          <p className="card-text">
            We're sorry to see you go. Before deleting your account, please be aware of the following:
          </p>
          <ul className="content-list">
            <li>Your profile, photos, and bio will be permanently deleted</li>
            <li>All your matches and conversations will be removed</li>
            <li>Your review history will be deleted (except emergency reviews for safety)</li>
            <li>Any unused tokens or premium features will be forfeited</li>
            <li>This action cannot be undone</li>
          </ul>
        </div>

        <div className="content-card">
          <h2 className="card-title">How to Delete Your Account</h2>
          <p className="card-text">
            Follow these steps to delete your account from the Even Dating app:
          </p>
          <ol className="content-list" style={{ listStyle: 'decimal', paddingLeft: '1.5rem' }}>
            <li style={{ paddingLeft: '0.5rem' }}>Open the Even Dating app on your device</li>
            <li style={{ paddingLeft: '0.5rem' }}>Go to your <strong>Profile</strong> tab</li>
            <li style={{ paddingLeft: '0.5rem' }}>Tap on <strong>Settings</strong> (gear icon)</li>
            <li style={{ paddingLeft: '0.5rem' }}>Scroll down and tap <strong>Delete Account</strong></li>
            <li style={{ paddingLeft: '0.5rem' }}>Choose your deletion option:
              <ul className="content-list" style={{ marginTop: '0.5rem' }}>
                <li><strong>Keep Purchases:</strong> Deletes your data but preserves purchase history for future restoration</li>
                <li><strong>Delete Everything:</strong> Permanently removes all data including purchase records</li>
              </ul>
            </li>
            <li style={{ paddingLeft: '0.5rem' }}>Confirm your decision when prompted</li>
          </ol>
        </div>

        <div className="content-card">
          <h2 className="card-title">Alternative: Pause Your Account</h2>
          <p className="card-text">
            Not ready to delete? You can temporarily hide your profile instead:
          </p>
          <ol className="content-list" style={{ listStyle: 'decimal', paddingLeft: '1.5rem' }}>
            <li style={{ paddingLeft: '0.5rem' }}>Go to <strong>Settings</strong> in the app</li>
            <li style={{ paddingLeft: '0.5rem' }}>Tap <strong>Pause Profile</strong></li>
            <li style={{ paddingLeft: '0.5rem' }}>Your profile will be hidden from discovery</li>
            <li style={{ paddingLeft: '0.5rem' }}>Unpause anytime to become visible again</li>
          </ol>
          <p className="card-text" style={{ marginTop: '1rem' }}>
            Pausing keeps all your data, matches, and conversations intact while giving you a break.
          </p>
        </div>

        <div className="content-card">
          <h2 className="card-title">Data Retention</h2>
          <p className="card-text">
            After account deletion:
          </p>
          <ul className="content-list">
            <li>Your personal data is deleted from our active systems</li>
            <li>Some data may be retained in backups for a limited period</li>
            <li>Emergency reviews are preserved for community safety</li>
            <li>Anonymized analytics data may be retained</li>
            <li>Legal compliance records are kept as required by law</li>
          </ul>
          <p className="card-text" style={{ marginTop: '1rem' }}>
            For complete details, please review our{' '}
            <a
              href="/privacy-policy"
              onClick={(e) => { e.preventDefault(); navigate('/privacy-policy') }}
              style={{ color: '#ffffff', textDecoration: 'underline' }}
            >
              Privacy Policy
            </a>.
          </p>
        </div>

        <div className="content-card" style={{ textAlign: 'center' }}>
          <h2 className="card-title">Need Help?</h2>
          <p className="card-text" style={{ marginBottom: '1.5rem' }}>
            Having trouble deleting your account or have questions? Contact our support team.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="primary-button" onClick={() => navigate('/support')}>
              Contact Support
            </button>
            <a
              href="mailto:support@evendating.us?subject=Account%20Deletion%20Request"
              className="secondary-button"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default DeleteAccount
