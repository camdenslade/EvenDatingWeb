import Header from '../components/Header'
import Footer from '../components/Footer'
import GlobalBackground from '../components/GlobalBackground'
import { TermsOfServiceContent } from '../components/legal/TermsOfService'
import './LegalPage.css'

export default function TermsOfServicePage() {
  return (
    <div className="legal-page">
      <GlobalBackground mode="dark" />
      <Header />

      <main className="legal-wrapper" aria-labelledby="terms-of-service-title">
        <section className="legal-card">
          <div className="legal-header">
            <p className="legal-kicker">Even Dating</p>
            <h1 id="terms-of-service-title" className="legal-title">Terms of Service</h1>
            <p className="legal-subtitle">What you agree to when using Even.</p>
          </div>

          <div className="legal-body">
            <TermsOfServiceContent />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

