import Modal from '../Modal'

interface PrivacyPolicyProps {
  isOpen: boolean
  onClose: () => void
}

export default function PrivacyPolicy({ isOpen, onClose }: PrivacyPolicyProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
      <div>
        <p>
          <strong>Last Updated: December 2025</strong>
        </p>

        <p>
          This policy explains what information Even collects, how we use it, and the rights you have
          regarding your data.
        </p>

        <h3>1. Information We Collect</h3>
        <p>We collect:</p>
        <ul>
          <li>Account details: name, birthday, gender, preferences, phone number</li>
          <li>Photos and profile content you upload</li>
          <li>Approximate and precise location (if granted)</li>
          <li>Activity data: swipes, matches, session logs, device info</li>
          <li>Communication metadata (not message content except in abuse reports)</li>
        </ul>

        <h3>2. How We Use Your Data</h3>
        <p>We use your information to:</p>
        <ul>
          <li>Create and personalize your profile</li>
          <li>Display you in search results to nearby users</li>
          <li>Show potential matches based on your preferences</li>
          <li>Maintain safety and detect harmful behavior</li>
          <li>Improve app performance and user experience</li>
        </ul>

        <h3>3. Profile Visibility</h3>
        <p>By using Even, you understand that:</p>
        <ul>
          <li>Your profile may appear to users nearby</li>
          <li>Your photos, age, interests, and bio may be visible to others</li>
          <li>Your approximate distance from users may be shown</li>
        </ul>

        <h3>4. Location Data</h3>
        <p>
          Location is required for core functionality. We use it to:
        </p>
        <ul>
          <li>Show nearby profiles</li>
          <li>Prevent fraudulent or inaccurate discovery</li>
        </ul>
        <p>
          If location permission is revoked, the service may not function.
        </p>

        <h3>5. Data Sharing</h3>
        <p>We may share data with:</p>
        <ul>
          <li>Service partners (hosting, analytics, image processing)</li>
          <li>Moderation or safety utilities</li>
          <li>Law enforcement where required by law</li>
        </ul>
        <p>
          <strong>We do NOT sell your personal information.</strong>
        </p>

        <h3>6. Data Retention</h3>
        <p>
          We keep your data as long as your account remains active. You may request deletion at any
          time. Some metadata may be retained for fraud prevention.
        </p>

        <h3>7. Security</h3>
        <p>
          We use industry-standard security measures, but no system is perfectly secure. You use the
          service at your own risk.
        </p>

        <h3>8. Your Rights</h3>
        <p>You may request:</p>
        <ul>
          <li>Access to your stored information</li>
          <li>Correction of inaccurate data</li>
          <li>Permanent deletion of your account and associated content</li>
        </ul>

        <h3>9. Contact</h3>
        <p>
          If you have questions about this Privacy Policy, please contact us at:{' '}
          <a href="mailto:support@evendating.us">support@evendating.us</a>
        </p>
      </div>
    </Modal>
  )
}

