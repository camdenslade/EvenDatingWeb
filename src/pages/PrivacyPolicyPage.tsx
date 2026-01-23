import Header from '../components/Header'
import Footer from '../components/Footer'
import GlobalBackground from '../components/GlobalBackground'
import { PrivacyPolicyContent } from '../components/legal/PrivacyPolicy'
import './LegalPage.css'

export default function PrivacyPolicyPage() {
  return (
    <div className="legal-page">
      <GlobalBackground mode="dark" />
      <Header />

      <main className="legal-wrapper" aria-labelledby="privacy-policy-title">
        <section className="legal-card">
          <div className="legal-header">
            <p className="legal-kicker">Even Dating</p>
            <h1 id="privacy-policy-title" className="legal-title">Privacy Policy</h1>
            <p className="legal-subtitle">How we collect, use, and protect your information.</p>
          </div>

          <div className="legal-body">
            <PrivacyPolicyContent />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

