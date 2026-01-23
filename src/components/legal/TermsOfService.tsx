import Modal from '../Modal'

interface TermsOfServiceProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsOfServiceContent() {
  return (
    <div className="legal-article">
      <p>
        <strong>Last Updated: January 2026</strong>
      </p>

      <p>
        Welcome to Even Dating ("Even", "we", "us", "our"). By creating an account or using the app,
        you agree to these Terms of Service.
      </p>

      <h3>1. Eligibility</h3>
      <p>
        You must be at least 18 years old to use Even. By creating an account you confirm that all
        information you provide is accurate and that you are legally able to enter this agreement.
      </p>

      <h3>2. Account Responsibilities</h3>
      <p>
        You are responsible for maintaining the confidentiality of your login credentials. You agree
        not to create multiple accounts, impersonate others, or share your account with anyone.
      </p>

      <h3>3. Public Profile & Searchability</h3>
      <p>By creating an account, you understand and agree that:</p>
      <ul>
        <li>Your profile, photos, and bio may be visible to other users.</li>
        <li>Your profile may appear in search results for nearby users.</li>
        <li>Your approximate location influences who can discover your profile.</li>
        <li>Sensitive attributes are optional; when provided they are used only for your stated matching/filters and not for discriminatory purposes beyond your choices.</li>
      </ul>
      <p>
        We do not guarantee exposure, matches, or results based on your profile.
      </p>

      <h3>4. User Content</h3>
      <p>
        By uploading content (photos, bio, etc.), you grant Even a non-exclusive, worldwide,
        royalty-free license to display that content inside the app. You retain ownership of your
        content and may delete it at any time.
      </p>

      <h3>5. Interactions & Safety</h3>
      <p>
        Even Dating LLC does not conduct criminal background checks. You are solely responsible for your
        interactions with other users. Exercise caution when meeting people in person.
      </p>

      <h3>6. Prohibited Conduct</h3>
      <p>You agree not to:</p>
      <ul>
        <li>Harass, threaten, or abuse other users</li>
        <li>Upload explicit, illegal, hateful, or harmful content</li>
        <li>Attempt to reverse-engineer, scrape, or misuse Even Dating LLC's data</li>
        <li>Use the service for advertising, solicitation, or commercial gain</li>
        <li>Engage in discriminatory targeting or use profile filters in a way that violates applicable anti-discrimination laws</li>
      </ul>

      <h3>7. Payments & Refund Policy</h3>
      <p>
        All purchases, subscriptions, boosts, or premium features are <strong>final and non-refundable</strong>,
        except where required by applicable law.
      </p>
      <p>
        Refund requests submitted to support will be declined unless legally mandated.
      </p>
      <p>Receipt data may be retained to meet app store and compliance requirements; entitlements may be revoked upon confirmed refunds/chargebacks.</p>

      <h3>8. No Guarantee of Results</h3>
      <p>Even Dating LLC does not guarantee:</p>
      <ul>
        <li>You will receive matches</li>
        <li>Other users will respond</li>
        <li>The continuity, safety, or accuracy of user profiles</li>
        <li>That the service will always be available or error-free</li>
      </ul>

      <h3>9. Suspension & Termination</h3>
      <p>
        We reserve the right to suspend or terminate your account at any time for violating these Terms or for any
        behavior that harms user safety or the platform.
      </p>

      <h3>10. Disclaimer of Warranties</h3>
      <p>Even Dating is provided "as-is." We make no warranties of any kind regarding:</p>
      <ul>
        <li>Match quality</li>
        <li>User authenticity</li>
        <li>Service reliability or uptime</li>
      </ul>

      <h3>11. Limitation of Liability</h3>
      <p>
        Even Dating LLC is not liable for indirect, incidental, or consequential damages, including emotional
        distress, financial loss, or harm resulting from interactions with other users.
      </p>

      <h3>12. Updates to These Terms</h3>
      <p>
        We may update these Terms at any time. Continued use constitutes acceptance.
      </p>

      <h3>Audit Logging</h3>
      <p>
        For safety and compliance, certain actions may be written to immutable, write-once storage. These records are not modified or deleted except as required by law.
      </p>

      <h3>13. Contact</h3>
      <p>
        If you have questions about these Terms of Service, please contact us at:{' '}
        <a href="mailto:support@evendating.us">support@evendating.us</a>
      </p>
    </div>
  )
}

export default function TermsOfService({ isOpen, onClose }: TermsOfServiceProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terms of Service">
      <TermsOfServiceContent />
    </Modal>
  )
}
