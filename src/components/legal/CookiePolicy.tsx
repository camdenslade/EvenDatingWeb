import Modal from '../Modal'

interface CookiePolicyProps {
  isOpen: boolean
  onClose: () => void
}

export default function CookiePolicy({ isOpen, onClose }: CookiePolicyProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cookies Policy">
      <div>
        <p>
          <strong>Last Updated: January 2026</strong>
        </p>

        <p>
          Even uses cookies and similar technologies to operate the app, provide security, and
          improve user experience.
        </p>

        <h3>1. What Cookies Do</h3>
        <p>Cookies help us:</p>
        <ul>
          <li>Keep you signed in</li>
          <li>Secure your account</li>
          <li>Remember preferences</li>
          <li>Analyze performance and crashes</li>
        </ul>

        <h3>2. Third-Party Cookies</h3>
        <p>
          Even Dating LLC may use analytics and monitoring services that set their own cookies or identifiers.
          Analytics is disabled by default and only enabled if you consent. These providers do not
          receive message content or sensitive personal data.
        </p>

        <h3>3. Disabling Cookies</h3>
        <p>
          You may disable cookies in your device settings. Core features may stop working if you do.
        </p>

        <h3>4. Contact</h3>
        <p>
          If you have questions about this Cookies Policy, please contact us at:{' '}
          <a href="mailto:support@evendating.us">support@evendating.us</a>
        </p>
      </div>
    </Modal>
  )
}

